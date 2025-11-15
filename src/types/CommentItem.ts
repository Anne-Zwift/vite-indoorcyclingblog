import type { Profile } from "./Profile";

export interface CommentItem {
  body: string;
  replyToId: null | number;
  id: number;
  postId: number;
  owner: string;
  created: string;
  author: Profile;
}