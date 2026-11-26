/* Shared geometry helpers for the interactive shape gallery.
 * Builders work in mathematical or 3D coordinates and emit SVG primitives.
 */

export const GALLERY_WIDTH = 800;
export const GALLERY_HEIGHT = 520;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function round(value, places = 3) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function distance(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

export function midpoint(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function planeFrame({ cx = GALLERY_WIDTH / 2, cy = GALLERY_HEIGHT / 2, scale = 1 } = {}) {
  return {
    cx,
    cy,
    scale,
    toScreen: ([x, y]) => [cx + scale * x, cy - scale * y],
    fromScreen: ([x, y]) => [(x - cx) / scale, (cy - y) / scale],
  };
}

export function regularPolygon(sides, radius, [cx, cy] = [0, 0], rotation = -Math.PI / 2) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = rotation + (index * 2 * Math.PI) / sides;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });
}

export function polygonCentroid(points) {
  const sum = points.reduce((total, point) => [total[0] + point[0], total[1] + point[1]], [0, 0]);
  return [sum[0] / points.length, sum[1] / points.length];
}

export function project3(point, view = {}) {
  const {
    azimuth = -Math.PI / 4,
    elevation = 0.55,
    scale = 1,
    origin = [GALLERY_WIDTH / 2, GALLERY_HEIGHT / 2 + 40],
  } = view;
  const [x, y, z] = point;
  const cosA = Math.cos(azimuth);
  const sinA = Math.sin(azimuth);
  const rotatedX = x * cosA - y * sinA;
  const rotatedY = x * sinA + y * cosA;
  return [
    origin[0] + scale * rotatedX,
    origin[1] + scale * (rotatedY * Math.sin(elevation) - z * Math.cos(elevation)),
  ];
}

export function projectPoints3(points, view) {
  return points.map((point) => project3(point, view));
}

export function viewPreset(name) {
  if (name === 'front') return { azimuth: 0, elevation: 0.12 };
  if (name === 'side') return { azimuth: Math.PI / 2, elevation: 0.12 };
  if (name === 'top') return { azimuth: 0, elevation: 1.35 };
  return { azimuth: -Math.PI / 4, elevation: 0.55 };
}

export function pathFromPoints(points, { close = false } = {}) {
  if (!points.length) return '';
  const [first, ...rest] = points;
  return `M ${first[0]} ${first[1]} ${rest.map((point) => `L ${point[0]} ${point[1]}`).join(' ')}${close ? ' Z' : ''}`;
}

export function sampleCurve(fn, from, to, count = 96) {
  const steps = Math.max(2, count);
  return Array.from({ length: steps + 1 }, (_, index) => fn(from + ((to - from) * index) / steps));
}

export function ellipsePoint([cx, cy], rx, ry, angle, rotation = 0) {
  const x = rx * Math.cos(angle);
  const y = ry * Math.sin(angle);
  return [
    cx + x * Math.cos(rotation) - y * Math.sin(rotation),
    cy + x * Math.sin(rotation) + y * Math.cos(rotation),
  ];
}

export function arcPath([cx, cy], rx, ry, start, end, rotation = 0) {
  const from = ellipsePoint([cx, cy], rx, ry, start, rotation);
  const to = ellipsePoint([cx, cy], rx, ry, end, rotation);
  const largeArc = Math.abs(end - start) > Math.PI ? 1 : 0;
  const sweep = end > start ? 1 : 0;
  return `M ${from[0]} ${from[1]} A ${rx} ${ry} ${(rotation * 180) / Math.PI} ${largeArc} ${sweep} ${to[0]} ${to[1]}`;
}

export function rightAngleMark(vertex, alongA, alongB, size = 14) {
  const unitA = normalize(sub(alongA, vertex));
  const unitB = normalize(sub(alongB, vertex));
  const a = add(vertex, scale(unitA, size));
  const b = add(vertex, scale(unitB, size));
  const corner = add(vertex, add(scale(unitA, size), scale(unitB, size)));
  return [a, corner, b];
}

export function add(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

export function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

export function scale(a, factor) {
  return [a[0] * factor, a[1] * factor];
}

export function normalize(a) {
  const length = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / length, a[1] / length];
}

export function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

export function perpendicularFoot(point, a, b) {
  const direction = sub(b, a);
  const t = clamp(dot(sub(point, a), direction) / dot(direction, direction), 0, 1);
  return add(a, scale(direction, t));
}

export function incenter(a, b, c) {
  const sideA = distance(b, c);
  const sideB = distance(a, c);
  const sideC = distance(a, b);
  const total = sideA + sideB + sideC;
  return [
    (sideA * a[0] + sideB * b[0] + sideC * c[0]) / total,
    (sideA * a[1] + sideB * b[1] + sideC * c[1]) / total,
  ];
}

export function centroid(a, b, c) {
  return [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
}

export function orthocenter(a, b, c) {
  const sideBC = sub(c, b);
  const sideCA = sub(a, c);
  const altitudeFromA = perpendicularDirection(sideBC);
  const altitudeFromB = perpendicularDirection(sideCA);
  const denominator = cross(altitudeFromA, altitudeFromB);
  if (Math.abs(denominator) < 1e-9) return centroid(a, b, c);
  const t = cross(sub(b, a), altitudeFromB) / denominator;
  return add(a, scale(altitudeFromA, t));
}

function perpendicularDirection(vector) {
  return [-vector[1], vector[0]];
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

export function angleAt(vertex, pointA, pointB) {
  const a = sub(pointA, vertex);
  const b = sub(pointB, vertex);
  const cosine = clamp(dot(a, b) / (Math.hypot(...a) * Math.hypot(...b)), -1, 1);
  return (Math.acos(cosine) * 180) / Math.PI;
}

export function segmentPrimitive(part, from, to, options = {}) {
  return { type: 'segment', part, from, to, ...options };
}

export function pointPrimitive(part, point, options = {}) {
  return { type: 'point', part, x: point[0], y: point[1], ...options };
}

export function polygonPrimitive(part, points, options = {}) {
  return { type: 'polygon', part, points, ...options };
}

export function pathPrimitive(part, d, options = {}) {
  return { type: 'path', part, d, ...options };
}

export function ellipsePrimitive(part, [cx, cy], rx, ry, options = {}) {
  return { type: 'ellipse', part, cx, cy, rx, ry, ...options };
}

export function labelPrimitive(text, [x, y], options = {}) {
  return { type: 'label', text, x, y, ...options };
}
