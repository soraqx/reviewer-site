import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACTIVE_SESSION_KEY,
  LEGACY_PROGRESS_KEY,
  QUIZ_PROGRESS_KEY,
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
  updateQuestionProgress,
} from '../src/lib/quiz-progress.js';

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }
}

test('imports GeoDive history once without modifying the legacy key', () => {
  const storage = new MemoryStorage();
  const oldData = {
    items: { 'q0-0': { attempts: 2, correct: 1 }, 'r0': { attempts: 1, correct: 1 } },
    history: [{ day: '2026-11-25', score: 700, correct: 5, total: 7 }],
  };
  storage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify(oldData));

  const first = loadQuizProgress(storage);
  assert.equal(first.available, true);
  assert.equal(first.data.items['q0-0'].everCorrect, true);
  assert.equal(first.data.items['q0-0'].attempts, 2);
  assert.equal(first.data.history.length, 1);
  assert.match(first.message, /Imported/);
  assert.equal(storage.getItem(LEGACY_PROGRESS_KEY), JSON.stringify(oldData));

  const second = loadQuizProgress(storage);
  assert.deepEqual(second.data, first.data);
  assert.equal(second.message, '');
});

test('keeps formula progress separate and increments each submitted attempt once', () => {
  const storage = new MemoryStorage();
  const loaded = loadQuizProgress(storage);
  let updated = updateQuestionProgress(loaded.data, 'FG-SPH-01', true);
  updated = updateQuestionProgress(updated, 'FG-SPH-01', false);
  assert.deepEqual(updated.items['FG-SPH-01'], {
    attempts: 2,
    correct: 1,
    everCorrect: true,
  });
  assert.equal(Object.keys(updated.items).some((id) => /^q\d+-\d+$/.test(id)), false);
  assert.equal(saveQuizProgress(updated, storage).saved, true);
  assert.ok(storage.getItem(QUIZ_PROGRESS_KEY));
  assert.equal(ACTIVE_SESSION_KEY, 'fieldnotes.quiz.active.v2');
});

test('reset preserves the idempotent migration marker but clears quiz outcomes', () => {
  const storage = new MemoryStorage();
  storage.setItem(LEGACY_PROGRESS_KEY, JSON.stringify({ items: {}, history: [] }));
  const loaded = loadQuizProgress(storage);
  const reset = clearQuizProgress(loaded.data);
  assert.equal(reset.migrations.geodiveV1, 'imported');
  assert.deepEqual(reset.items, {});
  assert.deepEqual(reset.history, []);
});

test('reports storage failure instead of silently claiming progress was saved', () => {
  const brokenStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
  };
  const loaded = loadQuizProgress(brokenStorage);
  assert.equal(loaded.available, false);
  assert.match(loaded.message, /could not be read/i);
  assert.equal(saveQuizProgress(loaded.data, brokenStorage).saved, false);
});
