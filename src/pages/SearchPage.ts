import { SearchInput } from "../components/SearchInput";
import { getSearchProfiles, getSearchPosts, getPostsByProfile } from "../api/Client";
import { renderProfileResults, renderPostResults } from "../utils/searchUtils";
import type { PostDetails } from "../types/Post";
import type { Profile } from "../types/Profile";
import { createMinimalAuthorFromProfile } from "../utils/profileDefaults";
import { ProfileView } from "../components/ProfileView";

/**
 * Renders the main search page, including the search input and the results area.
 * @returns {HTMLDivElement} The container for the Search page.
 */

export const SearchPage = async (): Promise<HTMLDivElement> => {
  const searchPageContainer = document.createElement('div');
  searchPageContainer.className = 'search-page';
  searchPageContainer.innerHTML = '<h1>Search</h1>';

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results-container';

  const handleSearch = async (query: string) => {
    resultsContainer.innerHTML = '<p>Searching for posts and profiles...</p>';

  const profileSearchPromise = getSearchProfiles(query);
  const postsSearchPromise = getSearchPosts(query);


  const [postPromiseResult, profilePromiseResult] = await Promise.allSettled([postsSearchPromise, profileSearchPromise]);

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

    const exactProfileMatch = profiles.find(p => p.name.toLocaleLowerCase() === query.toLocaleLowerCase());
    

    if (posts.length === 0 && exactProfileMatch) {
      try {
        posts = await getPostsByProfile(exactProfileMatch.name);

        errorMessage = errorMessage.replace('Could not fetch posts.', '').trim();
      } catch (error) {
        console.error('Failed to fetch posts via author fallback:', error);
      }
    }

    if (exactProfileMatch) {
      const injectedAuthor = createMinimalAuthorFromProfile(exactProfileMatch);

      posts = posts.map(post => {
        if (!post.author || !post.author.name || post.author.name.toLocaleLowerCase() === injectedAuthor.name.toLocaleLowerCase()) {
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
      resultsContainer.appendChild(profileHeading);
      resultsContainer.appendChild(profileViewElement);

      const otherProfiles = profiles.filter(p => p.name.toLocaleLowerCase() !== query.toLocaleLowerCase());

      if (otherProfiles.length > 0) {
        const otherProfilesHeading = document.createElement('h3');
        otherProfilesHeading.textContent = `Other Profile Matches (${otherProfiles.length})`;
        resultsContainer.appendChild(otherProfilesHeading);
        resultsContainer.appendChild(renderProfileResults(otherProfiles));
      }

      if (posts.length > 0) {
        const postsHeading = document.createElement('h3');
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

