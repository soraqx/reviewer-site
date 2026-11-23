import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import bookmarks from '../api/bookmarks.js';
import feedback from '../api/feedback.js';
import progress from '../api/progress.js';

const variableNames = [
  'NODE_ENV',
  'PRODUCTION_ORIGIN',
  'RATE_LIMIT_SECRET',
  'CONVEX_SITE_URL',
  'CONVEX_API_SECRET',
];
const previousVariables = new Map(
  variableNames.map((name) => [name, process.env[name]]),
);
const allowedOrigin = 'https://study.example';

function configureProduction() {
  process.env.NODE_ENV = 'production';
  process.env.PRODUCTION_ORIGIN = allowedOrigin;
  delete process.env.RATE_LIMIT_SECRET;
  delete process.env.CONVEX_SITE_URL;
  delete process.env.CONVEX_API_SECRET;
}

function configureConvex() {
  process.env.CONVEX_SITE_URL = 'https://engineering-math.convex.site';
  process.env.CONVEX_API_SECRET = 'convex-gateway-secret-'.padEnd(32, 'x');
  process.env.RATE_LIMIT_SECRET = 'rate-limit-secret-'.padEnd(32, 'x');
}

function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

async function invoke(handler, { method, origin = allowedOrigin, query = {}, body } = {}) {
  const res = createResponse();
  await handler(
    { method, headers: origin ? { origin } : {}, query, body },
    res,
  );
  return res;
}

afterEach(() => {
  for (const [name, value] of previousVariables) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

test('rejects invalid progress, bookmark, and feedback input before storage', async () => {
  configureProduction();

  const invalidProgress = await invoke(progress, {
    method: 'POST',
    body: { clientId: 'not-a-uuid', problemId: 'coordinate-distance', solved: true },
  });
  assert.equal(invalidProgress.statusCode, 400);

  const invalidBookmark = await invoke(bookmarks, {
    method: 'DELETE',
    query: { clientId: '11111111-1111-4111-8111-111111111111' },
  });
  assert.equal(invalidBookmark.statusCode, 400);

  const invalidFeedback = await invoke(feedback, {
    method: 'POST',
    body: { problemId: 'coordinate-distance', lessonId: 'poly-01', message: 'Ambiguous target' },
  });
  assert.equal(invalidFeedback.statusCode, 400);
});

test('rejects origins outside the production origin', async () => {
  configureProduction();
  const res = await invoke(progress, {
    method: 'GET',
    origin: 'https://attacker.example',
    query: { clientId: '11111111-1111-4111-8111-111111111111' },
  });
  assert.equal(res.statusCode, 403);
  assert.equal(res.headers['Access-Control-Allow-Origin'], undefined);
});

test('answers preflight requests without calling Convex', async () => {
  configureProduction();
  const res = await invoke(bookmarks, { method: 'OPTIONS' });
  assert.equal(res.statusCode, 204);
  assert.equal(res.ended, true);
  assert.equal(res.headers['Access-Control-Allow-Origin'], allowedOrigin);
  assert.equal(res.headers['Access-Control-Allow-Methods'], 'GET, POST, DELETE');
});

test('requires rate-limit configuration before accepting valid writes', async () => {
  configureProduction();
  const res = await invoke(progress, {
    method: 'POST',
    body: {
      clientId: '11111111-1111-4111-8111-111111111111',
      problemId: 'coordinate-distance',
      solved: false,
    },
  });
  assert.equal(res.statusCode, 503);
  assert.match(res.body.error, /not fully configured/i);
});

test('records valid progress through the authenticated Convex gateway', async () => {
  configureProduction();
  configureConvex();
  const operations = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), 'https://engineering-math.convex.site/gateway');
    assert.equal(options.headers.Authorization, `Bearer ${process.env.CONVEX_API_SECRET}`);
    const request = JSON.parse(options.body);
    operations.push(request.operation);
    return Response.json(request.operation === 'rateLimit.check'
      ? { allowed: true, retryAfterSeconds: 60 }
      : {
        clientId: request.input.clientId,
        problemId: request.input.problemId,
        solved: request.input.solved,
        attempts: 1,
        updatedAt: new Date().toISOString(),
      });
  };

  const res = await invoke(progress, {
    method: 'POST',
    body: {
      clientId: '11111111-1111-4111-8111-111111111111',
      problemId: 'coordinate-distance',
      solved: false,
    },
  });

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.progress.attempts, 1);
  assert.deepEqual(operations, ['rateLimit.check', 'progress.record']);
});

test('stops writes when the Convex-backed rate limit is exceeded', async () => {
  configureProduction();
  configureConvex();
  const operations = [];
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    operations.push(request.operation);
    return Response.json({ allowed: false, retryAfterSeconds: 12 });
  };

  const res = await invoke(progress, {
    method: 'POST',
    body: {
      clientId: '11111111-1111-4111-8111-111111111111',
      problemId: 'coordinate-distance',
      solved: false,
    },
  });

  assert.equal(res.statusCode, 429);
  assert.equal(res.headers['Retry-After'], '12');
  assert.deepEqual(operations, ['rateLimit.check']);
});

test('preserves bookmark and feedback response contracts through Convex', async () => {
  configureProduction();
  configureConvex();
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    if (request.operation === 'bookmarks.add') {
      return Response.json({
        bookmark: {
          clientId: request.input.clientId,
          formulaId: request.input.formulaId,
          createdAt: new Date().toISOString(),
        },
        created: true,
      });
    }
    if (request.operation === 'bookmarks.remove') {
      return Response.json({ deleted: true });
    }
    if (request.operation === 'feedback.create') {
      return Response.json({ id: 'feedback-id' });
    }
    return Response.json({ allowed: true, retryAfterSeconds: 60 });
  };

  const clientId = '11111111-1111-4111-8111-111111111111';
  const added = await invoke(bookmarks, {
    method: 'POST',
    body: { clientId, formulaId: 'derivative-power-rule' },
  });
  assert.equal(added.statusCode, 201);
  assert.equal(added.body.bookmark.formulaId, 'derivative-power-rule');

  const removed = await invoke(bookmarks, {
    method: 'DELETE',
    query: { clientId, formulaId: 'derivative-power-rule' },
  });
  assert.deepEqual(removed.body, { deleted: true });

  const sent = await invoke(feedback, {
    method: 'POST',
    body: { problemId: 'coordinate-distance', message: 'A clear explanation.' },
  });
  assert.equal(sent.statusCode, 201);
  assert.deepEqual(sent.body, { id: 'feedback-id' });
});
