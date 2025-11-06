import type { Profile, UserProfileData } from "../types/Profile";

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

export const createMinimalAuthorFromProfile = (profile: Profile): UserProfileData => {
  return {
    name: profile.name,
    email: profile.email,
    bio: profile.bio || null,
    avatar: profile.avatar || MINIMAL_PROFILE_STUB.avatar,
    banner: profile.banner || MINIMAL_PROFILE_STUB.banner,
    followers: profile.followers || [],
    following: profile.following || [],
    _count: profile._count || MINIMAL_PROFILE_STUB._count,
  };
};