export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function createSvgElement(tagName, attributes = {}, text = '') {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  if (text) element.textContent = text;
  return element;
}

export function formatSvgPoints(points) {
  return points.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}

export function addSvgLine(svg, start, end, className) {
  const line = createSvgElement('line', {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
    class: className,
  });
  svg.append(line);
  return line;
}

export function addSvgText(svg, x, y, text, className, anchor = 'middle') {
  const label = createSvgElement(
    'text',
    { x, y, class: className, 'text-anchor': anchor },
    text,
  );
  svg.append(label);
  return label;
}
