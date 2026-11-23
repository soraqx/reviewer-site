import katex from 'katex';

export function renderMath(latex, displayMode = false) {
  return katex.renderToString(latex, {
    displayMode,
    output: 'htmlAndMathml',
    throwOnError: true,
    trust: false,
  });
}

export function appendInlineMath(container, text) {
  const parts = text.split(/(\$[^$]+\$)/g);

  for (const part of parts) {
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = document.createElement('span');
      math.innerHTML = renderMath(part.slice(1, -1));
      container.append(math);
    } else {
      container.append(document.createTextNode(part));
    }
  }
}
