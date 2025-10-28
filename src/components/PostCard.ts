/**
 * Child element that repeats every post. It represents a single post's display.
 * Holds the Post Model properties given (id, title, body, tags, image etc.) as the required inputs to build the PostCard component.
 */
import type { PostDetails } from "../types/Post";
import type { Media } from "../types/Media";
import { state } from "../utils/store";
import { navigate } from "../utils/router";



export function PostCard(post: PostDetails): HTMLElement {
  const article = document.createElement('article');
  article.classList.add('post-card', 'bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'mb-4');
  article.dataset.postId = String(post.id);

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('post-media-container', 'mb-3');

  let mediaUrl: string | undefined;
  let mediaAlt: string | undefined;
  
  if (Array.isArray (post.media) && post.media.length > 0) {
    const postMedia: Media = post.media[0];
    mediaUrl = postMedia.url;
    mediaAlt = postMedia.alt;

} else if (typeof post.media === 'object' && post.media !== null && 'url' in post.media) {
  const postMedia: Media = post.media as Media;
  const imageElement = document.createElement('img');
  imageElement.src = postMedia.url;
  imageElement.alt = postMedia.alt || post.title;
  imageElement.classList.add('post-image');
  article.appendChild(imageElement);
}

const isAuthor = state.userProfile && post.author && post.author.name === state.userProfile?.name;

if (isAuthor) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-post-button', 'bg-black-600', 'hover:bg-orange-400', 'text-white', 'py-1', 'px-3', 'rounded', 'absolute', 'top-4', 'right-4', 'z-10');

  editButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(`/post/edit/${post.id}`); //change path, not sure yet maybe add / before
  });

  article.appendChild(editButton);
}
  
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('post-content');

  const title = document.createElement('h3');
  title.textContent = post.title;

  const body = document.createElement('p');
  body.textContent = post.body ? post.body.substring(0, 150) + '...' : '[No content]';

  contentWrapper.append(title, body);

  const metadataArea = document.createElement('div');
  metadataArea.classList.add('post-metadata');

    if (post.author && post.author.name) {
    const authorSpan = document.createElement('span');
    authorSpan.textContent = `By: ${post.author.name}`;
    metadataArea.appendChild(authorSpan);
  }

  const dateOptions: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'short', day: 'numeric'};
  let dateText = '';

    if (post.updated && post.updated !==post.created) {
      dateText = `Updated: ${new Date(post.updated).toLocaleDateString(undefined, dateOptions)}`;
    } else if (post.created) {
      dateText = `Posted: ${new Date(post.updated).toLocaleDateString(undefined, dateOptions)}`;
    }

    if (dateText) {
      const dateSpan = document.createElement('span');
      dateSpan.textContent = dateText;
      metadataArea.appendChild(dateSpan);
    }

    contentWrapper.prepend(metadataArea);

  const interactionArea = document.createElement('div');
  interactionArea.classList.add('post-interaction');

  const readMoreLink = document.createElement('a');
  readMoreLink.href = `/#/post/${post.id}`;
  readMoreLink.textContent = 'Read More';
  readMoreLink.classList.add('read-more-link');

  const metadata = document.createElement('span');
  metadata.innerHTML = `
  Comments: <strong>${post._count?.comments || 0}</strong>
  Reactions: <strong>${post._count?.reactions || 0}</strong>
  `;

  interactionArea.append(readMoreLink, metadata);

  article.append(contentWrapper, interactionArea);

  return article;
}

