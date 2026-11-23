const CLIENT_ID_KEY = 'fieldnotes.clientId';
const STORAGE_PREFIX = 'fieldnotes.v1';
const REQUEST_TIMEOUT_MS = 10_000;
let memoryClientId;

export class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

function getClientStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getClientId() {
  if (memoryClientId) return memoryClientId;
  const storage = getClientStorage();
  if (storage) {
    try {
      const current = storage.getItem(CLIENT_ID_KEY);
      if (current && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(current)) {
        memoryClientId = current;
        return memoryClientId;
      }

      memoryClientId = crypto.randomUUID();
      storage.setItem(CLIENT_ID_KEY, memoryClientId);
      return memoryClientId;
    } catch {
      memoryClientId = crypto.randomUUID();
      return memoryClientId;
    }
  }
  memoryClientId = crypto.randomUUID();
  return memoryClientId;
}

function readArray(key) {
  const storage = getClientStorage();
  if (!storage) return { value: [], available: false };

  try {
    const raw = storage.getItem(key);
    if (!raw) return { value: [], available: true };
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? { value, available: true }
      : { value: [], available: false };
  } catch {
    return { value: [], available: false };
  }
}

function writeArray(key, value) {
  const storage = getClientStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function keyFor(clientId, resource) {
  return `${STORAGE_PREFIX}.${clientId}.${resource}`;
}

async function request(path, { method = 'GET', query = {}, body } = {}) {
  const url = new URL(`/api/${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof TypeError || error.name === 'AbortError') {
      return { offline: true, reason: 'The service could not be reached.' };
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }

  if (response.status === 404 || response.status >= 500) {
    return { offline: true, reason: 'The service is temporarily unavailable.' };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    if (response.ok) {
      return { offline: true, reason: 'The service returned an unreadable response.' };
    }
    throw new ApiRequestError('The service rejected the request.', response.status);
  }

  if (!response.ok) {
    throw new ApiRequestError(
      typeof data.error === 'string' ? data.error : 'The service rejected the request.',
      response.status,
    );
  }
  return { offline: false, data };
}

function mergeProgress(current, incoming) {
  const byProblem = new Map(current.map((item) => [item.problemId, item]));
  byProblem.set(incoming.problemId, incoming);
  return [...byProblem.values()];
}

async function syncPendingProgress(clientId) {
  const queueKey = keyFor(clientId, 'pendingProgress');
  const queue = readArray(queueKey);

  for (let index = 0; index < queue.value.length; index += 1) {
    const synced = await request('progress', {
      method: 'POST',
      body: queue.value[index],
    });
    if (synced.offline) {
      writeArray(queueKey, queue.value.slice(index));
      return false;
    }
    if (!writeArray(queueKey, queue.value.slice(index + 1))) return false;
  }
  return true;
}

export async function listProgress() {
  const clientId = getClientId();
  const cacheKey = keyFor(clientId, 'progress');
  const syncAvailable = await syncPendingProgress(clientId);
  if (!syncAvailable) {
    const cached = readArray(cacheKey);
    return {
      progress: cached.value,
      offline: true,
      locallyStored: cached.available,
    };
  }

  const result = await request('progress', { query: { clientId } });
  const cached = readArray(cacheKey);
  if (result.offline) {
    return {
      progress: cached.value,
      offline: true,
      locallyStored: cached.available,
    };
  }

  const locallyStored = writeArray(cacheKey, result.data.progress);
  return { progress: result.data.progress, offline: false, locallyStored };
}

export async function recordProgress({ problemId, solved, bestTimeMs }) {
  const clientId = getClientId();
  const entry = {
    clientId,
    problemId,
    solved,
    ...(bestTimeMs === undefined ? {} : { bestTimeMs }),
  };
  const cacheKey = keyFor(clientId, 'progress');
  const queueKey = keyFor(clientId, 'pendingProgress');
  const canSend = await syncPendingProgress(clientId);
  const result = canSend
    ? await request('progress', { method: 'POST', body: entry })
    : { offline: true };
  if (!result.offline) {
    const cached = readArray(cacheKey);
    const locallyStored = writeArray(
      cacheKey,
      mergeProgress(cached.value, result.data.progress),
    );
    writeArray(queueKey, []);
    return { progress: result.data.progress, offline: false, locallyStored };
  }

  const cached = readArray(cacheKey);
  const current = cached.value.find((item) => item.problemId === problemId);
  const progress = {
    clientId,
    problemId,
    solved: Boolean(current?.solved || solved),
    attempts: (current?.attempts || 0) + 1,
    updatedAt: new Date().toISOString(),
    ...(bestTimeMs === undefined
      ? current?.bestTimeMs === undefined
        ? {}
        : { bestTimeMs: current.bestTimeMs }
      : { bestTimeMs: Math.min(current?.bestTimeMs ?? bestTimeMs, bestTimeMs) }),
  };
  const locallyStored = writeArray(
    cacheKey,
    mergeProgress(cached.value, progress),
  );
  const pending = readArray(queueKey);
  const queueStored = writeArray(queueKey, [...pending.value, entry]);
  return {
    progress,
    offline: true,
    locallyStored: locallyStored && queueStored,
  };
}

async function syncPendingBookmarks(clientId) {
  const additionsKey = keyFor(clientId, 'pendingBookmarkAdds');
  const deletionsKey = keyFor(clientId, 'pendingBookmarkDeletes');
  const additions = readArray(additionsKey);
  const deletions = readArray(deletionsKey);

  for (const formulaId of additions.value) {
    const synced = await request('bookmarks', {
      method: 'POST',
      body: { clientId, formulaId },
    });
    if (synced.offline) return false;
  }
  for (const formulaId of deletions.value) {
    const synced = await request('bookmarks', {
      method: 'DELETE',
      query: { clientId, formulaId },
    });
    if (synced.offline) return false;
  }

  if (additions.value.length) writeArray(additionsKey, []);
  if (deletions.value.length) writeArray(deletionsKey, []);
  return true;
}

export async function listBookmarks() {
  const clientId = getClientId();
  const cacheKey = keyFor(clientId, 'bookmarks');
  const syncAvailable = await syncPendingBookmarks(clientId);
  const result = await request('bookmarks', { query: { clientId } });
  const cached = readArray(cacheKey);
  if (result.offline) {
    return {
      bookmarks: cached.value,
      offline: true,
      locallyStored: cached.available,
    };
  }

  const additions = readArray(keyFor(clientId, 'pendingBookmarkAdds'));
  const deletions = new Set(readArray(keyFor(clientId, 'pendingBookmarkDeletes')).value);
  const bookmarks = [
    ...result.data.bookmarks.filter(({ formulaId }) => !deletions.has(formulaId)),
    ...additions.value
      .filter((formulaId) => !result.data.bookmarks.some((item) => item.formulaId === formulaId))
      .map((formulaId) => ({
        clientId,
        formulaId,
        createdAt: new Date().toISOString(),
        localOnly: true,
      })),
  ];
  const locallyStored = writeArray(cacheKey, bookmarks);
  return {
    bookmarks,
    offline: false,
    locallyStored: locallyStored && syncAvailable,
  };
}

export async function addBookmark(formulaId) {
  const clientId = getClientId();
  const cacheKey = keyFor(clientId, 'bookmarks');
  const additionsKey = keyFor(clientId, 'pendingBookmarkAdds');
  const deletionsKey = keyFor(clientId, 'pendingBookmarkDeletes');
  const result = await request('bookmarks', {
    method: 'POST',
    body: { clientId, formulaId },
  });
  const cached = readArray(cacheKey);

  if (result.offline) {
    const bookmarks = cached.value.some((item) => item.formulaId === formulaId)
      ? cached.value
      : [...cached.value, {
        clientId,
        formulaId,
        createdAt: new Date().toISOString(),
        localOnly: true,
      }];
    const additions = readArray(additionsKey).value;
    const deletions = readArray(deletionsKey).value.filter((id) => id !== formulaId);
    const locallyStored =
      writeArray(cacheKey, bookmarks) &&
      writeArray(additionsKey, [...new Set([...additions, formulaId])]) &&
      writeArray(deletionsKey, deletions);
    return { bookmark: bookmarks.find((item) => item.formulaId === formulaId), offline: true, locallyStored };
  }

  writeArray(additionsKey, readArray(additionsKey).value.filter((id) => id !== formulaId));
  writeArray(deletionsKey, readArray(deletionsKey).value.filter((id) => id !== formulaId));
  const bookmarks = [
    ...cached.value.filter((item) => item.formulaId !== formulaId),
    result.data.bookmark,
  ];
  const locallyStored = writeArray(cacheKey, bookmarks);
  return { bookmark: result.data.bookmark, offline: false, locallyStored };
}

export async function removeBookmark(formulaId) {
  const clientId = getClientId();
  const cacheKey = keyFor(clientId, 'bookmarks');
  const additionsKey = keyFor(clientId, 'pendingBookmarkAdds');
  const deletionsKey = keyFor(clientId, 'pendingBookmarkDeletes');
  const result = await request('bookmarks', {
    method: 'DELETE',
    query: { clientId, formulaId },
  });
  const cached = readArray(cacheKey);
  const bookmarks = cached.value.filter((item) => item.formulaId !== formulaId);

  if (result.offline) {
    const additions = readArray(additionsKey).value.filter((id) => id !== formulaId);
    const deletions = readArray(deletionsKey).value;
    const locallyStored =
      writeArray(cacheKey, bookmarks) &&
      writeArray(additionsKey, additions) &&
      writeArray(deletionsKey, [...new Set([...deletions, formulaId])]);
    return { offline: true, locallyStored };
  }

  writeArray(additionsKey, readArray(additionsKey).value.filter((id) => id !== formulaId));
  writeArray(deletionsKey, readArray(deletionsKey).value.filter((id) => id !== formulaId));
  const locallyStored = writeArray(cacheKey, bookmarks);
  return { offline: false, locallyStored };
}

export async function submitFeedback({ problemId, lessonId, message }) {
  const result = await request('feedback', {
    method: 'POST',
    body: { problemId, lessonId, message },
  });
  return result.offline
    ? { sent: false, offline: true }
    : { sent: true, offline: false };
}
