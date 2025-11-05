import { postComment } from "../api/Client";
import { showTempMessage } from "../utils/message";

interface CommentFormOptions {
  postId: string;
  onCommentSuccess: () => void;
}

/**
 * Creates and renders a form for submitting a new comment on a post.
 * @param {CommentFormOptions} options _ The post ID and success callback.
 * @returns {HTMLFormElement} The comment submission form element.
 */

export function CommentForm({ postId, onCommentSuccess}: CommentFormOptions): HTMLFormElement {
const form = document.createElement('form');
form.classList.add('comment-form');

const textarea = document.createElement('textarea');
textarea.name = 'body';
textarea.placeholder = 'Write a comment...';
textarea.required = true;
textarea.classList.add('comment-textarea');

const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Post Comment';
submitButton.classList.add('comment-submit-button');

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
    showTempMessage(form, 'Failed to post comment. Please check the console.', true);

  } finally {
    submitButton.disabled = false;
  }
});

return form;

}
