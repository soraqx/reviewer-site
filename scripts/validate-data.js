import katex from 'katex';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { resolveUnit } from '../src/lib/units.js';

const formulasPath = new URL('../src/data/formulas.json', import.meta.url);
const lessonPath = new URL('../src/data/lessons/polygon-vocabulary.json', import.meta.url);
const problemsPath = new URL('../src/data/problems/geometry.json', import.meta.url);
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const sourceIdSchema = z.string().regex(/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/);
const variableSchema = z.object({
  symbol: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
  unit: z.string().trim().min(1),
}).strict();

const formulaSchema = z.object({
  id: slugSchema,
  topic: z.string().trim().min(1),
  name: z.string().trim().min(1),
  latex: z.string().trim().min(1),
  variables: z.array(variableSchema).min(1),
  notes: z.string().trim().min(1),
  conditions: z.string().trim().min(1),
  relatedLessons: z.array(z.string().trim().min(1)),
  tags: z.array(z.string().trim().min(1)).min(1),
}).strict().superRefine((formula, context) => {
  const expressions = [
    { path: ['latex'], value: formula.latex },
    ...formula.variables.map(({ symbol }, index) => ({
      path: ['variables', index, 'symbol'],
      value: symbol,
    })),
  ];
  for (const expression of expressions) {
    try {
      katex.renderToString(expression.value, { throwOnError: true });
    } catch (error) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid LaTeX: ${error.message}`,
        path: expression.path,
      });
    }
  }
});

const formulasSchema = z.array(formulaSchema).min(1).superRefine((formulas, context) => {
  const ids = new Set();
  for (const [index, formula] of formulas.entries()) {
    if (ids.has(formula.id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate formula id "${formula.id}"`,
        path: [index, 'id'],
      });
    }
    ids.add(formula.id);
  }
});

const lessonSchema = z.object({
  id: slugSchema,
  moduleId: slugSchema,
  moduleTitle: z.string().trim().min(1),
  moduleOrder: z.number().int().positive(),
  lessonOrder: z.number().int().positive(),
  title: z.string().trim().min(1),
  lead: z.string().trim().min(1),
  outcomes: z.array(z.string().trim().min(1)).min(1),
  concepts: z.array(z.object({
    heading: z.string().trim().min(1),
    paragraphs: z.array(z.string().trim().min(1)).min(1),
  }).strict()).min(1),
  vocabulary: z.array(z.object({
    term: z.string().trim().min(1),
    definition: z.string().trim().min(1),
  }).strict()).min(1),
  source: z.object({
    id: sourceIdSchema,
    pages: z.string().trim().min(1),
    citation: z.string().trim().min(1),
  }).strict(),
  attribution: z.string().trim().min(1),
}).strict().superRefine((lesson, context) => {
  const richText = [
    ...lesson.outcomes.map((text, index) => ({ path: ['outcomes', index], text })),
    ...lesson.concepts.flatMap((concept, conceptIndex) =>
      concept.paragraphs.map((text, paragraphIndex) => ({
        path: ['concepts', conceptIndex, 'paragraphs', paragraphIndex],
        text,
      })),
    ),
    ...lesson.vocabulary.map(({ definition }, index) => ({
      path: ['vocabulary', index, 'definition'],
      text: definition,
    })),
  ];

  for (const { path, text } of richText) {
    for (const match of text.matchAll(/\$([^$]+)\$/g)) {
      try {
        katex.renderToString(match[1], { throwOnError: true });
      } catch (error) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid inline LaTeX: ${error.message}`,
          path,
        });
      }
    }
  }
});

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

const [formulaSource, lessonSource, problemsSource] = await Promise.all([
  readFile(formulasPath, 'utf8'),
  readFile(lessonPath, 'utf8'),
  readFile(problemsPath, 'utf8'),
]);
const parsedFormulas = formulasSchema.safeParse(JSON.parse(formulaSource));
const parsedLesson = lessonSchema.safeParse(JSON.parse(lessonSource));
const parsedProblems = problemsSchema.safeParse(JSON.parse(problemsSource));

if (!parsedFormulas.success || !parsedLesson.success || !parsedProblems.success) {
  if (!parsedFormulas.success) {
    console.error(`Formula data validation failed:\n${parsedFormulas.error.message}`);
  }
  if (!parsedLesson.success) {
    console.error(`Lesson data validation failed:\n${parsedLesson.error.message}`);
  }
  if (!parsedProblems.success) {
    console.error(`Problem data validation failed:\n${parsedProblems.error.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${parsedFormulas.data.length} formulas, lesson ${parsedLesson.data.id}, and ${parsedProblems.data.length} problem templates.`,
  );
}
