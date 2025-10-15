import type { Profile } from "./Profile";

export interface CommentItem {
  body: string;
  replyToId: null | number; // or number if comment is reply to another comment
  id: number;
  postId: number;
  owner: string;
  created: string;
  author: Profile;
}