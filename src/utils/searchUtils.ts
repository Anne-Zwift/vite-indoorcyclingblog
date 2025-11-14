import type { Profile } from "../types/Profile";
import type { PostDetails } from "../types/Post";
import { navigate } from "./router";

/**
 * Renders a list of found user profiles and search results.
 * @param {Profile[]} profiles - Array of matching profile data.
 * @returns {HTMLDivElement} A container with profile results.
 */

export const renderProfileResults = (profiles: Profile[]): HTMLDivElement => {
  const profileResultsContainer = document.createElement('div');
  profileResultsContainer.className = 'search-section profile-results';
  profileResultsContainer.innerHTML = `<h2>Profiles (${profiles.length})</h2>`;

  if (profiles.length === 0) {
    profileResultsContainer.innerHTML += '<p>No matching profiles found.</p>';
    return profileResultsContainer;
  }

  profiles.forEach(profile => {
    const item = document.createElement('div');
    item.className = 'search-result-item profile-item';

    const profileLink = document.createElement('a');
    profileLink.textContent = profile.name;
    profileLink.href = `/#profile/${profile.name}`;

    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(`/profile/${profile.name}`);
    });

    item.appendChild(profileLink);
    profileResultsContainer.appendChild(item);

  });

  return profileResultsContainer;

};

/**
 * Renders a list of found posts as search results.
 * @param {PostDetails[]} posts - Array of matching post data.
 * @returns {HTMLDivElement} A container with the post results.
 */

export const renderPostResults = (posts: PostDetails[]): HTMLDivElement => {
  const postResultsContainer = document.createElement('div');
  postResultsContainer.className = 'search-section post-results';
  postResultsContainer.innerHTML = `<h2>Posts (${posts.length})</h2>`;

  if (posts.length === 0) {
    postResultsContainer.innerHTML += '<p>No matching posts found.</p>';
    return postResultsContainer;
  }

  posts.forEach(post => {
    const item = document.createElement('div');
    item.className = 'search-result-item post-item';

    const postLink = document.createElement('a');
    postLink.textContent = post.title || post.body.substring(0, 50) + '...';
    postLink.href = `/#post/${post.id}`;

    postLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(`/post/${post.id}`);
    });

    item.appendChild(postLink);
    postResultsContainer.appendChild(item);

  });

  return postResultsContainer;

}