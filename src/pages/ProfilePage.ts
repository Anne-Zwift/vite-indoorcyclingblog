import { getPostsByProfile, getProfile, updateProfile } from "../api/Client";
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
  //profileContainer.prepend(banner);
  //profileContainer.append(avatar, name, email, followCount, postsCount);

//new
  const isCurrentUser = profile.name === state.userProfile?.name;

  if (isCurrentUser) {

    const editButton = document.createElement('button');
    editButton.textContent = '✏️ Update Profile Image';
    editButton.className = 'edit-profile-button';

    const updateForm = document.createElement('form');
    updateForm.className = 'update-avatar-form';
    updateForm.style.display = 'none';

    const avatarInput = document.createElement('input');
    avatarInput.type = 'url';
    avatarInput.placeholder = 'New Avatar URL';
    avatarInput.id = 'new-avatar-url';
    avatarInput.value = profile.avatar?.url || '';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Save Avatar';

    const statusMessage = document.createElement('p');
    statusMessage.className = 'update-status-message';
    statusMessage.style.display = 'none';

    updateForm.append(avatarInput, saveButton, statusMessage);

    editButton.addEventListener('click', () => {
      updateForm.style.display = updateForm.style.display === 'none' ? 'block' : 'none';
    });

    //banner new
    const editBannerButton = document.createElement('button');
    editBannerButton.textContent = '🖼️ Update Banner Image';
    editBannerButton.className = 'edit-banner-button';

    const updateBannerForm = document.createElement('form');
    updateBannerForm.className = 'update-banner-form';
    updateBannerForm.style.display = 'none';

    const bannerInput = document.createElement('input');
    bannerInput.type = 'url';
    bannerInput.placeholder = 'New Banner URL';
    bannerInput.id = 'new-banner-url';
    bannerInput.value = profile.banner?.url || '';

    const saveBannerButton = document.createElement('button');
    saveBannerButton.type = 'submit';
    saveBannerButton.textContent = 'Save Banner';

    const bannerStatusMessage = document.createElement('p');
    bannerStatusMessage.className = 'update-status-message';
    bannerStatusMessage.style.display = 'none';

    updateBannerForm.append(bannerInput, saveBannerButton, bannerStatusMessage);

    editBannerButton.addEventListener('click', () => {
      updateBannerForm.style.display = updateBannerForm.style.display === 'none' ? 'block' : 'none';

  
    });
    
    //banner end
    
    //profileContainer.prepend(banner);
    //profileContainer.append(editButton, updateForm, avatar, name, email, followCount, postsCount);

    updateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!state.userProfile?.name) return;

      statusMessage.style.display = 'block';
      statusMessage.textContent = 'updating...';

      try {
        const updatedProfile = await updateProfile(state.userProfile.name, {
          avatar: { url: avatarInput.value, alt: `${state.userProfile.name}'s avatar`}
        });
        avatar.src = updatedProfile.avatar?.url || 'placeholder-avatar.png';
        statusMessage.textContent = 'Success! Image updated';

        state.userProfile = { ...state.userProfile, ...updatedProfile };
      } catch (error) {
        console.error('Update failed:', error);
        statusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    });

    updateBannerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!state.userProfile?.name) return;

      bannerStatusMessage.style.display = 'block';
      bannerStatusMessage.textContent = 'updating...';

      try {
        const updatedProfile = await updateProfile(state.userProfile.name, {
          banner: { url: bannerInput.value, alt: `${state.userProfile.name}'s banner`}
        });
        banner.src = updatedProfile.banner?.url || 'placeholder-banner.png';
        bannerStatusMessage.textContent = 'Success! Banner updated';

        state.userProfile = { ...state.userProfile, ...updatedProfile };
      } catch (error) {
        console.error('Update failed:', error);
        bannerStatusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    });

    profileContainer.append(editButton, updateForm);
    profileContainer.append(editBannerButton, updateBannerForm);
  }
//ends new
  profileContainer.prepend(banner);
  profileContainer.append(avatar, name, email, followCount, postsCount);

  const postsHeader = document.createElement('h3');
  postsHeader.textContent = `Posts by ${profile.name}`;
  postsHeader.className = 'profile-posts-header';
  //profileContainer.appendChild(postsHeader);

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

  profileContainer.appendChild(postsHeader);
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

      const profilePosts = await getPostsByProfile(profileName);

      profileData.posts = profilePosts;

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