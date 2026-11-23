import 'katex/dist/katex.min.css';
import './styles/main.css';
import './styles/formulas.css';
import formulas from './data/formulas.json';
import { renderMath } from './lib/katex-render.js';
import { mountSharedLayout } from './lib/shared-layout.js';
import { updateScrollableRegion } from './lib/scroll-region.js';
import {
  addBookmark,
  listBookmarks,
  removeBookmark,
} from './lib/api-client.js';

mountSharedLayout();

const searchInput = document.querySelector('#formula-search');
const topicFilter = document.querySelector('#topic-filter');
const tagFilter = document.querySelector('#tag-filter');
const results = document.querySelector('#formula-results');
const resultCount = document.querySelector('#result-count');
const emptyState = document.querySelector('#empty-state');
const copyStatus = document.querySelector('#copy-status');
const bookmarkStatus = document.querySelector('#bookmark-status');
const formulaById = new Map(formulas.map((formula) => [formula.id, formula]));
const bookmarkedFormulaIds = new Set();
let bookmarksReady = false;

function addOptions(select, values) {
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value.toLocaleLowerCase();
    option.textContent = value;
    select.append(option);
  }
}

function createVariableList(variables) {
  const list = document.createElement('dl');
  list.className = 'variable-list';

  for (const variable of variables) {
    const item = document.createElement('div');
    item.className = 'variable-item';

    const term = document.createElement('dt');
    term.innerHTML = renderMath(variable.symbol);
    const meaning = document.createElement('dd');
    meaning.textContent = variable.meaning;
    const unit = document.createElement('dd');
    unit.className = 'variable-unit';
    unit.textContent = variable.unit;

    item.append(term, meaning, unit);
    list.append(item);
  }

  return list;
}

function createFormulaEntry(formula) {
  const entry = document.createElement('article');
  entry.className = 'formula-entry';
  entry.id = formula.id;
  entry.tabIndex = -1;

  const heading = document.createElement('div');
  heading.className = 'formula-heading';
  const topic = document.createElement('p');
  topic.className = 'formula-topic';
  topic.textContent = formula.topic;
  const nameRow = document.createElement('div');
  nameRow.className = 'formula-name-row';
  const name = document.createElement('h2');
  name.textContent = formula.name;
  const permalink = document.createElement('a');
  permalink.className = 'formula-permalink';
  permalink.href = `#${formula.id}`;
  permalink.setAttribute('aria-label', `Link directly to ${formula.name}`);
  permalink.textContent = '#';
  nameRow.append(name, permalink);
  heading.append(nameRow, topic);

  const equation = document.createElement('div');
  equation.className = 'formula-equation';
  equation.innerHTML = renderMath(formula.latex, true);

  const explanation = document.createElement('div');
  explanation.className = 'formula-explanation';
  const notes = document.createElement('p');
  notes.textContent = formula.notes;
  const conditions = document.createElement('p');
  conditions.className = 'formula-conditions';
  const conditionLabel = document.createElement('strong');
  conditionLabel.textContent = 'Use when ';
  conditions.append(conditionLabel, document.createTextNode(formula.conditions));
  explanation.append(notes, conditions);

  const variableSection = document.createElement('section');
  variableSection.className = 'formula-variables';
  const variablesHeading = document.createElement('h3');
  variablesHeading.textContent = 'Variables';
  variableSection.append(variablesHeading, createVariableList(formula.variables));

  const footer = document.createElement('footer');
  footer.className = 'formula-entry-footer';
  const tags = document.createElement('ul');
  tags.className = 'formula-tags';
  tags.setAttribute('aria-label', 'Formula tags');
  for (const tag of formula.tags) {
    const item = document.createElement('li');
    item.textContent = tag;
    tags.append(item);
  }

  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'copy-latex';
  copyButton.dataset.formulaId = formula.id;
  copyButton.textContent = 'Copy LaTeX';

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
  footer.append(tags, bookmarkButton, copyButton);

  entry.append(heading, equation, explanation, variableSection, footer);
  return entry;
}

function matchesSearch(formula, query) {
  if (!query) return true;

  const searchableText = [
    formula.name,
    formula.topic,
    formula.latex,
    formula.notes,
    formula.conditions,
    ...formula.variables.flatMap(({ symbol, meaning, unit }) => [symbol, meaning, unit]),
    ...formula.tags,
  ]
    .join(' ')
    .toLocaleLowerCase();

  return searchableText.includes(query);
}

function renderResults() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const selectedTopic = topicFilter.value;
  const selectedTag = tagFilter.value;
  const filteredFormulas = formulas.filter((formula) => {
    const matchesTopic =
      !selectedTopic || formula.topic.toLocaleLowerCase() === selectedTopic;
    const matchesTag =
      !selectedTag || formula.tags.some((tag) => tag.toLocaleLowerCase() === selectedTag);
    return matchesTopic && matchesTag && matchesSearch(formula, query);
  });

  results.replaceChildren(
    ...filteredFormulas.map((formula) =>
      createFormulaEntry(formula),
    ),
  );
  for (const formula of filteredFormulas) {
    const equation = document.getElementById(formula.id).querySelector('.formula-equation');
    updateScrollableRegion(equation, `Equation for ${formula.name}`);
  }
  resultCount.textContent = `Showing ${filteredFormulas.length} of ${formulas.length} formulas`;
  emptyState.hidden = filteredFormulas.length > 0;
  return filteredFormulas;
}

function showDeepLinkedFormula() {
  const id = window.location.hash.slice(1);
  if (!formulaById.has(id)) return;

  searchInput.value = '';
  topicFilter.value = '';
  tagFilter.value = '';
  renderResults();

  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start' });
  });
}

addOptions(topicFilter, [...new Set(formulas.map(({ topic }) => topic))]);
addOptions(tagFilter, [...new Set(formulas.flatMap(({ tags }) => tags))].sort());
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
  const formula = formulaById.get(formulaId);
  if (!formula) {
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

    if (wasBookmarked) {
      bookmarkedFormulaIds.delete(formulaId);
    } else {
      bookmarkedFormulaIds.add(formulaId);
    }
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

void loadBookmarks();

searchInput.addEventListener('input', renderResults);
topicFilter.addEventListener('change', renderResults);
tagFilter.addEventListener('change', renderResults);
window.addEventListener('hashchange', showDeepLinkedFormula);
window.addEventListener('resize', () => {
  for (const formula of formulas) {
    const equation = document.getElementById(formula.id)?.querySelector('.formula-equation');
    if (equation) updateScrollableRegion(equation, `Equation for ${formula.name}`);
  }
});

document.querySelector('#reset-filters').addEventListener('click', (event) => {
  event.preventDefault();
  searchInput.value = '';
  topicFilter.value = '';
  tagFilter.value = '';
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
    await navigator.clipboard.writeText(formula.latex);
    copyStatus.textContent = `LaTeX copied for ${formula.name}.`;
  } catch {
    copyStatus.textContent =
      'Could not copy LaTeX. Check clipboard permissions and try again.';
  }
});

if (window.location.hash) {
  showDeepLinkedFormula();
}
