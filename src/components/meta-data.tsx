import Head from "next/head";

export const DefaultMetaData = () => (
  <Head>
    <title>Ruh-Roh Retreat - Premium Pet Boarding Services</title>
    <meta
      name="description"
      content="Luxury overnight boarding with premium add-on services for your pets. Providing trustworthy and reliable pet care with regular photo updates and peace of mind."
    />

    {/* Twitter Card Metadata */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Ruh-Roh Retreat - Premium Pet Boarding Services"
    />
    <meta
      name="twitter:description"
      content="Luxury overnight boarding with premium add-on services for your pets. Providing trustworthy and reliable pet care with regular photo updates and peace of mind."
    />
    <meta
      name="twitter:image"
      content="https://www.ruhrohrretreat.com/ruhrohrretreat-social.jpg"
    />

    {/* Open Graph Metadata */}
    <meta
      property="og:title"
      content="Ruh-Roh Retreat - Premium Pet Boarding Services"
    />
    <meta
      property="og:description"
      content="Luxury overnight boarding with premium add-on services for your pets. Providing trustworthy and reliable pet care with regular photo updates and peace of mind."
    />
    <meta
      property="og:image"
      content="https://www.ruhrohrretreat.com/ruhrohrretreat-social.jpg"
    />
    <meta property="og:type" content="website" />

    {/* Schema.org structured data for local business */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Ruh-Roh Retreat",
          image: "https://www.ruhrohrretreat.com/ruhrohrretreat-social.jpg",
          url: "https://www.ruhrohrretreat.com",
          telephone: "+17143294534",
          address: {
            "@type": "PostalAddress",
            streetAddress: "12207 Pintado",
            addressLocality: "Irvine",
            addressRegion: "CA",
            postalCode: "92618",
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 33.6583,
            longitude: -117.7384,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "07:00",
            closes: "21:00",
          },
          sameAs: [
            "https://www.facebook.com/ruhrohrretreat",
            "https://www.instagram.com/ruhrohrretreat",
          ],
        }),
      }}
    />
  </Head>
);

export const BlogMetaData = () => (
  <Head>
    <title>Ruh-Roh Retreat Blog - Pet Care Tips & Advice</title>
    <meta
      name="description"
      content="Discover tips, guides, and best practices for pet care, boarding, and creating a happy environment for your pets. Learn about pet health, behavior, and more."
    />

    {/* Twitter Card Metadata */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Ruh-Roh Retreat Blog - Pet Care Tips & Advice"
    />
    <meta
      name="twitter:description"
      content="Discover tips, guides, and best practices for pet care, boarding, and creating a happy environment for your pets. Learn about pet health, behavior, and more."
    />
    <meta
      name="twitter:image"
      content="https://www.ruhrohrretreat.com/ruhrohrretreat-social.jpg"
    />

    {/* Open Graph Metadata */}
    <meta
      property="og:title"
      content="Ruh-Roh Retreat Blog - Pet Care Tips & Advice"
    />
    <meta
      property="og:description"
      content="Discover tips, guides, and best practices for pet care, boarding, and creating a happy environment for your pets. Learn about pet health, behavior, and more."
    />
    <meta
      property="og:image"
      content="https://www.ruhrohrretreat.com/ruhrohrretreat-social.jpg"
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
    ? `https://www.ruhrohrretreat.com/posts/${slug}/cover.jpg`
    : "https://www.ruhrohrretreat.com/ruhrohrretreat-social.jpg";

  const fullTitle = `${title} - Ruh-Roh Retreat Blog`;

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
      <meta
        property="og:url"
        content={`https://www.ruhrohrretreat.com/blog/${slug}`}
      />
    </Head>
  );
};
