export interface Stats {
  lastDayVotes: number;
  totalUniqueUsers: number;
  totalVotes: number;
}

export interface Topic {
  author: {
    createdAt: string | null;
    id: number;
    name: string;
    lastVotedAt: string | null;
    totalVotes: number;
  };
  authorId: number;
  description: string | null;
  endsAt: string;
  icon: string;
  id: number;
  // keywords: string | null;
  // location: string | null;
  startsAt: string;
  stats: Stats;
  title: string;
}

export type CellInfoResponse = Topic[];
