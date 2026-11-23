import {
  internalMutationGeneric,
  internalQueryGeneric,
} from 'convex/server';
import { v } from 'convex/values';
import { internal } from './_generated/api.js';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WINDOW_MS = 60_000;

function assertClientId(clientId) {
  if (!uuidPattern.test(clientId)) throw new Error('Invalid client ID.');
}

function assertSlug(value) {
  if (!slugPattern.test(value) || value.length > 80) {
    throw new Error('Invalid resource ID.');
  }
}

function toProgress(document) {
  return {
    clientId: document.clientId,
    problemId: document.problemId,
    solved: document.solved,
    attempts: document.attempts,
    updatedAt: new Date(document.updatedAt).toISOString(),
    ...(document.bestTimeMs === undefined ? {} : { bestTimeMs: document.bestTimeMs }),
  };
}

function toBookmark(document) {
  return {
    clientId: document.clientId,
    formulaId: document.formulaId,
    createdAt: new Date(document.createdAt).toISOString(),
  };
}

export const listProgress = internalQueryGeneric({
  args: {
    clientId: v.string(),
    problemId: v.optional(v.string()),
  },
  handler: async (ctx, { clientId, problemId }) => {
    assertClientId(clientId);
    if (problemId !== undefined) assertSlug(problemId);

    const records = problemId
      ? await ctx.db
        .query('progress')
        .withIndex('by_client_problem', (q) =>
          q.eq('clientId', clientId).eq('problemId', problemId))
        .take(1)
      : await ctx.db
        .query('progress')
        .withIndex('by_client_updated', (q) => q.eq('clientId', clientId))
        .order('desc')
        .take(500);
    return records.map(toProgress);
  },
});

export const recordProgress = internalMutationGeneric({
  args: {
    clientId: v.string(),
    problemId: v.string(),
    solved: v.boolean(),
    bestTimeMs: v.optional(v.number()),
  },
  handler: async (ctx, input) => {
    assertClientId(input.clientId);
    assertSlug(input.problemId);

    const existing = await ctx.db
      .query('progress')
      .withIndex('by_client_problem', (q) =>
        q.eq('clientId', input.clientId).eq('problemId', input.problemId))
      .first();
    const updatedAt = Date.now();
    const bestTimeMs = input.bestTimeMs === undefined
      ? existing?.bestTimeMs
      : Math.min(existing?.bestTimeMs ?? input.bestTimeMs, input.bestTimeMs);
    const progress = {
      clientId: input.clientId,
      problemId: input.problemId,
      solved: Boolean(existing?.solved || input.solved),
      attempts: (existing?.attempts ?? 0) + 1,
      updatedAt,
      ...(bestTimeMs === undefined ? {} : { bestTimeMs }),
    };

    if (existing) await ctx.db.patch(existing._id, progress);
    else await ctx.db.insert('progress', progress);

    return toProgress(progress);
  },
});

export const listBookmarks = internalQueryGeneric({
  args: {
    clientId: v.string(),
    formulaId: v.optional(v.string()),
  },
  handler: async (ctx, { clientId, formulaId }) => {
    assertClientId(clientId);
    if (formulaId !== undefined) assertSlug(formulaId);

    const records = formulaId
      ? await ctx.db
        .query('bookmarks')
        .withIndex('by_client_formula', (q) =>
          q.eq('clientId', clientId).eq('formulaId', formulaId))
        .take(1)
      : await ctx.db
        .query('bookmarks')
        .withIndex('by_client_created', (q) => q.eq('clientId', clientId))
        .order('desc')
        .take(500);
    return records.map(toBookmark);
  },
});

export const addBookmark = internalMutationGeneric({
  args: {
    clientId: v.string(),
    formulaId: v.string(),
  },
  handler: async (ctx, input) => {
    assertClientId(input.clientId);
    assertSlug(input.formulaId);

    const existing = await ctx.db
      .query('bookmarks')
      .withIndex('by_client_formula', (q) =>
        q.eq('clientId', input.clientId).eq('formulaId', input.formulaId))
      .first();
    if (existing) return { bookmark: toBookmark(existing), created: false };

    const bookmark = {
      ...input,
      createdAt: Date.now(),
    };
    await ctx.db.insert('bookmarks', bookmark);
    return { bookmark: toBookmark(bookmark), created: true };
  },
});

export const removeBookmark = internalMutationGeneric({
  args: {
    clientId: v.string(),
    formulaId: v.string(),
  },
  handler: async (ctx, input) => {
    assertClientId(input.clientId);
    assertSlug(input.formulaId);

    const bookmark = await ctx.db
      .query('bookmarks')
      .withIndex('by_client_formula', (q) =>
        q.eq('clientId', input.clientId).eq('formulaId', input.formulaId))
      .first();
    if (bookmark) await ctx.db.delete(bookmark._id);
    return { deleted: bookmark !== null };
  },
});

export const createFeedback = internalMutationGeneric({
  args: {
    problemId: v.optional(v.string()),
    lessonId: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, input) => {
    const hasProblem = input.problemId !== undefined;
    const hasLesson = input.lessonId !== undefined;
    if (hasProblem === hasLesson) throw new Error('Invalid feedback target.');
    if (input.problemId !== undefined) assertSlug(input.problemId);
    if (input.lessonId !== undefined) assertSlug(input.lessonId);
    if (input.message.trim().length < 1 || input.message.length > 1000) {
      throw new Error('Invalid feedback message.');
    }

    return { id: await ctx.db.insert('feedback', {
      ...input,
      message: input.message.trim(),
      createdAt: Date.now(),
    }) };
  },
});

export const checkRateLimit = internalMutationGeneric({
  args: {
    route: v.string(),
    ipHash: v.string(),
    windowStart: v.number(),
    now: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, input) => {
    const bucketKey = `${input.route}:${input.ipHash}:${input.windowStart}`;
    const existing = await ctx.db
      .query('rateLimits')
      .withIndex('by_bucket_key', (q) => q.eq('bucketKey', bucketKey))
      .first();
    const count = (existing?.count ?? 0) + 1;
    const bucket = {
      bucketKey,
      route: input.route,
      ipHash: input.ipHash,
      windowStart: input.windowStart,
      count,
      expiresAt: input.windowStart + 2 * WINDOW_MS,
    };

    if (existing) await ctx.db.patch(existing._id, bucket);
    else await ctx.db.insert('rateLimits', bucket);

    return {
      allowed: count <= input.limit,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((input.windowStart + WINDOW_MS - input.now) / 1000),
      ),
    };
  },
});

export const cleanExpiredRateLimits = internalMutationGeneric({
  args: {},
  handler: async (ctx) => {
    const expired = await ctx.db
      .query('rateLimits')
      .withIndex('by_expiry', (q) => q.lt('expiresAt', Date.now()))
      .take(100);

    for (const bucket of expired) await ctx.db.delete(bucket._id);
    if (expired.length === 100) {
      await ctx.scheduler.runAfter(0, internal.backend.cleanExpiredRateLimits, {});
    }
    return expired.length;
  },
});
