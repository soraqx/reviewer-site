import { bindNumberRange } from '../lib/slider.js';
import { replayMotion } from '../lib/motion.js';
import {
  addSvgLine,
  addSvgText,
  createSvgElement,
  formatSvgPoints,
} from '../lib/svg-helpers.js';

const CENTER = { x: 280, y: 190 };
const RADIUS = 128;

function pointAt(index, count) {
  const angle = Math.PI / 2 - (index * 2 * Math.PI) / count;
  return {
    x: CENTER.x + RADIUS * Math.cos(angle),
    y: CENTER.y - RADIUS * Math.sin(angle),
  };
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function unitFrom(center, point) {
  const x = point.x - center.x;
  const y = point.y - center.y;
  const length = Math.hypot(x, y);
  return { x: x / length, y: y / length };
}

function formatNumber(value) {
  return Number(value.toFixed(2)).toString();
}

export function mountPolygonExplorer() {
  const svg = document.querySelector('#polygon-diagram');
  const range = document.querySelector('#side-count-range');
  const countInput = document.querySelector('#side-count-number');
  const countOutput = document.querySelector('#side-count-output');
  const countError = document.querySelector('#side-count-error');
  const lengthInput = document.querySelector('#side-length-number');
  const lengthOutput = document.querySelector('#side-length-output');
  const lengthError = document.querySelector('#side-length-error');
  const summary = document.querySelector('#polygon-summary');
  const detail = document.querySelector('#polygon-detail');
  const toggles = [...document.querySelectorAll('[data-show]')];
  let sideCount = Number(countInput.value);
  let sideLength = Number(lengthInput.value);

  function draw() {
    const savedTitle = svg.querySelector('title').cloneNode(true);
    const savedDescription = svg.querySelector('desc').cloneNode(true);
    svg.replaceChildren(savedTitle, savedDescription);

    const points = Array.from({ length: sideCount }, (_, index) =>
      pointAt(index, sideCount),
    );
    const shape = createSvgElement('polygon', {
      points: formatSvgPoints(points),
      class: 'polygon-shape',
    });
    svg.append(shape);

    const first = points[0];
    const second = points[1];
    const selected = (name) =>
      document.querySelector(`[data-show="${name}"]`).checked;

    if (selected('side')) {
      addSvgLine(svg, first, second, 'polygon-highlight polygon-side');
      const middle = midpoint(first, second);
      const outward = unitFrom(CENTER, middle);
      addSvgText(
        svg,
        middle.x + outward.x * 22,
        middle.y + outward.y * 22,
        'side',
        'diagram-label label-side',
      );
    }

    if (selected('diagonal') && sideCount >= 4) {
      const opposite = points[Math.floor(sideCount / 2)];
      addSvgLine(svg, first, opposite, 'polygon-highlight polygon-diagonal');
      const middle = midpoint(first, opposite);
      addSvgText(svg, middle.x + 17, middle.y + 2, 'diagonal', 'diagram-label label-diagonal', 'start');
    }

    if (selected('apothem')) {
      const sideMiddle = midpoint(first, second);
      addSvgLine(svg, CENTER, sideMiddle, 'polygon-highlight polygon-apothem');
      const middle = midpoint(CENTER, sideMiddle);
      addSvgText(svg, middle.x - 12, middle.y - 7, 'apothem', 'diagram-label label-apothem', 'end');
    }

    if (selected('angles')) {
      const delta = (2 * Math.PI) / sideCount;
      const centralStart = {
        x: CENTER.x,
        y: CENTER.y - 32,
      };
      const centralEnd = {
        x: CENTER.x + 32 * Math.sin(delta),
        y: CENTER.y - 32 * Math.cos(delta),
      };
      svg.append(
        createSvgElement('path', {
          d: `M ${centralStart.x} ${centralStart.y} A 32 32 0 0 1 ${centralEnd.x} ${centralEnd.y}`,
          class: 'angle-arc',
        }),
      );
      addSvgText(svg, CENTER.x + 49, CENTER.y - 28, 'central', 'diagram-label label-angle', 'start');

      const previous = points[sideCount - 1];
      const next = points[1];
      const towardPrevious = unitFrom(first, previous);
      const towardNext = unitFrom(first, next);
      const arcStart = {
        x: first.x + towardNext.x * 27,
        y: first.y + towardNext.y * 27,
      };
      const arcEnd = {
        x: first.x + towardPrevious.x * 27,
        y: first.y + towardPrevious.y * 27,
      };
      svg.append(
        createSvgElement('path', {
          d: `M ${arcStart.x} ${arcStart.y} A 27 27 0 0 1 ${arcEnd.x} ${arcEnd.y}`,
          class: 'angle-arc',
        }),
      );
      addSvgText(svg, first.x, first.y + 55, 'interior', 'diagram-label label-angle');
    }

    if (selected('exterior')) {
      const previous = points[sideCount - 1];
      const incoming = unitFrom(previous, first);
      const extension = {
        x: first.x + incoming.x * 36,
        y: first.y + incoming.y * 36,
      };
      addSvgLine(svg, first, extension, 'polygon-highlight polygon-exterior');
      addSvgText(svg, extension.x, extension.y - 7, 'exterior', 'diagram-label label-angle');
    }

    svg.append(
      createSvgElement('circle', {
        cx: first.x,
        cy: first.y,
        r: 4,
        class: 'polygon-vertex',
      }),
      createSvgElement('circle', {
        cx: CENTER.x,
        cy: CENTER.y,
        r: 4,
        class: 'polygon-center',
      }),
    );
    addSvgText(svg, first.x + 4, first.y - 13, 'vertex', 'diagram-label', 'start');
    addSvgText(svg, CENTER.x + 9, CENTER.y + 19, 'center', 'diagram-label', 'start');

    const diagonalCount = (sideCount * (sideCount - 3)) / 2;
    const centralAngle = 360 / sideCount;
    const interiorAngle = ((sideCount - 2) * 180) / sideCount;
    const apothem = sideLength / (2 * Math.tan(Math.PI / sideCount));
    summary.textContent = `A regular ${sideCount}-gon has ${sideCount} equal sides, ${sideCount} vertices, and ${diagonalCount} diagonals.`;
    detail.textContent =
      `Side length s = ${formatNumber(sideLength)} units. Central angle = 360°/${sideCount} = ${formatNumber(centralAngle)}°; each interior angle = ${formatNumber(interiorAngle)}°; exterior angle = ${formatNumber(180 - interiorAngle)}°. Apothem = s/[2 tan(180°/${sideCount})] ≈ ${formatNumber(apothem)} units. The drawing is rescaled to fit; use these values for measurements.`;
    countError.textContent =
      sideCount < 4 ? 'A triangle has no diagonal: every pair of its vertices is adjacent.' : '';
    document.querySelector('[data-show="diagonal"]').disabled = sideCount < 4;
    savedDescription.textContent =
      `A regular ${sideCount}-sided polygon. Highlighted construction lines and labels update with the controls.`;
  }

  bindNumberRange({
    range,
    number: countInput,
    output: countOutput,
    onValue(value) {
      sideCount = value;
      draw();
    },
    onInvalid(message) {
      countError.textContent = message;
      replayMotion(countError, 'motion-validation');
    },
  });

  const sideLengthRange = document.querySelector('#side-length-range');
  bindNumberRange({
    range: sideLengthRange,
    number: lengthInput,
    output: lengthOutput,
    onValue(value) {
      sideLength = value;
      draw();
    },
    onInvalid(message) {
      lengthError.textContent = message;
      replayMotion(lengthError, 'motion-validation');
    },
  });

  for (const toggle of toggles) {
    toggle.addEventListener('change', () => {
      draw();
      replayMotion(svg, 'motion-highlight');
    });
  }

  const preset = document.querySelector('#polygon-preset');
  preset.addEventListener('change', () => {
    countInput.value = preset.value;
    countInput.dispatchEvent(new Event('input', { bubbles: true }));
    replayMotion(svg, 'motion-demo');
  });
  document.querySelector('#polygon-reset').addEventListener('click', () => {
    countInput.value = '6';
    lengthInput.value = '4';
    preset.value = '6';
    countInput.dispatchEvent(new Event('input', { bubbles: true }));
    lengthInput.dispatchEvent(new Event('input', { bubbles: true }));
    for (const toggle of toggles) {
      toggle.checked = toggle.dataset.show !== 'angles' && toggle.dataset.show !== 'exterior';
    }
    draw();
    replayMotion(svg, 'motion-demo');
  });
}
