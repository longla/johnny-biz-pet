import Head from "next/head";

export const DefaultMetaData = () => (
  <Head>
    <title>Paws At Home - Professional Pet Sitting Services</title>
    <meta
      name="description"
      content="Loving, reliable pet care in the comfort of your home. Our professional pet sitters provide dog walking, pet visits, and personalized care when you can't be there."
    />

    {/* Twitter Card Metadata */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Paws At Home - Professional Pet Sitting Services"
    />
    <meta
      name="twitter:description"
      content="Loving, reliable pet care in the comfort of your home. Our professional pet sitters provide dog walking, pet visits, and personalized care when you can't be there."
    />
    <meta
      name="twitter:image"
      content="https://pawsathome.com/qrganiz-social.jpg"
    />

    {/* Open Graph Metadata */}
    <meta
      property="og:title"
      content="Paws At Home - Professional Pet Sitting Services"
    />
    <meta
      property="og:description"
      content="Loving, reliable pet care in the comfort of your home. Our professional pet sitters provide dog walking, pet visits, and personalized care when you can't be there."
    />
    <meta
      property="og:image"
      content="https://pawsathome.com/qrganiz-social.jpg"
    />
    <meta property="og:type" content="website" />

    {/* Schema.org structured data for local business */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Paws At Home",
          "image": "https://pawsathome.com/qrganiz-social.jpg",
          "url": "https://pawsathome.com",
          "telephone": "(555) 123-4567",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Your City",
            "addressRegion": "Your State",
            "postalCode": "12345",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 40.7128,
            "longitude": -74.0060
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "07:00",
            "closes": "21:00"
          },
          "sameAs": [
            "https://www.facebook.com/pawsathome",
            "https://www.instagram.com/pawsathome"
          ]
        })
      }}
    />
  </Head>
);

export const BlogMetaData = () => (
  <Head>
    <title>Paws At Home Blog - Pet Care Tips & Advice</title>
    <meta
      name="description"
      content="Discover tips, guides, and best practices for pet care, dog walking, and creating a happy environment for your pets. Learn about pet health, behavior, and more."
    />

    {/* Twitter Card Metadata */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Paws At Home Blog - Pet Care Tips & Advice"
    />
    <meta
      name="twitter:description"
      content="Discover tips, guides, and best practices for pet care, dog walking, and creating a happy environment for your pets. Learn about pet health, behavior, and more."
    />
    <meta
      name="twitter:image"
      content="https://pawsathome.com/qrganiz-social.jpg"
    />

    {/* Open Graph Metadata */}
    <meta
      property="og:title"
      content="Paws At Home Blog - Pet Care Tips & Advice"
    />
    <meta
      property="og:description"
      content="Discover tips, guides, and best practices for pet care, dog walking, and creating a happy environment for your pets. Learn about pet health, behavior, and more."
    />
    <meta
      property="og:image"
      content="https://pawsathome.com/qrganiz-social.jpg"
    />
    <meta property="og:type" content="website" />
  </Head>
);

type BlogPostMetaDataProps = {
  title: string;
  description: string;
  slug: string;
  hasCoverImage: boolean;
  date: string;
};

export const BlogPostMetaData = ({
  title,
  description,
  slug,
  hasCoverImage,
  date,
}: BlogPostMetaDataProps) => {
  const imageUrl = hasCoverImage
    ? `https://pawsathome.com/posts/${slug}/cover.jpg`
    : "https://pawsathome.com/qrganiz-social.jpg";

  const fullTitle = `${title} - Paws At Home Blog`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Twitter Card Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Open Graph Metadata */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={date} />
      <meta property="og:url" content={`https://pawsathome.com/blog/${slug}`} />
    </Head>
  );
};