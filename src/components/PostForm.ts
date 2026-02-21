import { createPost, updatePost } from '../api/Client';
import type { Media } from '../types/Media';
import type { PostRequest, SinglePostResponse } from '../types/Post';
import type { PostFormProps } from '../types/PostFormProps';
import { navigate } from '../utils/router';

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
    postData.tags = tagsString
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  if (mediaUrl && mediaUrl.trim() !== '') {
    postData.media = {
      url: mediaUrl.trim(),
      alt: mediaAlt?.trim() || title.trim() || 'Post media',
    } as Media;
  }

  return postData;
}

function displayStatus(
  element: HTMLElement,
  message: string,
  isError: boolean = false,
): void {
  element.textContent = message;
  const baseClasses =
    'p-4 mb-4 rounded-md text-sm font-medium transition-all shadow-sm ';
  const stateClasses = isError
    ? 'bg-red-50 text-red-700 border border-red-200'
    : 'bg-green-50 text-green-700 border-green-200';
  element.className = baseClasses + stateClasses;
  element.style.display = 'block';
}

export function PostForm(props: PostFormProps = {}): HTMLDivElement {
  const { initialData, onSubmit, submitText } = props;

  const isEditMode = !!initialData;
  const formContainer = document.createElement('div');
  formContainer.className =
    'flex flex-col text-center rounded-lg shadow-lg w-full p-8 mb-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-600';
  formContainer.id = isEditMode
    ? `edit-post-container-${initialData.id}`
    : 'create-post-form-container';

  const heading = document.createElement('h2');
  heading.className = 'text-xl font-bold mb-4 text-(--color-h1-text)';
  heading.textContent = isEditMode
    ? `Editing "${initialData.title}" ✍️`
    : 'Create a new post and make someone HAPPY🤩';

  const statusMessage = document.createElement('div');
  statusMessage.id = 'post-status-message';
  statusMessage.className = 'status-message';

  const form = document.createElement('form');
  form.className = 'flex flex-col items-stretch gap-2 px-1 py-1 mt-4';
  form.id = isEditMode ? `edit-post-form-${initialData.id}` : 'post-entry-form';

  formContainer.append(heading, statusMessage, form);

  const titleInput = document.createElement('input');
  titleInput.className =
    'block w-full p-3 m-1 mx-auto text-base text-(--color-p-text) dark:text-white bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200';
  titleInput.type = 'text';
  titleInput.name = 'title';
  titleInput.placeholder = 'Title (Required)';
  titleInput.required = true;
  if (isEditMode) {
    titleInput.value = initialData.title;
  }

  const bodyTextarea = document.createElement('textarea');
  bodyTextarea.className =
    'block w-full p-4 mx-auto text-base text-(--color-p-text) dark:text-white bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) transition-all duration-200 resize-y min-h-[150px] [scrollbar-gutter:stable]';
  bodyTextarea.name = 'body';
  bodyTextarea.placeholder = 'Body/Content (Optional)';
  if (isEditMode && initialData.body) {
    bodyTextarea.value = initialData.body;
  }

  const tagsInput = document.createElement('input');
  tagsInput.className =
    'block w-full p-3 m-1 mx-auto text-base text-(--color-p-text) dark:text-white bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200';
  tagsInput.type = 'text';
  tagsInput.name = 'tags';
  tagsInput.placeholder = 'Tags (e.g., cycling, indoor)';
  if (isEditMode && initialData.tags) {
    tagsInput.value = initialData.tags.join(', ');
  }

  const mediaUrlInput = document.createElement('input');
  mediaUrlInput.className =
    'block w-full min-w-0 p-3 m-1 mx-auto text-sm font-mono truncate text-(--color-p-text) dark:text-white bg-slate-50 dark:bg-slate-600 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200';
  mediaUrlInput.type = 'text';
  mediaUrlInput.name = 'mediaUrl';
  mediaUrlInput.placeholder = 'Media URL (Optional)';
  if (isEditMode && initialData.media?.url) {
    mediaUrlInput.value = initialData.media.url;
  }

  const mediaAltInput = document.createElement('input');
  mediaAltInput.className =
    'block w-full p-3 m-1 mx-auto text-base text-(--color-p-text) dark:text-white bg-slate-50 border dark:bg-slate-600 border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200';
  mediaAltInput.type = 'text';
  mediaAltInput.name = 'mediaAlt';
  mediaAltInput.placeholder = 'Media Alt Text (Optional)';
  if (isEditMode && initialData.media?.alt) {
    mediaAltInput.value = initialData.media.alt;
  }

  const submitButton = document.createElement('button');
  submitButton.className =
    'w-32 self-end dark:text-slate-100 bg-(--color-bg-button) dark:bg-slate-400 hover:bg-(--color-hover-button) rounded-lg mt-4 mb-2 p-2 font-medium transition-all hover:scale-105 border-none';
  submitButton.type = 'submit';
  submitButton.textContent =
    submitText || (isEditMode ? 'Update Post' : 'Create Post');

  form.append(
    titleInput,
    bodyTextarea,
    tagsInput,
    mediaUrlInput,
    mediaAltInput,
    submitButton,
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Form submission handler started.');

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
        const errorMessage =
          (error as Error).message || 'An unknown error occurred.';
        displayStatus(
          statusMessage,
          `Failed to ${action} post. Error: ${errorMessage}`,
          true,
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent =
          submitText || (isEditMode ? 'Update Post' : 'Create Post');
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
      displayStatus(
        statusMessage,
        `Post ${responsePost.data.id} ${action} successfully! Title: "${responsePost.data.title}"`,
        false,
      );

      if (!isEditMode) {
        (event.target as HTMLFormElement).reset();
        navigate('/');
      }
    } catch (error) {
      const action = isEditMode ? 'update' : 'create';
      const errorMessage =
        (error as Error).message || 'An unknown error occurred.';

      displayStatus(
        statusMessage,
        `Failed to ${action} post. Error: ${errorMessage}`,
        true,
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = isEditMode ? 'Update Post' : 'Create Post';
    }
  });

  return formContainer;
}
