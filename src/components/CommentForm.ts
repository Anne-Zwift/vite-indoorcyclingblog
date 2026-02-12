import { postComment } from '../api/Client';
import { showTempMessage } from '../utils/message';

interface CommentFormOptions {
  postId: string;
  onCommentSuccess: () => void;
}

/**
 * Creates and renders a form for submitting a new comment on a post.
 * @param {CommentFormOptions} options _ The post ID and success callback.
 * @returns {HTMLFormElement} The comment submission form element.
 */

export function CommentForm({
  postId,
  onCommentSuccess,
}: CommentFormOptions): HTMLFormElement {
  const form = document.createElement('form');
  form.classList.add('comment-form');
  form.className =
    'flex flex-col gap-4 p-6 bg-(--color-primary) rounded-lg shadow-inner mt-8 w-full max-w-2xl mx-auto';

  const textarea = document.createElement('textarea');
  textarea.name = 'body';
  textarea.placeholder = 'Write a comment...';
  textarea.required = true;
  textarea.classList.add('comment-textarea');
  textarea.className =
    'block w-full p-4 mx-auto text-base text-(--color-p-text) bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200';

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Post Comment';
  submitButton.classList.add('comment-submit-button');
  submitButton.className =
    'self-end w-28 p-1 text-sm bg-(--color-bg-button) hover:bg-(--color-hover-button) cursor-pointer transition-transform hover:scale-105 border-none';

  form.append(textarea, submitButton);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    const body = textarea.value.trim();

    if (!body) {
      submitButton.disabled = false;
      return;
    }

    try {
      await postComment(postId, body);

      showTempMessage(form, 'Comment posted successfully!', false);

      textarea.value = '';
      onCommentSuccess();
    } catch (error) {
      console.error('Comment submission failed:', error);
      showTempMessage(
        form,
        'Failed to post comment. Please check the console.',
        true,
      );
    } finally {
      submitButton.disabled = false;
    }
  });

  return form;
}
