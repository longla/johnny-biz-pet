# Ruh-Roh Retreat - Premium Pet Boarding Services

This is the official website for Ruh-Roh Retreat, a premium pet boarding service providing luxury accommodations and specialized care for your furry family members.

## Features

- Modern, responsive landing page with animations using Framer Motion
- SEO-optimized with proper metadata and structured data
- Blog section with content management through markdown files
- Booking form for service reservations
- Mobile-friendly design

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Parsing markdown front-matter
- [React Markdown](https://github.com/remarkjs/react-markdown) - Rendering markdown content

## Environment Variables

The application uses the following environment variables:

```
# Google Gemini AI API Key
GOOGLE_API_KEY=your_api_key

# Email Configuration
EMAIL_HOST=smtp_host
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM=sending_email_address
BOOKING_RECIPIENT_EMAIL=recipient_email_address

# Supabase Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS S3 Configuration
S3_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Admin Account Creation
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### ⚠️ IMPORTANT EMAIL CONFIGURATION NOTE ⚠️

Make sure `EMAIL_SECURE` is set to `false` in production. If set to `true`, the booking email functionality will not work properly. This is because many SMTP providers (including Brevo) require that secure connection is set to false when using port 587 with STARTTLS.

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

All rights reserved © Ruh-Roh Retreat
