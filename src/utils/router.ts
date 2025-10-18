import { state } from './store.ts'
import { LoginPage } from '../pages/LoginPage.ts';
import { PostFeed } from '../pages/PostFeed.ts';
import { PostPage } from '../pages/PostPage.ts';
import { ProfilePage } from '../pages/ProfilePage.ts';
import { RegisterPage } from '../pages/RegisterPage.ts';

export interface Route {
  component: (param?: string) => HTMLDivElement;
  protected: boolean;
}

export const routes: { [Key: string]: Route } = {
  '/': { component: PostFeed, protected: false },
  '/login': { component: LoginPage, protected: false },
  '/register': { component: RegisterPage, protected: false },
  '/post/:id': { component: PostPage, protected: false },
  '/profile': { component: ProfilePage, protected: true },
} as const;

const navigate = (path: string) => {
  window.location.hash = path;
};

let contentElement: HTMLDivElement;

export interface Route {
  component: (param?: string) => HTMLDivElement;
  protected: boolean;
}

const resolveRoute = () => {
  const hashPath = '/' + window.location.hash.slice(1).toLocaleLowerCase() || '/';
  
  let matchedRoute: Route | undefined;
  let routeParam: string | undefined;

  for (const routePath in routes) {
    const pattern = new RegExp(`^${routePath.replace(/:\w+/g, '([\\w-]+)')}$`);
    const match = hashPath.match(pattern);

    if (match) {
      matchedRoute = routes[routePath];
      routeParam = match.length > 1 ? match[1] : undefined;
      break;
    }
  }

  let currentRoute = matchedRoute;

  if (!currentRoute) {
    currentRoute = routes['/'];
    routeParam = undefined;
  }  

  if (currentRoute.protected && !state.isLoggedIn) {
    return navigate('/login');
  }

  if (currentRoute && contentElement) {
    contentElement.innerHTML = '';
    contentElement.appendChild(currentRoute.component(routeParam));
  }
};

export const initRouter = (rootElement: HTMLDivElement) => {
  contentElement = rootElement;

  window.addEventListener('hashchange', resolveRoute);

  resolveRoute();

  return {
    navigate: (path: string) => navigate(path.startsWith('/') ? path : '/' + path),
  };
};