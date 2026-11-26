import katex from 'katex';
import { readFile, readdir } from 'node:fs/promises';
import { z } from 'zod';
import { resolveUnit } from '../src/lib/units.js';
import { formulaQuestions } from '../src/data/quiz-formulas.js';

const formulasPath = new URL('../src/data/formulas.json', import.meta.url);
const coursePath = new URL('../src/data/course.generated.json', import.meta.url);
const problemsPath = new URL('../src/data/problems/geometry.json', import.meta.url);
const generatedLessonsPath = new URL('../public/generated/lessons/', import.meta.url);
const generatedPracticePath = new URL('../public/generated/practice.json', import.meta.url);
const legacyQuizPath = new URL('../src/data/quiz-legacy.json', import.meta.url);
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const sourceIdSchema = z.string().regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/);
const formulaExpressionSchema = z.object({
  label: z.string().nullable(),
  latex: z.string().trim().min(1),
}).strict();

const formulaEntrySchema = z.object({
  id: slugSchema,
  catalogueId: sourceIdSchema,
  name: z.string().trim().min(1),
  sectionId: slugSchema,
  sectionOrder: z.number().int().positive(),
  sectionTitle: z.string().trim().min(1),
  topic: z.string().trim().min(1),
  kind: z.enum(['module', 'shared', 'advanced']),
  lessonCode: z.string().trim().min(1),
  lessonId: slugSchema.nullable(),
  lessonTitle: z.string(),
  classification: z.string().trim().min(1),
  referenceType: z.string().trim().min(1),
  sourceLocation: z.string().trim().min(1),
  sourceNote: z.string(),
  conditions: z.string().trim().min(1),
  expressions: z.array(formulaExpressionSchema),
  notes: z.array(z.string().trim().min(1)),
  tags: z.array(z.string().trim().min(1)).min(1),
}).strict().superRefine((formula, context) => {
  if (!formula.expressions.length && !formula.notes.length) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Formula "${formula.id}" needs an expression or a stated rule.`,
      path: ['expressions'],
    });
  }
  for (const [index, expression] of formula.expressions.entries()) {
    try {
      katex.renderToString(expression.latex, { throwOnError: true });
    } catch (error) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid LaTeX: ${error.message}`,
        path: ['expressions', index, 'latex'],
      });
    }
  }
});

const formulaSectionSchema = z.object({
  id: slugSchema,
  order: z.number().int().positive(),
  title: z.string().trim().min(1),
  kind: z.enum(['module', 'shared', 'advanced']),
  notation: z.string(),
  note: z.string(),
}).strict();

const formulaCatalogueSchema = z.object({
  catalogueVersion: z.string().trim().min(1),
  sourceContentVersion: z.string().trim().min(1),
  sourceFile: z.string().trim().min(1),
  sections: z.array(formulaSectionSchema).length(17),
  entries: z.array(formulaEntrySchema).length(142),
}).strict().superRefine((catalogue, context) => {
  const ids = new Set();
  const sectionIds = new Set(catalogue.sections.map((section) => section.id));
  for (const [index, formula] of catalogue.entries.entries()) {
    if (ids.has(formula.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate formula id "${formula.id}"`,
        path: ['entries', index, 'id'],
      });
    }
    ids.add(formula.id);
    if (!sectionIds.has(formula.sectionId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Formula "${formula.id}" references missing section "${formula.sectionId}".`,
        path: ['entries', index, 'sectionId'],
      });
    }
  }
  const counts = {
    module: catalogue.entries.filter((formula) => formula.kind === 'module').length,
    shared: catalogue.entries.filter((formula) => formula.kind === 'shared').length,
    advanced: catalogue.entries.filter((formula) => formula.kind === 'advanced').length,
    named: new Set(catalogue.entries.filter((formula) => formula.catalogueId.startsWith('F-')).map((formula) => formula.catalogueId)).size,
  };
  const expected = { module: 128, shared: 2, advanced: 12, named: 101 };
  for (const [key, value] of Object.entries(expected)) {
    if (counts[key] !== value) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Expected ${value} ${key} formula entries; found ${counts[key]}.`,
        path: ['entries'],
      });
    }
  }
});

const courseLessonMetadataSchema = z.object({
  id: slugSchema,
  code: sourceIdSchema,
  moduleId: slugSchema,
  moduleTitle: z.string().trim().min(1),
  moduleOrder: z.number().int().positive(),
  lessonOrder: z.number().int().positive(),
  title: z.string().trim().min(1),
  lead: z.string().trim().min(1),
  outcomes: z.array(z.string().trim().min(1)).min(1),
  source: z.string().trim().min(1),
}).strict();

const courseLessonSchema = courseLessonMetadataSchema.extend({
  contentHtml: z.string(),
  practiceNotesHtml: z.array(z.string()),
  examples: z.array(z.object({
    title: z.string().trim().min(1),
    solutionHtml: z.string(),
  }).strict()),
}).strict().refine(
  (lesson) => lesson.contentHtml.trim() || lesson.examples.length > 0,
  { message: 'A lesson needs explanatory content or a worked example.' },
);

const coursePracticeSchema = z.object({
  id: sourceIdSchema,
  moduleId: slugSchema,
  lessonId: slugSchema.nullable(),
  promptHtml: z.string().trim().min(1),
  answerHtml: z.string().trim().min(1),
  source: z.string(),
}).strict();

const courseModuleSchema = z.object({
  id: slugSchema,
  title: z.string().trim().min(1),
  order: z.number().int().positive(),
  summary: z.string().trim().min(1),
  prerequisites: z.string(),
  outcomes: z.array(z.string().trim().min(1)).min(1),
  lessonIds: z.array(slugSchema).min(1),
  lessons: z.array(courseLessonMetadataSchema).min(1),
}).strict();

const courseSchema = z.object({
  modules: z.array(courseModuleSchema).length(15),
  lessons: z.array(courseLessonMetadataSchema).length(49),
}).strict().superRefine((course, context) => {
  const moduleIds = new Set(course.modules.map(({ id }) => id));
  const lessonIds = new Set(course.lessons.map(({ id }) => id));
  if (moduleIds.size !== course.modules.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate module IDs.' });
  }
  if (lessonIds.size !== course.lessons.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate lesson IDs.' });
  }
  for (const [moduleIndex, module] of course.modules.entries()) {
    for (const lessonId of module.lessonIds) {
      if (!lessonIds.has(lessonId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Module "${module.id}" references missing lesson "${lessonId}".`,
          path: ['modules', moduleIndex, 'lessonIds'],
        });
      }
    }
    for (const [lessonIndex, lesson] of module.lessons.entries()) {
      if (
        lesson.moduleId !== module.id
        || !module.lessonIds.includes(lesson.id)
        || lesson.moduleTitle !== module.title
        || lesson.moduleOrder !== module.order
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Lesson "${lesson.id}" is not consistently linked to module "${module.id}".`,
          path: ['modules', moduleIndex, 'lessons', lessonIndex],
        });
      }
    }
  }
  for (const [index, lesson] of course.lessons.entries()) {
    if (!moduleIds.has(lesson.moduleId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Lesson "${lesson.id}" references missing module "${lesson.moduleId}".`,
        path: ['lessons', index, 'moduleId'],
      });
    }
  }
});

const courseLessonsSchema = z.array(courseLessonSchema).length(49);
const coursePracticeSchemaArray = z.array(coursePracticeSchema).min(1);

const rangeSchema = z.object({
  min: z.number().finite(),
  max: z.number().finite(),
  step: z.number().positive(),
}).strict().superRefine((range, context) => {
  if (range.max < range.min) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Range max must be greater than or equal to min.',
    });
  } else if (Math.abs((range.max - range.min) / range.step - Math.round((range.max - range.min) / range.step)) > 1e-9) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Range step must land exactly on max.',
    });
  }
});

const problemGivenSchema = z.object({
  key: slugSchema,
  symbol: z.string().trim().min(1),
  label: z.string().trim().min(1),
  unit: z.string().trim().min(1),
  range: rangeSchema,
}).strict();

const problemSchema = z.object({
  id: slugSchema,
  topic: z.string().trim().min(1),
  title: z.string().trim().min(1),
  editorialStatus: z.enum(['adapted', 'corrected', 'supplemental', 'needs-review']),
  source: z.object({
    id: sourceIdSchema,
    pages: z.string().trim().min(1),
    citation: z.string().trim().min(1),
  }).strict(),
  prompt: z.string().trim().min(1),
  givens: z.array(problemGivenSchema).min(1),
  constraints: z.array(z.enum(['points-distinct'])),
  steps: z.array(z.object({
    title: z.string().trim().min(1),
    text: z.string().trim().min(1),
    latex: z.string().trim().min(1),
  }).strict()).min(1),
  hints: z.array(z.string().trim().min(1)).min(1),
  answer: z.object({
    operation: z.enum(['euclidean-distance-2d']),
    arguments: z.array(slugSchema).min(1),
    dimension: z.enum(['length', 'area', 'angle', 'time', 'mass']),
    displayUnit: z.string().trim().min(1),
    tolerance: z.number().positive(),
    toleranceUnit: z.string().trim().min(1),
    precision: z.number().int().min(0).max(8),
  }).strict().superRefine((answer, context) => {
    for (const key of ['displayUnit', 'toleranceUnit']) {
      const unit = resolveUnit(answer[key]);
      if (!unit || unit.dimension !== answer.dimension) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${key} must be a recognized ${answer.dimension} unit.`,
          path: [key],
        });
      }
    }
  }),
}).strict().superRefine((problem, context) => {
  const keys = new Set();
  for (const [index, given] of problem.givens.entries()) {
    if (keys.has(given.key)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate given key "${given.key}"`,
        path: ['givens', index, 'key'],
      });
    }
    keys.add(given.key);
    const unit = resolveUnit(given.unit);
    if (!unit || unit.dimension !== problem.answer.dimension) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Given "${given.key}" must use a recognized ${problem.answer.dimension} unit.`,
        path: ['givens', index, 'unit'],
      });
    }
  }
  for (const key of problem.answer.arguments) {
    if (!keys.has(key)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Answer argument "${key}" is not a given.`,
        path: ['answer', 'arguments'],
      });
    }
  }
  if (problem.answer.operation === 'euclidean-distance-2d') {
    const expectedArguments = ['x1', 'y1', 'x2', 'y2'];
    if (JSON.stringify(problem.answer.arguments) !== JSON.stringify(expectedArguments)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `euclidean-distance-2d arguments must be ordered as ${expectedArguments.join(', ')}.`,
        path: ['answer', 'arguments'],
      });
    }
    for (const key of ['x1', 'y1', 'x2', 'y2']) {
      if (!keys.has(key)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Euclidean distance requires the "${key}" given.`,
          path: ['givens'],
        });
      }
    }
  }

  const allowedTokens = new Set([
    ...keys,
    'dx',
    'dy',
    'sumSquares',
    'exactAnswer',
    'roundedAnswer',
  ]);
  for (const [field, text] of [
    ['prompt', problem.prompt],
    ...problem.steps.flatMap((step, index) => [
      [`steps.${index}.text`, step.text],
      [`steps.${index}.latex`, step.latex],
    ]),
    ...problem.hints.map((hint, index) => [`hints.${index}`, hint]),
  ]) {
    for (const [, token] of text.matchAll(/\{\{([a-z][a-z0-9_]*)\}\}/gi)) {
      if (!allowedTokens.has(token)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Unknown template token "{{${token}}}".`,
          path: [field],
        });
      }
    }
  }

  for (const [index, step] of problem.steps.entries()) {
    try {
      const sampleLatex = step.latex.replace(/\{\{[a-z][a-z0-9_]*\}\}/gi, '1');
      katex.renderToString(sampleLatex, { throwOnError: true });
    } catch (error) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid step LaTeX: ${error.message}`,
        path: ['steps', index, 'latex'],
      });
    }
  }
});

const problemsSchema = z.array(problemSchema).min(1).superRefine((problems, context) => {
  const ids = new Set();
  for (const [index, problem] of problems.entries()) {
    if (ids.has(problem.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate problem id "${problem.id}"`,
        path: [index, 'id'],
      });
    }
    ids.add(problem.id);
  }
});

const [formulaSource, courseSource, practiceSource, problemsSource, legacyQuizSource, lessonFiles] = await Promise.all([
  readFile(formulasPath, 'utf8'),
  readFile(coursePath, 'utf8'),
  readFile(generatedPracticePath, 'utf8'),
  readFile(problemsPath, 'utf8'),
  readFile(legacyQuizPath, 'utf8'),
  readdir(generatedLessonsPath),
]);
const lessonSources = await Promise.all(
  lessonFiles
    .filter((file) => file.endsWith('.json'))
    .map(async (file) => ({
      file,
      source: await readFile(new URL(file, generatedLessonsPath), 'utf8'),
    })),
);
const parsedFormulas = formulaCatalogueSchema.safeParse(JSON.parse(formulaSource));
const parsedCourse = courseSchema.safeParse(JSON.parse(courseSource));
const parsedCourseLessons = courseLessonsSchema.safeParse(
  lessonSources.map(({ source }) => JSON.parse(source)),
);
const parsedCoursePractice = coursePracticeSchemaArray.safeParse(JSON.parse(practiceSource));
const parsedProblems = problemsSchema.safeParse(JSON.parse(problemsSource));
const validationErrors = [];
if (parsedCourse.success && parsedFormulas.success) {
  const formulaLessonById = new Map(parsedCourse.data.lessons.map((lesson) => [lesson.id, lesson]));
  for (const formula of parsedFormulas.data.entries) {
    if (!formula.lessonId) {
      if (formula.lessonCode !== 'Shared/implementation reference') {
        validationErrors.push(`Formula "${formula.id}" has no lesson link but uses "${formula.lessonCode}".`);
      }
      continue;
    }
    const lesson = formulaLessonById.get(formula.lessonId);
    if (!lesson) {
      validationErrors.push(`Formula "${formula.id}" references missing lesson "${formula.lessonId}".`);
    } else if (lesson.code !== formula.lessonCode) {
      validationErrors.push(`Formula "${formula.id}" lesson code does not match "${formula.lessonId}".`);
    }
  }
}
let legacyQuiz;
try {
  legacyQuiz = JSON.parse(legacyQuizSource);
} catch (error) {
  validationErrors.push(`Legacy quiz data is not valid JSON: ${error.message}`);
}

const expectedLegacyModuleIds = [
  'plane-figures-polygons',
  'triangles',
  'quadrilaterals',
  'cartesian-coordinates',
  'lines',
  'circles',
  'parabolas',
  'ellipses',
  'hyperbolas',
  'prisms',
  'parallelepipeds-cubes',
  'cylinders',
  'pyramids',
  'cones',
  'spheres-segments',
];
const quizIds = new Set();
if (parsedCourse.success) {
  const moduleById = new Map(parsedCourse.data.modules.map((module) => [module.id, module]));
  if (formulaQuestions.length !== 90) {
    validationErrors.push(`Expected 90 formula questions; found ${formulaQuestions.length}.`);
  }
  const formulaCounts = new Map();
  for (const [index, question] of formulaQuestions.entries()) {
    if (quizIds.has(question.id)) validationErrors.push(`Duplicate quiz question ID "${question.id}".`);
    quizIds.add(question.id);
    formulaCounts.set(question.moduleId, (formulaCounts.get(question.moduleId) ?? 0) + 1);
    const module = moduleById.get(question.moduleId);
    if (!module) {
      validationErrors.push(`Formula question "${question.id}" references missing module "${question.moduleId}".`);
    }
    if (
      !question.lessonIds.length
      || question.lessonIds.some((lessonId) =>
        !module?.lessons.some((lesson) => lesson.id === lessonId))
    ) {
      validationErrors.push(`Formula question "${question.id}" has an invalid lesson mapping.`);
    }
    if (
      question.category !== 'formula'
      || question.interaction !== 'single-choice'
      || !question.prompt
      || !question.symbolDefinitions
      || !question.conditions
      || !question.explanation
      || !question.formulaFamilyId
      || !question.sourceRefs.length
      || question.options.length !== 4
      || new Set(question.options.map(({ id }) => id)).size !== 4
      || new Set(question.options.map(({ latex }) => latex)).size !== 4
      || !question.options.some(({ id }) => id === question.correctOptionId)
    ) {
      validationErrors.push(`Formula question "${question.id}" is incomplete or has ambiguous option IDs.`);
    }
    for (const [optionIndex, option] of question.options.entries()) {
      try {
        katex.renderToString(option.latex, {
          displayMode: true,
          output: 'htmlAndMathml',
          throwOnError: true,
        });
      } catch (error) {
        validationErrors.push(
          `Formula question "${question.id}" option ${optionIndex + 1} has invalid LaTeX: ${error.message}`,
        );
      }
    }
    if (!question.options.every(({ accessibleLabel }) => accessibleLabel)) {
      validationErrors.push(`Formula question "${question.id}" is missing an accessible choice label.`);
    }
    if (!question.editorialStatus || !question.sourceRefs.length) {
      validationErrors.push(`Formula question "${question.id}" is missing source or editorial metadata.`);
    }
    if (!Number.isInteger(index)) validationErrors.push('Formula question order is invalid.');
  }
  for (const module of parsedCourse.data.modules) {
    if (formulaCounts.get(module.id) !== 6) {
      validationErrors.push(`Module "${module.id}" must have six formula questions.`);
    }
  }
}

if (legacyQuiz) {
  if (
    JSON.stringify(legacyQuiz.moduleIds) !== JSON.stringify(expectedLegacyModuleIds)
    || legacyQuiz.questions.length !== 105
    || legacyQuiz.recall.length !== 15
  ) {
    validationErrors.push('Legacy quiz bank must preserve its 105 choice and 15 recall records with explicit module mapping.');
  }
  for (const question of [...(legacyQuiz.questions ?? []), ...(legacyQuiz.recall ?? [])]) {
    if (quizIds.has(question.id)) validationErrors.push(`Duplicate quiz question ID "${question.id}".`);
    quizIds.add(question.id);
    if (
      !expectedLegacyModuleIds.includes(question.moduleId)
      || !question.prompt
      || !question.explanation
      || !question.sourceRefs?.length
    ) {
      validationErrors.push(`Legacy quiz question "${question.id}" has incomplete module or source metadata.`);
    }
  }
  for (const question of legacyQuiz.questions ?? []) {
    if (
      question.category !== 'problem'
      || question.interaction !== 'single-choice'
      || question.options.length !== 4
      || new Set(question.options.map(({ id }) => id)).size !== 4
      || !question.options.some(({ id }) => id === question.correctOptionId)
    ) {
      validationErrors.push(`Legacy choice question "${question.id}" has invalid answer options.`);
    }
  }
  for (const question of legacyQuiz.recall ?? []) {
    if (
      question.category !== 'vocabulary'
      || question.interaction !== 'text-recall'
      || !question.acceptedAnswers.length
      || question.acceptedAnswers.some(({ canonical, aliases, tier }) =>
        !canonical || !aliases.length || !Number.isInteger(tier) || tier < 1 || tier > 4)
    ) {
      validationErrors.push(`Vocabulary prompt "${question.id}" has invalid accepted answers.`);
    }
  }
}

if (parsedCourse.success && parsedCourseLessons.success) {
  const metadataById = new Map(parsedCourse.data.lessons.map((lesson) => [lesson.id, lesson]));
  const detailsById = new Map(parsedCourseLessons.data.map((lesson) => [lesson.id, lesson]));
  const expectedFiles = [...metadataById.keys()].map((id) => `${id}.json`).sort();
  const actualFiles = lessonSources.map(({ file }) => file).sort();
  if (JSON.stringify(expectedFiles) !== JSON.stringify(actualFiles)) {
    validationErrors.push('Generated lesson files do not match the course index.');
  }
  for (const [moduleIndex, module] of parsedCourse.data.modules.entries()) {
    const childIds = module.lessons.map(({ id }) => id);
    const childIdSet = new Set(childIds);
    if (
      module.lessonIds.length !== childIds.length
      || childIdSet.size !== childIds.length
      || module.lessonIds.some((id, index) => id !== childIds[index])
    ) {
      validationErrors.push(`Module "${module.id}" lesson IDs do not match its lesson list.`);
    }
    for (const lesson of module.lessons) {
      if (!metadataById.has(lesson.id)) {
        validationErrors.push(`Module "${module.id}" contains lesson "${lesson.id}" missing from the course index.`);
      }
    }
    if (moduleIndex !== module.order - 1) {
      validationErrors.push(`Module "${module.id}" is not in curriculum order.`);
    }
  }
  for (const [index, lesson] of parsedCourseLessons.data.entries()) {
    const metadata = metadataById.get(lesson.id);
    if (!metadata) {
      validationErrors.push(`Generated lesson file "${lesson.id}" is absent from the course index.`);
      continue;
    }
    for (const key of [
      'code', 'moduleId', 'moduleTitle', 'moduleOrder', 'lessonOrder',
      'title', 'lead', 'source',
    ]) {
      if (lesson[key] !== metadata[key]) {
        validationErrors.push(`Generated lesson "${lesson.id}" has mismatched "${key}" metadata.`);
      }
    }
    if (JSON.stringify(lesson.outcomes) !== JSON.stringify(metadata.outcomes)) {
      validationErrors.push(`Generated lesson "${lesson.id}" has mismatched outcomes.`);
    }
    if (lessonFiles[index] !== `${lesson.id}.json`) {
      validationErrors.push(`Generated lesson file "${lesson.id}.json" is not named consistently.`);
    }
  }
  const moduleLessonIds = new Set(
    parsedCourse.data.modules.flatMap((module) => module.lessonIds),
  );
  for (const lessonId of metadataById.keys()) {
    if (!moduleLessonIds.has(lessonId)) {
      validationErrors.push(`Lesson "${lessonId}" is missing from its module lesson list.`);
    }
  }
  if (parsedCoursePractice.success) {
    const moduleIds = new Set(parsedCourse.data.modules.map(({ id }) => id));
    const practiceIds = new Set();
    for (const item of parsedCoursePractice.data) {
      if (practiceIds.has(item.id)) {
        validationErrors.push(`Duplicate practice ID "${item.id}".`);
      }
      practiceIds.add(item.id);
      if (!moduleIds.has(item.moduleId)) {
        validationErrors.push(`Practice "${item.id}" references missing module "${item.moduleId}".`);
      }
      if (item.lessonId) {
        const lesson = metadataById.get(item.lessonId);
        if (!lesson) {
          validationErrors.push(`Practice "${item.id}" references missing lesson "${item.lessonId}".`);
        } else if (lesson.moduleId !== item.moduleId) {
          validationErrors.push(`Practice "${item.id}" is linked to the wrong lesson module.`);
        }
      }
    }
  }
}

if (
  !parsedFormulas.success
  || !parsedCourse.success
  || !parsedCourseLessons.success
  || !parsedCoursePractice.success
  || !parsedProblems.success
  || validationErrors.length
) {
  if (!parsedFormulas.success) {
    console.error(`Formula data validation failed:\n${parsedFormulas.error.message}`);
  }
  if (!parsedCourse.success) {
    console.error(`Course data validation failed:\n${parsedCourse.error.message}`);
  }
  if (!parsedCourseLessons.success) {
    console.error(`Generated lesson validation failed:\n${parsedCourseLessons.error.message}`);
  }
  if (!parsedCoursePractice.success) {
    console.error(`Generated practice validation failed:\n${parsedCoursePractice.error.message}`);
  }
  for (const error of validationErrors) console.error(error);
  if (!parsedProblems.success) {
    console.error(`Problem data validation failed:\n${parsedProblems.error.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${parsedFormulas.data.entries.length} catalogue entries, ${parsedCourse.data.modules.length} modules, ${parsedCourse.data.lessons.length} lessons, ${parsedCoursePractice.data.length} practice items, ${parsedProblems.data.length} randomized problem templates, and ${formulaQuestions.length + legacyQuiz.questions.length} quiz choices plus ${legacyQuiz.recall.length} recall prompts.`,
  );
}
