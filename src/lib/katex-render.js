import katex from 'katex';

export function renderMath(latex, displayMode = false) {
  return katex.renderToString(latex, {
    displayMode,
    output: 'htmlAndMathml',
    throwOnError: true,
    trust: false,
  });
}

const MATH_PATTERN = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;

function renderMathSegment(part) {
  if (part.startsWith('$$') && part.endsWith('$$')) {
    return renderMath(part.slice(2, -2), true);
  }
  if (part.startsWith('$') && part.endsWith('$')) {
    return renderMath(part.slice(1, -1));
  }
  return null;
}

function appendMathHtml(container, html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  container.append(template.content);
}

export function appendInlineMath(container, text) {
  for (const part of String(text).split(MATH_PATTERN)) {
    let html = null;
    try {
      html = renderMathSegment(part);
    } catch {
      // Malformed source stays readable instead of breaking the lesson.
    }
    if (html) appendMathHtml(container, html);
    else container.append(document.createTextNode(part));
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Render mixed text and `$…$` / `$$…$$` math to an HTML string for no-JS HTML. */
export function renderMathText(text) {
  return String(text).split(MATH_PATTERN).map((part) => {
    let html = null;
    try {
      html = renderMathSegment(part);
    } catch {
      // Fall through to escaped source text.
    }
    return html ?? escapeHtml(part);
  }).join('');
}

/** Strip math delimiters for plain-text uses such as meta descriptions. */
export function stripMathDelimiters(text) {
  return String(text)
    .replace(/\$\$([^$]+)\$\$/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
