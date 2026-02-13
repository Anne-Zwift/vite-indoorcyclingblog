import { PostForm } from '../components/PostForm';
import { handlePostCreation } from '../utils/postUtils';

/**
 * Renders the PostForm component for creating a new post.
 */
export function PostCreatePage(_param?: string): HTMLDivElement {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'max-w-2xl mx-auto p-6';

  const createForm = PostForm({
    onSubmit: handlePostCreation,
    submitText: 'Create Post',
  });

  pageContainer.append(createForm);

  return pageContainer;
}
