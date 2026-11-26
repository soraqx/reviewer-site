/* Shared contract helpers for gallery figure definitions.
 *
 * A figure definition supplies metadata, part definitions, presets/parameters,
 * and a build(state) function returning SVG primitives and measurements.
 * Part identity stays separate from each drawn instance of that part.
 */

export const FAMILIES = {
  plane: 'Plane figures',
  coordinates: 'Coordinates & conics',
  solids: 'Solids',
};

export function part(definition) {
  return {
    geometricType: 'region',
    measurementKind: 'none',
    symbol: '',
    wordingExamples: [],
    distinctionNote: '',
    relatedFormulaIds: [],
    lessonIds: [],
    searchAliases: [],
    ...definition,
  };
}

export function wording(text, relationshipType = 'problem wording', condition = '') {
  return { text, relationshipType, condition };
}

export function measurement(label, value, kind = 'length', note = '') {
  return { label, value, kind, note };
}

export function seg(partId, from, to, options = {}) {
  return { type: 'segment', part: partId, from, to, role: 'segment', ...options };
}

export function pt(partId, point, options = {}) {
  return { type: 'point', part: partId, x: point[0], y: point[1], r: 5, role: 'point', ...options };
}

export function poly(partId, points, options = {}) {
  return { type: 'polygon', part: partId, points, role: 'face', ...options };
}

export function ell(partId, centre, rx, ry, options = {}) {
  return {
    type: 'ellipse', part: partId, cx: centre[0], cy: centre[1], rx, ry, role: 'curve', ...options,
  };
}

export function path(partId, d, options = {}) {
  return { type: 'path', part: partId, d, role: 'curve', ...options };
}

export function label(text, point, options = {}) {
  return { type: 'label', text, x: point[0], y: point[1], anchor: 'middle', ...options };
}

export function guide(partId, from, to, options = {}) {
  return seg(partId, from, to, { role: 'guide', ...options });
}

export function dimension(partId, from, to, options = {}) {
  return seg(partId, from, to, { role: 'guide', dimension: true, ...options });
}

export function dashed(partId, from, to, options = {}) {
  return seg(partId, from, to, { role: 'guide', dash: 'dash', ...options });
}

export function rightMark(partId, vertex, alongA, alongB, size = 13) {
  const unit = (from, to) => {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const length = Math.hypot(dx, dy) || 1;
    return [dx / length, dy / length];
  };
  const a = unit(vertex, alongA);
  const b = unit(vertex, alongB);
  const p1 = [vertex[0] + a[0] * size, vertex[1] + a[1] * size];
  const p2 = [p1[0] + b[0] * size, p1[1] + b[1] * size];
  const p3 = [vertex[0] + b[0] * size, vertex[1] + b[1] * size];
  return {
    type: 'path',
    part: partId,
    d: `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}`,
    role: 'guide',
  };
}

export function fmt(value, places = 2) {
  if (!Number.isFinite(value)) return '—';
  return Number(value.toFixed(places)).toString();
}

export function param(id, labelText, options = {}) {
  return {
    id,
    label: labelText,
    type: 'range',
    min: 0,
    max: 1,
    step: 0.05,
    default: 0,
    unit: '',
    ...options,
  };
}

export function preset(id, labelText, values = {}) {
  return { id, label: labelText, values };
}
