import { createPost } from "../api/Client";
import { navigate } from "./router";
import { showTempMessage } from "./message";
import type { PostRequest, SinglePostResponse } from "../types/Post";

/**
 * Type for the raw data received from the PostForm component.
 */

export type PostFormInputData = {
  title: string;
  body?: string;
  tags?: string[];
  mediaUrl?: string;
  mediaAlt?: string;
};

/**
 * Creates the final PostRequest object from raw data, handling media formatting.
 * @param formData - Raw data object from PostForm.
 * @returns The structured PostRequest object ready for the API.
 */

const transformFormDataToPostRequest = (formData: PostFormInputData): PostRequest => {
  const postData: PostRequest = {
    title: formData.title,
    body: formData.body,
    tags: formData.tags,
  };

  if (formData.mediaUrl) {
    const url = formData.mediaUrl.trim();
    if (url) {
      postData.media = {
        url: url,
        alt: formData.mediaAlt?.trim() || formData.title,
      };
    }
  }
  return postData;
} 


/**
 * Handles the complete process of creating a new post: transforms data, calls the API, shows a message, and navigates.
 * @param formData - Raw data object from PostForm.
 * @returns A promise that resolves when the creation and navigation are complete.
 */

export const handlePostCreation = async (formData: PostFormInputData): Promise<void> => {
  const postData = transformFormDataToPostRequest(formData);

  try {
    const newPostResponse: SinglePostResponse = await createPost(postData);

    showTempMessage(document.body, 'Post created successfully!', false);

    navigate(`/post/${newPostResponse.data.id}`);
  } catch (error) {
    console.error('Post creation failed:', error);
    showTempMessage(document.body, 'Failed to create post. Please check the console', true);
    throw error;
  }
};
