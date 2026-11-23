import { httpActionGeneric, httpRouter } from 'convex/server';
import { internal } from './_generated/api.js';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  });
}

function equalSecret(actual, expected) {
  if (actual.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < actual.length; index += 1) {
    difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
}

const gateway = httpActionGeneric(async (ctx, request) => {
  const secret = process.env.CONVEX_API_SECRET;
  if (!secret || new TextEncoder().encode(secret).length < 32) {
    return jsonResponse({ error: 'The backend is not fully configured.' }, 503);
  }

  const authorization = request.headers.get('authorization') ?? '';
  if (!equalSecret(authorization, `Bearer ${secret}`)) {
    return jsonResponse({ error: 'Unauthorized.' }, 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Request data is invalid.' }, 400);
  }
  if (!body || typeof body !== 'object' || typeof body.operation !== 'string') {
    return jsonResponse({ error: 'Request data is invalid.' }, 400);
  }

  try {
    let result;
    switch (body.operation) {
      case 'rateLimit.check':
        result = await ctx.runMutation(
          internal.backend.checkRateLimit,
          body.input,
        );
        break;
      case 'progress.list':
        result = await ctx.runQuery(internal.backend.listProgress, body.input);
        break;
      case 'progress.record':
        result = await ctx.runMutation(
          internal.backend.recordProgress,
          body.input,
        );
        break;
      case 'bookmarks.list':
        result = await ctx.runQuery(internal.backend.listBookmarks, body.input);
        break;
      case 'bookmarks.add':
        result = await ctx.runMutation(internal.backend.addBookmark, body.input);
        break;
      case 'bookmarks.remove':
        result = await ctx.runMutation(
          internal.backend.removeBookmark,
          body.input,
        );
        break;
      case 'feedback.create':
        result = await ctx.runMutation(
          internal.backend.createFeedback,
          body.input,
        );
        break;
      default:
        return jsonResponse({ error: 'Unknown backend operation.' }, 400);
    }
    return jsonResponse(result);
  } catch (error) {
    console.error('Convex gateway operation failed.', {
      operation: body.operation,
      name: error.name,
    });
    return jsonResponse({ error: 'The backend could not complete the request.' }, 500);
  }
});

const http = httpRouter();
http.route({
  path: '/gateway',
  method: 'POST',
  handler: gateway,
});

export default http;
