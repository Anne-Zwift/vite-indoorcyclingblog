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

  const postsContainer = document.createElement('div');
  postsContainer.id = 'posts-container';
  postsContainer.innerHTML = '<p>The posts are loading...</p>';

 pageContainer.append(title, subtitle, actionButton, postsContainer);

  return pageContainer;
}