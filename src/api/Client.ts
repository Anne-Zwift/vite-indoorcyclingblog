/**
 * Central API wrapper
 */
import { BASE_URL, STORAGE_KEY_API_KEY } from "../utils/constants";
import { getAccessToken } from "../utils/authUtils";
import type { ApiResponse, ApiOptions  } from "../types/Api";
import type { PostDetails } from "../types/Post";
import type { Profile } from "../types/Profile";

/**
 * Generic API client function that handles the core logic of making an API call.
 * @template T The expected type of response data (e.g., PostDetails[]).
 * @param {string} endpoint - The API endpoint path (.g., 'social/posts'). 
 * @param {ApiOptions} [options= {}] - Custom fetch options (method, body, custom headers) 
 * @returns {Promise<ApiResponse<T> | null>} A promise that resolves with the wrapped API response data, or null for 204 No content response.
 * @throws {Error} If the HTTP response status is outside the 200-299 range (e.g., 401, 500).
 */

async function apiClient<T> (
  endpoint: string, 
  options: ApiOptions = {},
): Promise<ApiResponse<T> | null> {
  
  const { body, ...customOptions } = options;

  const accessToken = getAccessToken();
  const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-Noroff-API-KEY'] = apiKey;
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method: customOptions.method || (body ? 'POST' : 'GET'),
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    } as HeadersInit,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + '/' + endpoint, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || `HTTP error! Status: ${response.status}`);
  };

  if (response.status === 204) {
    return null;
  }

  return await response.json();

} catch (error) {
  console.error('API Client Error:', error);
  throw error;
  }
}

//Export helper methods
export const get = <T>(endpoint: string): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint);
export const del = <T>(endpoint: string): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { method: 'DELETE' });

export const post = <T, D = unknown>(endpoint: string, body?: D): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { method: 'POST', body });

export const put = <T, D = unknown>(endpoint: string, body?: D): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { method: 'PUT', body });


//integrates with Task 1E (Integrate Fetching on Post Feed).
/**
 * Fetches the list of all available social media posts.
 * This function automatically includes query parameters to fetch the author, comments, and reactions.
 * @returns {Promise<PostDetails[]>} A promise that resolves with an array of unwrapped PostDetails objects.
 * @throws {Error} Generates any API or network errors from the base client.
 */
export const getPosts = async (): Promise<PostDetails[]> => {
  const endpoint = '/social/posts?_author=true&_comments=true&_reactions=true';

  const response = await get<PostDetails[]>(endpoint);// error handling

  return response?.data || [];
};

export interface LoginResponse {
  accessToken: string;
  profile: Profile;
}

/**
 * Sends credentials to the login endpoint.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<LoginResponse>} A promise that resolves with the access token and profile.
 */

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const endpoint = 'auth/login';

  const body = {
    email,
    password,
  };

  const response = await post<LoginResponse>(endpoint, body);

  if (!response || !response.data) {
    throw new Error("Login failed: Invalid credentials.");
  }
  return response.data;
}

/*export interface LoginResponse {
  accessToken: string;
  profile: Profile;
}*/

/**
 * Sends credentials to the register endpoint.
 * @param {string} name - User's name.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<LoginResponse>} A promise that resolves with the access token and profile.
 */

export const register = async (name: string, email: string, password: string): Promise<LoginResponse> => {
  const endpoint = 'auth/register';

  const body = {
    name,
    email,
    password,
  };

  const response = await post<LoginResponse>(endpoint, body);

  if (!response || !response.data) {
    throw new Error("Registration failed: Invalid credentials.");
  }
  return response.data;
}

/**
 * Fetches a user's detailed profile by their unique name.
 * @param {string} name - The unique name of the profile to fetch.
 * @returns {Promise<Profile>} A promise that resolves with the unwrapped Profile object.
 */

export const getProfile = async (name: string): Promise<Profile> => {
  const endpoint = `social/profiles/${name}?_posts=true&_followers=true&_following=true`;
  
  const response = await get<Profile>(endpoint);

  if (!response || !response.data) {
    throw new Error(`Profile ${name} not found or failed to load.`);
  }
  return response.data;
}

/**
 * Fetches the list of posts made by a specific profile name.
 * @param {string} name - The unique name of the profile whose posts to fetch.
 * @returns {Promise<PostDetails[]>} A promise that resolves with an array of unwrapped PostDetails objects.
 */

export const getPostsByProfile = async (name: string): Promise<PostDetails[]> => {
  const endpoint = `social/profiles/${name}/posts?_author=true&_comments=true&_reactions=true`;
  
  const response = await get<PostDetails[]>(endpoint);

  return response?.data || [];
};

//Placeholder for later

/**
 * Search for profiles by query string.
 * @param {string} query - The search term (e.g., a name or email part).
 * @returns {Promise<Profile[]>} A promise that resolves with an array of matching Profile objects.
 */

/*export const getSearchProfiles = async (query: string): Promise<Profile[]> => {
  const endpoint = `/social/profiles/search?q=${encodeURIComponent(query)}`;

  const response = await get<Profile[]>(endpoint);

  return response?.data || [];
};*/
