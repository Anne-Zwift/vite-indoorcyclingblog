import { getPostDetails } from "../api/Client";
import { PostCard } from "../components/PostCard";
/**
 * Renders the individual Post page structure.
 * @param {string} postId - The unique ID of the post, passed from the router.
 * @returns {HTMLDivElement} the main container for the page content.
 */

export function PostPage(postId: string = ''): HTMLDivElement  {
  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-page';

  const postContentWrapper = document.createElement('div');
  postContentWrapper.id = 'post-detail-container';

  if (!postId) {
   postContentWrapper.innerHTML = '<h1>Error: Post ID is missing.</h1>';
   pageContainer.appendChild(postContentWrapper);
   return pageContainer;
}

postContentWrapper.innerHTML = '<h1>Loading Post Details...</h1><p>Fetching post data...</p> ';
pageContainer.appendChild(postContentWrapper);

  const abortController = new AbortController();
  const signal = abortController.signal;

  pageContainer.addEventListener('DOMNodeRemovedFromDocument', () => {
    abortController.abort();
  });

  getPostDetails(postId, signal)
  .then(post => {
    postContentWrapper.innerHTML = '';

    const detailElement = PostCard(post);
    postContentWrapper.appendChild(detailElement);

    const dynamicTitle = document.createElement('h1');
    dynamicTitle.textContent = `Post by ${post.author.name}`;
    pageContainer.prepend(dynamicTitle);
  })
  .catch (error => {
    if (error.name === 'AbortError') {
      console.log(`Fetch aborted for post ID ${postId}`);
      return;
    }
    console.error(`Failed to fetch post ID ${postId}:`, error);

    const errorMessage = error.message.includes('not found')
    ? `❌ Post ID ${postId} not found.`
    : `❌ Error loading post. Details: ${error.message || 'check network connections.'}`;

    postContentWrapper.innerHTML = `
    <h1>Post Loading Failed</h1>
    <p class="error-message">${errorMessage}</p>
    `;
  });

  return pageContainer;
}