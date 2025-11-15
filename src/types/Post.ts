// Import Media, Profile, ReactionItem and CommentItem from respective files
import type { Media } from "./Media";
import type { UserProfileData } from "./Profile";
import type { PostReaction } from "./ReactionItem";
import type { CommentItem } from "./CommentItem";
import type { ApiResponse } from "./Api";


export interface PostRequest {
  title: string;
  body?: string;
  tags?: string[];
  media?: Media;
}

export interface PostDetails {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: Media | null;
  created: string;
  updated: string;
  author: UserProfileData;
  reactions: PostReaction[];
  comments: CommentItem[];
  _count: {
    comments: number;
    reactions: number;
  };
}


export interface SinglePostResponse extends ApiResponse<PostDetails> {}

export interface PostListResponse extends ApiResponse<PostDetails[]> {}

