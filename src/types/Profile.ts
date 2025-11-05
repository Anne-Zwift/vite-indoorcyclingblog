import type { Media } from "./Media";
import type { PostDetails } from "./Post";


export interface Profile {
  name: string;
  email: string;
  bio: string | null;
  avatar: Media;
  banner: Media;
  accessToken: string;
  followers?: UserProfileData[];
  following?: UserProfileData[];
  posts?: PostDetails[];
  _count: {
    posts: number;
    followers: number;
    following: number;
  };


}

export type UserProfileData = Omit<Profile, 'accessToken'>;