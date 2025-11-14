import { getPosts, getPostsFromFollowing } from "../api/Client";
import { PostCard } from "../components/PostCard";
import { state } from "../utils/store";
import { navigate } from "../utils/router";


/**
 * Renders the main Post Feed page structure, optionally filtered by a tag or feed mode.
 * @param {string} [tag] - Optional tag name passed from the router (e.g.,/tag/cycling) or 'following' (for /following).
 * @returns {HTMLDivElement} the main container for the page content.
 */

export async function PostFeed(tag?: string): Promise<HTMLDivElement> {

  const currentHash = window.location.hash.slice(1).toLocaleLowerCase();
  const isFollowingFeed = currentHash === '/following' && state.isLoggedIn;


  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-feed-page';

  //form components
  const title = document.createElement('h1');
  title.textContent = tag ? `Posts Tagged: #${tag}` : (isFollowingFeed ? 'Post from People You Follow' : 'Indoor Off Season Activities');

  const subtitle = document.createElement('h2');
  subtitle.textContent = isFollowingFeed ? 'View the latest posts from your inner circle.' : 'Get inspired for indoor Cycling. View the latest posts from our community.';

  const toggleButton = document.createElement('button');
  toggleButton.classList.add('feed-toggle-button');

  if (state.isLoggedIn && !tag) {
    toggleButton.textContent = isFollowingFeed ? '⬅️ View All Posts' : 'View Following Feed ➡️';

    toggleButton.addEventListener('click', () => {
      if (isFollowingFeed) {
        navigate('/');
      } else {
        navigate('#/following');
      }
    });
  }

  //reactivity will be added to the btn, hidden/shown based on login status.
  const actionButton = document.createElement('button');
  actionButton.id = 'create-post-button';
  actionButton.textContent = 'Create New Post';
  actionButton.style.display = state.isLoggedIn ? '' : 'none';//for now removed the 'block'

  actionButton.addEventListener('click', () => {
    navigate('/create');
  });

  const postsContainer = document.createElement('div');
  postsContainer.id = 'posts-container';
  postsContainer.innerHTML = '<p>The posts are loading...</p>';

  const abortController = new AbortController();
  const signal = abortController.signal;

  pageContainer.addEventListener('DOMNodeRemovedFromDocument', () => {
    abortController.abort();
  });

 pageContainer.append(title, subtitle);

 if (state.isLoggedIn && !tag) {
  pageContainer.append(toggleButton);
 }

 pageContainer.append(actionButton, postsContainer);

 //1E logic

 try {
  let posts;

  if (isFollowingFeed) {
    posts = await getPostsFromFollowing(signal);
  } else {
    posts = await getPosts(tag, signal);
  }

  postsContainer.innerHTML = '';

  if (posts.length === 0) {
    postsContainer.innerHTML = isFollowingFeed
    ? `<p>You are not following any users or they have not posted yet.</p>`
    : (tag
      ? `<p>No posts found tagged with #${tag}.</p>`
      : `<p>No posts found. Be the first to post!</p>`);
    return pageContainer;
  }
 

    //loop and render

    posts.forEach(post => {
      const postElement = PostCard(post);
      postsContainer.appendChild(postElement);

      postElement.addEventListener('click', (e) => {

        if (e.target instanceof HTMLElement && e.target.closest('.tag-link')) {
          return;
        }
        navigate(`/post/${post.id}`);
    });
  });

} catch (error) {
    if (error && typeof error === 'object' && 'name' in error && 'message' in error) {
      const err = error as Error;

      if (err.name === 'AbortError') {
        console.log('Fetch aborted: PostFeed component unmounted.');
        return pageContainer;
      }

      const feedType = isFollowingFeed ? 'Following' : (tag ?'Tag Filter' : 'All');
    
    console.error(`Failed to fetch ${feedType} posts:`, err);
    const errorMessage = err.message || 'Check your network or API status.';

    postsContainer.innerHTML = `
    <p class="error-message">❌ Error loading the ${feedType} feed.</p>
    <p>Details: ${errorMessage}</p>
    `;
  } else {
    console.error('An unknown error occurred while fetching posts:', error);
    postsContainer.innerHTML = `
    <p class='error-message'>❌ An unexpected error occurred.</p>
    `;
  }
}

  return pageContainer;
}

