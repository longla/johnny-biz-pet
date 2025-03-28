import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <meta
          name="title"
          content="Ruh-Roh Retreat - Not Your Average Pet Sitter"
        />
        <meta
          name="description"
          content="Trustworthy, reliable pet care with regular photo updates and peace of mind. Premium overnight boarding service providing luxury accommodations and specialized care for your furry family members."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ruhrohretreat.com/" />
        <meta
          property="og:title"
          content="Ruh-Roh Retreat - Not Your Average Pet Sitter"
        />
        <meta
          property="og:description"
          content="Premium overnight boarding with luxury accommodations and specialized add-on services tailored to your pet's needs. Certified pet care specialist with over 7 years of experience."
        />
        <meta
          property="og:image"
          content="https://www.ruhrohretreat.com/hero-image.jpeg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Ruh-Roh Retreat" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.ruhrohretreat.com/" />
        <meta
          name="twitter:title"
          content="Ruh-Roh Retreat - Not Your Average Pet Sitter"
        />
        <meta
          name="twitter:description"
          content="Premium overnight boarding with luxury accommodations and specialized add-on services tailored to your pet's needs. Certified pet care specialist with over 7 years of experience."
        />
        <meta
          name="twitter:image"
          content="https://www.ruhrohretreat.com/hero-image.jpeg"
        />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#f9f5eb" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="text-size-adjust" content="100%" />

        {/* Existing scripts */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "qvefgax38w");
            `,
          }}
        />
        {/* <!-- Google tag (gtag.js) --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2PE34Z4HB1"
        ></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
 window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2PE34Z4HB1');`,
          }}
        ></script>
        {/* Safari font rendering fix - load early to avoid FOUT */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Safari font rendering fix - helps ensure fonts are properly loaded
              (function() {
                // Detect Safari
                var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                
                // Apply Safari-specific optimizations
                if (isSafari) {
                  // Add Safari class to HTML for targeted CSS fixes
                  document.documentElement.classList.add('safari');
                  
                  // Add a load event for Safari font rendering
                  window.addEventListener('load', function() {
                    // Force reflow which helps with font rendering in Safari
                    document.body.style.opacity = '0.99';
                    setTimeout(function() {
                      document.body.style.opacity = '1';
                      document.documentElement.classList.add('fonts-loaded-safari');
                    }, 100);
                  });
                } else {
                  // For non-Safari browsers, just mark fonts as loaded
                  document.documentElement.classList.add('fonts-loaded-safari');
                }
              })();
            `,
          }}
        />
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/varelaround/v13/w8gdH283Tvk__Lua32TysjIfp8uP.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/fredokaone/v8/k3kUo8kEI-tA1RRcTZGmTlHGCac.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/comicneue/v4/4UaHrEJDsxBrF37olUeD96rp57F2IwM.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
