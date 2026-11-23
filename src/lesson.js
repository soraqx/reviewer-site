import './styles/main.css';
import './styles/lesson.css';
import './styles/course.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import { renderLesson } from './lib/lesson-renderer.js';
import course from './data/course.generated.json';
import { mountPolygonExplorer } from './sims/polygon-vocabulary.js';
import { mountCourseExplorer } from './sims/course-explorer.js';

mountSharedLayout();

async function initializeLesson() {
  const requestedLessonId = new URLSearchParams(window.location.search).get('lesson')
    ?? window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const lessonId = requestedLessonId === 'polygon-vocabulary' ? 'poly-01' : requestedLessonId;
  const lessonMetadata = course.lessons.find(({ id }) => id === lessonId);
  if (!lessonMetadata) {
    throw new Error(`Unknown lesson route "${lessonId}".`);
  }

  const lessonResponse = await fetch(`/generated/lessons/${lessonId}.json`);
  if (!lessonResponse.ok) {
    throw new Error(`Could not load lesson "${lessonId}" (${lessonResponse.status}).`);
  }
  const lesson = await lessonResponse.json();
  if (lesson.id !== lessonMetadata.id || lesson.moduleId !== lessonMetadata.moduleId) {
    throw new Error(`Lesson data does not match route "${lessonId}".`);
  }

  renderLesson(lesson, course);
  const isPolygonLesson = lesson.id === 'poly-01';
  document.querySelector('#polygon-simulation').hidden = !isPolygonLesson;
  document.querySelector('#course-simulation').hidden = isPolygonLesson;
  if (isPolygonLesson) mountPolygonExplorer();
  else mountCourseExplorer(lesson);
}

initializeLesson().catch((error) => {
  document.querySelector('#lesson-title').textContent = 'Lesson unavailable.';
  document.querySelector('#lesson-lede').textContent =
    'This lesson could not be loaded. Please try again later.';
  console.error(error);
});
