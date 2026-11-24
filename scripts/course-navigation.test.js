import test from 'node:test';
import assert from 'node:assert/strict';
import { firstLessonId, lessonIdFromUrl, lessonUrl } from '../src/lib/course-navigation.js';

const course = {
  modules: [
    { id: 'triangles', lessons: [{ id: 'tri-01' }, { id: 'tri-02' }] },
    { id: 'cones', lessons: [{ id: 'cone-01' }] },
  ],
};

test('resolves lesson routes and the development shell query', () => {
  assert.equal(lessonIdFromUrl('https://fieldnotes.test/lessons/tri-02.html'), 'tri-02');
  assert.equal(lessonIdFromUrl('https://fieldnotes.test/lessons/polygon-vocabulary.html?lesson=cyl-03'), 'cyl-03');
  assert.equal(lessonIdFromUrl('https://fieldnotes.test/lessons/polygon-vocabulary.html'), 'poly-01');
});

test('keeps unrelated query and hash state when changing lesson routes', () => {
  assert.equal(
    lessonUrl('cone-01', 'https://fieldnotes.test/lessons/tri-01.html?mode=review&lesson=tri-01#examples'),
    '/lessons/cone-01.html?mode=review#examples',
  );
});

test('selecting a module opens its first lesson', () => {
  assert.equal(firstLessonId(course, 'cones'), 'cone-01');
  assert.equal(firstLessonId(course, 'unknown'), null);
});
