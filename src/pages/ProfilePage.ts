import { getProfile } from "../api/Client";
import { state } from "../utils/store";
import type { Profile } from "../types/Profile";
import { PostCard } from "../components/PostCard";
import { createMinimalAuthorFromProfile } from "../utils/profileDefaults";

const renderLoading = (): HTMLDivElement => {
  const loading = document.createElement('div');
  loading.textContent = 'Loading profile data...';
  loading.className = 'loading-state';
  return loading;
};

const renderError = (message: string): HTMLDivElement => {
  const error = document.createElement('div');
  error.textContent = `Error: ${message}`;
  error.className = 'error-state';
  error.style.color = 'red';
  return error;
};

const renderProfile = (profile: Profile): HTMLDivElement => {
  const profileContainer = document.createElement('div');
  profileContainer.className = 'user-profile';

  const avatar = document.createElement('img');
  avatar.src = profile.avatar?.url || 'placeholder-avatar.png';
  avatar.alt = profile.avatar?.alt || `${profile.name}'s avatar`;
  avatar.className = 'profile-avatar';

  const banner = document.createElement('img');
  banner.src = profile.banner?.url || 'placeholder-banner.png';
  banner.alt = profile.banner?.alt || `${profile.name}'s banner`;
  banner.className = 'profile-banner';

  const name = document.createElement('h2');
  name.textContent = profile.name;

  const email = document.createElement('p');
  email.textContent = `Email: ${profile.email}`;

  const followCount = document.createElement('p');
  followCount.textContent = `Followers: ${profile._count.followers || 0}`;

  const postsCount = document.createElement('p');
  postsCount.textContent = `Total Posts: ${profile._count?.posts || 0}`;

  //more profile fields can be added later
  profileContainer.prepend(banner);
  profileContainer.append(avatar, name, email, followCount, postsCount);


  const postsHeader = document.createElement('h3');
  postsHeader.textContent = `Posts by ${profile.name}`;
  postsHeader.className = 'profile-posts-header';
  profileContainer.appendChild(postsHeader);

  const postsListContainer = document.createElement('div');
  postsListContainer.className = 'profile-posts-list';

  if (profile.posts && profile.posts.length > 0) {
    const injectedAuthor = createMinimalAuthorFromProfile(profile);

    const postToRender = profile.posts.map(post => {
      if (!post.author || !post.author.name) {
      return {
        ...post,
        author: injectedAuthor,
      };
    }
    return post;
    });

    postToRender.forEach(post => {
      const postElement = PostCard(post, false);
      postsListContainer.appendChild(postElement);
    });
  } else {
    const noPosts = document.createElement('p');
    noPosts.textContent = 'This user has not created any posts yet.';
    noPosts.className = 'no-posts-message';
    postsListContainer.appendChild(noPosts);
  }

  profileContainer.appendChild(postsListContainer);

  return profileContainer;
};

/**
 * Implements the protected Profile Page logic, fetching and displaying user data.
 * @returns {HTMLDivElement} The container element for the Profile Page.
 */

export function ProfilePage(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'profile-page-container';
  
  const title = document.createElement('h1');
  title.textContent = 'My Profile';
  pageContainer.appendChild(title);

  let contentArea = renderLoading();
  pageContainer.appendChild(contentArea);

  const fetchAndRenderProfile = async () => {
    const profileName = state.userProfile?.name;

    if (!profileName) {
      const error = renderError('Could not find logged-in user profile name.');
      pageContainer.replaceChild(error, contentArea);
      contentArea = error;
      return;
    }

    try {
      const profileData = await getProfile(profileName);

      const profileElement = renderProfile(profileData);
      pageContainer.replaceChild(profileElement, contentArea);
      contentArea = profileElement;

    } catch (error) {
      console.error('Failed to fetch profile:', error);
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';

      const errorElement = renderError(errorMessage);
      pageContainer.replaceChild(errorElement, contentArea);
      contentArea = errorElement;
    }
    
  };

  fetchAndRenderProfile();

  return pageContainer;
}