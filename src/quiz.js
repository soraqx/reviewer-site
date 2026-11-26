import './styles/main.css';
import './styles/quiz.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import { renderMath } from './lib/katex-render.js';
import {
  createQuizSession,
  getEligibleQuestions,
  gradeChoice,
  gradeRecall,
  questionBank,
  questionById,
  quizModules,
  seedRandom,
  selectQuestions,
} from './lib/quiz-session.js';
import {
  ACTIVE_SESSION_KEY,
  clearQuizProgress,
  loadQuizProgress,
  saveQuizProgress,
  updateQuestionProgress,
} from './lib/quiz-progress.js';
import { formulaQuestions } from './data/quiz-formulas.js';
import { replayMotion } from './lib/motion.js';

mountSharedLayout();

const app = document.querySelector('#quiz-app');
const moduleById = new Map(quizModules.map((module) => [module.id, module]));
const categories = [
  { id: 'formula', label: 'Formula Practice' },
  { id: 'problem', label: 'Problem Solving' },
  { id: 'vocabulary', label: 'Vocabulary Recall' },
];
let progressState = loadQuizProgress();
let progress = progressState.data;
let progressMessage = progressState.message;
let activeSession = null;
let timer = null;
let approvedLeave = false;
let currentView = 'setup';

function element(tag, className = '', text = '') {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text) result.textContent = text;
  return result;
}

function makeButton(text, action, style = 'primary') {
  const button = element('button', `quiz-button${style === 'secondary' ? ' quiz-button--secondary' : ''}`, text);
  button.type = 'button';
  button.dataset.action = action;
  return button;
}

function writeProgress() {
  const saved = saveQuizProgress(progress);
  if (saved.saved) {
    progressState.available = true;
    progressMessage = saved.message;
  } else {
    progressState.available = false;
    progressMessage = saved.message;
  }
  updateStorageStatus();
}

function updateStorageStatus() {
  const status = app.querySelector('[data-storage-status]');
  if (status) {
    status.textContent = progressMessage
      || (progressState.available
        ? 'Quiz progress is stored separately from lesson progress on this device.'
        : 'Progress is available for this visit but cannot be stored on this device.');
  }
}

function currentUrl() {
  return new URL(window.location.href);
}

function updateSetupUrl({ moduleId, category, mode }, replace = true) {
  const url = currentUrl();
  url.search = '';
  if (moduleId) url.searchParams.set('module', moduleId);
  if (category) url.searchParams.set('category', category);
  if (mode) url.searchParams.set('mode', mode);
  const state = { view: 'setup', moduleId, category, mode };
  if (replace) history.replaceState(state, '', `${url.pathname}${url.search}`);
  else history.pushState(state, '', `${url.pathname}${url.search}`);
}

function storeActiveSession() {
  try {
    window.sessionStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
    return true;
  } catch {
    progressMessage = 'This run can continue, but the browser could not preserve it through a refresh.';
    updateStorageStatus();
    return false;
  }
}

function clearStoredSession() {
  try {
    window.sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    progressMessage = 'The active run could not be cleared from browser session storage.';
    updateStorageStatus();
  }
}

function readStoredSession() {
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (
      !saved
      || !Array.isArray(saved.questionIds)
      || saved.questionIds.some((id) => !questionById.has(id))
      || !Array.isArray(saved.results)
      || !saved.optionOrders
    ) {
      progressMessage = 'A saved run could not be restored because its session data is incomplete.';
      return null;
    }
    return saved;
  } catch {
    progressMessage = 'A saved run could not be read from browser session storage.';
    return null;
  }
}

function categoryName(category) {
  return categories.find((item) => item.id === category)?.label ?? 'Mixed Review';
}

function moduleName(moduleId) {
  return moduleById.get(moduleId)?.title ?? 'Geometry';
}

function selectedCategories(category, mixedCategories) {
  return category === 'mixed' ? mixedCategories : [category];
}

function getSetupPool(form) {
  const category = form.elements.category.value;
  const mixed = [...form.querySelectorAll('input[name="mixedCategory"]:checked')]
    .map((input) => input.value);
  const moduleId = form.elements.moduleId.value;
  return getEligibleQuestions({
    categories: selectedCategories(category, mixed),
    moduleIds: moduleId ? [moduleId] : [],
  });
}

function refreshSetupAvailability(form) {
  const pool = getSetupPool(form);
  const countSelect = form.elements.questionCount;
  const previous = countSelect.value;
  const choices = [5, 10, 15, 20, 25, 30].filter((count) => count < pool.length);
  countSelect.replaceChildren();
  for (const count of choices) {
    const option = element('option', '', `${count} questions`);
    option.value = String(count);
    countSelect.append(option);
  }
  const allOption = element('option', '', `All ${pool.length} available`);
  allOption.value = 'all';
  countSelect.append(allOption);
  countSelect.value = previous === 'all' || choices.includes(Number(previous))
    ? previous
    : pool.length >= 10 ? '10' : 'all';

  const mixed = form.querySelector('[data-mixed-categories]');
  mixed.hidden = form.elements.category.value !== 'mixed';
  form.querySelector('[data-pool-count]').textContent =
    `${pool.length} eligible ${pool.length === 1 ? 'prompt' : 'prompts'} in this selection.`;
  const start = form.querySelector('[data-action="start"]');
  start.disabled = pool.length === 0;
  if (!pool.length) {
    form.querySelector('[data-pool-count]').textContent =
      'Choose at least one category with available questions.';
  }
}

function statusParagraph(text = '') {
  return element('p', 'quiz-status', text);
}

function createField(labelText, control) {
  const wrapper = element('div', 'quiz-field');
  const label = element('label', '', labelText);
  label.htmlFor = control.id;
  wrapper.append(label, control);
  return wrapper;
}

function renderSetup({ moduleId = '', category = 'formula', mode = 'learn', push = false } = {}) {
  stopTimer();
  activeSession = null;
  currentView = 'setup';
  document.title = 'Quiz: Fieldnotes';
  const section = element('section', 'quiz-workspace');
  const title = element('h2', 'quiz-section-title', 'Choose a practice path.');
  const intro = element(
    'p',
    'quiz-intro',
    'Pick a topic, question type, and feedback style. Formula choices are rendered math, not typed equations.',
  );
  section.append(title, intro);

  const form = element('form', 'quiz-setup-grid');
  form.id = 'quiz-setup';

  const moduleSelect = element('select');
  moduleSelect.id = 'quiz-module';
  moduleSelect.name = 'moduleId';
  const allModules = element('option', '', 'All modules');
  allModules.value = '';
  moduleSelect.append(allModules);
  for (const module of quizModules) {
    const option = element('option', '', `${String(module.order).padStart(2, '0')} · ${module.title}`);
    option.value = module.id;
    moduleSelect.append(option);
  }
  moduleSelect.value = moduleById.has(moduleId) ? moduleId : '';
  form.append(createField('Module', moduleSelect));

  const categorySelect = element('select');
  categorySelect.id = 'quiz-category';
  categorySelect.name = 'category';
  const categoryOptions = [
    ['formula', 'Formula Practice'],
    ['problem', 'Problem Solving'],
    ['vocabulary', 'Vocabulary Recall'],
    ['mixed', 'Mixed Review'],
  ];
  for (const [value, label] of categoryOptions) {
    const option = element('option', '', label);
    option.value = value;
    categorySelect.append(option);
  }
  categorySelect.value = categoryOptions.some(([value]) => value === category) ? category : 'formula';
  form.append(createField('Question category', categorySelect));

  const mixedField = element('fieldset', 'quiz-field quiz-fieldset');
  mixedField.dataset.mixedCategories = '';
  const mixedLegend = element('legend', '', 'Include in Mixed Review');
  const mixedOptions = element('div', 'quiz-choice-list quiz-choice-list--inline');
  for (const item of categories) {
    const label = element('label');
    const input = element('input');
    input.type = 'checkbox';
    input.name = 'mixedCategory';
    input.value = item.id;
    input.checked = item.id !== 'vocabulary';
    const text = element('span', '', item.label);
    label.append(input, text);
    mixedOptions.append(label);
  }
  mixedField.append(mixedLegend, mixedOptions);
  form.append(mixedField);

  const behaviorField = element('fieldset', 'quiz-field quiz-fieldset');
  const behaviorLegend = element('legend', '', 'Feedback timing');
  const behaviorOptions = element('div', 'quiz-choice-list quiz-choice-list--inline');
  for (const [value, labelText, note] of [
    ['learn', 'Learn', 'See the answer and explanation after each lock.'],
    ['test', 'Test', 'See results and explanations after the run.'],
  ]) {
    const label = element('label');
    const input = element('input');
    input.type = 'radio';
    input.name = 'mode';
    input.value = value;
    input.checked = (mode === value);
    const copy = element('span');
    const strong = element('strong', '', labelText);
    const description = element('span', 'quiz-small', note);
    copy.append(strong, document.createElement('br'), description);
    label.append(input, copy);
    behaviorOptions.append(label);
  }
  behaviorField.append(behaviorLegend, behaviorOptions);
  form.append(behaviorField);

  const countSelect = element('select');
  countSelect.id = 'quiz-count';
  countSelect.name = 'questionCount';
  form.append(createField('Run length', countSelect));

  const timerSelect = element('select');
  timerSelect.id = 'quiz-timer';
  timerSelect.name = 'timerSeconds';
  for (const [value, label] of [
    ['0', 'Untimed'],
    ['45', '45 seconds per prompt'],
    ['90', '90 seconds per prompt'],
  ]) {
    const option = element('option', '', label);
    option.value = value;
    timerSelect.append(option);
  }
  form.append(createField('Optional time limit', timerSelect));

  const availability = statusParagraph();
  availability.dataset.poolCount = '';
  availability.setAttribute('aria-live', 'polite');
  form.append(availability);

  const storageNotice = statusParagraph();
  storageNotice.className = 'quiz-storage-status';
  storageNotice.dataset.storageStatus = '';
  form.append(storageNotice);

  const actions = element('div', 'quiz-actions');
  actions.style.gridColumn = '1 / -1';
  const start = makeButton('Start quiz', 'start');
  start.type = 'submit';
  start.dataset.action = 'start';
  actions.append(start);
  const daily = makeButton('Start daily recall', 'daily', 'secondary');
  actions.append(daily);
  form.append(actions);
  section.append(form);

  const timerNote = element(
    'p',
    'quiz-small',
    'Timers use elapsed wall-clock time; the browser’s leave confirmation does not pause a timed run. Daily vocabulary remains separate from untimed formula practice.',
  );
  section.append(timerNote);
  renderProgressOverview(section);

  app.replaceChildren(section);
  replayMotion(section, 'motion-enter');
  updateStorageStatus();
  refreshSetupAvailability(form);
  const selectedMode = form.querySelector(`input[name="mode"][value="${mode === 'test' ? 'test' : 'learn'}"]`);
  if (selectedMode) selectedMode.checked = true;
  form.addEventListener('change', () => {
    refreshSetupAvailability(form);
    updateSetupUrl({
      moduleId: form.elements.moduleId.value,
      category: form.elements.category.value,
      mode: form.elements.mode.value,
    });
  });
  updateSetupUrl({
    moduleId: form.elements.moduleId.value,
    category: form.elements.category.value,
    mode: form.elements.mode.value,
  }, !push);
}

function renderProgressOverview(section) {
  const heading = element('h2', 'quiz-section-title', 'Progress and recent runs.');
  heading.style.marginTop = 'var(--space-2xl)';
  section.append(heading);
  const formulaMastered = formulaQuestions.filter(({ id }) => progress.items[id]?.everCorrect).length;
  const problemQuestions = questionBank.filter(({ category }) => category === 'problem');
  const problemsMastered = problemQuestions.filter(({ id }) => progress.items[id]?.everCorrect).length;
  const recallQuestions = questionBank.filter(({ category }) => category === 'vocabulary');
  const recallMastered = recallQuestions.filter(({ id }) => progress.items[id]?.everCorrect).length;
  const stats = element('div', 'quiz-result-score');
  for (const [value, label] of [
    [`${formulaMastered}/${formulaQuestions.length}`, 'Formula questions mastered'],
    [`${problemsMastered}/${problemQuestions.length}`, 'Problem questions solved once'],
    [`${recallMastered}/${recallQuestions.length}`, 'Recall prompts answered correctly'],
    [`${progress.history.length}`, 'Completed runs on this device'],
  ]) {
    const item = element('p');
    item.append(element('strong', '', value), element('span', 'quiz-small', label));
    stats.append(item);
  }
  section.append(stats);

  const moduleDetails = element('details');
  moduleDetails.className = 'quiz-reference';
  const moduleSummary = element('summary', '', 'Show progress by module');
  moduleDetails.append(moduleSummary);
  for (const module of quizModules) {
    const moduleQuestions = questionBank.filter(({ moduleId }) => moduleId === module.id);
    const mastered = moduleQuestions.filter(({ id }) => progress.items[id]?.everCorrect).length;
    const row = element('div', 'quiz-module-progress');
    row.append(
      element('span', '', module.title),
      element('span', 'quiz-small', `${mastered}/${moduleQuestions.length} ever correct`),
    );
    moduleDetails.append(row);
  }
  section.append(moduleDetails);

  const recentTitle = element('h3', '', 'Recent runs');
  recentTitle.style.marginTop = 'var(--space-lg)';
  section.append(recentTitle);
  if (!progress.history.length) {
    section.append(element('p', 'quiz-muted', 'No completed runs yet. Start with a formula set or a module problem.'));
  } else {
    for (const run of progress.history.slice(0, 8)) {
      const row = element('div', 'quiz-history-row');
      const summary = element('div');
      summary.append(
        element('strong', '', run.label ?? 'Quiz run'),
        element('p', '', `${run.day ?? run.completedAt?.slice(0, 10) ?? 'Previous run'} · ${run.correct}/${run.total} correct`),
      );
      row.append(summary, element('strong', '', `${run.points ?? run.score ?? 0} points`));
      section.append(row);
    }
  }

  if (Object.keys(progress.items).length || progress.history.length) {
    const resetActions = element('div', 'quiz-actions');
    resetActions.append(makeButton('Reset quiz progress', 'reset', 'secondary'));
    section.append(resetActions);
  }
}

function startFromForm(form) {
  const categoriesForRun = selectedCategories(
    form.elements.category.value,
    [...form.querySelectorAll('input[name="mixedCategory"]:checked')].map((input) => input.value),
  );
  const moduleId = form.elements.moduleId.value;
  const pool = getEligibleQuestions({
    categories: categoriesForRun,
    moduleIds: moduleId ? [moduleId] : [],
  });
  const count = form.elements.questionCount.value === 'all'
    ? pool.length
    : Math.min(Number(form.elements.questionCount.value), pool.length);
  const selected = selectQuestions(pool, count);
  const mode = form.elements.mode.value;
  const seconds = Number(form.elements.timerSeconds.value);
  const label = moduleId
    ? moduleName(moduleId)
    : categoriesForRun.length === 1
      ? categoryName(categoriesForRun[0])
      : 'Mixed Review';
  beginRun({
    questions: selected,
    mode,
    seconds,
    label,
    categories: categoriesForRun,
    moduleIds: moduleId ? [moduleId] : [],
    kind: 'practice',
  });
}

function manilaDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function startDailyChallenge() {
  const questions = getEligibleQuestions({ categories: ['vocabulary'] });
  const today = manilaDate();
  const selected = selectQuestions(questions, Math.min(7, questions.length), seedRandom(`geodive-v1-${today}`));
  beginRun({
    questions: selected,
    mode: 'learn',
    seconds: 45,
    label: 'Daily vocabulary challenge',
    categories: ['vocabulary'],
    moduleIds: [],
    kind: 'daily',
    day: today,
    random: seedRandom(`daily-orders-${today}`),
  });
}

function beginRun({
  questions,
  mode,
  seconds,
  label,
  categories: runCategories,
  moduleIds,
  kind,
  day = manilaDate(),
  random = Math.random,
}) {
  if (!questions.length) {
    progressMessage = 'No eligible questions are available for this selection.';
    updateStorageStatus();
    return;
  }
  activeSession = createQuizSession({
    questions,
    mode,
    seconds,
    label,
    categories: runCategories,
    moduleIds,
  }, random);
  activeSession.kind = kind;
  activeSession.day = day;
  activeSession.questionDeadline = seconds ? Date.now() + seconds * 1000 : null;
  currentView = 'run';
  stopTimer();
  storeActiveSession();
  const url = currentUrl();
  url.search = '?run=active';
  history.pushState({ view: 'run' }, '', `${url.pathname}${url.search}`);
  renderQuestion(true);
}

function stopTimer() {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
}

function currentQuestion() {
  return questionById.get(activeSession.questionIds[activeSession.currentIndex]);
}

function currentResult() {
  return activeSession.results[activeSession.currentIndex] ?? null;
}

function answerLabel(question, optionId) {
  const option = question.options.find(({ id }) => id === optionId);
  return option?.accessibleLabel ?? option?.text ?? '';
}

function appendMath(target, latex, displayMode = true) {
  const wrapper = element('span', 'quiz-option-math');
  wrapper.innerHTML = renderMath(latex, displayMode);
  target.append(wrapper);
}

function appendQuestionReference(parent, question) {
  const details = element('details', 'quiz-reference');
  details.append(element('summary', '', 'Source and question reference'));
  details.append(element('p', '', `Question ID: ${question.id}`));
  details.append(element('p', '', `Source: ${question.sourceRefs.join('; ')}`));
  for (const lessonId of question.lessonIds) {
    const lesson = moduleById.get(question.moduleId)?.lessons.find(({ id }) => id === lessonId);
    if (!lesson) continue;
    const link = element('a', '', `Review this lesson: ${lesson.title}`);
    link.href = `/lessons/${lesson.id}.html`;
    details.append(link);
  }
  parent.append(details);
}

function renderChoiceOptions(question, result) {
  const fieldset = element('fieldset', 'quiz-answer-group');
  const legend = element('legend', '', 'Choose one answer');
  fieldset.append(legend);
  const displayedOrder = activeSession.optionOrders[question.id] ?? question.options.map(({ id }) => id);
  for (const optionId of displayedOrder) {
    const option = question.options.find(({ id }) => id === optionId);
    if (!option) continue;
    const label = element('label', 'quiz-option');
    const input = element('input');
    input.type = 'radio';
    input.name = 'quiz-answer';
    input.value = option.id;
    input.checked = activeSession.selectedOptionId === option.id;
    input.disabled = Boolean(result);
    const content = element('span', 'quiz-option-content');
    if (option.latex) appendMath(content, option.latex);
    else content.textContent = option.text;
    label.append(input, content);
    fieldset.append(label);
  }
  return fieldset;
}

function renderRecallInput(result) {
  const wrapper = element('div');
  const label = element('label', '', 'Your answer');
  label.htmlFor = 'quiz-recall-answer';
  const input = element('input', 'quiz-answer-input');
  input.type = 'text';
  input.id = 'quiz-recall-answer';
  input.name = 'quiz-recall-answer';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.maxLength = 120;
  input.placeholder = 'Type one geometric term';
  input.value = activeSession.recallText;
  input.disabled = Boolean(result);
  wrapper.append(label, input);
  return wrapper;
}

function makeFeedback(question, result) {
  const feedback = element('section', 'quiz-feedback motion-feedback');
  feedback.setAttribute('role', 'status');
  if (activeSession.mode === 'test') {
    feedback.append(element('strong', '', 'Answer recorded.'));
    feedback.append(element('p', '', 'Correctness and explanations appear after the final question.'));
    return feedback;
  }

  const isCorrect = result.correct;
  feedback.dataset.correct = String(isCorrect);
  feedback.append(element('strong', '', isCorrect
    ? `Correct · ${result.points} points`
    : result.reason === 'timeout'
      ? 'Time expired · 0 points'
      : result.reason === 'skip'
        ? 'Skipped · 0 points'
        : 'Not quite · 0 points'));
  const correctOption = question.interaction === 'single-choice'
    ? question.options.find(({ id }) => id === question.correctOptionId)
    : null;
  if (correctOption) {
    const correctAnswer = element('p');
    correctAnswer.append(element('strong', '', 'Correct formula or answer:'));
    if (correctOption.latex) appendMath(correctAnswer, correctOption.latex);
    else correctAnswer.append(document.createTextNode(` ${correctOption.text}`));
    feedback.append(correctAnswer);
  }
  if (question.interaction === 'text-recall') {
    const answerSets = element('details', 'quiz-reference');
    answerSets.append(element('summary', '', 'Recognized answers and authored tiers'));
    for (const answer of question.acceptedAnswers) {
      answerSets.append(element('p', '', `${answer.canonical} · ${answer.tier * 100} points`));
    }
    answerSets.append(element(
      'p',
      '',
      'Tiers are authored learning levels, not measured answer rarity.',
    ));
    feedback.append(answerSets);
  }
  feedback.append(element('p', '', question.explanation));
  appendQuestionReference(feedback, question);
  return feedback;
}

function renderQuestion(focusHeading = false) {
  if (!activeSession || activeSession.completed) return;
  stopTimer();
  currentView = 'run';
  const question = currentQuestion();
  const result = currentResult();
  if (!question) {
    finishRun();
    return;
  }

  const section = element('section', 'quiz-workspace');
  const header = element('div', 'quiz-run-header');
  header.append(
    element('h2', '', activeSession.label),
    element('span', 'quiz-muted', `${activeSession.currentIndex + 1} of ${activeSession.questionIds.length}`),
  );
  const timerLabel = element('span', 'quiz-small');
  timerLabel.dataset.timer = '';
  timerLabel.textContent = activeSession.seconds ? `${activeSession.seconds}s remaining` : 'Untimed';
  header.append(timerLabel);
  const progressBar = element('progress', result ? 'quiz-progress' : 'quiz-progress motion-progress-fill');
  progressBar.max = activeSession.questionIds.length;
  progressBar.value = activeSession.currentIndex;
  progressBar.setAttribute('aria-label', 'Quiz progress');
  section.append(header, progressBar);

  const article = element('article', result ? 'quiz-question' : 'quiz-question motion-enter');
  const kicker = element(
    'p',
    'quiz-kicker',
    `${moduleName(question.moduleId)} · ${categoryName(question.category)}`,
  );
  const prompt = element('h2', '', question.prompt);
  prompt.id = 'quiz-question-title';
  prompt.tabIndex = -1;
  article.append(kicker, prompt);
  if (question.symbolDefinitions) {
    article.append(element('p', 'quiz-definition', question.symbolDefinitions));
  }
  if (question.conditions || question.scope) {
    article.append(element('p', 'quiz-condition', question.conditions ?? question.scope));
  }

  if (question.interaction === 'single-choice') {
    article.append(renderChoiceOptions(question, result));
  } else {
    article.append(renderRecallInput(result));
  }
  if (result) article.append(makeFeedback(question, result));

  const actions = element('div', 'quiz-actions');
  const leave = makeButton('Leave quiz', 'leave', 'secondary');
  actions.append(leave);
  if (result) {
    const next = makeButton(
      activeSession.currentIndex + 1 === activeSession.questionIds.length
        ? 'See results'
        : 'Next prompt',
      'next',
    );
    actions.append(next);
  } else {
    actions.append(makeButton('Skip prompt', 'skip', 'secondary'));
    const lock = makeButton(
      question.interaction === 'single-choice' ? 'Lock answer' : 'Submit answer',
      'lock',
    );
    lock.disabled = true;
    actions.append(lock);
  }
  article.append(actions);
  section.append(article);
  section.append(element(
    'p',
    'quiz-small',
    activeSession.mode === 'test'
      ? 'Test mode holds every answer and explanation until the run is complete.'
      : 'Lock your choice to see feedback. Formula and problem answers are worth 100 points; speed adds no points.',
  ));
  app.replaceChildren(section);
  updateStorageStatus();
  if (focusHeading) {
    prompt.focus({ preventScroll: true });
    prompt.scrollIntoView({
      block: 'center',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }
  if (!result && activeSession.seconds) startTimer();
}

function startTimer() {
  if (!activeSession || !activeSession.seconds || currentResult()) return;
  if (!activeSession.questionDeadline) {
    activeSession.questionDeadline = Date.now() + activeSession.seconds * 1000;
    storeActiveSession();
  }
  updateTimer();
  timer = window.setInterval(updateTimer, 250);
}

function updateTimer() {
  if (!activeSession || currentResult() || !activeSession.questionDeadline) return;
  const remainingMs = Math.max(0, activeSession.questionDeadline - Date.now());
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const label = app.querySelector('[data-timer]');
  if (label) label.textContent = `${remainingSeconds}s remaining`;
  if (remainingMs <= 0) settleQuestion('timeout');
}

function settleQuestion(reason = 'answer') {
  if (!activeSession || currentResult()) return;
  stopTimer();
  const question = currentQuestion();
  let correct = false;
  let tier = 0;
  let canonical = null;
  if (reason === 'answer') {
    if (question.interaction === 'single-choice') {
      correct = gradeChoice(question, activeSession.selectedOptionId);
    } else {
      const recall = gradeRecall(question, activeSession.recallText);
      correct = recall.correct;
      tier = recall.tier;
      canonical = recall.canonical;
    }
  }
  const result = {
    questionId: question.id,
    correct,
    reason,
    selectedOptionId: activeSession.selectedOptionId,
    recallText: activeSession.recallText,
    canonical,
    tier,
    points: question.category === 'vocabulary' && correct ? tier * 100 : correct ? 100 : 0,
  };
  activeSession.results[activeSession.currentIndex] = result;
  activeSession.questionDeadline = null;
  progress = updateQuestionProgress(progress, question.id, correct);
  writeProgress();
  storeActiveSession();
  renderQuestion(false);
}

function nextPrompt() {
  if (!activeSession || !currentResult()) return;
  if (activeSession.currentIndex + 1 >= activeSession.questionIds.length) {
    finishRun();
    return;
  }
  activeSession.currentIndex += 1;
  activeSession.selectedOptionId = null;
  activeSession.recallText = '';
  activeSession.questionDeadline = activeSession.seconds
    ? Date.now() + activeSession.seconds * 1000
    : null;
  storeActiveSession();
  renderQuestion(true);
}

function finishRun() {
  if (!activeSession || activeSession.completed) return;
  stopTimer();
  const results = activeSession.results.filter(Boolean);
  const correct = results.filter(({ correct: isCorrect }) => isCorrect).length;
  const points = results.reduce((sum, result) => sum + result.points, 0);
  const completedAt = new Date().toISOString();
  const record = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1_000_000_000)}`,
    day: activeSession.day,
    completedAt,
    kind: activeSession.kind,
    label: activeSession.label,
    categories: activeSession.categories,
    moduleIds: activeSession.moduleIds,
    mode: activeSession.mode,
    seconds: activeSession.seconds,
    score: points,
    points,
    correct,
    total: activeSession.questionIds.length,
    elapsedMs: Date.now() - activeSession.startedAt,
    questionIds: activeSession.questionIds,
    results,
  };
  progress = {
    ...progress,
    history: [record, ...progress.history].slice(0, 60),
  };
  writeProgress();
  activeSession.completed = true;
  activeSession.recordId = record.id;
  activeSession.questionDeadline = null;
  storeActiveSession();
  currentView = 'result';
  const url = currentUrl();
  url.search = `?result=${encodeURIComponent(record.id)}`;
  history.pushState({ view: 'result', resultId: record.id }, '', `${url.pathname}${url.search}`);
  renderResults(record);
}

function renderAnswerValue(parent, question, result, isCorrect) {
  const label = element('p');
  label.append(element('strong', '', isCorrect ? 'Correct answer:' : 'Your answer:'));
  if (question.interaction === 'text-recall') {
    label.append(document.createTextNode(` ${isCorrect
      ? result.canonical ?? result.recallText
      : result.recallText || (result.reason === 'timeout' ? 'No answer — time expired' : 'Skipped')}`));
  } else {
    const optionId = isCorrect ? question.correctOptionId : result.selectedOptionId;
    if (!optionId) {
      label.append(document.createTextNode(` ${result.reason === 'timeout' ? 'No answer — time expired' : 'Skipped'}`));
    } else {
      const option = question.options.find(({ id }) => id === optionId);
      if (option?.latex) appendMath(label, option.latex);
      else label.append(document.createTextNode(` ${answerLabel(question, optionId)}`));
    }
  }
  parent.append(label);
}

function renderReviewItem(questionId, result, index) {
  const question = questionById.get(questionId);
  if (!question) return element('div');
  const details = element('details', 'quiz-review-item');
  if (!result.correct) details.open = true;
  const summary = element('summary');
  summary.append(
    element('strong', '', result.correct ? 'Correct. ' : 'Review. '),
    document.createTextNode(`${index + 1}. ${question.prompt}`),
  );
  details.append(summary);
  const content = element('div', 'quiz-review-content');
  renderAnswerValue(content, question, result, false);
  renderAnswerValue(content, question, result, true);
  content.append(element('p', '', question.explanation));
  if (question.interaction === 'text-recall') {
    const tiers = element('details', 'quiz-reference');
    tiers.append(element('summary', '', 'Accepted vocabulary and authored tiers'));
    for (const answer of question.acceptedAnswers) {
      tiers.append(element('p', '', `${answer.canonical} · ${answer.tier * 100} points`));
    }
    content.append(tiers);
  }
  appendQuestionReference(content, question);
  details.append(content);
  return details;
}

function renderResults(record) {
  stopTimer();
  currentView = 'result';
  document.title = 'Quiz results: Fieldnotes';
  const section = element('section', 'quiz-workspace');
  const missed = record.results.filter(({ correct }) => !correct);
  const accuracy = record.total ? Math.round((record.correct / record.total) * 100) : 0;
  section.append(
    element('p', 'quiz-kicker', `${record.label} · ${record.mode === 'test' ? 'Test' : 'Learn'} mode`),
    element('h2', 'quiz-section-title', 'Run complete.'),
    element('p', 'quiz-intro', `${record.correct} of ${record.total} correct · ${accuracy}% accuracy. Accuracy is separate from points; speed earns no bonus.`),
  );
  const score = element('div', 'quiz-result-score');
  for (const [value, label] of [
    [`${record.points ?? record.score ?? 0}`, 'Points'],
    [`${record.correct}/${record.total}`, 'Correct answers'],
    [`${Math.max(1, Math.round((record.elapsedMs ?? 0) / 60000))} min`, 'Elapsed time'],
  ]) {
    const item = element('p');
    item.append(element('strong', '', value), element('span', 'quiz-small', label));
    score.append(item);
  }
  section.append(score);

  const actions = element('div', 'quiz-actions');
  actions.append(makeButton('Build another quiz', 'setup', 'secondary'));
  if (missed.length) actions.append(makeButton('Retry missed prompts', 'retry'));
  const reviewLesson = record.questionIds
    .map((id) => questionById.get(id))
    .find((question) => question?.lessonIds?.length);
  const returnLink = element('a', 'quiz-link-button', reviewLesson
    ? 'Return to a related lesson'
    : 'Browse lessons');
  returnLink.href = reviewLesson
    ? `/lessons/${reviewLesson.lessonIds[0]}.html`
    : '/lessons/';
  actions.append(returnLink);
  section.append(actions);

  const reviewHeading = element('h3', '', 'Review and explanations');
  reviewHeading.style.marginTop = 'var(--space-xl)';
  section.append(reviewHeading);
  const reviewList = element('div', 'quiz-review-list');
  for (const [index, result] of record.results.entries()) {
    reviewList.append(renderReviewItem(result.questionId, result, index));
  }
  section.append(reviewList);
  const storageStatus = statusParagraph();
  storageStatus.className = 'quiz-storage-status';
  storageStatus.dataset.storageStatus = '';
  section.append(storageStatus);
  app.replaceChildren(section);
  replayMotion(section, 'motion-results');
  updateStorageStatus();
}

function findHistoryRecord(id) {
  return progress.history.find((record) => record.id === id);
}

function activeRunIsUnfinished() {
  return Boolean(activeSession && !activeSession.completed);
}

function confirmLeave(message = 'Leave this quiz? Your submitted answers are saved, but unanswered prompts will not count.') {
  return window.confirm(message);
}

function leaveRun() {
  if (!activeRunIsUnfinished()) return;
  if (!confirmLeave()) return;
  const moduleId = activeSession.moduleIds[0] ?? '';
  clearStoredSession();
  activeSession = null;
  updateSetupUrl({ moduleId, category: 'formula', mode: 'learn' }, false);
  renderSetup({ moduleId });
}

function handleAppClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button || !app.contains(button)) return;
  const action = button.dataset.action;
  if (action === 'daily') {
    startDailyChallenge();
  } else if (action === 'lock') {
    settleQuestion('answer');
  } else if (action === 'skip') {
    settleQuestion('skip');
  } else if (action === 'next') {
    nextPrompt();
  } else if (action === 'leave') {
    leaveRun();
  } else if (action === 'setup') {
    const moduleId = activeSession?.moduleIds[0] ?? '';
    if (activeRunIsUnfinished() && !confirmLeave()) return;
    clearStoredSession();
    activeSession = null;
    renderSetup({ moduleId, push: true });
  } else if (action === 'retry') {
    const record = findHistoryRecord(currentUrl().searchParams.get('result'));
    if (!record) return;
    const missedIds = record.results.filter(({ correct }) => !correct).map(({ questionId }) => questionId);
    const questions = missedIds.map((id) => questionById.get(id)).filter(Boolean);
    if (!questions.length) return;
    beginRun({
      questions,
      mode: record.mode,
      seconds: record.seconds,
      label: `${record.label} · retry`,
      categories: record.categories,
      moduleIds: record.moduleIds,
      kind: 'retry',
    });
  } else if (action === 'reset') {
    if (!window.confirm('Reset quiz attempts and history on this device? Lesson progress and the original GeoDive record will be left alone.')) return;
    progress = clearQuizProgress(progress);
    progressMessage = '';
    writeProgress();
    renderSetup({
      moduleId: currentUrl().searchParams.get('module') ?? '',
      category: currentUrl().searchParams.get('category') ?? 'formula',
      mode: currentUrl().searchParams.get('mode') ?? 'learn',
    });
  }
}

function handleAppChange(event) {
  if (!activeRunIsUnfinished() || !app.contains(event.target)) return;
  if (event.target.name === 'quiz-answer') {
    activeSession.selectedOptionId = event.target.value;
    storeActiveSession();
    const lock = app.querySelector('[data-action="lock"]');
    if (lock) lock.disabled = false;
  }
}

function handleAppInput(event) {
  if (activeRunIsUnfinished() && event.target.name === 'quiz-recall-answer') {
    activeSession.recallText = event.target.value;
    storeActiveSession();
    const submit = app.querySelector('[data-action="lock"]');
    if (submit) submit.disabled = !event.target.value.trim();
  }
}

function handleAppSubmit(event) {
  if (event.target.id !== 'quiz-setup') return;
  event.preventDefault();
  startFromForm(event.target);
}

function handleDocumentClick(event) {
  const link = event.target.closest('a[href]');
  if (!link || !activeRunIsUnfinished()) return;
  if (!confirmLeave()) {
    event.preventDefault();
    return;
  }
  clearStoredSession();
  activeSession = null;
  approvedLeave = true;
}

function handleBeforeUnload(event) {
  if (!activeRunIsUnfinished() || approvedLeave) return;
  event.preventDefault();
  event.returnValue = '';
}

function renderLocation(state = history.state) {
  const url = currentUrl();
  if (state?.view === 'run' || url.searchParams.get('run') === 'active') {
    if (activeSession?.completed) {
      const result = findHistoryRecord(activeSession.recordId);
      if (result) {
        renderResults(result);
        return;
      }
    }
    if (activeSession && !activeSession.completed) {
      currentView = 'run';
      renderQuestion(false);
      return;
    }
  }
  const resultId = state?.resultId ?? url.searchParams.get('result');
  if (resultId) {
    const record = findHistoryRecord(resultId);
    if (record) {
      renderResults(record);
      return;
    }
  }
  renderSetup({
    moduleId: state?.moduleId ?? url.searchParams.get('module') ?? '',
    category: state?.category ?? url.searchParams.get('category') ?? 'formula',
    mode: state?.mode ?? url.searchParams.get('mode') ?? 'learn',
  });
}

function handlePopState(event) {
  if (activeRunIsUnfinished() && event.state?.view !== 'run') {
    if (!confirmLeave()) {
      const url = currentUrl();
      url.search = '?run=active';
      history.pushState({ view: 'run' }, '', `${url.pathname}${url.search}`);
      return;
    }
    clearStoredSession();
    activeSession = null;
  }
  renderLocation(event.state);
}

function handlePageHide() {
  stopTimer();
}

function handlePageShow() {
  approvedLeave = false;
  if (activeRunIsUnfinished() && currentView === 'run') renderQuestion(false);
}

app.addEventListener('click', handleAppClick);
app.addEventListener('change', handleAppChange);
app.addEventListener('input', handleAppInput);
app.addEventListener('submit', handleAppSubmit);
document.addEventListener('click', handleDocumentClick);
window.addEventListener('beforeunload', handleBeforeUnload);
window.addEventListener('popstate', handlePopState);
window.addEventListener('pagehide', handlePageHide);
window.addEventListener('pageshow', handlePageShow);

const savedSession = readStoredSession();
const current = currentUrl();
if (savedSession && current.searchParams.get('run') === 'active') {
  activeSession = savedSession;
}
renderLocation(history.state);
if (activeSession && !activeSession.completed) storeActiveSession();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    stopTimer();
    app.removeEventListener('click', handleAppClick);
    app.removeEventListener('change', handleAppChange);
    app.removeEventListener('input', handleAppInput);
    app.removeEventListener('submit', handleAppSubmit);
    document.removeEventListener('click', handleDocumentClick);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('pageshow', handlePageShow);
  });
}
