import type { Media } from "./Media";

export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}