import { createPost } from "../api/Client";
import { PostForm } from "../components/PostForm";

/**
 * Renders the PostForm component for creating a new post.
 */
export function PostCreatePage(_param?: string): HTMLDivElement {
  return PostForm();
}