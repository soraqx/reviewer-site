export function setupHashTabs(root) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];

  function activate(tab, updateHash = false) {
    for (const candidate of tabs) {
      const selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      document.getElementById(candidate.getAttribute('aria-controls')).hidden = !selected;
    }

    if (updateHash) {
      const panelId = tab.getAttribute('aria-controls');
      const slug = panelId.replace(/^panel-/, '');
      window.history.replaceState(null, '', `#shape-${slug}`);
    }
  }

  function activateFromHash() {
    const match = window.location.hash.match(/^#shape-(.+)$/);
    if (!match) return;
    const tab = tabs.find(
      (candidate) => candidate.getAttribute('aria-controls') === `panel-${match[1]}`,
    );
    if (tab) activate(tab);
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => activate(tab, true));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      tabs[nextIndex].focus();
      activate(tabs[nextIndex], true);
    });
  }

  window.addEventListener('hashchange', activateFromHash);
  activateFromHash();
}
