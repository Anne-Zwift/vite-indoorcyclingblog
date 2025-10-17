import { createNavigation } from "./Navigation";

/**
 * Creates the main application header.
 * This component integrates the navigation links created in the navigation module.
 * @returns {HTMLElement} The header element.
 */


export function Header(): HTMLElement {
  const header = document.createElement('header');
  header.classList.add('main-header');

  const h1 = document.createElement('h1');
  h1.textContent = 'Indoor Cycling Blog';
  header.appendChild(h1);

  h1.addEventListener('click', () => {
    window.location.hash = '/';
  });

  const navComponent = createNavigation();
  header.appendChild(navComponent);

  return header;
}



