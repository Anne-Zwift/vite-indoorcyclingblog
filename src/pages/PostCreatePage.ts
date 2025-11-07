import { PostForm } from "../components/PostForm";
import { handlePostCreation } from "../utils/postUtils";


/**
 * Renders the PostForm component for creating a new post.
 */
export function PostCreatePage(_param?: string): HTMLDivElement {
  return PostForm({
    onSubmit: handlePostCreation,
    submitText: 'Create Post'
  });
}