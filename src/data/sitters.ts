import sitterData from "../../data/sitters.json";

export type SitterLocation = {
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  serviceRadiusMiles: number;
};

export type SitterBadge = {
  key: string;
  title: string;
  description: string;
  earned: boolean;
};

export type SitterServices = {
  primary: string[];
  addOns?: string[];
};

export type SitterReview = {
  id: string;
  client: string;
  pet: string;
  rating: number;
  date: string;
  text: string;
  image?: string;
  source?: string;
};

export type Sitter = {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  heroImage: string;
  locations: SitterLocation[];
  bio: string[];
  homeEnvironment: string[];
  badges: SitterBadge[];
  services: SitterServices;
  reviews: SitterReview[];
  availabilityNotes?: string;
  contactEmail?: string;
};

export const sitters: Sitter[] = sitterData;

export function getSitterById(id: string): Sitter | undefined {
  return sitters.find((sitter) => sitter.id === id);
}
