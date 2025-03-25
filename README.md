# Paws At Home - Professional Pet Sitting Services

This is the official website for Paws At Home, a professional pet sitting service providing loving, reliable pet care in the comfort of your home.

## Features

- Modern, responsive landing page with animations using Framer Motion
- SEO-optimized with proper metadata and structured data
- Blog section with content management through markdown files
- Contact form for service inquiries
- Mobile-friendly design

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Parsing markdown front-matter
- [React Markdown](https://github.com/remarkjs/react-markdown) - Rendering markdown content

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/components` - React components
- `/src/pages` - Next.js pages
- `/src/styles` - Global CSS styles
- `/src/lib` - Utility functions
- `/posts` - Markdown blog posts
- `/public` - Static assets

## Blog System

Blog posts are written in Markdown format and stored in the `/posts` directory. Each post has front matter with metadata:

```markdown
---
title: "Post Title"
excerpt: "Brief excerpt about the post"
date: "2023-01-01"
author: "Author Name"
cover_image: true
---

Post content goes here...
```

## License

All rights reserved © Paws At Home