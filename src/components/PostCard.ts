/**
 * Child element that repeats every post. It represents a single post's display.
 * Holds the Post Model properties given (id, title, body, tags, image etc.) as the required inputs to build the PostCard component.
 */
import type { PostDetails } from "../types/Post";
import type { Media } from "../types/Media";
import { state, updateFollowingStatus } from "../utils/store";
import { navigate } from "../utils/router";
import { deletePost, followProfile, unfollowProfile } from "../api/Client";
import { showConfirmationModal } from "../utils/confirmationModal";
import { addReaction, removeReaction } from "../api/Client";
import { showTempMessage } from "../utils/message";
import type { UserProfileData } from "../types/Profile";
import { MINIMAL_PROFILE_STUB } from "../utils/profileDefaults";



export function PostCard(post: PostDetails, isDetailView: boolean = false): HTMLElement {
  const article = document.createElement('article');
  article.classList.add('post-card');
  article.dataset.postId = String(post.id);

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('post-media-container');

  let buttonWrapper: HTMLDivElement | undefined;

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

  if (!isDetailView) {
    imageElement.style.cursor = 'pointer';
    imageElement.addEventListener('click', (event) => {
      event.stopPropagation();
      navigate(`/post/${post.id}`);
    });
  }

}

const isAuthor = state.userProfile && post.author && post.author.name === state.userProfile?.name;

if (isAuthor) {

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-post-button');

  editButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigate(`/post/edit/${post.id}`); 
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-post-button');

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

  buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('post-actions-wrapper');


  buttonWrapper.appendChild(editButton);
  buttonWrapper.appendChild(deleteButton);

}

    const authorName = post.author?.name;
    const currentUserName = state.userProfile?.name;
    const isProfileAvailable = currentUserName && authorName;

    let followButton: HTMLButtonElement | undefined;
    let authorFollowWrapper: HTMLDivElement | undefined;
    

    if (isProfileAvailable && currentUserName !== authorName) {
      const isFollowing = state.userProfile?.following?.some((f: UserProfileData) => f.name === authorName) || false;

      followButton = document.createElement('button');
      followButton.classList.add('follow-toggle-button');

      const updateButtonState = (following: boolean) => {
        followButton!.textContent = following ? 'Unfollow' : 'Follow';
        followButton!.classList.toggle('following', following);
      };

      updateButtonState(isFollowing);

      followButton.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!state.isLoggedIn) {
          showTempMessage(article, 'You must be logged in to follow users.', true);
          return;
        }

        followButton!.disabled = true;

        const currentlyFollowing = followButton!.textContent === 'Unfollow';
        const currentUserProfileData: UserProfileData | undefined = state.userProfile as UserProfileData;

        try {
          if (currentlyFollowing) {
            await unfollowProfile(authorName);
            updateButtonState(false);
            showTempMessage(article, `Unfollowed ${authorName}`, false);

            updateFollowingStatus(authorName, false);

            if (post.author?.followers) {
              post.author.followers = post.author.followers.filter(f => f.name !== currentUserName);
            }
          } else {
            await followProfile(authorName);
            updateButtonState(true);
            showTempMessage(article, `Now following ${authorName}`, false);


            const minimalFollowedProfile: UserProfileData = {
            ...MINIMAL_PROFILE_STUB, name: authorName, email: post.author.email || MINIMAL_PROFILE_STUB.email, 
          };

          updateFollowingStatus(authorName, true, minimalFollowedProfile);

            if (post.author?.followers && currentUserProfileData) {
              post.author.followers.push(currentUserProfileData);
            }
          }
        } catch (error) {
          console.error('Failed to toggle follow status:', error);
          showTempMessage(article, 'Failed to update follow status. Please try again.', true);
          updateButtonState(currentlyFollowing);
        } finally {
          followButton!.disabled = false;
        }
      });

      authorFollowWrapper = document.createElement('div');
      authorFollowWrapper.classList.add('author-follow-wrapper');

      const authorSpan = document.createElement('span');
      const authorNameDisplay = post.author?.name || 'Unknown Author';
      authorSpan.textContent = `By: ${authorNameDisplay}`;
      authorFollowWrapper.append(authorSpan, followButton);

    }


const reactionSymbol = '👍';

const hasUserReacted = post.reactions?.some((r) => r.symbol === reactionSymbol && r.user?.name === state.userProfile?.name) || false;

const reactButton = document.createElement('button');

if (hasUserReacted) {
  reactButton.textContent = `${reactionSymbol} Liked`;
  reactButton.classList.add('react-button');
} else {
  reactButton.textContent = `${reactionSymbol} React`;
  reactButton.classList.add('react-button');
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
    showTempMessage(article, 'Reaction updated!', false);

    /*setTimeout(() => {
      navigate(window.location.hash);
    }, 500);*/

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
  if (isDetailView) {
    body.textContent = post.body || '[No content]';
  } else {
    body.textContent = post.body ? post.body.substring(0, 150) + '...' : '[No content]';
  }

  contentWrapper.append(title, body);

  const metadataArea = document.createElement('div');
  metadataArea.classList.add('post-metadata');

  const postInfoWrapper = document.createElement('div');
  postInfoWrapper.classList.add('post-info-wrapper');

  if (buttonWrapper) {
    metadataArea.appendChild(buttonWrapper);
  }

    if (authorFollowWrapper) {
      postInfoWrapper.appendChild(authorFollowWrapper);
    } else {
      const authorSpan = document.createElement('span');
      const authorNameDisplay = post.author?.name || 'Unknown Author';
      authorSpan.textContent = `By: ${authorNameDisplay}`;
      postInfoWrapper.appendChild(authorSpan);
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
      postInfoWrapper.appendChild(dateSpan);
    }

    metadataArea.appendChild(postInfoWrapper);

    contentWrapper.prepend(metadataArea);

  const interactionArea = document.createElement('div');
  interactionArea.classList.add('post-interaction');

  if (!isDetailView) {

  const readMoreLink = document.createElement('button');
  readMoreLink.textContent = 'Read More ➡️';
  readMoreLink.classList.add('read-more-link');
  readMoreLink.style.cursor = 'pointer';

  readMoreLink.addEventListener('click', (event) => {
    event.stopPropagation();
    navigate(`/post/${post.id}`);
  });

  article.style.cursor = 'pinter';
  article.addEventListener('click', () => {
    navigate(`/post/${post.id}`);
  });

  interactionArea.appendChild(readMoreLink);
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

