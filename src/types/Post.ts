// Import Media, Profile, ReactionItem and CommentItem from respective files
import type { Media } from "./Media";
import type { Profile } from "./Profile";
import type { ReactionItem } from "./ReactionItem";
import type { CommentItem } from "./CommentItem";

export interface PostDetails {
  id: number;
  title: string;
  body: string;
  tags: string[];
  media: Media | null;
  created: string;
  updated: string;
  author: Profile;
  reactions: ReactionItem[];
  comments: CommentItem[];
  _count: {
    comments: number;
    reactions: number;
  };
}


