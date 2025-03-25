export type Post = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  author?: string;
  hasCoverImage: boolean;
};
