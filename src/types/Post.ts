// Import Media, Profile, ReactionItem and CommentItem from respective files
import type { Media } from "./Media";
import type { Profile } from "./Profile";
import type { ReactionItem } from "./ReactionItem";
import type { CommentItem } from "./CommentItem";


/**
 * Structure for the data sent to the API when creating a post (POST request).
 * Matches the Noroff Request body:
 * {
  "title": "string", // Required
  "body": "string", // Optional
  "tags": ["string"], // Optional
  "media": {
    "url": "https://url.com/image.jpg",
    "alt": "string"
  } // Optional
}
 */
export interface PostRequest {
  title: string;
  body?: string;
  tags?: string[];
  media?: Media;
}

/**
 * Defines the complete structure of a Post object received from the API (Response body).
 * {
  "data": {
    "id": 0,
    "title": "string",
    "body": "string",
    "tags": ["string"],
    "media": {
      "url": "https://url.com/image.jpg",
      "alt": "string"
    },
    "created": "2022-09-04T16:21:02.042Z",
    "updated": "2022-09-04T16:21:02.042Z",
    "_count": {
      "comments": 0,
      "reactions": 0
    }
  },
  "meta": {}
}
 */
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


