interface SocialMediaLink {
  type: string;
  link: string;
}

interface Geo {
  latitude: number;
  longitude: number;
}

interface Location {
  fullAddress: string;
  country: string;
  state: string;
  city: string;
}

interface Venue {
  id: string;
  name: string;
  createdAt: string;
  geo: Geo;
  address: string;
  location: Location;
  venueTypes: string[];
  totalVibeCount: number;
  activeVibeCount: number;
  externalProvider: string;
  externalId: string;
  complaints: number;
  bookmarks: number;
}

interface Author {
  id: string;
  userName: string;
  description: string;
  picture: any; // It seems there is no picture field in the provided response
  hasAutoUserName: boolean;
  socialMediaLinks: SocialMediaLink[];
  likes: number;
  complaints: number;
  totalVibeCount: number;
  activeVibeCount: number;
  bookmarks: number;
}

interface Tag {
  name: string;
}

export interface PorstDetailsValue {
  expiresAt: string;
  author: Author;
  message: string;
  pictures: any[]; // It seems there are no pictures in the provided response
  tags: Tag[];
  distance: number;
  complaints: number;
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  anonymous: boolean;
  isEphemeral: boolean;
  state: string;
  groupId: string;
  isRecurring: boolean;
  credit: number;
  id: string;
  venueId: string;
  venue: Venue;
  isTop: boolean;
  icon: string;
  points: number;
  publishedAt: string;
  startsAt: string;
}

export interface PostDetailsResponse {
  value: PorstDetailsValue;
  success: boolean;
  messages: any[];
}
