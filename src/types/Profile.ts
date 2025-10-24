import type { Media } from "./Media";

export interface Profile {
  name: string;
  email: string;
  bio: string | null;
  avatar: Media;
  banner: Media;
  accessToken: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

export type UserProfileData = Omit<Profile, 'accessToken'>;