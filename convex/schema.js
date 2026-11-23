import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  progress: defineTable({
    clientId: v.string(),
    problemId: v.string(),
    solved: v.boolean(),
    attempts: v.number(),
    bestTimeMs: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index('by_client_problem', ['clientId', 'problemId'])
    .index('by_client_updated', ['clientId', 'updatedAt']),
  bookmarks: defineTable({
    clientId: v.string(),
    formulaId: v.string(),
    createdAt: v.number(),
  })
    .index('by_client_formula', ['clientId', 'formulaId'])
    .index('by_client_created', ['clientId', 'createdAt']),
  feedback: defineTable({
    problemId: v.optional(v.string()),
    lessonId: v.optional(v.string()),
    message: v.string(),
    createdAt: v.number(),
  }).index('by_created', ['createdAt']),
  rateLimits: defineTable({
    bucketKey: v.string(),
    route: v.string(),
    ipHash: v.string(),
    windowStart: v.number(),
    count: v.number(),
    expiresAt: v.number(),
  })
    .index('by_bucket_key', ['bucketKey'])
    .index('by_expiry', ['expiresAt']),
});
