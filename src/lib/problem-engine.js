import { convertUnits, validateUnit } from './units.js';

const answerOperations = Object.freeze({
  'euclidean-distance-2d': (givens, [x1, y1, x2, y2]) => {
    if (![x1, y1, x2, y2].every((key) => Object.hasOwn(givens, key))) {
      throw new RangeError('Euclidean distance requires two coordinate pairs.');
    }
    return Math.hypot(givens[x2] - givens[x1], givens[y2] - givens[y1]);
  },
});

function chooseRangeValue({ min, max, step }, random) {
  const count = Math.floor((max - min) / step + 1e-10) + 1;
  const index = Math.min(count - 1, Math.floor(random() * count));
  const value = min + index * step;
  return Number(value.toPrecision(12));
}

function constraintsPass(constraints, givens) {
  return constraints.every((constraint) => {
    if (constraint === 'points-distinct') {
      return givens.x1 !== givens.x2 || givens.y1 !== givens.y2;
    }
    throw new RangeError(`Unsupported problem constraint: ${constraint}`);
  });
}

export function formatTemplate(template, values) {
  return template.replace(/\{\{([a-z][a-z0-9_]*)\}\}/gi, (_match, key) => {
    if (!Object.hasOwn(values, key)) {
      throw new RangeError(`Missing value for problem template token "${key}"`);
    }
    return String(values[key]);
  });
}

export function createProblemInstance(template, random = Math.random) {
  const operation = answerOperations[template.answer.operation];
  if (!operation) {
    throw new RangeError(`Unsupported answer operation: ${template.answer.operation}`);
  }

  let givens;
  let attempts = 0;
  do {
    givens = Object.fromEntries(
      template.givens.map((given) => [
        given.key,
        chooseRangeValue(given.range, random),
      ]),
    );
    attempts += 1;
    if (attempts > 100) {
      throw new RangeError('Could not generate givens that satisfy the problem constraints.');
    }
  } while (!constraintsPass(template.constraints, givens));

  const dx = givens.x2 - givens.x1;
  const dy = givens.y2 - givens.y1;
  const exactAnswer = operation(givens, template.answer.arguments);
  const factor = 10 ** template.answer.precision;
  const values = {
    ...givens,
    dx,
    dy,
    sumSquares: dx ** 2 + dy ** 2,
    exactAnswer,
    roundedAnswer: (Math.round(exactAnswer * factor) / factor).toFixed(
      template.answer.precision,
    ),
  };

  return { template, givens, values, exactAnswer };
}

export function checkProblemAnswer(instance, rawValue, unit) {
  if (typeof rawValue !== 'string' || rawValue.trim() === '') {
    return { correct: false, message: 'Enter a numeric answer.' };
  }
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    return { correct: false, message: 'Enter a finite numeric answer.' };
  }

  const { answer } = instance.template;
  const unitResult = validateUnit(unit, answer.dimension);
  if (!unitResult.valid) {
    return { correct: false, message: unitResult.message };
  }

  const convertedAnswer = convertUnits(
    instance.exactAnswer,
    answer.displayUnit,
    answer.toleranceUnit,
  );
  const convertedInput = convertUnits(value, unit, answer.toleranceUnit);
  if (!convertedAnswer.valid || !convertedInput.valid) {
    return {
      correct: false,
      message: 'Those units cannot be compared. Check the unit and try again.',
    };
  }

  const correct = Math.abs(convertedInput.value - convertedAnswer.value) <= answer.tolerance;
  return correct
    ? { correct: true, message: 'Correct. Your value and unit are within the stated tolerance.' }
    : { correct: false, message: 'Not quite. Check your coordinate differences and units, then try again.' };
}

export class ProblemSession {
  constructor(template, random = Math.random) {
    this.template = template;
    this.random = random;
    this.reset();
  }

  reset() {
    this.instance = createProblemInstance(this.template, this.random);
    this.revealedStepCount = Math.min(1, this.template.steps.length);
    this.revealedHintCount = 0;
  }

  revealNextStep() {
    this.revealedStepCount = Math.min(
      this.template.steps.length,
      this.revealedStepCount + 1,
    );
    return this.revealedStepCount;
  }

  revealSolution() {
    this.revealedStepCount = this.template.steps.length;
  }

  revealNextHint() {
    this.revealedHintCount = Math.min(
      this.template.hints.length,
      this.revealedHintCount + 1,
    );
    return this.revealedHintCount;
  }

  checkAnswer(value, unit) {
    return checkProblemAnswer(this.instance, value, unit);
  }
}
