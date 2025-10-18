/**
 * Renders the individual Post page structure.
 * @param {string} postId - The unique ID of the post, past from the router.
 * @returns {HTMLDivElement} the main container for the page content.
 */

export function PostPage(postId: string = 'error'): HTMLDivElement  {
  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-page';

  const title = document.createElement('h1');
  title.textContent = `Viewing Post ID: ${postId}`;

  const placeholder = document.createElement('p');
  placeholder.textContent = 'Page successfully loaded';

  pageContainer.append(title, placeholder);

  return pageContainer;
}