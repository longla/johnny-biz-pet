# Ruh-Roh Retreat Project Notes

## Build Commands

- Development: `npm run dev`
- Build: `npm run build`
- Production: `npm run start`
- Clean: `npm run clean` (removes .next directory)
- Lint: `npm run lint`

## Environment

- Next.js: 15.1.7
- React: 19.0.0
- Node.js: v23.6.0
- npm: 11.1.0

## Project Structure

- Blog posts are stored as Markdown files in `/posts/` directory
- SSG is used for blog pages with getStaticProps and getStaticPaths
- `gray-matter` parses the post metadata
- `react-markdown` renders the post content

## SEO Information

- Business name: Ruh-Roh Retreat
- Primary keywords: luxury pet boarding, overnight pet care, premium pet accommodation
- Target audience: Pet owners who need reliable and comfortable pet boarding while they're away
- Service areas: Local regions (customize in the landing page service areas section)
- Contact: hello@ruhrohretreat.com, +1 (714) 329-4534

## Design Choices

- Primary color: Green (#3dc756) - Represents freshness, nature, and growth
- Font: Poppins - Modern, clean, professional yet friendly
- Animation: Framer Motion for subtle, playful interactions that appeal to pet owners
- Layout: Mobile-first responsive design with focused sections
