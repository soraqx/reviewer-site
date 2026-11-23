const svgNamespace = 'http://www.w3.org/2000/svg';

function svgElement(name, attributes = {}) {
  const element = document.createElementNS(svgNamespace, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}

function drawLine(svg, x1, y1, x2, y2, className = 'explorer-axis') {
  svg.append(svgElement('line', { x1, y1, x2, y2, class: className }));
}

function drawText(svg, x, y, text, anchor = 'middle') {
  const label = svgElement('text', { x, y, class: 'explorer-label', 'text-anchor': anchor });
  label.textContent = text;
  svg.append(label);
}

function number(value, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

function configureRange({ range, label, output, config }) {
  label.textContent = config.label;
  range.min = String(config.min);
  range.max = String(config.max);
  range.step = String(config.step);
  range.value = String(config.value);
  output.value = String(config.value);
  output.textContent = String(config.value);
}

function clearDiagram(svg) {
  const title = svg.querySelector('title').cloneNode(true);
  const description = svg.querySelector('desc').cloneNode(true);
  svg.replaceChildren(title, description);
}

function drawTriangle(svg, angleDegrees, isQuadrilateral) {
  const angle = angleDegrees * Math.PI / 180;
  if (isQuadrilateral) {
    const side = { x: 90 * Math.cos(angle), y: -90 * Math.sin(angle) };
    const points = [
      [150, 220],
      [410, 220],
      [410 + side.x, 220 + side.y],
      [150 + side.x, 220 + side.y],
    ];
    svg.append(svgElement('polygon', {
      points: points.map((point) => point.join(',')).join(' '),
      class: 'explorer-shape',
    }));
    drawLine(svg, 150, 220, 150, 220 + side.y, 'explorer-secondary');
    drawText(svg, 280, 253, 'base = 6 units');
    drawText(svg, 280, 114, `angle = ${number(angleDegrees, 0)}°`);
    return `For a parallelogram with base 6 and side 2, area = 12 sin(${number(angleDegrees, 0)}°) = ${number(12 * Math.sin(angle))} square units.`;
  }

  const basePixels = 260;
  const sidePixels = 180;
  const apex = { x: 150 + sidePixels * Math.cos(angle), y: 220 - sidePixels * Math.sin(angle) };
  svg.append(svgElement('polygon', {
    points: `150,220 ${150 + basePixels},220 ${apex.x},${apex.y}`,
    class: 'explorer-shape',
  }));
  drawLine(svg, 150, 220, apex.x, apex.y, 'explorer-secondary');
  const baseUnits = 6;
  const sideUnits = 4;
  const area = 0.5 * baseUnits * sideUnits * Math.sin(angle);
  const thirdSide = Math.hypot(baseUnits - sideUnits * Math.cos(angle), sideUnits * Math.sin(angle));
  drawText(svg, 280, 253, `included angle = ${number(angleDegrees, 0)}°`);
  return `With adjacent sides 6 and 4 units, area = ${number(area)} square units and the third side is ${number(thirdSide)} units.`;
}

function drawCoordinateModel(svg, xValue, isLineLesson) {
  const origin = { x: 280, y: 148 };
  const scale = 23;
  drawLine(svg, 45, origin.y, 515, origin.y);
  drawLine(svg, origin.x, 25, origin.x, 270);

  if (isLineLesson) {
    const slope = xValue;
    const intercept = 4;
    const xMin = -5;
    const xMax = 5;
    const yMin = (origin.y - 270) / scale;
    const yMax = (origin.y - 25) / scale;
    const candidates = [
      { x: xMin, y: slope * xMin + intercept },
      { x: xMax, y: slope * xMax + intercept },
      ...(slope === 0 ? [] : [
        { x: (yMin - intercept) / slope, y: yMin },
        { x: (yMax - intercept) / slope, y: yMax },
      ]),
    ].filter(({ x, y }) => x >= xMin && x <= xMax && y >= yMin && y <= yMax)
      .sort((a, b) => a.x - b.x);
    const first = candidates[0];
    const last = candidates[candidates.length - 1];
    if (first && last) {
      drawLine(
        svg,
        origin.x + first.x * scale,
        origin.y - first.y * scale,
        origin.x + last.x * scale,
        origin.y - last.y * scale,
        'explorer-shape',
      );
    }
    drawLine(svg, origin.x - 5 * scale, origin.y - 2 * scale, origin.x + 5 * scale, origin.y - 2 * scale, 'explorer-secondary');
    drawText(svg, 280, 285, `slope m = ${number(slope)}`);
    return `The brick line has slope ${number(slope)} and crosses the y-axis at 4. The dashed comparison line is horizontal, with slope 0.`;
  }

  const a = { x: -3, y: -2 };
  const b = { x: xValue, y: 3 };
  const px = (point) => origin.x + point.x * scale;
  const py = (point) => origin.y - point.y * scale;
  drawLine(svg, px(a), py(a), px(b), py(b), 'explorer-shape');
  svg.append(
    svgElement('circle', { cx: px(a), cy: py(a), r: 4, class: 'explorer-shape' }),
    svgElement('circle', { cx: px(b), cy: py(b), r: 4, class: 'explorer-shape' }),
  );
  drawText(svg, px(a), py(a) + 18, 'A (−3, −2)');
  drawText(svg, px(b), py(b) - 10, `B (${number(xValue, 0)}, 3)`);
  const dx = xValue + 3;
  const dy = 5;
  const distance = Math.hypot(dx, dy);
  const slope = dx === 0 ? 'undefined' : number(dy / dx);
  return `Δx = ${number(dx)}, Δy = 5, distance = ${number(distance)} units, midpoint = (${number((xValue - 3) / 2)}, 0.5), slope = ${slope}.`;
}

function drawConic(svg, moduleId, parameter) {
  const origin = { x: 280, y: 150 };
  const scale = 28;
  drawLine(svg, 35, origin.y, 525, origin.y);
  drawLine(svg, origin.x, 20, origin.x, 280);
  const x = (value) => origin.x + value * scale;
  const y = (value) => origin.y - value * scale;

  if (moduleId === 'circles') {
    const radius = parameter;
    svg.append(svgElement('circle', { cx: origin.x, cy: origin.y, r: radius * scale, class: 'explorer-shape' }));
    svg.append(svgElement('circle', { cx: origin.x, cy: origin.y, r: 3, class: 'explorer-shape' }));
    drawLine(svg, origin.x, origin.y, x(radius), origin.y, 'explorer-secondary');
    drawText(svg, x(radius), origin.y - 10, `r = ${number(radius)}`);
    return `Circle: x² + y² = ${number(radius * radius)}. Circumference = ${number(2 * Math.PI * radius)} units; area = ${number(Math.PI * radius * radius)} square units.`;
  }

  if (moduleId === 'parabolas') {
    const p = parameter;
    const points = [];
    for (let t = -3; t <= 3.001; t += 0.1) points.push(`${x(t)},${y((t * t) / (4 * p))}`);
    svg.append(svgElement('polyline', { points: points.join(' '), class: 'explorer-shape', fill: 'none' }));
    drawLine(svg, x(-4), y(-p), x(4), y(-p), 'explorer-secondary');
    svg.append(svgElement('circle', { cx: origin.x, cy: y(p), r: 4, class: 'explorer-shape' }));
    drawText(svg, origin.x + 16, y(p) - 8, 'focus');
    return `Vertical parabola x² = ${number(4 * p)}y. Vertex (0, 0), focus (0, ${number(p)}), directrix y = −${number(p)}.`;
  }

  if (moduleId === 'ellipses') {
    const a = 4;
    const b = Math.min(parameter, a - 0.1);
    const c = Math.sqrt(a * a - b * b);
    svg.append(svgElement('ellipse', { cx: origin.x, cy: origin.y, rx: a * scale, ry: b * scale, class: 'explorer-shape' }));
    svg.append(
      svgElement('circle', { cx: x(-c), cy: origin.y, r: 4, class: 'explorer-shape' }),
      svgElement('circle', { cx: x(c), cy: origin.y, r: 4, class: 'explorer-shape' }),
    );
    return `Ellipse x²/16 + y²/${number(b * b)} = 1. Its foci are ${number(c)} units from the center, and the sum of focal distances is 2a = 8 units.`;
  }

  const a = 2.5;
  const b = parameter;
  const upperLeft = [];
  const upperRight = [];
  for (let t = -1; t <= 1.001; t += 0.05) {
    const branchX = a * Math.cosh(t);
    const branchY = b * Math.sinh(t);
    upperLeft.push(`${x(-branchX)},${y(branchY)}`);
    upperRight.push(`${x(branchX)},${y(branchY)}`);
  }
  svg.append(
    svgElement('polyline', { points: upperLeft.join(' '), class: 'explorer-shape', fill: 'none' }),
    svgElement('polyline', { points: upperRight.join(' '), class: 'explorer-shape', fill: 'none' }),
  );
  const focus = Math.hypot(a, b);
  drawLine(svg, x(-3), y((-b / a) * -3), x(3), y((b / a) * 3), 'explorer-secondary');
  drawLine(svg, x(-3), y((b / a) * -3), x(3), y((-b / a) * 3), 'explorer-secondary');
  return `Horizontal hyperbola x²/6.25 − y²/${number(b * b)} = 1. The focal distance is ${number(focus)} units; each point has an absolute focal-distance difference of 5 units.`;
}

function drawSolid(svg, moduleId, value, lessonId) {
  const height = value;
  if (moduleId === 'spheres-segments') {
    const radius = height;
    const sphereRadius = 13 * radius;
    svg.append(
      svgElement('circle', { cx: 280, cy: 150, r: sphereRadius, class: 'explorer-shape' }),
      svgElement('ellipse', { cx: 280, cy: 150, rx: sphereRadius, ry: Math.max(12, sphereRadius * 0.3), class: 'explorer-secondary' }),
    );
    drawText(svg, 280, 285, `radius = ${number(radius)} units`);
    return `Sphere surface area = ${number(4 * Math.PI * radius * radius)} square units; volume = ${number(4 * Math.PI * radius ** 3 / 3)} cubic units.`;
  }

  if (moduleId === 'cylinders') {
    const top = 70;
    const bottom = top + height * 18;
    if (lessonId === 'cyl-02') {
      svg.append(
        svgElement('ellipse', { cx: 280, cy: top, rx: 56, ry: 18, class: 'explorer-shape' }),
        svgElement('path', { d: `M 224 ${top} V ${bottom} A 56 18 0 0 0 336 ${bottom} V ${top} M 252 ${top} V ${bottom} A 28 9 0 0 0 308 ${bottom} V ${top}`, class: 'explorer-shape', fill: 'none' }),
        svgElement('ellipse', { cx: 280, cy: top, rx: 28, ry: 9, class: 'explorer-secondary' }),
        svgElement('ellipse', { cx: 280, cy: bottom, rx: 56, ry: 18, class: 'explorer-secondary' }),
        svgElement('ellipse', { cx: 280, cy: bottom, rx: 28, ry: 9, class: 'explorer-secondary' }),
      );
      return `Hollow pipe with outer radius 2, inner radius 1, and length ${number(height)}. Material volume = ${number(3 * Math.PI * height)} cubic units; total surface area = ${number(6 * Math.PI * (height + 1))} square units.`;
    }
    if (lessonId === 'cyl-03') {
      svg.append(
        svgElement('ellipse', { cx: 280, cy: top, rx: 70, ry: 24, class: 'explorer-shape' }),
        svgElement('path', { d: `M 210 ${top} V ${bottom} M 350 ${top} V ${bottom}`, class: 'explorer-shape', fill: 'none' }),
        svgElement('ellipse', { cx: 280, cy: bottom, rx: 70, ry: 24, class: 'explorer-secondary' }),
      );
      return `Elliptic cylinder with semiaxes 3 and 2 and length ${number(height)}. Volume = 6π(${number(height)}) = ${number(6 * Math.PI * height)} cubic units.`;
    }
    const rx = 56;
    const ry = 18;
    svg.append(
      svgElement('ellipse', { cx: 280, cy: top, rx, ry, class: 'explorer-shape' }),
      svgElement('path', { d: `M ${280 - rx} ${top} V ${bottom} A ${rx} ${ry} 0 0 0 ${280 + rx} ${bottom} V ${top}`, class: 'explorer-shape', fill: 'none' }),
      svgElement('ellipse', { cx: 280, cy: bottom, rx, ry, class: 'explorer-secondary' }),
    );
    return `Right circular cylinder, radius 2 and height ${number(height)}. Volume = ${number(4 * Math.PI * height)} cubic units; curved area = ${number(4 * Math.PI * height)} square units.`;
  }

  const baseArea = moduleId === 'cones' ? Math.PI * 4 : 12;
  const top = 55;
  const bottom = 55 + Math.min(height, 10) * 18;
  if (moduleId === 'cones' || moduleId === 'pyramids') {
    svg.append(
      svgElement('path', { d: `M 280 ${top} L 190 ${bottom} Q 280 ${bottom + 30} 370 ${bottom} Z`, class: 'explorer-shape' }),
      svgElement('path', { d: `M 190 ${bottom} Q 280 ${bottom + 30} 370 ${bottom}`, class: 'explorer-secondary' }),
    );
  } else {
    svg.append(
      svgElement('polygon', { points: `195,${top} 365,${top} 420,${top + 35} 250,${top + 35}`, class: 'explorer-secondary' }),
      svgElement('polygon', { points: `195,${top} 250,${top + 35} 250,${bottom + 35} 195,${bottom}`, class: 'explorer-shape' }),
      svgElement('polygon', { points: `250,${top + 35} 420,${top + 35} 420,${bottom + 35} 250,${bottom + 35}`, class: 'explorer-shape' }),
    );
  }
  drawLine(svg, 280, top, 280, bottom, 'explorer-secondary');
  drawText(svg, 294, (top + bottom) / 2, `h = ${number(height)}`, 'start');
  const volume = baseArea * height / ((moduleId === 'cones' || moduleId === 'pyramids') ? 3 : 1);
  return `Perpendicular height = ${number(height)} units. Using base area ${number(baseArea)} square units, volume = ${number(volume)} cubic units. The sketch is schematic; measurements come from the formula, not perspective.`;
}

export function mountCourseExplorer(lesson) {
  const range = document.querySelector('#course-explorer-range');
  const label = document.querySelector('#course-explorer-label');
  const output = document.querySelector('#course-explorer-output');
  const svg = document.querySelector('#course-explorer-diagram');
  const readout = document.querySelector('#course-explorer-readout');
  const description = svg.querySelector('desc');
  const { moduleId } = lesson;

  const config = ['triangles', 'quadrilaterals'].includes(moduleId)
    ? { label: 'Included angle', min: 20, max: 160, step: 1, value: 60 }
    : moduleId === 'cartesian-coordinates'
      ? { label: 'Point B horizontal coordinate', min: -5, max: 5, step: 1, value: 4 }
      : moduleId === 'lines'
        ? { label: 'First line slope', min: -3, max: 3, step: 0.1, value: 1 }
        : moduleId === 'circles'
          ? { label: 'Radius', min: 1, max: 5, step: 0.1, value: 3 }
          : moduleId === 'parabolas'
            ? { label: 'Parameter p', min: 0.5, max: 4, step: 0.1, value: 2 }
            : moduleId === 'ellipses'
              ? { label: 'Minor semiaxis b', min: 1, max: 3.9, step: 0.1, value: 2.5 }
              : moduleId === 'hyperbolas'
                ? { label: 'Conjugate semiaxis b', min: 1, max: 4, step: 0.1, value: 2 }
                : moduleId === 'spheres-segments'
                  ? { label: 'Sphere radius', min: 1, max: 5, step: 0.1, value: 3 }
                  : moduleId === 'cylinders'
                    ? { label: lesson.id === 'cyl-01' ? 'Cylinder height' : 'Cylinder length', min: 1, max: 10, step: 0.1, value: 5 }
                    : { label: 'Perpendicular height', min: 1, max: 10, step: 0.1, value: 5 };
  configureRange({ range, label, output, config });
  description.textContent = `${lesson.title}. A schematic SVG model and text readout update with the slider.`;
  document.querySelector('#course-explorer-instruction').textContent =
    'Move the control to change one parameter. The diagram and computed result update together.';

  function draw() {
    const value = Number(range.value);
    output.value = String(value);
    output.textContent = number(value);
    clearDiagram(svg);
    const result = ['triangles', 'quadrilaterals'].includes(moduleId)
      ? drawTriangle(svg, value, moduleId === 'quadrilaterals')
      : ['cartesian-coordinates', 'lines'].includes(moduleId)
        ? drawCoordinateModel(svg, value, moduleId === 'lines')
        : ['circles', 'parabolas', 'ellipses', 'hyperbolas'].includes(moduleId)
          ? drawConic(svg, moduleId, value)
          : drawSolid(svg, moduleId, value, lesson.id);
    readout.textContent = result;
    description.textContent = result;
  }

  range.addEventListener('input', draw);
  draw();
}
