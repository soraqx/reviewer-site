import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  checkProblemAnswer,
  createProblemInstance,
  formatTemplate,
  ProblemSession,
} from '../src/lib/problem-engine.js';
import { convertUnits } from '../src/lib/units.js';

const source = await readFile(
  new URL('../src/data/problems/geometry.json', import.meta.url),
  'utf8',
);
const [template] = JSON.parse(source);

function sequenceRandom(values) {
  let index = 0;
  return () => values[index++ % values.length];
}

test('randomized givens honor ranges and exclude coincident points', () => {
  const instance = createProblemInstance(template, sequenceRandom([0, 0, 1, 1]));

  assert.deepEqual(instance.givens, { x1: -5, y1: -5, x2: 5, y2: 5 });
  assert.equal(instance.exactAnswer, Math.sqrt(200));
  assert.equal(instance.values.roundedAnswer, '14.14');
});

test('randomization retries coincident points before exposing a problem', () => {
  const values = [0.5, 0.5, 0.5, 0.5, 0, 0, 1, 1];
  let index = 0;
  const instance = createProblemInstance(template, () => values[index++]);

  assert.equal(index, 8);
  assert.notDeepEqual(
    [instance.givens.x1, instance.givens.y1],
    [instance.givens.x2, instance.givens.y2],
  );
});

test('answer checker accepts rounded answers and equivalent length units', () => {
  const instance = createProblemInstance(template, sequenceRandom([0, 0, 1, 1]));
  const roundedCentimeters = Number(instance.values.roundedAnswer);
  const roundedMillimeters = String(roundedCentimeters * 10);

  assert.equal(checkProblemAnswer(instance, String(roundedCentimeters), 'cm').correct, true);
  assert.equal(checkProblemAnswer(instance, roundedMillimeters, 'mm').correct, true);
});

test('answer checker rejects wrong dimensions, invalid numbers, and out-of-tolerance values', () => {
  const instance = createProblemInstance(template, sequenceRandom([0, 0, 1, 1]));

  assert.match(checkProblemAnswer(instance, '5', 's').message, /needs length/);
  assert.match(checkProblemAnswer(instance, '', 'cm').message, /numeric answer/);
  assert.equal(
    checkProblemAnswer(instance, String(instance.exactAnswer + 0.02), 'cm').correct,
    false,
  );
});

test('problem session reveals steps and hints only when requested', () => {
  const session = new ProblemSession(template, sequenceRandom([0, 0, 1, 1]));

  assert.equal(session.revealedStepCount, 1);
  assert.equal(session.revealedHintCount, 0);
  session.revealNextStep();
  session.revealNextHint();
  assert.equal(session.revealedStepCount, 2);
  assert.equal(session.revealedHintCount, 1);
  session.revealSolution();
  assert.equal(session.revealedStepCount, template.steps.length);
});

test('template interpolation rejects missing values and unit conversion uses dimensions', () => {
  assert.equal(formatTemplate('A is {{x}}.', { x: 4 }), 'A is 4.');
  assert.throws(() => formatTemplate('{{missing}}', {}), /Missing value/);
  assert.deepEqual(convertUnits(1000, 'mm', 'm'), {
    valid: true,
    value: 1,
    dimension: 'length',
  });
  assert.equal(convertUnits(1, 's', 'cm').valid, false);
});
