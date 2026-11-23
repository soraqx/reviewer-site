import './styles/main.css';
import './styles/course.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import { appendInlineMath } from './lib/katex-render.js';
import course from './data/course.generated.json';

mountSharedLayout();

const list = document.querySelector('#course-modules');
const query = document.querySelector('#course-query');
const count = document.querySelector('#course-count');
document.querySelector('.course-search').addEventListener('submit', (event) => {
  event.preventDefault();
});

for (const module of course.modules) {
  const entry = document.createElement('details');
  entry.className = 'module-entry';
  entry.dataset.search = `${module.title} ${module.summary} ${module.prerequisites}`.toLowerCase();

  const summary = document.createElement('summary');
  const number = document.createElement('span');
  number.className = 'module-number';
  number.textContent = String(module.order).padStart(2, '0');
  const title = document.createElement('span');
  title.className = 'module-entry-title';
  title.textContent = module.title;
  const lessonCount = document.createElement('span');
  lessonCount.className = 'module-lesson-count';
  lessonCount.textContent = `${module.lessons.length} lessons`;
  summary.append(number, title, lessonCount);

  const body = document.createElement('div');
  body.className = 'module-entry-body';
  const context = document.createElement('div');
  const overview = document.createElement('p');
  appendInlineMath(overview, module.summary);
  context.append(overview);
  const prerequisites = document.createElement('p');
  prerequisites.className = 'module-prerequisite';
  prerequisites.textContent = `Prerequisites: ${module.prerequisites || 'None specified'}`;
  context.append(prerequisites);
  const outcomes = document.createElement('ul');
  outcomes.className = 'module-outcomes';
  for (const outcome of module.outcomes) {
    const item = document.createElement('li');
    appendInlineMath(item, outcome);
    outcomes.append(item);
  }
  body.append(context, outcomes);

  const lessons = document.createElement('ol');
  lessons.className = 'module-lessons';
  for (const lesson of module.lessons) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `/lessons/${lesson.id}.html`;
    link.dataset.search = `${lesson.title} ${lesson.code}`.toLowerCase();
    const lessonTitle = document.createElement('span');
    lessonTitle.textContent = lesson.title;
    const code = document.createElement('small');
    code.textContent = lesson.code;
    link.append(lessonTitle, code);
    item.append(link);
    lessons.append(item);
  }
  body.append(lessons);
  entry.append(summary, body);
  list.append(entry);
}

function filterModules() {
  const term = query.value.trim().toLowerCase();
  let matches = 0;
  for (const entry of list.children) {
    const lessonLinks = [...entry.querySelectorAll('.module-lessons a')];
    let lessonMatches = 0;
    for (const link of lessonLinks) {
      const visible = !term || link.dataset.search.includes(term) || entry.dataset.search.includes(term);
      link.parentElement.hidden = !visible;
      if (visible) lessonMatches += 1;
    }
    const moduleMatches = !term || entry.dataset.search.includes(term);
    const visibleModule = moduleMatches || lessonMatches > 0;
    entry.hidden = !visibleModule;
    if (term && visibleModule) entry.open = true;
    matches += moduleMatches
      ? entry.querySelectorAll('.module-lessons li').length
      : lessonMatches;
  }
  count.textContent = term
    ? `${matches} matching lessons across ${[...list.children].filter((entry) => !entry.hidden).length} modules.`
    : `${course.modules.length} modules and ${course.lessons.length} lessons.`;
}

query.addEventListener('input', filterModules);
filterModules();
