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

  /*   const headerSection = document.createElement('div');
  headerSection.className = 'relative mb-16'; */

  const banner = document.createElement('img');
  banner.src = profile.banner?.url || 'placeholder-banner.png';
  banner.alt = profile.banner?.alt || `${profile.name}'s banner`;
  banner.className =
    'profile-banner w-full aspect-[16/7] object-cover rounded-xl shadow-md';

  /*   const avatarContainer = document.createElement('div');
  avatarContainer.className = 'absolute-bottom left-8'; */

  const avatar = document.createElement('img');
  avatar.src = profile.avatar?.url || 'placeholder-avatar.png';
  avatar.alt = profile.avatar?.alt || `${profile.name}'s avatar`;
  avatar.className =
    'profile-avatar absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white';

  headerWrapper.append(banner, avatar);
  profileContainer.append(headerWrapper);

  /* Info section */

  /*   const infoSection = document.createElement('div');
  infoSection.className =
    'px-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4'; */

  const userDetails = document.createElement('div');
  userDetails.className = 'px-8 space-y-1 text-center md:text-left';

  const name = document.createElement('h2');
  name.textContent = profile.name;
  name.className = 'text-3xl font-bold text-gray-900';

  const email = document.createElement('p');
  email.textContent = `${profile.email}`;
  email.className = 'text-gray-600';

  const statsRow = document.createElement('div');
  statsRow.className =
    'flex gap-8 mt-4 mb-6 justify-center md:justify-start border-y border-gray-100 py-4';

  const followersSpan = document.createElement('span');
  followersSpan.className = 'flex flex-col items-center md:items-start';
  const followersCount = document.createElement('strong');
  followersCount.className = 'text-gray-900 text-lg';
  followersCount.textContent = `Followers: ${profile._count.followers || 0}`;
  const followersLabel = document.createElement('span');
  followersSpan.append(followersCount, followersLabel);

  const postsSpan = document.createElement('span');
  postsSpan.className = 'flex flex-col items-center md:items-start';
  const postsCount = document.createElement('strong');
  postsCount.className = 'text-gray-900 text-lg';
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
      'px-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center mt-6';

    const editButton = document.createElement('button');
    editButton.textContent = '✏️ Update Profile Image';
    editButton.className =
      'edit-profile-button w-full max-w-xs md:w-55 flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 transition-all active:scale-95';

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
      updateForm.style.display =
        updateForm.style.display === 'none' ? 'block' : 'none';
    });

    const editBannerButton = document.createElement('button');
    editBannerButton.textContent = '🖼️ Update Banner Image';
    editBannerButton.className =
      'edit-banner-button w-full max-w-xs md:w-55 flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 transition-all active:scale-95 md:w-60';

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
      updateBannerForm.style.display =
        updateBannerForm.style.display === 'none' ? 'block' : 'none';
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
    profileContainer.append(editActions);
    /*     profileContainer.append(editButton, updateForm);
    profileContainer.append(editBannerButton, updateBannerForm); */
  }

  /*   profileContainer.prepend(banner);
  profileContainer.append(avatar, name, email, followersCount, postsCount); */

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
