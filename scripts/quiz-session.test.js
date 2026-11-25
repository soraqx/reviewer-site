import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import course from '../src/data/course.generated.json' with { type: 'json' };
import { formulaQuestions } from '../src/data/quiz-formulas.js';
import legacy from '../src/data/quiz-legacy.json' with { type: 'json' };
import {
  createQuizSession,
  getEligibleQuestions,
  gradeChoice,
  gradeRecall,
  questionBank,
  seedRandom,
  selectQuestions,
} from '../src/lib/quiz-session.js';

test('preserves the original bank and adds six formula prompts per verified module', () => {
  assert.equal(legacy.questions.length, 105);
  assert.equal(legacy.recall.length, 15);
  assert.equal(formulaQuestions.length, 90);
  assert.equal(questionBank.length, 210);
  assert.deepEqual(legacy.moduleIds, [
    'plane-figures-polygons', 'triangles', 'quadrilaterals', 'cartesian-coordinates',
    'lines', 'circles', 'parabolas', 'ellipses', 'hyperbolas', 'prisms',
    'parallelepipeds-cubes', 'cylinders', 'pyramids', 'cones', 'spheres-segments',
  ]);
  for (const module of course.modules) {
    const moduleQuestions = formulaQuestions.filter(({ moduleId }) => moduleId === module.id);
    assert.equal(moduleQuestions.length, 6, module.id);
    for (const question of moduleQuestions) {
      assert.ok(question.lessonIds.every((id) => module.lessons.some((lesson) => lesson.id === id)));
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map(({ id }) => id)).size, 4);
      assert.ok(question.options.some(({ id }) => id === question.correctOptionId));
      for (const option of question.options) {
        assert.doesNotThrow(() => katex.renderToString(option.latex, { throwOnError: true }));
      }
    }
  }
});

test('filters by category and stable module ID', () => {
  const formulas = getEligibleQuestions({
    categories: ['formula'],
    moduleIds: ['spheres-segments'],
  });
  assert.equal(formulas.length, 6);
  assert.ok(formulas.every(({ moduleId, interaction }) =>
    moduleId === 'spheres-segments' && interaction === 'single-choice'));
});

test('keeps formula correctness attached to option IDs through shuffling', () => {
  const question = formulaQuestions[0];
  const session = createQuizSession({
    questions: [question],
    mode: 'learn',
    label: 'Formula Practice',
    categories: ['formula'],
    startedAt: 12,
  }, seedRandom('stable-options'));
  const displayed = session.optionOrders[question.id];
  assert.equal(displayed.length, 4);
  assert.equal(new Set(displayed).size, 4);
  assert.equal(gradeChoice(question, question.correctOptionId), true);
  assert.equal(gradeChoice(question, displayed[0]), displayed[0] === question.correctOptionId);
});

test('mixed formula selection prefers distinct formula families before repeats', () => {
  const questions = formulaQuestions.slice(0, 3).map((question) => ({
    ...question,
    formulaFamilyId: 'same-family',
  }));
  questions[1] = { ...questions[1], formulaFamilyId: 'other-family' };
  const selected = selectQuestions(questions, 2, seedRandom('families'));
  assert.equal(selected.length, 2);
  assert.equal(new Set(selected.map(({ formulaFamilyId }) => formulaFamilyId)).size, 2);
});

test('vocabulary accepts curated aliases exactly, but not formula-like text', () => {
  const question = legacy.recall.find(({ id }) => id === 'r1');
  assert.equal(gradeRecall(question, 'orthocentre').correct, true);
  assert.equal(gradeRecall(question, 'the orthocenter').correct, true);
  assert.equal(gradeRecall(question, 'center').correct, false);
  assert.equal(gradeRecall(question, 'x^2 = 4p').correct, false);
});
