import { createPost, updatePost } from "../api/Client";
import type { Media } from "../types/Media";
import type { PostRequest, SinglePostResponse } from "../types/Post";
import type { PostFormProps } from "../types/PostFormProps";
import { navigate } from "../utils/router";


function processFormData(form: HTMLFormElement): PostRequest | null {
  const formData = new FormData(form);

  const title = formData.get('title') as string;
  const body = formData.get('body') as string | null;
  const tagsString = formData.get('tags') as string | null;
  const mediaUrl = formData.get('mediaUrl') as string | null;
  const mediaAlt = formData.get('mediaAlt') as string | null;

  if (!title || title.trim() === '') {
    return null;
  }

  const postData: PostRequest = {
    title: title.trim(),
  };

  if (body) {
    postData.body = body.trim();
  }

  if (tagsString) {
    postData.tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  if (mediaUrl && mediaUrl.trim() !== '') {
    postData.media = {
      url: mediaUrl.trim(),
      alt: mediaAlt?.trim() || title.trim() || 'Post media',
    } as Media;
  }

  return postData;
}

function displayStatus(element: HTMLElement, message: string, isError: boolean = false): void {
  element.textContent = message;
  element.className = 'status-message';
  element.style.display = 'block';

  if (isError) {
    element.classList.add('status-error');
  } else {
    element.classList.add('status-success');
  }
}

export function PostForm(props: PostFormProps = {}): HTMLDivElement {
  const { initialData, onSubmit, submitText } = props;

  const isEditMode = !!initialData;
  const formContainer = document.createElement('div');
  formContainer.id = isEditMode ? `edit-post-container-${initialData.id}` : 'create-post-form-container';
  formContainer.classList.add('heading');
  formContainer.textContent = 'Create a new post and make someone HAPPY🤩'

  const statusMessage = document.createElement('div');
  statusMessage.id = 'post-status-message';
  statusMessage.className = 'status-message';
  statusMessage.style.display = 'none';


  const form = document.createElement('form');
  form.id = isEditMode ? `edit-post-form-${initialData.id}` : 'create-post-form-container';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.name = 'title';
  titleInput.placeholder = 'Title (Required)';
  titleInput.required = true;
  if (isEditMode) {
    titleInput.value = initialData.title;
  }

  const bodyTextarea = document.createElement('textarea');
  bodyTextarea.name = 'body';
  bodyTextarea.placeholder = 'Body/Content (Optional)';
  if (isEditMode && initialData.body) {
    bodyTextarea.value = initialData.body;
  }

  const tagsInput = document.createElement('input');
  tagsInput.type = 'text';
  tagsInput.name = 'tags';
  tagsInput.placeholder = 'Tags (e.g., cycling, indoor)';
  if (isEditMode && initialData.tags) {
    tagsInput.value = initialData.tags.join(', ');
  }

  const mediaUrlInput = document.createElement('input');
  mediaUrlInput.type = 'text';
  mediaUrlInput.name = 'mediaUrl';
  mediaUrlInput.placeholder = 'Media URL (Optional)';
  if (isEditMode && initialData.media?.url) {
    mediaUrlInput.value = initialData.media.url;
  }

  const mediaAltInput = document.createElement('input');
  mediaAltInput.type = 'text';
  mediaAltInput.name = 'mediaAlt';
  mediaAltInput.placeholder = 'Media Alt Text (Optional)';
  if (isEditMode && initialData.media?.alt) {
    mediaAltInput.value = initialData.media.alt;
  }

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = submitText || (isEditMode ? 'Update Post' : 'Create Post');

  form.append(titleInput, bodyTextarea, tagsInput, mediaUrlInput, mediaAltInput, submitButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submission handler started.')

    statusMessage.style.display = 'none';

    const postData = processFormData(event.target as HTMLFormElement);

    if (!postData) {
      displayStatus(statusMessage, 'Title is required', true);
      return;
    }

    if (onSubmit) {
      try {
        submitButton.disabled = true;
        submitButton.textContent = submitText ? 'Saving...' : 'Processing...';

        await onSubmit(postData);
      } catch (error) {
        const action = isEditMode ? 'update' : 'create';
        const errorMessage = (error as Error).message || 'An unknown error occurred.';
        displayStatus(statusMessage, `Failed to ${action} post. Error: ${errorMessage}`, true);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = submitText || (isEditMode ? 'Update Post' : 'Create Post');
      }
      return;
    }

      let responsePost: SinglePostResponse;

      try {
        submitButton.disabled = true;
        submitButton.textContent = isEditMode ? 'Updating...' : 'Creating...';

        if (isEditMode && initialData.id) {
          responsePost = await updatePost(String(initialData.id), postData);
        } else {
          responsePost = await createPost(postData);
        }

        const action = isEditMode ? 'updated...' : 'created...';
        displayStatus(statusMessage, `Post ${responsePost.data.id} ${action} successfully! Title: "${responsePost.data.title}"`, false);

        if (!isEditMode) {
          (event.target as HTMLFormElement).reset();
          navigate('/');
        }

      } catch (error) {
        const action = isEditMode ? 'update' : 'create';
        const errorMessage = (error as Error).message || 'An unknown error occurred.';

        displayStatus(statusMessage, `Failed to ${action} post. Error: ${errorMessage}`, true);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = isEditMode ? 'Update Post' : 'Create Post';
      }
   
  });

  formContainer.append(statusMessage, form);

  return formContainer;
}