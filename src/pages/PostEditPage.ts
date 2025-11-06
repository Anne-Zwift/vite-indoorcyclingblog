import { PostForm } from "../components/PostForm";
import { getPostDetails, updatePost } from "../api/Client";
import { navigate } from "../utils/router";
import type { PostRequest } from "../types/Post";
import { showTempMessage } from "../utils/message";

/**
 * Renders the PostForm component pre-filled with existing post data for editing.
 * @param {string | undefined} id - The ID of the post to edit, extracted from the route.
 */

export function PostEditPage(id?: string): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('p-6');
  pageContainer.innerHTML = '<h2>Loading Post for Edit...</h2>';

  if (!id) {
    pageContainer.innerHTML = '<h2>Error: Post ID is missing.</h2>';
    return pageContainer;
  }

  const handleUpdate = async (postData: PostRequest) => {
    try {
      await updatePost(id, postData);
      showTempMessage(document.body, 'Post updated successfully', false);
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
      showTempMessage(document.body, 'Failed to save changes. Please check the console.', true);
      throw error;  
    }
  };

  getPostDetails(id)
  .then(post => {
    pageContainer.innerHTML = '';
    const header = document.createElement('h2');
    header.textContent = `Edit Post: ${post.title}`;

    const editForm = PostForm({
      initialData: post,
      onSubmit: handleUpdate,
      submitText: 'Save Changes'
    });

    pageContainer.append(header, editForm);
  })
  .catch(error => {
    console.error('Failed to fetch post details:', error);
    pageContainer.innerHTML = '<h2>Error: Could not load post data.</h2><p>Please check the console for details.</p>';
  });
  return pageContainer;
}