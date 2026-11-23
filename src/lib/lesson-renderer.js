import { appendInlineMath } from './katex-render.js';

function appendRichText(container, text) {
  appendInlineMath(container, text);
}

export function renderLesson(lesson) {
  document.title = `${lesson.title}: Fieldnotes`;
  document.querySelector('#lesson-kicker').textContent =
    `MODULE ${String(lesson.moduleOrder).padStart(2, '0')} / LESSON ${String(lesson.lessonOrder).padStart(2, '0')} · ${lesson.moduleTitle}`;
  document.querySelector('#lesson-title').textContent = lesson.title;
  document.querySelector('#lesson-lede').textContent = lesson.lead;

  const outcomes = document.querySelector('#lesson-outcomes');
  outcomes.replaceChildren(
    ...lesson.outcomes.map((outcome) => {
      const item = document.createElement('li');
      appendRichText(item, outcome);
      return item;
    }),
  );

  const concepts = document.querySelector('#lesson-concepts');
  concepts.replaceChildren(
    ...lesson.concepts.map(({ heading, paragraphs }) => {
      const section = document.createElement('section');
      const title = document.createElement('h3');
      title.textContent = heading;
      section.append(title);
      for (const paragraphText of paragraphs) {
        const paragraph = document.createElement('p');
        appendRichText(paragraph, paragraphText);
        section.append(paragraph);
      }
      return section;
    }),
  );

  const vocabulary = document.querySelector('#lesson-vocabulary');
  vocabulary.replaceChildren(
    ...lesson.vocabulary.flatMap(({ term, definition }) => {
      const title = document.createElement('dt');
      title.textContent = term;
      const description = document.createElement('dd');
      appendRichText(description, definition);
      return [title, description];
    }),
  );

  document.querySelector('#lesson-source').textContent = lesson.source.citation;
  document.querySelector('#lesson-attribution').textContent = lesson.attribution;
}
