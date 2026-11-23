import { z } from 'zod';
import { callConvex } from './_lib/convex.js';
import { createRouteHandler, parseInput } from './_lib/http.js';

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80);
const bodySchema = z.object({
  problemId: slugSchema.optional(),
  lessonId: slugSchema.optional(),
  message: z.string().trim().min(1).max(1000),
}).strict().superRefine((body, context) => {
  if (Boolean(body.problemId) === Boolean(body.lessonId)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide exactly one of problemId or lessonId.',
      path: ['problemId'],
    });
  }
});

export default createRouteHandler({
  methods: ['POST'],
  rateLimit: { route: 'feedback', limit: 8 },
  validate(req) {
    return parseInput(bodySchema, req.body);
  },
  async handler(req, res, body) {
    const result = await callConvex('feedback.create', body);
    return res.status(201).json(result);
  },
});
