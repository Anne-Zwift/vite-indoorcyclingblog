import type { PostDetails, PostRequest, SinglePostResponse } from "./Post";

/**
 * Defines the props accepted by the PostForm component.
 */

export interface PostFormProps {
  initialData?: PostDetails;

  onSubmit?: (data: PostRequest) => Promise<SinglePostResponse | void>;

  submitText?: string;
}


