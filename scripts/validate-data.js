import katex from 'katex';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';

const formulasPath = new URL('../src/data/formulas.json', import.meta.url);
const lessonPath = new URL('../src/data/lessons/polygon-vocabulary.json', import.meta.url);
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

const [formulaSource, lessonSource] = await Promise.all([
  readFile(formulasPath, 'utf8'),
  readFile(lessonPath, 'utf8'),
]);
const parsedFormulas = formulasSchema.safeParse(JSON.parse(formulaSource));
const parsedLesson = lessonSchema.safeParse(JSON.parse(lessonSource));

if (!parsedFormulas.success || !parsedLesson.success) {
  if (!parsedFormulas.success) {
    console.error(`Formula data validation failed:\n${parsedFormulas.error.message}`);
  }
  if (!parsedLesson.success) {
    console.error(`Lesson data validation failed:\n${parsedLesson.error.message}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Validated ${parsedFormulas.data.length} formulas and lesson ${parsedLesson.data.id}.`);
}
