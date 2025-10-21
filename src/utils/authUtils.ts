import type { Profile } from "../types/Profile";
import { STORAGE_KEY_PROFILE } from "./constants";

const TOKEN_KEY = 'STORAGE_KEY_ACCESS_TOKEN';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Saves the user's profile object to localStorage as JSON string.
 * @param {Profile} profile - The user's profile object from the API response.
 */

export function saveProfile(profile: Profile): void {
  try {
    const profileJson = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY_PROFILE, profileJson);
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
  }
}

/**
 * Retrieves the user's profile object from localStorage.
 * @returns {Profile | null} The user's profile object, or null if not found/invalid.
 */

export function getProfile(): Profile | null {
  const profileJson = localStorage.getItem(STORAGE_KEY_PROFILE);

  if(!profileJson) {
    return null;
  }
  try {
    return JSON.parse(profileJson) as Profile;
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