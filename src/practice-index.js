import './styles/main.css';
import './styles/course.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import course from './data/course.generated.json';

mountSharedLayout();

async function initializePractice() {
  const practiceResponse = await fetch('/generated/practice.json');
  if (!practiceResponse.ok) {
    throw new Error(`Could not load practice archive (${practiceResponse.status}).`);
  }
  const practiceItems = await practiceResponse.json();
  const moduleSelect = document.querySelector('#practice-module');
  const query = document.querySelector('#practice-query');
  const count = document.querySelector('#practice-count');
  const list = document.querySelector('#practice-list');
  document.querySelector('.practice-search').addEventListener('submit', (event) => {
    event.preventDefault();
  });

  for (const module of course.modules) {
    const option = document.createElement('option');
    option.value = module.id;
    option.textContent = module.title;
    moduleSelect.append(option);
  }

  const entries = new Map();
  for (const module of course.modules) {
    const items = practiceItems.filter((item) => item.moduleId === module.id);
    if (!items.length) continue;

    const section = document.createElement('section');
    section.className = 'practice-module';
    section.dataset.module = module.id;
    const heading = document.createElement('h2');
    heading.textContent = module.title;
    section.append(heading);

    for (const practice of items) {
      const entry = document.createElement('article');
      entry.className = 'practice-item';
      const searchable = document.createElement('div');
      searchable.innerHTML = practice.promptHtml;
      entry.dataset.search = `${practice.id} ${searchable.textContent} ${practice.source}`.toLowerCase();

      const question = document.createElement('div');
      question.className = 'practice-prompt';
      question.innerHTML = practice.promptHtml;
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const id = document.createElement('strong');
      id.textContent = practice.id;
      const prompt = document.createElement('span');
      prompt.textContent = 'Reveal answer and teaching note';
      summary.append(id, prompt);
      const answer = document.createElement('div');
      answer.className = 'practice-answer';
      const label = document.createElement('p');
      label.textContent = 'Answer and teaching note';
      const content = document.createElement('div');
      content.innerHTML = practice.answerHtml;
      answer.append(label, content);
      if (practice.source) {
        const source = document.createElement('p');
        source.className = 'module-prerequisite';
        source.textContent = practice.source;
        answer.append(source);
      }
      details.append(summary, answer);
      entry.append(question, details);
      section.append(entry);
      entries.set(entry, module.id);
    }
    list.append(section);
  }

  function filterPractice() {
    const selectedModule = moduleSelect.value;
    const term = query.value.trim().toLowerCase();
    let visibleCount = 0;
    const visibleModules = new Set();
    for (const [entry, moduleId] of entries) {
      const matches = (!selectedModule || moduleId === selectedModule)
        && (!term || entry.dataset.search.includes(term));
      entry.hidden = !matches;
      if (matches) {
        visibleCount += 1;
        visibleModules.add(moduleId);
      }
    }
    for (const section of list.children) {
      section.hidden = !visibleModules.has(section.dataset.module);
    }
    count.textContent = `${visibleCount} practice ${visibleCount === 1 ? 'item' : 'items'} shown.`;
  }

  moduleSelect.addEventListener('change', filterPractice);
  query.addEventListener('input', filterPractice);
  filterPractice();
}

initializePractice().catch((error) => {
  document.querySelector('#practice-count').textContent = 'Practice archive could not be loaded.';
  console.error(error);
});
