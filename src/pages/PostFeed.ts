import { getPosts } from "../api/Client";
import { PostCard } from "../components/PostCard";
import { state } from "../utils/store";
import { navigate } from "../utils/router";

/**
 * Renders the main Post Feed page structure.
 * @returns {HTMLDivElement} the main container for the page content.
 */

export function PostFeed(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-feed-page';
  //form components
  const title = document.createElement('h1');
  title.textContent = 'Indoor Off Season Activities';

  const subtitle = document.createElement('h2');
  subtitle.textContent = 'Get inspired for indoor Cycling. View the latest posts from our community.';

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

 pageContainer.append(title, subtitle, actionButton, postsContainer);

 //1E logic

 getPosts(signal)
  .then(posts => {
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>No posts found. Be the first to post!</p>';
      return;
    }

    //loop and render

    posts.forEach(post => {
      const postElement = PostCard(post);
      postsContainer.appendChild(postElement);

      postElement.addEventListener('click', () => {
        navigate(`/posts/${post.id}`);
      })
    });
  })

  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted: PostFeed component unmounted.');
      return;
    }
    console.error("Failed to fetch posts:", error);
    const errorMessage = error.message || 'Check your network or API status.';
    postsContainer.innerHTML = `
    <p class="error-message">❌ Error loading the feed.</p>
    <p>Details: ${errorMessage}</p>
    `;
  });

  return pageContainer;
}

