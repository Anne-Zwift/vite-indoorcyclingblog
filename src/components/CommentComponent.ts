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

const header = document.createElement('div');
header.classList.add('comment-header');

const authorLink = document.createElement('a');
authorLink.href = `/#/profile/${comment.author.name}`;
authorLink.textContent = `@${comment.author.name}`;
authorLink.classList.add('comment-author-link');

const dateSpan = document.createElement('span');
dateSpan.textContent = formatRelativeDate(comment.created);
dateSpan.classList.add('comment-date');

header.append(authorLink, dateSpan);

const bodyText = document.createElement('p');
bodyText.textContent = comment.body;
bodyText.classList.add('comment-body');

commentContainer.append(header, bodyText);

return commentContainer;


}