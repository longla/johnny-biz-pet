# QRganiz Home Project Notes

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