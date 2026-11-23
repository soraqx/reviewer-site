import { z } from 'zod';
import { createRouteHandler, parseInput } from './_lib/http.js';
import { getDatabase } from './_lib/mongo.js';

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
      const filter = { clientId: input.clientId };
      if (input.problemId) filter.problemId = input.problemId;

      const collection = (await getDatabase()).collection('progress');
      const progress = await collection
        .find(filter, { projection: { _id: 0 } })
        .sort({ updatedAt: -1 })
        .limit(500)
        .toArray();
      return res.status(200).json({ progress });
    }

    const collection = (await getDatabase()).collection('progress');
    const filter = { clientId: input.clientId, problemId: input.problemId };
    const now = new Date();
    const update = {
      $setOnInsert: {
        clientId: body.clientId,
        problemId: body.problemId,
      },
      $set: { updatedAt: now },
      $inc: { attempts: 1 },
    };

    if (input.solved) {
      update.$set.solved = true;
    } else {
      update.$setOnInsert.solved = false;
    }
    if (input.bestTimeMs !== undefined) {
      update.$min = { bestTimeMs: input.bestTimeMs };
    }

    await collection.updateOne(filter, update, { upsert: true });
    const progress = await collection.findOne(filter, { projection: { _id: 0 } });
    return res.status(200).json({ progress });
  },
});
