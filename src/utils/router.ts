import { state } from './store.ts'
import { LoginPage } from '../pages/LoginPage.ts';
import { PostFeed } from '../pages/PostFeed.ts';
import { PostPage } from '../pages/PostPage.ts';
import { ProfilePage } from '../pages/ProfilePage.ts';
import { RegisterPage } from '../pages/RegisterPage.ts';

export interface Route {
  component: () => HTMLDivElement;
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

const resolveRoute = () => {
  const hashPath = '/' + window.location.hash.slice(1).toLocaleLowerCase() || '';
  let currentRoute: Route | undefined = routes[hashPath];

  if (!currentRoute) {
    currentRoute = routes['/'];
  }  

  if (currentRoute?.protected && !state.isLoggedIn) {
    return navigate('/login');
  }

  if (currentRoute && contentElement) {
    contentElement.innerHTML = '';
    contentElement.appendChild(currentRoute.component());
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