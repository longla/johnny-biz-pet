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
      content="https://www.ruhrohretreat.com/ruhrohretreat-social.jpg"
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
      content="https://www.ruhrohretreat.com/ruhrohretreat-social.jpg"
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
          image: "https://www.ruhrohretreat.com/ruhrohretreat-social.jpg",
          url: "https://www.ruhrohretreat.com",
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
            "https://www.facebook.com/ruhrohretreat",
            "https://www.instagram.com/ruhrohretreat",
          ],
        }),
      }}
    />
  </Head>
);

type BlogPostMetaDataProps = {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  hasCoverImage: boolean;
};

export function BlogPostMetaData({
  title,
  description,
  date,
  author,
  slug,
  hasCoverImage,
}: BlogPostMetaDataProps) {
  const imageUrl = hasCoverImage
    ? `https://www.ruhrohretreat.com/posts/${slug}/cover.jpg`
    : "https://www.ruhrohretreat.com/ruhrohretreat-social.jpg";

  const fullTitle = `${title} - Ruh-Roh Retreat Blog`;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta property="article:published_time" content={date} />
      <meta property="article:author" content={author} />
      <meta property="article:section" content="Pet Care Blog" />
      <meta
        property="article:tag"
        content="pet care, pet boarding, dog boarding, cat boarding, luxury pet care"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta
        property="og:url"
        content={`https://www.ruhrohretreat.com/blog/${slug}`}
      />
      <meta property="og:site_name" content="Ruh-Roh Retreat" />
      <meta property="article:published_time" content={date} />
      <meta property="article:author" content={author} />
      <meta property="article:section" content="Pet Care Blog" />
      <meta
        property="article:tag"
        content="pet care, pet boarding, dog boarding, cat boarding, luxury pet care"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@ruhrohretreat" />

      {/* Additional SEO Meta Tags */}
      <meta
        name="keywords"
        content="pet care, pet boarding, dog boarding, cat boarding, luxury pet care, ${title.toLowerCase()}"
      />
      <meta name="robots" content="index, follow" />
      <link
        rel="canonical"
        href={`https://www.ruhrohretreat.com/blog/${slug}`}
      />

      {/* Schema.org markup for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            description: description,
            image: imageUrl,
            datePublished: date,
            dateModified: date,
            author: {
              "@type": "Person",
              name: author,
            },
            publisher: {
              "@type": "Organization",
              name: "Ruh-Roh Retreat",
              logo: {
                "@type": "ImageObject",
                url: "https://www.ruhrohretreat.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.ruhrohretreat.com/blog/${slug}`,
            },
          }),
        }}
      />
    </Head>
  );
}
