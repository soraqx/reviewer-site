import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { renderMathText } from './src/lib/katex-render.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const course = JSON.parse(
  readFileSync(resolve(root, 'src/data/course.generated.json'), 'utf8'),
);
const lessons = new Map(
  course.lessons.map((lesson) => [
    lesson.id,
    JSON.parse(readFileSync(resolve(root, `public/generated/lessons/${lesson.id}.json`), 'utf8')),
  ]),
);
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderLessonNoScript(lesson) {
  const outcomes = lesson.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const examples = lesson.examples.map((example) =>
    `<details class="example-item"><summary>${escapeHtml(example.title)}</summary><div class="example-solution">${example.solutionHtml}</div></details>`,
  ).join('');
  const practiceNotes = lesson.practiceNotesHtml.map((html, index) =>
    `<details class="inline-practice"><summary>Supplemental practice ${index + 1}</summary><div class="practice-answer">${html}</div></details>`,
  ).join('');
  return `<noscript id="lesson-noscript"><style>#main > .module-nav, #main > .lesson-content { display: none; }</style><article class="lesson-content"><p class="lesson-dateline">${escapeHtml(lesson.moduleTitle)}. Lesson code ${escapeHtml(lesson.code)}</p><h1>${escapeHtml(lesson.title)}</h1><p class="lesson-lede">${renderMathText(lesson.lead)}</p><p><a class="lesson-quiz-link" href="/quiz/?module=${encodeURIComponent(lesson.moduleId)}">Practice this module</a></p><section class="lesson-section"><h2>Learning outcomes</h2><ul class="outcome-list">${outcomes}</ul></section><section class="lesson-section"><h2>The idea</h2><div class="lesson-prose">${lesson.contentHtml}</div></section>${examples ? `<section class="lesson-section"><h2>Worked examples</h2><div class="example-list">${examples}</div></section>` : ''}${practiceNotes ? `<section class="lesson-section"><h2>Practice from this lesson</h2>${practiceNotes}</section>` : ''}<footer class="lesson-sources"><h2 class="sources-title">Sources and attribution</h2><p>${escapeHtml(lesson.source)}</p></footer></article></noscript>`;
}

function renderCourseNoScript() {
  const modules = course.modules.map((module) => {
    const links = module.lessons.map((lesson) =>
      `<li><a href="/lessons/${lesson.id}.html"><span>${escapeHtml(lesson.title)}</span><small>${escapeHtml(lesson.code)}</small></a></li>`,
    ).join('');
    return `<details class="module-entry"><summary><span class="module-number">${String(module.order).padStart(2, '0')}</span><span class="module-entry-title">${escapeHtml(module.title)}</span><span class="module-lesson-count">${module.lessons.length} lessons</span></summary><div class="module-entry-body"><div><p>${escapeHtml(module.summary)}</p><p class="module-prerequisite">Prerequisites: ${escapeHtml(module.prerequisites || 'None specified')}</p><p><a class="text-link" href="/quiz/?module=${encodeURIComponent(module.id)}">Practice this module</a></p><ul class="module-outcomes">${module.outcomes.map((outcome) => `<li>${escapeHtml(outcome)}</li>`).join('')}</ul></div><ol class="module-lessons">${links}</ol></div></details>`;
  }).join('');
  return `<noscript id="course-noscript"><style>.course-search, #course-modules { display: none; }</style><section class="course-modules">${modules}</section></noscript>`;
}

function courseLessonRoutes() {
  const lessonIds = new Set(course.lessons.map(({ id }) => id));
  return {
    name: 'course-lesson-routes',
    enforce: 'post',
    transformIndexHtml(html, context) {
      const requestUrl = new URL(context.path, 'http://localhost');
      if (requestUrl.pathname === '/lessons/polygon-vocabulary.html') {
        const lessonId = requestUrl.searchParams.get('lesson') ?? 'poly-01';
        const lesson = lessons.get(lessonId);
        if (lesson) return html.replace('<noscript id="lesson-noscript"></noscript>', renderLessonNoScript(lesson));
      }
      if (requestUrl.pathname === '/lessons/' || requestUrl.pathname === '/lessons/index.html') {
        return html.replace('<noscript id="course-noscript"></noscript>', renderCourseNoScript());
      }
      return html;
    },
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const [pathname, search = ''] = (request.url ?? '').split('?');
        const match = pathname.match(/^\/lessons\/([a-z0-9-]+)\.html$/);
        if (!match || !lessonIds.has(match[1])) return next();

        const params = new URLSearchParams(search);
        params.set('lesson', match[1]);
        request.url = `/lessons/polygon-vocabulary.html?${params}`;
        next();
      });
    },
    generateBundle(_options, bundle) {
      const shell = Object.values(bundle).find((item) =>
        item.type === 'asset' && item.fileName === 'lessons/polygon-vocabulary.html');
      if (!shell || shell.type !== 'asset') {
        throw new Error('The reusable lesson HTML shell is missing from the build.');
      }
      const shellHtml = typeof shell.source === 'string'
        ? shell.source
        : Buffer.from(shell.source).toString('utf8');

      for (const lessonId of lessonIds) {
        const lessonHtml = shellHtml.replace(
          /<noscript id="lesson-noscript">[\s\S]*?<\/noscript>/,
          renderLessonNoScript(lessons.get(lessonId)),
        );
        this.emitFile({
          type: 'asset',
          fileName: `lessons/${lessonId}.html`,
          source: lessonHtml,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [courseLessonRoutes(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        'index': resolve(root, 'index.html'),
        'formulas/index': resolve(root, 'formulas/index.html'),
        'lessons/polygon-vocabulary': resolve(root, 'lessons/polygon-vocabulary.html'),
        'lessons/index': resolve(root, 'lessons/index.html'),
        'practice/index': resolve(root, 'practice/index.html'),
        'quiz/index': resolve(root, 'quiz/index.html'),
        'gallery/index': resolve(root, 'gallery/index.html'),
        'problems/coordinate-distance': resolve(root, 'problems/coordinate-distance.html'),
      },
    },
  },
});
