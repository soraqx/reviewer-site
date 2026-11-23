import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  addBookmark,
  getClientId,
  listBookmarks,
  listProgress,
  recordProgress,
  removeBookmark,
} from '../src/lib/api-client.js';

const originalWindow = globalThis.window;
const originalFetch = globalThis.fetch;

function installBrowserMocks() {
  const values = new Map();
  globalThis.window = {
    localStorage: {
      getItem(key) {
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        values.set(key, value);
      },
    },
    location: { origin: 'https://fieldnotes.test' },
    setTimeout,
    clearTimeout,
  };
  return values;
}

afterEach(() => {
  if (originalWindow === undefined) delete globalThis.window;
  else globalThis.window = originalWindow;
  if (originalFetch === undefined) delete globalThis.fetch;
  else globalThis.fetch = originalFetch;
});

test('keeps one anonymous client id in local storage', () => {
  installBrowserMocks();
  const first = getClientId();
  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  assert.equal(getClientId(), first);
});

test('stores offline attempts locally and syncs them when the API returns', async () => {
  installBrowserMocks();
  globalThis.fetch = async () => {
    throw new TypeError('offline');
  };

  const offline = await recordProgress({
    problemId: 'coordinate-distance',
    solved: false,
  });
  assert.equal(offline.offline, true);
  assert.equal(offline.progress.attempts, 1);
  assert.equal(offline.locallyStored, true);

  const requests = [];
  globalThis.fetch = async (url, options) => {
    const requestUrl = new URL(url);
    requests.push({ path: requestUrl.pathname, method: options.method });
    if (options.method === 'POST') {
      return Response.json({
        progress: {
          problemId: 'coordinate-distance',
          attempts: 1,
          solved: false,
          updatedAt: new Date().toISOString(),
        },
      });
    }
    return Response.json({
      progress: [{
        problemId: 'coordinate-distance',
        attempts: 1,
        solved: false,
        updatedAt: new Date().toISOString(),
      }],
    });
  };

  const online = await listProgress();
  assert.equal(online.offline, false);
  assert.equal(online.progress[0].attempts, 1);
  assert.deepEqual(requests.map(({ method }) => method), ['POST', 'GET']);
});

test('syncs bookmarks created offline before listing server bookmarks', async () => {
  installBrowserMocks();
  globalThis.fetch = async () => {
    throw new TypeError('offline');
  };

  const added = await addBookmark('derivative-power-rule');
  assert.equal(added.offline, true);
  assert.equal(added.locallyStored, true);

  const requests = [];
  globalThis.fetch = async (url, options) => {
    const requestUrl = new URL(url);
    requests.push({ path: requestUrl.pathname, method: options.method });
    if (options.method === 'POST') {
      return Response.json({
        bookmark: {
          formulaId: 'derivative-power-rule',
          createdAt: new Date().toISOString(),
        },
      });
    }
    return Response.json({
      bookmarks: [{
        formulaId: 'derivative-power-rule',
        createdAt: new Date().toISOString(),
      }],
    });
  };

  const listed = await listBookmarks();
  assert.equal(listed.offline, false);
  assert.deepEqual(listed.bookmarks.map(({ formulaId }) => formulaId), ['derivative-power-rule']);
  assert.deepEqual(requests.map(({ method }) => method), ['POST', 'GET']);
});

test('syncs bookmark removals queued while offline', async () => {
  installBrowserMocks();
  globalThis.fetch = async () => {
    throw new TypeError('offline');
  };

  await addBookmark('derivative-power-rule');
  await removeBookmark('derivative-power-rule');

  const requests = [];
  globalThis.fetch = async (url, options) => {
    requests.push(options.method);
    if (options.method === 'GET') return Response.json({ bookmarks: [] });
    return Response.json(options.method === 'DELETE' ? { deleted: true } : {});
  };

  const listed = await listBookmarks();
  assert.deepEqual(listed.bookmarks, []);
  assert.deepEqual(requests, ['DELETE', 'GET']);
});
