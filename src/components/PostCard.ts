/**
 * Child element that repeats every post. It represents a single post's display.
 * Holds the Post Model properties given (id, title, body, tags, image etc.) as the required inputs to build the PostCard component.
 */
import type { PostDetails } from "../types/Post";
import type { Media } from "../types/Media";



export function PostCard(post: PostDetails): HTMLElement {
  const article = document.createElement('article');
  article.classList.add('post-card');
  article.dataset.postId = post.id.toString();
  
  if (Array.isArray (post.media) && post.media.length > 0) {
    const postMedia: Media = post.media[0];

    if (postMedia.url) {
      const imageElement = document.createElement('img');
      imageElement.src = postMedia.url;
      imageElement.alt = postMedia.alt || post.title;
      imageElement.classList.add('post-image');
      article.appendChild(imageElement);
  }
} else if (typeof post.media === 'object' && post.media !== null && 'url' in post.media) {
  const postMedia: Media = post.media as Media;
  const imageElement = document.createElement('img');
  imageElement.src = postMedia.url;
  imageElement.alt = postMedia.alt || post.title;
  imageElement.classList.add('post-image');
  article.appendChild(imageElement);
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

