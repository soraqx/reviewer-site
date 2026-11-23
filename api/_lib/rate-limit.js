import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { callConvex } from './convex.js';

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
  return callConvex('rateLimit.check', {
    route,
    ipHash,
    windowStart,
    now,
    limit,
  });
}
