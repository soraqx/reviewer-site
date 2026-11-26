const MOTION_CLASSES = [
  'motion-enter',
  'motion-feedback',
  'motion-panel',
  'motion-results',
  'motion-card',
  'motion-validation',
  'motion-progress-fill',
  'motion-demo',
  'motion-highlight',
];

const ANIMATION_FALLBACK_MS = 800;
const activeAnimations = new WeakMap();
const reducedMotion = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

function finishAnimation(element, className) {
  element.classList.remove(className);
  const records = activeAnimations.get(element);
  const record = records?.get(className);
  if (!record) return;
  element.removeEventListener('animationend', record.onEnd);
  window.clearTimeout(record.timer);
  records.delete(className);
  if (!records.size) activeAnimations.delete(element);
}

export function prefersReducedMotion() {
  return Boolean(reducedMotion?.matches);
}

/** Replay one named CSS entrance without tying state changes to animationend. */
export function replayMotion(element, className, fallbackMs = ANIMATION_FALLBACK_MS) {
  if (!element || !className || prefersReducedMotion()) return;
  finishAnimation(element, className);

  // Restart the CSS animation deliberately; discrete state has already been committed.
  element.classList.remove(className);
  if (typeof element.getBoundingClientRect === 'function') element.getBoundingClientRect();
  else void element.offsetWidth;
  element.classList.add(className);

  let records = activeAnimations.get(element);
  if (!records) {
    records = new Map();
    activeAnimations.set(element, records);
  }

  const record = {
    onEnd: null,
    timer: null,
  };
  record.onEnd = (event) => {
    // animationend bubbles; only the element we tagged owns this cleanup.
    if (event.target === element) finishAnimation(element, className);
  };
  record.timer = window.setTimeout(
    () => finishAnimation(element, className),
    fallbackMs,
  );
  records.set(className, record);
  element.addEventListener('animationend', record.onEnd);
}

/** Remove lingering motion classes if the OS preference changes mid-session. */
export function clearMotion(root = document) {
  if (!root?.querySelectorAll) return;
  for (const className of MOTION_CLASSES) {
    for (const element of root.querySelectorAll(`.${className}`)) {
      finishAnimation(element, className);
    }
  }
}

let watchingPreference = false;

export function watchReducedMotionChanges() {
  if (watchingPreference || !reducedMotion || typeof document === 'undefined') return;
  watchingPreference = true;
  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', () => clearMotion(document));
  } else if (typeof reducedMotion.addListener === 'function') {
    reducedMotion.addListener(() => clearMotion(document));
  }
}
