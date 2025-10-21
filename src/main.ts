import './style.css';
import { initRouter } from './utils/router';
import { createNavigation } from './components/Navigation';
import { state } from './utils/store';

const contentArea = document.getElementById('content-area');
const navContainer = document.getElementById('nav-container');

if (!contentArea || !navContainer) {
  console.error('FATAL: Required DOM containers (#content-area or #nav-Container) not found');
  throw new Error('Application failed to initialize.');
}

function initializeApp(): void {
  const routerInstance = initRouter(contentArea as HTMLDivElement);

  state.router = routerInstance;
  console.log(routerInstance);

  const navBar = createNavigation();

  navContainer?.appendChild(navBar);

  console.log('Application initialized. Router listening for URL hash changes.');
}

initializeApp();






















//Removed old imports and boilerplate code
//import { setupCounter } from './counter.ts'

/*document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)*/
