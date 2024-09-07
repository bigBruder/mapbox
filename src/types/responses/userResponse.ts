export type CreateUserResponse = {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  totalVotes: number;
  uid: number;
};

export type AuthData = {
  expiresIn: string;
  idToken: string;
  refreshToken: string;
  uid: string;
  userId: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  lastVotedAt?: string;
  totalVotes?: number;
};
