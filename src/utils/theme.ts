/**
 * Theme utilities: Tailwind includes a dark variant that lets you style your site differently when dark mode is enabled.
 * Logic for the 'manual selector' dark mode strategy (read: Tailwind docs for elaborated info.).
 * 1. toggleDarkMode: Switches the current theme and persists the choice.
 * 2. initTheme: Synchronizes the UI with the user's saved preferences or OS setting. (Saves to localStorage).
 * Note: Dark theme can be driven by a CSS with this: @custom-variant dark (&:where(.dark, .dark *));
 * Note: Html script: On page load or when changing themes, best to add inline in `head` to avoid FOUC (Flash of Unstyled Content).
 */

export function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.theme = isDark ? 'dark' : 'light';
  return isDark;
}

export function initTheme() {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
