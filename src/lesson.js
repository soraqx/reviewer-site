import './styles/main.css';
import './styles/lesson.css';
import './styles/course.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import { renderLesson } from './lib/lesson-renderer.js';
import course from './data/course.generated.json';
import { mountPolygonExplorer } from './sims/polygon-vocabulary.js';
import { mountCourseExplorer } from './sims/module-explorer.js';
import { firstLessonId, lessonIdFromUrl, lessonUrl } from './lib/course-navigation.js';
import { replayMotion } from './lib/motion.js';

mountSharedLayout();

document.querySelector('.lesson-heading').after(
  document.querySelector('#polygon-simulation'),
  document.querySelector('#course-simulation'),
);
const polygonClassification = document.querySelector('.polygon-classification');
polygonClassification.hidden = true;
document.querySelector('#lesson-outcomes')
  .closest('.lesson-section')
  .after(polygonClassification);

let loadSequence = 0;
let polygonExplorerMounted = false;

async function loadLesson(lessonId, { focus = false } = {}) {
  const sequence = ++loadSequence;
  const lessonMetadata = course.lessons.find(({ id }) => id === lessonId);
  if (!lessonMetadata) {
    throw new Error(`Unknown lesson route "${lessonId}".`);
  }

  const lessonResponse = await fetch(`/generated/lessons/${lessonId}.json`);
  if (!lessonResponse.ok) {
    throw new Error(`Could not load lesson "${lessonId}" (${lessonResponse.status}).`);
  }
  const lesson = await lessonResponse.json();
  if (sequence !== loadSequence) return;
  if (lesson.id !== lessonMetadata.id || lesson.moduleId !== lessonMetadata.moduleId) {
    throw new Error(`Lesson data does not match route "${lessonId}".`);
  }

  renderLesson(lesson, course);
  const isPolygonLesson = lesson.id === 'poly-01';
  document.querySelector('#polygon-simulation').hidden = !isPolygonLesson;
  document.querySelector('#course-simulation').hidden = isPolygonLesson;
  polygonClassification.hidden = !isPolygonLesson;
  if (isPolygonLesson && !polygonExplorerMounted) {
    mountPolygonExplorer();
    polygonExplorerMounted = true;
  }
  else mountCourseExplorer(lesson);
  replayMotion(document.querySelector('.lesson-content'), 'motion-enter');
  if (focus) {
    const heading = document.querySelector('#lesson-title');
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start' });
  }
}

function showLessonError(error) {
  document.querySelector('#lesson-title').textContent = 'Lesson unavailable.';
  document.querySelector('#lesson-lede').textContent =
    'This lesson could not be loaded. Please try again later.';
  console.error(error);
}

async function loadFromCurrentUrl(options) {
  const lessonId = lessonIdFromUrl(window.location.href);
  if (!lessonId) throw new Error('The current URL does not identify a lesson.');
  await loadLesson(lessonId, options);
}

function navigateToLesson(lessonId, { focus = true } = {}) {
  const url = lessonUrl(lessonId);
  window.history.pushState({}, '', url);
  loadLesson(lessonId, { focus }).catch(showLessonError);
}

document.querySelector('#desktop-module-select').addEventListener('change', (event) => {
  const lessonId = firstLessonId(course, event.currentTarget.value);
  if (lessonId) navigateToLesson(lessonId);
});

document.querySelector('#mobile-module-select').addEventListener('change', (event) => {
  const lessonId = firstLessonId(course, event.currentTarget.value);
  if (lessonId) navigateToLesson(lessonId);
});

document.querySelector('#mobile-lesson-select').addEventListener('change', (event) => {
  navigateToLesson(event.currentTarget.value);
});

document.querySelector('#module-list').addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="/lessons/"]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigateToLesson(lessonIdFromUrl(link.href));
});

document.querySelector('.lesson-path').addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="/lessons/"]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigateToLesson(lessonIdFromUrl(link.href));
});

window.addEventListener('popstate', () => {
  loadFromCurrentUrl().catch(showLessonError);
});

loadFromCurrentUrl({ focus: false }).catch(showLessonError);
