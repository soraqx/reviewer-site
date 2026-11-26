/* Gallery figures for course modules 1–6: polygons, triangles, quadrilaterals,
 * Cartesian coordinates, lines, and circles. Every builder derives its drawn
 * geometry, labels, and measurements from one state object.
 */

import {
  FAMILIES,
  part,
  wording,
  measurement,
  seg,
  pt,
  poly,
  ell,
  path,
  label,
  guide,
  dashed,
  rightMark,
  fmt,
  param,
  preset as makePreset,
} from '../gallery-figure-utils.js';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const CANVAS = { xmin: 14, ymin: 14, xmax: 786, ymax: 506 };

const POLY_LESSONS = ['poly-01', 'poly-03', 'poly-04'];
const TRI_LESSONS = ['tri-01', 'tri-02', 'tri-03'];
const QUAD_LESSONS = ['quad-01', 'quad-02', 'quad-03', 'quad-04'];
const CART_LESSONS = ['cart-01', 'cart-02', 'cart-03', 'cart-04'];
const LINE_LESSONS = ['line-01', 'line-02', 'line-03'];
const CIRC_LESSONS = ['circ-02', 'circ-03'];

/* ---------- small pure helpers ---------- */

function num(state, key, fallback) {
  const raw = state?.params?.[key] ?? state?.preset?.values?.[key] ?? fallback;
  if (raw === undefined || raw === null) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function pointValue(state, key, fallback) {
  const raw = state?.params?.[key] ?? state?.preset?.values?.[key] ?? fallback;
  if (Array.isArray(raw) && raw.length >= 2) {
    const x = Number(raw[0]);
    const y = Number(raw[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) return [x, y];
  }
  return fallback;
}

function flag(state, key, fallback = 1) {
  return num(state, key, fallback) !== 0;
}

function presetId(state) {
  const value = state?.preset;
  if (typeof value === 'string') return value;
  return value?.id ?? '';
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function vAdd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
function vSub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
function vScale(a, factor) { return [a[0] * factor, a[1] * factor]; }
function vDot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
function vCross(a, b) { return a[0] * b[1] - a[1] * b[0]; }
function vLen(a) { return Math.hypot(a[0], a[1]); }
function distance(a, b) { return vLen(vSub(a, b)); }
function vMid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
function vLerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
function perpendicular(a) { return [-a[1], a[0]]; }

function angleAt(vertex, pointA, pointB) {
  const u = vSub(pointA, vertex);
  const v = vSub(pointB, vertex);
  const cosine = clamp(vDot(u, v) / (vLen(u) * vLen(v) || 1), -1, 1);
  return (Math.acos(cosine) / DEG);
}

function smallerAngle(u, v) {
  return Math.atan2(Math.abs(vCross(u, v)), Math.abs(vDot(u, v))) / DEG;
}

function footData(point, a, b) {
  const direction = vSub(b, a);
  const squared = vDot(direction, direction);
  if (squared < 1e-12) return { point: a, t: 0 };
  const t = vDot(vSub(point, a), direction) / squared;
  return { point: vAdd(a, vScale(direction, t)), t };
}

function lineIntersection(p, d, q, e) {
  const denominator = vCross(d, e);
  if (Math.abs(denominator) < 1e-9) return null;
  const t = vCross(vSub(q, p), e) / denominator;
  return vAdd(p, vScale(d, t));
}

function withinCanvas(point) {
  return point[0] >= CANVAS.xmin && point[0] <= CANVAS.xmax
    && point[1] >= CANVAS.ymin && point[1] <= CANVAS.ymax;
}

function clipLineToBox(point, direction) {
  const hits = [];
  if (Math.abs(direction[0]) > 1e-9) {
    for (const x of [CANVAS.xmin, CANVAS.xmax]) {
      const t = (x - point[0]) / direction[0];
      const y = point[1] + t * direction[1];
      if (y >= CANVAS.ymin - 1e-6 && y <= CANVAS.ymax + 1e-6) hits.push([x, y]);
    }
  }
  if (Math.abs(direction[1]) > 1e-9) {
    for (const y of [CANVAS.ymin, CANVAS.ymax]) {
      const t = (y - point[1]) / direction[1];
      const x = point[0] + t * direction[0];
      if (x >= CANVAS.xmin - 1e-6 && x <= CANVAS.xmax + 1e-6) hits.push([x, y]);
    }
  }
  const unique = [];
  for (const hit of hits) {
    if (!unique.some((existing) => distance(existing, hit) < 1e-6)) unique.push(hit);
  }
  if (unique.length < 2) return [point, vAdd(point, direction)];
  let best = [unique[0], unique[1]];
  let longest = -1;
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const length = distance(unique[i], unique[j]);
      if (length > longest) {
        longest = length;
        best = [unique[i], unique[j]];
      }
    }
  }
  return best;
}

function planeFrame(cx = 400, cy = 260, scale = 1) {
  return {
    cx,
    cy,
    scale,
    toScreen: ([x, y]) => [cx + scale * x, cy - scale * y],
  };
}

function normalizeAngle(angle) {
  const result = angle % TAU;
  return result < 0 ? result + TAU : result;
}

function pointOnCircle(centre, radius, angle) {
  return [centre[0] + radius * Math.cos(angle), centre[1] + radius * Math.sin(angle)];
}

function arcThrough(centre, radius, from, to, through) {
  const ccw = normalizeAngle(to - from);
  const clockwise = normalizeAngle(from - to);
  const toThrough = normalizeAngle(through - from);
  const delta = toThrough <= ccw + 1e-9 ? ccw : -clockwise;
  const startPoint = pointOnCircle(centre, radius, from);
  const endPoint = pointOnCircle(centre, radius, from + delta);
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  const sweep = delta >= 0 ? 1 : 0;
  return `M ${fmt(startPoint[0], 2)} ${fmt(startPoint[1], 2)} A ${fmt(radius, 2)} ${fmt(radius, 2)} 0 ${largeArc} ${sweep} ${fmt(endPoint[0], 2)} ${fmt(endPoint[1], 2)}`;
}

function smallArc(centre, radius, vectorU, vectorV) {
  const from = Math.atan2(vectorU[1], vectorU[0]);
  const rawTo = Math.atan2(vectorV[1], vectorV[0]);
  let delta = normalizeAngle(rawTo - from);
  if (delta > Math.PI) delta -= TAU;
  return arcThrough(centre, radius, from, rawTo, from + delta / 2);
}

function slopeOf(direction) {
  if (Math.abs(direction[0]) < 1e-9) return null;
  return direction[1] / direction[0];
}

function slopeText(slope) {
  return slope === null ? 'undefined' : fmt(slope, 2);
}

function lineEquation(point, direction) {
  const slope = slopeOf(direction);
  if (slope === null) return `x = ${fmt(point[0], 2)}`;
  const intercept = point[1] - slope * point[0];
  const sign = intercept < 0 ? '−' : '+';
  return `y = ${fmt(slope, 2)}x ${sign} ${fmt(Math.abs(intercept), 2)}`;
}

function coordinateText(point) {
  return `(${fmt(point[0], 2)}, ${fmt(point[1], 2)})`;
}

function triangleCentroid(a, b, c) {
  return [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
}

function triangleIncenter(a, b, c) {
  const sideA = distance(b, c);
  const sideB = distance(c, a);
  const sideC = distance(a, b);
  const total = sideA + sideB + sideC;
  if (total < 1e-12) return triangleCentroid(a, b, c);
  return [
    (sideA * a[0] + sideB * b[0] + sideC * c[0]) / total,
    (sideA * a[1] + sideB * b[1] + sideC * c[1]) / total,
  ];
}

function triangleOrthocenter(a, b, c) {
  const fromA = lineIntersection(a, perpendicular(vSub(c, b)), b, perpendicular(vSub(a, c)));
  return fromA ?? triangleCentroid(a, b, c);
}

/* ---------- module 1: plane figures and polygons ---------- */

const POLYGON_PARTS = [
  part({
    id: 'polygon-side',
    name: 'Side (edge)',
    geometricType: 'segment',
    definition: 'A straight segment forming part of a polygon boundary. Adjacent sides meet at a vertex.',
    measurementKind: 'length',
    symbol: 's',
    wordingExamples: [
      wording('side of the polygon', 'canonical term', ''),
      wording('edge of the n-gon', 'equivalent name in this context', ''),
      wording('If a problem gives side s, inspect this boundary segment.', 'problem wording', 'regular polygon when s denotes one side'),
    ],
    distinctionNote: 'One side is not the perimeter; perimeter adds all boundary sides.',
    relatedFormulaIds: ['F-P01'],
    lessonIds: POLY_LESSONS,
    searchAliases: ['edge', 'boundary segment'],
  }),
  part({
    id: 'polygon-vertex',
    name: 'Vertex',
    geometricType: 'point',
    definition: 'A shared endpoint of two adjacent sides of a polygon.',
    measurementKind: 'count',
    symbol: 'V',
    wordingExamples: [
      wording('vertex', 'canonical term', ''),
      wording('corner of the polygon', 'problem wording', 'descriptive wording'),
    ],
    distinctionNote: 'A vertex is a point, not the angle at that point or the two edges that meet there.',
    relatedFormulaIds: [],
    lessonIds: POLY_LESSONS,
    searchAliases: ['corner'],
  }),
  part({
    id: 'polygon-diagonal',
    name: 'Diagonal',
    geometricType: 'segment',
    definition: 'A segment joining two nonadjacent vertices of a polygon.',
    measurementKind: 'count',
    symbol: 'Nᵈ',
    wordingExamples: [
      wording('diagonal', 'canonical term', 'nonadjacent vertices'),
      wording('segment joining two nonadjacent corners', 'problem wording', ''),
    ],
    distinctionNote: 'A diagonal is not a side. In a concave polygon some diagonals lie outside the region but are still counted.',
    relatedFormulaIds: ['F-P06'],
    lessonIds: POLY_LESSONS,
    searchAliases: ['nonadjacent vertices'],
  }),
  part({
    id: 'polygon-interior-angle',
    name: 'Interior angle',
    geometricType: 'angle',
    definition: 'The angle inside the polygon between two adjacent sides at a vertex.',
    measurementKind: 'angle',
    symbol: 'θᵢ',
    wordingExamples: [
      wording('interior angle', 'canonical term', ''),
      wording('angle inside the polygon', 'problem wording', ''),
      wording('each interior angle equals the sum divided by n', 'measurement relationship', 'regular polygon only'),
    ],
    distinctionNote: 'The angle-sum formula applies to any simple n-gon; the equal-angle result requires regularity.',
    relatedFormulaIds: ['F-P03', 'F-P04'],
    lessonIds: POLY_LESSONS,
    searchAliases: ['inside angle'],
  }),
  part({
    id: 'polygon-exterior-angle',
    name: 'Exterior angle',
    geometricType: 'angle',
    definition: 'At a convex vertex, the angle supplementary to the interior angle, formed with one side extended.',
    measurementKind: 'angle',
    symbol: 'θₑ',
    wordingExamples: [
      wording('exterior angle', 'canonical term', 'convex vertex'),
      wording('turning angle outside the polygon', 'problem wording', 'convex vertex'),
    ],
    distinctionNote: 'This definition uses the supplementary angle at a convex vertex; do not transfer it unchanged to a reflex concave vertex.',
    relatedFormulaIds: ['F-P05'],
    lessonIds: POLY_LESSONS,
    searchAliases: ['outside angle', 'turning angle'],
  }),
  part({
    id: 'polygon-central-angle',
    name: 'Central angle',
    geometricType: 'angle',
    definition: 'For a regular polygon, the angle at its center between radii to two adjacent vertices.',
    measurementKind: 'angle',
    symbol: 'θᶜ',
    wordingExamples: [
      wording('central angle', 'canonical term', 'regular polygon'),
      wording('angle at the center between adjacent radii', 'problem wording', 'regular polygon'),
    ],
    distinctionNote: 'A center exists for the regular construction drawn here; the equal central-angle formula is not applied to the concave preset.',
    relatedFormulaIds: ['F-P02'],
    lessonIds: POLY_LESSONS,
    searchAliases: ['angle at center'],
  }),
  part({
    id: 'polygon-center',
    name: 'Center',
    geometricType: 'point',
    definition: 'The common center of the circumcircle and incircle of the regular polygon shown in convex mode.',
    measurementKind: 'coordinate',
    symbol: 'O',
    wordingExamples: [
      wording('center of the regular polygon', 'canonical term', 'regular polygon'),
      wording('the point from which radii to the vertices are drawn', 'problem wording', 'regular polygon'),
    ],
    distinctionNote: 'The concave preset is not regular, so regular-polygon center formulas are not claimed for it.',
    relatedFormulaIds: ['F-P02', 'F-P07'],
    lessonIds: POLY_LESSONS,
    searchAliases: ['centre', 'circumcenter'],
  }),
  part({
    id: 'polygon-apothem',
    name: 'Apothem',
    geometricType: 'segment',
    definition: 'The perpendicular segment from the center of a regular polygon to a side; it meets that side at its midpoint.',
    measurementKind: 'length',
    symbol: 'rₐ',
    wordingExamples: [
      wording('apothem', 'canonical term', 'regular convex polygon only'),
      wording('perpendicular from the center to a side', 'problem wording', 'regular convex polygon only'),
      wording('the apothem is the adjacent leg of the half-triangle', 'measurement relationship', 'regular convex polygon only'),
    ],
    distinctionNote: 'No apothem is claimed for the concave preset; an arbitrary center-to-side segment in a nonregular figure is not an apothem.',
    relatedFormulaIds: ['F-P07', 'F-P08', 'X-POLY-02'],
    lessonIds: ['poly-04'],
    searchAliases: ['inradius', 'center to side'],
  }),
];

const POLYGON_NAMES = ['', '', 'triangle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon'];

function isConcavePolygon(state, sides) {
  return flag(state, 'concave', 0) && sides >= 4;
}

function regularPolygonModel(sides, sideLength) {
  const radius = sideLength / (2 * Math.sin(Math.PI / sides));
  const vertices = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * TAU) / sides;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  });
  return { radius, vertices };
}

const polygonsFigure = {
  id: 'plane-figures-polygons',
  title: 'Plane Figures and Polygons',
  family: FAMILIES.plane,
  moduleId: 'plane-figures-polygons',
  lessonIds: POLY_LESSONS,
  presets: [
    makePreset('regular-triangle', 'Regular triangle (3)', { sides: 3, sideLength: 5, concave: 0 }),
    makePreset('regular-quadrilateral', 'Square (4)', { sides: 4, sideLength: 5, concave: 0 }),
    makePreset('regular-pentagon', 'Regular pentagon (5)', { sides: 5, sideLength: 4.5, concave: 0 }),
    makePreset('regular-hexagon', 'Regular hexagon (6)', { sides: 6, sideLength: 4, concave: 0 }),
    makePreset('regular-decagon', 'Regular decagon (10)', { sides: 10, sideLength: 2.5, concave: 0 }),
    makePreset('concave-pentagon', 'Concave pentagon (5)', { sides: 5, sideLength: 4.5, concave: 1 }),
    makePreset('concave-heptagon', 'Concave heptagon (7)', { sides: 7, sideLength: 3.5, concave: 1 }),
  ],
  parameters: [
    param('sides', 'Number of sides n', { min: 3, max: 10, step: 1, default: 6, unit: 'sides' }),
    param('sideLength', 'Regular side length s', { min: 2, max: 8, step: 0.5, default: 4, unit: 'units' }),
    param('concave', 'Concave notch', { min: 0, max: 1, step: 1, default: 0, unit: '' }),
  ],
  parts: POLYGON_PARTS,
  build(state) {
    const { showLabels, showHidden, showGuides } = state;
    void showHidden;
    void showGuides;
    const sides = Math.round(clamp(num(state, 'sides', 6), 3, 10));
    const sideLength = clamp(num(state, 'sideLength', 4), 1, 8);
    const wantedConcave = isConcavePolygon(state, sides);
    const concave = wantedConcave && sides >= 4;
    const model = regularPolygonModel(sides, sideLength);
    const vertices = model.vertices.map((vertex) => [...vertex]);
    // Move one vertex past the centre so the notch is reflex even for n = 4.
    if (concave) vertices[1] = vScale(vertices[1], -0.25);
    const maxRadius = Math.max(...vertices.map(vLen));
    const scale = Math.min(34, 205 / maxRadius);
    const frame = planeFrame(400, 260, scale);
    const screen = vertices.map(frame.toScreen);
    const centre = [frame.cx, frame.cy];
    const name = POLYGON_NAMES[sides] ?? `${sides}-gon`;
    const regular = !concave;
    const sideLengths = screen.map((point, index) => distance(point, screen[(index + 1) % sides]));
    const perimeter = sideLengths.reduce((sum, value) => sum + value, 0) / scale;
    const angleSum = (sides - 2) * 180;
    const diagonalCount = (sides * (sides - 3)) / 2;
    const apothem = sideLength / (2 * Math.tan(Math.PI / sides));
    const measurements = [
      measurement('Highlighted side length', `${fmt(sideLengths[0] / scale, 2)} units`, 'length', regular ? 'Equals the regular side length s.' : 'Measured from the concave model; the notch changes adjacent sides.'),
      measurement('Sides / vertices', String(sides), 'count', 'A polygon has the same number of sides and vertices.'),
      measurement('Interior-angle sum', `${fmt(angleSum, 0)}°`, 'angle', 'Applies to a simple n-gon, regular or not.'),
      measurement('Diagonals counted once', String(diagonalCount), 'count', 'Joins nonadjacent vertices; dimensionless.'),
    ];
    if (regular) {
      measurements.push(
        measurement('Perimeter P', `${fmt(sides * sideLength, 2)} units`, 'length', 'Regular polygon: P = ns.'),
        measurement('Each interior angle', `${fmt(angleSum / sides, 2)}°`, 'angle', 'Equal interior angles require regularity.'),
        measurement('Each exterior angle', `${fmt(360 / sides, 2)}°`, 'angle', 'Supplementary to each regular interior angle.'),
        measurement('One central angle', `${fmt(360 / sides, 2)}°`, 'angle', 'At the center between radii to adjacent vertices.'),
        measurement('Apothem rₐ', `${fmt(apothem, 2)} units`, 'length', 'Perpendicular from center to a side midpoint.'),
        measurement('Area A', `${fmt((sides * sideLength * apothem) / 2, 2)} square units`, 'area', 'Regular polygon area only.'),
      );
    }

    const primitives = [
      poly(null, screen, { role: 'face' }),
      ...screen.map((point, index) => seg('polygon-side', point, screen[(index + 1) % sides])),
      ...screen.map((point, index) => pt('polygon-vertex', point)),
    ];
    if (showLabels !== false) {
      screen.forEach((point, index) => {
        const outward = vScale(perpendicular(vSub(screen[(index + 1) % sides], screen[(index - 1 + sides) % sides])), 0.12);
        primitives.push(label(`V${index + 1}`, vAdd(point, outward)));
      });
    }
    if (showLabels !== false) primitives.push(label(`s = ${fmt(sideLengths[0] / scale, 2)}`, vMid(screen[0], screen[1])));

    if (sides >= 4) {
      primitives.push(seg('polygon-diagonal', screen[0], screen[2], { dash: 'dash' }));
      if (showLabels !== false) primitives.push(label('diagonal', vMid(screen[0], screen[2])));
    }

    const arcVertex = concave ? 2 : 0;
    const vertexPoint = screen[arcVertex];
    const previousPoint = screen[(arcVertex - 1 + sides) % sides];
    const nextPoint = screen[(arcVertex + 1) % sides];
    const interiorArc = arcThrough(
      vertexPoint, 24,
      Math.atan2(previousPoint[1] - vertexPoint[1], previousPoint[0] - vertexPoint[0]),
      Math.atan2(nextPoint[1] - vertexPoint[1], nextPoint[0] - vertexPoint[0]),
      Math.atan2(centre[1] - vertexPoint[1], centre[0] - vertexPoint[0]),
    );
    primitives.push(path('polygon-interior-angle', interiorArc, { role: 'curve' }));
    if (showLabels !== false) primitives.push(label('θᵢ', vAdd(vertexPoint, [0, 34])));

    const extensionEnd = vAdd(vertexPoint, vScale(vSub(vertexPoint, nextPoint), 0.34));
    primitives.push(guide('polygon-exterior-angle', vertexPoint, extensionEnd));
    const exteriorArc = arcThrough(
      vertexPoint, 31,
      Math.atan2(extensionEnd[1] - vertexPoint[1], extensionEnd[0] - vertexPoint[0]),
      Math.atan2(previousPoint[1] - vertexPoint[1], previousPoint[0] - vertexPoint[0]),
      Math.atan2(vertexPoint[1] - centre[1], vertexPoint[0] - centre[0]),
    );
    primitives.push(path('polygon-exterior-angle', exteriorArc, { role: 'curve' }));

    if (regular) {
      const angleTo = (point) => Math.atan2(point[1] - centre[1], point[0] - centre[0]);
      const startAngle = angleTo(screen[0]);
      const endAngle = angleTo(screen[1]);
      primitives.push(
        guide('polygon-central-angle', centre, screen[0]),
        guide('polygon-central-angle', centre, screen[1]),
        path('polygon-central-angle', arcThrough(centre, 38, startAngle, endAngle, (startAngle + endAngle) / 2), { role: 'curve' }),
        pt('polygon-center', centre),
      );
      const foot = vMid(screen[0], screen[1]);
      primitives.push(
        seg('polygon-apothem', centre, foot),
        rightMark('polygon-apothem', foot, centre, screen[0], 11),
      );
      if (showLabels !== false) {
        primitives.push(
          label('O', vAdd(centre, [0, -18])),
          label('θᶜ', vAdd(centre, [48, 0])),
          label('θₑ', vAdd(vertexPoint, [48, -12])),
          label('rₐ', vMid(centre, foot)),
        );
      }
    }

    const title = regular
      ? `Regular ${name}: ${sides} sides`
      : `Concave ${name}: ${sides} sides`;
    const description = regular
      ? `Regular ${name} with n = ${sides} and side length s = ${fmt(sideLength, 2)} units. The center, radii, central angle, and apothem belong to this regular convex construction.`
      : `Concave ${name} with ${sides} sides. One vertex is pulled inward, so the figure is simple but not regular; no apothem or equal-angle regular-polygon formula is applied.`;
    const note = concave
      ? 'The interior-angle sum and diagonal count remain valid for a simple polygon. Apothem, equal interior angles, and regular area are not claimed here.'
      : (!wantedConcave && num(state, 'concave', 0) !== 0
        ? 'A triangle cannot show this inward notch; the figure is drawn as a regular triangle.'
        : undefined);

    return { title, description, primitives, measurements, ...(note ? { note } : {}) };
  },
};

/* ---------- module 2: triangles ---------- */

const TRIANGLE_PARTS = [
  part({
    id: 'triangle-side',
    name: 'Side',
    geometricType: 'segment',
    definition: 'One of the three straight boundary segments of a triangle. Side lengths a, b, c lie opposite vertices A, B, C.',
    measurementKind: 'length',
    symbol: 'a, b, c',
    wordingExamples: [
      wording('side', 'canonical term', ''),
      wording('opposite side a', 'measurement relationship', 'side BC opposite vertex A'),
      wording('If the problem names side c, inspect AB.', 'problem wording', ''),
    ],
    distinctionNote: 'A side is a segment; its length is a number, and neither is the vertex or the angle at that vertex.',
    relatedFormulaIds: ['F-T04', 'F-T07'],
    lessonIds: TRI_LESSONS,
    searchAliases: ['edge', 'opposite side'],
  }),
  part({
    id: 'triangle-vertex',
    name: 'Vertex',
    geometricType: 'point',
    definition: 'A corner of the triangle where two sides meet.',
    measurementKind: 'angle',
    symbol: 'A, B, C',
    wordingExamples: [
      wording('vertex', 'canonical term', ''),
      wording('corner of the triangle', 'problem wording', 'descriptive wording'),
    ],
    distinctionNote: 'Selecting the vertex highlights the point; selecting its angle highlights the angle opening, not the point alone.',
    relatedFormulaIds: ['F-T06'],
    lessonIds: TRI_LESSONS,
    searchAliases: ['corner'],
  }),
  part({
    id: 'triangle-base',
    name: 'Base',
    geometricType: 'segment',
    definition: 'The side chosen for the current altitude construction. Any side may be chosen when its corresponding altitude is named.',
    measurementKind: 'length',
    symbol: 'b₀',
    wordingExamples: [
      wording('base', 'canonical term', 'selected side with its corresponding altitude'),
      wording('the side on which the triangle rests', 'problem wording', 'chosen orientation'),
    ],
    distinctionNote: 'For an isosceles triangle the base is the side opposite the vertex angle; for a general triangle it is chosen by the problem.',
    relatedFormulaIds: ['F-T05'],
    lessonIds: TRI_LESSONS,
    searchAliases: ['bottom side', 'chosen side'],
  }),
  part({
    id: 'triangle-altitude',
    name: 'Corresponding altitude',
    geometricType: 'segment',
    definition: 'The perpendicular segment from a vertex to the line containing the opposite side.',
    measurementKind: 'length',
    symbol: 'h',
    wordingExamples: [
      wording('altitude', 'canonical term', ''),
      wording('perpendicular height to the chosen base', 'problem wording', ''),
      wording('height h used in K = b₀h/2', 'measurement relationship', 'perpendicular base-height pair'),
    ],
    distinctionNote: 'For an obtuse triangle the foot can lie outside the side segment; the dashed extension is a guide, not a new triangle side.',
    relatedFormulaIds: ['F-T01', 'F-T05'],
    lessonIds: TRI_LESSONS,
    searchAliases: ['height', 'perpendicular segment'],
  }),
  part({
    id: 'triangle-median',
    name: 'Median',
    geometricType: 'segment',
    definition: 'The segment from a vertex to the midpoint of the opposite side.',
    measurementKind: 'length',
    symbol: 'm',
    wordingExamples: [
      wording('median', 'canonical term', ''),
      wording('segment to the midpoint of the opposite side', 'problem wording', ''),
    ],
    distinctionNote: 'A median is generally different from the altitude and internal angle bisector drawn from the same vertex.',
    relatedFormulaIds: ['F-T02', 'X-TRI-01'],
    lessonIds: ['tri-02'],
    searchAliases: ['midpoint segment'],
  }),
  part({
    id: 'triangle-angle-bisector',
    name: 'Internal angle bisector',
    geometricType: 'segment',
    definition: 'The segment from a vertex that divides the vertex angle into two equal angles and ends on the opposite side.',
    measurementKind: 'length',
    symbol: 'ℓ',
    wordingExamples: [
      wording('internal angle bisector', 'canonical term', ''),
      wording('segment that splits the vertex angle equally', 'problem wording', ''),
    ],
    distinctionNote: 'Equal angles at the vertex do not imply that the bisected side is split equally; that happens only in the isosceles case shown by the geometry.',
    relatedFormulaIds: ['F-T03'],
    lessonIds: ['tri-02'],
    searchAliases: ['bisector', 'angle splitter'],
  }),
  part({
    id: 'triangle-centroid',
    name: 'Centroid',
    geometricType: 'point',
    definition: 'The common point of the three medians.',
    measurementKind: 'coordinate',
    symbol: 'G',
    wordingExamples: [
      wording('centroid', 'canonical term', ''),
      wording('point where the medians meet', 'problem wording', ''),
      wording('divides each median 2:1 from the vertex', 'measurement relationship', 'supplemental explanatory fact'),
    ],
    distinctionNote: 'The centroid is not generally the incenter or orthocenter; those coincide only in special triangles.',
    relatedFormulaIds: ['F-T02'],
    lessonIds: ['tri-02'],
    searchAliases: ['center of mass', 'median intersection'],
  }),
  part({
    id: 'triangle-orthocenter',
    name: 'Orthocenter',
    geometricType: 'point',
    definition: 'The common point of the three altitudes or their supporting lines.',
    measurementKind: 'coordinate',
    symbol: 'H',
    wordingExamples: [
      wording('orthocenter', 'canonical term', ''),
      wording('intersection point of the altitudes', 'problem wording', ''),
    ],
    distinctionNote: 'In an obtuse triangle the orthocenter lies outside the triangle; this is not an error in the drawing.',
    relatedFormulaIds: ['F-T01'],
    lessonIds: ['tri-02'],
    searchAliases: ['altitude intersection'],
  }),
  part({
    id: 'triangle-incenter',
    name: 'Incenter',
    geometricType: 'point',
    definition: 'The common point of the three internal angle bisectors and the center of the inscribed circle.',
    measurementKind: 'coordinate',
    symbol: 'I',
    wordingExamples: [
      wording('incenter', 'canonical term', ''),
      wording('center of the inscribed circle', 'problem wording', ''),
    ],
    distinctionNote: 'The incenter is determined by angle bisectors, not by medians or altitudes.',
    relatedFormulaIds: ['F-T03'],
    lessonIds: ['tri-02'],
    searchAliases: ['inscribed circle center'],
  }),
];

function isEquilateralTriangle(a, b, c) {
  const sides = [distance(b, c), distance(c, a), distance(a, b)];
  return Math.max(...sides) - Math.min(...sides) < 0.02 * Math.max(...sides);
}

function isIsoscelesTriangle(a, b, c) {
  const [sideA, sideB, sideC] = [distance(b, c), distance(c, a), distance(a, b)];
  const largest = Math.max(sideA, sideB, sideC);
  return Math.abs(sideA - sideB) < 0.02 * largest
    || Math.abs(sideB - sideC) < 0.02 * largest
    || Math.abs(sideC - sideA) < 0.02 * largest;
}

function isRightTriangle(a, b, c) {
  const sides = [distance(b, c), distance(c, a), distance(a, b)].sort((x, y) => x - y);
  return Math.abs(sides[2] ** 2 - (sides[0] ** 2 + sides[1] ** 2)) < 0.02 * sides[2] ** 2;
}

function isObtuseTriangle(a, b, c) {
  const sides = [distance(b, c), distance(c, a), distance(a, b)].sort((x, y) => x - y);
  return sides[2] ** 2 > sides[0] ** 2 + sides[1] ** 2 + 0.02 * sides[2] ** 2;
}

function baseEnds(vertices, baseSide) {
  if (baseSide === 0) return [vertices[0], vertices[1]];
  if (baseSide === 1) return [vertices[1], vertices[2]];
  return [vertices[2], vertices[0]];
}

function oppositeVertex(vertices, baseSide) {
  return vertices[(baseSide + 2) % 3];
}

const trianglesFigure = {
  id: 'triangles',
  title: 'Triangles',
  family: FAMILIES.plane,
  moduleId: 'triangles',
  lessonIds: TRI_LESSONS,
  presets: [
    makePreset('equilateral', 'Equilateral', {
      A: [400, 350 - 140 * Math.sqrt(3)], B: [260, 350], C: [540, 350], baseSide: 2, specialSegments: 1,
    }),
    makePreset('isosceles', 'Isosceles', {
      A: [400, 110], B: [260, 350], C: [540, 350], baseSide: 2, specialSegments: 1,
    }),
    makePreset('right-triangle', 'Right triangle (5–12–13)', {
      A: [220, 220], B: [220, 320], C: [460, 320], baseSide: 1, specialSegments: 1,
    }),
    makePreset('acute-scalene', 'Acute scalene', {
      A: [400, 120], B: [250, 380], C: [590, 360], baseSide: 2, specialSegments: 1,
    }),
    makePreset('obtuse-outside-altitude', 'Obtuse: altitude outside', {
      A: [260, 320], B: [200, 180], C: [620, 320], baseSide: 2, specialSegments: 1,
    }),
  ],
  parameters: [
    param('baseSide', 'Base side (AB, BC, CA)', { min: 0, max: 2, step: 1, default: 2, unit: '' }),
    param('specialSegments', 'Show special segments', { min: 0, max: 1, step: 1, default: 1, unit: '' }),
  ],
  parts: TRIANGLE_PARTS,
  build(state) {
    const { showLabels, showHidden, showGuides } = state;
    void showHidden;
    void showGuides;
    const vertices = [
      pointValue(state, 'A', [400, 110]),
      pointValue(state, 'B', [260, 350]),
      pointValue(state, 'C', [540, 350]),
    ];
    const [A, B, C] = vertices;
    const baseSide = Math.round(clamp(num(state, 'baseSide', 2), 0, 2));
    const withSegments = flag(state, 'specialSegments', 1);
    const [baseA, baseB] = baseEnds(vertices, baseSide);
    const apex = oppositeVertex(vertices, baseSide);
    const sideNames = ['AB', 'BC', 'CA'];
    const sideLengths = [distance(A, B), distance(B, C), distance(C, A)];
    const oppositeNames = ['c', 'a', 'b'];
    const angles = [angleAt(A, B, C), angleAt(B, C, A), angleAt(C, A, B)];
    const area = Math.abs(vCross(vSub(B, A), vSub(C, A))) / 2;
    const perimeter = sideLengths.reduce((sum, value) => sum + value, 0);

    const foot = footData(apex, baseA, baseB);
    const altitudeLength = distance(apex, foot.point);
    const outside = foot.t < -1e-9 || foot.t > 1 + 1e-9;
    const midpoint = vMid(baseA, baseB);
    const medianLength = distance(apex, midpoint);
    const adjacentToA = distance(apex, baseA);
    const adjacentToB = distance(apex, baseB);
    const bisectorTotal = adjacentToA + adjacentToB;
    const bisectorFoot = bisectorTotal < 1e-12 ? apex : vAdd(
      vScale(baseA, adjacentToB / bisectorTotal),
      vScale(baseB, adjacentToA / bisectorTotal),
    );
    const bisectorLength = distance(apex, bisectorFoot);
    const centroid = triangleCentroid(A, B, C);
    const orthocenter = triangleOrthocenter(A, B, C);
    const incenter = triangleIncenter(A, B, C);

    const primitives = [
      poly(null, vertices, { role: 'face' }),
      seg('triangle-side', A, B),
      seg('triangle-side', B, C),
      seg('triangle-side', C, A),
      ...vertices.map((point) => pt('triangle-vertex', point)),
    ];
    if (showLabels !== false) {
      const places = [[-4, -18], [-26, 2], [14, 2]];
      vertices.forEach((point, index) => primitives.push(label('ABC'[index], vAdd(point, places[index]))));
    }
    primitives.push(seg('triangle-base', baseA, baseB, { dash: 'dot' }));
    if (showLabels !== false) {
      primitives.push(label('base', vAdd(vMid(baseA, baseB), [0, 20])));
      sideLengths.forEach((length, index) => {
        const from = vertices[index];
        const to = vertices[(index + 1) % 3];
        primitives.push(label(`${oppositeNames[index] === 'c' ? 'c = AB' : oppositeNames[index] === 'a' ? 'a = BC' : 'b = CA'} ${fmt(length, 1)}`, vMid(from, to)));
      });
    }

    if (withSegments) {
      primitives.push(
        dashed('triangle-altitude', apex, foot.point),
        rightMark('triangle-altitude', foot.point, apex, baseA, 12),
        guide('triangle-median', apex, midpoint),
        guide('triangle-angle-bisector', apex, bisectorFoot),
        pt('triangle-centroid', centroid),
        pt('triangle-orthocenter', orthocenter),
        pt('triangle-incenter', incenter),
      );
      if (outside) {
        const extensionEnd = foot.t < 0 ? baseA : baseB;
        primitives.push(dashed('triangle-altitude', foot.point, extensionEnd));
      }
      if (showLabels !== false) {
        primitives.push(
          label('h', vMid(apex, foot.point)),
          label('m', vMid(vMid(apex, midpoint), midpoint)),
          label('ℓ', vMid(apex, bisectorFoot)),
          label('G', vAdd(centroid, [16, -10])),
          label('H', vAdd(orthocenter, [16, 16])),
          label('I', vAdd(incenter, [-16, -12])),
        );
      }
    }

    const sideClass = isEquilateralTriangle(A, B, C)
      ? 'equilateral (also isosceles under the inclusive definition)'
      : (isIsoscelesTriangle(A, B, C) ? 'isosceles' : 'scalene');
    const angleClass = isRightTriangle(A, B, C) ? 'right'
      : (isObtuseTriangle(A, B, C) ? 'obtuse' : 'acute');
    const measurements = [
      ...sideLengths.map((length, index) => measurement(`Side ${sideNames[index]} (${oppositeNames[index]})`, `${fmt(length, 2)} units`, 'length', `Opposite vertex ${'ABC'[index]}.`)),
      ...angles.map((value, index) => measurement(`Angle ${'ABC'[index]}`, `${fmt(value, 2)}°`, 'angle', 'Interior angle from the drawn coordinates.')),
      measurement('Perimeter P', `${fmt(perimeter, 2)} units`, 'length', 'P = a + b + c.'),
      measurement('Area K', `${fmt(area, 2)} square units`, 'area', 'Computed from the drawn base and perpendicular height.'),
    ];
    if (withSegments) {
      measurements.push(
        measurement(`Altitude to ${sideNames[baseSide]}`, `${fmt(altitudeLength, 2)} units`, 'length', outside ? 'Foot lies on the extended line outside the side segment.' : 'Foot lies on the side segment.'),
        measurement(`Median to ${sideNames[baseSide]}`, `${fmt(medianLength, 2)} units`, 'length', 'Vertex to side midpoint.'),
        measurement(`Internal bisector to ${sideNames[baseSide]}`, `${fmt(bisectorLength, 2)} units`, 'length', 'Equal vertex angles from the drawn coordinates.'),
      );
    }
    const description = `${sideClass[0].toUpperCase()}${sideClass.slice(1)} ${angleClass} triangle. The chosen base is ${sideNames[baseSide]}; its corresponding altitude is drawn perpendicular to the side's supporting line.`;
    const note = outside
      ? `This obtuse triangle needs the side extension: the altitude foot is outside segment ${sideNames[baseSide]}, and the dashed extension is a construction guide, not an extra triangle side.`
      : (withSegments ? undefined : 'Enable special segments to inspect the altitude, median, angle bisector, and centers.');

    return {
      title: `${sideClass[0].toUpperCase()}${sideClass.slice(1)} ${angleClass} triangle`,
      description,
      primitives,
      measurements,
      ...(note ? { note } : {}),
    };
  },
};

/* ---------- module 3: quadrilaterals ---------- */

const QUADRILATERAL_PARTS = [
  part({
    id: 'quad-side',
    name: 'Side',
    geometricType: 'segment',
    definition: 'A boundary segment of the selected quadrilateral. Which sides are equal or parallel depends on the selected class.',
    measurementKind: 'length',
    symbol: 'a, b, c, d',
    wordingExamples: [
      wording('side', 'canonical term', ''),
      wording('boundary edge', 'equivalent name in this context', ''),
      wording('If the problem gives adjacent sides a and b, inspect these two sides.', 'problem wording', 'parallelogram class'),
    ],
    distinctionNote: 'A side is not the base face of a solid, and its length is not an area.',
    relatedFormulaIds: ['F-QD01', 'F-QD04', 'F-QD05', 'F-QD06', 'F-QD08'],
    lessonIds: QUAD_LESSONS,
    searchAliases: ['edge'],
  }),
  part({
    id: 'quad-base',
    name: 'Base (where applicable)',
    geometricType: 'segment',
    definition: 'A chosen side used with a perpendicular height. For a trapezoid, the bases are exactly the one pair of parallel opposite sides.',
    measurementKind: 'length',
    symbol: 'b₁, b₂',
    wordingExamples: [
      wording('base', 'canonical term', 'trapezoid parallel side or chosen side'),
      wording('one of the parallel sides', 'problem wording', 'trapezoid class'),
    ],
    distinctionNote: 'A parallelogram may use any side as a base; in a general convex quadrilateral no pair is guaranteed parallel.',
    relatedFormulaIds: ['F-QD01', 'F-QD07'],
    lessonIds: QUAD_LESSONS,
    searchAliases: ['parallel side'],
  }),
  part({
    id: 'quad-height',
    name: 'Height',
    geometricType: 'guide',
    definition: 'The perpendicular distance used with a base. With parallel bases it is their perpendicular separation.',
    measurementKind: 'length',
    symbol: 'h',
    wordingExamples: [
      wording('height', 'canonical term', 'perpendicular separation of parallel bases'),
      wording('perpendicular distance between the bases', 'problem wording', 'trapezoid or parallelogram class'),
    ],
    distinctionNote: 'A sloping leg is not the height. For the general quadrilateral, the drawn perpendicular is only a construction distance, not a class height.',
    relatedFormulaIds: ['F-QD01', 'F-QD07'],
    lessonIds: QUAD_LESSONS,
    searchAliases: ['altitude', 'perpendicular distance'],
  }),
  part({
    id: 'quad-diagonal',
    name: 'Diagonal',
    geometricType: 'segment',
    definition: 'A segment joining opposite vertices of a quadrilateral.',
    measurementKind: 'length',
    symbol: 'd₁, d₂',
    wordingExamples: [
      wording('diagonal', 'canonical term', ''),
      wording('segment from one corner to the opposite corner', 'problem wording', ''),
      wording('diagonals bisect one another', 'measurement relationship', 'parallelogram and its special cases'),
    ],
    distinctionNote: 'Diagonals are not sides. Their angle is not generally the angle between sides.',
    relatedFormulaIds: ['F-QD02', 'F-QD03', 'F-QD04', 'F-QD05', 'F-QD06'],
    lessonIds: QUAD_LESSONS,
    searchAliases: ['corner-to-corner segment'],
  }),
  part({
    id: 'quad-included-angle',
    name: 'Included side angle',
    geometricType: 'angle',
    definition: 'The angle between two adjacent sides at a vertex, such as the angle θ between sides a and b.',
    measurementKind: 'angle',
    symbol: 'θ',
    wordingExamples: [
      wording('included side angle', 'canonical term', 'between two given adjacent sides'),
      wording('angle between the two given sides', 'problem wording', ''),
      wording('K = ab sin θ uses this angle', 'measurement relationship', 'adjacent sides a and b'),
    ],
    distinctionNote: 'The included side angle is not automatically the angle between diagonals.',
    relatedFormulaIds: ['F-QD01', 'F-QD02', 'F-QD03', 'F-QD06'],
    lessonIds: QUAD_LESSONS,
    searchAliases: ['adjacent side angle'],
  }),
  part({
    id: 'quad-diagonal-angle',
    name: 'Diagonal angle',
    geometricType: 'angle',
    definition: 'The smaller angle φ at the intersection of the two diagonals.',
    measurementKind: 'angle',
    symbol: 'φ',
    wordingExamples: [
      wording('angle between the diagonals', 'canonical term', ''),
      wording('diagonal intersection angle', 'problem wording', ''),
      wording('K = ½d₁d₂ sin φ uses this angle', 'measurement relationship', 'parallelogram diagonal-area formula'),
    ],
    distinctionNote: 'φ is not generally θ; it is 90° for a rhombus and a square but not for a general rectangle.',
    relatedFormulaIds: ['F-QD03', 'F-QD06'],
    lessonIds: QUAD_LESSONS,
    searchAliases: ['phi', 'angle between diagonals'],
  }),
];

function quadClass(state) {
  return presetId(state).replace(/^quad-/, '');
}

function isParallelogramClass(kind) {
  return kind === 'parallelogram' || kind === 'rectangle' || kind === 'square' || kind === 'rhombus';
}

function isRectangleClass(kind) {
  return kind === 'rectangle' || kind === 'square';
}

function hasParallelBases(kind) {
  return kind !== 'general-convex';
}

function quadrilateralVertices(state, kind) {
  const fallback = {
    parallelogram: [210, 380], rectangle: [200, 380], square: [250, 380],
    rhombus: [225, 380], 'right-trapezoid': [200, 400], 'general-convex': [170, 380],
  }[kind] ?? [200, 380];
  const origin = pointValue(state, 'origin', fallback);
  if (kind === 'parallelogram' || kind === 'rhombus') {
    const baseLength = kind === 'rhombus' ? 190 : 250;
    const sideLength = kind === 'rhombus' ? 190 : 170;
    const angle = clamp(num(state, 'angle', kind === 'rhombus' ? 60 : 65), 25, 155) * DEG;
    const a = origin;
    const b = [a[0] + baseLength, a[1]];
    const d = [a[0] + sideLength * Math.cos(angle), a[1] - sideLength * Math.sin(angle)];
    const c = vAdd(b, vSub(d, a));
    return [a, b, c, d];
  }
  const defaults = {
    rectangle: [[200, 380], [560, 380], [560, 200], [200, 200]],
    square: [[250, 380], [510, 380], [510, 120], [250, 120]],
    'right-trapezoid': [[200, 400], [560, 400], [400, 240], [200, 240]],
    'general-convex': [[170, 380], [430, 400], [610, 250], [260, 170]],
  }[kind] ?? [[200, 380], [500, 380], [500, 200], [200, 200]];
  return defaults.map((point, index) => pointValue(state, `V${index}`, point));
}

const quadrilateralsFigure = {
  id: 'quadrilaterals',
  title: 'Quadrilaterals',
  family: FAMILIES.plane,
  moduleId: 'quadrilaterals',
  lessonIds: QUAD_LESSONS,
  presets: [
    makePreset('parallelogram', 'Parallelogram', { angle: 65, showDiagonals: 1 }),
    makePreset('rectangle', 'Rectangle', { angle: 90, showDiagonals: 1 }),
    makePreset('square', 'Square', { angle: 90, showDiagonals: 1 }),
    makePreset('rhombus', 'Rhombus', { angle: 60, showDiagonals: 1 }),
    makePreset('right-trapezoid', 'Right trapezoid', { angle: 45, showDiagonals: 1 }),
    makePreset('general-convex', 'General convex quadrilateral', { angle: 75, showDiagonals: 1 }),
  ],
  parameters: [
    param('angle', 'Included side angle θ (parallelogram / rhombus)', { min: 25, max: 155, step: 5, default: 65, unit: '°' }),
    param('showDiagonals', 'Show diagonals', { min: 0, max: 1, step: 1, default: 1, unit: '' }),
  ],
  parts: QUADRILATERAL_PARTS,
  build(state) {
    const { showLabels, showHidden, showGuides } = state;
    void showHidden;
    void showGuides;
    const kind = quadClass(state);
    const [A, B, C, D] = quadrilateralVertices(state, kind);
    const vertices = [A, B, C, D];
    const defaultAngle = { parallelogram: 65, rhombus: 60, rectangle: 90, square: 90 }[kind] ?? 90;
    const includedAngle = angleAt(A, B, D);
    const heightFoot = footData(D, A, B);
    const height = distance(D, heightFoot.point);
    const sides = [distance(A, B), distance(B, C), distance(C, D), distance(D, A)];
    const diagonalAC = distance(A, C);
    const diagonalBD = distance(B, D);
    const intersection = lineIntersection(A, vSub(C, A), B, vSub(D, B)) ?? vMid(A, C);
    const diagonalAngle = smallerAngle(vSub(A, intersection), vSub(B, intersection));
    const perimeter = sides.reduce((sum, value) => sum + value, 0);
    const parallelBases = hasParallelBases(kind);
    let area;
    if (kind === 'right-trapezoid') {
      area = ((sides[0] + sides[2]) * height) / 2;
    } else if (kind === 'general-convex') {
      const semi = perimeter / 2;
      const gamma = angleAt(C, B, D);
      const radicand = (semi - sides[0]) * (semi - sides[1]) * (semi - sides[2]) * (semi - sides[3])
        - sides[0] * sides[1] * sides[2] * sides[3] * Math.cos(((includedAngle + gamma) / 2) * DEG) ** 2;
      area = Math.sqrt(Math.max(0, radicand));
    } else {
      area = sides[0] * height;
    }

    const primitives = [
      poly(null, vertices, { role: 'face' }),
      seg('quad-side', A, B),
      seg('quad-side', B, C),
      seg('quad-side', C, D),
      seg('quad-side', D, A),
      seg('quad-base', A, B, { dash: 'dot' }),
    ];
    if (parallelBases) primitives.push(seg('quad-base', D, C, { dash: 'dot' }));
    if (showLabels !== false) {
      vertices.forEach((point, index) => primitives.push(label('ABCD'[index], vAdd(point, index < 2 ? [0, 19] : [0, -14]))));
      primitives.push(label(`base ${fmt(sides[0], 1)}`, vAdd(vMid(A, B), [0, 33])));
    }

    const heightStart = D;
    primitives.push(
      guide('quad-height', heightStart, heightFoot.point),
      rightMark('quad-height', heightFoot.point, D, B, 12),
    );
    if (heightFoot.t < 0 || heightFoot.t > 1) {
      primitives.push(guide('quad-height', heightFoot.point, heightFoot.t < 0 ? A : B));
    }
    if (showLabels !== false) primitives.push(label('h', vMid(heightStart, heightFoot.point)));

    const centroid = [
      vertices.reduce((sum, vertex) => sum + vertex[0], 0) / 4,
      vertices.reduce((sum, vertex) => sum + vertex[1], 0) / 4,
    ];
    const includedArc = arcThrough(
      A, 26,
      Math.atan2(B[1] - A[1], B[0] - A[0]),
      Math.atan2(D[1] - A[1], D[0] - A[0]),
      Math.atan2(centroid[1] - A[1], centroid[0] - A[0]),
    );
    primitives.push(path('quad-included-angle', includedArc, { role: 'curve' }));
    if (Math.abs(includedAngle - 90) < 0.5) {
      primitives.push(rightMark('quad-included-angle', A, B, D, 15));
    }
    if (showLabels !== false) primitives.push(label('θ', vAdd(A, [38, -22])));

    if (flag(state, 'showDiagonals', 1)) {
      primitives.push(
        seg('quad-diagonal', A, C, { dash: 'dash' }),
        seg('quad-diagonal', B, D, { dash: 'dash' }),
        path('quad-diagonal-angle', smallArc(intersection, 25, vSub(A, intersection), vSub(B, intersection)), { role: 'curve' }),
      );
      if (showLabels !== false) {
        primitives.push(
          label('d₁', vMid(A, C)),
          label('d₂', vMid(B, D)),
          label('φ', vAdd(intersection, [30, -18])),
        );
      }
    }

    const measurements = [
      ...sides.map((length, index) => measurement(`Side ${'ABCD'[index]}`, `${fmt(length, 2)} units`, 'length', 'Boundary side length from the drawn coordinates.')),
      measurement('Chosen base b₁', `${fmt(sides[0], 2)} units`, 'length', parallelBases ? 'Parallel side used with the perpendicular height.' : 'Chosen side; no parallel pair is guaranteed in this class.'),
      measurement('Height h', `${fmt(height, 2)} units`, 'length', parallelBases ? 'Perpendicular separation of parallel sides.' : 'Construction distance to the chosen side, not a class height.'),
      measurement('Diagonal d₁ = AC', `${fmt(diagonalAC, 2)} units`, 'length', 'Full segment joining opposite vertices.'),
      measurement('Diagonal d₂ = BD', `${fmt(diagonalBD, 2)} units`, 'length', 'Full segment joining opposite vertices.'),
      measurement('Included side angle θ', `${fmt(includedAngle, 2)}°`, 'angle', 'Between adjacent sides at A.'),
      measurement('Diagonal angle φ', `${fmt(diagonalAngle, 2)}°`, 'angle', 'Smaller angle at diagonal intersection, not generally θ.'),
      measurement('Perimeter', `${fmt(perimeter, 2)} units`, 'length', 'Sum of the four boundary sides.'),
      measurement('Area K', `${fmt(area, 2)} square units`, 'area', kind === 'general-convex' ? 'Bretschneider formula from the drawn sides and opposite angles.' : 'Class-appropriate area from the drawn geometry.'),
    ];

    let propertyText;
    if (kind === 'parallelogram') {
      propertyText = 'Opposite sides are parallel and equal, opposite angles are equal, consecutive angles are supplementary, and diagonals bisect one another. The diagonal angle is not generally the included side angle.';
    } else if (isRectangleClass(kind) && kind === 'rectangle') {
      propertyText = 'A rectangle has four right angles and equal diagonals that bisect one another; its diagonals are not generally perpendicular.';
    } else if (kind === 'square') {
      propertyText = 'A square is both a rectangle and a rhombus: four right angles, four equal sides, equal diagonals, and perpendicular diagonals.';
    } else if (kind === 'rhombus') {
      propertyText = 'A rhombus has four equal sides, perpendicular diagonals that bisect one another, and diagonals that are not generally equal.';
    } else if (kind === 'right-trapezoid') {
      propertyText = 'Under this course convention a trapezoid has exactly one pair of parallel opposite sides; the left leg is perpendicular to the bases, and the sloping leg is not the height.';
    } else {
      propertyText = 'A general convex quadrilateral has no guaranteed parallel or equal sides; four side lengths alone do not determine its area.';
    }
    const description = `${kind.replace(/-/g, ' ')}. ${propertyText}`;
    const formulaNote = kind === 'general-convex'
      ? 'Only the general convex-quadrilateral relation is applied; no trapezoid or parallelogram shortcut is assumed.'
      : (isParallelogramClass(kind) ? `The included side angle is ${fmt(defaultAngle, 1)}° for the preset${kind === 'parallelogram' || kind === 'rhombus' ? ' and changes with the angle control' : ''}.` : undefined);

    return {
      title: `Quadrilateral: ${kind.replace(/-/g, ' ')}`,
      description,
      primitives,
      measurements,
      ...(formulaNote ? { note: formulaNote } : {}),
    };
  },
};

/* ---------- module 4: cartesian coordinates ---------- */

const CARTESIAN_PARTS = [
  part({
    id: 'cart-axis',
    name: 'Coordinate axis',
    geometricType: 'line',
    definition: 'A reference line of the coordinate plane: the horizontal x-axis and vertical y-axis meet at right angles.',
    measurementKind: 'coordinate',
    symbol: 'x-axis, y-axis',
    wordingExamples: [
      wording('axis', 'canonical term', ''),
      wording('reference line for a coordinate', 'problem wording', ''),
    ],
    distinctionNote: 'Axes are reference lines; they are not polygon edges, and the projection guides are not new sides.',
    relatedFormulaIds: [],
    lessonIds: ['cart-01'],
    searchAliases: ['x-axis', 'y-axis'],
  }),
  part({
    id: 'cart-origin',
    name: 'Origin',
    geometricType: 'point',
    definition: 'The intersection of the two coordinate axes, with coordinates (0, 0).',
    measurementKind: 'coordinate',
    symbol: '(0, 0)',
    wordingExamples: [
      wording('origin', 'canonical term', ''),
      wording('the point where the axes cross', 'problem wording', ''),
    ],
    distinctionNote: 'A point on an axis does not belong to a quadrant; only the origin has both coordinates zero.',
    relatedFormulaIds: [],
    lessonIds: ['cart-01'],
    searchAliases: ['zero point'],
  }),
  part({
    id: 'cart-quadrant',
    name: 'Quadrant',
    geometricType: 'region',
    definition: 'One of four regions numbered counterclockwise from the upper right by the signs of x and y.',
    measurementKind: 'count',
    symbol: 'I–IV',
    wordingExamples: [
      wording('quadrant', 'canonical term', ''),
      wording('upper-right region', 'problem wording', 'Quadrant I: x > 0, y > 0'),
    ],
    distinctionNote: 'Axis points belong to no quadrant, and quadrants are two-dimensional regions, not octants.',
    relatedFormulaIds: [],
    lessonIds: ['cart-01'],
    searchAliases: ['region', 'signs of coordinates'],
  }),
  part({
    id: 'cart-point',
    name: 'Ordered point',
    geometricType: 'point',
    definition: 'A location written as an ordered pair (x, y): signed horizontal displacement followed by signed vertical displacement.',
    measurementKind: 'coordinate',
    symbol: '(x, y)',
    wordingExamples: [
      wording('ordered pair', 'canonical term', ''),
      wording('point P at (x, y)', 'problem wording', ''),
    ],
    distinctionNote: 'Order matters: (x, y) and (y, x) usually name different points.',
    relatedFormulaIds: [],
    lessonIds: ['cart-01', 'cart-02'],
    searchAliases: ['ordered pair', 'coordinate pair'],
  }),
  part({
    id: 'cart-coordinate-differences',
    name: 'Coordinate differences',
    geometricType: 'guide',
    definition: 'The signed changes Δx = x₂ − x₁ and Δy = y₂ − y₁ from the first point to the second.',
    measurementKind: 'coordinate',
    symbol: 'Δx, Δy',
    wordingExamples: [
      wording('coordinate differences', 'canonical term', ''),
      wording('run and rise from A to B', 'problem wording', ''),
      wording('d² = (Δx)² + (Δy)²', 'measurement relationship', 'two plane points'),
    ],
    distinctionNote: 'Reversing the direction reverses the signs of Δx and Δy but leaves the ordinary distance unchanged.',
    relatedFormulaIds: ['X-CART-02', 'F-C01'],
    lessonIds: ['cart-02'],
    searchAliases: ['delta x', 'delta y', 'run and rise'],
  }),
  part({
    id: 'cart-midpoint',
    name: 'Midpoint',
    geometricType: 'point',
    definition: 'The point whose coordinates are the averages of the endpoint coordinates.',
    measurementKind: 'coordinate',
    symbol: 'M',
    wordingExamples: [
      wording('midpoint', 'canonical term', ''),
      wording('point halfway between the two endpoints', 'problem wording', ''),
      wording('M = ((x₁+x₂)/2, (y₁+y₂)/2)', 'measurement relationship', 'two endpoints'),
    ],
    distinctionNote: 'The midpoint is a point, not a distance; it coincides with the division point only when t = 1/2.',
    relatedFormulaIds: ['F-C02'],
    lessonIds: ['cart-03'],
    searchAliases: ['halfway point'],
  }),
  part({
    id: 'cart-division-point',
    name: 'Division point',
    geometricType: 'point',
    definition: 'The point Q = A + t(B − A). For 0 < t < 1 it divides segment AB internally in the ratio t : (1 − t).',
    measurementKind: 'coordinate',
    symbol: 'Q',
    wordingExamples: [
      wording('division point', 'canonical term', ''),
      wording('point that divides AB in a given ratio', 'problem wording', 'internal division'),
      wording('crossed weights use n x₁ + m x₂', 'measurement relationship', 'internal ratio m:n'),
    ],
    distinctionNote: 'A directed parameter t and an unsigned distance ratio are different descriptions; t = 1/2 gives the midpoint.',
    relatedFormulaIds: ['F-C03', 'F-C04', 'X-CART-04'],
    lessonIds: ['cart-03'],
    searchAliases: ['ratio point', 'internal division'],
  }),
  part({
    id: 'cart-distance',
    name: 'Distance segment',
    geometricType: 'segment',
    definition: 'The joining segment whose length is the ordinary distance between two points.',
    measurementKind: 'length',
    symbol: 'd',
    wordingExamples: [
      wording('distance between the points', 'canonical term', ''),
      wording('length of segment AB', 'problem wording', ''),
      wording('the two squared differences are added', 'measurement relationship', 'plane distance'),
    ],
    distinctionNote: 'The segment is the geometric object; d is its nonnegative length. Coincident points have distance zero and no unique joining line.',
    relatedFormulaIds: ['F-C01', 'X-CART-01', 'X-CART-03'],
    lessonIds: ['cart-02'],
    searchAliases: ['segment length', 'joining segment'],
  }),
];

function isOnAxis(point) {
  return Math.abs(point[0]) < 1e-9 || Math.abs(point[1]) < 1e-9;
}

function quadrantOf(point) {
  if (isOnAxis(point)) return 'axis';
  if (point[0] > 0 && point[1] > 0) return 'I';
  if (point[0] < 0 && point[1] > 0) return 'II';
  if (point[0] < 0 && point[1] < 0) return 'III';
  return 'IV';
}

function quadrantCorners(quadrant) {
  const corners = {
    I: [[0, 0], [9, 0], [9, 6], [0, 6]],
    II: [[-9, 0], [0, 0], [0, 6], [-9, 6]],
    III: [[-9, -6], [0, -6], [0, 0], [-9, 0]],
    IV: [[0, -6], [9, -6], [9, 0], [0, 0]],
  };
  return corners[quadrant];
}

const cartesianFigure = {
  id: 'cartesian-coordinates',
  title: 'Cartesian Coordinates',
  family: FAMILIES.coordinates,
  moduleId: 'cartesian-coordinates',
  lessonIds: CART_LESSONS,
  presets: [
    makePreset('quadrant-i', 'Both points in Quadrant I', { x1: 1, y1: 2, x2: 7, y2: 5, t: 0.75 }),
    makePreset('across-origin', 'Segment across the origin', { x1: -6, y1: 3, x2: 8, y2: -4, t: 0.5 }),
    makePreset('axis-point', 'Point on an axis', { x1: -5, y1: 0, x2: 4, y2: 5, t: 0.4 }),
    makePreset('inside-ratio', 'Internal division 3:1', { x1: 9, y1: 5, x2: -7, y2: 1, t: 0.75 }),
    makePreset('vertical-segment', 'Vertical distance', { x1: -4, y1: -5, x2: -4, y2: 4, t: 0.5 }),
  ],
  parameters: [
    param('x1', 'x-coordinate of first point', { min: -8, max: 8, step: 1, default: 1, unit: '' }),
    param('y1', 'y-coordinate of first point', { min: -6, max: 6, step: 1, default: 2, unit: '' }),
    param('x2', 'x-coordinate of second point', { min: -8, max: 8, step: 1, default: 7, unit: '' }),
    param('y2', 'y-coordinate of second point', { min: -6, max: 6, step: 1, default: 5, unit: '' }),
    param('t', 'Division parameter t', { min: 0, max: 1, step: 0.05, default: 0.5, unit: '' }),
  ],
  parts: CARTESIAN_PARTS,
  build(state) {
    const { showLabels, showHidden, showGuides } = state;
    void showHidden;
    void showGuides;
    const frame = planeFrame(400, 260, 34);
    const A = [num(state, 'x1', 1), num(state, 'y1', 2)];
    const B = [num(state, 'x2', 7), num(state, 'y2', 5)];
    const t = clamp(num(state, 't', 0.5), 0, 1);
    const Q = vLerp(A, B, t);
    const M = vMid(A, B);
    const difference = vSub(B, A);
    const distinct = vLen(difference) > 1e-9;
    const corner = [B[0], A[1]];
    const quadrant = quadrantOf(isOnAxis(A) ? B : A);
    const aScreen = frame.toScreen(A);
    const bScreen = frame.toScreen(B);
    const qScreen = frame.toScreen(Q);
    const mScreen = frame.toScreen(M);

    const primitives = [
      seg('cart-axis', frame.toScreen([-9, 0]), frame.toScreen([9, 0]), { role: 'guide' }),
      seg('cart-axis', frame.toScreen([0, -6]), frame.toScreen([0, 6]), { role: 'guide' }),
    ];
    if (quadrantCorners(quadrant)) {
      primitives.push(poly('cart-quadrant', quadrantCorners(quadrant).map(frame.toScreen), { role: 'face' }));
    }
    primitives.push(
      pt('cart-origin', frame.toScreen([0, 0])),
      pt('cart-point', aScreen),
      pt('cart-point', bScreen),
    );
    if (showLabels !== false) {
      primitives.push(
        label('O', vAdd(frame.toScreen([0, 0]), [-16, 18])),
        label(`A ${coordinateText(A)}`, vAdd(aScreen, [0, -18])),
        label(`B ${coordinateText(B)}`, vAdd(bScreen, [0, -18])),
        label(quadrant === 'axis' ? 'axis point' : `Quadrant ${quadrant}`, [quadrant === 'I' || quadrant === 'IV' ? 650 : 150, quadrant === 'III' || quadrant === 'IV' ? 440 : 80]),
      );
    }
    if (distinct) {
      primitives.push(
        guide('cart-coordinate-differences', aScreen, frame.toScreen(corner)),
        guide('cart-coordinate-differences', frame.toScreen(corner), bScreen),
        seg('cart-distance', aScreen, bScreen),
        pt('cart-midpoint', mScreen),
        pt('cart-division-point', qScreen),
      );
      if (showLabels !== false) {
        primitives.push(
          label(`Δx = ${fmt(difference[0], 2)}`, vMid(aScreen, frame.toScreen(corner))),
          label(`Δy = ${fmt(difference[1], 2)}`, vAdd(vMid(frame.toScreen(corner), bScreen), [34, 0])),
          label(`M ${coordinateText(M)}`, vAdd(mScreen, [0, 22])),
          label(`Q ${coordinateText(Q)}`, vAdd(qScreen, [0, -20])),
        );
      }
    }

    const measurements = [
      measurement('Point A', coordinateText(A), 'coordinate', quadrantOf(A) === 'axis' ? 'On an axis: belongs to no quadrant.' : `Quadrant ${quadrantOf(A)}.`),
      measurement('Point B', coordinateText(B), 'coordinate', quadrantOf(B) === 'axis' ? 'On an axis: belongs to no quadrant.' : `Quadrant ${quadrantOf(B)}.`),
      measurement('Δx', fmt(difference[0], 2), 'coordinate', 'Final x minus initial x.'),
      measurement('Δy', fmt(difference[1], 2), 'coordinate', 'Final y minus initial y.'),
    ];
    if (distinct) {
      measurements.push(
        measurement('Distance AB', `${fmt(vLen(difference), 2)} units`, 'length', 'The two squared coordinate differences are added.'),
        measurement('Midpoint M', coordinateText(M), 'coordinate', 'Coordinate averages of A and B.'),
        measurement('Division point Q', coordinateText(Q), 'coordinate', `A + t(B − A), t = ${fmt(t, 2)}.`),
        measurement('Division ratio AQ:QB', `${fmt(t, 2)} : ${fmt(1 - t, 2)}`, 'count', 'Internal ratio for 0 < t < 1.'),
      );
    }
    const description = `Coordinate plane with A = ${coordinateText(A)} and B = ${coordinateText(B)}. The dashed projection guides show coordinate differences; they are construction guides, not polygon edges.`;
    const note = !distinct
      ? 'The endpoints coincide: distance is zero and no unique joining line or ratio construction exists.'
      : (isOnAxis(A) || isOnAxis(B) ? 'A point with x = 0 lies on the y-axis and a point with y = 0 lies on the x-axis; axis points belong to no quadrant.' : undefined);

    return {
      title: 'Cartesian plane: points and division',
      description,
      primitives,
      measurements,
      ...(note ? { note } : {}),
    };
  },
};

/* ---------- module 5: lines ---------- */

const LINE_PARTS = [
  part({
    id: 'line-line',
    name: 'Line',
    geometricType: 'line',
    definition: 'A straight reference line extending indefinitely; the drawing shows its portion inside the viewport.',
    measurementKind: 'count',
    symbol: 'ℓ₁, ℓ₂',
    wordingExamples: [
      wording('line', 'canonical term', ''),
      wording('supporting line', 'problem wording', 'when only part of it is drawn'),
    ],
    distinctionNote: 'A line is not one of the segments used to measure slope or rise/run; equal displayed slopes can also describe the same line.',
    relatedFormulaIds: ['F-L05', 'F-L06', 'F-L07', 'F-L08', 'F-L10', 'F-L11'],
    lessonIds: LINE_LESSONS,
    searchAliases: ['supporting line', 'infinite line'],
  }),
  part({
    id: 'line-point',
    name: 'Point',
    geometricType: 'point',
    definition: 'A located point used with another point to determine a line, slope, or segment.',
    measurementKind: 'coordinate',
    symbol: '(x, y)',
    wordingExamples: [
      wording('point', 'canonical term', ''),
      wording('given point on the line', 'problem wording', ''),
    ],
    distinctionNote: 'Two identical points do not determine a unique line.',
    relatedFormulaIds: ['F-L06', 'F-L08'],
    lessonIds: LINE_LESSONS,
    searchAliases: ['given point'],
  }),
  part({
    id: 'line-x-intercept',
    name: 'x-intercept',
    geometricType: 'point',
    definition: 'The point where a line meets the x-axis, with y = 0.',
    measurementKind: 'coordinate',
    symbol: '(aₓ, 0)',
    wordingExamples: [
      wording('x-intercept', 'canonical term', ''),
      wording('where the graph crosses the x-axis', 'problem wording', ''),
    ],
    distinctionNote: 'A horizontal line off the x-axis has no x-intercept; the x-axis itself has infinitely many.',
    relatedFormulaIds: ['F-L09'],
    lessonIds: ['line-03'],
    searchAliases: ['horizontal intercept', 'root'],
  }),
  part({
    id: 'line-y-intercept',
    name: 'y-intercept',
    geometricType: 'point',
    definition: 'The point where a line meets the y-axis, with x = 0.',
    measurementKind: 'coordinate',
    symbol: '(0, bᵧ)',
    wordingExamples: [
      wording('y-intercept', 'canonical term', ''),
      wording('where the graph crosses the y-axis', 'problem wording', ''),
    ],
    distinctionNote: 'A vertical line not on the y-axis has no y-intercept; a vertical line has undefined slope.',
    relatedFormulaIds: ['F-L07', 'F-L09'],
    lessonIds: ['line-03'],
    searchAliases: ['vertical intercept'],
  }),
  part({
    id: 'line-rise-run',
    name: 'Rise/run guides',
    geometricType: 'guide',
    definition: 'Horizontal and vertical guides showing Δx (run) and Δy (rise) between two points on a line.',
    measurementKind: 'coordinate',
    symbol: 'Δy / Δx',
    wordingExamples: [
      wording('rise over run', 'canonical term', ''),
      wording('slope triangle', 'problem wording', ''),
      wording('m = (y₂ − y₁)/(x₂ − x₁)', 'measurement relationship', 'x₂ ≠ x₁'),
    ],
    distinctionNote: 'A vertical line has run = 0 and undefined slope; it is not an infinite numeric slope.',
    relatedFormulaIds: ['F-L01', 'F-L08'],
    lessonIds: ['line-01'],
    searchAliases: ['slope triangle', 'delta x delta y'],
  }),
  part({
    id: 'line-angle',
    name: 'Angle between lines',
    geometricType: 'angle',
    definition: 'The smaller unoriented angle α at the supporting-line intersection, with 0 ≤ α ≤ 90°.',
    measurementKind: 'angle',
    symbol: 'α',
    wordingExamples: [
      wording('angle between the lines', 'canonical term', 'smaller unoriented angle'),
      wording('smaller angle at the intersection', 'problem wording', ''),
      wording('use atan2 of absolute cross and absolute dot', 'measurement relationship', 'direction-vector implementation'),
    ],
    distinctionNote: 'A directed counterclockwise angle and a triangle interior angle can differ from the smaller unoriented angle; parallel lines give α = 0°.',
    relatedFormulaIds: ['F-L02', 'F-L03', 'X-LINE-02'],
    lessonIds: ['line-02'],
    searchAliases: ['phi', 'intersection angle'],
  }),
  part({
    id: 'line-perpendicular-bisector',
    name: 'Perpendicular bisector',
    geometricType: 'guide',
    definition: 'The line through the midpoint of a segment at right angles to it.',
    measurementKind: 'coordinate',
    symbol: '↕',
    wordingExamples: [
      wording('perpendicular bisector', 'canonical term', ''),
      wording('line through the midpoint at a right angle', 'problem wording', ''),
    ],
    distinctionNote: 'It is a construction line, not automatically one of the two displayed lines.',
    relatedFormulaIds: ['F-L06', 'X-LINE-01'],
    lessonIds: ['line-01', 'line-03'],
    searchAliases: ['bisector line'],
  }),
];

function lineState(state) {
  const frame = planeFrame(400, 260, 34);
  return {
    frame,
    p1: pointValue(state, 'p1', [-5, -1]),
    d1: pointValue(state, 'd1', [8, 3]),
    p2: pointValue(state, 'p2', [-4, 4]),
    d2: pointValue(state, 'd2', [8, -4]),
  };
}

function uniqueIntercept(point, direction, axis) {
  if (axis === 'x') {
    if (Math.abs(direction[1]) < 1e-9) return null;
    const t = -point[1] / direction[1];
    return [point[0] + t * direction[0], 0];
  }
  if (Math.abs(direction[0]) < 1e-9) return null;
  const t = -point[0] / direction[0];
  return [0, point[1] + t * direction[1]];
}

const linesFigure = {
  id: 'lines',
  title: 'Lines',
  family: FAMILIES.coordinates,
  moduleId: 'lines',
  lessonIds: LINE_LESSONS,
  presets: [
    makePreset('intersecting', 'Intersecting lines', {
      p1: [-5, -1], d1: [8, 3], p2: [-4, 4], d2: [8, -4], showBisector: 1, showRiseRun: 1,
    }),
    makePreset('parallel', 'Distinct parallel lines', {
      p1: [-6, 2], d1: [8, 2], p2: [-6, -2], d2: [8, 2], showBisector: 1, showRiseRun: 1,
    }),
    makePreset('perpendicular', 'Perpendicular lines', {
      p1: [-6, -1], d1: [6, 4], p2: [-1, 5], d2: [4, -6], showBisector: 1, showRiseRun: 1,
    }),
    makePreset('vertical-horizontal', 'Vertical and horizontal', {
      p1: [2, -4], d1: [0, 8], p2: [-7, -1], d2: [8, 0], showBisector: 1, showRiseRun: 1,
    }),
    makePreset('intercepts', 'Intercept forms', {
      p1: [0, -3], d1: [4, 3], p2: [0, 2], d2: [6, -2], showBisector: 0, showRiseRun: 1,
    }),
  ],
  parameters: [
    param('showRiseRun', 'Show rise/run guides', { min: 0, max: 1, step: 1, default: 1, unit: '' }),
    param('showBisector', 'Show perpendicular bisector', { min: 0, max: 1, step: 1, default: 1, unit: '' }),
  ],
  parts: LINE_PARTS,
  build(state) {
    const { showLabels, showHidden, showGuides } = state;
    void showHidden;
    void showGuides;
    const { frame, p1, d1, p2, d2 } = lineState(state);
    const lines = [
      { point: p1, direction: d1, name: 'ℓ₁' },
      { point: p2, direction: d2, name: 'ℓ₂' },
    ];
    const slopes = lines.map((line) => slopeOf(line.direction));
    const parallel = Math.abs(vCross(d1, d2)) < 1e-9;
    const isPerpendicular = Math.abs(vDot(d1, d2)) < 1e-9;
    const intersection = lineIntersection(p1, d1, p2, d2);
    const angle = parallel ? 0 : smallerAngle(d1, d2);

    const primitives = [
      seg('line-line', frame.toScreen([-9, 0]), frame.toScreen([9, 0]), { role: 'guide' }),
      seg('line-line', frame.toScreen([0, -6]), frame.toScreen([0, 6]), { role: 'guide' }),
      pt('line-point', frame.toScreen([0, 0])),
    ];
    lines.forEach((line) => {
      const screenPoint = frame.toScreen(line.point);
      const screenDirection = [line.direction[0] * frame.scale, -line.direction[1] * frame.scale];
      const [from, to] = clipLineToBox(screenPoint, screenDirection);
      primitives.push(seg('line-line', from, to));
      primitives.push(pt('line-point', screenPoint));
      if (showLabels !== false) {
        primitives.push(label(line.name, vAdd(screenPoint, [20, -14])));
      }
      const xIntercept = uniqueIntercept(line.point, line.direction, 'x');
      const yIntercept = uniqueIntercept(line.point, line.direction, 'y');
      if (xIntercept) {
        const screenIntercept = frame.toScreen(xIntercept);
        if (withinCanvas(screenIntercept)) {
          primitives.push(pt('line-x-intercept', screenIntercept));
          if (showLabels !== false) primitives.push(label(`x-int ${fmt(xIntercept[0], 1)}`, vAdd(screenIntercept, [0, 20])));
        }
      }
      if (yIntercept) {
        const screenIntercept = frame.toScreen(yIntercept);
        if (withinCanvas(screenIntercept)) {
          primitives.push(pt('line-y-intercept', screenIntercept));
          if (showLabels !== false) primitives.push(label(`y-int ${fmt(yIntercept[1], 1)}`, vAdd(screenIntercept, [-44, 0])));
        }
      }
    });

    const runEnd = vAdd(p1, d1);
    const startScreen = frame.toScreen(p1);
    const cornerScreen = frame.toScreen([runEnd[0], p1[1]]);
    const endScreen = frame.toScreen(runEnd);
    if (flag(state, 'showRiseRun', 1)) {
      primitives.push(
        guide('line-rise-run', startScreen, cornerScreen),
        guide('line-rise-run', cornerScreen, endScreen),
      );
      if (showLabels !== false) {
        primitives.push(
          label(`Δx = ${fmt(d1[0], 2)}`, vMid(startScreen, cornerScreen)),
          label(`Δy = ${fmt(d1[1], 2)}`, vAdd(vMid(cornerScreen, endScreen), [36, 0])),
        );
      }
    }

    if (intersection && !parallel) {
      const crossing = frame.toScreen(intersection);
      const unit1 = [d1[0], -d1[1]];
      const unit2 = [d2[0], -d2[1]];
      primitives.push(path('line-angle', smallArc(crossing, 30, unit1, unit2), { role: 'curve' }));
      if (isPerpendicular) primitives.push(rightMark('line-angle', crossing, vAdd(crossing, unit1), vAdd(crossing, unit2), 15));
      if (showLabels !== false) primitives.push(label(`α = ${fmt(angle, 1)}°`, vAdd(crossing, [40, 24])));
    }

    if (flag(state, 'showBisector', 1)) {
      const midpoint = vMid(p1, runEnd);
      const bisectorDirection = perpendicular(d1);
      const screenMid = frame.toScreen(midpoint);
      const screenBisector = [bisectorDirection[0] * frame.scale, -bisectorDirection[1] * frame.scale];
      const [bisectorStart, bisectorEnd] = clipLineToBox(screenMid, screenBisector);
      primitives.push(
        dashed('line-perpendicular-bisector', bisectorStart, bisectorEnd),
        pt('line-point', screenMid),
        rightMark('line-perpendicular-bisector', screenMid, startScreen, vAdd(screenMid, screenBisector), 12),
      );
      if (showLabels !== false) primitives.push(label('perp. bisector', vAdd(bisectorEnd, [0, -14])));
    }

    const measurements = [
      measurement('Line ℓ₁', lineEquation(p1, d1), 'coordinate', `Slope: ${slopeText(slopes[0])}.`),
      measurement('Line ℓ₂', lineEquation(p2, d2), 'coordinate', `Slope: ${slopeText(slopes[1])}.`),
      measurement('Slope of ℓ₁', slopeText(slopes[0]), 'count', slopes[0] === null ? 'Vertical line: slope undefined.' : 'Rise divided by run.'),
      measurement('Slope of ℓ₂', slopeText(slopes[1]), 'count', slopes[1] === null ? 'Vertical line: slope undefined.' : 'Rise divided by run.'),
      measurement('Rise / run on ℓ₁', `${fmt(d1[1], 2)} / ${fmt(d1[0], 2)}`, 'count', slopes[0] === null ? 'Run is zero; slope is undefined.' : 'From the two marked points.'),
      measurement('Smaller angle between lines', `${fmt(angle, 2)}°`, 'angle', parallel ? 'Distinct parallel lines give α = 0°.' : 'Smaller unoriented angle.'),
    ];
    lines.forEach((line, index) => {
      const xIntercept = uniqueIntercept(line.point, line.direction, 'x');
      const yIntercept = uniqueIntercept(line.point, line.direction, 'y');
      measurements.push(
        measurement(`x-intercept ℓ${index + 1}`, xIntercept ? coordinateText(xIntercept) : 'none', 'coordinate', xIntercept ? 'Point with y = 0.' : 'Parallel to the x-axis with y ≠ 0.'),
        measurement(`y-intercept ℓ${index + 1}`, yIntercept ? coordinateText(yIntercept) : 'none', 'coordinate', yIntercept ? 'Point with x = 0.' : 'Vertical line with x ≠ 0; slope undefined.'),
      );
    });

    const relation = parallel ? 'distinct parallel lines with equal slopes where defined'
      : (isPerpendicular ? 'perpendicular lines' : 'intersecting lines');
    const description = `${relation}. Slope is rise over run; the dashed slope triangle and perpendicular bisector are construction guides, not additional given lines.`;
    const note = slopes.some((slope) => slope === null)
      ? 'The vertical line has undefined slope; it is not assigned an infinite numeric slope. A vertical line is perpendicular to a horizontal line.'
      : (parallel ? 'Equal finite slopes can also describe the same line; compare full equations before calling distinct lines parallel.' : undefined);

    return {
      title: `Lines: ${relation}`,
      description,
      primitives,
      measurements,
      ...(note ? { note } : {}),
    };
  },
};

/* ---------- module 6: circles ---------- */

const CIRCLE_PARTS = [
  part({
    id: 'circle-boundary',
    name: 'Circle (boundary)',
    geometricType: 'curve',
    definition: 'The set of all points at a fixed positive distance r from the center. Only the circumference is part of the circle.',
    measurementKind: 'none',
    symbol: '⊙O',
    wordingExamples: [
      wording('circle', 'canonical term', ''),
      wording('circumference', 'equivalent name in this context', 'boundary curve only'),
      wording('points whose distance from the center is r', 'problem wording', ''),
    ],
    distinctionNote: 'The circle boundary is not the disk. It has no area; the enclosed disk has area.',
    relatedFormulaIds: ['F-O01', 'F-O02', 'X-CIRC-02'],
    lessonIds: ['circ-02'],
    searchAliases: ['circumference', 'boundary'],
  }),
  part({
    id: 'circle-center',
    name: 'Center',
    geometricType: 'point',
    definition: 'The fixed point (h, k) from which every boundary point is distance r.',
    measurementKind: 'coordinate',
    symbol: 'O(h, k)',
    wordingExamples: [
      wording('center', 'canonical term', ''),
      wording('the point named in the standard circle equation', 'problem wording', ''),
    ],
    distinctionNote: 'A center is not a point of tangency unless the radius happens to end there, which it does not.',
    relatedFormulaIds: ['F-O01', 'F-O02'],
    lessonIds: ['circ-02'],
    searchAliases: ['centre', '(h, k)'],
  }),
  part({
    id: 'circle-radius',
    name: 'Radius',
    geometricType: 'segment',
    definition: 'A segment joining the center to a point on the circle; every radius has length r.',
    measurementKind: 'length',
    symbol: 'r',
    wordingExamples: [
      wording('radius', 'canonical term', ''),
      wording('segment from the center to the circle', 'problem wording', ''),
      wording('perpendicular to the tangent at its endpoint', 'measurement relationship', 'tangent at a circle point'),
    ],
    distinctionNote: 'A radius is a segment; r is its length. It is half a diameter, not the whole chord.',
    relatedFormulaIds: ['F-O01', 'F-O03', 'F-O04'],
    lessonIds: CIRC_LESSONS,
    searchAliases: ['center-to-circle segment'],
  }),
  part({
    id: 'circle-diameter',
    name: 'Diameter',
    geometricType: 'segment',
    definition: 'A chord passing through the center; its length is 2r.',
    measurementKind: 'length',
    symbol: 'd = 2r',
    wordingExamples: [
      wording('diameter', 'canonical term', ''),
      wording('chord through the center', 'problem wording', ''),
      wording('length 2r', 'measurement relationship', 'same circle'),
    ],
    distinctionNote: 'A diameter is a chord with an extra condition; not every chord passes through the center.',
    relatedFormulaIds: ['F-O01'],
    lessonIds: ['circ-02'],
    searchAliases: ['full width'],
  }),
  part({
    id: 'circle-chord',
    name: 'Chord',
    geometricType: 'segment',
    definition: 'A segment joining two points on the circle.',
    measurementKind: 'length',
    symbol: 'chord',
    wordingExamples: [
      wording('chord', 'canonical term', ''),
      wording('segment with both endpoints on the circle', 'problem wording', ''),
    ],
    distinctionNote: 'This drawn chord does not pass through the center, so it is not a diameter.',
    relatedFormulaIds: [],
    lessonIds: ['circ-02'],
    searchAliases: ['circle segment'],
  }),
  part({
    id: 'circle-tangent',
    name: 'Tangent line',
    geometricType: 'line',
    definition: 'A line that meets the circle at exactly one point.',
    measurementKind: 'coordinate',
    symbol: 'ℓ',
    wordingExamples: [
      wording('tangent line', 'canonical term', ''),
      wording('line touching the circle at one point', 'problem wording', ''),
    ],
    distinctionNote: 'A tangent is not a chord: it does not join two circle points and lies outside the disk except at tangency.',
    relatedFormulaIds: ['F-O03', 'F-O04'],
    lessonIds: ['circ-03'],
    searchAliases: ['touching line'],
  }),
  part({
    id: 'circle-tangency-point',
    name: 'Point of tangency',
    geometricType: 'point',
    definition: 'The single circle point where the tangent touches the circle.',
    measurementKind: 'coordinate',
    symbol: 'T(xₜ, yₜ)',
    wordingExamples: [
      wording('point of tangency', 'canonical term', ''),
      wording('where the tangent touches the circle', 'problem wording', ''),
    ],
    distinctionNote: 'This point lies on the circle boundary; the radius drawn to it is perpendicular to the tangent.',
    relatedFormulaIds: ['F-O03'],
    lessonIds: ['circ-03'],
    searchAliases: ['tangency point', 'touch point'],
  }),
  part({
    id: 'circle-disk',
    name: 'Disk / region',
    geometricType: 'surface',
    definition: 'The circle together with its interior; area refers to this enclosed region, not to the boundary curve.',
    measurementKind: 'area',
    symbol: 'A',
    wordingExamples: [
      wording('disk', 'canonical term', ''),
      wording('region enclosed by the circle', 'problem wording', ''),
      wording('area of the circular base', 'measurement relationship', 'solid base when a disk is used'),
    ],
    distinctionNote: 'A disk has area; a circle boundary does not. A solid base area is not the same object as its rim.',
    relatedFormulaIds: [],
    lessonIds: ['circ-02'],
    searchAliases: ['region', 'interior', 'circular area'],
  }),
];

function circleTangentData(centre, radius, angle) {
  const point = pointOnCircle(centre, radius, angle);
  const a = point[0] - centre[0];
  const b = point[1] - centre[1];
  const c = -(a * point[0] + b * point[1]);
  return { point, a, b, c };
}

const circlesFigure = {
  id: 'circles',
  title: 'Conics and Circles',
  family: FAMILIES.coordinates,
  moduleId: 'circles',
  lessonIds: CIRC_LESSONS,
  presets: [
    makePreset('circle-basic', 'Circle with disk', { h: 0, k: 0, r: 3, tangentAngle: 35, showTangent: 0 }),
    makePreset('circle-tangent', 'Circle and tangent', { h: 0, k: 0, r: 3, tangentAngle: 35, showTangent: 1 }),
    makePreset('off-centre-circle', 'Off-centre circle', { h: 1.5, k: -0.5, r: 2.5, tangentAngle: 120, showTangent: 1 }),
    makePreset('horizontal-tangent', 'Horizontal tangent', { h: -1, k: 1, r: 2.5, tangentAngle: 90, showTangent: 1 }),
    makePreset('vertical-tangent', 'Vertical tangent', { h: 2, k: 0, r: 2.5, tangentAngle: 0, showTangent: 1 }),
  ],
  parameters: [
    param('h', 'Center x-coordinate h', { min: -3, max: 3, step: 0.5, default: 0, unit: '' }),
    param('k', 'Center y-coordinate k', { min: -2, max: 2, step: 0.5, default: 0, unit: '' }),
    param('r', 'Radius r', { min: 1, max: 3.5, step: 0.5, default: 3, unit: 'units' }),
    param('tangentAngle', 'Tangency angle', { min: 0, max: 360, step: 5, default: 35, unit: '°' }),
    param('showTangent', 'Show tangent view', { min: 0, max: 1, step: 1, default: 1, unit: '' }),
  ],
  parts: CIRCLE_PARTS,
  build(state) {
    const { showLabels, showHidden, showGuides } = state;
    void showHidden;
    void showGuides;
    const frame = planeFrame(400, 260, 42);
    const centre = [num(state, 'h', 0), num(state, 'k', 0)];
    const radius = clamp(num(state, 'r', 3), 0.5, 4);
    const angle = num(state, 'tangentAngle', 35) * DEG;
    const showTangent = flag(state, 'showTangent', 1);
    const screenCentre = frame.toScreen(centre);
    const screenRadius = radius * frame.scale;

    const tangent = circleTangentData(centre, radius, angle);
    const screenTangentPoint = frame.toScreen(tangent.point);
    const diameterAngle = angle + Math.PI / 2;
    const diameterA = pointOnCircle(centre, radius, diameterAngle);
    const diameterB = pointOnCircle(centre, radius, diameterAngle + Math.PI);
    const chordA = pointOnCircle(centre, radius, angle + 0.75);
    const chordB = pointOnCircle(centre, radius, angle + 2.35);
    const chordLength = distance(chordA, chordB);

    const primitives = [
      ell('circle-disk', screenCentre, screenRadius, screenRadius, { role: 'surface' }),
      ell('circle-boundary', screenCentre, screenRadius, screenRadius, { role: 'curve' }),
      pt('circle-center', screenCentre),
      seg('circle-radius', screenCentre, screenTangentPoint),
      seg('circle-diameter', frame.toScreen(diameterA), frame.toScreen(diameterB)),
      pt('circle-diameter', frame.toScreen(diameterA)),
      pt('circle-diameter', frame.toScreen(diameterB)),
      seg('circle-chord', frame.toScreen(chordA), frame.toScreen(chordB)),
      pt('circle-chord', frame.toScreen(chordA)),
      pt('circle-chord', frame.toScreen(chordB)),
      pt('circle-radius', screenTangentPoint),
    ];
    if (showLabels !== false) {
      primitives.push(
        label('O', vAdd(screenCentre, [-18, -14])),
        label('r', vMid(screenCentre, screenTangentPoint)),
        label(`d = ${fmt(2 * radius, 1)}`, vMid(frame.toScreen(diameterA), frame.toScreen(diameterB))),
        label('chord', vMid(frame.toScreen(chordA), frame.toScreen(chordB))),
        label('disk', vAdd(screenCentre, [-radius * frame.scale * 0.45, radius * frame.scale * 0.45])),
        label('circle boundary', vAdd(screenCentre, [0, -screenRadius - 18])),
      );
    }

    let tangentDescription = 'Enable the tangent view to inspect a line that touches the circle at exactly one point.';
    if (showTangent) {
      const tangentDirection = perpendicular([tangent.a, tangent.b]);
      const screenDirection = [tangentDirection[0] * frame.scale, -tangentDirection[1] * frame.scale];
      const [tangentFrom, tangentTo] = clipLineToBox(screenTangentPoint, screenDirection);
      primitives.push(
        seg('circle-tangent', tangentFrom, tangentTo),
        pt('circle-tangency-point', screenTangentPoint),
        rightMark('circle-tangency-point', screenTangentPoint, screenCentre, vAdd(screenTangentPoint, screenDirection), 13),
      );
      if (showLabels !== false) {
        primitives.push(label('T', vAdd(screenTangentPoint, [18, -12])));
      }
      tangentDescription = `The tangent touches the circle at T = ${coordinateText(tangent.point)}; the radius OT is perpendicular to it.`;
    }

    const measurements = [
      measurement('Circle ⊙O', `(x − ${fmt(centre[0], 2)})² + (y − ${fmt(centre[1], 2)})² = ${fmt(radius * radius, 2)}`, 'coordinate', 'Standard equation with r > 0.'),
      measurement('Center O', coordinateText(centre), 'coordinate', 'The fixed point (h, k).'),
      measurement('Radius r', `${fmt(radius, 2)} units`, 'length', 'Segment from the center to a circle point.'),
      measurement('Diameter d', `${fmt(2 * radius, 2)} units`, 'length', 'A chord through the center; d = 2r.'),
      measurement('Chord length', `${fmt(chordLength, 2)} units`, 'length', 'Both endpoints lie on the circle; this chord does not pass through the center.'),
      measurement('Disk area A', `${fmt(Math.PI * radius * radius, 2)} square units`, 'area', 'Area belongs to the enclosed disk, not to the circle boundary.'),
    ];
    if (showTangent) {
      const distanceFromCentre = Math.abs(tangent.a * centre[0] + tangent.b * centre[1] + tangent.c) / Math.hypot(tangent.a, tangent.b);
      measurements.push(
        measurement('Point of tangency T', coordinateText(tangent.point), 'coordinate', 'The single circle point shared with the tangent line.'),
        measurement('Tangent at T', `(${fmt(tangent.a, 2)})(x − ${fmt(tangent.point[0], 2)}) + (${fmt(tangent.b, 2)})(y − ${fmt(tangent.point[1], 2)}) = 0`, 'coordinate', 'Tangent formula for a known point on a positive-radius circle.'),
        measurement('Center-to-tangent distance', `${fmt(distanceFromCentre, 2)} units`, 'length', 'The perpendicular distance equals r.'),
      );
    }

    return {
      title: 'Circle and tangent',
      description: `Circle ⊙O has center ${coordinateText(centre)} and radius r = ${fmt(radius, 2)} units. The shaded disk is the enclosed region; the circle boundary is only its curve. ${tangentDescription}`,
      primitives,
      measurements,
      note: 'A circle boundary has no area. Area A refers to the disk; a solid circular base uses that disk, while its rim is the circle boundary.',
    };
  },
};

export const figures = [
  polygonsFigure,
  trianglesFigure,
  quadrilateralsFigure,
  cartesianFigure,
  linesFigure,
  circlesFigure,
];
