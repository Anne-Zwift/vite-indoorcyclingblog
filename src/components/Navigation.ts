import { state, logout, subscribe } from "../utils/store";
import { navigate} from '../utils/router';


/**
 * Creates the main navigation bar
 * This component handles navigation clicks using the router exposed via the store.
 * @returns {HTMLElement} The navigation container element.
 */

const createNavElement = (): HTMLElement => {
  const navigation = document.createElement('nav');
  navigation.className = 'main-navigation';

  //const profileName = state.userProfile?.name;

  const allLinks = [
  { name: 'Home', path: '/', requiresLogin: true },
  { name: 'Create Post', path: '/create', requiresLogin: true },
  { name: 'Profile', path: '/profile', requiresLogin: true },
  { name: 'Logout', path: '/logout', requiresLogin: true },

  { name: 'Login', path: '/login', requiresLogin: false },
  { name: 'Register', path: '/register', requiresLogin: false },
];

const linksToShow = allLinks.filter(link => {

  if (state.isLoggedIn) {
    return link.requiresLogin === true;
  
  }

  return link.requiresLogin === false;

});

linksToShow.forEach(linkNav => {
  const link = document.createElement('a');
  link.href = `#${linkNav.path}`;
  link.textContent = linkNav.name;

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