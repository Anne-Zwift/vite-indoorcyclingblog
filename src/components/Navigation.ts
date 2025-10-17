import { state, logout, subscribe } from "../utils/store";


/**
 * Creates the main navigation bar
 * This component handles navigation clicks using the router exposed via the store.
 * @returns {HTMLElement} The navigation container element.
 */

const createNavElement = (): HTMLElement => {
  const navigation = document.createElement('nav');
  navigation.className = 'main-navigation';

  const allLinks = [
  { name: 'Home', path: '/', requiresLogin: false },
  { name: 'Profile', path: '/profile', requiresLogin: true },
  { name: 'Logout', path: '/logout', requiresLogin: true},
  { name: 'Login', path: '/login', requiresLogin: false },
  { name: 'Register', path: '/register', requiresLogin: false },
];

const linksToShow = allLinks.filter(link => {
  if (link.path === '/') {
    return true;
  }

  if (link.requiresLogin) {
    return state.isLoggedIn;
  }

  return !state.isLoggedIn;
});

linksToShow.forEach(linkNav => {
  const link = document.createElement('a');
  link.href = `#${linkNav.path}`;
  link.textContent = linkNav.name;

    link.addEventListener('click', (event) => {
    event.preventDefault();

  if (linkNav.path === '/logout') {
    logout();
  } else {
    if (state.router && state.router.navigate) {
      state.router.navigate(linkNav.path);
    }
  }

  });

  navigation.appendChild(link);
});

return navigation;
}

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