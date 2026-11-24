const NS = 'http://www.w3.org/2000/svg';
const VIEW = { width: 600, height: 360, cx: 300, cy: 180 };
const fmt = (value, digits = 2) => Number(value.toFixed(digits)).toString();

function svgNode(name, attributes = {}) {
  const node = document.createElementNS(NS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
}

function drawConicEccentricity(svg, eccentricity) {
  const { point } = graphAxes(svg, 6);
  if (eccentricity < 1) {
    const a = 3;
    const b = a * Math.sqrt(1 - eccentricity ** 2);
    const focus = a * eccentricity;
    svg.append(svgNode('ellipse', {
      cx: VIEW.cx,
      cy: VIEW.cy,
      rx: a * 24,
      ry: b * 24,
      class: 'explorer-shape',
    }));
    circle(svg, ...point(focus, 0), 4);
    line(svg, ...point(a / eccentricity, -6), ...point(a / eccentricity, 6), 'explorer-directrix');
    return [
      ['Eccentricity', fmt(eccentricity)],
      ['Conic', 'ellipse'],
      ['Focus', `(${fmt(focus)}, 0)`],
      ['Matching directrix', `x = ${fmt(a / eccentricity)}`],
    ];
  }
  if (eccentricity === 1) {
    const p = 1.5;
    const points = [];
    for (let y = -5; y <= 5.01; y += 0.05) points.push(point(y * y / (4 * p), y));
    path(svg, points, 'explorer-highlight');
    circle(svg, ...point(p, 0), 4);
    line(svg, ...point(-p, -6), ...point(-p, 6), 'explorer-directrix');
    return [
      ['Eccentricity', '1'],
      ['Conic', 'parabola'],
      ['Focus', `(${p}, 0)`],
      ['Directrix', `x = −${p}`],
    ];
  }
  const a = 2;
  const b = a * Math.sqrt(eccentricity ** 2 - 1);
  const c = a * eccentricity;
  const left = [];
  const right = [];
  for (let t = -1.2; t <= 1.201; t += 0.025) {
    left.push(point(-a * Math.cosh(t), b * Math.sinh(t)));
    right.push(point(a * Math.cosh(t), b * Math.sinh(t)));
  }
  path(svg, left, 'explorer-highlight');
  path(svg, right, 'explorer-highlight');
  circle(svg, ...point(c, 0), 4);
  line(svg, ...point(a / eccentricity, -6), ...point(a / eccentricity, 6), 'explorer-directrix');
  return [
    ['Eccentricity', fmt(eccentricity)],
    ['Conic', 'hyperbola'],
    ['Focus', `(${fmt(c)}, 0)`],
    ['Matching directrix', `x = ${fmt(a / eccentricity)}`],
  ];
}

function line(svg, x1, y1, x2, y2, className = 'explorer-axis') {
  svg.append(svgNode('line', { x1, y1, x2, y2, class: className }));
}

function text(svg, x, y, value, anchor = 'middle') {
  const node = svgNode('text', { x, y, class: 'explorer-label', 'text-anchor': anchor });
  node.textContent = value;
  svg.append(node);
}

function polygon(svg, points, className = 'explorer-shape') {
  svg.append(svgNode('polygon', {
    points: points.map((point) => point.map(fmt).join(',')).join(' '),
    class: className,
  }));
}

function circle(svg, cx, cy, r, className = 'explorer-shape') {
  svg.append(svgNode('circle', { cx, cy, r, class: className }));
}

function path(svg, points, className = 'explorer-shape') {
  svg.append(svgNode('polyline', {
    points: points.map((point) => point.map(fmt).join(',')).join(' '),
    class: className,
  }));
}

function freshSvg(title, description) {
  const svg = svgNode('svg', {
    class: 'course-explorer-svg',
    viewBox: `0 0 ${VIEW.width} ${VIEW.height}`,
    role: 'img',
  });
  const titleNode = svgNode('title');
  titleNode.textContent = title;
  const descriptionNode = svgNode('desc');
  descriptionNode.textContent = description;
  svg.append(titleNode, descriptionNode);
  return svg;
}

function graphAxes(svg, extent = 5) {
  const scale = Math.min(250 / extent, 145 / extent);
  line(svg, VIEW.cx - extent * scale, VIEW.cy, VIEW.cx + extent * scale, VIEW.cy);
  line(svg, VIEW.cx, VIEW.cy - extent * scale, VIEW.cx, VIEW.cy + extent * scale);
  text(svg, VIEW.cx + extent * scale - 8, VIEW.cy - 8, 'x');
  text(svg, VIEW.cx + 10, VIEW.cy - extent * scale + 12, 'y');
  return {
    scale,
    point: (x, y) => [VIEW.cx + x * scale, VIEW.cy - y * scale],
  };
}

function drawPolygon(svg, values) {
  const sides = Math.round(values.sides ?? 6);
  const length = values.length ?? 4;
  const radius = 115;
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = Math.PI / 2 - index * Math.PI * 2 / sides;
    return [VIEW.cx + radius * Math.cos(angle), VIEW.cy - radius * Math.sin(angle)];
  });
  polygon(svg, points, 'explorer-shape');
  line(svg, ...points[0], ...points[1], 'explorer-highlight');
  line(svg, VIEW.cx, VIEW.cy, (points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2, 'explorer-secondary');
  circle(svg, VIEW.cx, VIEW.cy, 3);
  text(svg, VIEW.cx, 32, `${sides} sides`);
  const area = sides * length * length / (4 * Math.tan(Math.PI / sides));
  return [
    ['Interior angle', `${fmt((sides - 2) * 180 / sides)}°`],
    ['Diagonals', String(sides * (sides - 3) / 2)],
    ['Perimeter', `${fmt(sides * length)} units`],
    ['Area', `${fmt(area)} square units`],
  ];
}

function drawTriangle(svg, values, segmentType) {
  const angle = Number(values.angle);
  const base = 6;
  const side = 4;
  const a = [190, 285];
  const b = [410, 285];
  const c = [a[0] + side / base * 220 * Math.cos(angle * Math.PI / 180), a[1] - side / base * 220 * Math.sin(angle * Math.PI / 180)];
  polygon(svg, [a, b, c]);
  if (segmentType === 'altitude') {
    line(svg, c[0], c[1], c[0], a[1], 'explorer-secondary');
  } else if (segmentType === 'median') {
    line(svg, ...a, (b[0] + c[0]) / 2, (b[1] + c[1]) / 2, 'explorer-secondary');
  } else if (segmentType === 'angle-bisector') {
    const ratio = side / (base + side);
    const pointOnSide = [b[0] * ratio + c[0] * (1 - ratio), b[1] * ratio + c[1] * (1 - ratio)];
    line(svg, ...a, ...pointOnSide, 'explorer-secondary');
  }
  text(svg, a[0], a[1] + 24, 'A');
  text(svg, b[0], b[1] + 24, 'B');
  text(svg, c[0], c[1] - 12, 'C');
  text(svg, (a[0] + b[0]) / 2, a[1] + 18, 'base = 6');
  const thirdSide = Math.hypot(base - side * Math.cos(angle * Math.PI / 180), side * Math.sin(angle * Math.PI / 180));
  const area = base * side * Math.sin(angle * Math.PI / 180) / 2;
  return [
    ['Included angle', `${fmt(angle, 0)}°`],
    ['Area', `${fmt(area)} square units`],
    ['Third side', `${fmt(thirdSide)} units`],
    ['By sides', Math.abs(thirdSide - base) < 0.01 || Math.abs(thirdSide - side) < 0.01 ? 'isosceles' : 'scalene'],
    ['By angles', angle > 90 ? 'obtuse' : angle === 90 ? 'right' : 'acute'],
  ];
}

function drawQuadrilateral(svg, values, lessonId) {
  if (lessonId === 'quad-02') {
    const width = Number(values.width);
    const height = 3;
    const scale = 34;
    const left = VIEW.cx - width * scale / 2;
    const top = VIEW.cy - height * scale / 2;
    polygon(svg, [[left, top], [left + width * scale, top], [left + width * scale, top + height * scale], [left, top + height * scale]]);
    text(svg, VIEW.cx, top - 12, `length ${fmt(width)}`);
    text(svg, left - 12, VIEW.cy, `width ${height}`, 'end');
    return [
      ['Perimeter', `${fmt(2 * (width + height))} units`],
      ['Area', `${fmt(width * height)} square units`],
      ['Diagonal', `${fmt(Math.hypot(width, height))} units`],
    ];
  }
  if (lessonId === 'quad-04') {
    const topBase = Number(values.top);
    const bottomBase = 7;
    const height = 3;
    const scale = 36;
    const cx = VIEW.cx;
    const yTop = VIEW.cy - height * scale / 2;
    const yBottom = VIEW.cy + height * scale / 2;
    polygon(svg, [
      [cx - bottomBase * scale / 2, yBottom],
      [cx + bottomBase * scale / 2, yBottom],
      [cx + topBase * scale / 2, yTop],
      [cx - topBase * scale / 2, yTop],
    ]);
    line(svg, cx + 12, yTop, cx + 12, yBottom, 'explorer-secondary');
    text(svg, cx, yTop - 12, `top base ${fmt(topBase)}`);
    return [
      ['Parallel bases', `${fmt(bottomBase)} and ${fmt(topBase)} units`],
      ['Height', `${height} units`],
      ['Area', `${fmt((bottomBase + topBase) * height / 2)} square units`],
    ];
  }

  const angle = Number(values.angle) * Math.PI / 180;
  const side = lessonId === 'quad-03' ? 4 : 3.5;
  const base = 6;
  const px = 38;
  const a = [VIEW.cx - 130, VIEW.cy + 70];
  const b = [a[0] + base * px, a[1]];
  const offset = [side * px * Math.cos(angle), -side * px * Math.sin(angle)];
  const c = [b[0] + offset[0], b[1] + offset[1]];
  const d = [a[0] + offset[0], a[1] + offset[1]];
  polygon(svg, [a, b, c, d]);
  line(svg, a[0], a[1], d[0], d[1], 'explorer-secondary');
  text(svg, VIEW.cx, a[1] + 22, `base ${base}`);
  const area = lessonId === 'quad-03'
    ? side * side * Math.sin(angle)
    : base * side * Math.sin(angle);
  const diagonal = Math.hypot(base ** 2 + side ** 2 - 2 * base * side * Math.cos(angle), 0);
  return [
    ['Included angle', `${fmt(Number(values.angle), 0)}°`],
    [lessonId === 'quad-03' ? 'Equal side' : 'Adjacent sides', `${side} units`],
    ['Area', `${fmt(area)} square units`],
    ['Height', `${fmt(side * Math.sin(angle))} units`],
    ...(lessonId === 'quad-03' ? [['Diagonals', `${fmt(2 * side * Math.sin(angle / 2))} and ${fmt(2 * side * Math.cos(angle / 2))} units`]] : [['Diagonal BD', `${fmt(diagonal)} units`]]),
  ];
}

function drawCoordinates(svg, values, lessonId) {
  const { point } = graphAxes(svg, 6);
  if (lessonId === 'cart-01') {
    const b = point(Number(values.x), Number(values.y));
    circle(svg, ...b, 5);
    text(svg, b[0] + 8, b[1] - 10, `B (${fmt(Number(values.x), 0)}, ${fmt(Number(values.y), 0)})`, 'start');
    const x = Number(values.x);
    const y = Number(values.y);
    const quadrant = x === 0 || y === 0
      ? 'on an axis'
      : x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III');
    return [
      ['Point B', `(${fmt(x, 0)}, ${fmt(y, 0)})`],
      ['Quadrant', quadrant],
      ['Horizontal axis', 'x-axis'],
      ['Vertical axis', 'y-axis'],
    ];
  }
  if (lessonId === 'cart-03') {
    const a = point(-3, -2);
    const b = point(4, 3);
    const t = Number(values.t);
    const q = point(-3 + t * 7, -2 + t * 5);
    line(svg, ...a, ...b, 'explorer-highlight');
    circle(svg, ...a, 4);
    circle(svg, ...b, 4);
    circle(svg, ...q, 5);
    text(svg, a[0], a[1] + 20, 'A (−3, −2)');
    text(svg, b[0], b[1] - 12, 'B (4, 3)');
    text(svg, q[0], q[1] - 12, 'Q');
    return [
      ['Division parameter t', fmt(t)],
      ['Point Q', `(${fmt(-3 + t * 7)}, ${fmt(-2 + t * 5)})`],
      ['Ratio AQ : QB', `${fmt(t)} : ${fmt(1 - t)}`],
    ];
  }
  if (lessonId === 'cart-04') {
    const vertices = [
      [-3, -2],
      [Number(values.x), Number(values.y)],
      [2, 4],
    ];
    const points = vertices.map(([x, y]) => point(x, y));
    polygon(svg, points);
    vertices.forEach(([x, y], index) => {
      circle(svg, ...points[index], 4);
      text(svg, points[index][0] + 8, points[index][1] - 8, `${String.fromCharCode(65 + index)} (${fmt(x, 0)}, ${fmt(y, 0)})`, 'start');
    });
    const signedDoubleArea = vertices.reduce((sum, [x, y], index) => {
      const [nextX, nextY] = vertices[(index + 1) % vertices.length];
      return sum + x * nextY - y * nextX;
    }, 0);
    return [
      ['Ordered vertices', 'A → B → C'],
      ['Signed double area', fmt(signedDoubleArea)],
      ['Triangle area', `${fmt(Math.abs(signedDoubleArea) / 2)} square units`],
      ['Orientation', signedDoubleArea < 0 ? 'clockwise' : signedDoubleArea > 0 ? 'counterclockwise' : 'collinear'],
    ];
  }
  const a = point(-3, -2);
  const b = point(Number(values.x), Number(values.y));
  const foot = point(Number(values.x), -2);
  line(svg, ...a, ...foot, 'explorer-secondary');
  line(svg, ...foot, ...b, 'explorer-secondary');
  line(svg, ...a, ...b, 'explorer-highlight');
  circle(svg, ...a, 4);
  circle(svg, ...b, 4);
  text(svg, a[0] - 4, a[1] + 19, 'A (−3, −2)');
  text(svg, b[0], b[1] - 12, `B (${fmt(Number(values.x), 0)}, ${fmt(Number(values.y), 0)})`);
  const dx = Number(values.x) + 3;
  const dy = Number(values.y) + 2;
  return [
    ['Horizontal change', `${fmt(dx)} units`],
    ['Vertical change', `${fmt(dy)} units`],
    ['Distance', `${fmt(Math.hypot(dx, dy))} units`],
    ['Midpoint', `(${fmt((Number(values.x) - 3) / 2)}, ${fmt((Number(values.y) - 2) / 2)})`],
  ];
}

function drawLineModel(svg, values, modes, lessonId) {
  const { point } = graphAxes(svg, 6);
  const slope = Number(values.slope);
  const mode = modes.line;
  const direction = mode === 'vertical' ? 90 : mode === 'horizontal' ? 0 : Math.atan(slope) * 180 / Math.PI;
  const smallerAngle = Math.min(Math.abs(direction % 180), 180 - Math.abs(direction % 180));
  const directedAngle = (direction + 360) % 180;
  const samples = [];
  for (let x = -6; x <= 6.01; x += 0.1) {
    const y = mode === 'vertical' ? x : mode === 'horizontal' ? 1 : slope * x + 1;
    samples.push(point(mode === 'vertical' ? 1 : x, mode === 'vertical' ? x : y));
  }
  path(svg, samples, 'explorer-highlight');
  const equation = mode === 'vertical' ? 'x = 1' : mode === 'horizontal' ? 'y = 1' : `y = ${fmt(slope)}x + 1`;
  text(svg, 395, 45, equation);
  if (lessonId === 'line-02') {
    line(svg, ...point(-6, 1), ...point(6, 1), 'explorer-secondary');
    text(svg, 420, 68, 'reference line', 'start');
  }
  const angle = modes.convention === 'directed' ? directedAngle : smallerAngle;
  return [
    ['Equation', equation],
    ['Slope', mode === 'vertical' ? 'undefined' : mode === 'horizontal' ? '0' : fmt(slope)],
    [lessonId === 'line-02' ? `${modes.convention} angle` : 'Direction angle', `${fmt(angle)}°`],
    ['Line type', mode === 'vertical' ? 'vertical' : mode === 'horizontal' || slope === 0 ? 'horizontal' : 'slanted'],
  ];
}

function drawCircle(svg, values, lessonId) {
  if (lessonId === 'circ-01') return drawConicEccentricity(svg, Number(values.eccentricity));
  const radius = Number(values.radius);
  if (lessonId === 'circ-02') {
    const r = radius * 24;
    svg.append(svgNode('circle', { cx: VIEW.cx, cy: VIEW.cy, r, class: 'explorer-shape' }));
    circle(svg, VIEW.cx, VIEW.cy, 4);
    line(svg, VIEW.cx, VIEW.cy, VIEW.cx + r, VIEW.cy, 'explorer-highlight');
    text(svg, VIEW.cx + r / 2, VIEW.cy - 10, `r = ${fmt(radius)}`);
    return [
      ['Standard form', `x² + y² = ${fmt(radius ** 2)}`],
      ['Center', '(0, 0)'],
      ['Radius', `${fmt(radius)} units`],
      ['General-form constant', `${fmt(-(radius ** 2))}`],
      ['Classification', 'real circle'],
    ];
  }
  const angle = Number(values.angle) * Math.PI / 180;
  const { point, scale } = graphAxes(svg, 6);
  const c = point(0, 0);
  const r = radius * scale;
  const p = point(radius * Math.cos(angle), radius * Math.sin(angle));
  svg.append(svgNode('circle', { cx: c[0], cy: c[1], r, class: 'explorer-shape' }));
  line(svg, ...c, ...p, 'explorer-highlight');
  const tangentLength = 6 * scale;
  const dx = -Math.sin(angle) * tangentLength;
  const dy = -Math.cos(angle) * tangentLength;
  line(svg, p[0] - dx, p[1] - dy, p[0] + dx, p[1] + dy, 'explorer-secondary');
  circle(svg, ...c, 3);
  circle(svg, ...p, 4);
  text(svg, p[0] + 10, p[1] - 8, 'tangent point', 'start');
  return [
    ['Radius', `${fmt(radius)} units`],
    ['Equation', `x² + y² = ${fmt(radius ** 2)}`],
    ['Circumference', `${fmt(2 * Math.PI * radius)} units`],
    ['Area', `${fmt(Math.PI * radius ** 2)} square units`],
  ];
}

function drawParabola(svg, values, orientation) {
  const { point } = graphAxes(svg, 6);
  const p = Number(values.p);
  const horizontal = orientation === 'right' || orientation === 'left';
  const sign = orientation === 'down' || orientation === 'left' ? -1 : 1;
  const points = [];
  for (let t = -5; t <= 5.01; t += 0.05) {
    points.push(horizontal ? point(sign * t * t / (4 * p), t) : point(t, sign * t * t / (4 * p)));
  }
  path(svg, points, 'explorer-highlight');
  const focus = horizontal ? point(sign * p, 0) : point(0, sign * p);
  const directrix = horizontal
    ? [point(-sign * p, -6), point(-sign * p, 6)]
    : [point(-6, -sign * p), point(6, -sign * p)];
  line(svg, ...directrix[0], ...directrix[1], 'explorer-directrix');
  circle(svg, ...focus, 4);
  text(svg, focus[0] + 9, focus[1] - 8, 'focus', 'start');
  return [
    ['Orientation', orientation],
    ['Standard form', horizontal
      ? `y² = ${fmt(sign * 4 * p)}x`
      : `x² = ${fmt(sign * 4 * p)}y`],
    ['Parameter p', `${fmt(p)} units`],
    ['Focus', horizontal ? `(${fmt(sign * p)}, 0)` : `(0, ${fmt(sign * p)})`],
    ['Directrix', horizontal ? `x = ${fmt(-sign * p)}` : `y = ${fmt(-sign * p)}`],
  ];
}

function drawEllipse(svg, values, orientation) {
  const a = 4;
  const b = Number(values.b);
  const majorHorizontal = orientation === 'horizontal';
  const major = Math.max(a, b);
  const minor = Math.min(a, b);
  const c = Math.sqrt(major ** 2 - minor ** 2);
  const rx = majorHorizontal ? major : minor;
  const ry = majorHorizontal ? minor : major;
  const scale = 26;
  svg.append(svgNode('ellipse', {
    cx: VIEW.cx,
    cy: VIEW.cy,
    rx: rx * scale,
    ry: ry * scale,
    class: 'explorer-shape',
  }));
  const focusX = majorHorizontal ? c : 0;
  const focusY = majorHorizontal ? 0 : c;
  circle(svg, VIEW.cx + focusX * scale, VIEW.cy - focusY * scale, 4);
  circle(svg, VIEW.cx - focusX * scale, VIEW.cy + focusY * scale, 4);
  const isCircle = Math.abs(a - b) < 0.001;
  return [
    ['Orientation', isCircle ? 'circle limit (a = b)' : orientation],
    ['Standard form', majorHorizontal
      ? `x²/16 + y²/${fmt(b ** 2)} = 1`
      : `x²/${fmt(b ** 2)} + y²/16 = 1`],
    ['Semiaxes', `a = 4, b = ${fmt(b)} units`],
    ['Focal distance', `${fmt(c)} units`],
    ['Eccentricity', fmt(c / major)],
    ['Focal-distance sum', `${fmt(2 * major)} units`],
  ];
}

function drawHyperbola(svg, values, orientation) {
  const { point } = graphAxes(svg, 6);
  const a = 2.5;
  const b = Number(values.b);
  const branches = [[], []];
  for (let t = -1.35; t <= 1.351; t += 0.025) {
    const longitudinal = a * Math.cosh(t);
    const transverse = b * Math.sinh(t);
    if (orientation === 'horizontal') {
      branches[0].push(point(longitudinal, transverse));
      branches[1].push(point(-longitudinal, transverse));
    } else {
      branches[0].push(point(transverse, longitudinal));
      branches[1].push(point(transverse, -longitudinal));
    }
  }
  path(svg, branches[0], 'explorer-highlight');
  path(svg, branches[1], 'explorer-highlight');
  if (orientation === 'horizontal') {
    line(svg, ...point(-6, -6 * b / a), ...point(6, 6 * b / a), 'explorer-secondary');
    line(svg, ...point(-6, 6 * b / a), ...point(6, -6 * b / a), 'explorer-secondary');
    line(svg, ...point(-a * a / Math.hypot(a, b), -6), ...point(-a * a / Math.hypot(a, b), 6), 'explorer-directrix');
    line(svg, ...point(a * a / Math.hypot(a, b), -6), ...point(a * a / Math.hypot(a, b), 6), 'explorer-directrix');
  } else {
    line(svg, ...point(-6, -6 * a / b), ...point(6, 6 * a / b), 'explorer-secondary');
    line(svg, ...point(-6, 6 * a / b), ...point(6, -6 * a / b), 'explorer-secondary');
    line(svg, ...point(-6, -a * a / Math.hypot(a, b)), ...point(6, -a * a / Math.hypot(a, b)), 'explorer-directrix');
    line(svg, ...point(-6, a * a / Math.hypot(a, b)), ...point(6, a * a / Math.hypot(a, b)), 'explorer-directrix');
  }
  return [
    ['Orientation', orientation],
    ['Standard form', orientation === 'horizontal'
      ? `x²/${fmt(a ** 2)} − y²/${fmt(b ** 2)} = 1`
      : `y²/${fmt(a ** 2)} − x²/${fmt(b ** 2)} = 1`],
    ['Semiaxes', `a = ${a}, b = ${fmt(b)} units`],
    ['Focal distance', `${fmt(Math.hypot(a, b))} units`],
    ['Directrix distance', `${fmt(a * a / Math.hypot(a, b))} units from center`],
    ['Asymptote ratio', `b/a = ${fmt(b / a)}`],
    ['Focal-distance difference', `${fmt(2 * a)} units`],
  ];
}

function drawPrism(svg, values, mode, view) {
  const height = Number(values.height);
  if (view === 'net') {
    const top = 120;
    const netHeight = 120;
    const widths = [74, 56, 92];
    let left = 185;
    for (const width of widths) {
      polygon(svg, [[left, top], [left + width, top], [left + width, top + netHeight], [left, top + netHeight]], 'explorer-secondary');
      left += width;
    }
    polygon(svg, [[185, top], [259, top], [185, top - 58]], 'explorer-shape');
    polygon(svg, [[185, top + netHeight], [259, top + netHeight], [185, top + netHeight + 58]], 'explorer-shape');
    text(svg, VIEW.cx, 50, 'Two triangular bases and three rectangular faces');
    return [
      ['Net faces', '2 congruent triangles + 3 rectangles'],
      ['Base area', '6 square units'],
      ['Prism height', `${fmt(height)} units`],
    ];
  }
  const base = [[180, 236], [250, 190], [320, 236]];
  const shift = mode === 'oblique' ? [90, -height * 18] : [0, -height * 18];
  const top = base.map(([x, y]) => [x + shift[0], y + shift[1]]);
  polygon(svg, base);
  polygon(svg, top, 'explorer-secondary');
  for (let index = 0; index < base.length; index += 1) {
    line(svg, ...base[index], ...top[index], 'explorer-highlight');
  }
  const altitudeX = base[1][0];
  line(svg, altitudeX, base[1][1], altitudeX, base[1][1] - height * 18, 'explorer-secondary');
  text(svg, altitudeX + 8, (base[1][1] + top[1][1]) / 2, `h = ${fmt(height)}`, 'start');
  return [
    ['Base area', '6 square units'],
    ['Perpendicular height', `${fmt(height)} units`],
    ['Volume', `${fmt(6 * height)} cubic units`],
    ['Lateral-edge mode', mode],
  ];
}

function drawBox(svg, values, mode) {
  const a = Number(values.length);
  const b = Number(values.width);
  const c = Number(values.height);
  const scale = 24;
  const origin = [VIEW.cx - 95, VIEW.cy + 65];
  const x = [a * scale, 0];
  const y = [b * scale * 0.65, -b * scale * 0.55];
  const z = [0, -c * scale];
  const add = (...vectors) => [origin[0] + vectors.reduce((sum, item) => sum + item[0], 0), origin[1] + vectors.reduce((sum, item) => sum + item[1], 0)];
  const p = [origin, add(x), add(x, y), add(y), add(z), add(x, z), add(x, y, z), add(y, z)];
  for (const [from, to] of [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]) {
    line(svg, ...p[from], ...p[to], 'explorer-axis');
  }
  if (mode === 'space') line(svg, ...p[0], ...p[6], 'explorer-highlight');
  else line(svg, ...p[0], ...p[2], 'explorer-highlight');
  text(svg, VIEW.cx, 36, `${fmt(a)} × ${fmt(b)} × ${fmt(c)}`);
  const face = Math.hypot(a, b);
  const space = Math.hypot(a, b, c);
  return [
    ['Volume', `${fmt(a * b * c)} cubic units`],
    ['Surface area', `${fmt(2 * (a * b + a * c + b * c))} square units`],
    ['Face diagonal', `${fmt(face)} units`],
    ['Space diagonal', `${fmt(space)} units`],
    ['Highlighted', `${mode} diagonal`],
  ];
}

function drawCylinder(svg, values, lessonId) {
  const height = Number(values.height);
  if (lessonId === 'cyl-02') {
    const outer = Number(values.outer);
    const inner = 1;
    const top = 50;
    const bottom = top + height * 24;
    const radiusScale = outer / 2;
    const outerX = 95 * radiusScale;
    const outerY = 28 * radiusScale;
    const innerX = 45 * radiusScale;
    const innerY = 14 * radiusScale;
    svg.append(
      svgNode('path', { d: `M ${300 - outerX} ${top} V ${bottom} A ${outerX} ${outerY} 0 0 0 ${300 + outerX} ${bottom} V ${top} M ${300 - innerX} ${top} V ${bottom} A ${innerX} ${innerY} 0 0 0 ${300 + innerX} ${bottom} V ${top}`, class: 'explorer-shape' }),
      svgNode('path', {
        d: `M ${300 - outerX} ${top} A ${outerX} ${outerY} 0 1 0 ${300 + outerX} ${top} A ${outerX} ${outerY} 0 1 0 ${300 - outerX} ${top} Z M ${300 - innerX} ${top} A ${innerX} ${innerY} 0 1 1 ${300 + innerX} ${top} A ${innerX} ${innerY} 0 1 1 ${300 - innerX} ${top} Z`,
        class: 'explorer-shape',
        'fill-rule': 'evenodd',
      }),
      svgNode('ellipse', { cx: 300, cy: top, rx: innerX, ry: innerY, class: 'explorer-secondary' }),
      svgNode('ellipse', { cx: 300, cy: bottom, rx: outerX, ry: outerY, class: 'explorer-secondary' }),
      svgNode('ellipse', { cx: 300, cy: bottom, rx: innerX, ry: innerY, class: 'explorer-secondary' }),
    );
    const material = Math.PI * (outer ** 2 - inner ** 2) * height;
    const curved = 2 * Math.PI * (outer + inner) * height;
    const ends = 2 * Math.PI * (outer ** 2 - inner ** 2);
    return [
      ['Radii', `outer ${fmt(outer)}, inner ${inner} units`],
      ['Material volume', `${fmt(material)} cubic units`],
      ['Curved surfaces', `${fmt(curved)} square units`],
      ['Two annular ends', `${fmt(ends)} square units`],
      ['Total surface', `${fmt(curved + ends)} square units`],
    ];
  }
  if (lessonId === 'cyl-03') {
    const a = 3;
    const b = 2;
    const perimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
    const curved = perimeter * height;
    const bottom = 72 + height * 21;
    svg.append(
      svgNode('ellipse', { cx: 300, cy: 72, rx: 100, ry: 62, class: 'explorer-shape' }),
      svgNode('path', { d: `M 200 72 V ${bottom} M 400 72 V ${bottom}`, class: 'explorer-shape' }),
      svgNode('ellipse', { cx: 300, cy: bottom, rx: 100, ry: 62, class: 'explorer-secondary' }),
    );
    return [
      ['Semiaxes', `a = ${a}, b = ${b} units`],
      ['Height', `${fmt(height)} units`],
      ['Volume', `${fmt(Math.PI * a * b * height)} cubic units`],
      ['Base perimeter', `≈ ${fmt(perimeter)} units`],
      ['Curved area', `≈ ${fmt(curved)} square units`],
    ];
  }
  const radius = Number(values.radius ?? 2);
  const radiusX = radius * 36;
  const radiusY = radius * 11;
  const bottom = 78 + height * 20;
  svg.append(
    svgNode('ellipse', { cx: 300, cy: 78, rx: radiusX, ry: radiusY, class: 'explorer-shape' }),
    svgNode('path', { d: `M ${300 - radiusX} 78 V ${bottom} M ${300 + radiusX} 78 V ${bottom}`, class: 'explorer-shape' }),
    svgNode('ellipse', { cx: 300, cy: bottom, rx: radiusX, ry: radiusY, class: 'explorer-secondary' }),
  );
  line(svg, 300, 78, 300 + radiusX, 78, 'explorer-highlight');
  text(svg, 300 + radiusX / 2, 68, `r = ${fmt(radius)}`);
  return [
    ['Radius', `${fmt(radius)} units`],
    ['Height', `${fmt(height)} units`],
    ['Volume', `${fmt(Math.PI * radius ** 2 * height)} cubic units`],
    ['Curved area', `${fmt(2 * Math.PI * radius * height)} square units`],
    ['Total area', `${fmt(2 * Math.PI * radius * (radius + height))} square units`],
  ];
}

function drawPyramid(svg, values, lessonId) {
  const height = lessonId === 'pyr-03' ? 6 : Number(values.height);
  if (lessonId === 'pyr-03') {
    const depth = Number(values.depth);
    const fraction = depth / height;
    const tip = [300, 50];
    const base = [[170, 270], [300, 300], [430, 270], [300, 240]];
    polygon(svg, [tip, ...base.slice(0, 3)], 'explorer-axis');
    polygon(svg, [[300, 50], [300 - 130 * fraction, 50 + 220 * fraction], [300, 50 + 250 * fraction], [300 + 130 * fraction, 50 + 220 * fraction]]);
    line(svg, 300, 50, 300, 300, 'explorer-secondary');
    text(svg, 312, 50 + depth / height * 250, `water depth ${fmt(depth)}`, 'start');
    const baseArea = 36;
    const volume = baseArea * depth ** 3 / (3 * height ** 2);
    const wetArea = 36 * Math.sqrt(1 + (height / 3) ** 2) * fraction ** 2;
    return [
      ['Water depth', `${fmt(depth)} of ${height} units`],
      ['Liquid volume', `${fmt(volume)} cubic units`],
      ['Wetted wall area', `${fmt(wetArea)} square units`],
      ['Scaling', `linear scale ${fmt(fraction)}`],
    ];
  }
  const base = [[190, 258], [410, 258], [365, 290], [145, 290]];
  const apex = [300, 55];
  polygon(svg, [apex, base[0], base[1]]);
  polygon(svg, [apex, base[1], base[2], base[3]], 'explorer-secondary');
  line(svg, apex[0], apex[1], 300, 275, 'explorer-highlight');
  const h = Number(values.height);
  const side = 4;
  const slant = Math.hypot(h, side / 2);
  return [
    ['Base side', `${side} units`],
    ['Vertical height', `${fmt(h)} units`],
    ['Face slant height', `${fmt(slant)} units`],
    ['Volume', `${fmt(side ** 2 * h / 3)} cubic units`],
    ['Lateral area', `${fmt(2 * side * slant)} square units`],
  ];
}

function drawCone(svg, values, lessonId, mode) {
  const edge = Number(values.edge ?? 6);
  const radius = lessonId === 'cone-03' ? edge / 2 : Number(values.radius);
  const height = lessonId === 'cone-03' ? edge : Number(values.height);
  if (lessonId === 'cone-03') {
    const scale = 20;
    const origin = [VIEW.cx - edge * 13, VIEW.cy + edge * 10];
    const x = [edge * scale, 0];
    const y = [edge * scale * 0.45, -edge * scale * 0.35];
    const z = [0, -edge * scale];
    const add = (...vectors) => [
      origin[0] + vectors.reduce((sum, vector) => sum + vector[0], 0),
      origin[1] + vectors.reduce((sum, vector) => sum + vector[1], 0),
    ];
    const corners = [
      origin, add(x), add(x, y), add(y),
      add(z), add(x, z), add(x, y, z), add(y, z),
    ];
    for (const [from, to] of [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]) {
      line(svg, ...corners[from], ...corners[to], 'explorer-outline');
    }
    const baseCenter = [
      corners.slice(0, 4).reduce((sum, corner) => sum + corner[0], 0) / 4,
      corners.slice(0, 4).reduce((sum, corner) => sum + corner[1], 0) / 4,
    ];
    const apex = [
      corners.slice(4).reduce((sum, corner) => sum + corner[0], 0) / 4,
      corners.slice(4).reduce((sum, corner) => sum + corner[1], 0) / 4,
    ];
    const rx = edge * 10;
    const ry = edge * 2.5;
    svg.append(svgNode('ellipse', {
      cx: baseCenter[0],
      cy: baseCenter[1],
      rx,
      ry,
      class: 'explorer-highlight',
    }));
    line(svg, apex[0], apex[1], baseCenter[0] - rx, baseCenter[1], 'explorer-highlight');
    line(svg, apex[0], apex[1], baseCenter[0] + rx, baseCenter[1], 'explorer-highlight');
    circle(svg, ...apex, 4);
    text(svg, apex[0], apex[1] - 12, 'apex', 'middle');
    return [
      ['Cube edge', `${fmt(edge)} units`],
      ['Base radius', `${fmt(radius)} units`],
      ['Cone height', `${fmt(height)} units`],
      ['Apex placement', 'center of the opposite face'],
      ['Slant height', `${fmt(Math.hypot(radius, height))} units`],
      ['Volume', `${fmt(Math.PI * radius ** 2 * height / 3)} cubic units`],
    ];
  }
  if (mode === 'net' && lessonId !== 'cone-03') {
    const slant = Math.hypot(radius, height);
    const arc = 2 * Math.PI * radius;
    const angle = arc / slant * 180 / Math.PI;
      const sector = svgNode('path', { d: `M 300 180 L ${300 + slant * 18} 180 A ${slant * 18} ${slant * 18} 0 0 1 ${300 + slant * 18 * Math.cos(angle * Math.PI / 180)} ${180 + slant * 18 * Math.sin(angle * Math.PI / 180)} Z`, class: 'explorer-shape' });
    svg.append(sector, svgNode('circle', { cx: 150, cy: 180, r: radius * 24, class: 'explorer-secondary' }));
    return [
      ['Slant height', `${fmt(slant)} units`],
      ['Sector arc', `${fmt(arc)} units`],
      ['Base circumference', `${fmt(2 * Math.PI * radius)} units`],
      ['Sector angle', `${fmt(angle)}°`],
    ];
  }
  const apex = [300, 55];
  const left = [175, 275];
  const right = [425, 275];
  svg.append(
    svgNode('path', { d: `M ${apex[0]} ${apex[1]} L ${left[0]} ${left[1]} Q 300 325 ${right[0]} ${right[1]} Z`, class: 'explorer-shape' }),
    svgNode('path', { d: `M ${left[0]} ${left[1]} Q 300 325 ${right[0]} ${right[1]}`, class: 'explorer-secondary' }),
  );
  line(svg, 300, 55, 300, 275, 'explorer-secondary');
  const slant = Math.hypot(radius, height);
  return [
    ['Radius', `${fmt(radius)} units`],
    ['Vertical height', `${fmt(height)} units`],
    ['Slant height', `${fmt(slant)} units`],
    ['Volume', `${fmt(Math.PI * radius ** 2 * height / 3)} cubic units`],
    ['Exact total area', `${fmt(Math.PI * radius * (radius + slant))} square units`],
  ];
}

function drawSphere(svg, values, lessonId, mode) {
  const radius = lessonId === 'sph-03' ? 5 : Number(values.radius ?? 5);
  if (lessonId === 'sph-02') {
    const height = Number(values.zone);
    const half = height / 2;
    const capSectionRadius = Math.sqrt(Math.max(0, radius ** 2 - (radius - height) ** 2));
    const sectionRadius = mode === 'cap'
      ? capSectionRadius
      : Math.sqrt(Math.max(0, radius ** 2 - half ** 2));
    const cutOffset = mode === 'cap'
      ? (height / radius - 1) * 118
      : half / radius * 118;
    svg.append(svgNode('circle', { cx: VIEW.cx, cy: VIEW.cy, r: 118, class: 'explorer-shape' }));
    if (mode === 'cap') {
      svg.append(svgNode('ellipse', { cx: VIEW.cx, cy: VIEW.cy + cutOffset, rx: 118 * sectionRadius / radius, ry: 20 * sectionRadius / radius, class: 'explorer-secondary' }));
    } else {
      svg.append(
        svgNode('ellipse', { cx: VIEW.cx, cy: VIEW.cy - cutOffset, rx: 118 * sectionRadius / radius, ry: 20 * sectionRadius / radius, class: 'explorer-secondary' }),
        svgNode('ellipse', { cx: VIEW.cx, cy: VIEW.cy + cutOffset, rx: 118 * sectionRadius / radius, ry: 20 * sectionRadius / radius, class: 'explorer-secondary' }),
      );
    }
    if (mode === 'cap') {
      const capY = VIEW.cy + cutOffset;
      line(svg, VIEW.cx - 118 * sectionRadius / radius, capY, VIEW.cx + 118 * sectionRadius / radius, capY, 'explorer-highlight');
    } else {
      line(svg, VIEW.cx - 118 * sectionRadius / radius, VIEW.cy - cutOffset, VIEW.cx + 118 * sectionRadius / radius, VIEW.cy - cutOffset, 'explorer-highlight');
      line(svg, VIEW.cx - 118 * sectionRadius / radius, VIEW.cy + cutOffset, VIEW.cx + 118 * sectionRadius / radius, VIEW.cy + cutOffset, 'explorer-highlight');
    }
    const zoneArea = 2 * Math.PI * radius * height;
    const segmentVolume = Math.PI * height * (radius ** 2 - height ** 2 / 12);
    const boundary = zoneArea + 2 * Math.PI * sectionRadius ** 2;
    if (mode === 'cap') {
      return [
        ['Cap height', `${fmt(height)} units`],
        ['Cut radius', `${fmt(sectionRadius)} units`],
        ['Curved cap area', `${fmt(zoneArea)} square units`],
        ['Cap volume', `${fmt(Math.PI * height ** 2 * (3 * radius - height) / 3)} cubic units`],
        ['Boundary with disk', `${fmt(zoneArea + Math.PI * sectionRadius ** 2)} square units`],
      ];
    }
    if (mode === 'zone') {
      return [
        ['Zone height', `${fmt(height)} units`],
        ['Section radius', `${fmt(sectionRadius)} units`],
        ['Curved zone area', `${fmt(zoneArea)} square units`],
        ['Band volume', `${fmt(segmentVolume)} cubic units`],
      ];
    }
    return [
      ['Zone height', `${fmt(height)} units`],
      ['Section radius', `${fmt(sectionRadius)} units`],
      ['Curved zone area', `${fmt(zoneArea)} square units`],
      ['Band volume', `${fmt(segmentVolume)} cubic units`],
      ['Zone plus two disks', `${fmt(boundary)} square units`],
    ];
  }
  if (lessonId === 'sph-03') {
    const depth = Number(values.depth);
    const sectionRadius = Math.sqrt(Math.max(0, 2 * radius * depth - depth ** 2));
    const volume = Math.PI * depth ** 2 * (3 * radius - depth) / 3;
    const curved = 2 * Math.PI * radius * depth;
    const disk = Math.PI * sectionRadius ** 2;
    svg.append(
      svgNode('path', { d: 'M 180 85 A 120 120 0 0 1 420 85 Z', class: 'explorer-shape' }),
      svgNode('ellipse', { cx: 300, cy: 205 - depth / radius * 120, rx: 105 * sectionRadius / radius, ry: 18 * sectionRadius / radius, class: 'explorer-secondary' }),
    );
    return [
      ['Water depth', `${fmt(depth)} of ${radius} units`],
      ['Liquid volume', `${fmt(volume)} cubic units`],
      ['Wetted curved wall', `${fmt(curved)} square units`],
      ['Water-surface disk', `${fmt(disk)} square units`],
      ['Segment boundary', `${fmt(curved + disk)} square units`],
    ];
  }
  const r = radius;
  const diagramRadius = r * 23;
  svg.append(svgNode('circle', { cx: VIEW.cx, cy: VIEW.cy, r: diagramRadius, class: 'explorer-shape' }));
  svg.append(svgNode('ellipse', { cx: VIEW.cx, cy: VIEW.cy, rx: diagramRadius, ry: diagramRadius * 0.26, class: 'explorer-secondary' }));
  line(svg, VIEW.cx, VIEW.cy, VIEW.cx + diagramRadius, VIEW.cy, 'explorer-highlight');
  if (mode === 'shell') {
    svg.append(svgNode('circle', { cx: VIEW.cx, cy: VIEW.cy, r: diagramRadius * 0.75, class: 'explorer-secondary' }));
  }
  return [
    ['Radius', `${fmt(r)} units`],
    ['Surface area', `${fmt(4 * Math.PI * r ** 2)} square units`],
    ['Volume', `${fmt(4 * Math.PI * r ** 3 / 3)} cubic units`],
    ...(mode === 'shell'
      ? [['Shell material volume', `${fmt(4 * Math.PI * r ** 3 * (1 - 0.75 ** 3) / 3)} cubic units`]]
      : []),
  ];
}

function configuration(lesson) {
  const base = {
    'plane-figures-polygons': {
      params: [{ key: 'sides', label: 'Number of sides', min: 3, max: 12, step: 1, value: 6, unit: 'sides' }],
      modes: [],
    },
    triangles: {
      params: [{ key: 'angle', label: 'Included angle', min: 20, max: 160, step: 1, value: 60, unit: '°' }],
      modes: lesson.id === 'tri-02'
        ? [{ key: 'segment', label: 'Show special segment', value: 'altitude', options: [['altitude', 'Altitude'], ['median', 'Median'], ['angle-bisector', 'Angle bisector']] }]
        : [],
    },
    quadrilaterals: {
      params: [{ key: lesson.id === 'quad-02' ? 'width' : lesson.id === 'quad-04' ? 'top' : 'angle', label: lesson.id === 'quad-02' ? 'Rectangle length' : lesson.id === 'quad-04' ? 'Top base' : 'Included angle', min: lesson.id === 'quad-04' ? 1 : lesson.id === 'quad-02' ? 2 : 20, max: lesson.id === 'quad-04' ? 6 : lesson.id === 'quad-02' ? 8 : 160, step: lesson.id === 'quad-02' || lesson.id === 'quad-04' ? 0.1 : 1, value: lesson.id === 'quad-04' ? 4 : lesson.id === 'quad-02' ? 6 : 60, unit: lesson.id === 'quad-02' || lesson.id === 'quad-04' ? 'units' : '°' }],
      modes: [],
    },
    'cartesian-coordinates': {
      params: lesson.id === 'cart-03'
        ? [{ key: 't', label: 'Division parameter t', min: 0.1, max: 0.9, step: 0.01, value: 0.5, unit: '' }]
        : [
          { key: 'x', label: 'Point B x-coordinate', min: -5, max: 5, step: 1, value: 4, unit: '' },
          { key: 'y', label: 'Point B y-coordinate', min: -5, max: 5, step: 1, value: 3, unit: '' },
        ],
      modes: [],
    },
    lines: {
      params: [{ key: 'slope', label: 'Slope', min: -3, max: 3, step: 0.1, value: 1, unit: '' }],
      modes: [
        { key: 'line', label: 'Line type', value: 'slanted', options: [['slanted', 'Slanted line'], ['horizontal', 'Horizontal line'], ['vertical', 'Vertical line']] },
        ...(lesson.id === 'line-02' ? [{ key: 'convention', label: 'Angle convention', value: 'smaller', options: [['smaller', 'Smaller angle'], ['directed', 'Directed angle']] }] : []),
      ],
    },
    circles: {
      params: lesson.id === 'circ-01'
        ? [{ key: 'eccentricity', label: 'Eccentricity e', min: 0.2, max: 1.5, step: 0.1, value: 0.8, unit: '' }]
        : lesson.id === 'circ-03'
          ? [
            { key: 'radius', label: 'Radius', min: 1, max: 5, step: 0.1, value: 3, unit: 'units' },
            { key: 'angle', label: 'Tangent point angle', min: 0, max: 360, step: 1, value: 35, unit: '°' },
          ]
          : [{ key: 'radius', label: 'Radius', min: 1, max: 5, step: 0.1, value: 3, unit: 'units' }],
      modes: [],
    },
    parabolas: {
      params: [{ key: 'p', label: 'Parameter p', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'units' }],
      modes: [{ key: 'orientation', label: 'Opening direction', value: 'up', options: [['up', 'Up'], ['down', 'Down'], ['right', 'Right'], ['left', 'Left']] }],
    },
    ellipses: {
      params: [{ key: 'b', label: 'Other semiaxis b', min: 1, max: 4, step: 0.1, value: 2.5, unit: 'units' }],
      modes: [{ key: 'orientation', label: 'Major-axis direction', value: 'horizontal', options: [['horizontal', 'Horizontal'], ['vertical', 'Vertical']] }],
    },
    hyperbolas: {
      params: [{ key: 'b', label: 'Conjugate semiaxis b', min: 1, max: 4, step: 0.1, value: 2, unit: 'units' }],
      modes: [{ key: 'orientation', label: 'Transverse-axis direction', value: 'horizontal', options: [['horizontal', 'Horizontal'], ['vertical', 'Vertical']] }],
    },
    prisms: {
      params: [{ key: 'height', label: 'Perpendicular height', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' }],
      modes: [
        { key: 'prism', label: 'Prism type', value: 'right', options: [['right', 'Right prism'], ['oblique', 'Oblique prism']] },
        { key: 'view', label: 'View', value: 'solid', options: [['solid', 'Solid'], ['net', 'Triangular-prism net']] },
      ],
    },
    'parallelepipeds-cubes': {
      params: [
        { key: 'length', label: 'Length', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' },
        { key: 'width', label: 'Width', min: 1, max: 8, step: 0.1, value: 3, unit: 'units' },
        { key: 'height', label: 'Height', min: 1, max: 8, step: 0.1, value: 2, unit: 'units' },
      ],
      modes: [{ key: 'diagonal', label: 'Highlighted diagonal', value: 'space', options: [['face', 'Face diagonal'], ['space', 'Space diagonal']] }],
    },
    cylinders: {
      params: lesson.id === 'cyl-02'
        ? [
          { key: 'outer', label: 'Outer radius', min: 1.1, max: 3, step: 0.1, value: 2, unit: 'units' },
          { key: 'height', label: 'Pipe length', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' },
        ]
        : lesson.id === 'cyl-03'
          ? [{ key: 'height', label: 'Cylinder length', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' }]
          : [
            { key: 'radius', label: 'Radius', min: 1, max: 4, step: 0.1, value: 2, unit: 'units' },
            { key: 'height', label: 'Height', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' },
          ],
      modes: [],
    },
    pyramids: {
      params: lesson.id === 'pyr-03'
        ? [{ key: 'depth', label: 'Water depth', min: 0.2, max: 6, step: 0.1, value: 3, unit: 'units' }]
        : [{ key: 'height', label: 'Vertical height', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' }],
      modes: [],
    },
    cones: {
      params: lesson.id === 'cone-03'
        ? [{ key: 'edge', label: 'Cube edge', min: 3, max: 8, step: 0.1, value: 6, unit: 'units' }]
        : [
          { key: 'radius', label: 'Base radius', min: 1, max: 4, step: 0.1, value: 2, unit: 'units' },
          { key: 'height', label: 'Vertical height', min: 1, max: 8, step: 0.1, value: 5, unit: 'units' },
        ],
      modes: lesson.id === 'cone-03' ? [] : [{ key: 'view', label: 'View', value: 'solid', options: [['solid', 'Solid and axial section'], ['net', 'Sector net']] }],
    },
    'spheres-segments': {
      params: lesson.id === 'sph-02'
        ? [{ key: 'zone', label: 'Band height', min: 0.5, max: 9.5, step: 0.1, value: 4, unit: 'units' }]
        : lesson.id === 'sph-03'
          ? [{ key: 'depth', label: 'Water depth', min: 0.2, max: 5, step: 0.1, value: 2, unit: 'units' }]
          : [{ key: 'radius', label: 'Sphere radius', min: 1, max: 5, step: 0.1, value: 3, unit: 'units' }],
      modes: lesson.id === 'sph-01'
        ? [{ key: 'shell', label: 'View', value: 'solid', options: [['solid', 'Solid sphere'], ['shell', 'Shell cross-section']] }]
        : lesson.id === 'sph-02'
          ? [{ key: 'surface', label: 'View', value: 'zone', options: [['zone', 'Curved zone'], ['segment', 'Solid band segment'], ['cap', 'One-base cap']] }]
          : [],
    },
  };
  return base[lesson.moduleId];
}

function drawModel(svg, lesson, values, modes) {
  switch (lesson.moduleId) {
    case 'plane-figures-polygons':
      return drawPolygon(svg, values);
    case 'triangles':
      return drawTriangle(svg, values, modes.segment);
    case 'quadrilaterals':
      return drawQuadrilateral(svg, values, lesson.id);
    case 'cartesian-coordinates':
      return drawCoordinates(svg, values, lesson.id);
    case 'lines':
      return drawLineModel(svg, values, modes, lesson.id);
    case 'circles':
      return drawCircle(svg, values, lesson.id);
    case 'parabolas':
      return drawParabola(svg, values, modes.orientation);
    case 'ellipses':
      return drawEllipse(svg, values, modes.orientation);
    case 'hyperbolas':
      return drawHyperbola(svg, values, modes.orientation);
    case 'prisms':
      return drawPrism(svg, values, modes.prism, modes.view);
    case 'parallelepipeds-cubes':
      return drawBox(svg, values, modes.diagonal);
    case 'cylinders':
      return drawCylinder(svg, values, lesson.id);
    case 'pyramids':
      return drawPyramid(svg, values, lesson.id);
    case 'cones':
      return drawCone(svg, values, lesson.id, modes.view);
    case 'spheres-segments':
      return drawSphere(svg, values, lesson.id, modes.shell ?? modes.surface);
    default:
      throw new Error(`No interactive model is configured for "${lesson.moduleId}".`);
  }
}

export function mountCourseExplorer(lesson) {
  const layout = document.querySelector('#course-explorer-layout');
  document.querySelector('#course-explorer-instruction').textContent =
    'Change a control to update the figure and its measurements.';
  const config = configuration(lesson);
  if (!config) throw new Error(`No controls are configured for "${lesson.moduleId}".`);

  const controls = document.createElement('div');
  controls.className = 'course-explorer-controls';
  const figure = freshSvg(`${lesson.title} interactive model`, 'The diagram and computed values respond to the controls.');
  const values = Object.fromEntries(config.params.map(({ key, value }) => [key, value]));
  const modes = Object.fromEntries(config.modes.map(({ key, value }) => [key, value]));
  const bindings = [];
  const modeBindings = [];

  for (const spec of config.params) {
    const group = document.createElement('div');
    const label = document.createElement('label');
    const title = document.createElement('span');
    title.textContent = spec.label;
    const output = document.createElement('output');
    output.textContent = `${spec.value}${spec.unit ? ` ${spec.unit}` : ''}`;
    label.append(title, output);
    const range = document.createElement('input');
    range.type = 'range';
    range.min = String(spec.min);
    range.max = String(spec.max);
    range.step = String(spec.step);
    range.value = String(spec.value);
    range.setAttribute('aria-label', spec.label);
    const number = document.createElement('input');
    number.type = 'number';
    number.min = String(spec.min);
    number.max = String(spec.max);
    number.step = String(spec.step);
    number.value = String(spec.value);
    number.setAttribute('aria-label', `${spec.label} numeric entry`);
    const inputRow = document.createElement('div');
    inputRow.className = 'course-explorer-input-row';
    inputRow.append(range, number);
    group.append(label, inputRow);
    controls.append(group);
    bindings.push({ spec, range, number, output });
  }

  for (const spec of config.modes) {
    const label = document.createElement('label');
    label.textContent = spec.label;
    const select = document.createElement('select');
    select.setAttribute('aria-label', spec.label);
    for (const [value, name] of spec.options) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = name;
      option.selected = value === spec.value;
      select.append(option);
    }
    label.append(select);
    controls.append(label);
    modeBindings.push({ spec, select });
  }

  const actions = document.createElement('div');
  actions.className = 'course-explorer-actions';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.textContent = 'Reset model';
  actions.append(reset);
  const status = document.createElement('p');
  status.className = 'course-explorer-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  actions.append(status);
  controls.append(actions);

  const results = document.createElement('dl');
  results.className = 'course-explorer-results';
  const summary = document.createElement('p');
  summary.className = 'course-explorer-readout';
  const figureColumn = document.createElement('div');
  figureColumn.className = 'course-explorer-figure';
  figureColumn.append(figure);
  layout.replaceChildren(figureColumn, controls, results, summary);

  function draw() {
    for (const { spec, select } of modeBindings) modes[spec.key] = select.value;
    for (const { spec, range, number, output } of bindings) {
      const value = Number(range.value);
      number.value = range.value;
      values[spec.key] = value;
      output.textContent = `${fmt(value, spec.step < 0.1 ? 2 : 1)}${spec.unit ? ` ${spec.unit}` : ''}`;
      if (spec.key === 'slope') {
        range.disabled = modes.line === 'horizontal' || modes.line === 'vertical';
        number.disabled = range.disabled;
      }
    }
    const titleNode = figure.querySelector('title');
    const descNode = figure.querySelector('desc');
    const title = titleNode.textContent;
    figure.replaceChildren(titleNode, descNode);
    const entries = drawModel(figure, lesson, values, modes);
    const textSummary = entries.map(([name, value]) => `${name}: ${value}`).join('. ');
    descNode.textContent = textSummary;
    results.replaceChildren(...entries.map(([name, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const result = document.createElement('dd');
      term.textContent = name;
      result.textContent = value;
      row.append(term, result);
      return row;
    }));
    summary.textContent = textSummary;
    if (titleNode.textContent !== title) titleNode.textContent = title;
    status.hidden = true;
  }

  for (const binding of bindings) {
    binding.range.addEventListener('input', draw);
    binding.number.addEventListener('input', () => {
      const value = Number(binding.number.value);
      if (!Number.isFinite(value) || value < binding.spec.min || value > binding.spec.max) {
        status.textContent = `Enter a value from ${binding.spec.min} to ${binding.spec.max} ${binding.spec.unit}.`;
        status.hidden = false;
        binding.number.setAttribute('aria-invalid', 'true');
        return;
      }
      binding.number.removeAttribute('aria-invalid');
      binding.range.value = String(value);
      draw();
    });
  }
  for (const { select } of modeBindings) select.addEventListener('change', draw);
  reset.addEventListener('click', () => {
    for (const { spec, range, number } of bindings) {
      range.value = String(spec.value);
      number.value = String(spec.value);
      number.removeAttribute('aria-invalid');
    }
    for (const { spec, select } of modeBindings) select.value = spec.value;
    draw();
  });
  draw();
}
