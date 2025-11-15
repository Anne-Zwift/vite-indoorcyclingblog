import type { Profile } from "./Profile";


export interface PostReaction {
  id: number;
  symbol: string;
  user: {
    name: string;
  } | null;
}
export interface ReactionSummary {
  symbol: string;
  count: number;
  reactors: Profile[];
}