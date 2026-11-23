export function updateScrollableRegion(element, label) {
  if (element.scrollWidth > element.clientWidth + 1) {
    element.tabIndex = 0;
    element.setAttribute('role', 'region');
    element.setAttribute('aria-label', label);
    return;
  }

  element.removeAttribute('tabindex');
  element.removeAttribute('role');
  element.removeAttribute('aria-label');
}
