import { getPostsByProfile, getProfile, updateProfile } from '../api/Client';
import { state } from '../utils/store';
import type { Profile } from '../types/Profile';
import { PostCard } from '../components/PostCard';
import { createMinimalAuthorFromProfile } from '../utils/profileDefaults';

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
  profileContainer.className = 'user-profile w-full max-w-5xl mx-auto';

  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'relative w-full mb-20';

  const banner = document.createElement('img');
  banner.src = profile.banner?.url || 'placeholder-banner.png';
  banner.alt = profile.banner?.alt || `${profile.name}'s banner`;
  banner.className =
    'profile-banner w-full aspect-[16/7] object-cover rounded-xl overflow-hidden shadow-lg';

  const avatar = document.createElement('img');
  avatar.src = profile.avatar?.url || 'placeholder-avatar.png';
  avatar.alt = profile.avatar?.alt || `${profile.name}'s avatar`;
  avatar.className =
    'profile-avatar absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white';

  headerWrapper.append(banner, avatar);
  profileContainer.append(headerWrapper);

  /* Info section */
  const userDetails = document.createElement('div');
  userDetails.className = 'px-8 space-y-1 text-center md:text-left';

  const name = document.createElement('h2');
  name.textContent = profile.name;
  name.className = 'text-3xl font-bold text-gray-900 dark:text-slate-100';

  const email = document.createElement('p');
  email.textContent = `${profile.email}`;
  email.className = 'text-gray-600 dark:text-slate-100';

  const statsRow = document.createElement('div');
  statsRow.className =
    'flex gap-8 mt-4 mb-6 justify-center md:justify-start border-y border-gray-100 py-4';

  const followersSpan = document.createElement('span');
  followersSpan.className = 'flex flex-col items-center md:items-start';
  const followersCount = document.createElement('strong');
  followersCount.className = 'text-gray-900 text-lg dark:text-slate-100';
  followersCount.textContent = `Followers: ${profile._count.followers || 0}`;
  const followersLabel = document.createElement('span');
  followersSpan.append(followersCount, followersLabel);

  const postsSpan = document.createElement('span');
  postsSpan.className = 'flex flex-col items-center md:items-start';
  const postsCount = document.createElement('strong');
  postsCount.className = 'text-gray-900 text-lg dark:text-slate-100';
  postsCount.textContent = ` Posts: ${profile._count?.posts || 0}`;
  const postsLabel = document.createElement('span');
  postsSpan.append(postsCount, postsLabel);

  statsRow.append(followersSpan, postsSpan);
  userDetails.append(name, email, statsRow);
  profileContainer.append(userDetails);

  const isCurrentUser = profile.name === state.userProfile?.name;
  if (isCurrentUser) {
    const editActions = document.createElement('div');
    editActions.className =
      'flex flex-col gap-2 m-2 -mt-16 md:absolute md:top-4 md:right-4 md:mt-0 md:items-end z-20';

    const editButton = document.createElement('button');
    editButton.textContent = '✏️ Update Profile Image';
    editButton.className =
      'edit-profile-button flex justify-between w-24 dark:bg-slate-500 md:w-64 md:justify-center items-center -mt-16 md:mt-0 gap-2 px-1 py-4 md:px-4 md:py-2 rounded-lg text-xs md:text-sm break-word font-semibold shadow-md bg-white/80 backdrop-blur hover:bg-white dark:hover:bg-slate-800 transition active:scale-95';

    const updateForm = document.createElement('form');
    updateForm.dataset.open = 'false';
    updateForm.className =
      'update-avatar-form max-h-0 opacity-0 data-[open=true]:max-h-96 data-[open=true]:opacity-100 transition-all';

    const avatarInput = document.createElement('input');
    avatarInput.type = 'url';
    avatarInput.placeholder = 'New Avatar URL';
    avatarInput.id = 'new-avatar-url';
    avatarInput.value = profile.avatar?.url || '';
    avatarInput.className =
      'w-full p-2 mt-2 text-sm font-mono truncate text-(--color-p-text) dark:text-slate-200 bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200 dark:bg-slate-600';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Save Avatar';
    saveButton.className =
      'self-start bg-(--color-bg-button) dark:bg-slate-600 hover:bg-(--color-hover-button) w-28 p-1 m-2 rounded transitions-color dark:border-slate-400';

    const statusMessage = document.createElement('p');
    statusMessage.className =
      'w-full p-2 mb-2 text-sm text-center font-mono break-words text-(--color-text-ready) bg-(--color-bg-ready) border rounded-md';
    statusMessage.style.display = 'none';

    updateForm.append(avatarInput, saveButton, statusMessage);

    editButton.addEventListener('click', () => {
      const isOpen = updateForm.dataset.open === 'true';
      updateForm.dataset.open = String(!isOpen);
    });

    const editBannerButton = document.createElement('button');
    editBannerButton.textContent = '🖼️ Update Banner Image';
    editBannerButton.className =
      'edit-banner-button flex justify-between w-24 dark:bg-slate-500 md:w-64 md:justify-center items-center -mt-2 md:mt-0 gap-2 px-1 py-4 md:px-4 md:py-2 rounded-lg text-xs md:text-sm break-word font-semibold shadow-md bg-white/80 backdrop-blur hover:bg-white dark:hover:bg-slate-800 transition active:scale-95';

    const updateBannerForm = document.createElement('form');
    updateBannerForm.dataset.open = 'false';
    updateBannerForm.className =
      'update-banner-form max-h-0 opacity-0 data-[open=true]:max-h-96 data-[open=true]:opacity-100 transition-all';

    const bannerInput = document.createElement('input');
    bannerInput.type = 'url';
    bannerInput.placeholder = 'New Banner URL';
    bannerInput.id = 'new-banner-url';
    bannerInput.value = profile.banner?.url || '';
    bannerInput.className =
      'w-full p-2 mt-2 text-sm font-mono truncate text-(--color-p-text) dark:text-slate-200 bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-(--color-secondary) focus:ring-offset-2 transition-all duration-200 dark:bg-slate-600';

    const saveBannerButton = document.createElement('button');
    saveBannerButton.type = 'submit';
    saveBannerButton.textContent = 'Save Banner';
    saveBannerButton.className =
      'self-start bg-(--color-bg-button) dark:bg-slate-600 hover:bg-(--color-hover-button) w-28 p-1 m-2 rounded transitions-color dark:border-slate-400';

    const bannerStatusMessage = document.createElement('p');
    bannerStatusMessage.className =
      'w-full p-2 mb-2 text-sm text-center font-mono break-words text-(--color-text-ready) bg-(--color-bg-ready) border rounded-md';
    bannerStatusMessage.style.display = 'none';

    updateBannerForm.append(bannerInput, saveBannerButton, bannerStatusMessage);

    editBannerButton.addEventListener('click', () => {
      const isOpen = updateBannerForm.dataset.open === 'true';
      updateBannerForm.dataset.open = String(!isOpen);
    });

    updateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!state.userProfile?.name) return;

      statusMessage.style.display = 'block';
      statusMessage.textContent = 'updating...';

      try {
        const updatedProfile = await updateProfile(state.userProfile.name, {
          avatar: {
            url: avatarInput.value,
            alt: `${state.userProfile.name}'s avatar`,
          },
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
          banner: {
            url: bannerInput.value,
            alt: `${state.userProfile.name}'s banner`,
          },
        });
        banner.src = updatedProfile.banner?.url || 'placeholder-banner.png';
        bannerStatusMessage.textContent = 'Success! Banner updated';

        state.userProfile = { ...state.userProfile, ...updatedProfile };
      } catch (error) {
        console.error('Update failed:', error);
        bannerStatusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    });
    editActions.append(
      editButton,
      updateForm,
      editBannerButton,
      updateBannerForm,
    );
    headerWrapper.append(editActions);
  }

  const postsHeader = document.createElement('h3');
  postsHeader.textContent = `Posts by ${profile.name}`;
  postsHeader.className =
    'profile-posts-header px-8 text-xl font-bold mt-12 mb-6';

  const postsListContainer = document.createElement('div');
  postsListContainer.className = 'profile-posts-list px-8 space-y-6';

  if (profile.posts && profile.posts.length > 0) {
    const injectedAuthor = createMinimalAuthorFromProfile(profile);

    const postToRender = profile.posts.map((post) => {
      if (!post.author || !post.author.name) {
        return {
          ...post,
          author: injectedAuthor,
        };
      }
      return post;
    });

    postToRender.forEach((post) => {
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
  pageContainer.className =
    'flex flex-col justify-center items-center md:font-medium';

  const title = document.createElement('h1');
  title.textContent = 'My Profile';
  pageContainer.appendChild(title);
  title.className = 'text-center text-xl text-blue-400 font-bold mt-10 mb-2';

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
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';

      const errorElement = renderError(errorMessage);
      pageContainer.replaceChild(errorElement, contentArea);
      contentArea = errorElement;
    }
  };

  fetchAndRenderProfile();

  return pageContainer;
}
