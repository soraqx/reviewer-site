import { z } from 'zod';
import { callConvex } from './_lib/convex.js';
import { createRouteHandler, parseInput } from './_lib/http.js';

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const querySchema = z.object({
  clientId: z.string().uuid(),
  problemId: slugSchema.optional(),
}).strict();
const bodySchema = z.object({
  clientId: z.string().uuid(),
  problemId: slugSchema,
  solved: z.boolean(),
  bestTimeMs: z.number().int().min(0).max(86_400_000).optional(),
}).strict().refine(
  (body) => body.bestTimeMs === undefined || body.solved,
  { message: 'A best time can only be sent for a solved attempt.' },
);

export default createRouteHandler({
  methods: ['GET', 'POST'],
  rateLimit: { route: 'progress', limit: 30 },
  validate(req) {
    return req.method === 'GET'
      ? parseInput(querySchema, req.query)
      : parseInput(bodySchema, req.body);
  },
  async handler(req, res, input) {
    if (req.method === 'GET') {
      const progress = await callConvex('progress.list', input);
      return res.status(200).json({ progress });
    }

    const progress = await callConvex('progress.record', input);
    return res.status(200).json({ progress });
  },
});
