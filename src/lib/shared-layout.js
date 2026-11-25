const headerMarkup = `
  <div class="site-header page-width">
    <a class="wordmark" href="/" aria-label="Fieldnotes home">
      Fieldnotes<span class="wordmark-period">.</span>
    </a>
    <nav class="site-nav" aria-label="Main navigation">
      <a href="/formulas/" data-nav="formulas">Formulas</a>
      <a href="/lessons/" data-nav="lessons">Lessons</a>
      <a href="/practice/" data-nav="practice">Practice</a>
      <a href="/quiz/" data-nav="quiz">Quiz</a>
    </nav>
    <button class="theme-toggle" type="button" aria-pressed="false">
      <span class="theme-toggle-label">Dark mode</span>
    </button>
  </div>
`;

const footerMarkup = `
  <div class="site-footer page-width">
    <a class="footer-wordmark" href="/">fieldnotes<span class="wordmark-period">.</span></a>
    <p>Engineering mathematics, with a little more clarity.</p>
    <span class="footer-edition">Study guide in progress</span>
  </div>
`;

function readSavedTheme(status) {
  try {
    return window.localStorage.getItem('fieldnotes-theme');
  } catch {
    status.textContent = 'Your browser could not load a saved theme preference.';
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem('fieldnotes-theme', theme);
    return true;
  } catch {
    return false;
  }
}

function setTheme(theme, button, status) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = isDark ? '#20201c' : '#f1eee3';
  button.setAttribute('aria-pressed', String(isDark));
  button.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';

  if (!saveTheme(theme)) {
    status.textContent = 'Theme changed, but your browser could not save this preference.';
  } else {
    status.textContent = `Switched to ${theme} mode.`;
  }
}

export function mountSharedLayout() {
  document.querySelector('#site-header').innerHTML = headerMarkup;
  document.querySelector('#site-footer').innerHTML = footerMarkup;
  const activeSection = window.location.pathname.split('/')[1];
  document.querySelectorAll('.site-nav [data-nav]').forEach((link) => {
    link.setAttribute('aria-current', link.dataset.nav === activeSection ? 'page' : 'false');
  });

  const toggle = document.querySelector('.theme-toggle');
  const status = document.querySelector('#theme-status');
  const savedTheme = readSavedTheme(status);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
    document.querySelector('meta[name="theme-color"]').content =
      savedTheme === 'dark' ? '#20201c' : '#f1eee3';
    toggle.setAttribute('aria-pressed', String(savedTheme === 'dark'));
    toggle.querySelector('.theme-toggle-label').textContent =
      savedTheme === 'dark' ? 'Light mode' : 'Dark mode';
  }

  toggle.addEventListener('click', () => {
    const nextTheme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme, toggle, status);
  });
}
