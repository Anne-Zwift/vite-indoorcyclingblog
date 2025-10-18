import { getPosts } from "../api/Client";
import { PostCard } from "../components/PostCard";
import { state } from "../utils/store";

/**
 * Renders the main Post Feed page structure.
 * @returns {HTMLDivElement} the main container for the page content.
 */

export function PostFeed(): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-feed-page';
  //form components
  const title = document.createElement('h1');
  title.textContent = 'Social Feed';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'View the latest posts from our community.';

  //reactivity will be added to the btn, hidden/shown based on login status.
  const actionButton = document.createElement('button');
  actionButton.id = 'create-post-button';
  actionButton.textContent = 'Create New Post';
  actionButton.style.display = state.isLoggedIn ? 'block' : 'none';

  const postsContainer = document.createElement('div');
  postsContainer.id = 'posts-container';
  postsContainer.innerHTML = '<p>The posts are loading...</p>';

 pageContainer.append(title, subtitle, actionButton, postsContainer);

 //1E logic

 getPosts()
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
    });
  })

  .catch(error => {
    console.error("Failed to fetch posts:", error);
    postsContainer.innerHTML = `
    <p class="error-message">❌ Error loading the feed.</p>
    <p>Details: ${error.message}</p>
    `;
  });

  return pageContainer;
}

