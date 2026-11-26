import './styles/main.css';
import './styles/problem.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import { renderMath } from './lib/katex-render.js';
import { formatTemplate, ProblemSession } from './lib/problem-engine.js';
import { updateScrollableRegion } from './lib/scroll-region.js';
import {
  listProgress,
  recordProgress,
  submitFeedback,
} from './lib/api-client.js';
import problemTemplates from './data/problems/geometry.json';
import { replayMotion } from './lib/motion.js';

mountSharedLayout();

const template = problemTemplates.find(({ id }) => id === 'coordinate-distance');
if (!template) {
  throw new Error('The coordinate-distance problem template is missing.');
}
document.title = `${template.title}: Fieldnotes practice`;
document.querySelector('#problem-title').textContent = template.title;

const session = new ProblemSession(template);
const prompt = document.querySelector('#problem-prompt');
const steps = document.querySelector('#solution-steps');
const hints = document.querySelector('#hint-list');
const progress = document.querySelector('#step-progress');
const nextStepButton = document.querySelector('#next-step');
const solutionButton = document.querySelector('#show-solution');
const nextHintButton = document.querySelector('#next-hint');
const answerForm = document.querySelector('#answer-form');
const answerInput = document.querySelector('#answer-value');
const unitInput = document.querySelector('#answer-unit');
const feedback = document.querySelector('#answer-feedback');
const progressSummary = document.querySelector('#progress-summary');
const progressStatus = document.querySelector('#progress-status');
const checkAnswerButton = answerForm.querySelector('button[type="submit"]');
const feedbackForm = document.querySelector('#feedback-form');
const feedbackMessage = document.querySelector('#feedback-message');
const feedbackStatus = document.querySelector('#feedback-status');
prompt.tabIndex = -1;
let progressRecords = [];
let progressRevision = 0;
let attemptStartedAt = Date.now();

function renderProgress() {
  const record = progressRecords.find(({ problemId }) => problemId === template.id);
  if (!record) {
    progressSummary.textContent = 'No attempts recorded yet.';
    return;
  }

  const solvedLabel = record.solved ? 'Solved at least once.' : 'Not solved yet.';
  const bestTime = record.bestTimeMs === undefined
    ? ''
    : ` Best time: ${(record.bestTimeMs / 1000).toFixed(1)} seconds.`;
  progressSummary.textContent =
    `${record.attempts} ${record.attempts === 1 ? 'attempt' : 'attempts'}. ${solvedLabel}${bestTime}`;
}

function setProgressStatus(result, action) {
  if (result.offline) {
    progressStatus.textContent = result.locallyStored
      ? `Offline. ${action} saved on this device and will sync when the service returns.`
      : `Offline. ${action} could not be stored because device storage is unavailable.`;
  } else {
    progressStatus.textContent = 'Progress saved.';
  }
}

async function loadProgress() {
  const revision = progressRevision;
  try {
    const result = await listProgress();
    if (revision !== progressRevision) return;
    progressRecords = result.progress;
    renderProgress();
    if (result.offline) {
      progressStatus.textContent = result.locallyStored
        ? 'Offline. Showing progress saved on this device.'
        : 'Offline. Device storage is unavailable, so progress cannot persist between visits.';
    } else {
      progressStatus.textContent = result.locallyStored
        ? 'Progress tracking is ready.'
        : 'Progress is available online, but this device cannot save an offline copy.';
    }
  } catch (error) {
    progressStatus.textContent = `Progress could not be loaded: ${error.message}`;
  }
}

async function saveAttempt(result) {
  const revision = ++progressRevision;
  checkAnswerButton.disabled = true;
  checkAnswerButton.setAttribute('aria-busy', 'true');
  progressStatus.textContent = 'Saving progress…';
  try {
    const saved = await recordProgress({
      problemId: template.id,
      solved: result.correct,
      ...(result.correct ? { bestTimeMs: Date.now() - attemptStartedAt } : {}),
    });
    if (revision !== progressRevision) return;
    progressRecords = [
      ...progressRecords.filter(({ problemId }) => problemId !== template.id),
      saved.progress,
    ];
    renderProgress();
    setProgressStatus(saved, 'Progress');
  } catch (error) {
    if (revision === progressRevision) {
      progressStatus.textContent = `Progress could not be saved: ${error.message}`;
    }
  } finally {
    checkAnswerButton.disabled = false;
    checkAnswerButton.removeAttribute('aria-busy');
  }
}

function renderSteps() {
  const { instance, revealedStepCount } = session;
  steps.replaceChildren(
    ...template.steps.slice(0, revealedStepCount).map((step, index) => {
      const item = document.createElement('li');
      item.className = 'solution-step';
      const title = document.createElement('h3');
      title.textContent = `${String(index + 1).padStart(2, '0')} / ${step.title}`;
      const explanation = document.createElement('p');
      explanation.textContent = formatTemplate(step.text, instance.values);
      const equation = document.createElement('div');
      equation.className = 'step-equation';
      equation.innerHTML = renderMath(formatTemplate(step.latex, instance.values), true);
      item.append(title, explanation, equation);
      return item;
    }),
  );
  for (const [index, equation] of [...steps.querySelectorAll('.step-equation')].entries()) {
    updateScrollableRegion(equation, `Equation for step ${index + 1}`);
  }
  progress.textContent = `${revealedStepCount} of ${template.steps.length} steps shown`;
  nextStepButton.disabled = revealedStepCount >= template.steps.length;
  nextStepButton.textContent =
    revealedStepCount >= template.steps.length ? 'All steps shown' : 'Show next step';
  solutionButton.disabled = revealedStepCount >= template.steps.length;
}

function renderHints() {
  const { instance, revealedHintCount } = session;
  hints.replaceChildren(
    ...template.hints.slice(0, revealedHintCount).map((hint) => {
      const item = document.createElement('li');
      item.textContent = formatTemplate(hint, instance.values);
      return item;
    }),
  );
  nextHintButton.disabled = revealedHintCount >= template.hints.length;
  nextHintButton.textContent =
    revealedHintCount >= template.hints.length ? 'Hints shown' : 'Show hint';
}

function renderProblem() {
  const { instance } = session;
  attemptStartedAt = Date.now();
  prompt.textContent = formatTemplate(template.prompt, instance.values);
  answerInput.value = '';
  unitInput.value = template.answer.displayUnit;
  feedback.textContent = '';
  feedback.removeAttribute('data-state');
  renderSteps();
  renderHints();
}

document.querySelector('#problem-citation').textContent = template.source.citation;
renderProblem();
void loadProgress();
window.addEventListener('resize', () => {
  for (const [index, equation] of [...steps.querySelectorAll('.step-equation')].entries()) {
    updateScrollableRegion(equation, `Equation for step ${index + 1}`);
  }
});

nextStepButton.addEventListener('click', () => {
  session.revealNextStep();
  renderSteps();
  replayMotion(steps.lastElementChild, 'motion-enter');
});

solutionButton.addEventListener('click', () => {
  session.revealSolution();
  renderSteps();
  replayMotion(steps.lastElementChild, 'motion-enter');
});

nextHintButton.addEventListener('click', () => {
  session.revealNextHint();
  renderHints();
  replayMotion(hints.lastElementChild, 'motion-enter');
});

document.querySelector('#new-problem').addEventListener('click', () => {
  session.reset();
  renderProblem();
  replayMotion(prompt, 'motion-enter');
  prompt.focus({ preventScroll: true });
  prompt.scrollIntoView({
    block: 'center',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
});

answerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = session.checkAnswer(answerInput.value, unitInput.value);
  feedback.textContent = result.message;
  feedback.dataset.state = result.correct ? 'correct' : 'incorrect';
  replayMotion(feedback, 'motion-feedback');
  void saveAttempt(result);
});

feedbackForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = feedbackForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  feedbackStatus.textContent = 'Sending feedback…';
  try {
    const result = await submitFeedback({
      problemId: template.id,
      message: feedbackMessage.value,
    });
    if (result.sent) {
      feedbackMessage.value = '';
      feedbackStatus.textContent = 'Feedback sent. Thank you.';
    } else {
      feedbackStatus.textContent =
        'Feedback was not sent because the service is unavailable. Keep a copy and try again later.';
    }
  } catch (error) {
    feedbackStatus.textContent = `Feedback was not sent: ${error.message}`;
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
  }
});
