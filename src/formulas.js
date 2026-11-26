import 'katex/dist/katex.min.css';
import './styles/main.css';
import './styles/formulas.css';
import catalogue from './data/formulas.json';
import { renderMath } from './lib/katex-render.js';
import { mountSharedLayout } from './lib/shared-layout.js';
import { updateScrollableRegion } from './lib/scroll-region.js';
import {
  addBookmark,
  listBookmarks,
  removeBookmark,
} from './lib/api-client.js';
import { replayMotion } from './lib/motion.js';

mountSharedLayout();

const formulas = catalogue.entries;
const sections = catalogue.sections;
const sectionById = new Map(sections.map((section) => [section.id, section]));
const formulaById = new Map(formulas.map((formula) => [formula.id, formula]));
const searchInput = document.querySelector('#formula-search');
const topicFilter = document.querySelector('#topic-filter');
const typeFilter = document.querySelector('#tag-filter');
const results = document.querySelector('#formula-results');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const copyStatus = document.querySelector('#copy-status');
const bookmarkStatus = document.querySelector('#bookmark-status');
const bookmarkedFormulaIds = new Set();
let bookmarksReady = false;

function labelForType(type) {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function addOptions(select, values) {
  for (const { value, label } of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
}

function appendMath(element, latex) {
  try {
    element.innerHTML = renderMath(latex, true);
  } catch {
    element.textContent = latex;
  }
}

function createExpression(expression, formula) {
  const wrapper = document.createElement('div');
  wrapper.className = 'formula-expression';

  if (expression.label) {
    const label = document.createElement('p');
    label.className = 'formula-expression-label';
    label.textContent = expression.label;
    wrapper.append(label);
  }

  const equation = document.createElement('div');
  equation.className = 'formula-equation';
  appendMath(equation, expression.latex);
  wrapper.append(equation);

  return wrapper;
}

function createLessonLink(formula) {
  if (!formula.lessonId) {
    const reference = document.createElement('p');
    reference.className = 'formula-lesson-reference';
    reference.textContent = 'Shared / implementation reference';
    return reference;
  }

  const link = document.createElement('a');
  link.className = 'formula-lesson-link';
  link.href = `/lessons/${formula.lessonId}.html`;
  link.textContent = `Open lesson · ${formula.lessonTitle}`;
  link.setAttribute(
    'aria-label',
    `Open lesson ${formula.lessonTitle}, ${formula.lessonCode}`,
  );
  return link;
}

function createSourceDisclosure(formula) {
  const details = document.createElement('details');
  details.className = 'formula-source';

  const summary = document.createElement('summary');
  summary.textContent = 'Source and reference';

  const list = document.createElement('dl');
  list.className = 'source-list';
  const fields = [
    ['Catalogue ID', formula.catalogueId],
    ['Classification', formula.classification],
    ['Content-pack line', formula.sourceLocation],
    ['Lesson code', formula.lessonCode],
  ];
  if (formula.sourceNote) fields.push(['Source note', formula.sourceNote]);

  for (const [term, value] of fields) {
    const item = document.createElement('div');
    const label = document.createElement('dt');
    const text = document.createElement('dd');
    label.textContent = term;
    text.textContent = value;
    item.append(label, text);
    list.append(item);
  }

  details.append(summary, list);
  return details;
}

function createFormulaEntry(formula) {
  const entry = document.createElement('article');
  entry.className = 'formula-entry';
  entry.id = formula.id;
  entry.tabIndex = -1;

  const heading = document.createElement('div');
  heading.className = 'formula-heading';

  const sectionLabel = document.createElement('p');
  sectionLabel.className = 'formula-topic';
  sectionLabel.textContent = formula.sectionTitle;

  const nameRow = document.createElement('div');
  nameRow.className = 'formula-name-row';
  const name = document.createElement('h3');
  name.textContent = formula.name;
  const permalink = document.createElement('a');
  permalink.className = 'formula-permalink';
  permalink.href = `#${formula.id}`;
  permalink.setAttribute('aria-label', `Link directly to ${formula.name}`);
  permalink.textContent = '#';
  nameRow.append(name, permalink);

  heading.append(nameRow, sectionLabel);
  if (formula.kind === 'advanced' || formula.referenceType === 'approximation') {
    const badge = document.createElement('p');
    badge.className = 'formula-badge';
    badge.textContent = formula.referenceType === 'approximation'
      ? 'Approximate'
      : 'Optional';
    heading.append(badge);
  }

  const expressions = document.createElement('div');
  expressions.className = 'formula-expressions';
  if (formula.expressions.length) {
    expressions.append(...formula.expressions.map((expression) =>
      createExpression(expression, formula)));
  } else {
    const rule = document.createElement('p');
    rule.className = 'formula-rule';
    rule.textContent = formula.notes.join(' ');
    expressions.append(rule);
  }

  const explanation = document.createElement('div');
  explanation.className = 'formula-explanation';
  const conditions = document.createElement('p');
  conditions.className = 'formula-conditions';
  const conditionLabel = document.createElement('strong');
  conditionLabel.textContent = 'Conditions ';
  conditions.append(conditionLabel, document.createTextNode(formula.conditions));
  explanation.append(conditions);

  if (formula.expressions.length && formula.notes.length) {
    const note = document.createElement('p');
    note.className = 'formula-note';
    note.textContent = formula.notes.join(' ');
    explanation.append(note);
  }
  explanation.append(createLessonLink(formula));

  const footer = document.createElement('footer');
  footer.className = 'formula-entry-footer';
  const bookmarkButton = document.createElement('button');
  bookmarkButton.type = 'button';
  bookmarkButton.className = 'bookmark-toggle';
  bookmarkButton.dataset.formulaId = formula.id;
  bookmarkButton.disabled = !bookmarksReady;
  bookmarkButton.setAttribute(
    'aria-pressed',
    String(bookmarkedFormulaIds.has(formula.id)),
  );
  bookmarkButton.textContent = bookmarkedFormulaIds.has(formula.id)
    ? 'Remove bookmark'
    : 'Save bookmark';

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'copy-latex';
  copyButton.dataset.formulaId = formula.id;
  copyButton.textContent = formula.expressions.length ? 'Copy LaTeX' : 'Copy rule';
  footer.append(bookmarkButton, copyButton);

  entry.append(heading, expressions, explanation);
  entry.append(createSourceDisclosure(formula), footer);
  return entry;
}

function createGroup(section, filteredFormulas) {
  const group = document.createElement('section');
  group.className = `formula-group formula-group--${section.kind}`;
  group.id = `section-${section.id}`;
  group.setAttribute('aria-labelledby', `section-title-${section.id}`);

  const header = document.createElement('header');
  header.className = 'formula-group-header';
  const heading = document.createElement('div');
  const index = document.createElement('p');
  index.className = 'formula-group-index';
  index.textContent = section.kind === 'module'
    ? `Module ${String(section.order).padStart(2, '0')}`
    : section.kind === 'advanced' ? 'Optional reference' : 'Shared reference';
  const title = document.createElement('h2');
  title.id = `section-title-${section.id}`;
  title.textContent = section.title;
  heading.append(index, title);

  const count = document.createElement('p');
  count.className = 'formula-group-count';
  count.textContent = `${filteredFormulas.length} ${filteredFormulas.length === 1 ? 'entry' : 'entries'}`;
  header.append(heading, count);
  group.append(header);

  if (section.note) {
    const note = document.createElement('p');
    note.className = 'formula-group-note';
    note.textContent = section.note;
    group.append(note);
  }

  if (section.notation) {
    const notation = document.createElement('details');
    notation.className = 'formula-notation';
    const summary = document.createElement('summary');
    summary.textContent = 'Module notation';
    const text = document.createElement('p');
    text.textContent = section.notation;
    notation.append(summary, text);
    group.append(notation);
  }

  const entries = document.createElement('div');
  entries.className = 'formula-group-entries';
  entries.append(...filteredFormulas.map(createFormulaEntry));
  group.append(entries);
  return group;
}

function matchesSearch(formula, query) {
  if (!query) return true;
  const terms = query.split(/\s+/).filter(Boolean);
  const section = sectionById.get(formula.sectionId);
  const searchableText = [
    formula.name,
    formula.catalogueId,
    section?.title ?? '',
    formula.lessonCode,
    formula.lessonTitle,
    formula.classification,
    formula.conditions,
    formula.sourceNote,
    ...formula.notes,
    ...formula.tags,
    ...formula.expressions.flatMap(({ label, latex }) => [label ?? '', latex]),
  ]
    .join(' ')
    .toLocaleLowerCase();

  return terms.every((term) => searchableText.includes(term));
}

function renderResults() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const selectedSection = topicFilter.value;
  const selectedType = typeFilter.value;
  const filteredFormulas = formulas.filter((formula) => {
    const matchesSection = !selectedSection || formula.sectionId === selectedSection;
    const matchesType = !selectedType || formula.referenceType === selectedType;
    return matchesSection && matchesType && matchesSearch(formula, query);
  });

  const groups = sections
    .map((section) => ({
      section,
      entries: filteredFormulas.filter((formula) => formula.sectionId === section.id),
    }))
    .filter(({ entries }) => entries.length)
    .map(({ section, entries }) => createGroup(section, entries));

  results.replaceChildren(...groups);
  for (const equation of results.querySelectorAll('.formula-equation')) {
    const formula = equation.closest('.formula-entry');
    updateScrollableRegion(equation, `Formula expression for ${formula?.id ?? 'entry'}`);
  }
  resultCount.textContent = `Showing ${filteredFormulas.length} of ${formulas.length} catalogue entries`;
  emptyState.hidden = filteredFormulas.length > 0;
  return filteredFormulas;
}

function showDeepLinkedFormula() {
  const id = decodeURIComponent(window.location.hash.slice(1)).toLocaleLowerCase();
  if (!formulaById.has(id) && !sectionById.has(id)) return;

  searchInput.value = '';
  topicFilter.value = '';
  typeFilter.value = '';
  renderResults();

  requestAnimationFrame(() => {
    const target = formulaById.has(id)
      ? document.getElementById(id)
      : document.getElementById(`section-${id}`);
    replayMotion(target, 'motion-enter');
    target?.focus?.({ preventScroll: true });
    target?.scrollIntoView({ block: 'start' });
  });
}

addOptions(topicFilter, sections.map((section) => ({
  value: section.id,
  label: section.title,
})));
addOptions(typeFilter, [...new Set(formulas.map(({ referenceType }) => referenceType))]
  .sort()
  .map((type) => ({ value: type, label: labelForType(type) })));
renderResults();

async function loadBookmarks() {
  bookmarkStatus.textContent = 'Loading saved bookmarks…';
  try {
    const result = await listBookmarks();
    const activeId = document.activeElement?.id;
    bookmarkedFormulaIds.clear();
    for (const bookmark of result.bookmarks) {
      if (formulaById.has(bookmark.formulaId)) {
        bookmarkedFormulaIds.add(bookmark.formulaId);
      }
    }
    bookmarksReady = true;
    renderResults();
    if (activeId && formulaById.has(activeId)) {
      document.getElementById(activeId)?.focus({ preventScroll: true });
    }
    if (result.offline) {
      bookmarkStatus.textContent = result.locallyStored
        ? 'Offline. Bookmarks are saved on this device and will sync when the service returns.'
        : 'Offline. Device storage is unavailable, so bookmarks last only until this page closes.';
    } else {
      bookmarkStatus.textContent = result.locallyStored
        ? 'Bookmarks are ready.'
        : 'Bookmarks are available online, but this device cannot save an offline copy.';
    }
  } catch (error) {
    bookmarksReady = true;
    renderResults();
    bookmarkStatus.textContent = `Bookmarks could not be loaded: ${error.message}`;
  }
}

async function toggleBookmark(button) {
  const formulaId = button.dataset.formulaId;
  if (!formulaById.has(formulaId)) {
    bookmarkStatus.textContent = 'Could not find the formula to bookmark.';
    return;
  }

  const wasBookmarked = bookmarkedFormulaIds.has(formulaId);
  button.disabled = true;
  button.textContent = wasBookmarked ? 'Removing…' : 'Saving…';
  try {
    const result = wasBookmarked
      ? await removeBookmark(formulaId)
      : await addBookmark(formulaId);

    if (wasBookmarked) bookmarkedFormulaIds.delete(formulaId);
    else bookmarkedFormulaIds.add(formulaId);

    if (button.isConnected) {
      button.setAttribute('aria-pressed', String(!wasBookmarked));
      button.textContent = wasBookmarked ? 'Save bookmark' : 'Remove bookmark';
    }
    bookmarkStatus.textContent = result.offline
      ? result.locallyStored
        ? `${wasBookmarked ? 'Removed' : 'Saved'} on this device. The change will sync when the service returns.`
        : 'Device storage is unavailable, so this change will last only until the page closes.'
      : wasBookmarked
        ? 'Bookmark removed.'
        : 'Bookmark saved.';
  } catch (error) {
    bookmarkStatus.textContent = `Could not update bookmark: ${error.message}`;
    if (button.isConnected) {
      button.textContent = wasBookmarked ? 'Remove bookmark' : 'Save bookmark';
      button.setAttribute('aria-pressed', String(wasBookmarked));
    }
  } finally {
    if (button.isConnected) button.disabled = false;
  }
}

function copyText(formula) {
  if (!formula.expressions.length) return formula.notes.join('\n');
  return formula.expressions
    .map(({ label, latex }) => (label ? `% ${label}\n${latex}` : latex))
    .join('\n');
}

void loadBookmarks();

searchInput.addEventListener('input', renderResults);
topicFilter.addEventListener('change', renderResults);
typeFilter.addEventListener('change', renderResults);
window.addEventListener('hashchange', showDeepLinkedFormula);
window.addEventListener('resize', () => {
  for (const equation of results.querySelectorAll('.formula-equation')) {
    const formula = equation.closest('.formula-entry');
    updateScrollableRegion(equation, `Formula expression for ${formula?.id ?? 'entry'}`);
  }
});

document.querySelector('#reset-filters').addEventListener('click', (event) => {
  event.preventDefault();
  searchInput.value = '';
  topicFilter.value = '';
  typeFilter.value = '';
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }
  renderResults();
  searchInput.focus();
});

results.addEventListener('click', async (event) => {
  const bookmarkButton = event.target.closest('.bookmark-toggle');
  if (bookmarkButton) {
    await toggleBookmark(bookmarkButton);
    return;
  }

  const button = event.target.closest('.copy-latex');
  if (!button) return;
  const formula = formulaById.get(button.dataset.formulaId);
  if (!formula) {
    copyStatus.textContent = 'Could not find the formula to copy.';
    return;
  }

  try {
    await navigator.clipboard.writeText(copyText(formula));
    copyStatus.textContent = formula.expressions.length
      ? `LaTeX copied for ${formula.name}.`
      : `Rule copied for ${formula.name}.`;
  } catch {
    copyStatus.textContent =
      'Could not copy the formula. Check clipboard permissions and try again.';
  }
});

if (window.location.hash) {
  showDeepLinkedFormula();
}
