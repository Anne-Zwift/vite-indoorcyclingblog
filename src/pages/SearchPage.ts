import { SearchInput } from '../components/SearchInput';
import {
  getSearchProfiles,
  getSearchPosts,
  getPostsByProfile,
} from '../api/Client';
import { renderProfileResults, renderPostResults } from '../utils/searchUtils';
import type { PostDetails } from '../types/Post';
import type { Profile } from '../types/Profile';
import { createMinimalAuthorFromProfile } from '../utils/profileDefaults';
import { ProfileView } from '../components/ProfileView';

/**
 * Renders the main search page, including the search input and the results area.
 * @returns {HTMLDivElement} The container for the Search page.
 */

export const SearchPage = async (): Promise<HTMLDivElement> => {
  const searchPageContainer = document.createElement('div');
  searchPageContainer.className =
    'search-page flex flex-col max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 my-8 justify-center items-center text-center gap-4';

  searchPageContainer.innerHTML =
    '<h1 class="text-2xl font-bold text-center mb-2 text-sky-600 md:text-3xl xl:text-4xl">Search</h1>';

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'flex flex-col items-center w-full mt-4';

  const handleSearch = async (query: string) => {
    resultsContainer.innerHTML = `
    <div class="flex flex-col items-center gap-2">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-hover-button"></div>
    <p class="text-secondary font-p">Searching for posts and profiles...</p>
    </div>`;

    const profileSearchPromise = getSearchProfiles(query);
    const postsSearchPromise = getSearchPosts(query);

    const [postPromiseResult, profilePromiseResult] = await Promise.allSettled([
      postsSearchPromise,
      profileSearchPromise,
    ]);

    let posts: PostDetails[] = [];
    let profiles: Profile[] = [];
    let errorMessage = '';

    if (postPromiseResult.status === 'fulfilled') {
      posts = postPromiseResult.value;
    } else {
      console.error('Failed to fetch posts:', postPromiseResult.reason);
      errorMessage += 'Could not fetch posts.';
    }

    if (profilePromiseResult.status === 'fulfilled') {
      profiles = profilePromiseResult.value;
    } else {
      console.error('Failed to fetch profiles:', profilePromiseResult.reason);
      errorMessage += 'Could not fetch profiles. ';
    }

    const exactProfileMatch = profiles.find(
      (p) => p.name.toLocaleLowerCase() === query.toLocaleLowerCase(),
    );

    if (posts.length === 0 && exactProfileMatch) {
      try {
        posts = await getPostsByProfile(exactProfileMatch.name);

        errorMessage = errorMessage
          .replace('Could not fetch posts.', '')
          .trim();
      } catch (error) {
        console.error('Failed to fetch posts via author fallback:', error);
      }
    }

    if (exactProfileMatch) {
      const injectedAuthor = createMinimalAuthorFromProfile(exactProfileMatch);

      posts = posts.map((post) => {
        if (
          !post.author ||
          !post.author.name ||
          post.author.name.toLocaleLowerCase() ===
            injectedAuthor.name.toLocaleLowerCase()
        ) {
          return {
            ...post,
            author: injectedAuthor,
          };
        }
        return post;
      });
    }

    resultsContainer.innerHTML = '';

    if (errorMessage) {
      resultsContainer.innerHTML = `<p class="error-message">Error fetching search results: ${errorMessage.trim()}</p>`;
    }

    if (exactProfileMatch) {
      const profileViewElement = await ProfileView(exactProfileMatch.name);

      const profileHeading = document.createElement('h2');
      profileHeading.textContent = `Profile: ${exactProfileMatch.name}`;
      profileHeading.className =
        'text-xl font-h1 font-bold mt-8 mb-4 text-p-text self-start';
      resultsContainer.appendChild(profileHeading);
      resultsContainer.appendChild(profileViewElement);


      const otherProfiles = profiles.filter(
        (p) => p.name.toLocaleLowerCase() !== query.toLocaleLowerCase(),
      );

      if (otherProfiles.length > 0) {
        const otherProfilesHeading = document.createElement('h3');
        otherProfilesHeading.textContent = `Other Profile Matches (${otherProfiles.length})`;
        otherProfilesHeading.className = 'text-xl font-h1 font-bold mt-8 mb-4 text-p-text self-start';

        resultsContainer.appendChild(otherProfilesHeading);
        resultsContainer.appendChild(renderProfileResults(otherProfiles));
      }

      if (posts.length > 0) {
        const postsHeading = document.createElement('h3');
        postsHeading.className = 'text-xl font-h1 font-bold mt-8 mb-4 text-p-text self-start';
        postsHeading.textContent = `Related Posts (${posts.length})`;
        resultsContainer.appendChild(postsHeading);
        resultsContainer.appendChild(renderPostResults(posts));
      }
    } else if (posts.length > 0 || profiles.length > 0) {
      resultsContainer.appendChild(renderProfileResults(profiles));
      resultsContainer.appendChild(renderPostResults(posts));
    }

    if (posts.length === 0 && profiles.length === 0 && !errorMessage) {
      resultsContainer.innerHTML = `<p>No results found for '${query}'.</p>`;
    }
  };

  /**Append the search input component */

  const searchInputComponent = SearchInput(handleSearch);
  searchPageContainer.appendChild(searchInputComponent);

  searchPageContainer.appendChild(resultsContainer);

  return searchPageContainer;
};
