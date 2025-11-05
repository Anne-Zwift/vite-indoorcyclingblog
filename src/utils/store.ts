import type { UserProfileData } from "../types/Profile";
import { getAccessToken, clearAccessToken, setAccessToken, saveProfile, clearProfile, getProfile } from "./authUtils";
import { MINIMAL_PROFILE_STUB } from "./profileDefaults";

const hasToken = !!getAccessToken();

const loadUserProfile = (): UserProfileData | null => {
  if (hasToken) {
    return getProfile();
  }
  return null;
}

export const state = { 
  isLoggedIn: hasToken, 
  userProfile: loadUserProfile(), 
  router: null as any,//for the router
}

export function login(token: string, profile: UserProfileData): void {
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

/**
 * Updates the userProfile's 'following' array after a successful follow/unfollow API call.
 * @param {string} profileName - The name of the profile that was followed/unfollowed.
 * @param {boolean} isFollowing - True if the action was 'follow', false if 'unfollow'.
 * @param {UserProfileData} [profileData] - Optional profile data for the user being followed.
 */

export function updateFollowingStatus(profileName: string, isFollowing: boolean, profileData?: UserProfileData): void {
  if (!state.userProfile) {
    console.error('Cannot update following status: user is not logged in.');
    return;
  }

  if (!state.userProfile.following) {
    state.userProfile.following = [];
  }

  if (isFollowing) {
    if (!state.userProfile.following.some(f => f.name === profileName)) {

      const minimalProfile: UserProfileData = {
        ...MINIMAL_PROFILE_STUB, name: profileName,
      };

      const newFollow: UserProfileData = profileData || minimalProfile;
      state.userProfile.following.push(newFollow);
    }
  } else {
    state.userProfile.following = state.userProfile.following.filter(f => f.name !== profileName);
  }

  subscribers.forEach(callback => callback());
}