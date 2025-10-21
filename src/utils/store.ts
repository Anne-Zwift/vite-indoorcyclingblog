import type { Profile } from "../types/Profile";
import { getAccessToken, clearAccessToken, setAccessToken, saveProfile, clearProfile } from "./authUtils";
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
  saveProfile(profile);

  state.isLoggedIn = true;
  state.userProfile = profile;

  if (state.router) {
    state.router.navigate('/profile')
  }

  subscribers.forEach(callback => callback());
}

export function logout(): void {
  clearAccessToken();
  clearProfile();
  
  state.isLoggedIn = false;
  state.userProfile = null;

  if (state.router) {
    state.router.navigate('/login')
  }

  subscribers.forEach(callback => callback());
}

export function setRouter(routerInstance: any): void {
  state.router = routerInstance;
}

const subscribers: (() => void)[] = [];

/**
 * Registers a function to be called whenever the state changes.
 * @param {() => void} callback - the function to execute on state change.
 */
export function subscribe(callback: () => void): void {
  subscribers.push(callback);
}

