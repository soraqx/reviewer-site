/* Gallery figures for the axis-parallel conics in modules 7–9.
 *
 * Every builder derives its curve, guides, labels and measurements from one
 * small model object, then projects that model into the shared 800 × 520 SVG
 * coordinate system. Reference lines are emitted with guide roles so they can
 * never be mistaken for part of the curve.
 */

import {
  FAMILIES,
  part,
  wording,
  measurement,
  seg,
  pt,
  ell,
  path,
  label,
  guide,
  dimension,
  dashed,
  rightMark,
  param,
  preset,
  fmt,
} from '../gallery-figure-utils.js';

const WIDTH = 800;
const HEIGHT = 520;
const CENTRE = [WIDTH / 2, HEIGHT / 2];
const BASE_UNIT = 40;

const PARABOLA_OPENINGS = [
  selectOption('right', 'Opens right'),
  selectOption('left', 'Opens left'),
  selectOption('up', 'Opens up'),
  selectOption('down', 'Opens down'),
];
const MAJOR_DIRECTIONS = [
  selectOption('horizontal', 'Horizontal major axis'),
  selectOption('vertical', 'Vertical major axis'),
];
const TRANSVERSE_DIRECTIONS = [
  selectOption('horizontal', 'Horizontal transverse axis'),
  selectOption('vertical', 'Vertical transverse axis'),
];

/* ------------------------------------------------------------------ *
 * Shared numeric, vector and projection helpers
 * ------------------------------------------------------------------ */

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/* Keep the repository's [value, label] select convention while also exposing
 * value/label properties for object-style parameter controls. */
function selectOption(value, labelText) {
  const option = [value, labelText];
  option.value = value;
  option.label = labelText;
  return option;
}

function readParams(state, defaults) {
  const values = state && typeof state.params === 'object' && state.params ? state.params : {};
  return { ...defaults, ...values };
}

function unitFor(view, maxUnit = Infinity) {
  const scale = number(view && view.scale, 1);
  const base = BASE_UNIT * clampNumber(scale, 0.6, 1.6);
  return Number.isFinite(maxUnit) ? Math.min(base, Math.max(8, maxUnit)) : base;
}

function projector(unit) {
  return ([x, y]) => [CENTRE[0] + unit * x, CENTRE[1] - unit * y];
}

function boundsFor(unit) {
  return {
    halfWidth: WIDTH / (2 * unit),
    halfHeight: HEIGHT / (2 * unit),
  };
}

function coordinate(value, places = 2) {
  return Number(value.toFixed(places));
}

function pathFrom(points) {
  if (!points.length) return '';
  const [first, ...rest] = points;
  return `M ${coordinate(first[0])} ${coordinate(first[1])}${rest
    .map((point) => ` L ${coordinate(point[0])} ${coordinate(point[1])}`)
    .join('')}`;
}

function vAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function vSub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

function vScale(a, factor) {
  return [a[0] * factor, a[1] * factor];
}

function clampLabel(point) {
  return [
    clampNumber(point[0], 18, WIDTH - 18),
    clampNumber(point[1], 18, HEIGHT - 14),
  ];
}

function labelAt(text, point, options = {}) {
  return label(text, clampLabel(point), options);
}

function lineEnds(point, direction, extent) {
  return [vSub(point, vScale(direction, extent)), vAdd(point, vScale(direction, extent))];
}

/* Coordinate axes are unattached decor, not inspectable figure parts. */
function referenceAxes(project, bounds) {
  return [
    guide(undefined, project([-bounds.halfWidth + 0.3, 0]), project([bounds.halfWidth - 0.3, 0])),
    guide(undefined, project([0, -bounds.halfHeight + 0.3]), project([0, bounds.halfHeight - 0.3])),
  ];
}

function presetName(state, presets) {
  const found = presets.find((entry) => entry.id === (state && state.preset));
  return found ? found.label : '';
}

function openingFrame(value, fallback = 'right') {
  const frames = {
    right: { horizontal: true, sign: 1 },
    left: { horizontal: true, sign: -1 },
    up: { horizontal: false, sign: 1 },
    down: { horizontal: false, sign: -1 },
  };
  const key = Object.prototype.hasOwnProperty.call(frames, value) ? value : fallback;
  const frame = frames[key];
  return {
    key,
    horizontal: frame.horizontal,
    sign: frame.sign,
    axis: frame.horizontal ? [frame.sign, 0] : [0, frame.sign],
    cross: frame.horizontal ? [0, 1] : [1, 0],
  };
}

function axisFrame(value, fallback = 'horizontal') {
  const key = value === 'horizontal' || value === 'vertical' ? value : fallback;
  const horizontal = key === 'horizontal';
  return {
    key,
    horizontal,
    axis: horizontal ? [1, 0] : [0, 1],
    cross: horizontal ? [0, 1] : [1, 0],
  };
}

function acosh(value) {
  return Math.log(value + Math.sqrt(Math.max(0, value * value - 1)));
}

function asinh(value) {
  return Math.log(value + Math.sqrt(value * value + 1));
}

/* ------------------------------------------------------------------ *
 * 7. Parabolas
 * ------------------------------------------------------------------ */

const parabolaPresets = [
  preset('para-right', 'Opens right', { orientation: 'right', p: 2 }),
  preset('para-left', 'Opens left', { orientation: 'left', p: 1.5 }),
  preset('para-up', 'Opens up', { orientation: 'up', p: 1 }),
  preset('para-down', 'Opens down', { orientation: 'down', p: 2.5 }),
];

const parabolaParameters = [
  param('orientation', 'Opening direction', {
    type: 'select',
    default: 'right',
    options: PARABOLA_OPENINGS,
    unit: '',
  }),
  param('p', 'Vertex–focus distance |p|', {
    min: 0.75,
    max: 2.5,
    step: 0.25,
    default: 2,
    unit: 'units',
  }),
];

const parabolaParts = [
  part({
    id: 'parabola',
    name: 'Parabola',
    geometricType: 'curve',
    definition:
      'The locus of points whose distance from the focus equals the perpendicular distance to the directrix. Its eccentricity is 1.',
    measurementKind: 'none',
    symbol: '',
    wordingExamples: [
      wording('parabola', 'canonical term', 'Any nondegenerate axis-parallel parabola.'),
      wording('locus with e = 1', 'equivalent name in this context', 'When focus and directrix define the curve.'),
      wording('graph of (y − k)² = 4p(x − h) or (x − h)² = 4p(y − k)', 'problem wording', 'After an equation is written in standard form.'),
    ],
    distinctionNote:
      'Only the drawn curve is the parabola. The axis, directrix and coordinate axes are reference lines, not part of the curve.',
    relatedFormulaIds: ['X-PARA-01', 'F-Q01', 'F-Q02', 'X-PARA-02'],
    lessonIds: ['para-01', 'para-02', 'para-03'],
    searchAliases: ['curve', 'locus', 'eccentricity one', 'e = 1'],
  }),
  part({
    id: 'vertex',
    name: 'Vertex',
    geometricType: 'point',
    definition:
      'The point on the parabola halfway between the focus and the directrix along the axis of symmetry.',
    measurementKind: 'coordinate',
    symbol: 'V(h, k)',
    wordingExamples: [
      wording('vertex', 'canonical term', 'For any nondegenerate parabola.'),
      wording('turning point', 'problem wording', 'Descriptive wording when the problem defines it that way.'),
      wording('(h, k) in standard form', 'measurement relationship', 'After completing the square.'),
    ],
    distinctionNote:
      'A parabola has one vertex and no centre of symmetry. The vertex is not the focus; the focus lies |p| units toward the opening.',
    relatedFormulaIds: ['F-Q01', 'F-Q02', 'X-PARA-01'],
    lessonIds: ['para-01', 'para-02'],
    searchAliases: ['turning point', 'V', 'vertex point'],
  }),
  part({
    id: 'focus',
    name: 'Focus',
    geometricType: 'point',
    definition:
      'The fixed point used with the directrix to define the parabola. The curve opens toward it.',
    measurementKind: 'coordinate',
    symbol: 'F',
    wordingExamples: [
      wording('focus', 'canonical term', 'For any nondegenerate parabola.'),
      wording('point the parabola opens toward', 'problem wording', 'When the opening direction is described verbally.'),
      wording('(h + p, k) for a horizontal axis', 'measurement relationship', 'Signed p is positive to the right and negative to the left.'),
    ],
    distinctionNote:
      'The focus is a point, not the vertex or the axis. Its distance from the vertex is |p|, while its distance from the directrix is 2|p|.',
    relatedFormulaIds: ['X-PARA-01', 'F-Q01', 'F-Q02'],
    lessonIds: ['para-01', 'para-02'],
    searchAliases: ['F', 'focal point', 'focus point'],
  }),
  part({
    id: 'directrix',
    name: 'Directrix',
    geometricType: 'line',
    definition:
      'The fixed line used with the focus to define the parabola. Every point of the curve is equally far from the focus and this line.',
    measurementKind: 'coordinate',
    symbol: 'x = h − p  or  y = k − p',
    wordingExamples: [
      wording('directrix', 'canonical term', 'For any nondegenerate parabola.'),
      wording('fixed line in the focus–directrix definition', 'equivalent name in this context', 'When the locus definition is stated.'),
      wording('line behind the vertex', 'problem wording', 'When the opening direction is also given.'),
    ],
    distinctionNote:
      'The directrix is a reference line, not part of the parabola and not the axis of symmetry. It lies |p| units behind the vertex.',
    relatedFormulaIds: ['X-PARA-01', 'F-Q01', 'F-Q02'],
    lessonIds: ['para-01', 'para-02'],
    searchAliases: ['fixed line', 'directrix line', 'defining line'],
  }),
  part({
    id: 'axis',
    name: 'Axis of symmetry',
    geometricType: 'line',
    definition:
      'The line through the vertex and focus that bisects the parabola into mirror-image halves.',
    measurementKind: 'coordinate',
    symbol: 'y = k  or  x = h',
    wordingExamples: [
      wording('axis of symmetry', 'canonical term', 'For any nondegenerate parabola.'),
      wording('axis', 'equivalent name in this context', 'When the parabola is axis-parallel.'),
      wording('line through the vertex and focus', 'problem wording', 'When those two points are supplied.'),
    ],
    distinctionNote:
      'The axis is a guide line through the vertex and focus. It is perpendicular to the directrix and is not one of the curve’s branches.',
    relatedFormulaIds: ['F-Q01', 'F-Q02'],
    lessonIds: ['para-01', 'para-02'],
    searchAliases: ['axis', 'symmetry axis', 'axis of the parabola'],
  }),
  part({
    id: 'latus-rectum',
    name: 'Latus rectum',
    geometricType: 'segment',
    definition:
      'The chord of the parabola through the focus perpendicular to the axis. Its endpoints lie on the curve.',
    measurementKind: 'length',
    symbol: '4|p|',
    wordingExamples: [
      wording('latus rectum', 'canonical term', 'For any nondegenerate parabola.'),
      wording('focal chord perpendicular to the axis', 'equivalent name in this context', 'When the chord passes through the focus at right angles to the axis.'),
      wording('chord through the focus', 'problem wording', 'When the problem specifies a perpendicular focal chord.'),
    ],
    distinctionNote:
      'The full chord is 4|p|; each half from the focus to an endpoint is 2|p|. It is a segment of the drawing, not a reference line.',
    relatedFormulaIds: ['F-Q03'],
    lessonIds: ['para-01', 'para-02'],
    searchAliases: ['focal chord', 'latus rectum length', '4p chord'],
  }),
  part({
    id: 'latus-endpoints',
    name: 'Latus rectum endpoints',
    geometricType: 'point',
    definition:
      'The two points where the latus rectum meets the parabola; the focus is their midpoint.',
    measurementKind: 'coordinate',
    symbol: 'L₁, L₂',
    wordingExamples: [
      wording('endpoints of the latus rectum', 'canonical term', 'When inspecting the focal chord.'),
      wording('(h + p, k ± 2|p|) for a horizontal axis', 'measurement relationship', 'Signed p determines the focus; |p| determines the offset.'),
      wording('two given points symmetric about the focus', 'problem wording', 'When reconstructing a parabola from a focal chord.'),
    ],
    distinctionNote:
      'These endpoints lie on the curve; the focus between them does not. For a vertical axis the offsets are horizontal instead.',
    relatedFormulaIds: ['F-Q03'],
    lessonIds: ['para-01', 'para-02'],
    searchAliases: ['latus endpoints', 'focal chord endpoints', 'L1', 'L2'],
  }),
];

function parabolaModel(params, view) {
  const opening = openingFrame(params.orientation, 'right');
  const pAbs = clampNumber(number(params.p, 2), 0.75, 2.5);
  const focus = vScale(opening.axis, pAbs);
  const directrixFoot = vScale(opening.axis, -pAbs);
  const latusHalf = 2 * pAbs;
  const latusA = vAdd(focus, vScale(opening.cross, -latusHalf));
  const latusB = vAdd(focus, vScale(opening.cross, latusHalf));

  /* The latus rectum is 4|p|, so reserve room for 2|p| on the cross axis
   * before applying the requested zoom. Use the correct half-extent for both
   * horizontal and vertical openings. */
  const crossRoomPx = opening.horizontal ? HEIGHT / 2 - 12 : WIDTH / 2 - 12;
  const axisRoomPx = opening.horizontal ? WIDTH / 2 - 12 : HEIGHT / 2 - 12;
  const unit = unitFor(view, Math.min(axisRoomPx / pAbs, crossRoomPx / (2 * pAbs)));
  const bounds = boundsFor(unit);
  const margin = 12 / unit;
  const crossLimit = (opening.horizontal ? bounds.halfHeight : bounds.halfWidth) - margin;
  const axisLimit = Math.max(
    pAbs + 0.6,
    (opening.horizontal ? bounds.halfWidth : bounds.halfHeight) - margin,
  );
  const tMax = Math.max(pAbs, Math.min(axisLimit, (crossLimit * crossLimit) / (4 * pAbs)));

  return {
    opening,
    pAbs,
    signedP: opening.sign * pAbs,
    vertex: [0, 0],
    focus,
    directrixFoot,
    latusA,
    latusB,
    latusHalf,
    unit,
    bounds,
    crossLimit,
    axisLimit,
    tMax,
  };
}

function parabolaCurve(model, project) {
  const sample = (side) => {
    const offsets = [];
    for (let index = 0; index <= 60; index += 1) offsets.push((model.tMax * index) / 60);
    if (!offsets.some((t) => Math.abs(t - model.pAbs) < 1e-9)) offsets.push(model.pAbs);
    offsets.sort((a, b) => a - b);
    const points = [];
    for (const t of offsets) {
      const transverse = side * 2 * Math.sqrt(model.pAbs * t);
      const world = vAdd(vScale(model.opening.axis, t), vScale(model.opening.cross, transverse));
      points.push(project(world));
    }
    return points;
  };
  const near = sample(-1).reverse();
  const far = sample(1).slice(1);
  return pathFrom([...near, ...far]);
}

function buildParabola(state) {
  const params = readParams(state, { orientation: 'right', p: 2 });
  const model = parabolaModel(params, state && state.view);
  const { opening, unit, bounds } = model;
  const project = projector(unit);
  const showLabels = !state || state.showLabels !== false;
  const showGuides = !state || state.showGuides !== false;
  const showHidden = Boolean(state && state.showHidden);

  const screenVertex = project(model.vertex);
  const screenFocus = project(model.focus);
  const screenLatusA = project(model.latusA);
  const screenLatusB = project(model.latusB);
  const directrixEnds = lineEnds(model.directrixFoot, opening.cross, model.crossLimit).map(project);
  const axisEnds = [
    project(vScale(opening.axis, -model.pAbs - 0.6)),
    project(vScale(opening.axis, model.axisLimit)),
  ];

  const primitives = [];

  if (showHidden) {
    primitives.push(...referenceAxes(project, bounds));
  }

  primitives.push(path('parabola', parabolaCurve(model, project)));

  if (showGuides) {
    primitives.push(
      dashed('directrix', directrixEnds[0], directrixEnds[1]),
      guide('axis', axisEnds[0], axisEnds[1]),
      dimension('focus', screenVertex, screenFocus, { dash: 'dash' }),
      rightMark('latus-rectum', screenFocus, screenLatusA, screenVertex, 12),
    );
  }

  primitives.push(
    seg('latus-rectum', screenLatusA, screenLatusB),
    pt('vertex', screenVertex),
    pt('focus', screenFocus),
    pt('latus-endpoints', screenLatusA),
    pt('latus-endpoints', screenLatusB),
  );

  if (showLabels) {
    const axisTip = axisEnds[1];
    const directrixLabelPoint = opening.horizontal
      ? [directrixEnds[0][0] - 10, 34]
      : [34, directrixEnds[0][1] - 10];
    primitives.push(
      labelAt('V', [screenVertex[0] + 15, screenVertex[1] - 14], { anchor: 'start' }),
      labelAt('F', [screenFocus[0] + 15, screenFocus[1] - 14], { anchor: 'start' }),
      labelAt(opening.horizontal ? 'directrix: x = −p' : 'directrix: y = −p', directrixLabelPoint, {
        anchor: opening.horizontal ? 'end' : 'start',
      }),
      labelAt(opening.horizontal ? 'axis: y = 0' : 'axis: x = 0', [
        axisTip[0] + (opening.horizontal ? -8 : 14),
        axisTip[1] + (opening.horizontal ? -12 : -4),
      ], { anchor: opening.horizontal ? 'end' : 'start' }),
      labelAt('latus rectum = 4|p|', [
        screenFocus[0] + (opening.horizontal ? -6 : 18),
        screenFocus[1] + (opening.horizontal ? -22 : -4),
      ], { anchor: opening.horizontal ? 'end' : 'start' }),
      labelAt('L₁', [screenLatusA[0] + 12, screenLatusA[1] + 4], { anchor: 'start' }),
      labelAt('L₂', [screenLatusB[0] + 12, screenLatusB[1] + 4], { anchor: 'start' }),
    );
  }

  return {
    title: `Parabola opening ${opening.key}`,
    description: `Vertex at (0, 0), focus at (${fmt(model.focus[0])}, ${fmt(model.focus[1])}), signed p = ${fmt(model.signedP)}. ${
      presetName(state, parabolaPresets) || 'Four opening presets'
    }.`,
    primitives,
    measurements: [
      measurement('Vertex-to-focus distance |p|', fmt(model.pAbs), 'length', 'Signed p is +|p| for right/up and −|p| for left/down.'),
      measurement('Focus-to-directrix distance', fmt(2 * model.pAbs), 'length', 'Always 2|p|.'),
      measurement('Latus rectum length', fmt(4 * model.pAbs), 'length', 'The focal chord has length 4|p|.'),
      measurement('Focus-to-latus-endpoint distance', fmt(model.latusHalf), 'length', 'Each half-chord is 2|p|.'),
      measurement('Vertex', `(${fmt(model.vertex[0])}, ${fmt(model.vertex[1])})`, 'coordinate', 'The single vertex V(h, k).'),
      measurement('Focus', `(${fmt(model.focus[0])}, ${fmt(model.focus[1])})`, 'coordinate', 'The focus lies |p| units toward the opening.'),
      measurement('Number of vertices', '1', 'count', 'A parabola has one vertex and no centre of symmetry.'),
    ],
    note: 'The directrix, axis of symmetry and coordinate axes are guides, not part of the curve. p is never zero in a parabola.',
  };
}

/* ------------------------------------------------------------------ *
 * 8. Ellipses
 * ------------------------------------------------------------------ */

const ellipsePresets = [
  preset('elli-horizontal', 'Horizontal major axis', { orientation: 'horizontal', a: 4, b: 2.5 }),
  preset('elli-vertical', 'Vertical major axis', { orientation: 'vertical', a: 4, b: 2.5 }),
];

const ellipseParameters = [
  param('orientation', 'Major-axis direction', {
    type: 'select',
    default: 'horizontal',
    options: MAJOR_DIRECTIONS,
    unit: '',
  }),
  param('a', 'Semimajor axis a', { min: 3.2, max: 4, step: 0.2, default: 4, unit: 'units' }),
  param('b', 'Semiminor axis b', { min: 1.2, max: 3.2, step: 0.2, default: 2.5, unit: 'units' }),
];

const ellipseParts = [
  part({
    id: 'ellipse',
    name: 'Ellipse',
    geometricType: 'curve',
    definition:
      'The closed locus of points for which the sum of distances to two fixed foci is constant. In the noncircular cases a > b > 0.',
    measurementKind: 'none',
    symbol: '',
    wordingExamples: [
      wording('ellipse', 'canonical term', 'A noncircular, axis-parallel ellipse.'),
      wording('locus with focal-distance sum 2a', 'equivalent name in this context', 'When the two foci are given.'),
      wording('graph of (x − h)²/a² + (y − k)²/b² = 1', 'problem wording', 'For a horizontal major axis in standard form.'),
    ],
    distinctionNote:
      'The curve is not the bounding rectangle, either axis, or the center. The circle case a = b is a separate limit with no finite directrices and is not drawn here.',
    relatedFormulaIds: ['F-E01', 'X-ELLI-01', 'F-E03', 'F-E04', 'X-ELLI-03'],
    lessonIds: ['elli-01', 'elli-02', 'elli-03'],
    searchAliases: ['curve', 'oval', 'closed conic'],
  }),
  part({
    id: 'center',
    name: 'Center',
    geometricType: 'point',
    definition:
      'The intersection of the major and minor axes; it is also the midpoint of the two foci.',
    measurementKind: 'coordinate',
    symbol: 'O(h, k)',
    wordingExamples: [
      wording('center', 'canonical term', 'For every ellipse.'),
      wording('midpoint of the foci', 'equivalent name in this context', 'When both foci are known.'),
      wording('(h, k) in standard form', 'measurement relationship', 'After completing the square.'),
    ],
    distinctionNote:
      'The center is not on the curve and is not a focus. It bisects both full axes and both semiaxes.',
    relatedFormulaIds: ['F-E03', 'F-E04', 'F-E02'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['O', 'centre', 'midpoint'],
  }),
  part({
    id: 'major-axis',
    name: 'Major axis',
    geometricType: 'segment',
    definition:
      'The full chord of the ellipse through both foci, from one vertex to the other. Its length is 2a.',
    measurementKind: 'length',
    symbol: '2a',
    wordingExamples: [
      wording('major axis', 'canonical term', 'For a noncircular ellipse.'),
      wording('full major axis', 'equivalent name in this context', 'When contrast with a semiaxis is needed.'),
      wording('longer axis through the foci', 'problem wording', 'When the axis direction is described visually.'),
    ],
    distinctionNote:
      'The full major axis is 2a, twice the semimajor axis a. Its endpoints are the vertices; the foci lie inside it.',
    relatedFormulaIds: ['X-ELLI-01', 'F-E01', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['full major axis', '2a', 'principal axis segment'],
  }),
  part({
    id: 'minor-axis',
    name: 'Minor axis',
    geometricType: 'segment',
    definition:
      'The full chord perpendicular to the major axis at the center, from one covertex to the other. Its length is 2b.',
    measurementKind: 'length',
    symbol: '2b',
    wordingExamples: [
      wording('minor axis', 'canonical term', 'For a noncircular ellipse.'),
      wording('full minor axis', 'equivalent name in this context', 'When contrast with a semiaxis is needed.'),
      wording('shorter axis through the center', 'problem wording', 'When the two axis lengths are compared.'),
    ],
    distinctionNote:
      'The full minor axis is 2b, twice the semiminor axis b. It is perpendicular to, not parallel to, the major axis.',
    relatedFormulaIds: ['X-ELLI-01', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['full minor axis', '2b', 'short axis'],
  }),
  part({
    id: 'semimajor-axis',
    name: 'Semimajor axis',
    geometricType: 'segment',
    definition:
      'The segment from the center to a vertex along the major axis. Its length is a.',
    measurementKind: 'length',
    symbol: 'a',
    wordingExamples: [
      wording('semimajor axis', 'canonical term', 'For a noncircular ellipse.'),
      wording('half the major axis', 'equivalent name in this context', 'When the full axis length 2a is also shown.'),
      wording('a from the standard equation', 'measurement relationship', 'Take the square root of the larger denominator.'),
    ],
    distinctionNote:
      'a is half of the full major axis 2a. Selecting this part highlights only the center-to-vertex half, not the whole chord.',
    relatedFormulaIds: ['X-ELLI-01', 'F-E01', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['semiaxis a', 'half major axis', 'a'],
  }),
  part({
    id: 'semiminor-axis',
    name: 'Semiminor axis',
    geometricType: 'segment',
    definition:
      'The segment from the center to a covertex along the minor axis. Its length is b.',
    measurementKind: 'length',
    symbol: 'b',
    wordingExamples: [
      wording('semiminor axis', 'canonical term', 'For a noncircular ellipse.'),
      wording('half the minor axis', 'equivalent name in this context', 'When the full axis length 2b is also shown.'),
      wording('b from the standard equation', 'measurement relationship', 'Take the square root of the smaller denominator.'),
    ],
    distinctionNote:
      'b is half of the full minor axis 2b. It is not the focal distance c and not the latus rectum half-length b²/a.',
    relatedFormulaIds: ['X-ELLI-01', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['semiaxis b', 'half minor axis', 'b'],
  }),
  part({
    id: 'vertices',
    name: 'Vertices',
    geometricType: 'point',
    definition:
      'The two endpoints of the major axis; both lie on the ellipse.',
    measurementKind: 'coordinate',
    symbol: 'V₁, V₂',
    wordingExamples: [
      wording('vertices', 'canonical term', 'For a noncircular ellipse.'),
      wording('endpoints of the major axis', 'equivalent name in this context', 'When the major axis is identified.'),
      wording('(h ± a, k) for a horizontal major axis', 'measurement relationship', 'Swap the coordinates for a vertical major axis.'),
    ],
    distinctionNote:
      'Vertices are on the curve at distance a from the center. Covertices are the endpoints of the minor axis and are different points.',
    relatedFormulaIds: ['F-E03', 'F-E04', 'X-ELLI-01'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['V1', 'V2', 'major-axis endpoints'],
  }),
  part({
    id: 'covertices',
    name: 'Covertices',
    geometricType: 'point',
    definition:
      'The two endpoints of the minor axis; both lie on the ellipse.',
    measurementKind: 'coordinate',
    symbol: 'C₁, C₂',
    wordingExamples: [
      wording('covertices', 'canonical term', 'For a noncircular ellipse.'),
      wording('endpoints of the minor axis', 'equivalent name in this context', 'When the minor axis is identified.'),
      wording('(h, k ± b) for a horizontal major axis', 'measurement relationship', 'Swap the coordinates for a vertical major axis.'),
    ],
    distinctionNote:
      'Covertices are b units from the center along the minor axis; vertices are a units away along the major axis.',
    relatedFormulaIds: ['F-E03', 'F-E04', 'X-ELLI-01'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['C1', 'C2', 'minor-axis endpoints', 'co-vertices'],
  }),
  part({
    id: 'foci',
    name: 'Foci',
    geometricType: 'point',
    definition:
      'The two fixed interior points whose focal-distance sum is 2a everywhere on the ellipse.',
    measurementKind: 'coordinate',
    symbol: 'F₁, F₂',
    wordingExamples: [
      wording('foci', 'canonical term', 'For a noncircular ellipse.'),
      wording('fixed points in the locus definition', 'equivalent name in this context', 'When the constant-sum definition is used.'),
      wording('(h ± c, k) for a horizontal major axis', 'measurement relationship', 'Here c² = a² − b².'),
    ],
    distinctionNote:
      'Foci are inside the curve and are not the vertices. They are c units from the center, with 0 < c < a.',
    relatedFormulaIds: ['F-E01', 'F-E02', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['F1', 'F2', 'focus points', 'focal points'],
  }),
  part({
    id: 'directrices',
    name: 'Directrices',
    geometricType: 'line',
    definition:
      'Two lines perpendicular to the major axis, each at distance a/e = a²/c from the center. They lie outside the ellipse.',
    measurementKind: 'coordinate',
    symbol: 'x = h ± a²/c  or  y = k ± a²/c',
    wordingExamples: [
      wording('directrices', 'canonical term', 'For a noncircular ellipse with c > 0.'),
      wording('lines outside the ellipse perpendicular to the major axis', 'equivalent name in this context', 'When only their placement is described.'),
      wording('each directrix is a/e from the center', 'measurement relationship', 'Equivalent to a²/c because e = c/a.'),
    ],
    distinctionNote:
      'Directrices are reference lines outside the curve. The circle limit a = b gives c = 0 and no finite directrices, so it is excluded here.',
    relatedFormulaIds: ['X-ELLI-02', 'F-E02', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['directrix lines', 'outer guide lines', 'a squared over c'],
  }),
  part({
    id: 'latera-recta',
    name: 'Latera recta',
    geometricType: 'segment',
    definition:
      'The two focal chords perpendicular to the major axis. Each has midpoint at a focus and length 2b²/a.',
    measurementKind: 'length',
    symbol: '2b²/a',
    wordingExamples: [
      wording('latera recta', 'canonical term', 'For both noncircular orientations.'),
      wording('focal chords perpendicular to the major axis', 'equivalent name in this context', 'When the chords are described by construction.'),
      wording('length 2b²/a', 'measurement relationship', 'Use the semiaxes a and b, not the full axis lengths.'),
    ],
    distinctionNote:
      'Each full chord is 2b²/a and each half is b²/a. The two chords are separate segments through separate foci.',
    relatedFormulaIds: ['F-E05', 'X-ELLI-01', 'F-E03', 'F-E04'],
    lessonIds: ['elli-01', 'elli-02'],
    searchAliases: ['latus rectum', 'focal chords', '2b squared over a'],
  }),
];

function ellipseModel(params, bounds) {
  const frame = axisFrame(params.orientation, 'horizontal');
  const a = clampNumber(number(params.a, 4), 3.2, 4);
  const bMax = Math.min(3.2, a - 0.4);
  const b = clampNumber(number(params.b, 2.5), 1.2, bMax);
  const c = Math.sqrt(a * a - b * b);
  const eccentricity = c / a;
  const directrixDistance = (a * a) / c;
  const latusHalf = (b * b) / a;
  const vertices = [vScale(frame.axis, -a), vScale(frame.axis, a)];
  const covertices = [vScale(frame.cross, -b), vScale(frame.cross, b)];
  const foci = [vScale(frame.axis, -c), vScale(frame.axis, c)];
  const directrixFeet = [vScale(frame.axis, -directrixDistance), vScale(frame.axis, directrixDistance)];
  const extent = Math.max(bounds.halfHeight, bounds.halfWidth) + 1;
  return {
    frame,
    a,
    b,
    c,
    eccentricity,
    directrixDistance,
    latusHalf,
    vertices,
    covertices,
    foci,
    directrixFeet,
    extent,
  };
}

function buildEllipse(state) {
  const params = readParams(state, { orientation: 'horizontal', a: 4, b: 2.5 });
  const unit = unitFor(state && state.view);
  const bounds = boundsFor(unit);
  const project = projector(unit);
  const model = ellipseModel(params, bounds);
  const { frame } = model;
  const showLabels = !state || state.showLabels !== false;
  const showGuides = !state || state.showGuides !== false;
  const showHidden = Boolean(state && state.showHidden);

  const screenCentre = project([0, 0]);
  const screenVertices = model.vertices.map(project);
  const screenCovertices = model.covertices.map(project);
  const screenFoci = model.foci.map(project);
  const screenDirectrixFeet = model.directrixFeet.map(project);
  const directrixEnds = model.directrixFeet.map((foot) =>
    lineEnds(foot, frame.cross, model.extent).map(project),
  );
  const latera = model.foci.map((focus) => [
    project(vAdd(focus, vScale(frame.cross, -model.latusHalf))),
    project(vAdd(focus, vScale(frame.cross, model.latusHalf))),
  ]);

  const primitives = [];

  if (showHidden) {
    primitives.push(...referenceAxes(project, bounds));
  }

  primitives.push(
    ell('ellipse', screenCentre, frame.horizontal ? model.a * unit : model.b * unit, frame.horizontal ? model.b * unit : model.a * unit),
    seg('major-axis', screenVertices[0], screenVertices[1]),
    seg('minor-axis', screenCovertices[0], screenCovertices[1]),
  );

  if (showGuides) {
    primitives.push(
      dimension('semimajor-axis', screenCentre, screenVertices[1], { dash: 'dash' }),
      dimension('semiminor-axis', screenCentre, screenCovertices[1], { dash: 'dash' }),
      dashed('directrices', directrixEnds[0][0], directrixEnds[0][1]),
      dashed('directrices', directrixEnds[1][0], directrixEnds[1][1]),
      rightMark('center', screenCentre, screenVertices[1], screenCovertices[1], 12),
    );
  } else {
    primitives.push(
      seg('semimajor-axis', screenCentre, screenVertices[1], { dash: 'dash' }),
      seg('semiminor-axis', screenCentre, screenCovertices[1], { dash: 'dash' }),
    );
  }

  primitives.push(
    pt('center', screenCentre),
    pt('vertices', screenVertices[0]),
    pt('vertices', screenVertices[1]),
    pt('covertices', screenCovertices[0]),
    pt('covertices', screenCovertices[1]),
    pt('foci', screenFoci[0]),
    pt('foci', screenFoci[1]),
    seg('latera-recta', latera[0][0], latera[0][1]),
    seg('latera-recta', latera[1][0], latera[1][1]),
  );
  for (const chord of latera) {
    primitives.push(pt('latera-recta', chord[0]), pt('latera-recta', chord[1]));
  }

  if (showLabels) {
    const aLabelPoint = [
      (screenCentre[0] + screenVertices[1][0]) / 2,
      (screenCentre[1] + screenVertices[1][1]) / 2 + (frame.horizontal ? -14 : 2),
    ];
    const bLabelPoint = [
      (screenCentre[0] + screenCovertices[1][0]) / 2 + (frame.horizontal ? 2 : 14),
      (screenCentre[1] + screenCovertices[1][1]) / 2,
    ];
    primitives.push(
      labelAt('O', [screenCentre[0] - 16, screenCentre[1] - 14], { anchor: 'end' }),
      labelAt('V₁', [screenVertices[0][0] - 10, screenVertices[0][1] - 12], { anchor: 'end' }),
      labelAt('V₂', [screenVertices[1][0] + 10, screenVertices[1][1] - 12], { anchor: 'start' }),
      labelAt('C₁', [screenCovertices[0][0] - 12, screenCovertices[0][1] + 4], { anchor: 'end' }),
      labelAt('C₂', [screenCovertices[1][0] + 12, screenCovertices[1][1] - 6], { anchor: 'start' }),
      labelAt('F₁', [screenFoci[0][0] - 12, screenFoci[0][1] - 12], { anchor: 'end' }),
      labelAt('F₂', [screenFoci[1][0] + 12, screenFoci[1][1] - 12], { anchor: 'start' }),
      labelAt('full axis = 2a', [
        screenVertices[0][0] + (frame.horizontal ? 28 : 16),
        screenVertices[0][1] + (frame.horizontal ? -16 : 0),
      ], { anchor: 'start' }),
      labelAt('full axis = 2b', [
        screenCovertices[0][0] + (frame.horizontal ? 14 : 26),
        screenCovertices[0][1] + (frame.horizontal ? 20 : -12),
      ], { anchor: 'start' }),
      labelAt('a', aLabelPoint, { anchor: 'middle' }),
      labelAt('b', bLabelPoint, { anchor: 'start' }),
      labelAt('directrices', frame.horizontal
        ? [directrixEnds[1][0][0] - 8, 34]
        : [34, directrixEnds[1][0][1] - 10], { anchor: frame.horizontal ? 'end' : 'start' }),
      labelAt('latus rectum = 2b²/a', [
        screenFoci[1][0] + (frame.horizontal ? 16 : 18),
        screenFoci[1][1] + (frame.horizontal ? -14 : -8),
      ], { anchor: 'start' }),
    );
  }

  return {
    title: `Ellipse with ${frame.key} major axis`,
    description: `Center (0, 0) with a = ${fmt(model.a)}, b = ${fmt(model.b)} and c = ${fmt(model.c)}. Full axes are 2a and 2b; the semiaxes a and b are their halves.`,
    primitives,
    measurements: [
      measurement('Semimajor axis a', fmt(model.a), 'length', 'Half of the full major axis 2a.'),
      measurement('Semiminor axis b', fmt(model.b), 'length', 'Half of the full minor axis 2b.'),
      measurement('Full major axis', fmt(2 * model.a), 'length', '2a, between the vertices.'),
      measurement('Full minor axis', fmt(2 * model.b), 'length', '2b, between the covertices.'),
      measurement('Center-to-focus distance c', fmt(model.c), 'length', 'c² = a² − b², with 0 < c < a.'),
      measurement('Focal-distance sum PF₁ + PF₂', fmt(2 * model.a), 'length', 'The constant sum 2a for every point on the ellipse.'),
      measurement('Center-to-directrix distance', fmt(model.directrixDistance), 'length', 'a/e = a²/c; each directrix is outside the curve.'),
      measurement('Latus rectum length', fmt(2 * model.latusHalf), 'length', 'Each focal chord is 2b²/a.'),
      measurement('Number of foci', '2', 'count', 'The foci lie inside the ellipse on the major axis.'),
      measurement('Center', '(0, 0)', 'coordinate', 'Intersection of the major and minor axes.'),
    ],
    note: `Eccentricity e = c/a = ${fmt(model.eccentricity)} with 0 < e < 1. Full axes (2a, 2b) and semiaxes (a, b) are different segments; the circle limit a = b has no finite directrices and is not shown.`,
  };
}

/* ------------------------------------------------------------------ *
 * 9. Hyperbolas
 * ------------------------------------------------------------------ */

const hyperbolaPresets = [
  preset('hyp-horizontal', 'Horizontal transverse axis', { orientation: 'horizontal', a: 3, b: 2 }),
  preset('hyp-vertical', 'Vertical transverse axis', { orientation: 'vertical', a: 4, b: 3 }),
];

const hyperbolaParameters = [
  param('orientation', 'Transverse-axis direction', {
    type: 'select',
    default: 'horizontal',
    options: TRANSVERSE_DIRECTIONS,
    unit: '',
  }),
  param('a', 'Center-to-vertex distance a', { min: 2.5, max: 4, step: 0.25, default: 3, unit: 'units' }),
  param('b', 'Conjugate semiaxis b', { min: 1, max: 3.5, step: 0.25, default: 2, unit: 'units' }),
];

const hyperbolaParts = [
  part({
    id: 'branches',
    name: 'Branches',
    geometricType: 'curve',
    definition:
      'The two disconnected parts of a hyperbola. Each branch is a smooth curve through one vertex that approaches both asymptotes.',
    measurementKind: 'none',
    symbol: '',
    wordingExamples: [
      wording('branches', 'canonical term', 'For a nondegenerate hyperbola.'),
      wording('left and right branches', 'equivalent name in this context', 'When the transverse axis is horizontal.'),
      wording('upper and lower branches', 'equivalent name in this context', 'When the transverse axis is vertical.'),
    ],
    distinctionNote:
      'The branches are separate curves. No segment joins them across the center; the transverse-axis guide is a reference segment, not a bridge of the curve.',
    relatedFormulaIds: ['F-H01', 'X-HYP-03', 'F-H03', 'F-H04'],
    lessonIds: ['hyp-01', 'hyp-02', 'hyp-03'],
    searchAliases: ['curve', 'two branches', 'disconnected curves'],
  }),
  part({
    id: 'center',
    name: 'Center',
    geometricType: 'point',
    definition:
      'The midpoint of the foci and of the vertices, where the asymptotes intersect.',
    measurementKind: 'coordinate',
    symbol: 'O(h, k)',
    wordingExamples: [
      wording('center', 'canonical term', 'For every nondegenerate hyperbola.'),
      wording('midpoint of the foci', 'equivalent name in this context', 'When both foci are known.'),
      wording('intersection of the asymptotes', 'problem wording', 'When asymptotes are used to locate it.'),
    ],
    distinctionNote:
      'The center lies between the branches and is not on the curve. It is not a vertex.',
    relatedFormulaIds: ['F-H03', 'F-H04', 'F-H02'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['O', 'centre', 'midpoint of foci'],
  }),
  part({
    id: 'vertices',
    name: 'Vertices',
    geometricType: 'point',
    definition:
      'The two points where the branches meet the transverse axis, each a units from the center.',
    measurementKind: 'coordinate',
    symbol: 'V₁, V₂',
    wordingExamples: [
      wording('vertices', 'canonical term', 'For a nondegenerate hyperbola.'),
      wording('endpoints of the transverse axis', 'equivalent name in this context', 'When the transverse axis is drawn.'),
      wording('(h ± a, k) for a horizontal transverse axis', 'measurement relationship', 'Swap coordinates for a vertical transverse axis.'),
    ],
    distinctionNote:
      'Vertices lie on the curve. Foci lie farther from the center because c² = a² + b², so c > a.',
    relatedFormulaIds: ['F-H03', 'F-H04', 'X-HYP-01'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['V1', 'V2', 'vertex points'],
  }),
  part({
    id: 'foci',
    name: 'Foci',
    geometricType: 'point',
    definition:
      'The two fixed points for which the absolute difference of distances to a point of either branch is 2a.',
    measurementKind: 'coordinate',
    symbol: 'F₁, F₂',
    wordingExamples: [
      wording('foci', 'canonical term', 'For every nondegenerate hyperbola.'),
      wording('fixed points in the locus definition', 'equivalent name in this context', 'When using |PF₁ − PF₂| = 2a.'),
      wording('(h ± c, k) for a horizontal transverse axis', 'measurement relationship', 'Here c² = a² + b².'),
    ],
    distinctionNote:
      'Foci lie outside the vertices along the principal axis. Unlike an ellipse, the hyperbola has no upper bound c < a; here c > a.',
    relatedFormulaIds: ['F-H01', 'F-H02', 'F-H03', 'F-H04'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['F1', 'F2', 'focus points', 'focal points'],
  }),
  part({
    id: 'transverse-axis',
    name: 'Transverse axis',
    geometricType: 'segment',
    definition:
      'The reference segment between the two vertices. It passes through the foci and has length 2a.',
    measurementKind: 'length',
    symbol: '2a',
    wordingExamples: [
      wording('transverse axis', 'canonical term', 'For a nondegenerate hyperbola.'),
      wording('principal-axis segment between vertices', 'equivalent name in this context', 'When distinguishing it from the full principal axis.'),
      wording('length 2a', 'measurement relationship', 'Twice the center-to-vertex distance a.'),
    ],
    distinctionNote:
      'This dashed segment is a guide across the gap between branches. It is not a piece of the curve, even though its endpoints are vertices on the curve.',
    relatedFormulaIds: ['X-HYP-01', 'F-H03', 'F-H04'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['transverse axis length', '2a', 'axis between vertices'],
  }),
  part({
    id: 'conjugate-axis',
    name: 'Conjugate axis',
    geometricType: 'segment',
    definition:
      'The perpendicular reference segment through the center with length 2b. Its endpoints are not on the hyperbola.',
    measurementKind: 'length',
    symbol: '2b',
    wordingExamples: [
      wording('conjugate axis', 'canonical term', 'For a nondegenerate hyperbola.'),
      wording('perpendicular reference axis', 'equivalent name in this context', 'When contrasting with the transverse axis.'),
      wording('length 2b', 'measurement relationship', 'Use b from the negative term of standard form.'),
    ],
    distinctionNote:
      'Unlike an ellipse’s minor axis, the conjugate axis does not cut the curve. Its endpoints are construction points, not vertices or covertices of the hyperbola.',
    relatedFormulaIds: ['X-HYP-01', 'F-H03', 'F-H04'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['conjugate axis length', '2b', 'perpendicular axis'],
  }),
  part({
    id: 'conjugate-axis-endpoints',
    name: 'Conjugate-axis endpoints',
    geometricType: 'point',
    definition:
      'The two ends of the conjugate axis, each b units from the center along the perpendicular direction.',
    measurementKind: 'coordinate',
    symbol: 'B₁, B₂',
    wordingExamples: [
      wording('conjugate-axis endpoints', 'canonical term', 'When plotting the reference rectangle.'),
      wording('(h, k ± b) for a horizontal transverse axis', 'measurement relationship', 'Swap coordinates for a vertical transverse axis.'),
      wording('points off the curve used for the asymptote rectangle', 'problem wording', 'When constructing asymptotes from a rectangle.'),
    ],
    distinctionNote:
      'These points are not on either branch. They are not vertices; they help place the asymptotes.',
    relatedFormulaIds: ['F-H03', 'F-H04', 'X-HYP-01'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['B1', 'B2', 'conjugate endpoints', 'off-curve points'],
  }),
  part({
    id: 'asymptotes',
    name: 'Asymptotes',
    geometricType: 'line',
    definition:
      'Two lines through the center that the branches approach but never intersect.',
    measurementKind: 'none',
    symbol: 'y − k = ±(b/a)(x − h)  or  y − k = ±(a/b)(x − h)',
    wordingExamples: [
      wording('asymptotes', 'canonical term', 'For a nondegenerate axis-parallel hyperbola.'),
      wording('lines through the center along the rectangle diagonals', 'equivalent name in this context', 'When using the reference-rectangle construction.'),
      wording('lines the branches approach', 'problem wording', 'When graphing from standard form.'),
    ],
    distinctionNote:
      'Asymptotes are guides, not tangents and not part of the curve. Their slope depends on the transverse-axis direction.',
    relatedFormulaIds: ['F-H05', 'F-H03', 'F-H04'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['asymptote lines', 'approach lines', 'rectangle diagonals'],
  }),
  part({
    id: 'directrices',
    name: 'Directrices',
    geometricType: 'line',
    definition:
      'Two lines perpendicular to the transverse axis, each at distance a/e = a²/c from the center. Each lies between the center and its nearer vertex.',
    measurementKind: 'coordinate',
    symbol: 'x = h ± a²/c  or  y = k ± a²/c',
    wordingExamples: [
      wording('directrices', 'canonical term', 'For a nondegenerate hyperbola.'),
      wording('lines between center and vertices', 'equivalent name in this context', 'When describing their placement relative to the transverse axis.'),
      wording('each directrix is a/e from the center', 'measurement relationship', 'Equivalent to a²/c because e = c/a > 1.'),
    ],
    distinctionNote:
      'Unlike an ellipse, a hyperbola’s directrices lie inside the gap between center and vertices. They are infinite guide lines, not boundary lines of the branches.',
    relatedFormulaIds: ['X-HYP-02', 'F-H03', 'F-H04', 'F-H02'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['directrix lines', 'a squared over c', 'inner guide lines'],
  }),
  part({
    id: 'latera-recta',
    name: 'Latera recta',
    geometricType: 'segment',
    definition:
      'The two focal chords perpendicular to the transverse axis. Each has midpoint at a focus and length 2b²/a.',
    measurementKind: 'length',
    symbol: '2b²/a',
    wordingExamples: [
      wording('latera recta', 'canonical term', 'For both hyperbola orientations.'),
      wording('focal chords perpendicular to the transverse axis', 'equivalent name in this context', 'When the chords are described by construction.'),
      wording('length 2b²/a', 'measurement relationship', 'Use a and b from standard form.'),
    ],
    distinctionNote:
      'Each full chord is 2b²/a and each half is b²/a. Unlike the ellipse’s focal chord, these chords pass through foci outside the vertices.',
    relatedFormulaIds: ['F-H06', 'F-H03', 'F-H04'],
    lessonIds: ['hyp-01', 'hyp-02'],
    searchAliases: ['latus rectum', 'focal chords', '2b squared over a'],
  }),
];

function hyperbolaModel(params, view) {
  const frame = axisFrame(params.orientation, 'horizontal');
  const a = clampNumber(number(params.a, 3), 2.5, 4);
  const b = clampNumber(number(params.b, 2), 1, 3.5);
  const c = Math.sqrt(a * a + b * b);
  const eccentricity = c / a;
  const directrixDistance = (a * a) / c;
  const latusHalf = (b * b) / a;
  const vertices = [vScale(frame.axis, -a), vScale(frame.axis, a)];
  const conjugateEnds = [vScale(frame.cross, -b), vScale(frame.cross, b)];
  const foci = [vScale(frame.axis, -c), vScale(frame.axis, c)];
  const directrixFeet = [vScale(frame.axis, -directrixDistance), vScale(frame.axis, directrixDistance)];

  /* Leave room past each vertex and conjugate endpoint before zooming; the
   * transverse direction changes with the orientation. */
  const axisRoomPx = frame.horizontal ? WIDTH / 2 - 12 : HEIGHT / 2 - 12;
  const crossRoomPx = frame.horizontal ? HEIGHT / 2 - 12 : WIDTH / 2 - 12;
  const unit = unitFor(view, Math.min(axisRoomPx / (a * 1.12), crossRoomPx / (b * 1.12)));
  const bounds = boundsFor(unit);
  const margin = 12 / unit;
  const axisRoom = (frame.horizontal ? bounds.halfWidth : bounds.halfHeight) - margin;
  const crossRoom = (frame.horizontal ? bounds.halfHeight : bounds.halfWidth) - margin;
  const maxAxis = Math.min(axisRoom, 9);
  const maxTrans = Math.min(crossRoom, 5.6);
  const tMax = Math.max(0, Math.min(acosh(maxAxis / a), asinh(maxTrans / b)));
  const asymptoteDirs = [
    vAdd(vScale(frame.axis, a), vScale(frame.cross, b)),
    vAdd(vScale(frame.axis, a), vScale(frame.cross, -b)),
  ];
  return {
    frame,
    a,
    b,
    c,
    eccentricity,
    directrixDistance,
    latusHalf,
    vertices,
    conjugateEnds,
    foci,
    directrixFeet,
    unit,
    bounds,
    tMax,
    asymptoteDirs,
  };
}

function hyperbolaBranch(model, project, side) {
  const points = [];
  for (let index = 0; index <= 72; index += 1) {
    const t = -model.tMax + (2 * model.tMax * index) / 72;
    const along = side * model.a * Math.cosh(t);
    const across = model.b * Math.sinh(t);
    points.push(project(vAdd(vScale(model.frame.axis, along), vScale(model.frame.cross, across))));
  }
  return pathFrom(points);
}

function buildHyperbola(state) {
  const params = readParams(state, { orientation: 'horizontal', a: 3, b: 2 });
  const model = hyperbolaModel(params, state && state.view);
  const { frame, unit, bounds } = model;
  const project = projector(unit);
  const showLabels = !state || state.showLabels !== false;
  const showGuides = !state || state.showGuides !== false;
  const showHidden = Boolean(state && state.showHidden);

  const screenCentre = project([0, 0]);
  const screenVertices = model.vertices.map(project);
  const screenConjugateEnds = model.conjugateEnds.map(project);
  const screenFoci = model.foci.map(project);
  const directrixEnds = model.directrixFeet.map((foot) =>
    lineEnds(foot, frame.cross, Math.max(bounds.halfWidth, bounds.halfHeight) + 1).map(project),
  );
  const latera = model.foci.map((focus) => [
    project(vAdd(focus, vScale(frame.cross, -model.latusHalf))),
    project(vAdd(focus, vScale(frame.cross, model.latusHalf))),
  ]);
  const asymptoteLines = model.asymptoteDirs.map((direction) => {
    const limit = Math.min(
      bounds.halfWidth / Math.max(Math.abs(direction[0]), 1e-6),
      bounds.halfHeight / Math.max(Math.abs(direction[1]), 1e-6),
    );
    return lineEnds([0, 0], direction, limit).map(project);
  });

  const primitives = [];

  if (showHidden) {
    primitives.push(...referenceAxes(project, bounds));
  }

  primitives.push(
    path('branches', hyperbolaBranch(model, project, 1)),
    path('branches', hyperbolaBranch(model, project, -1)),
  );

  if (showGuides) {
    for (const line of asymptoteLines) primitives.push(dashed('asymptotes', line[0], line[1]));
    for (const line of directrixEnds) primitives.push(dashed('directrices', line[0], line[1]));
    primitives.push(
      rightMark('latera-recta', screenFoci[1], latera[1][0], screenCentre, 12),
    );
  }

  primitives.push(
    dashed('transverse-axis', screenVertices[0], screenVertices[1]),
    dashed('conjugate-axis', screenConjugateEnds[0], screenConjugateEnds[1]),
    pt('center', screenCentre),
    pt('vertices', screenVertices[0]),
    pt('vertices', screenVertices[1]),
    pt('foci', screenFoci[0]),
    pt('foci', screenFoci[1]),
    pt('conjugate-axis-endpoints', screenConjugateEnds[0]),
    pt('conjugate-axis-endpoints', screenConjugateEnds[1]),
    seg('latera-recta', latera[0][0], latera[0][1]),
    seg('latera-recta', latera[1][0], latera[1][1]),
  );
  for (const chord of latera) {
    primitives.push(pt('latera-recta', chord[0]), pt('latera-recta', chord[1]));
  }

  if (showLabels) {
    primitives.push(
      labelAt('O', [screenCentre[0] - 14, screenCentre[1] - 14], { anchor: 'end' }),
      labelAt('V₁', [screenVertices[0][0] - 10, screenVertices[0][1] - 12], { anchor: 'end' }),
      labelAt('V₂', [screenVertices[1][0] + 10, screenVertices[1][1] - 12], { anchor: 'start' }),
      labelAt('F₁', [screenFoci[0][0] - 12, screenFoci[0][1] - 12], { anchor: 'end' }),
      labelAt('F₂', [screenFoci[1][0] + 12, screenFoci[1][1] - 12], { anchor: 'start' }),
      labelAt('B₁', [screenConjugateEnds[0][0] - 12, screenConjugateEnds[0][1] + 4], { anchor: 'end' }),
      labelAt('B₂', [screenConjugateEnds[1][0] + 12, screenConjugateEnds[1][1] - 6], { anchor: 'start' }),
      labelAt('transverse axis = 2a', [
        screenVertices[0][0] + (frame.horizontal ? 12 : 16),
        screenVertices[0][1] + (frame.horizontal ? -16 : 0),
      ], { anchor: 'start' }),
      labelAt('conjugate axis = 2b', [
        screenConjugateEnds[0][0] + (frame.horizontal ? 14 : 24),
        screenConjugateEnds[0][1] + (frame.horizontal ? 20 : -10),
      ], { anchor: 'start' }),
      labelAt('asymptote', [
        asymptoteLines[1][1][0] + 8,
        asymptoteLines[1][1][1] - 8,
      ], { anchor: 'start' }),
      labelAt('directrices', frame.horizontal
        ? [directrixEnds[1][0][0] - 8, 34]
        : [34, directrixEnds[1][0][1] - 10], { anchor: frame.horizontal ? 'end' : 'start' }),
      labelAt('latus rectum = 2b²/a', [
        screenFoci[1][0] + (frame.horizontal ? 16 : 18),
        screenFoci[1][1] + (frame.horizontal ? -14 : -8),
      ], { anchor: 'start' }),
    );
  }

  return {
    title: `Hyperbola with ${frame.key} transverse axis`,
    description: `Center (0, 0) with a = ${fmt(model.a)}, b = ${fmt(model.b)} and c = ${fmt(model.c)}. Two separate branches pass through the vertices; conjugate-axis endpoints lie off the curve.`,
    primitives,
    measurements: [
      measurement('Center-to-vertex distance a', fmt(model.a), 'length', 'Half of the transverse axis 2a.'),
      measurement('Conjugate semiaxis b', fmt(model.b), 'length', 'Half of the conjugate axis 2b; b need not be less than a.'),
      measurement('Full transverse axis', fmt(2 * model.a), 'length', '2a, between the two vertices.'),
      measurement('Full conjugate axis', fmt(2 * model.b), 'length', '2b, a reference segment whose endpoints are off the curve.'),
      measurement('Center-to-focus distance c', fmt(model.c), 'length', 'c² = a² + b², with c > a.'),
      measurement('Absolute focal-distance difference', fmt(2 * model.a), 'length', '|PF₁ − PF₂| = 2a on either branch.'),
      measurement('Center-to-directrix distance', fmt(model.directrixDistance), 'length', 'a/e = a²/c; each directrix lies between center and vertex.'),
      measurement('Latus rectum length', fmt(2 * model.latusHalf), 'length', 'Each focal chord is 2b²/a.'),
      measurement('Number of branches', '2', 'count', 'The branches are disconnected.'),
      measurement('Center', '(0, 0)', 'coordinate', 'Midpoint of the foci and the vertices.'),
    ],
    note: `Eccentricity e = c/a = ${fmt(model.eccentricity)} with e > 1. The transverse and conjugate axes, directrices and asymptotes are guides; conjugate-axis endpoints are not points on the hyperbola.`,
  };
}

export const figures = [
  {
    id: 'parabolas',
    title: 'Parabolas',
    family: FAMILIES.coordinates,
    moduleId: 'parabolas',
    lessonIds: ['para-01', 'para-02', 'para-03'],
    presets: parabolaPresets,
    parameters: parabolaParameters,
    parts: parabolaParts,
    build: buildParabola,
  },
  {
    id: 'ellipses',
    title: 'Ellipses',
    family: FAMILIES.coordinates,
    moduleId: 'ellipses',
    lessonIds: ['elli-01', 'elli-02', 'elli-03'],
    presets: ellipsePresets,
    parameters: ellipseParameters,
    parts: ellipseParts,
    build: buildEllipse,
  },
  {
    id: 'hyperbolas',
    title: 'Hyperbolas',
    family: FAMILIES.coordinates,
    moduleId: 'hyperbolas',
    lessonIds: ['hyp-01', 'hyp-02', 'hyp-03'],
    presets: hyperbolaPresets,
    parameters: hyperbolaParameters,
    parts: hyperbolaParts,
    build: buildHyperbola,
  },
];
