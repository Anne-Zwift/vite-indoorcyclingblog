import type { UserProfileData } from "../types/Profile";
import { STORAGE_KEY_PROFILE } from "./constants";
import { STORAGE_KEY_API_KEY } from "./constants";
import { STORAGE_KEY_ACCESS_TOKEN } from "./constants";



export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY_API_KEY, key);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
}

/**
 * Retrieves the stored API key from localStorage.
 * @returns { string | null } The API key, or null if not found.
 */

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY_API_KEY);
}

/**
 * Saves the user's profile object to localStorage as JSON string.
 * @param {UserProfileData} UserProfileData - The user's profile object from the API response.
 */

export function saveProfile(profile: UserProfileData): void {
  try {
    const profileJson = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY_PROFILE, profileJson);
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
  }
}

/**
 * Retrieves the user's profile object from localStorage.
 * @returns {UserProfileData | null} The user's profile object, or null if not found/invalid.
 */

export function getProfile(): UserProfileData | null {
  const profileJson = localStorage.getItem(STORAGE_KEY_PROFILE);

  if(!profileJson) {
    return null;
  }
  try {
    return JSON.parse(profileJson) as UserProfileData;
  } catch (error) {
    console.error('Error parsing profile from localStorage:', error);
    return null;
  }
}

/**
 * Clears the stored user profile.
 */

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY_PROFILE);
}