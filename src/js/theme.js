const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
const themeIcon   = document.getElementById('theme-icon');

const themeIconUrlDark  = '/assets/images/theme-dark.webp';
const themeIconUrlLight = '/assets/images/theme-light.webp';

let theme = 'light dark';

loadTheme();

/**
 * Przełącza motyw.
 */
function switchTheme() {
  if(theme === 'light') {
    theme = 'dark';
  } else if(theme === 'dark') {
    theme = 'light';
  } else if (theme === 'light dark' && darkModeMql && darkModeMql.matches) {
    // dark mode → light mode
    theme = 'light';
  } else {
    // light mode → dark mode
    theme = 'dark';
  }
  saveTheme();
  switchThemeIcon();
  document.documentElement.style.setProperty("color-scheme", theme);
}

/**
 * Wczytuje i ustawia zapisany motyw z `localStorage`.
 */
function loadTheme() {
  let loadedTheme = localStorage.getItem('theme');
  if(loadedTheme !== 'dark' && loadedTheme !== 'light' && loadedTheme !== 'light dark') {
    theme = 'light dark';
    saveTheme();
  } else {
    theme = loadedTheme;
  }
  switchThemeIcon();
  document.documentElement.style.setProperty("color-scheme", theme);
}

/**
 * Zapisuje aktualny motyw do `localStorage`.
 */
function saveTheme() {
  localStorage.setItem('theme', theme);
}

/**
 * Przełącza ikonę motywu.
 */
function switchThemeIcon() {
  if(theme === 'light') {
    themeIcon.src = themeIconUrlLight;
  } else if(theme === 'dark') {
    themeIcon.src = themeIconUrlDark;
  } else if (theme === 'light dark' && darkModeMql && darkModeMql.matches) {
    themeIcon.src = themeIconUrlDark;
  } else {
    themeIcon.src = themeIconUrlLight;
  }
}
