/**
 * Central API wrapper
 */
import { BASE_URL, NOROFF_API_KEY_ENDPOINT } from "../utils/constants";
import { getAccessToken, getApiKey, setAccessToken, setApiKey } from "../utils/authUtils";
import type { ApiResponse, ApiOptions  } from "../types/Api";
import type { PostDetails, PostRequest, SinglePostResponse } from "../types/Post";
import type { Profile } from "../types/Profile";
import type { LoginResponse } from "../types/Login";
import type { ApiKeyResponse } from "../types/ApiKey";


export const createApiKey = async (): Promise<string> => {
  const response = await post<ApiKeyResponse['data']>(NOROFF_API_KEY_ENDPOINT, {});

  if (!response || !response.data || !response.data.key) {
    throw new Error("Failed to create API Key.");
  }

  return response.data.key;
};

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
  
  const { body, signal, ...customOptions } = options;

  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['X-Noroff-API-Key'] = apiKey;
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
    signal: signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + '/' + endpoint, config);

    if (!response.ok) {
    let errorData: any;

      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText || ''}`);
      }
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
export const get = <T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { signal });
export const del = <T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { method: 'DELETE', signal });

export const post = <T, D = unknown>(endpoint: string, body?: D, signal?: AbortSignal): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { method: 'POST', body, signal });

export const put = <T, D = unknown>(endpoint: string, body?: D, signal?: AbortSignal): Promise<ApiResponse<T> | null> => apiClient<T>(endpoint, { method: 'PUT', body, signal });


//integrates with Task 1E (Integrate Fetching on Post Feed).
/**
 * Fetches the list of all available social media posts.
 * This function automatically includes query parameters to fetch the author, comments, and reactions.
 * @returns {Promise<PostDetails[]>} A promise that resolves with an array of unwrapped PostDetails objects.
 * @throws {Error} Generates any API or network errors from the base client.
 */
export const getPosts = async (signal?: AbortSignal): Promise<PostDetails[]> => {
  const endpoint = 'social/posts?_author=true&_comments=true&_reactions=true';

  const response = await get<PostDetails[]>(endpoint, signal);// error handling

  return response?.data || [];
};


/**
 * Sends credentials to the login endpoint.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<LoginResponse>} A promise that resolves with the access token and profile.
 */

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const endpoint = 'auth/login';
  const body = { email, password };

  console.log('Sending credentials:', { email, password });
    
  const response = await post<Profile>(endpoint, body);
  console.log('Received response:', response);

  if (!response || !response.data) {
    throw new Error("Login failed: Profile or token missing in successful API response.");
  }

  const { accessToken, ...profileData } = response.data as Profile;

  if (!accessToken) {
    throw new Error("Login failed: Missing accessToken in API response.");
  }
  
  setAccessToken(accessToken);

  try {
   const apiKey = await createApiKey();
   setApiKey(apiKey);
  } catch (e) {
    console.warn("Could not generate API Key. Subsequent API calls will fail.");
  }
 

  const finalLoginResponse: LoginResponse = {
    accessToken: accessToken,
    profile: profileData,
  };

  return finalLoginResponse;
  

};

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

  const response = await post<Profile>(endpoint, body);

  if (!response || !response.data) {
    throw new Error("Registration failed: Invalid credentials.");
  }

  const { accessToken, ...profileData } = response.data as Profile;

  if (!accessToken) {
    throw new Error("Registration failed: Missing accessToken in API response.");
  }

  const finalLoginResponse: LoginResponse = {
    accessToken: accessToken,
    profile: profileData,
  };

  return finalLoginResponse;
};

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

export const getPostDetails = async (id: string, signal?: AbortSignal): Promise<PostDetails> => {
  const endpoint = `social/posts/${id}?_author=true&_comments=true&_reactions=true`;
  
  const response = await get<PostDetails>(endpoint, signal);

  if (!response || !response.data) {
    throw new Error(`Post with ID ${id} not found or failed to load.`);
  }

  return response.data;
};

/**
 * Creates a new social media post.
 * @param {object} postData - The data for the new post (title, body, media).
 * @returns {Promise<PostDetails>} The newly created post.
 */

export const createPost = async (postData: PostRequest): Promise<SinglePostResponse> => {
  const endpoint = 'social/posts';

  const response = await post<PostDetails, PostRequest>(endpoint, postData);

  if (!response) {
    throw new Error("Failed to create post. Received no content.");
  }
  return response as SinglePostResponse;
};

/**
 * Updates an existing social media post by ID.
 * Requires Authentication and Authorization (user must own the post).
 * @param {string} id - The ID of the post to update.
 * @param {PostRequest} postData - The data for the updated post (title, body, media).
 * @returns {Promise<PostDetails>} The updated post object.
 */

export const updatePost = async (id: string, postData: PostRequest): Promise<SinglePostResponse> => {
  const endpoint = `social/posts/${id}`;

  const response = await put<PostDetails, PostRequest>(endpoint, postData);

  if (!response) {
    throw new Error(`Failed to update post ${id}. Received no content.`);
  }
  return response as SinglePostResponse;
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
};

export const getSearchPosts = async (query: string): Promise<PostDetails[]> => {
const endpoint = `/social/posts/search?q=${encodeURIComponent(query)}&_author=true`;
const response = await get<PostDetails[]>(endpoint);
return response?.data || [];
};
*/
