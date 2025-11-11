import { state, subscribe } from './store.ts'
import { LoginPage } from '../pages/LoginPage.ts';
import { PostFeed } from '../pages/PostFeed.ts';
import { PostPage } from '../pages/PostPage.ts';
import { ProfilePage } from '../pages/ProfilePage.ts';
import { RegisterPage } from '../pages/RegisterPage.ts';
import { PostCreatePage } from '../pages/PostCreatePage.ts';
import { PostEditPage } from '../pages/PostEditPage.ts';
import { ProfileView } from '../components/ProfileView.ts';

export interface Route {
  component: (param?: string) => HTMLDivElement | Promise<HTMLElement>;
  protected: boolean;
}

export const routes: { [Key: string]: Route } = {
  '/': { component: PostFeed, protected: true },
  '/login': { component: LoginPage, protected: false },
  '/register': { component: RegisterPage, protected: false },
  '/post/edit/:id': { component: PostEditPage, protected: true },
  '/post/:id': { component: PostPage, protected: false },
  '/profile': { component: ProfilePage, protected: true },
  '/create': { component: PostCreatePage, protected: true},
  '/profile/:name': { component: ProfileView, protected: true},


} as const;

export const navigate = (path: string) => {
  const hashPath = path.startsWith('/') ? path.substring(1) : path;
  window.location.hash = hashPath;
};

let contentElement: HTMLDivElement;

export interface routerInstance {
  navigate: (path: string) => void;
}

const resolveRoute = async () => {
  const hashPath = '/' + window.location.hash.slice(1).toLocaleLowerCase() || '/';
  
  let matchedRoute: Route | undefined;
  let routeParam: string | undefined;

  const postMatch = hashPath.match(/^\/post\/([\w-]+)$/i);
    if (postMatch) {
      matchedRoute = routes['/post/:id'];
      routeParam = postMatch[1];
    }
    else if (hashPath.match(/^\/post\/edit\/([\w-]+)$/i)) {
      matchedRoute = routes['/post/edit/:id'];
      routeParam = hashPath.match(/^\/post\/edit\/([\w-]+)$/i)![1];
    }
    else if (hashPath.match(/^\/profile\/([\w-]+)$/i)) {
      matchedRoute = routes['/profile/:name'];
      routeParam = hashPath.match(/^\/profile\/([\w-]+)$/i)![1];
    }
    else if (routes[hashPath]) {
      matchedRoute = routes[hashPath];
      routeParam = undefined;
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
    const renderComponent = await currentRoute.component(routeParam);

    contentElement.appendChild(renderComponent);
  }
};

export const initRouter = async (rootElement: HTMLDivElement): Promise<routerInstance> => {
  contentElement = rootElement;

  window.addEventListener('hashchange', resolveRoute);
  subscribe(resolveRoute);
  await resolveRoute();

  return {
    navigate: navigate,
  };
};