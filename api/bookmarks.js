import { z } from 'zod';
import { createRouteHandler, parseInput } from './_lib/http.js';
import { getDatabase } from './_lib/mongo.js';

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
      const filter = { clientId: input.clientId };
      if (input.formulaId) filter.formulaId = input.formulaId;

      const collection = (await getDatabase()).collection('bookmarks');
      const bookmarks = await collection
        .find(filter, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray();
      return res.status(200).json({ bookmarks });
    }

    if (req.method === 'POST') {
      const filter = { clientId: input.clientId, formulaId: input.formulaId };
      const collection = (await getDatabase()).collection('bookmarks');
      let upserted = false;
      try {
        const result = await collection.updateOne(
          filter,
          {
            $setOnInsert: {
              ...filter,
              createdAt: new Date(),
            },
          },
          { upsert: true },
        );
        upserted = result.upsertedCount === 1;
      } catch (error) {
        if (error.code !== 11000) throw error;
      }

      const bookmark = await collection.findOne(filter, { projection: { _id: 0 } });
      return res.status(upserted ? 201 : 200).json({ bookmark });
    }

    const collection = (await getDatabase()).collection('bookmarks');
    const result = await collection.deleteOne({
      clientId: input.clientId,
      formulaId: input.formulaId,
    });
    return res.status(200).json({ deleted: result.deletedCount === 1 });
  },
});
