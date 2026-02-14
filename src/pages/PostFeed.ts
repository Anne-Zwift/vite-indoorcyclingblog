import { getPosts, getPostsFromFollowing } from '../api/Client';
import { PostCard } from '../components/PostCard';
import { state } from '../utils/store';
import { navigate } from '../utils/router';
import { createP } from '../utils/domUtils';
import { setupInfiniteScrollObserver } from '../utils/lazyLoadUtils';

const POSTS_PER_PAGE = 20;

/**
 * Renders the main Post Feed page structure, optionally filtered by a tag or feed mode.
 * @param {string} [tag] - Optional tag name passed from the router (e.g.,/tag/cycling) or 'following' (for /following).
 * @returns {HTMLDivElement} the main container for the page content.
 */

export async function PostFeed(tag?: string): Promise<HTMLDivElement> {
  let currentPageIndex = 0;
  let isLoading = false;
  let hasMore = true;
  let currentObserver: IntersectionObserver | null = null;

  const currentHash = window.location.hash.slice(1).toLocaleLowerCase();
  const isFollowingFeed = currentHash === '/following' && state.isLoggedIn;

  const pageContainer = document.createElement('div');
  pageContainer.className = 'flex flex-col max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 my-8 justify-center items-center text-center gap-4';
  pageContainer.id = 'post-feed-page';
  
  const headerSection = document.createElement('div');
  headerSection.className = 'w-full flex flex-col items-center gap-4 mb-6';

  const title = document.createElement('h1');
  title.className = 'text-3xl font-bold text-(--color-secondary)';
  title.textContent = tag
    ? `Posts Tagged: #${tag}`
    : isFollowingFeed
      ? 'Post from People You Follow'
      : 'Indoor Off Season Activities';

  const subtitle = document.createElement('h2');
  subtitle.className = 'max-w-md text-slate-500 text-center';
  subtitle.textContent = isFollowingFeed
    ? 'View the latest posts from your inner circle.'
    : 'Get inspired for indoor Cycling. View the latest posts from our community.';

  const toggleButton = document.createElement('button');
  toggleButton.className = 'w-48 md:self-end p-2 text-sm bg-(--color-bg-button)/40 hover:bg-(--color-hover-button) cursor-pointer transition-transform hover:scale-105 border-none border border-(--color-bg-button) rounded-lg shadow-sm';
  toggleButton.classList.add('feed-toggle-button');

  if (state.isLoggedIn && !tag) {
    toggleButton.textContent = isFollowingFeed
      ? '⬅️ View All Posts'
      : 'View Following Feed ➡️';

    toggleButton.addEventListener('click', () => {
      if (isFollowingFeed) {
        navigate('/');
      } else {
        navigate('#/following');
      }
    });
  }

  const actionButton = document.createElement('button');
  actionButton.id = 'create-post-button';
  actionButton.textContent = 'Create New Post';
  actionButton.className = 'md:self-end w-28 p-1 text-sm bg-(--color-secondary) hover:bg-(--color-hover-button) cursor-pointer transition-transform hover:scale-105 border border-slate-500 rounded-lg shadow-sm';
  actionButton.style.display = state.isLoggedIn ? '' : 'none';

  actionButton.addEventListener('click', () => {
    navigate('/create');
  });

  const postsContainer = document.createElement('div');
  postsContainer.id = 'posts-container';
  postsContainer.className = 'flex flex-col gap-12 w-full max-w-2xl mt-8';

  const sentinel = document.createElement('div');
  sentinel.id = 'infinite-scroll-sentinel';

  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'The posts are loading...';
  loadingMessage.id = 'lazy-loading-status';

  const abortController = new AbortController();
  const signal = abortController.signal;

  pageContainer.addEventListener('DOMNodeRemovedFromDocument', () => {
    abortController.abort();

    if (currentObserver) {
      currentObserver.disconnect();
    }
  });

  pageContainer.append(title, subtitle);

  if (state.isLoggedIn && !tag) {
    pageContainer.append(toggleButton);
  }

  pageContainer.append(actionButton, postsContainer, sentinel, loadingMessage);

  const fetchAndRenderPosts = async (isInitialLoad: boolean = false) => {
    if (isLoading || (!hasMore && !isInitialLoad)) return;

    isLoading = true;
    loadingMessage.textContent = isInitialLoad
      ? 'The posts are loading...'
      : 'Loading more posts...';

    const pageNumber = currentPageIndex + 1;

    try {
      let posts;

      if (isFollowingFeed) {
        posts = await getPostsFromFollowing(signal, POSTS_PER_PAGE, pageNumber);
      } else {
        posts = await getPosts(tag, signal, POSTS_PER_PAGE, pageNumber);
      }

      if (isInitialLoad) {
        postsContainer.innerHTML = '';
      }

      if (posts.length === 0 && currentPageIndex === 0) {
        const emptyMessage = document.createElement('p');
        if (isFollowingFeed) {
          emptyMessage.textContent =
            'You are not following any users or they have not posted yet.';
        } else if (tag) {
          emptyMessage.textContent = `No posts found tagged with #${tag}.`;
        } else {
          emptyMessage.textContent = 'No posts found. Be the first to post!';
        }
        postsContainer.appendChild(emptyMessage);
        loadingMessage.style.display = 'none';
        hasMore = false;
        return;
      }

      if (posts.length < POSTS_PER_PAGE) {
        hasMore = false;
      }

      posts.forEach((post) => {
        const postElement = PostCard(post);
        postsContainer.appendChild(postElement);

        postElement.addEventListener('click', (e) => {
          if (
            e.target instanceof HTMLElement &&
            e.target.closest('.tag-link')
          ) {
            return;
          }
          navigate(`/post/${post.id}`);
        });
      });

      currentPageIndex++;
      isLoading = false;

      if (hasMore) {
        currentObserver = setupInfiniteScrollObserver(
          fetchAndRenderPosts,
          sentinel,
        );
      } else {
        loadingMessage.textContent = 'All posts loaded.';
        loadingMessage.style.display = '';
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        'message' in error
      ) {
        const err = error as Error;

        postsContainer.textContent = '';

        isLoading = false;

        if (err.name === 'AbortError') {
          console.log('Fetch aborted: PostFeed component unmounted.');
          return;
        }

        if (currentObserver) {
          currentObserver.disconnect();
          currentObserver = null;
        }

        const feedType = isFollowingFeed
          ? 'Following'
          : tag
            ? 'Tag Filter'
            : 'All';

        console.error(`Failed to fetch ${feedType} posts:`, err);
        const errorMessage = err.message || 'Check your network or API status.';

        postsContainer.appendChild(
          createP(`❌ Error loading the ${feedType} feed.`, 'error-message'),
        );
        postsContainer.appendChild(createP(`Details: ${errorMessage}`));
      } else {
        console.error('An unknown error occurred while fetching posts:', error);
        postsContainer.appendChild(
          createP('❌ An unexpected error occurred.', 'error-message'),
        );

        isLoading = false;
      }
    }
  };

  await fetchAndRenderPosts(true);

  return pageContainer;
}
