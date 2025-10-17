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
  
  if (post.media && post.media.url) {
    const postMedia: Media = post.media;
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
  body.textContent = post.body.substring(0, 150) + '...';

  contentWrapper.append(title, body);

  const interactionArea = document.createElement('div');
  interactionArea.classList.add('post-interaction');

  const readMoreLink = document.createElement('a');
  readMoreLink.href = `/#/post/${post.id}`;
  readMoreLink.textContent = 'Read More';
  readMoreLink.classList.add('read-more-link');

  const metadata = document.createElement('span');
  metadata.innerHTML = `
   Comments: <strong>${post._count?.comments || 0}<strong> | 
   Reactions: <strong>${post._count?.reactions || 0}<strong>`;

   const timestampArea = document.createElement('div');
   timestampArea.classList.add('post-timestamps');

   if (post.created) {
    const createdDate = new Date(post.created).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const createdSpan = document.createElement('span');
    createdSpan.textContent = `Posted: ${createdDate}`;
    timestampArea.appendChild(createdSpan);
   }

   if (post.updated && post.updated !== post.created) {
    const updatedDate = new Date(post.updated).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const updatedSpan = document.createElement('span');
    updatedSpan.textContent = `Posted: ${updatedDate}`;
    timestampArea.appendChild(updatedSpan);
   }

     const metadataArea = document.createElement('div');
     metadataArea.classList.add('post-metadata');

     if (post.author && post.author.name) {
      const authorSpan = document.createElement('span');
      authorSpan.textContent = `By: ${post.author.name}`;
      metadataArea.appendChild(authorSpan);
    }

    let dateInfo = '';
    if (post.created) {
      const createdDate = new Date(post.created).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      });
      dateInfo =`on ${createdDate}`;
    }

    let updatedInfo = '';
    if (post.updated && post.updated !== post.created) {
      const updatedDate = new Date(post.updated).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      });
      dateInfo =`on ${updatedDate}`;
    }

    const dateSpan = document.createElement('span');
    dateSpan.textContent = dateInfo + updatedInfo;
    metadataArea.appendChild(dateSpan);

   interactionArea.append(readMoreLink, metadata);
   contentWrapper.prepend(timestampArea);
   article.append(contentWrapper, interactionArea);

  return article;
}

