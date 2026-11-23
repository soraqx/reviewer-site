import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import bookmarks from '../api/bookmarks.js';
import feedback from '../api/feedback.js';
import progress from '../api/progress.js';

const variableNames = [
  'NODE_ENV',
  'PRODUCTION_ORIGIN',
  'RATE_LIMIT_SECRET',
  'MONGODB_URI',
];
const previousVariables = new Map(
  variableNames.map((name) => [name, process.env[name]]),
);
const allowedOrigin = 'https://study.example';

function configureProduction() {
  process.env.NODE_ENV = 'production';
  process.env.PRODUCTION_ORIGIN = allowedOrigin;
  delete process.env.RATE_LIMIT_SECRET;
  delete process.env.MONGODB_URI;
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

test('answers preflight requests without connecting to MongoDB', async () => {
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
