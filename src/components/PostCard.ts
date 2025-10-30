/**
 * Child element that repeats every post. It represents a single post's display.
 * Holds the Post Model properties given (id, title, body, tags, image etc.) as the required inputs to build the PostCard component.
 */
import type { PostDetails } from "../types/Post";
import type { Media } from "../types/Media";
import { state } from "../utils/store";
import { navigate } from "../utils/router";
import { deletePost } from "../api/Client";
import { showConfirmationModal } from "../utils/confirmationModal";
import { addReaction, removeReaction } from "../api/Client";
import { showTempMessage } from "../utils/message";



export function PostCard(post: PostDetails, isDetailView: boolean = false): HTMLElement {
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
  mediaUrl = postMedia.url;
  mediaAlt = postMedia.alt;
}

if (mediaUrl) {
  const imageElement = document.createElement('img');
  imageElement.src = mediaUrl;
  imageElement.alt = mediaAlt || post.title;
  imageElement.classList.add('post-image');
  article.appendChild(imageElement);
}

const isAuthor = state.userProfile && post.author && post.author.name === state.userProfile?.name;

if (isAuthor) {

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-post-button', 'bg-black-600', 'hover:bg-orange-400', 'text-white', 'py-1', 'px-3', 'rounded');

  editButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(`/post/edit/${post.id}`); 
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-post-button', 'bg-red-600', 'hover:bg-red-400', 'text-white', 'py-1', 'px-3', 'rounded');

  deleteButton.addEventListener('click', async (event) => {
    event.preventDefault();
  
    const confirmed = await showConfirmationModal('Are you sure you want to delete the post?');
    if (!confirmed) return;
  

    try {
      await deletePost(String(post.id));
      article.remove();
      showTempMessage(document.body, `Post deleted successfully.`, false);
      navigate('/'); //option article.remove();
    } catch (error) {
      console.error('Failed to delete post:', error);
      //some user-facing error feedback
      showTempMessage(article, 'Failed to delete post. Please try again.', true);
    }
  });

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('post-actions-wrapper', 'absolute', 'top-4', 'right-4', 'z-10', 'flex', 'space-x-2');


  buttonWrapper.appendChild(editButton);
  buttonWrapper.appendChild(deleteButton);

  article.appendChild(buttonWrapper);
}

const reactionSymbol = '👍';

const hasUserReacted = post.reactions?.some((r) => r.symbol === reactionSymbol && r.user?.name === state.userProfile?.name) || false;

const reactButton = document.createElement('button');

if (hasUserReacted) {
  reactButton.textContent = `${reactionSymbol} Liked`;
  reactButton.classList.add('react-button', 'bg-green-600', 'hover:bg-green-700', 'text-white', 'py-1', 'px-3', 'rounded', 'mr-2');
} else {
  reactButton.textContent = `${reactionSymbol} React`;
  reactButton.classList.add('react-button', 'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'py-1', 'px-3', 'rounded', 'mr-2');
}


reactButton.addEventListener('click', async (event) => {
  event.preventDefault();

  if (!state.isLoggedIn) {
      showTempMessage(article, 'You must be logged in to react to a post.', true);
      return;
  }

  reactButton.disabled = true;

  try {
 
    if (hasUserReacted) {
    await removeReaction(String(post.id), reactionSymbol);

    } else {
      await addReaction(String(post.id), reactionSymbol);
    }

    reactButton.disabled = false;
    showTempMessage(article, 'Reaction updated! Refreshing...', false);

    setTimeout(() => {
      navigate(window.location.hash);
    }, 500);

  } catch (error) {
    console.error('Failed to toggle reaction:', error);
    
    showTempMessage(article, 'Failed to update reaction. Please try again.', true);

    reactButton.disabled = false;
  }
});

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('post-content');

  const title = document.createElement('h3');
  title.textContent = post.title;

  const body = document.createElement('p');
  body.textContent = isDetailView ? post.body || post.body.substring(0, 150) + '...' : '[No content]';

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

  if (!isDetailView) {
  const readMoreLink = document.createElement('a');
  readMoreLink.href = `/#/post/${post.id}`;
  readMoreLink.textContent = 'Read More';
  readMoreLink.classList.add('read-more-link');
  }

  const metadata = document.createElement('span');
  metadata.innerHTML = `
  Comments: <strong>${post._count?.comments || 0}</strong>
  Reactions: <strong>${post._count?.reactions || 0}</strong>
  `;

  interactionArea.append(metadata, reactButton);

  article.append(contentWrapper, interactionArea);

  return article;
}

