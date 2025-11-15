import sitterData from "../../data/sitters.json";
import testimonialsBySitter from "./testimonials";

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

export type SitterAddOn = {
  name: string;
  price?: string;
  description?: string;
};

export type SitterAddOnCategory = {
  category: string;
  items: SitterAddOn[];
};

export type SitterPrimaryService = {
  name: string;
  description: string;
  price?: string;
};

export type SitterServices = {
  primary: SitterPrimaryService[];
  addOns?: SitterAddOnCategory[];
};

export type SitterGalleryPhoto = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
  uid: string;
  name: string;
  tagline: string;
  avatar: string;
  heroImage: string;
  locations: SitterLocation[];
  bio: string[];
  homeEnvironment: string[];
  badges: SitterBadge[];
  services: SitterServices;
  gallery?: SitterGalleryPhoto[];
  reviews: SitterReview[];
  availabilityNotes?: string;
  contactEmail?: string;
};

const parsedSitters = sitterData as Sitter[];

export const sitters: Sitter[] = parsedSitters.map((sitter) => ({
  ...sitter,
  reviews: testimonialsBySitter[sitter.uid] ?? sitter.reviews ?? [],
}));

export function getSitterById(id: string): Sitter | undefined {
  return sitters.find((sitter) => sitter.id === id);
}
