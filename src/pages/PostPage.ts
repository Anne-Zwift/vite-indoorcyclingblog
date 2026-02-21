import { getPostDetails } from '../api/Client';
import { PostCard } from '../components/PostCard';
import { CommentComponent } from '../components/CommentComponent';
import { CommentForm } from '../components/CommentForm';
import { showTempMessage } from '../utils/message';
import { navigate } from '../utils/router';
/**
 * Renders the individual Post page structure.
 * @param {string} postId - The unique ID of the post, passed from the router.
 * @returns {HTMLDivElement} the main container for the page content.
 */

export function PostPage(postId: string = ''): HTMLDivElement {
  console.log('PostPage received ID:', postId);
  const pageContainer = document.createElement('div');
  pageContainer.id = 'post-page';
  pageContainer.classList.add('post-page-container');

  const postContentWrapper = document.createElement('div');
  postContentWrapper.id = 'post-detail-container';

  if (!postId) {
    postContentWrapper.innerHTML = '<h1>Error: Post ID is missing.</h1>';
    pageContainer.appendChild(postContentWrapper);
    return pageContainer;
  }

  postContentWrapper.innerHTML =
    '<h1 class="text-xl">Loading Post Details...</h1><p>Fetching post data...</p> ';
  pageContainer.appendChild(postContentWrapper);

  const abortController = new AbortController();

  pageContainer.addEventListener('DOMNodeRemovedFromDocument', () => {
    abortController.abort();
  });

  const fetchAndRenderPost = () => {
    const signal = abortController.signal;

    getPostDetails(postId, signal)
      .then((post) => {
        postContentWrapper.innerHTML = '';

        const backButton = document.createElement('button');
        backButton.textContent = '⬅️ Back to Feed';

        backButton.className =
          'back-to-feed-button w-48 p-1.5 md:p-2 text-sm bg-(--color-bg-button) hover:bg-(--color-hover-button) dark:bg-slate-500 cursor-pointer transition-transform hover:scale-105 rounded-lg shadow-md';

        backButton.addEventListener('click', () => {
          navigate('/');
        });

        const dynamicTitle = document.createElement('h1');
        dynamicTitle.className = 'block p-1 m-2 md:text-xl';
        dynamicTitle.textContent = post.title;

        const detailElement = PostCard(post, true);

        const commentForm = CommentForm({
          postId: postId,
          onCommentSuccess: () => {
            showTempMessage(
              pageContainer,
              'Comment posted! Refreshing...',
              false,
            );
            fetchAndRenderPost();
          },
        });

        commentForm.classList.add('post-comment-form-wrapper');

        const commentsSection = document.createElement('section');
        commentsSection.className =
          'comments-section flex flex-col gap-4 p-6 bg-(--color-primary) dark:bg-slate-800 rounded-lg shadow-inner mt-8 w-full max-w-2xl mx-auto mb-12';

        const commentsHeader = document.createElement('h3');
        commentsHeader.textContent = `Comments (${post._count.comments})`;
        commentsHeader.classList.add('comments-header');
        commentsSection.appendChild(commentsHeader);

        if (post.comments && post.comments.length > 0) {
          const sortedComments = post.comments.sort(
            (a, b) =>
              new Date(b.created).getTime() - new Date(a.created).getTime(),
          );

          sortedComments.forEach((comment) => {
            commentsSection.appendChild(CommentComponent(comment));
          });
        } else {
          const noComments = document.createElement('p');
          noComments.textContent = 'No comment yet. Be the first to reply!';
          noComments.classList.add('no-comments-message');
          commentsSection.appendChild(noComments);
        }

        postContentWrapper.append(
          backButton,
          dynamicTitle,
          detailElement,
          commentForm,
          commentsSection,
        );
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log(`Fetch aborted for post ID ${postId}`);
          return;
        }
        console.error(`Failed to fetch post ID ${postId}:`, error);

        const errorMessage = error.message.includes('not found')
          ? `❌ Post ID ${postId} not found.`
          : `❌ Error loading post. Details: ${error.message || 'check network connections.'}`;

        postContentWrapper.innerHTML = `
    <h1 class="error-heading">Post Loading Failed</h1>
    <p class="error-text">${errorMessage}</p>
    `;
      });
  };

  fetchAndRenderPost();

  return pageContainer;
}
