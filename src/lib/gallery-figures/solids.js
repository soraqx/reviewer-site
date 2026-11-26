/* Gallery figure definitions for the six solid-geometry modules.
 *
 * Every builder models geometry in 3D and projects it with project3, so the
 * inspectable primitives and the measurements come from one model state.
 * Wording is classified: a conditional name is never presented as an
 * unconditional synonym of a different segment or region.
 */

import {
  GALLERY_HEIGHT,
  GALLERY_WIDTH,
  polygonCentroid,
  project3,
  regularPolygon,
  sampleCurve,
  viewPreset,
  pathFromPoints,
} from '../gallery-geometry.js';
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
  dimension,
  dashed,
  rightMark,
  fmt,
  param,
  preset,
} from '../gallery-figure-utils.js';

function num(value, fallback) {
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

/* Builders accept a preset ID from the app; direct callers may pass the object. */
function activePreset(state) {
  const value = state?.preset;
  if (value && typeof value === 'object') {
    return { id: value.id ?? '', label: value.label ?? '' };
  }
  const id = typeof value === 'string' ? value : '';
  return { id, label: PRESET_LABELS.get(id) ?? id.replace(/-/g, ' ') };
}

function viewFor(view = {}) {
  const base = viewPreset(view?.name === 'front' || view?.name === 'side' || view?.name === 'top' ? view.name : 'iso');
  const azimuth = Number.isFinite(view?.azimuth) ? view.azimuth : base.azimuth;
  const elevation = Number.isFinite(view?.elevation) ? view.elevation : base.elevation;
  const requested = Number.isFinite(view?.scale) ? view.scale : 1;
  return {
    azimuth,
    elevation,
    scale: requested > 3 ? requested : 20 * requested,
    origin: [GALLERY_WIDTH / 2, GALLERY_HEIGHT / 2 + 34],
  };
}

function screen(point, viewState) {
  return project3(point, viewState);
}

function screenAll(points, viewState) {
  return points.map((point) => screen(point, viewState));
}

function add3(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale3(a, factor) {
  return [a[0] * factor, a[1] * factor, a[2] * factor];
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function length3(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
}

function crossMag3(a, b) {
  return Math.hypot(
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  );
}

function area2D(points) {
  let twice = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    twice += x1 * y2 - x2 * y1;
  }
  return Math.abs(twice) / 2;
}

function area3D(points) {
  let x = 0;
  let y = 0;
  let z = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    x += a[1] * b[2] - a[2] * b[1];
    y += a[2] * b[0] - a[0] * b[2];
    z += a[0] * b[1] - a[1] * b[0];
  }
  return Math.hypot(x, y, z) / 2;
}

function circularWallArea(radius, shift, height, count = 128) {
  const step = (2 * Math.PI) / count;
  let total = 0;
  for (let i = 0; i < count; i += 1) {
    const theta = (i + 0.5) * step;
    const lean = shift[0] * Math.cos(theta) + shift[1] * Math.sin(theta);
    total += Math.sqrt(height * height + lean * lean);
  }
  return radius * step * total;
}

function centreXY3(points, z = 0) {
  const [cx, cy] = polygonCentroid(points.map((point) => [point[0], point[1]]));
  return [cx, cy, z];
}

function regularPoly3(sides, radius) {
  return regularPolygon(sides, radius).map(([x, y]) => [x, y, 0]);
}

function horizontalCircle3(centre, radius, count = 72) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i * 2 * Math.PI) / count;
    return [centre[0] + radius * Math.cos(angle), centre[1] + radius * Math.sin(angle), centre[2]];
  });
}

function horizontalEllipse3(centre, semiA, semiB, count = 72) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i * 2 * Math.PI) / count;
    return [centre[0] + semiA * Math.cos(angle), centre[1] + semiB * Math.sin(angle), centre[2]];
  });
}

function depthOf(point, viewState) {
  return point[0] * Math.sin(viewState.azimuth) + point[1] * Math.cos(viewState.azimuth);
}

function isRearEdge(a, b, reference, viewState) {
  return (depthOf(a, viewState) + depthOf(b, viewState)) / 2 < depthOf(reference, viewState);
}

function addEdge(list, partId, from, to, viewState, hidden, showHidden) {
  if (hidden && !showHidden) return;
  const a = screen(from, viewState);
  const b = screen(to, viewState);
  list.push(hidden ? dashed(partId, a, b, { hidden: true }) : seg(partId, a, b));
}

function addPoint(list, partId, point, viewState, hidden = false, showHidden = true) {
  if (hidden && !showHidden) return;
  list.push(pt(partId, screen(point, viewState), hidden ? { hidden: true } : {}));
}

const LEN = (value) => `${fmt(value)} u`;
const AREA = (value) => `${fmt(value)} u²`;
const VOL = (value) => `${fmt(value)} u³`;

const prismParts = [
  part({
    id: 'base-face',
    name: 'Base face',
    geometricType: 'face',
    definition: 'One of the two congruent polygonal faces in parallel planes. The paired end faces are both selected bases.',
    measurementKind: 'area',
    symbol: 'B',
    wordingExamples: [
      wording('"Triangular end" or "one polygonal end"', 'equivalent name in this context', 'Triangular-prism presets'),
      wording('"Area of the base"', 'measurement relationship', 'B is the area of one base face'),
    ],
    distinctionNote: 'The highlighted region is the face; B is a number measuring its area, not the face itself. A closed prism has two bases.',
    relatedFormulaIds: ['X-PRISM-01', 'F-PR01', 'F-PR03'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['end face', 'polygon base', 'triangular end', 'base area'],
  }),
  part({
    id: 'base-edge',
    name: 'Base edge',
    geometricType: 'segment',
    definition: 'A boundary segment of one selected base; adjacent base edges meet at a base vertex.',
    measurementKind: 'length',
    symbol: 's or b₀',
    wordingExamples: [
      wording('"Side of the triangular end"', 'equivalent name in this context', 'Triangular-prism presets'),
      wording('"Base side"', 'problem wording', 'The prompt must define which end is selected'),
    ],
    distinctionNote: 'One edge length is not the base perimeter, the base area B, or the prism height.',
    relatedFormulaIds: ['F-PR02', 'F-PR05'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['edge of base', 'triangle side', 'base side length'],
  }),
  part({
    id: 'lateral-face',
    name: 'Lateral face',
    geometricType: 'face',
    definition: 'A face joining a pair of corresponding base edges; one lateral face occurs per base edge.',
    measurementKind: 'area',
    symbol: 'A_L (sum)',
    wordingExamples: [
      wording('"Rectangular side panel"', 'equivalent name in this context', 'Right prism only'),
      wording('"Side face"', 'problem wording', 'Specify which panel when summing areas'),
    ],
    distinctionNote: 'A lateral face is a rectangle only in a right prism; in an oblique prism it is generally a parallelogram. A_L = P_b h is a right-prism rule.',
    relatedFormulaIds: ['X-PRISM-01', 'F-PR02', 'F-PR04'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['side face', 'side panel', 'parallelogram face'],
  }),
  part({
    id: 'lateral-edge',
    name: 'Lateral edge',
    geometricType: 'segment',
    definition: 'A segment joining corresponding vertices of the two bases; all lateral edges are parallel and equal.',
    measurementKind: 'length',
    symbol: 'e',
    wordingExamples: [
      wording('"Lateral edge"', 'canonical term', 'Right or oblique prism'),
      wording('"Prism length"', 'problem wording', 'Only when the problem defines that length as the lateral edge'),
      wording('"Equals the perpendicular height here"', 'measurement relationship', 'Right prism only'),
    ],
    distinctionNote: 'Its length equals the perpendicular height in a right prism, but not in an oblique prism. Length and height are not unconditional aliases.',
    relatedFormulaIds: ['F-PR01', 'F-PR04'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['long edge', 'edge connecting bases', 'prism length'],
  }),
  part({
    id: 'altitude',
    name: 'Altitude / perpendicular height',
    geometricType: 'guide',
    definition: 'The perpendicular distance between the two base planes, shown with a right-angle marker; it need not be a physical edge.',
    measurementKind: 'length',
    symbol: 'h',
    wordingExamples: [
      wording('"Height of the prism"', 'equivalent name in this context', 'Perpendicular separation of base planes'),
      wording('"Perpendicular separation of the bases"', 'canonical term', 'Right or oblique prism'),
    ],
    distinctionNote: 'In an oblique prism the altitude is shorter than a lateral edge. It is a guide, not automatically one of the drawn solid edges.',
    relatedFormulaIds: ['F-PR01', 'F-PR02', 'F-PR03'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['height', 'perpendicular height', 'base-plane separation'],
  }),
  part({
    id: 'axis',
    name: 'Axis segment',
    geometricType: 'segment',
    definition: 'The separate segment joining the centroids of the two bases; it is parallel and equal in length to every lateral edge.',
    measurementKind: 'length',
    symbol: 'axis',
    wordingExamples: [
      wording('"Segment joining the base centers"', 'equivalent name in this context', 'Both bases are regular or have defined centroids'),
      wording('"Axis"', 'canonical term', 'Not a lateral edge'),
    ],
    distinctionNote: 'The axis is a distinct internal segment, even when it coincides in direction or length with another segment. It equals h only for a right prism.',
    relatedFormulaIds: ['F-PR01'],
    lessonIds: ['prism-01'],
    searchAliases: ['centre line', 'base centroids', 'axis length'],
  }),
  part({
    id: 'triangle-altitude',
    name: 'Altitude of the triangular end',
    geometricType: 'guide',
    definition: 'A perpendicular segment inside the triangular base from a vertex to the line containing the opposite base edge.',
    measurementKind: 'length',
    symbol: 'h_t',
    wordingExamples: [
      wording('"Height of the triangle"', 'equivalent name in this context', 'Inside the selected triangular end'),
      wording('"Height of the triangular end"', 'problem wording', 'Use with its matched base b₀'),
    ],
    distinctionNote: 'This is the triangle-end height h_t paired with b₀ in F-PR05; it is not the prism length L or the prism height h.',
    relatedFormulaIds: ['F-PR05'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['triangle height', 'end altitude', 'h_t'],
  }),
  part({
    id: 'right-section',
    name: 'Right section',
    geometricType: 'region',
    definition: 'A cross-section made by a plane perpendicular to the lateral-edge direction, cutting across the lateral faces.',
    measurementKind: 'area',
    symbol: 'A_right',
    wordingExamples: [
      wording('"Right section"', 'canonical term', 'Plane perpendicular to lateral edges'),
      wording('"Section perpendicular to the lateral edges"', 'equivalent name in this context', 'Oblique prism'),
    ],
    distinctionNote: 'In an oblique prism this section is not automatically the selected base; in a right prism it is parallel and congruent to the base.',
    relatedFormulaIds: ['F-PR04'],
    lessonIds: ['prism-01', 'prism-02'],
    searchAliases: ['perpendicular cross-section', 'normal section', 'cross section'],
  }),
  part({
    id: 'vertex',
    name: 'Vertex',
    geometricType: 'point',
    definition: 'A corner where three prism edges meet; the highlighted object is the point, not an adjoining edge.',
    measurementKind: 'count',
    symbol: '2n',
    wordingExamples: [
      wording('"Vertex"', 'canonical term', 'A single corner'),
      wording('"Corner"', 'problem wording', 'Descriptive wording'),
    ],
    distinctionNote: 'An n-gonal prism has 2n vertices, n+2 faces, and 3n edges; these are counts, not lengths.',
    relatedFormulaIds: ['X-PRISM-01'],
    lessonIds: ['prism-01'],
    searchAliases: ['corner', 'corner point', 'vertex count'],
  }),
];

export const figures = [
  {
    id: 'prisms',
    title: 'Prisms — right and oblique',
    family: FAMILIES.solids,
    moduleId: 'prisms',
    lessonIds: ['prism-01', 'prism-02', 'prism-03'],
    presets: [
      preset('right-triangular', 'Right triangular prism', { tilt: 0, height: 10, endBase: 12, endAltitude: 9 }),
      preset('oblique-triangular', 'Oblique triangular prism', { tilt: 0.45, height: 10, endBase: 12, endAltitude: 9 }),
      preset('right-pentagonal', 'Right regular pentagonal prism', { tilt: 0, height: 9, sides: 5, baseEdge: 6 }),
      preset('right-hexagonal', 'Right regular hexagonal prism', { tilt: 0, height: 9, sides: 6, baseEdge: 5 }),
      preset('oblique-pentagonal', 'Oblique regular pentagonal prism', { tilt: 0.4, height: 9, sides: 5, baseEdge: 6 }),
    ],
    parameters: [
      param('tilt', 'Oblique offset', { min: 0, max: 0.6, step: 0.05, default: 0.4, note: 'Right presets hold the offset at zero.' }),
      param('height', 'Perpendicular height h', { min: 6, max: 16, step: 0.5, default: 10, unit: 'u' }),
      param('endBase', 'Triangular-end base b₀', { min: 4, max: 16, step: 0.5, default: 12, unit: 'u' }),
      param('endAltitude', 'Triangular-end altitude h_t', { min: 3, max: 12, step: 0.5, default: 9, unit: 'u' }),
      param('sides', 'Regular base side count', { min: 3, max: 10, step: 1, default: 5 }),
      param('baseEdge', 'Regular base edge s', { min: 2, max: 9, step: 0.5, default: 6, unit: 'u' }),
    ],
    parts: prismParts,
    build(state) {
      const { params = {}, view, showLabels, showHidden, showGuides } = state;
      const active = activePreset(state);
      const vs = viewFor(view);
      const isRightPrism = active.id.startsWith('right-');
      const isObliquePrism = !isRightPrism;
      const isTriangularBase = active.id.endsWith('-triangular');
      const h = Math.max(2, num(params.height, 10));
      const tilt = Math.max(0, Math.min(0.6, num(params.tilt, 0.4)));
      const shift = isRightPrism ? [0, 0] : [tilt * 5, tilt * 2];
      const translation = [shift[0], shift[1], h];
      const translationLength = length3([0, 0, 0], translation);

      let base;
      let baseArea;
      let basePerimeter;
      let triangleEnd = null;
      if (isTriangularBase) {
        const b0 = Math.max(2, num(params.endBase, 12));
        const ht = Math.max(2, num(params.endAltitude, 9));
        base = [[0, 0, 0], [b0, 0, 0], [0, ht, 0]];
        baseArea = (b0 * ht) / 2;
        basePerimeter = b0 + ht + Math.hypot(b0, ht);
        triangleEnd = { foot: [0, 0, 0], vertex: [0, ht, 0], b0, ht };
      } else {
        const sides = Math.max(3, Math.min(10, Math.round(num(params.sides, 5))));
        const side = Math.max(1, num(params.baseEdge, 6));
        const radius = side / (2 * Math.sin(Math.PI / sides));
        base = regularPoly3(sides, radius);
        baseArea = area2D(base.map((point) => [point[0], point[1]]));
        basePerimeter = sides * side;
      }

      const top = base.map((point) => add3(point, translation));
      const baseCentre = centreXY3(base, 0);
      const topCentre = add3(baseCentre, translation);
      const lateralAreas = base.map((point, i) => {
        const next = base[(i + 1) % base.length];
        return crossMag3(sub3(next, point), translation);
      });
      const lateralArea = isRightPrism ? basePerimeter * h : lateralAreas.reduce((sum, area) => sum + area, 0);
      const totalArea = lateralArea + 2 * baseArea;
      const volume = baseArea * h;
      const translationSq = dot3(translation, translation);
      const middlePlanePoint = add3(baseCentre, scale3(translation, 0.5));
      const section = base.map((point) => {
        const t = dot3(translation, sub3(middlePlanePoint, point)) / translationSq;
        return add3(point, scale3(translation, Math.max(0.01, Math.min(0.99, t))));
      });
      const sectionPerimeter = section.reduce((sum, point, i) => sum + length3(point, section[(i + 1) % section.length]), 0);
      const sectionArea = area3D(section);

      const primitives = [];
      primitives.push(poly('base-face', screenAll(base, vs), { role: 'face' }));
      primitives.push(poly('base-face', screenAll(top, vs), { role: 'face' }));
      base.forEach((point, i) => {
        const next = base[(i + 1) % base.length];
        const hidden = isRearEdge(point, next, baseCentre, vs);
        const quad = [point, next, top[(i + 1) % top.length], top[i]];
        if (!hidden || showHidden) {
          primitives.push(poly('lateral-face', screenAll(quad, vs), {
            role: 'face',
            ...(hidden ? { hidden: true } : {}),
          }));
        }
        addEdge(primitives, 'base-edge', point, next, vs, hidden, showHidden);
        addEdge(primitives, 'base-edge', top[i], top[(i + 1) % top.length], vs, false, showHidden);
        const lateralHidden = depthOf(point, vs) < depthOf(baseCentre, vs);
        addEdge(primitives, 'lateral-edge', point, top[i], vs, lateralHidden, showHidden);
      });
      base.forEach((point, i) => {
        addPoint(primitives, 'vertex', point, vs, depthOf(point, vs) < depthOf(baseCentre, vs), showHidden);
        addPoint(primitives, 'vertex', top[i], vs, false, showHidden);
      });

      primitives.push(dashed('axis', screen(baseCentre, vs), screen(topCentre, vs)));
      addPoint(primitives, 'axis', baseCentre, vs);
      addPoint(primitives, 'axis', topCentre, vs);

      if (showGuides) {
        const foot = [base[0][0], base[0][1], 0];
        const footTop = [foot[0], foot[1], h];
        primitives.push(dashed('altitude', screen(foot, vs), screen(footTop, vs)));
        primitives.push(rightMark('altitude', screen(footTop, vs), screen(top[1], vs), screen(foot, vs), 12));
        primitives.push(rightMark('altitude', screen(foot, vs), screen(base[1], vs), screen(footTop, vs), 12));

        if (triangleEnd) {
          primitives.push(dashed('triangle-altitude', screen(triangleEnd.vertex, vs), screen(triangleEnd.foot, vs)));
          primitives.push(rightMark('triangle-altitude', screen(triangleEnd.foot, vs), screen(base[1], vs), screen(triangleEnd.vertex, vs), 11));
        }

        primitives.push(poly('right-section', screenAll(section, vs), { role: 'surface' }));
        section.forEach((point, i) => {
          primitives.push(dashed('right-section', screen(point, vs), screen(section[(i + 1) % section.length], vs)));
        });
      }

      if (showLabels) {
        primitives.push(label('base face (B)', screen(add3(baseCentre, [0, 0, 0]), vs)));
        primitives.push(label(isTriangularBase ? 'triangular end' : `${base.length}-gon end`, screen(topCentre, vs)));
        primitives.push(label('lateral edge', screen(add3(base[0], scale3(translation, 0.55)), vs)));
        if (showGuides) {
          primitives.push(label('h ⟂ bases', screen(add3([base[0][0], base[0][1], 0], scale3(translation, 0.45)), vs)));
          primitives.push(label('right section', screen(add3(baseCentre, scale3(translation, 0.5)), vs)));
        }
      }

      const measurements = [
        measurement('Base area B', AREA(baseArea), 'area', 'Area of one selected base face.'),
        measurement('Base perimeter P_b', LEN(basePerimeter), 'length', 'Sum of the base-edge lengths.'),
        measurement('Perpendicular height h', LEN(h), 'length', 'Distance between the base planes; unchanged by tilt.'),
        measurement('Lateral-edge length', LEN(translationLength), 'length', isRightPrism ? 'Equals h in this right prism.' : 'Longer than h in this oblique prism.'),
        measurement('Axis segment length', LEN(translationLength), 'length', 'Centroid-to-centroid segment; parallel and equal to a lateral edge.'),
        measurement('Lateral area A_L', AREA(lateralArea), 'area', isRightPrism ? 'P_b h applies because this prism is right.' : 'Sum of the actual parallelogram face areas; P_b h does not apply.'),
        measurement('Closed total area A_T', AREA(totalArea), 'area', 'A_L plus two base areas.'),
        measurement('Volume V = Bh', VOL(volume), 'volume', 'Constant as tilt changes while B and h are held fixed.'),
        measurement('Faces', String(base.length + 2), 'count', 'n + 2 for an n-gonal prism.'),
        measurement('Edges', String(base.length * 3), 'count', '3n for an n-gonal prism.'),
        measurement('Vertices', String(base.length * 2), 'count', '2n for an n-gonal prism.'),
      ];
      if (triangleEnd) {
        measurements.push(measurement('Triangular-end altitude h_t', LEN(triangleEnd.ht), 'length', 'Paired with b₀ inside the triangular end; distinct from prism length L.'));
      }
      if (showGuides) {
        measurements.push(measurement('Right-section area A_right', AREA(sectionArea), 'area', isRightPrism ? 'Parallel and congruent to a base in this right prism.' : 'Perpendicular to the lateral edges; not the selected base area B.'));
        measurements.push(measurement('Right-section perimeter', LEN(sectionPerimeter), 'length', 'Perpendicular to lateral edges; not the selected base in an oblique prism.'));
      }

      return {
        title: `${active.label} — selected bases, edges, altitude and right section`,
        description: isRightPrism
          ? 'Right prism: lateral edges are perpendicular to the selected bases, so lateral-edge length equals the perpendicular height h. The right section is parallel and congruent to a base.'
          : 'Oblique prism: the top base is translated sideways. Its lateral edges are longer than the perpendicular height h, and the right section is a distinct cross-section, not the selected base.',
        primitives,
        measurements,
        note: isRightPrism
          ? 'Altitude, axis and a lateral edge have equal lengths here, but remain different geometric segments. A_L = P_b h is valid only in this right mode.'
          : 'Base area B and perpendicular height h are unchanged from the right preset, so V = Bh is unchanged. Do not use P_b h for lateral area; sum the parallelogram face areas.',
      };
    },
  },
  {
    id: 'parallelepipeds-cubes',
    title: 'Parallelepipeds and cubes',
    family: FAMILIES.solids,
    moduleId: 'parallelepipeds-cubes',
    lessonIds: ['box-01', 'box-02', 'box-03'],
    presets: [
      preset('cube', 'Cube', { edge: 6 }),
      preset('cuboid', 'Rectangular cuboid', { length: 8, width: 5, height: 4 }),
      preset('oblique', 'Oblique parallelepiped', { length: 8, width: 5, height: 6, tilt: 0.45 }),
    ],
    parameters: [
      param('edge', 'Cube edge q', { min: 2, max: 10, step: 0.5, default: 6, unit: 'u' }),
      param('length', 'Edge L', { min: 2, max: 12, step: 0.5, default: 8, unit: 'u' }),
      param('width', 'Edge W', { min: 2, max: 10, step: 0.5, default: 5, unit: 'u' }),
      param('height', 'Perpendicular height H', { min: 2, max: 12, step: 0.5, default: 4, unit: 'u' }),
      param('tilt', 'Oblique shear', { min: 0, max: 0.7, step: 0.05, default: 0.45 }),
    ],
    parts: [
      part({
        id: 'face',
        name: 'Face',
        geometricType: 'face',
        definition: 'One of the six parallelogram faces; opposite faces are congruent and parallel.',
        measurementKind: 'area',
        symbol: 'A_face',
        wordingExamples: [wording('"One face" or "a side"', 'problem wording', 'Name the face by its edge pair when needed')],
        distinctionNote: 'A face is a 2D region; its area is in square units. A cube has six congruent square faces, a cuboid rectangular faces, an oblique box parallelogram faces.',
        relatedFormulaIds: ['F-BX02'],
        lessonIds: ['box-01', 'box-02'],
        searchAliases: ['side face', 'panel', 'parallelogram face'],
      }),
      part({
        id: 'edge',
        name: 'Edge',
        geometricType: 'segment',
        definition: 'A segment where two faces meet; three mutually perpendicular edges define a cuboid or cube.',
        measurementKind: 'length',
        symbol: 'q or L, W, H',
        wordingExamples: [
          wording('"Length", "width" or "height"', 'problem wording', 'Names depend on the chosen orientation and labels'),
          wording('"Cube edge"', 'equivalent name in this context', 'All edges equal q'),
        ],
        distinctionNote: 'The longest drawn edge is not automatically called length; the problem assigns the names. Perspective length is not the true length.',
        relatedFormulaIds: ['F-BX01', 'F-BX02'],
        lessonIds: ['box-01'],
        searchAliases: ['side length', 'cube edge', 'box dimension'],
      }),
      part({
        id: 'vertex',
        name: 'Vertex',
        geometricType: 'point',
        definition: 'A corner where three edges and three faces meet.',
        measurementKind: 'count',
        symbol: '8',
        wordingExamples: [wording('"Corner"', 'problem wording', 'A single point')],
        distinctionNote: 'A vertex is a point; the highlight is not the whole adjoining edge.',
        relatedFormulaIds: ['X-BOX-01'],
        lessonIds: ['box-01'],
        searchAliases: ['corner', 'corner point'],
      }),
      part({
        id: 'selected-base',
        name: 'Selected base',
        geometricType: 'face',
        definition: 'One member of the congruent parallel face pair used as the base for V = Bh.',
        measurementKind: 'area',
        symbol: 'B',
        wordingExamples: [
          wording('"Base area"', 'measurement relationship', 'B is the area of the selected base face'),
          wording('"Bottom face"', 'problem wording', 'Only if the problem selects the bottom face'),
        ],
        distinctionNote: 'B is one base face area, not total surface area. Any congruent parallel pair may be selected.',
        relatedFormulaIds: ['F-BX01', 'X-BOX-01'],
        lessonIds: ['box-01', 'box-02'],
        searchAliases: ['base face', 'base area', 'base pair'],
      }),
      part({
        id: 'face-diagonal',
        name: 'Face diagonal',
        geometricType: 'segment',
        definition: 'A segment joining opposite vertices of one face and lying wholly inside that face.',
        measurementKind: 'length',
        symbol: 'd_f',
        wordingExamples: [
          wording('"Diagonal of a face"', 'canonical term', 'The segment must stay in one face'),
          wording('"Diagonal of the L by W face"', 'problem wording', 'Specifies which face is used'),
        ],
        distinctionNote: 'A face diagonal is not a space diagonal. For a cube it is q√2; for an L×W face it is √(L²+W²).',
        relatedFormulaIds: ['F-BX03'],
        lessonIds: ['box-01'],
        searchAliases: ['diagonal in a face', 'square diagonal', 'face diagonal length'],
      }),
      part({
        id: 'space-diagonal',
        name: 'Space diagonal',
        geometricType: 'segment',
        definition: 'A segment joining opposite vertices through the interior of the solid.',
        measurementKind: 'length',
        symbol: 'd_s',
        wordingExamples: [
          wording('"Diagonal of the cube"', 'problem wording', 'This pack takes an unqualified cube diagonal as the space diagonal'),
          wording('"Body diagonal"', 'equivalent name in this context', 'Opposite vertices through the interior'),
        ],
        distinctionNote: 'Cube d_s = q√3 and cuboid d_s = √(L²+W²+H²). In an oblique parallelepiped the space diagonals need not have equal lengths; do not reuse the cuboid formula.',
        relatedFormulaIds: ['F-BX04', 'X-BOX-01'],
        lessonIds: ['box-01', 'box-02'],
        searchAliases: ['body diagonal', 'interior diagonal', 'opposite vertices'],
      }),
      part({
        id: 'perpendicular-height',
        name: 'Perpendicular height',
        geometricType: 'guide',
        definition: 'The perpendicular separation of the selected base planes, shown with a right-angle marker.',
        measurementKind: 'length',
        symbol: 'h',
        wordingExamples: [wording('"Height of the parallelepiped"', 'equivalent name in this context', 'Perpendicular to the selected base')],
        distinctionNote: 'In an oblique parallelepiped the slanting edges are longer than this perpendicular height; V = Bh still uses h.',
        relatedFormulaIds: ['X-BOX-01'],
        lessonIds: ['box-02'],
        searchAliases: ['height', 'perpendicular separation', 'base-plane distance'],
      }),
    ],
    build(state) {
      const { params = {}, view, showLabels, showHidden, showGuides } = state;
      const active = activePreset(state);
      const vs = viewFor(view);
      const isCube = active.id === 'cube';
      const isObliqueBox = active.id === 'oblique';
      const q = Math.max(1, num(params.edge, 6));
      const L = isCube ? q : Math.max(1, num(params.length, 8));
      const W = isCube ? q : Math.max(1, num(params.width, 5));
      const H = isCube ? q : Math.max(1, num(params.height, 4));
      const tilt = Math.max(0, Math.min(0.7, num(params.tilt, 0.45)));
      const translation = isObliqueBox ? [tilt * L * 0.45, tilt * W * 0.2, H] : [0, 0, H];
      const base = [[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0]];
      const top = base.map((point) => add3(point, translation));
      const baseCentre = [L / 2, W / 2, 0];
      const baseArea = L * W;
      const volume = baseArea * H;
      const facePairs = [
        crossMag3(sub3(base[1], base[0]), sub3(base[3], base[0])),
        crossMag3(sub3(base[1], base[0]), translation),
        crossMag3(sub3(base[2], base[1]), translation),
      ];
      const totalArea = 2 * facePairs.reduce((sum, area) => sum + area, 0);
      const faceDiagonal = length3(base[0], base[2]);
      const sideFaceDiagonal = length3(base[0], top[1]);
      const spaceDiagonals = [
        length3(base[0], top[2]),
        length3(base[1], top[3]),
      ];
      const slantEdge = length3(base[0], top[0]);

      const primitives = [];
      const faces = [
        { ids: [0, 1, 2, 3], hidden: true },
        { ids: [0, 1, 5, 4], hidden: false },
        { ids: [1, 2, 6, 5], hidden: true },
        { ids: [2, 3, 7, 6], hidden: false },
        { ids: [3, 0, 4, 7], hidden: true },
        { ids: [4, 5, 6, 7], hidden: false },
      ];
      const vertices = [...base, ...top];
      faces.forEach((face, index) => {
        const points = face.ids.map((i) => vertices[i]);
        const isSelectedBase = index === 0 || index === 5;
        const hidden = face.hidden && !isSelectedBase;
        if (hidden && !showHidden) return;
        primitives.push(poly(isSelectedBase ? 'selected-base' : 'face', screenAll(points, vs), {
          role: 'face',
          ...(hidden ? { hidden: true } : {}),
        }));
      });
      base.forEach((point, i) => {
        const next = base[(i + 1) % base.length];
        const hidden = isRearEdge(point, next, baseCentre, vs);
        addEdge(primitives, 'edge', point, next, vs, hidden, showHidden);
        addEdge(primitives, 'edge', top[i], top[(i + 1) % top.length], vs, false, showHidden);
        addEdge(primitives, 'edge', point, top[i], vs, depthOf(point, vs) < depthOf(baseCentre, vs), showHidden);
      });
      vertices.forEach((point, i) => {
        addPoint(primitives, 'vertex', point, vs, i < 4 && depthOf(point, vs) < depthOf(baseCentre, vs), showHidden);
      });
      addEdge(primitives, 'face-diagonal', base[0], base[2], vs, false, showHidden);
      addEdge(primitives, 'face-diagonal', base[0], top[1], vs, false, showHidden);
      spaceDiagonals.forEach((_, i) => {
        const from = base[i];
        const to = top[(i + 2) % 4];
        primitives.push(dashed('space-diagonal', screen(from, vs), screen(to, vs)));
      });

      if (showGuides) {
        const topOfHeight = [0, 0, H];
        primitives.push(dashed('perpendicular-height', screen(base[0], vs), screen(topOfHeight, vs)));
        primitives.push(rightMark('perpendicular-height', screen(base[0], vs), screen(base[1], vs), screen(topOfHeight, vs), 12));
        primitives.push(rightMark('perpendicular-height', screen(topOfHeight, vs), screen(top[1], vs), screen(base[0], vs), 12));
      }
      if (showLabels) {
        primitives.push(label(isCube ? 'q' : `L = ${fmt(L)}`, screen([L / 2, 0, 0], vs)));
        primitives.push(label(isCube ? 'q' : `W = ${fmt(W)}`, screen([L, W / 2, 0], vs)));
        primitives.push(label('selected base B', screen([L * 0.35, W * 0.45, 0], vs)));
        if (showGuides) primitives.push(label('h ⟂ base', screen([0, 0, H / 2], vs)));
      }

      const measurements = [
        measurement(isCube ? 'Cube edge q' : 'Edges L, W, H', isCube ? LEN(q) : `${LEN(L)}, ${LEN(W)}, ${LEN(H)}`, 'length', isCube ? 'All edges equal.' : 'Names follow the chosen problem labels.'),
        measurement('Selected base area B', AREA(baseArea), 'area', isCube ? 'One square face.' : 'One L by W face.'),
        measurement('Perpendicular height H', LEN(H), 'length', 'Separation of the selected base planes.'),
        measurement('Lateral slant edge', LEN(slantEdge), 'length', isObliqueBox ? 'Longer than H; perpendicular height must still be used for volume.' : 'Equals H in this right box.'),
        measurement('L×W face diagonal', LEN(faceDiagonal), 'length', 'Stays in one face; not a space diagonal.'),
        measurement('Additional face diagonal', LEN(sideFaceDiagonal), 'length', 'A second face diagonal may differ from the base-face diagonal.'),
        measurement('Space diagonal 1', LEN(spaceDiagonals[0]), 'length', 'Opposite vertices through the solid.'),
        measurement('Space diagonal 2', LEN(spaceDiagonals[1]), 'length', isObliqueBox ? 'Differs from the other space diagonal in an oblique parallelepiped.' : 'Matches the other space diagonal for a cuboid.'),
        measurement('Total surface area', AREA(totalArea), 'area', 'Sum of all six parallelogram face areas.'),
        measurement('Volume V = Bh', VOL(volume), 'volume', 'B is base area, not total surface area.'),
        measurement('Vertices', '8', 'count', 'Three faces and three edges meet at each vertex.'),
      ];
      return {
        title: `${active.label} — faces, diagonals and perpendicular height`,
        description: isCube
          ? 'A cube has six congruent square faces. q√2 is a face diagonal; q√3 is a space diagonal through the interior.'
          : isObliqueBox
            ? 'The top face is sheared. Perpendicular height H is smaller than the slanting edges, and the two space diagonals need not match.'
            : 'A cuboid has rectangular faces. The face diagonal and the space diagonal are different segments with different formulas.',
        primitives,
        measurements,
        note: isObliqueBox
          ? 'V = Bh uses base area and perpendicular height. The general face-area sum is required; right-prism shortcuts do not apply.'
          : 'A square is 2D and a cube is 3D. Do not attach the space-diagonal formula to a face diagonal.',
      };
    },
  },
  {
    id: 'cylinders',
    title: 'Cylinders — circular, hollow, oblique and elliptic',
    family: FAMILIES.solids,
    moduleId: 'cylinders',
    lessonIds: ['cyl-01', 'cyl-02', 'cyl-03'],
    presets: [
      preset('right-circular', 'Right circular cylinder', { radius: 4, height: 10 }),
      preset('oblique-circular', 'Oblique circular cylinder', { radius: 4, height: 10, tilt: 0.5 }),
      preset('hollow-circular', 'Hollow circular pipe', { radius: 3, outerRadius: 4.5, height: 12 }),
      preset('right-elliptic', 'Right elliptic cylinder', { semiA: 6, semiB: 3.5, height: 9 }),
    ],
    parameters: [
      param('radius', 'Radius r / inner radius', { min: 1, max: 8, step: 0.25, default: 4, unit: 'u' }),
      param('outerRadius', 'Outer radius R', { min: 2, max: 10, step: 0.25, default: 4.5, unit: 'u' }),
      param('height', 'Perpendicular height h', { min: 3, max: 16, step: 0.5, default: 10, unit: 'u' }),
      param('tilt', 'Oblique shift', { min: 0, max: 0.7, step: 0.05, default: 0.5 }),
      param('semiA', 'Ellipse semiaxis a', { min: 2, max: 9, step: 0.25, default: 6, unit: 'u' }),
      param('semiB', 'Ellipse semiaxis b', { min: 1.5, max: 8, step: 0.25, default: 3.5, unit: 'u' }),
    ],
    parts: [
      part({
        id: 'base-disk',
        name: 'Base disk',
        geometricType: 'surface',
        definition: 'The filled circular or elliptic end bounded by the rim; its area is the base area B.',
        measurementKind: 'area',
        symbol: 'B',
        wordingExamples: [wording('"Area of the base"', 'measurement relationship', 'B is area, not the boundary circle')],
        distinctionNote: 'A disk is a region; a rim is its 1D boundary. For a hollow cylinder the ends are annuli, not full disks.',
        relatedFormulaIds: ['X-CYL-01', 'F-CY01', 'F-CY06'],
        lessonIds: ['cyl-01', 'cyl-03'],
        searchAliases: ['circular base', 'end disk', 'base area'],
      }),
      part({
        id: 'rim',
        name: 'Rim',
        geometricType: 'curve',
        definition: 'The boundary circle of a circular base, or the ellipse bounding an elliptic base.',
        measurementKind: 'length',
        symbol: 'C or C_e',
        wordingExamples: [wording('"Circumference"', 'equivalent name in this context', 'Circular rim only')],
        distinctionNote: 'The rim is a curve with length; the disk it bounds has area. An ellipse perimeter is not π(a+b).',
        relatedFormulaIds: ['X-CYL-01', 'F-CY02', 'F-CY07'],
        lessonIds: ['cyl-01', 'cyl-03'],
        searchAliases: ['circle boundary', 'circumference', 'ellipse perimeter'],
      }),
      part({
        id: 'radius',
        name: 'Radius',
        geometricType: 'segment',
        definition: 'A segment from the base centre to its rim; half the full diameter.',
        measurementKind: 'length',
        symbol: 'r',
        wordingExamples: [wording('"Base radius"', 'canonical term', 'Circular cylinder')],
        distinctionNote: 'd = 2r. Substituting a full diameter for r changes the area by a factor of four.',
        relatedFormulaIds: ['X-CYL-01', 'F-CY01'],
        lessonIds: ['cyl-01'],
        searchAliases: ['r', 'half diameter', 'base radius'],
      }),
      part({
        id: 'diameter',
        name: 'Diameter',
        geometricType: 'segment',
        definition: 'A segment through the base centre with both endpoints on the rim; twice the radius.',
        measurementKind: 'length',
        symbol: 'd',
        wordingExamples: [wording('"Full width across the circle"', 'problem wording', 'Must pass through the centre')],
        distinctionNote: 'A diameter is a full chord through the centre; the radius is half of it.',
        relatedFormulaIds: ['X-CYL-01', 'F-CY01'],
        lessonIds: ['cyl-01'],
        searchAliases: ['d', 'full diameter', 'width of base'],
      }),
      part({
        id: 'axis',
        name: 'Axis',
        geometricType: 'segment',
        definition: 'The segment joining the centres of the two bases.',
        measurementKind: 'length',
        symbol: 'axis',
        wordingExamples: [wording('"Line joining the base centers"', 'equivalent name in this context', 'Both base centres are defined')],
        distinctionNote: 'It equals h in a right cylinder but is inclined and longer in an oblique cylinder.',
        relatedFormulaIds: ['F-CY01'],
        lessonIds: ['cyl-01'],
        searchAliases: ['centre line', 'axis length', 'base centres'],
      }),
      part({
        id: 'altitude',
        name: 'Altitude / perpendicular height',
        geometricType: 'guide',
        definition: 'The perpendicular distance between the base planes, shown with a right-angle marker.',
        measurementKind: 'length',
        symbol: 'h',
        wordingExamples: [wording('"Height" or "pipe length"', 'problem wording', 'Only when the length is the perpendicular separation')],
        distinctionNote: 'In an oblique cylinder the axis and generators are longer than this height; capacity still uses h.',
        relatedFormulaIds: ['F-CY01', 'F-CY03'],
        lessonIds: ['cyl-01', 'cyl-02'],
        searchAliases: ['height', 'perpendicular height', 'base-plane distance'],
      }),
      part({
        id: 'curved-wall',
        name: 'Curved wall',
        geometricType: 'surface',
        definition: 'The curved lateral surface generated by segments parallel to the axis.',
        measurementKind: 'area',
        symbol: 'A_L',
        wordingExamples: [wording('"Lateral surface"', 'canonical term', 'Right circular cylinder for 2πrh')],
        distinctionNote: 'For a right circular cylinder A_L = 2πrh; an oblique cylinder generally does not follow that product rule.',
        relatedFormulaIds: ['F-CY02', 'F-CY07'],
        lessonIds: ['cyl-01', 'cyl-03'],
        searchAliases: ['lateral surface', 'side wall', 'curved surface area'],
      }),
      part({
        id: 'inner-radius',
        name: 'Inner radius',
        geometricType: 'segment',
        definition: 'Radius of the hollow bore; the radius used for interior capacity.',
        measurementKind: 'length',
        symbol: 'r',
        wordingExamples: [wording('"Bore radius"', 'equivalent name in this context', 'Hollow pipe only')],
        distinctionNote: 'Capacity uses r, not R. The material occupies the region between r and R.',
        relatedFormulaIds: ['F-CY03', 'X-CYL-02'],
        lessonIds: ['cyl-02'],
        searchAliases: ['bore radius', 'interior radius', 'inside radius'],
      }),
      part({
        id: 'outer-radius',
        name: 'Outer radius',
        geometricType: 'segment',
        definition: 'Radius of the outside wall of a hollow pipe.',
        measurementKind: 'length',
        symbol: 'R',
        wordingExamples: [wording('"Outside radius"', 'equivalent name in this context', 'Hollow pipe only')],
        distinctionNote: 'R > r. Outer volume minus bore volume gives material volume π(R²−r²)h.',
        relatedFormulaIds: ['F-CY03', 'F-CY04'],
        lessonIds: ['cyl-02'],
        searchAliases: ['outside radius', 'external radius', 'R'],
      }),
      part({
        id: 'annular-end',
        name: 'Annular end',
        geometricType: 'surface',
        definition: 'A flat ring-shaped end face of a hollow pipe, bounded by two concentric circles.',
        measurementKind: 'area',
        symbol: 'π(R²−r²)',
        wordingExamples: [wording('"Ring end"', 'problem wording', 'Two annular ends in a closed pipe')],
        distinctionNote: 'An annular end is not a full disk across the opening; adding full disks would wrongly close the bore.',
        relatedFormulaIds: ['F-CY05'],
        lessonIds: ['cyl-02'],
        searchAliases: ['ring end', 'annulus', 'pipe end face'],
      }),
      part({
        id: 'inner-wall',
        name: 'Inner wall',
        geometricType: 'surface',
        definition: 'Curved surface of the bore, distinct from the outer curved surface.',
        measurementKind: 'area',
        symbol: '2πrh',
        wordingExamples: [wording('"Inside surface"', 'problem wording', 'Hollow pipe only')],
        distinctionNote: 'Combined curved area is 2πRh + 2πrh. Capacity is not a surface area.',
        relatedFormulaIds: ['F-CY04', 'F-CY05'],
        lessonIds: ['cyl-02'],
        searchAliases: ['bore wall', 'inside curved area', 'inner surface'],
      }),
      part({
        id: 'bore',
        name: 'Interior capacity (bore)',
        geometricType: 'region',
        definition: 'The empty cylindrical region inside a hollow pipe.',
        measurementKind: 'volume',
        symbol: 'V_capacity',
        wordingExamples: [wording('"Capacity"', 'problem wording', 'Use inner radius r and height h')],
        distinctionNote: 'Capacity πr²h and material volume π(R²−r²)h are different quantities.',
        relatedFormulaIds: ['X-CYL-02', 'F-CY03'],
        lessonIds: ['cyl-02'],
        searchAliases: ['capacity', 'interior volume', 'hollow volume'],
      }),
      part({
        id: 'major-axis',
        name: 'Full major axis',
        geometricType: 'segment',
        definition: 'The full ellipse axis through the centre along the semimajor direction.',
        measurementKind: 'length',
        symbol: '2a',
        wordingExamples: [wording('"Major axis 20 cm"', 'problem wording', 'A full axis length must be halved before using πab')],
        distinctionNote: '2a is twice the semiaxis a; do not substitute the full axis into base-area formulas.',
        relatedFormulaIds: ['F-CY06'],
        lessonIds: ['cyl-03'],
        searchAliases: ['2a', 'full longer axis', 'major diameter'],
      }),
      part({
        id: 'minor-axis',
        name: 'Full minor axis',
        geometricType: 'segment',
        definition: 'The full ellipse axis through the centre along the semiminor direction.',
        measurementKind: 'length',
        symbol: '2b',
        wordingExamples: [wording('"Minor axis 15 cm"', 'problem wording', 'A full axis length must be halved')],
        distinctionNote: '2b is twice the semiaxis b; the two full axes are not the semiaxes used in πab.',
        relatedFormulaIds: ['F-CY06'],
        lessonIds: ['cyl-03'],
        searchAliases: ['2b', 'full shorter axis', 'minor diameter'],
      }),
      part({
        id: 'semimajor-axis',
        name: 'Semimajor axis',
        geometricType: 'segment',
        definition: 'Centre-to-vertex segment along the longer ellipse axis.',
        measurementKind: 'length',
        symbol: 'a',
        wordingExamples: [wording('"Semiaxis a"', 'canonical term', 'Elliptic cylinder')],
        distinctionNote: 'a is half of the full major axis and is the value used in πab.',
        relatedFormulaIds: ['F-CY06', 'F-CY07'],
        lessonIds: ['cyl-03'],
        searchAliases: ['a', 'semimajor', 'half major axis'],
      }),
      part({
        id: 'semiminor-axis',
        name: 'Semiminor axis',
        geometricType: 'segment',
        definition: 'Centre-to-covertex segment along the shorter ellipse axis.',
        measurementKind: 'length',
        symbol: 'b',
        wordingExamples: [wording('"Semiaxis b"', 'canonical term', 'Elliptic cylinder')],
        distinctionNote: 'b is half of the full minor axis and is the value used in πab.',
        relatedFormulaIds: ['F-CY06', 'F-CY07'],
        lessonIds: ['cyl-03'],
        searchAliases: ['b', 'semiminor', 'half minor axis'],
      }),
    ],
    build(state) {
      const { params = {}, view, showLabels, showHidden, showGuides } = state;
      const active = activePreset(state);
      const vs = viewFor(view);
      const isHollow = active.id === 'hollow-circular';
      const isObliqueCylinder = active.id === 'oblique-circular';
      const isElliptic = active.id === 'right-elliptic';
      const isRightCircular = !isHollow && !isObliqueCylinder && !isElliptic;
      const r = Math.max(0.5, num(params.radius, 4));
      const R = Math.max(r + 0.5, num(params.outerRadius, r + 1));
      const h = Math.max(1, num(params.height, 10));
      const tilt = Math.max(0, Math.min(0.7, num(params.tilt, 0.5)));
      const rawA = Math.max(1, num(params.semiA, 6));
      const rawB = Math.max(1, num(params.semiB, 3.5));
      const a = Math.max(rawA, rawB);
      const b = Math.min(rawA, rawB);
      const shift = isObliqueCylinder ? [tilt * h * 0.35, tilt * h * 0.12] : [0, 0];
      const bottomCentre = [0, 0, 0];
      const topCentre = [shift[0], shift[1], h];
      const axisLength = length3(bottomCentre, topCentre);
      const primitives = [];

      let bottomRim;
      let topRim;
      let baseArea;
      let circumference;
      if (isElliptic) {
        bottomRim = horizontalEllipse3(bottomCentre, a, b);
        topRim = horizontalEllipse3(topCentre, a, b);
        baseArea = Math.PI * a * b;
        circumference = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
      } else {
        bottomRim = horizontalCircle3(bottomCentre, isHollow ? R : r);
        topRim = horizontalCircle3(topCentre, isHollow ? R : r);
        baseArea = isHollow ? Math.PI * (R * R - r * r) : Math.PI * r * r;
        circumference = 2 * Math.PI * (isHollow ? R : r);
      }

      if (isHollow) {
        const innerBottom = horizontalCircle3(bottomCentre, r);
        const innerTop = horizontalCircle3(topCentre, r);
        const annulusPath = (outer, inner) => `${pathFromPoints(screenAll(outer, vs), { close: true })} ${pathFromPoints(screenAll([...inner].reverse(), vs), { close: true })}`;
        primitives.push(path('annular-end', annulusPath(bottomRim, innerBottom), { role: 'surface' }));
        primitives.push(path('annular-end', annulusPath(topRim, innerTop), { role: 'surface' }));
        primitives.push(path('rim', pathFromPoints(screenAll(bottomRim, vs), { close: true })));
        primitives.push(path('rim', pathFromPoints(screenAll(topRim, vs), { close: true })));
        primitives.push(path('rim', pathFromPoints(screenAll(innerBottom, vs), { close: true })));
        primitives.push(path('curved-wall', pathFromPoints(screenAll([...bottomRim, ...[...topRim].reverse()], vs), { close: true }), { role: 'surface' }));
        primitives.push(path('inner-wall', pathFromPoints(screenAll([...innerBottom, ...[...innerTop].reverse()], vs), { close: true }), { role: 'surface' }));
        primitives.push(seg('outer-radius', screen(bottomCentre, vs), screen(bottomRim[0], vs)));
        primitives.push(seg('inner-radius', screen(bottomCentre, vs), screen(innerBottom[Math.floor(innerBottom.length / 4)], vs)));
        primitives.push(seg('diameter', screen(bottomRim[0], vs), screen(bottomRim[Math.floor(bottomRim.length / 2)], vs)));
      } else {
        primitives.push(path('base-disk', pathFromPoints(screenAll(bottomRim, vs), { close: true }), { role: 'surface' }));
        primitives.push(path('base-disk', pathFromPoints(screenAll(topRim, vs), { close: true }), { role: 'surface' }));
        primitives.push(path('rim', pathFromPoints(screenAll(bottomRim, vs), { close: true })));
        primitives.push(path('rim', pathFromPoints(screenAll(topRim, vs), { close: true })));
        primitives.push(path('curved-wall', pathFromPoints(screenAll([...bottomRim, ...[...topRim].reverse()], vs), { close: true }), { role: 'surface' }));
        primitives.push(seg('radius', screen(bottomCentre, vs), screen(bottomRim[0], vs)));
        primitives.push(seg('diameter', screen(bottomRim[0], vs), screen(bottomRim[Math.floor(bottomRim.length / 2)], vs)));
      }

      primitives.push(dashed('axis', screen(bottomCentre, vs), screen(topCentre, vs)));
      if (showGuides) {
        const heightTop = [0, 0, h];
        primitives.push(dashed('altitude', screen(bottomCentre, vs), screen(heightTop, vs)));
        primitives.push(rightMark('altitude', screen(bottomCentre, vs), screen(isElliptic ? [a, 0, 0] : [isHollow ? R : r, 0, 0], vs), screen(heightTop, vs), 12));
      }
      if (isElliptic) {
        primitives.push(seg('major-axis', screen([-a, 0, 0], vs), screen([a, 0, 0], vs)));
        primitives.push(seg('minor-axis', screen([0, -b, 0], vs), screen([0, b, 0], vs)));
        primitives.push(seg('semimajor-axis', screen(bottomCentre, vs), screen([a, 0, 0], vs)));
        primitives.push(seg('semiminor-axis', screen(bottomCentre, vs), screen([0, b, 0], vs)));
      }
      if (showLabels) {
        primitives.push(label(isHollow ? 'annular end' : 'base disk', screen(bottomCentre, vs)));
        primitives.push(label('rim', screen(bottomRim[Math.floor(bottomRim.length / 8)], vs)));
        primitives.push(label('axis', screen([shift[0] / 2, shift[1] / 2, h / 2], vs)));
        if (showGuides) primitives.push(label('h ⟂ bases', screen([0, 0, h / 2], vs)));
        if (isElliptic) {
          primitives.push(label(`2a = ${fmt(2 * a)} u`, screen([0, 0, 0], vs)));
          primitives.push(label(`a = ${fmt(a)} u`, screen([a / 2, 0.4, 0], vs)));
        }
      }

      const volume = baseArea * h;
      const materialVolume = Math.PI * (R * R - r * r) * h;
      const capacity = Math.PI * r * r * h;
      const curvedWallArea = isElliptic
        ? circumference * h
        : isObliqueCylinder
          ? circularWallArea(r, shift, h)
          : 2 * Math.PI * (isHollow ? R : r) * h;
      const innerWallArea = 2 * Math.PI * r * h;
      const allPipeArea = 2 * Math.PI * (R + r) * h + 2 * Math.PI * (R * R - r * r);
      const lateralArea = isElliptic ? circumference * h : curvedWallArea;
      const measurements = [
        measurement(isHollow ? 'Annular base area' : 'Base area B', AREA(baseArea), 'area', isHollow ? 'π(R²−r²), not a full disk.' : isElliptic ? 'πab uses semiaxes.' : 'πr² for a circular disk.'),
        measurement('Rim length', LEN(circumference), 'length', isElliptic ? 'Ellipse perimeter is approximate here; it is not π(a+b).' : 'd = 2r gives circumference πd.'),
        measurement('Perpendicular height h', LEN(h), 'length', 'Separation of the base planes.'),
        measurement('Axis length', LEN(axisLength), 'length', isObliqueCylinder ? 'Longer than h in this oblique cylinder.' : 'Equals h in this right cylinder.'),
        measurement('Curved wall area', AREA(curvedWallArea), 'area', isRightCircular || isHollow ? '2πrh or 2πRh for the right circular wall.' : isElliptic ? 'C_e h with approximate C_e.' : 'Integrated from the inclined generators; 2πrh does not apply.'),
        measurement('Enclosed volume / capacity', VOL(isHollow ? capacity : volume), 'volume', isHollow ? 'Uses inner radius r; material volume is separate.' : 'Bh for a right cylinder.'),
        measurement('Closed total area', AREA(isHollow ? allPipeArea : lateralArea + 2 * baseArea), 'area', isHollow ? 'Both annular ends plus both curved walls; no bore-closing disks.' : 'Curved wall plus two ends.'),
      ];
      if (isHollow) {
        measurements.push(measurement('Material volume', VOL(materialVolume), 'volume', 'π(R²−r²)h, distinct from capacity.'));
        measurements.push(measurement('Outer radius R', LEN(R), 'length', 'Radius of the outside wall.'));
        measurements.push(measurement('Inner radius r', LEN(r), 'length', 'Radius of the bore.'));
        measurements.push(measurement('Inner curved wall area', AREA(innerWallArea), 'area', '2πrh; measured as an area.'));
      }
      if (isElliptic) {
        measurements.push(measurement('Full axes', `${LEN(2 * a)}, ${LEN(2 * b)}`, 'length', 'Halve each full axis before using πab.'));
        measurements.push(measurement('Semiaxes a, b', `${LEN(a)}, ${LEN(b)}`, 'length', 'Used directly in base area πab.'));
      }
      return {
        title: `${active.label} — disks, rims, axis, altitude and walls`,
        description: isHollow
          ? 'A hollow pipe has an outer curved wall, an inner curved wall and two annular ends. Capacity and material volume are different.'
          : isElliptic
            ? 'Full ellipse axes are twice the semiaxes a and b; the elliptic perimeter shown is an approximation, not π(a+b).'
            : isObliqueCylinder
              ? 'The axis is inclined; perpendicular height h is shorter and still controls capacity.'
              : 'A right circular cylinder has d = 2r, axis equal to h, and lateral area 2πrh.',
        primitives,
        measurements,
        note: isHollow ? 'Do not add full disks across the bore when counting pipe surfaces.' : 'Distinguish a filled disk from the curve bounding it.',
      };
    },
  },
  {
    id: 'pyramids',
    title: 'Regular pyramids — square and pentagonal',
    family: FAMILIES.solids,
    moduleId: 'pyramids',
    lessonIds: ['pyr-01', 'pyr-02', 'pyr-03'],
    presets: [
      preset('regular-square', 'Regular square pyramid', { side: 6, height: 4 }),
      preset('regular-pentagonal', 'Regular pentagonal pyramid', { side: 10, height: 9.83053 }),
    ],
    parameters: [
      param('side', 'Regular base edge s', { min: 2, max: 12, step: 0.5, default: 6, unit: 'u' }),
      param('height', 'Altitude h', { min: 2, max: 14, step: 0.5, default: 4, unit: 'u' }),
    ],
    parts: [
      part({
        id: 'apex',
        name: 'Apex',
        geometricType: 'point',
        definition: 'The single vertex where all lateral faces meet; for a regular pyramid it lies above the base centre.',
        measurementKind: 'count',
        symbol: 'A',
        wordingExamples: [wording('"Top vertex"', 'problem wording', 'Only for the upright orientation')],
        distinctionNote: 'The apex is a point; the highlight is not the altitude or a lateral edge ending there.',
        relatedFormulaIds: ['F-PY01'],
        lessonIds: ['pyr-01'],
        searchAliases: ['top point', 'tip', 'apex vertex'],
      }),
      part({
        id: 'base-face',
        name: 'Base face',
        geometricType: 'face',
        definition: 'The regular polygonal face opposite the apex; its area is B.',
        measurementKind: 'area',
        symbol: 'B',
        wordingExamples: [wording('"Square base" or "pentagonal base"', 'equivalent name in this context', 'Set by the preset')],
        distinctionNote: 'The face is a region; B is its area. A pyramid has one base, unlike a prism.',
        relatedFormulaIds: ['F-PY02', 'F-PY03'],
        lessonIds: ['pyr-01', 'pyr-02'],
        searchAliases: ['base polygon', 'base region', 'base area'],
      }),
      part({
        id: 'base-edge',
        name: 'Base edge',
        geometricType: 'segment',
        definition: 'A side of the regular polygonal base; every lateral face has one base edge.',
        measurementKind: 'length',
        symbol: 's',
        wordingExamples: [wording('"Base side"', 'equivalent name in this context', 'Regular base')],
        distinctionNote: 'Half of this edge, s/2, is used in a half-lateral-face triangle; the whole edge is not.',
        relatedFormulaIds: ['F-PY01', 'F-PY03'],
        lessonIds: ['pyr-01', 'pyr-02'],
        searchAliases: ['base side', 's', 'side of base'],
      }),
      part({
        id: 'lateral-face',
        name: 'Lateral face',
        geometricType: 'face',
        definition: 'A triangular face joining the apex to one base edge.',
        measurementKind: 'area',
        symbol: 'A_face',
        wordingExamples: [wording('"Triangular side face"', 'equivalent name in this context', 'Regular pyramid')],
        distinctionNote: 'Regular-pyramid lateral areas may be combined with ½P_bℓ; a nonregular pyramid needs individual face areas.',
        relatedFormulaIds: ['F-PY03'],
        lessonIds: ['pyr-01', 'pyr-02'],
        searchAliases: ['side triangle', 'triangular face', 'lateral triangle'],
      }),
      part({
        id: 'lateral-edge',
        name: 'Lateral edge',
        geometricType: 'segment',
        definition: 'A segment from the apex to a base vertex.',
        measurementKind: 'length',
        symbol: 'E',
        wordingExamples: [wording('"Edge from apex to corner"', 'problem wording', 'A base vertex, not an edge midpoint')],
        distinctionNote: 'E is not the slant height: E ends at a vertex, while ℓ ends at an edge midpoint.',
        relatedFormulaIds: ['F-PY01'],
        lessonIds: ['pyr-01'],
        searchAliases: ['apex edge', 'E', 'corner edge'],
      }),
      part({
        id: 'altitude',
        name: 'Altitude',
        geometricType: 'guide',
        definition: 'The perpendicular segment from the apex to the base plane; here it ends at the base centre.',
        measurementKind: 'length',
        symbol: 'h',
        wordingExamples: [wording('"Vertical height"', 'problem wording', 'Only for the upright regular pyramid')],
        distinctionNote: 'Altitude h, slant height ℓ, and lateral edge E form three different right-triangle sections.',
        relatedFormulaIds: ['F-PY01', 'F-PY02'],
        lessonIds: ['pyr-01', 'pyr-02'],
        searchAliases: ['height', 'perpendicular height', 'apex height'],
      }),
      part({
        id: 'face-slant-height',
        name: 'Face slant height',
        geometricType: 'segment',
        definition: 'Segment from the apex to the midpoint of a base edge, lying in a lateral face.',
        measurementKind: 'length',
        symbol: 'ℓ',
        wordingExamples: [wording('"Slant height of a face"', 'canonical term', 'Regular pyramid with common ℓ')],
        distinctionNote: 'ℓ is the hypotenuse of the h-by-r_a triangle and a leg of the ℓ-by-(s/2) triangle; it is not E.',
        relatedFormulaIds: ['F-PY01', 'F-PY03'],
        lessonIds: ['pyr-01', 'pyr-02'],
        searchAliases: ['slant height', 'face altitude', 'ℓ'],
      }),
      part({
        id: 'apothem',
        name: 'Base apothem',
        geometricType: 'segment',
        definition: 'Segment from the base centre perpendicular to the midpoint of a base edge.',
        measurementKind: 'length',
        symbol: 'r_a',
        wordingExamples: [wording('"Apothem of the base"', 'canonical term', 'Regular polygon base')],
        distinctionNote: 'r_a is not the circumradius and not the full base edge; with h it gives ℓ.',
        relatedFormulaIds: ['F-PY01'],
        lessonIds: ['pyr-01'],
        searchAliases: ['base apothem', 'inradius', 'r_a'],
      }),
      part({
        id: 'circumradius',
        name: 'Base circumradius',
        geometricType: 'segment',
        definition: 'Segment from the base centre to a base vertex.',
        measurementKind: 'length',
        symbol: 'R_b',
        wordingExamples: [wording('"Radius of the base polygon"', 'problem wording', 'Regular polygon base')],
        distinctionNote: 'R_b is longer than r_a; with h it gives the lateral edge E.',
        relatedFormulaIds: ['F-PY01'],
        lessonIds: ['pyr-01'],
        searchAliases: ['base radius', 'centre to vertex', 'R_b'],
      }),
    ],
    build(state) {
      const { params = {}, view, showLabels, showHidden, showGuides } = state;
      const active = activePreset(state);
      const vs = viewFor(view);
      const sides = active.id === 'regular-pentagonal' ? 5 : 4;
      const s = Math.max(1, num(params.side, sides === 5 ? 10 : 6));
      const h = Math.max(1, num(params.height, 4));
      const radius = s / (2 * Math.sin(Math.PI / sides));
      const apothem = s / (2 * Math.tan(Math.PI / sides));
      const slant = Math.hypot(h, apothem);
      const lateralEdge = Math.hypot(h, radius);
      const baseArea = (sides * s * apothem) / 2;
      const perimeter = sides * s;
      const base = regularPoly3(sides, radius);
      const centre = [0, 0, 0];
      const apex = [0, 0, h];
      const volume = baseArea * h / 3;
      const lateralArea = perimeter * slant / 2;
      const primitives = [];

      primitives.push(poly('base-face', screenAll(base, vs), { role: 'face' }));
      base.forEach((point, i) => {
        const next = base[(i + 1) % sides];
        const hidden = isRearEdge(point, next, centre, vs);
        if (!hidden || showHidden) {
          primitives.push(poly('lateral-face', screenAll([point, next, apex], vs), {
            role: 'face',
            ...(hidden ? { hidden: true } : {}),
          }));
        }
        addEdge(primitives, 'base-edge', point, next, vs, hidden, showHidden);
        addEdge(primitives, 'lateral-edge', point, apex, vs, depthOf(point, vs) < 0, showHidden);
        const midpoint3 = scale3(add3(point, next), 0.5);
        primitives.push(seg('face-slant-height', screen(midpoint3, vs), screen(apex, vs)));
      });
      addPoint(primitives, 'apex', apex, vs);

      if (showGuides) {
        base.forEach((point, i) => {
          const midpoint3 = scale3(add3(point, base[(i + 1) % sides]), 0.5);
          primitives.push(dashed('apothem', screen(centre, vs), screen(midpoint3, vs)));
          primitives.push(dashed('circumradius', screen(centre, vs), screen(point, vs)));
        });
        primitives.push(dashed('altitude', screen(centre, vs), screen(apex, vs)));
        primitives.push(rightMark('altitude', screen(centre, vs), screen(apex, vs), screen(scale3(add3(base[0], base[1]), 0.5), vs), 12));
        primitives.push(rightMark('altitude', screen(centre, vs), screen(apex, vs), screen(base[0], vs), 12));
        const firstMidpoint = scale3(add3(base[0], base[1]), 0.5);
        primitives.push(rightMark('face-slant-height', screen(firstMidpoint, vs), screen(apex, vs), screen(base[0], vs), 11));
        primitives.push(rightMark('apothem', screen(firstMidpoint, vs), screen(centre, vs), screen(base[0], vs), 10));
      }
      if (showLabels) {
        primitives.push(label('apex', screen(apex, vs)));
        primitives.push(label('base face B', screen(centre, vs)));
        primitives.push(label(`ℓ = ${fmt(slant)} u`, screen(scale3(add3(base[0], base[1]), 0.55), vs)));
        if (showGuides) {
          primitives.push(label('h', screen([0, 0, h / 2], vs)));
          primitives.push(label('r_a', screen(scale3(add3(base[0], base[1]), 0.28), vs)));
          primitives.push(label('R_b', screen(scale3(base[0], 0.62), vs)));
        }
      }

      const measurements = [
        measurement('Base edge s', LEN(s), 'length', 'Regular base edge.'),
        measurement('Base area B', AREA(baseArea), 'area', `${sides}-gon base area.`),
        measurement('Base perimeter P_b', LEN(perimeter), 'length', 'Used with ℓ for regular lateral area.'),
        measurement('Altitude h', LEN(h), 'length', 'Perpendicular apex-to-base-plane segment.'),
        measurement('Face slant height ℓ', LEN(slant), 'length', 'Apex to edge midpoint; ℓ² = h² + r_a².'),
        measurement('Lateral edge E', LEN(lateralEdge), 'length', 'Apex to base vertex; E² = h² + R_b².'),
        measurement('Base apothem r_a', LEN(apothem), 'length', 'Centre to edge midpoint.'),
        measurement('Base circumradius R_b', LEN(radius), 'length', 'Centre to base vertex.'),
        measurement('Lateral area A_L', AREA(lateralArea), 'area', '½P_bℓ for a regular pyramid.'),
        measurement('Total area A_T', AREA(lateralArea + baseArea), 'area', 'A_L plus the one base.'),
        measurement('Volume V', VOL(volume), 'volume', '⅓Bh for any pyramid.'),
      ];
      return {
        title: `${active.label} — the three right-triangle sections`,
        description: 'The apex stays above the base centre. The altitude/apothem triangle, the half-lateral-face triangle and the altitude/circumradius triangle give three different right-angle relations.',
        primitives,
        measurements,
        note: 'Slant height, lateral edge, altitude, apothem and circumradius are five distinct segments; only their right-triangle relations connect them.',
      };
    },
  },
  {
    id: 'cones',
    title: 'Cones — right cone, axial section and cube inscription',
    family: FAMILIES.solids,
    moduleId: 'cones',
    lessonIds: ['cone-01', 'cone-02', 'cone-03'],
    presets: [
      preset('right-cone', 'Right circular cone', { radius: 6, height: 8 }),
      preset('axial-section', 'Right cone with axial section', { radius: 6, height: 8 }),
      preset('cube-inscribed', 'Cone inscribed in a cube', { cubeEdge: 6 }),
    ],
    parameters: [
      param('radius', 'Base radius r', { min: 2, max: 9, step: 0.5, default: 6, unit: 'u' }),
      param('height', 'Perpendicular height h', { min: 3, max: 14, step: 0.5, default: 8, unit: 'u' }),
      param('cubeEdge', 'Cube edge q', { min: 3, max: 12, step: 0.5, default: 6, unit: 'u' }),
    ],
    parts: [
      part({
        id: 'apex',
        name: 'Apex',
        geometricType: 'point',
        definition: 'The cone vertex; for a right circular cone it lies directly above the base centre.',
        measurementKind: 'count',
        symbol: 'A',
        wordingExamples: [wording('"Tip of the cone"', 'problem wording', 'Descriptive wording')],
        distinctionNote: 'The apex is a point; the slant height ends there but is not the apex.',
        relatedFormulaIds: ['F-CO01'],
        lessonIds: ['cone-01'],
        searchAliases: ['tip', 'vertex', 'cone point'],
      }),
      part({
        id: 'base-disk',
        name: 'Base disk',
        geometricType: 'surface',
        definition: 'The circular end of the cone; its area is πr² and it is included in closed total area.',
        measurementKind: 'area',
        symbol: 'πr²',
        wordingExamples: [wording('"Circular base"', 'canonical term', 'Right circular cone')],
        distinctionNote: 'A cone has one base disk. An open conical cover or shell may exclude it; check the prompt.',
        relatedFormulaIds: ['F-CO02'],
        lessonIds: ['cone-01'],
        searchAliases: ['circular base', 'base area', 'disk'],
      }),
      part({
        id: 'rim',
        name: 'Rim',
        geometricType: 'curve',
        definition: 'The circle bounding the base disk; its length is the base circumference 2πr.',
        measurementKind: 'length',
        symbol: '2πr',
        wordingExamples: [wording('"Base circumference"', 'equivalent name in this context', 'Circular base')],
        distinctionNote: 'The net sector arc equals this circumference; the rim is not the sector radius ℓ.',
        relatedFormulaIds: ['X-CONE-01'],
        lessonIds: ['cone-01'],
        searchAliases: ['base circle', 'circumference', 'boundary circle'],
      }),
      part({
        id: 'radius',
        name: 'Radius',
        geometricType: 'segment',
        definition: 'A segment from the base centre to the rim.',
        measurementKind: 'length',
        symbol: 'r',
        wordingExamples: [wording('"Base radius"', 'canonical term', 'Right circular cone')],
        distinctionNote: 'Radius r is the leg of the axial right triangle, not the slant-height hypotenuse.',
        relatedFormulaIds: ['F-CO01', 'F-CO02'],
        lessonIds: ['cone-01'],
        searchAliases: ['r', 'base radius', 'half diameter'],
      }),
      part({
        id: 'diameter',
        name: 'Diameter',
        geometricType: 'segment',
        definition: 'A full segment through the base centre with endpoints on the rim.',
        measurementKind: 'length',
        symbol: 'd = 2r',
        wordingExamples: [wording('"Width of the base"', 'problem wording', 'Must pass through the centre')],
        distinctionNote: 'd is twice r; substituting d for r in cone formulas is a common error.',
        relatedFormulaIds: ['F-CO02'],
        lessonIds: ['cone-01'],
        searchAliases: ['d', 'full width', 'base diameter'],
      }),
      part({
        id: 'altitude',
        name: 'Altitude / perpendicular height',
        geometricType: 'guide',
        definition: 'The perpendicular segment from the apex to the base plane.',
        measurementKind: 'length',
        symbol: 'h',
        wordingExamples: [wording('"Height of the cone"', 'equivalent name in this context', 'Right cone')],
        distinctionNote: 'h is perpendicular; ℓ is measured along the lateral surface. They coincide only in a degenerate cone.',
        relatedFormulaIds: ['F-CO01', 'F-CO02'],
        lessonIds: ['cone-01'],
        searchAliases: ['height', 'perpendicular height', 'vertical height'],
      }),
      part({
        id: 'axis',
        name: 'Axis',
        geometricType: 'segment',
        definition: 'The segment joining the apex to the base centre.',
        measurementKind: 'length',
        symbol: 'h',
        wordingExamples: [wording('"Apex-to-centre segment"', 'equivalent name in this context', 'Right cone')],
        distinctionNote: 'In the right cone the axis is the altitude; here that equality is conditional on the cone being right.',
        relatedFormulaIds: ['F-CO01'],
        lessonIds: ['cone-01'],
        searchAliases: ['axis length', 'centre line', 'apex to centre'],
      }),
      part({
        id: 'slant-height',
        name: 'Slant height',
        geometricType: 'segment',
        definition: 'A segment from the apex to a point on the rim, lying on the curved lateral surface.',
        measurementKind: 'length',
        symbol: 'ℓ',
        wordingExamples: [wording('"Slant height"', 'canonical term', 'Right circular cone')],
        distinctionNote: 'ℓ² = r² + h² for a right cone; ℓ is the radius of the unfolded sector, not the base radius.',
        relatedFormulaIds: ['F-CO01', 'F-CO02', 'X-CONE-02'],
        lessonIds: ['cone-01', 'cone-03'],
        searchAliases: ['slant', 'side length', 'ℓ'],
      }),
      part({
        id: 'curved-surface',
        name: 'Curved lateral surface',
        geometricType: 'surface',
        definition: 'The curved surface from the rim to the apex; it unfolds to a circular sector of radius ℓ.',
        measurementKind: 'area',
        symbol: 'A_L',
        wordingExamples: [wording('"Lateral surface"', 'canonical term', 'Closed total area adds the base disk')],
        distinctionNote: 'A_L = πrℓ. A conical cover explicitly excludes the disk; a closed cone includes it.',
        relatedFormulaIds: ['F-CO02', 'X-CONE-01'],
        lessonIds: ['cone-01'],
        searchAliases: ['lateral surface', 'sector surface', 'curved area'],
      }),
      part({
        id: 'inscribing-cube',
        name: 'Inscribing cube',
        geometricType: 'surface',
        definition: 'The cube used in the specified preset: the base circle is inscribed in one face and the apex is at the centre of the opposite face.',
        measurementKind: 'length',
        symbol: 'q',
        wordingExamples: [wording('"Cube of edge q"', 'problem wording', 'Cube-inscribed preset only')],
        distinctionNote: 'This placement gives h = q and r = q/2; r and h are derived, not independently draggable.',
        relatedFormulaIds: ['X-CONE-02'],
        lessonIds: ['cone-03'],
        searchAliases: ['cube', 'inscribed cone', 'cube edge q'],
      }),
    ],
    build(state) {
      const { params = {}, view, showLabels, showHidden, showGuides } = state;
      const active = activePreset(state);
      const vs = viewFor(view);
      const isCubeInscribed = active.id === 'cube-inscribed';
      const isAxialSection = active.id === 'axial-section';
      const q = Math.max(1, num(params.cubeEdge, 6));
      const r = isCubeInscribed ? q / 2 : Math.max(0.5, num(params.radius, 6));
      const h = isCubeInscribed ? q : Math.max(1, num(params.height, 8));
      const slant = Math.hypot(r, h);
      const apex = [0, 0, h];
      const centre = [0, 0, 0];
      const rim = horizontalCircle3(centre, r);
      const volume = Math.PI * r * r * h / 3;
      const lateralArea = Math.PI * r * slant;
      const totalArea = lateralArea + Math.PI * r * r;
      const primitives = [];

      if (isCubeInscribed) {
        const half = q / 2;
        const cube = [
          [-half, -half, 0], [half, -half, 0], [half, half, 0], [-half, half, 0],
          [-half, -half, q], [half, -half, q], [half, half, q], [-half, half, q],
        ];
        [
          [0, 1, 2, 3], [0, 1, 5, 4], [1, 2, 6, 5],
          [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 6, 7],
        ].forEach((ids, index) => {
          if (index > 1 && !showHidden) return;
          primitives.push(poly('inscribing-cube', screenAll(ids.map((i) => cube[i]), vs), {
            role: 'surface',
            ...(index > 1 ? { hidden: true } : {}),
          }));
        });
        cube.forEach((point, i) => {
          const next = [1, 2, 3, 0, 5, 6, 7, 4][i];
          addEdge(primitives, 'inscribing-cube', point, cube[next], vs, i < 4, showHidden);
        });
      }

      primitives.push(path('base-disk', pathFromPoints(screenAll(rim, vs), { close: true }), { role: 'surface' }));
      primitives.push(path('rim', pathFromPoints(screenAll(rim, vs), { close: true })));
      primitives.push(path('curved-surface', pathFromPoints(screenAll([...rim, apex], vs), { close: true }), { role: 'surface' }));
      primitives.push(seg('radius', screen(centre, vs), screen(rim[0], vs)));
      primitives.push(seg('diameter', screen(rim[0], vs), screen(rim[Math.floor(rim.length / 2)], vs)));
      primitives.push(seg('slant-height', screen(rim[0], vs), screen(apex, vs)));
      addPoint(primitives, 'apex', apex, vs);

      if (showGuides) {
        primitives.push(dimension('altitude', screen(centre, vs), screen(apex, vs)));
        primitives.push(dashed('axis', screen(centre, vs), screen(apex, vs)));
        primitives.push(rightMark('altitude', screen(centre, vs), screen(rim[0], vs), screen(apex, vs), 12));
      }
      if (isAxialSection && showGuides) {
        const opposite = rim[Math.floor(rim.length / 2)];
        primitives.push(dashed('slant-height', screen(opposite, vs), screen(apex, vs)));
        primitives.push(seg('diameter', screen(opposite, vs), screen(rim[0], vs)));
      }
      if (showLabels) {
        primitives.push(label('apex', screen(apex, vs)));
        primitives.push(label('base disk', screen(centre, vs)));
        primitives.push(label(`ℓ = ${fmt(slant)} u`, screen(scale3(add3(rim[0], apex), 0.5), vs)));
        if (showGuides) primitives.push(label('h', screen([0, 0, h / 2], vs)));
        if (isCubeInscribed) primitives.push(label('cube edge q', screen([q / 2, -q / 2, q], vs)));
      }

      const measurements = [
        measurement('Base radius r', LEN(r), 'length', isCubeInscribed ? 'Derived as q/2 from the cube inscription.' : 'Base radius.'),
        measurement('Base diameter 2r', LEN(2 * r), 'length', 'Twice the base radius.'),
        measurement('Perpendicular height h', LEN(h), 'length', isCubeInscribed ? 'Derived as q; axis equals altitude in this right cone.' : 'Apex above the base centre.'),
        measurement('Slant height ℓ', LEN(slant), 'length', isCubeInscribed ? 'q√5/2 for this cube placement.' : 'ℓ² = r² + h².'),
        measurement('Base circumference', LEN(2 * Math.PI * r), 'length', 'Sector arc length in the net.'),
        measurement('Curved lateral area', AREA(lateralArea), 'area', 'A_L = πrℓ.'),
        measurement('Base disk area', AREA(Math.PI * r * r), 'area', 'Included only when the cone is closed.'),
        measurement('Closed total area', AREA(totalArea), 'area', 'πr(ℓ + r).'),
        measurement('Volume V', VOL(volume), 'volume', '⅓πr²h.'),
      ];
      if (isCubeInscribed) {
        measurements.push(measurement('Cube edge q', LEN(q), 'length', 'Base circle inscribed in one face; apex at centre of opposite face.'));
      }
      return {
        title: `${active.label} — radius, height, slant height and surfaces`,
        description: isCubeInscribed
          ? 'Defined placement: the base circle is inscribed in one cube face, and the apex is at the centre of the opposite face. Then h = q, r = q/2 and ℓ = q√5/2.'
          : isAxialSection
            ? 'The axial section is the right triangle formed by r, h and ℓ through the cone axis; the dashed guides show that section.'
            : 'A right circular cone has apex above the base centre. The curved surface, its rim and the base disk are different inspectable objects.',
        primitives,
        measurements,
        note: isCubeInscribed ? 'The cone dimensions are derived from q; moving them independently would break the inscription.' : 'Check whether the problem includes the base disk before using closed total area.',
      };
    },
  },
  {
    id: 'spheres-segments',
    title: 'Spheres, shells and spherical segments',
    family: FAMILIES.solids,
    moduleId: 'spheres-segments',
    lessonIds: ['sph-01', 'sph-02', 'sph-03'],
    presets: [
      preset('sphere', 'Sphere', { radius: 5 }),
      preset('hemisphere', 'Hemisphere', { radius: 5 }),
      preset('shell', 'Hemispherical shell', { radius: 9, innerRadius: 6 }),
      preset('one-base-cap', 'One-base spherical cap', { radius: 6, cutZ1: 2 }),
      preset('two-base-segment', 'Two-base spherical segment', { radius: 6, cutZ1: -1, cutZ2: 2 }),
      preset('bowl', 'Partially filled hemispherical bowl', { radius: 5, liquidDepth: 2 }),
    ],
    parameters: [
      param('radius', 'Sphere radius R', { min: 2, max: 10, step: 0.5, default: 5, unit: 'u' }),
      param('innerRadius', 'Shell inner radius R_i', { min: 1, max: 8, step: 0.5, default: 6, unit: 'u' }),
      param('cutZ1', 'Lower cutting plane z₁', { min: -9, max: 9, step: 0.25, default: 1, unit: 'u' }),
      param('cutZ2', 'Upper cutting plane z₂', { min: -9, max: 9, step: 0.25, default: 3, unit: 'u' }),
      param('liquidDepth', 'Liquid depth h', { min: 0, max: 10, step: 0.25, default: 2, unit: 'u' }),
    ],
    parts: [
      part({
        id: 'center',
        name: 'Center',
        geometricType: 'point',
        definition: 'The point equidistant from every point of the sphere surface.',
        measurementKind: 'count',
        symbol: 'O',
        wordingExamples: [wording('"Centre of the sphere"', 'canonical term', 'All presets')],
        distinctionNote: 'The centre is a point; the sphere radius is a segment from it to the surface.',
        relatedFormulaIds: ['F-SP01', 'F-SP02'],
        lessonIds: ['sph-01'],
        searchAliases: ['centre', 'origin', 'O'],
      }),
      part({
        id: 'sphere-radius',
        name: 'Sphere radius',
        geometricType: 'segment',
        definition: 'A segment from the centre to a point on the sphere surface.',
        measurementKind: 'length',
        symbol: 'R',
        wordingExamples: [wording('"Radius of the sphere"', 'canonical term', 'Same sphere for every cut')],
        distinctionNote: 'A cut-circle radius is smaller for a noncentral plane; all cut radii here derive from this R and the plane position.',
        relatedFormulaIds: ['F-SP01', 'F-SP02', 'F-SP08'],
        lessonIds: ['sph-01', 'sph-02'],
        searchAliases: ['R', 'sphere radius', 'centre to surface'],
      }),
      part({
        id: 'great-circle',
        name: 'Great circle',
        geometricType: 'curve',
        definition: 'The circle formed where a plane through the centre cuts the sphere; its radius is R.',
        measurementKind: 'length',
        symbol: '2πR',
        wordingExamples: [wording('"Equator"', 'equivalent name in this context', 'Horizontal central plane')],
        distinctionNote: 'A great circle passes through the centre; a small circle does not.',
        relatedFormulaIds: ['F-SP01'],
        lessonIds: ['sph-01'],
        searchAliases: ['central circle', 'equator', 'great circle circumference'],
      }),
      part({
        id: 'small-circle',
        name: 'Small circle',
        geometricType: 'curve',
        definition: 'A circle formed by a cutting plane that does not pass through the centre.',
        measurementKind: 'length',
        symbol: '2πr',
        wordingExamples: [wording('"Cut circle"', 'problem wording', 'Plane offset from centre')],
        distinctionNote: 'Its radius is √(R²−z²), not an independently chosen value.',
        relatedFormulaIds: ['F-SP08'],
        lessonIds: ['sph-01', 'sph-02'],
        searchAliases: ['cut circle', 'off-centre circle', 'small circle circumference'],
      }),
      part({
        id: 'cut-circle-radius',
        name: 'Cut-circle radius',
        geometricType: 'segment',
        definition: 'Radius of a circle formed by a cutting plane at signed height z on the same sphere.',
        measurementKind: 'length',
        symbol: 'r or r₁, r₂',
        wordingExamples: [wording('"Radius of the cut"', 'problem wording', 'Derived from the cutting-plane position')],
        distinctionNote: 'Use r² = 2Rh − h² for a cap, or r_i = √(R²−z_i²) for each cut of a two-base segment.',
        relatedFormulaIds: ['F-SP08', 'F-SP11', 'F-SP12'],
        lessonIds: ['sph-02'],
        searchAliases: ['cut radius', 'r', 'plane-section radius'],
      }),
      part({
        id: 'segment-height',
        name: 'Segment height',
        geometricType: 'guide',
        definition: 'Perpendicular separation of the cutting planes (or of a plane and the cap top).',
        measurementKind: 'length',
        symbol: 'h',
        wordingExamples: [wording('"Height of the zone"', 'equivalent name in this context', 'Perpendicular separation, not arc length')],
        distinctionNote: 'This straight height controls both curved zone area and segment volume; it is not a surface arc.',
        relatedFormulaIds: ['F-SP07', 'F-SP09', 'F-SP11'],
        lessonIds: ['sph-02'],
        searchAliases: ['zone height', 'cap height', 'plane separation'],
      }),
      part({
        id: 'curved-zone',
        name: 'Curved zone',
        geometricType: 'surface',
        definition: 'The curved spherical surface between two parallel cutting planes; a cap zone has one base.',
        measurementKind: 'area',
        symbol: 'A_zone',
        wordingExamples: [wording('"Zone"', 'canonical term', 'Curved surface only')],
        distinctionNote: 'A_zone = 2πRh is an area. The solid segment between the planes has a volume and flat cut disks in its boundary.',
        relatedFormulaIds: ['F-SP07', 'F-SP10', 'F-SP12'],
        lessonIds: ['sph-02'],
        searchAliases: ['spherical zone', 'curved band', 'zone area'],
      }),
      part({
        id: 'cut-disk',
        name: 'Cut disk (or annular rim)',
        geometricType: 'surface',
        definition: 'A flat circular end face produced by a cutting plane; a shell rim is the annular version.',
        measurementKind: 'area',
        symbol: 'πr²',
        wordingExamples: [wording('"Flat base of the cap"', 'problem wording', 'One-base cap')],
        distinctionNote: 'Cut disks belong to the segment boundary, not to its curved zone. Total boundary area adds them explicitly.',
        relatedFormulaIds: ['F-SP10', 'F-SP12'],
        lessonIds: ['sph-02', 'sph-01'],
        searchAliases: ['flat cut face', 'cap base', 'annular rim'],
      }),
      part({
        id: 'inner-surface',
        name: 'Inner surface',
        geometricType: 'surface',
        definition: 'The inward-facing curved surface of a hemispherical shell.',
        measurementKind: 'area',
        symbol: '2πR_i²',
        wordingExamples: [wording('"Inside curved surface"', 'problem wording', 'Shell preset, open mouth')],
        distinctionNote: 'Inner and outer curved areas use their own radii; the open rim is annular, not two full disks.',
        relatedFormulaIds: ['F-SP03', 'F-SP06'],
        lessonIds: ['sph-01'],
        searchAliases: ['inside surface', 'inner curved area', 'shell interior'],
      }),
      part({
        id: 'outer-surface',
        name: 'Outer surface',
        geometricType: 'surface',
        definition: 'The outward-facing spherical surface, including the sphere outline or shell exterior.',
        measurementKind: 'area',
        symbol: '2πR_o²',
        wordingExamples: [wording('"Outside curved surface"', 'problem wording', 'Shell preset, open mouth')],
        distinctionNote: 'For a full sphere use 4πR²; for a hemisphere use the curved 2πR² unless the base disk is included.',
        relatedFormulaIds: ['F-SP01', 'F-SP03', 'F-SP04', 'F-SP06'],
        lessonIds: ['sph-01'],
        searchAliases: ['outside surface', 'sphere surface', 'outer curved area'],
      }),
      part({
        id: 'wetted-wall',
        name: 'Wetted wall',
        geometricType: 'surface',
        definition: 'The curved bowl wall actually in contact with liquid, from the lowest point to the liquid plane.',
        measurementKind: 'area',
        symbol: 'A_wet',
        wordingExamples: [wording('"Wetted area"', 'problem wording', 'Excludes the free liquid surface')],
        distinctionNote: 'A_wet = 2πRh is curved wall only. Adding the free disk gives the whole liquid-segment boundary, not wetted bowl wall.',
        relatedFormulaIds: ['F-SP07', 'F-SP09'],
        lessonIds: ['sph-03'],
        searchAliases: ['wet area', 'liquid contact area', 'bowl wall'],
      }),
      part({
        id: 'free-liquid-surface',
        name: 'Free liquid surface',
        geometricType: 'surface',
        definition: 'The flat circular top of the liquid in a partially filled bowl.',
        measurementKind: 'area',
        symbol: 'πr²',
        wordingExamples: [wording('"Water surface"', 'problem wording', 'Bowl preset only')],
        distinctionNote: 'It is not bowl wall and is excluded from wetted area; it is a cut disk of the liquid segment.',
        relatedFormulaIds: ['F-SP08', 'F-SP10'],
        lessonIds: ['sph-03'],
        searchAliases: ['water surface', 'liquid top', 'free surface'],
      }),
    ],
    build(state) {
      const { params = {}, view, showLabels, showHidden, showGuides } = state;
      const active = activePreset(state);
      const vs = viewFor(view);
      const isFullSphere = active.id === 'sphere';
      const isHemisphere = active.id === 'hemisphere';
      const isShell = active.id === 'shell';
      const isOneBaseCap = active.id === 'one-base-cap';
      const isTwoBaseSegment = active.id === 'two-base-segment';
      const isBowl = active.id === 'bowl';
      const R = Math.max(1, num(params.radius, 5));
      const clampZ = (value) => Math.max(-R, Math.min(R, num(value, 0)));
      const z1 = clampZ(params.cutZ1);
      const z2 = Math.max(z1, clampZ(params.cutZ2));
      const depth = Math.max(0, Math.min(R, num(params.liquidDepth, 2)));
      const innerR = Math.max(0.5, Math.min(R - 0.5, num(params.innerRadius, Math.max(1, R - 3))));
      const cutRadius = (z) => Math.sqrt(Math.max(0, R * R - z * z));
      const r1 = cutRadius(z1);
      const r2 = cutRadius(z2);
      const capHeight = R - z1;
      const segmentHeight = z2 - z1;
      const liquidZ = -R + depth;
      const liquidRadius = cutRadius(liquidZ);
      const rx = (radius) => radius * vs.scale;
      const rySurface = (radius) => radius * vs.scale * Math.abs(Math.cos(vs.elevation));
      const ryPlane = (radius) => radius * vs.scale * Math.abs(Math.sin(vs.elevation));
      const primitives = [];

      function horizontalDisk(partId, z, radius, role = 'surface') {
        primitives.push(ell(partId, screen([0, 0, z], vs), rx(radius), ryPlane(radius), { role }));
      }

      function zoneBand(partId, zLow, zHigh) {
        const topZ = Math.min(zHigh, R - 0.001);
        const lowZ = Math.min(zLow, topZ);
        const highZ = Math.max(zLow, topZ);
        const lower = horizontalCircle3([0, 0, lowZ], cutRadius(lowZ)).map((point) => screen(point, vs));
        const upper = horizontalCircle3([0, 0, highZ], cutRadius(highZ)).map((point) => screen(point, vs));
        primitives.push(path(partId, pathFromPoints([...lower, ...upper.reverse()], { close: true }), { role: 'surface' }));
      }

      if (isShell) {
        const halfArc = (radius, partId) => {
          const points = sampleCurve((theta) => screen([radius * Math.cos(theta), 0, radius * Math.sin(theta)], vs), Math.PI, 2 * Math.PI, 64);
          primitives.push(path(partId, pathFromPoints(points, { close: true }), { role: 'surface' }));
        };
        halfArc(R, 'outer-surface');
        halfArc(innerR, 'inner-surface');
        const outer = pathFromPoints(screenAll(horizontalCircle3([0, 0, 0], R), vs), { close: true });
        const inner = pathFromPoints(screenAll([...horizontalCircle3([0, 0, 0], innerR)].reverse(), vs), { close: true });
        primitives.push(path('cut-disk', `${outer} ${inner}`, { role: 'surface' }));
        primitives.push(ell('great-circle', screen([0, 0, 0], vs), rx(R), ryPlane(R)));
        primitives.push(seg('sphere-radius', screen([0, 0, 0], vs), screen([R, 0, 0], vs)));
        addPoint(primitives, 'center', [0, 0, 0], vs);
      } else if (isHemisphere || isBowl) {
        const points = sampleCurve((theta) => screen([R * Math.cos(theta), 0, R * Math.sin(theta)], vs), Math.PI, 2 * Math.PI, 64);
        primitives.push(path('outer-surface', pathFromPoints(points, { close: true }), { role: 'surface' }));
        primitives.push(ell('great-circle', screen([0, 0, 0], vs), rx(R), ryPlane(R)));
        primitives.push(seg('sphere-radius', screen([0, 0, 0], vs), screen([R, 0, 0], vs)));
        addPoint(primitives, 'center', [0, 0, 0], vs);
        horizontalDisk('cut-disk', 0, R);
        if (isBowl) {
          zoneBand('wetted-wall', -R + 0.001, liquidZ);
          horizontalDisk('free-liquid-surface', liquidZ, liquidRadius);
          horizontalDisk('small-circle', liquidZ, liquidRadius, 'curve');
          primitives.push(seg('cut-circle-radius', screen([0, 0, liquidZ], vs), screen([liquidRadius, 0, liquidZ], vs)));
          if (showGuides) primitives.push(dimension('segment-height', screen([0, 0, -R], vs), screen([0, 0, liquidZ], vs)));
        }
      } else {
        primitives.push(ell('outer-surface', screen([0, 0, 0], vs), rx(R), rySurface(R)));
        primitives.push(ell('great-circle', screen([0, 0, 0], vs), rx(R), ryPlane(R)));
        primitives.push(seg('sphere-radius', screen([0, 0, 0], vs), screen([R, 0, 0], vs)));
        addPoint(primitives, 'center', [0, 0, 0], vs);
        if (isOneBaseCap) {
          zoneBand('curved-zone', z1, R);
          horizontalDisk('cut-disk', z1, r1);
          horizontalDisk('small-circle', z1, r1, 'curve');
          primitives.push(seg('cut-circle-radius', screen([0, 0, z1], vs), screen([r1, 0, z1], vs)));
          if (showGuides) primitives.push(dimension('segment-height', screen([0, 0, z1], vs), screen([0, 0, R], vs)));
        }
        if (isTwoBaseSegment) {
          zoneBand('curved-zone', z1, z2);
          horizontalDisk('cut-disk', z1, r1);
          horizontalDisk('cut-disk', z2, r2);
          horizontalDisk('small-circle', z1, r1, 'curve');
          horizontalDisk('small-circle', z2, r2, 'curve');
          primitives.push(seg('cut-circle-radius', screen([0, 0, z1], vs), screen([r1, 0, z1], vs)));
          primitives.push(seg('cut-circle-radius', screen([0, 0, z2], vs), screen([r2, 0, z2], vs)));
          if (showGuides) primitives.push(dimension('segment-height', screen([0, 0, z1], vs), screen([0, 0, z2], vs)));
        }
      }
      if (showLabels) {
        primitives.push(label('O', screen([0, 0, 0], vs)));
        primitives.push(label(`R = ${fmt(R)} u`, screen([R * 0.6, 0, 0], vs)));
        primitives.push(label('great circle', screen([R * 0.7, 0, 0], vs)));
        if (isOneBaseCap || isTwoBaseSegment || isBowl) {
          primitives.push(label('small circle', screen([0, 0, isBowl ? liquidZ : z1], vs)));
          if (showGuides) primitives.push(label('h', screen([0, 0, isBowl ? (-R + liquidZ) / 2 : (z1 + z2) / 2], vs)));
        }
      }

      const measurements = [
        measurement('Sphere radius R', LEN(R), 'length', 'Same sphere used for every cutting plane.'),
        measurement('Sphere diameter D', LEN(2 * R), 'length', 'D = 2R.'),
      ];
      if (isFullSphere) {
        measurements.push(measurement('Sphere surface area', AREA(4 * Math.PI * R * R), 'area', '4πR² = πD².'));
        measurements.push(measurement('Sphere volume', VOL(4 * Math.PI * R ** 3 / 3), 'volume', 'Enclosed volume.'));
      }
      if (isHemisphere) {
        measurements.push(measurement('Hemisphere curved area', AREA(2 * Math.PI * R * R), 'area', 'Excludes the base disk.'));
        measurements.push(measurement('Hemisphere closed total area', AREA(3 * Math.PI * R * R), 'area', 'Curved area plus one base disk.'));
        measurements.push(measurement('Hemisphere volume', VOL(2 * Math.PI * R ** 3 / 3), 'volume', 'Half the sphere volume.'));
      }
      if (isShell) {
        measurements.push(measurement('Outer radius R_o', LEN(R), 'length', 'Outside curved surface.'));
        measurements.push(measurement('Inner radius R_i', LEN(innerR), 'length', 'Inside curved surface.'));
        measurements.push(measurement('Outer curved area', AREA(2 * Math.PI * R * R), 'area', 'Open-mouth hemispherical shell.'));
        measurements.push(measurement('Inner curved area', AREA(2 * Math.PI * innerR * innerR), 'area', 'Open-mouth hemispherical shell.'));
        measurements.push(measurement('Shell material volume', VOL(2 * Math.PI * (R ** 3 - innerR ** 3) / 3), 'volume', 'Subtract concentric hemispherical volumes.'));
      }
      if (isOneBaseCap) {
        measurements.push(measurement('Cap height h', LEN(capHeight), 'length', 'Perpendicular from cut plane to top of sphere.'));
        measurements.push(measurement('Cut-circle radius r', LEN(r1), 'length', 'r² = 2Rh − h² on this sphere.'));
        measurements.push(measurement('Cap curved area', AREA(2 * Math.PI * R * capHeight), 'area', 'Curved zone only.'));
        measurements.push(measurement('Cut disk area', AREA(Math.PI * r1 * r1), 'area', 'Measured as an area.'));
        measurements.push(measurement('Cap total boundary area', AREA(2 * Math.PI * R * capHeight + Math.PI * r1 * r1), 'area', 'Curved zone plus the one cut disk.'));
        measurements.push(measurement('Cap volume', VOL(Math.PI * capHeight ** 2 * (3 * R - capHeight) / 3), 'volume', 'Solid segment volume, different from zone area.'));
      }
      if (isTwoBaseSegment) {
        measurements.push(measurement('Segment height h', LEN(segmentHeight), 'length', 'z₂ − z₁, a perpendicular plane separation.'));
        measurements.push(measurement('Lower cut radius r₁', LEN(r1), 'length', '√(R²−z₁²).'));
        measurements.push(measurement('Upper cut radius r₂', LEN(r2), 'length', '√(R²−z₂²).'));
        measurements.push(measurement('Curved zone area', AREA(2 * Math.PI * R * segmentHeight), 'area', 'Curved surface between the planes only.'));
        measurements.push(measurement('Two cut disks area', AREA(Math.PI * (r1 * r1 + r2 * r2)), 'area', 'Flat parts of the segment boundary.'));
        measurements.push(measurement('Segment total boundary area', AREA(2 * Math.PI * R * segmentHeight + Math.PI * (r1 * r1 + r2 * r2)), 'area', 'Zone plus both disks.'));
        measurements.push(measurement('Segment volume', VOL(Math.PI * segmentHeight * (3 * r1 * r1 + 3 * r2 * r2 + segmentHeight ** 2) / 6), 'volume', 'Solid segment volume.'));
      }
      if (isBowl) {
        measurements.push(measurement('Liquid depth h', LEN(depth), 'length', 'Measured upward from the lowest point of the bowl.'));
        measurements.push(measurement('Free-surface radius r', LEN(liquidRadius), 'length', 'r² = 2Rh − h².'));
        measurements.push(measurement('Liquid volume', VOL(Math.PI * depth ** 2 * (3 * R - depth) / 3), 'volume', 'One-base cap volume.'));
        measurements.push(measurement('Wetted wall area', AREA(2 * Math.PI * R * depth), 'area', 'Curved bowl wall in contact with liquid only.'));
        measurements.push(measurement('Free liquid surface area', AREA(Math.PI * liquidRadius * liquidRadius), 'area', 'Excluded from wetted wall area.'));
        measurements.push(measurement('Total liquid boundary area', AREA(2 * Math.PI * R * depth + Math.PI * liquidRadius * liquidRadius), 'area', 'Curved wall plus free disk; not the wetted area.'));
      }
      return {
        title: `${active.label} — centre, cuts, zones and solid segments`,
        description: isBowl
          ? 'Liquid depth is measured from the lowest point. The wetted wall is curved bowl area only; the free liquid disk is a different surface.'
          : isShell
            ? 'An open hemispherical shell has inner and outer curved surfaces and an annular rim; its material volume subtracts concentric hemispheres.'
            : 'Cut radii are derived from cutting-plane positions on one sphere. The curved zone is an area; the solid segment between planes has a volume and flat cut disks.',
        primitives,
        measurements,
        note: isOneBaseCap || isTwoBaseSegment || isBowl
          ? 'Zone area, cut-disk areas, total boundary area and solid segment volume are different quantities; do not interchange them.'
          : 'A great circle uses a central plane; small circles use off-centre planes on the same sphere.',
      };
    },
  },
];

const PRESET_LABELS = new Map();
for (const figure of figures) {
  for (const item of figure.presets) PRESET_LABELS.set(item.id, item.label);
}
