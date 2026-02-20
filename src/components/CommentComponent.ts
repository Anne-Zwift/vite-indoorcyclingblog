import type { CommentItem } from "../types/CommentItem";
import { formatRelativeDate } from "../utils/dateUtils";

/**
 * Renders a single comment element.
 * @param {CommentItem} comment - The comment data to display.
 * @returns {HTMLDivElement} The rendered comment container.
 */

export function CommentComponent(comment: CommentItem): HTMLDivElement {
  const commentContainer = document.createElement('div');
  commentContainer.classList.add('comment-item');
  commentContainer.className = 'flex flex-col p-4 bg-(--color-primary) dark:bg-slate-500 mt-2 rounded border-b border-slate-100 dark:border-slate-600 last:border-0 w-full max-w-2xl mx-auto mb-4'

  const header = document.createElement('div');
  header.classList.add('comment-header');
  header.className = 'flex justify-between items-center text-xs text-slate-500';

  const authorLink = document.createElement('a');
  authorLink.href = `/#/profile/${comment.author.name}`;
  authorLink.textContent = `@${comment.author.name}`;
  authorLink.classList.add('comment-author-link');
  authorLink.className = 'font-bold text-(--color-secondary) hover:underline transition-opacity hover:opacity-80';

  const dateSpan = document.createElement('span');
  dateSpan.textContent = formatRelativeDate(comment.created);
  dateSpan.classList.add('comment-date');

  header.append(authorLink, dateSpan);

  const bodyText = document.createElement('p');
  bodyText.textContent = comment.body;
  bodyText.classList.add('comment-body');
  bodyText.className = 'text-sm lg:text-base text-(--color-p-text) dark:text-white text-left mt-2 break-words';

  commentContainer.append(header, bodyText);

  return commentContainer;


}