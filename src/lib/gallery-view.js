/* SVG rendering and pointer/keyboard behaviour for the shape gallery. */

import {
  GALLERY_HEIGHT,
  GALLERY_WIDTH,
} from './gallery-geometry.js';

const NS = 'http://www.w3.org/2000/svg';
const ROLE_ORDER = ['face', 'surface', 'curve', 'guide', 'segment', 'point'];
let nextSvgId = 0;

function element(name, attributes = {}) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) node.setAttribute(key, String(value));
  }
  return node;
}

function pointsAttribute(points) {
  return points.map((point) => point.join(',')).join(' ');
}

function shapeForPrimitive(primitive) {
  switch (primitive.type) {
    case 'segment':
      return element('line', {
        x1: primitive.from[0], y1: primitive.from[1],
        x2: primitive.to[0], y2: primitive.to[1],
      });
    case 'point':
      return element('circle', {
        cx: primitive.x, cy: primitive.y, r: primitive.r ?? 5,
      });
    case 'polygon':
      return element('polygon', { points: pointsAttribute(primitive.points) });
    case 'ellipse':
      return element('ellipse', {
        cx: primitive.cx, cy: primitive.cy, rx: primitive.rx, ry: primitive.ry,
        transform: primitive.rotation
          ? `rotate(${(primitive.rotation * 180) / Math.PI} ${primitive.cx} ${primitive.cy})`
          : undefined,
      });
    case 'path':
      return element('path', { d: primitive.d });
    default:
      return null;
  }
}

function hitForPrimitive(primitive) {
  const common = { class: 'gallery-hit', fill: 'none' };
  switch (primitive.type) {
    case 'segment':
      return element('line', {
        ...common,
        x1: primitive.from[0], y1: primitive.from[1],
        x2: primitive.to[0], y2: primitive.to[1],
      });
    case 'point':
      return element('circle', {
        ...common,
        cx: primitive.x, cy: primitive.y, r: Math.max(14, (primitive.r ?? 5) + 9),
      });
    case 'polygon':
      return element('polygon', {
        ...common,
        points: pointsAttribute(primitive.points),
        fill: 'transparent',
      });
    case 'ellipse':
      return element('ellipse', {
        ...common,
        cx: primitive.cx, cy: primitive.cy, rx: primitive.rx, ry: primitive.ry,
        fill: 'transparent',
        transform: primitive.rotation
          ? `rotate(${(primitive.rotation * 180) / Math.PI} ${primitive.cx} ${primitive.cy})`
          : undefined,
      });
    case 'path':
      return element('path', { ...common, d: primitive.d });
    default:
      return null;
  }
}

function decorate(shape, primitive) {
  const classes = ['gallery-shape', `gallery-shape--${primitive.role ?? 'segment'}`];
  if (primitive.dash === 'dash') classes.push('gallery-shape--dashed');
  if (primitive.hidden) classes.push('gallery-shape--hidden');
  if (primitive.dimension) classes.push('gallery-shape--dimension');
  shape.setAttribute('class', classes.join(' '));
  return shape;
}

function primitiveVisible(primitive, visibility) {
  if (primitive.type === 'label') return visibility.showLabels !== false;
  if (primitive.hidden) return visibility.showHidden === true;
  if ((primitive.role ?? 'segment') === 'guide') return visibility.showGuides !== false;
  return true;
}

function sortKey(primitive) {
  const roleIndex = ROLE_ORDER.indexOf(primitive.role ?? 'segment');
  return (roleIndex === -1 ? ROLE_ORDER.length : roleIndex) + (primitive.hidden ? 0.2 : 0);
}

function labelNode(primitive) {
  const text = element('text', {
    x: primitive.x,
    y: primitive.y,
    class: 'gallery-label-text',
    'text-anchor': primitive.anchor ?? 'middle',
  });
  text.textContent = primitive.text;
  return text;
}

/**
 * Render a built figure. Every selectable concept becomes one focusable SVG
 * group, so repeated edges are not dozens of tab stops.
 */
export function createGallerySvg(built, options = {}) {
  const {
    onHover = () => {},
    onLeave = () => {},
    onSelect = () => {},
    isDragging = () => false,
    partNames = new Map(),
    visibility = { showLabels: true, showHidden: false, showGuides: true },
    idPrefix = `gallery-${nextSvgId += 1}`,
  } = options;

  const svg = element('svg', {
    class: 'gallery-svg',
    viewBox: built.viewBox ?? `0 0 ${GALLERY_WIDTH} ${GALLERY_HEIGHT}`,
    role: 'img',
    'aria-labelledby': `${idPrefix}-title ${idPrefix}-description`,
    preserveAspectRatio: 'xMidYMid meet',
  });
  const title = element('title', { id: `${idPrefix}-title` });
  title.textContent = built.title ?? 'Interactive geometry figure';
  const description = element('desc', { id: `${idPrefix}-description` });
  description.textContent = built.description ?? 'Select a part from the parts list to inspect it.';
  svg.append(title, description);

  const visible = (built.primitives ?? []).filter((primitive) => primitiveVisible(primitive, visibility));
  const decor = visible.filter((primitive) => !primitive.part && primitive.type !== 'label');
  const labels = visible.filter((primitive) => primitive.type === 'label');
  const byPart = new Map();
  for (const primitive of visible) {
    if (!primitive.part || primitive.type === 'label') continue;
    if (!byPart.has(primitive.part)) byPart.set(primitive.part, []);
    byPart.get(primitive.part).push(primitive);
  }

  for (const primitive of decor.sort((a, b) => sortKey(a) - sortKey(b))) {
    const shape = shapeForPrimitive(primitive);
    if (shape) svg.append(decorate(shape, primitive));
  }

  const partIds = [...byPart.keys()].sort((a, b) => {
    const aKey = Math.min(...byPart.get(a).map(sortKey));
    const bKey = Math.min(...byPart.get(b).map(sortKey));
    return aKey - bKey;
  });

  for (const partId of partIds) {
    const primitives = byPart.get(partId);
    const name = partNames.get(partId) ?? partId.replace(/-/g, ' ');
    const group = element('g', {
      class: 'gallery-part',
      'data-part': partId,
      role: 'button',
      tabindex: '0',
      'aria-label': `${name}. Select to inspect this part.`,
    });

    for (const primitive of primitives) {
      const shape = shapeForPrimitive(primitive);
      if (shape) group.append(decorate(shape, primitive));
      const hit = hitForPrimitive(primitive);
      if (hit) {
        hit.dataset.role = primitive.role ?? 'segment';
        group.append(hit);
      }
    }

    group.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse' && !isDragging()) onHover(partId, event);
    });
    group.addEventListener('pointerleave', () => {
      if (!isDragging()) onLeave();
    });
    group.addEventListener('focus', () => onHover(partId, null, true));
    group.addEventListener('blur', () => onLeave(true));
    group.addEventListener('click', (event) => {
      if (isDragging()) return;
      event.preventDefault();
      onSelect(partId);
    });
    group.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onSelect(partId);
    });
    svg.append(group);
  }

  for (const primitive of labels) svg.append(labelNode(primitive));
  return svg;
}

/** Horizontal drag rotates solids; vertical page scrolling stays available. */
export function attachRotation(svg, { onRotate, getView, enabled = () => true }) {
  if (!enabled()) return () => {};
  let start = null;
  let dragged = false;

  function suppress() {
    svg.dataset.suppressClick = 'true';
  }

  function onPointerDown(event) {
    if (!enabled()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const view = getView();
    start = { x: event.clientX, y: event.clientY, azimuth: view.azimuth, elevation: view.elevation };
    dragged = false;
    svg.dataset.suppressClick = 'false';
  }

  function onPointerMove(event) {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!dragged && Math.hypot(dx, dy) < 8) return;
    dragged = true;
    suppress();
    if (event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx)) return;
    try { svg.setPointerCapture?.(event.pointerId); } catch { /* capture is optional */ }
    onRotate(
      start.azimuth + dx * 0.008,
      Math.max(0.12, Math.min(1.4, start.elevation - dy * 0.004)),
    );
  }

  function onPointerUp(event) {
    if (!start) return;
    start = null;
    if (dragged) {
      try { svg.releasePointerCapture?.(event.pointerId); } catch { /* capture is optional */ }
      window.setTimeout(() => { svg.dataset.suppressClick = 'false'; }, 0);
    }
  }

  svg.addEventListener('pointerdown', onPointerDown);
  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);
  return () => {
    svg.removeEventListener('pointerdown', onPointerDown);
    svg.removeEventListener('pointermove', onPointerMove);
    svg.removeEventListener('pointerup', onPointerUp);
    svg.removeEventListener('pointercancel', onPointerUp);
  };
}

export function isRotationSuppressed(svg) {
  return svg?.dataset.suppressClick === 'true';
}

export function buildPreviewSvg(built) {
  const svg = element('svg', {
    class: 'gallery-preview-svg',
    viewBox: built.viewBox ?? `0 0 ${GALLERY_WIDTH} ${GALLERY_HEIGHT}`,
    'aria-hidden': 'true',
    focusable: 'false',
  });
  for (const primitive of built.primitives ?? []) {
    if (primitive.type === 'label' || (primitive.role ?? 'segment') === 'guide') continue;
    const shape = shapeForPrimitive(primitive);
    if (!shape) continue;
    const role = primitive.role ?? 'segment';
    const classes = ['gallery-preview-shape', `gallery-preview-shape--${role}`];
    if (primitive.hidden) classes.push('gallery-shape--hidden');
    shape.setAttribute('class', classes.join(' '));
    svg.append(shape);
  }
  return svg;
}
