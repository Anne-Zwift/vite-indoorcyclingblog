import { state, logout, subscribe } from '../utils/store';
import { navigate } from '../utils/router';
import { toggleDarkMode } from '../utils/theme';

/**
 * Creates the main navigation bar
 * This component handles navigation clicks using the router exposed via the store.
 * @returns {HTMLElement} The navigation container element.
 */

const createNavElement = (): HTMLElement => {
  const navigation = document.createElement('nav');
  navigation.className = 'main-navigation flex h-16 gap-x-3 p-4';

  const allLinks = [
    { name: 'Home', path: '/', requiresLogin: true },
    { name: 'Search', path: '/search', requiresLogin: true },
    { name: 'Create Post', path: '/create', requiresLogin: true },
    { name: 'Profile', path: '/profile', requiresLogin: true },
    { name: 'Logout', path: '/logout', requiresLogin: true },

    { name: 'Login', path: '/login', requiresLogin: false },
    { name: 'Register', path: '/register', requiresLogin: false },
  ];

  const linksToShow = allLinks.filter((link) => {
    if (state.isLoggedIn) {
      return link.requiresLogin === true;
    }

    return link.requiresLogin === false;
  });

  linksToShow.forEach((linkNav) => {
    const link = document.createElement('a');
    link.href = `#${linkNav.path}`;
    link.textContent = linkNav.name;

    const currentPath = window.location.hash.replace('#', '') || '/';
    const isActive = currentPath === linkNav.path;

    const baseClasses =
      'text-sm md:text-md lg:text-lg font-medium py-1.5 rounded-md transition-all duration-200 border-b-2';

    if (isActive) {
      link.className = `${baseClasses} border-2 border-sky-500 text-slate-900 dark:text-white`;
    } else {
      link.className = `${baseClasses} border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400`;
    }

    if (linkNav.name === 'Create Post') {
      link.classList.add('nav-create-button');
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();

      if (linkNav.path === '/logout') {
        logout();
        navigate('/login');
      } else {
        navigate(linkNav.path);
      }
    });

    navigation.appendChild(link);
  });

  /* Theme toggle */
  const themeButton = document.createElement('button');
  themeButton.className =
    'p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 transform active:scale-90';

  const isCurrentlyDark = document.documentElement.classList.contains('dark');
  themeButton.textContent = isCurrentlyDark ? '☀️' : '🌙';

  themeButton.addEventListener('click', () => {
    const isDarkNow = toggleDarkMode();

    themeButton.textContent = isDarkNow ? '☀️' : '🌙';

    themeButton.classList.add('rotate-180');
    setTimeout(() => themeButton.classList.remove('rotate-180'), 300);
  });
  navigation.appendChild(themeButton);
  return navigation;
};

/**
 * Creates the main navigation bar wrapper and manages its reactivity.
 * @returns {HTMLElement} The permanent wrapper element.
 */
export function createNavigation(): HTMLElement {
  const wrapper = document.createElement('nav');

  let currentNav = createNavElement();
  wrapper.appendChild(currentNav);

  subscribe(() => {
    wrapper.removeChild(currentNav);

    currentNav = createNavElement();
    wrapper.appendChild(currentNav);
  });

  return wrapper;
}
