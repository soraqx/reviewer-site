export function lessonIdFromUrl(value) {
  const url = new URL(value, 'http://fieldnotes.local');
  const match = url.pathname.match(/^\/lessons\/([a-z0-9-]+)\.html$/);
  if (!match) return url.searchParams.get('lesson');
  if (match[1] === 'polygon-vocabulary') {
    return url.searchParams.get('lesson') ?? 'poly-01';
  }
  return match[1];
}

export function lessonUrl(lessonId, value = window.location.href) {
  const url = new URL(value, 'http://fieldnotes.local');
  url.pathname = `/lessons/${lessonId}.html`;
  url.searchParams.delete('lesson');
  return `${url.pathname}${url.search}${url.hash}`;
}

export function firstLessonId(course, moduleId) {
  return course.modules.find(({ id }) => id === moduleId)?.lessons[0]?.id ?? null;
}
