import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { getDatabase } from './mongo.js';

const WINDOW_MS = 60_000;

function requestIp(req) {
  const realIp = req.headers['x-real-ip'];
  const forwarded = req.headers['x-forwarded-for'];
  const source = typeof realIp === 'string'
    ? realIp
    : typeof forwarded === 'string'
      ? forwarded.split(',')[0]
      : '';
  const candidate = source.trim();
  return isIP(candidate) ? candidate : 'unknown';
}

async function incrementBucket(collection, key, expiresAt) {
  try {
    return await collection.findOneAndUpdate(
      { _id: key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
      { upsert: true, returnDocument: 'after', projection: { count: 1 } },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    return collection.findOneAndUpdate(
      { _id: key },
      { $inc: { count: 1 } },
      { returnDocument: 'after', projection: { count: 1 } },
    );
  }
}

export async function enforceRateLimit(req, { route, limit }) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    const error = new Error('RATE_LIMIT_SECRET is not configured or is too short.');
    error.name = 'ConfigurationError';
    throw error;
  }

  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const ipHash = createHmac('sha256', secret)
    .update(requestIp(req))
    .digest('hex');
  const key = `${route}:${ipHash}:${windowStart}`;
  const expiresAt = new Date(windowStart + 2 * WINDOW_MS);
  const database = await getDatabase();
  const bucket = await incrementBucket(
    database.collection('rateLimits'),
    key,
    expiresAt,
  );
  const count = bucket?.count;

  if (!Number.isInteger(count)) {
    throw new Error('Rate-limit counter could not be read.');
  }

  return {
    allowed: count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000)),
  };
}
