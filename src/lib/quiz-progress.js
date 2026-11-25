export const QUIZ_PROGRESS_KEY = 'fieldnotes.quiz.v2';
export const LEGACY_PROGRESS_KEY = 'geodive-v1';
export const ACTIVE_SESSION_KEY = 'fieldnotes.quiz.active.v2';

function emptyProgress() {
  return {
    version: 2,
    items: {},
    history: [],
    migrations: {},
  };
}

function getLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function normalizeLegacyProgress(legacy) {
  const migrated = emptyProgress();
  migrated.migrations.geodiveV1 = legacy ? 'imported' : 'not-found';
  if (!legacy || typeof legacy !== 'object') return migrated;

  for (const [id, record] of Object.entries(legacy.items ?? {})) {
    const attempts = Number(record?.attempts);
    const correct = Number(record?.correct);
    if (
      !/^(?:q\d+-\d+|r\d+)$/.test(id)
      || !Number.isInteger(attempts)
      || attempts < 0
      || !Number.isInteger(correct)
      || correct < 0
      || correct > attempts
    ) {
      continue;
    }
    migrated.items[id] = {
      attempts,
      correct,
      everCorrect: correct > 0,
    };
  }

  if (Array.isArray(legacy.history)) {
    migrated.history = legacy.history.filter((record) =>
      record
      && typeof record === 'object'
      && typeof record.day === 'string'
      && Number.isFinite(record.score)
      && Number.isFinite(record.correct)
      && Number.isFinite(record.total),
    );
  }
  return migrated;
}

function isProgressRecord(value) {
  return value
    && typeof value === 'object'
    && value.version === 2
    && value.items
    && typeof value.items === 'object'
    && !Array.isArray(value.items)
    && Array.isArray(value.history)
    && value.migrations
    && typeof value.migrations === 'object';
}

export function loadQuizProgress(storage = getLocalStorage()) {
  if (!storage) {
    return {
      data: emptyProgress(),
      available: false,
      message: 'Browser storage is unavailable. Quiz progress will not persist between visits.',
    };
  }

  let saved;
  try {
    saved = storage.getItem(QUIZ_PROGRESS_KEY);
  } catch {
    return {
      data: emptyProgress(),
      available: false,
      message: 'Quiz progress could not be read from browser storage.',
    };
  }

  if (saved !== null) {
    try {
      const parsed = JSON.parse(saved);
      if (!isProgressRecord(parsed)) throw new Error('Saved quiz progress has an unsupported format.');
      return { data: parsed, available: true, message: '' };
    } catch (error) {
      return {
        data: emptyProgress(),
        available: false,
        message: `Saved quiz progress was left untouched: ${error.message}`,
      };
    }
  }

  let legacy = null;
  try {
    const oldData = storage.getItem(LEGACY_PROGRESS_KEY);
    if (oldData !== null) {
      const parsed = JSON.parse(oldData);
      if (parsed && typeof parsed === 'object' && parsed.items && Array.isArray(parsed.history)) {
        legacy = parsed;
      }
    }
  } catch {
    return {
      data: emptyProgress(),
      available: false,
      message: 'The previous quiz progress could not be read; the original data was left untouched.',
    };
  }

  const data = normalizeLegacyProgress(legacy);
  try {
    storage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(data));
    return {
      data,
      available: true,
      message: legacy
        ? 'Imported your previous GeoDive attempts and history. Original data was preserved.'
        : '',
    };
  } catch {
    return {
      data,
      available: false,
      message: 'Quiz progress is loaded for this visit, but browser storage could not save the migration.',
    };
  }
}

export function saveQuizProgress(data, storage = getLocalStorage()) {
  if (!storage) {
    return { saved: false, message: 'Browser storage is unavailable; this progress is only in memory.' };
  }
  try {
    storage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(data));
    return { saved: true, message: 'Progress saved on this device.' };
  } catch {
    return { saved: false, message: 'Progress could not be saved in browser storage.' };
  }
}

export function updateQuestionProgress(data, questionId, correct) {
  const previous = data.items[questionId] ?? { attempts: 0, correct: 0, everCorrect: false };
  const next = {
    attempts: previous.attempts + 1,
    correct: previous.correct + Number(correct),
    everCorrect: previous.everCorrect || correct,
  };
  return {
    ...data,
    items: { ...data.items, [questionId]: next },
  };
}

export function clearQuizProgress(data) {
  return {
    ...emptyProgress(),
    migrations: data.migrations,
  };
}
