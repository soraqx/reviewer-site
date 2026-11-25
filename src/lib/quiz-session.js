import course from '../data/course.generated.json' with { type: 'json' };
import legacy from '../data/quiz-legacy.json' with { type: 'json' };
import { formulaQuestions } from '../data/quiz-formulas.js';

export const quizModules = course.modules;
export const questionBank = [
  ...formulaQuestions,
  ...legacy.questions,
  ...legacy.recall,
];

export const questionById = new Map(
  questionBank.map((question) => [question.id, question]),
);

export function getEligibleQuestions({ categories, moduleIds = [] }) {
  const categorySet = new Set(categories);
  const moduleSet = new Set(moduleIds);
  return questionBank.filter((question) =>
    categorySet.has(question.category)
    && (!moduleSet.size || moduleSet.has(question.moduleId)),
  );
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function seedRandom(seed) {
  let state = 2166136261;
  for (const character of seed) {
    state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  }
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectQuestions(pool, count, random = Math.random) {
  const shuffled = shuffle(pool, random);
  const distinctFamilies = [];
  const repeatedFamilies = [];
  const seenFamilies = new Set();

  for (const question of shuffled) {
    if (question.category !== 'formula') {
      distinctFamilies.push(question);
      continue;
    }

    if (seenFamilies.has(question.formulaFamilyId)) {
      repeatedFamilies.push(question);
    } else {
      seenFamilies.add(question.formulaFamilyId);
      distinctFamilies.push(question);
    }
  }

  return [...distinctFamilies, ...repeatedFamilies].slice(0, Math.min(count, pool.length));
}

export function createQuizSession({
  questions,
  mode,
  seconds = 0,
  label,
  categories,
  moduleIds = [],
  startedAt = Date.now(),
}, random = Math.random) {
  const selectedQuestions = selectQuestions(questions, questions.length, random);
  return {
    id: `${startedAt}-${Math.floor(random() * 1_000_000_000)}`,
    questionIds: selectedQuestions.map(({ id }) => id),
    optionOrders: Object.fromEntries(
      selectedQuestions
        .filter(({ interaction }) => interaction === 'single-choice')
        .map((question) => [
          question.id,
          shuffle(question.options.map(({ id }) => id), random),
        ]),
    ),
    mode,
    seconds,
    label,
    categories,
    moduleIds,
    startedAt,
    currentIndex: 0,
    selectedOptionId: null,
    recallText: '',
    results: [],
    completed: false,
  };
}

export function normalizeRecallAnswer(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]/g, '');
}

export function gradeRecall(question, answer) {
  const normalized = normalizeRecallAnswer(answer);
  if (!normalized) return { correct: false, tier: 0, canonical: null };

  const match = question.acceptedAnswers.find(({ canonical, aliases }) =>
    [canonical, ...aliases].some((candidate) =>
      normalizeRecallAnswer(candidate) === normalized,
    ),
  );

  return match
    ? { correct: true, tier: match.tier, canonical: match.canonical }
    : { correct: false, tier: 0, canonical: null };
}

export function gradeChoice(question, optionId) {
  return Boolean(optionId) && optionId === question.correctOptionId;
}

export function pointsFor(question, correct, tier = 0) {
  if (!correct) return 0;
  return question.category === 'vocabulary' ? tier * 100 : 100;
}
