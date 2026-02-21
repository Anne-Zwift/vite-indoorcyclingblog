import { getPostsByProfile, getProfile } from '../api/Client';
import { PostCard } from './PostCard';
import type { PostDetails } from '../types/Post';
import type { Profile } from '../types/Profile';
import { createMinimalAuthorFromProfile } from '../utils/profileDefaults';

export const ProfileView = async (
  profileName?: string | undefined,
): Promise<HTMLElement> => {
  const profileViewContainer = document.createElement('div');
  profileViewContainer.id = 'profile-view';

  if (!profileName) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Error: Profile name is missing.';

    return errorDiv;
  }

  try {
    const profileData = await getProfile(profileName, '_posts=false');

    const profilePosts = await getPostsByProfile(profileName);

    profileData.posts = profilePosts;

    const header = renderProfileHeader(profileData);
    profileViewContainer.appendChild(header);

    const postList = document.createElement('section');
    postList.classList.add('profile-posts');

    let posts: PostDetails[] = profileData.posts || [];

    if (posts.length > 0) {
      const injectedAuthor = createMinimalAuthorFromProfile(profileData);

      posts = posts.map((post) => {
        if (!post.author || !post.author.name) {
          return {
            ...post,
            author: injectedAuthor,
          };
        }
        return post;
      });

      posts.forEach((post) => {
        postList.appendChild(PostCard(post, false));
      });
    } else {
      const noPosts = document.createElement('p');
      noPosts.textContent = `${profileName} hasn't posted anything yet.`;
      postList.appendChild(noPosts);
    }

    profileViewContainer.appendChild(postList);
  } catch (error) {
    console.error('Error loading profile:', error);
    profileViewContainer.textContent = `Error loading profile: ${profileName}`;
  }

  return profileViewContainer;
};

const renderProfileHeader = (profileData: Profile): HTMLDivElement => {
  const header = document.createElement('div');
  header.className = 'profile-header w-full max-w-5xl mx-auto px-4';

  const profileContainer = document.createElement('div');
  profileContainer.className = 'user-profile relative w-full mb-10';

  const avatar = document.createElement('img');
  avatar.src = profileData.avatar?.url || 'placeholder-avatar.png';
  avatar.alt = profileData.avatar?.alt || `${profileData.name}'s avatar`;
  avatar.className =
    'profile-avatar absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white z-10';

  const banner = document.createElement('img');
  banner.src = profileData.banner?.url || 'placeholder-banner.png';
  banner.alt = profileData.banner?.alt || `${profileData.name}'s banner`;
  banner.className =
    'profile-banner w-full aspect-[16/7] object-cover rounded-xl shadow-md';

  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'mt-16 mb-10 md:mt-4 md:ml-60 flex flex-col items-center md:items-start text-center md:text-left';

  const name = document.createElement('h2');
  name.textContent = profileData.name;
  name.className = 'text-3xl font-bold text-gray-900 dark:text-slate-100';

  const email = document.createElement('p');
  email.textContent = `${profileData.email}`;

  const followCount = document.createElement('p');
  followCount.textContent = `Followers: ${profileData._count.followers || 0}`;

  const postsCount = document.createElement('p');
  postsCount.textContent = `Total Posts: ${profileData._count?.posts || 0}`;

  profileContainer.append(banner, avatar);
  contentWrapper.append(name, email, followCount, postsCount);

  header.append(profileContainer, contentWrapper);

  return header as HTMLDivElement;
};
