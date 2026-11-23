import { applyCors } from './cors.js';
import { enforceRateLimit } from './rate-limit.js';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function createRouteHandler({ methods, rateLimit, validate, handler }) {
  return async function routeHandler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    try {
      if (!applyCors(req, res, methods)) return;
      if (req.method === 'OPTIONS') return res.status(204).end();

      if (!methods.includes(req.method)) {
        res.setHeader('Allow', [...methods, 'OPTIONS'].join(', '));
        return res.status(405).json({ error: 'Method not allowed.' });
      }

      const input = validate ? validate(req) : undefined;
      if (rateLimit && req.method === 'POST') {
        const result = await enforceRateLimit(req, rateLimit);
        if (!result.allowed) {
          res.setHeader('Retry-After', String(result.retryAfterSeconds));
          return res.status(429).json({ error: 'Too many requests. Try again shortly.' });
        }
      }

      return await handler(req, res, input);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.status).json({ error: error.message });
      }

      if (error.name === 'ConfigurationError') {
        return res.status(503).json({ error: 'The API is not fully configured.' });
      }

      console.error('API request failed.', {
        name: error.name,
        code: error.code,
      });
      return res.status(500).json({ error: 'The request could not be completed.' });
    }
  };
}

export function parseInput(schema, input) {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ApiError(400, 'Request data is invalid.');
  }
  return result.data;
}
