import { z } from 'zod';
import { callConvex } from './_lib/convex.js';
import { createRouteHandler, parseInput } from './_lib/http.js';

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const querySchema = z.object({
  clientId: z.string().uuid(),
  formulaId: slugSchema.optional(),
}).strict();
const deleteQuerySchema = z.object({
  clientId: z.string().uuid(),
  formulaId: slugSchema,
}).strict();
const bodySchema = z.object({
  clientId: z.string().uuid(),
  formulaId: slugSchema,
}).strict();

export default createRouteHandler({
  methods: ['GET', 'POST', 'DELETE'],
  rateLimit: { route: 'bookmarks', limit: 30 },
  validate(req) {
    if (req.method === 'GET') return parseInput(querySchema, req.query);
    if (req.method === 'POST') return parseInput(bodySchema, req.body);
    return parseInput(deleteQuerySchema, req.query);
  },
  async handler(req, res, input) {
    if (req.method === 'GET') {
      const bookmarks = await callConvex('bookmarks.list', input);
      return res.status(200).json({ bookmarks });
    }

    if (req.method === 'POST') {
      const result = await callConvex('bookmarks.add', input);
      return res.status(result.created ? 201 : 200).json({
        bookmark: result.bookmark,
      });
    }

    const result = await callConvex('bookmarks.remove', input);
    return res.status(200).json(result);
  },
});
