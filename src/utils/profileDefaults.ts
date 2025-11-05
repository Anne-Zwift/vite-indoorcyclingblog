import type { UserProfileData } from "../types/Profile";

export const MINIMAL_PROFILE_STUB: UserProfileData = {
  name: 'placeholder',
  email: '',
  bio: null,
  avatar: {
    url: '',
    alt: ''
  },
  banner: {
    url: '',
    alt: ''
  },
  followers: [],
  following: [],
  _count: {
    posts: 0,
    followers: 0,
    following: 0,
  },
};