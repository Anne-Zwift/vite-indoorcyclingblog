import { getPostDetails} from "../api/Client";
import { PostCard } from "../components/PostCard";
import { CommentComponent } from "../components/CommentComponent";
import { CommentForm } from "../components/CommentForm";
import { showTempMessage } from "../utils/message";
/**
 * Renders the individual Post page structure.
 * @param {string} postId - The unique ID of the post, passed from the router.
 * @returns {HTMLDivElement} the main container for the page content.
 */

export function PostPage(postId: string = ''): HTMLDivElement  {
  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-page';
  pageContainer.classList.add('p-6', 'max-w-4xl', 'mx-auto');

  const postContentWrapper = document.createElement('div');
  postContentWrapper.id = 'post-detail-container';

  if (!postId) {
   postContentWrapper.innerHTML = '<h1>Error: Post ID is missing.</h1>';
   pageContainer.appendChild(postContentWrapper);
   return pageContainer;
}

postContentWrapper.innerHTML = '<h1 class="text-xl">Loading Post Details...</h1><p>Fetching post data...</p> ';
pageContainer.appendChild(postContentWrapper);

  const abortController = new AbortController();

  pageContainer.addEventListener('DOMNodeRemovedFromDocument', () => {
    abortController.abort();
  });

  const fetchAndRenderPost = () => {
    const signal = abortController.signal;
  
  getPostDetails(postId, signal)
  .then(post => {
    postContentWrapper.innerHTML = '';

    const dynamicTitle = document.createElement('h1');
    dynamicTitle.textContent = post.title;
    dynamicTitle.classList.add('text-3xl', 'font-bold', 'mb-4', 'text-gray-800');

    const detailElement = PostCard(post, true);
    detailElement.classList.add('mb-6')

    postContentWrapper.appendChild(detailElement);

    const commentForm = CommentForm({
      postId: postId,
      onCommentSuccess: () => {
        showTempMessage(pageContainer, 'Comment posted! Refreshing...', false);
        fetchAndRenderPost();
      }
    });

    commentForm.classList.add('mb-8', 'border-t', 'pt-4');

    const commentsSection = document.createElement('section');
    commentsSection.classList.add('comments-section');

    const commentsHeader = document.createElement('h3');
    commentsHeader.textContent = `Comments (£${post._count.comments})`;
    commentsHeader.classList.add('text-2xl', 'font-semibold', 'mb-4', 'border-b', 'pb-2');
    commentsSection.appendChild(commentsHeader);

    if (post.comments && post.comments.length > 0) {
      const sortedComments = post.comments.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

      sortedComments.forEach(comment => {
        commentsSection.appendChild(CommentComponent(comment));
      });
    } else {
      const noComments = document.createElement('p');
      noComments.textContent = 'No comment yet. Be the first to reply!';
      noComments.classList.add('italic', 'text-gray-500');
      commentsSection.appendChild(noComments);
    }

    postContentWrapper.append(dynamicTitle, detailElement, commentForm, commentsSection);

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
    <h1 class="text-4xl text-red-600">Post Loading Failed</h1>
    <p class="text-xl">${errorMessage}</p>
    `;
  });
};

fetchAndRenderPost();

return pageContainer;

}
