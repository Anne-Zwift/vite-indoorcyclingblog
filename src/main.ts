import './style.css';
import { initRouter } from './utils/router';
import { createNavigation } from './components/Navigation';
import { state } from './utils/store';
import { Footer } from './components/Footer';

const contentArea = document.getElementById('content-area');
const navContainer = document.getElementById('nav-container');
const appRoot = document.body;

if (!contentArea || !navContainer) {
  console.error('FATAL: Required DOM containers (#content-area or #nav-Container) not found');
  throw new Error('Application failed to initialize.');
}

async function initializeApp(): Promise<void> {
  const routerInstance = await initRouter(contentArea as HTMLDivElement);

  state.router = routerInstance;
  console.log(routerInstance);

  const navBar = createNavigation();

  navContainer?.appendChild(navBar);

  const appFooter = Footer();
  appRoot.appendChild(appFooter);

  console.log('Application initialized. Router listening for URL hash changes.');
}

initializeApp();
