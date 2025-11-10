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

  /*const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };*/
  const finalHeaders: Record<string, string> = {};

  if (body) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (apiKey) {
    finalHeaders['X-Noroff-API-Key'] = apiKey;
  }

  if (accessToken) {
    finalHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method: customOptions.method || (body ? 'POST' : 'GET'),
    ...customOptions,
    headers: {
      ...finalHeaders,
      ...customOptions.headers,
    } as HeadersInit,
    signal: signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + '/' + endpoint, config);
    console.log('sending API request:', {
      url: BASE_URL + '/' + endpoint,
      method: config.method,
      headers: config.headers
    });

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
  const endpoint = 'social/posts?_author=true&_comments=true&_reactions=true&_profile=true&_followers=true&_following=true&cache_buster=v1';

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
  
    let fullProfileData = profileData;

    try {
      const fetchedProfile = await getProfile(profileData.name);

      fullProfileData = fetchedProfile;
    } catch (error) {
      console.warn('Could not fetch full profile data after login. Proceeding with basic login data.', error);
    }

    const finalLoginResponse: LoginResponse = {
    accessToken: accessToken,
    profile: fullProfileData,
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
    throw new Error("Registration failed: Invalid response structure or missing data.");
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

export const getProfile = async (name: string, extraParams: string = ''): Promise<Profile> => {
  const baseParams = '_posts=true&_followers=true&_following=true&_author=true';
  const finalParams = extraParams ? `${baseParams}&${extraParams}` : baseParams;
  const endpoint = `social/profiles/${name}?${finalParams}`;
  
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
  const endpoint = `social/posts/${id}?_author=true&_comments=true&_reactions=true&_profile=true&_followers=true&_following=true`;
  
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

/**
 * Deletes a social media post by ID.
 * Requires Authentication and Authorization (user must own the post).
 * @param {string} id - The ID of the post to delete.
 * @returns {Promise<void>} Resolves on 204 No Content success.
 */

export const deletePost = async (id: string): Promise<void> => {
  const endpoint = `social/posts/${id}`;

  const response = await del(endpoint);

  if (response === null) {
   return;
  }
};

/**
 * Adds reactions to an existing social media post by ID.
 * @param {string} id - The ID of the post.
 * @param {string} symbol - The reaction symbol (e.g., '🎉', '🤩').
 * @returns {Promise<void>} Resolves on success (API returns 200 or 204).
 */

export const addReaction = async (id: string, symbol: string): Promise<void> => {
  const endpoint = `social/posts/${id}/react/${symbol}`;

  const response = await put(endpoint, null);

  if (!response) {
    throw new Error(`Failed to add reaction ${symbol} to post ${id}.`);
  }

};



/**
 * Adds a comment to a specific post.
 * @param {string} id - The ID of the post to comment on.
 * @param {string} body - The comment content.
 * @returns {Promise<void>} Resolves on success.
 */

export const postComment = async (id: string, body: string): Promise<void> => {
  const endpoint = `social/posts/${id}/comment`;

  const response = await post(endpoint, { body });

  if (!response) {
    throw new Error(`Failed to post comment on post ${id}.`);
  }
};

/**
 * Follows a user by their profile name.
 * @param {string} name - The username of the profile to follow.
 * @returns {Promise<any>}
 */
export const followProfile = async (name: string): Promise<any> => {
  const endpoint = `social/profiles/${name}/follow`;
  return apiClient(endpoint, { method: 'PUT'});
};

/**
 * Unfollows a user by their profile name.
 * @param {string} name - The username of the profile to unfollow.
 * @returns {Promise<any>}
 */
export const unfollowProfile = async (name: string): Promise<any> => {
  const endpoint = `social/profiles/${name}/unfollow`;
  return apiClient(endpoint, { method: 'PUT'});
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
