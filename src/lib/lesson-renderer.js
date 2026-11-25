import { appendInlineMath } from './katex-render.js';

function renderModuleNavigation(course, currentLesson) {
  const nav = document.querySelector('#module-list');
  const desktopSelect = document.querySelector('#desktop-module-select');
  const mobileModuleSelect = document.querySelector('#mobile-module-select');
  const mobileLessonSelect = document.querySelector('#mobile-lesson-select');
  const currentModule = course.modules.find(({ id }) => id === currentLesson.moduleId);
  document.querySelector('#desktop-module-name').textContent = currentModule.title;
  document.querySelector('#mobile-module-name').textContent = currentModule.title;
  const moduleOptions = course.modules.map((module) => {
    const option = document.createElement('option');
    option.value = module.id;
    option.textContent = `${String(module.order).padStart(2, '0')} · ${module.title}`;
    option.selected = module.id === currentLesson.moduleId;
    return option;
  });
  for (const select of [desktopSelect, mobileModuleSelect]) {
    select.replaceChildren(...moduleOptions.map((option) => option.cloneNode(true)));
    select.value = currentLesson.moduleId;
  }
  const lessonOptions = currentModule.lessons.map((lesson) => {
    const option = document.createElement('option');
    option.value = lesson.id;
    option.textContent = lesson.title;
    option.selected = lesson.id === currentLesson.id;
    return option;
  });
  mobileLessonSelect.replaceChildren(...lessonOptions);
  nav.replaceChildren();

  for (const lesson of currentModule.lessons) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const marker = document.createElement('span');
    const label = document.createElement('span');
    marker.className = 'lesson-link-marker';
    marker.setAttribute('aria-hidden', 'true');
    label.className = 'lesson-link-label';
    link.href = `/lessons/${lesson.id}.html`;
    label.textContent = lesson.title;
    link.append(marker, label);
    link.title = lesson.title;
    if (lesson.id === currentLesson.id) {
      link.setAttribute('aria-current', 'page');
    }
    item.append(link);
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
  const section = document.querySelector('#lesson-examples');
  if (!lesson.examples.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
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
  section.hidden = false;
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
  link.hidden = false;
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
  const quizLink = document.querySelector('#lesson-quiz-link');
  quizLink.href = `/quiz/?module=${encodeURIComponent(module.id)}`;
  const sectionTitles = {
    'poly-01': 'Names and parts of polygons',
    'tri-01': 'Triangle classification',
    'quad-02': 'Compare rectangles and squares',
    'quad-03': 'What makes a rhombus',
    'cart-04': 'Find area from ordered vertices',
    'line-02': 'Compare line directions',
    'circ-02': 'Recognize a circle equation',
    'cyl-02': 'Measure the pipe material',
    'pyr-03': 'Follow the water in an inverted pyramid',
    'cone-03': 'Fit a cone inside a cube',
    'sph-03': 'Separate liquid volume from wetted area',
  };
  document.querySelector('#ideas-title').textContent =
    sectionTitles[lesson.id] ?? `${module.title}: key ideas`;
  document.querySelector('#lesson-position').textContent =
    `Lesson ${lesson.lessonOrder} of ${module.lessons.length}`;
  document.querySelector('#triangle-classification').hidden = lesson.id !== 'tri-01';
  document.querySelector('#lesson-concepts').innerHTML = lesson.contentHtml;
  document.querySelector('#lesson-source').textContent =
    `Adapted from the cited course content pack, ${lesson.source}.`;
  renderOutcomes(lesson);
  renderExamples(lesson);
  renderPracticeNotes(lesson);
  setSiblingLink('#previous-lesson', course.lessons[lessonIndex - 1]);
  setSiblingLink('#next-lesson', course.lessons[lessonIndex + 1]);
}
