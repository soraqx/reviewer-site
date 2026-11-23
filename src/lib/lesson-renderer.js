import { appendInlineMath } from './katex-render.js';

function renderModuleNavigation(course, currentLesson) {
  const nav = document.querySelector('#module-list');
  const currentModule = course.modules.find(({ id }) => id === currentLesson.moduleId);
  for (const module of course.modules) {
    const item = document.createElement('li');
    const details = document.createElement('details');
    details.open = module.id === currentLesson.moduleId;
    const summary = document.createElement('summary');
    const number = document.createElement('span');
    number.textContent = String(module.order).padStart(2, '0');
    const title = document.createElement('span');
    title.textContent = module.title;
    summary.append(number, title);
    const lessons = document.createElement('ol');
    for (const lesson of module.lessons) {
      const lessonItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `/lessons/${lesson.id}.html`;
      link.textContent = lesson.title;
      if (lesson.id === currentLesson.id) {
        link.setAttribute('aria-current', 'page');
      }
      lessonItem.append(link);
      lessons.append(lessonItem);
    }
    details.append(summary, lessons);
    item.append(details);
    nav.append(item);
  }
  return currentModule;
}

function renderOutcomes(lesson) {
  const outcomes = document.querySelector('#lesson-outcomes');
  outcomes.replaceChildren(
    ...lesson.outcomes.map((outcome) => {
      const item = document.createElement('li');
      appendInlineMath(item, outcome);
      return item;
    }),
  );
}

function renderExamples(lesson) {
  const list = document.querySelector('#lesson-examples-list');
  if (!lesson.examples.length) {
    document.querySelector('#lesson-examples').hidden = true;
    return;
  }
  list.replaceChildren(
    ...lesson.examples.map((example) => {
      const details = document.createElement('details');
      details.className = 'example-item';
      const summary = document.createElement('summary');
      summary.textContent = `Show solution: ${example.title}`;
      const solution = document.createElement('div');
      solution.className = 'example-solution';
      solution.innerHTML = example.solutionHtml;
      details.append(summary, solution);
      return details;
    }),
  );
}

function renderPracticeNotes(lesson) {
  const section = document.querySelector('#lesson-practice-notes');
  if (!lesson.practiceNotesHtml.length) {
    section.hidden = true;
    return;
  }
  const list = document.querySelector('#lesson-practice-notes-list');
  list.replaceChildren(
    ...lesson.practiceNotesHtml.map((html, index) => {
      const details = document.createElement('details');
      details.className = 'inline-practice';
      const summary = document.createElement('summary');
      summary.textContent = `Open supplemental practice ${index + 1} and answer`;
      const content = document.createElement('div');
      content.className = 'practice-answer';
      content.innerHTML = html;
      details.append(summary, content);
      return details;
    }),
  );
  section.hidden = false;
}

function setSiblingLink(id, lesson) {
  const link = document.querySelector(id);
  if (!lesson) {
    link.hidden = true;
    return;
  }
  link.href = `/lessons/${lesson.id}.html`;
  link.textContent = id === '#previous-lesson' ? 'Previous lesson' : 'Next lesson';
}

export function renderLesson(lesson, course) {
  document.title = `${lesson.title}: Fieldnotes`;
  document.querySelector('meta[name="description"]').content = lesson.lead;
  const module = renderModuleNavigation(course, lesson);
  const lessonIndex = course.lessons.findIndex(({ id }) => id === lesson.id);
  document.querySelector('#lesson-kicker').textContent =
    `Module ${module.order} of ${course.modules.length}: ${module.title}`;
  document.querySelector('#lesson-title').textContent = lesson.title;
  document.querySelector('#lesson-lede').textContent = lesson.lead;
  document.querySelector('#lesson-position').textContent =
    `Lesson ${lesson.lessonOrder} of ${module.lessons.length}`;
  document.querySelector('#lesson-concepts').innerHTML = lesson.contentHtml;
  document.querySelector('#lesson-source').textContent =
    `Adapted from the cited course content pack, ${lesson.source}.`;
  renderOutcomes(lesson);
  renderExamples(lesson);
  renderPracticeNotes(lesson);
  setSiblingLink('#previous-lesson', course.lessons[lessonIndex - 1]);
  setSiblingLink('#next-lesson', course.lessons[lessonIndex + 1]);
}
