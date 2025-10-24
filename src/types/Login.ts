import type { UserProfileData } from "./Profile";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  profile: UserProfileData;
}
