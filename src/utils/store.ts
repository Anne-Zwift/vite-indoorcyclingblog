import type { Profile } from "../types/Profile";
import { getAccessToken, clearAccessToken, setAccessToken } from "./authUtils";
//router import

const hasToken = !!getAccessToken();

export const state = { 
  isLoggedIn: hasToken, 
  userProfile: null as Profile | null, 
  router: null as any,//for the router
}

export function login(token: string, profile: Profile): void {
  if (!token || !profile || !profile.email) {
    console.error("Login failed: Invalid token or profile data received.");
    return;
  }

  setAccessToken(token);
  state.isLoggedIn = true;
  state.userProfile = profile;

  if (state.router) {
    state.router.navigate('/profile')
  }
}

export function logout(): void {
  clearAccessToken();
  state.isLoggedIn = false;
  state.userProfile = null;

  if (state.router) {
    state.router.navigate('/login')
  }
}

export function setRouter(routerInstance: any): void {
  state.router = routerInstance;
}