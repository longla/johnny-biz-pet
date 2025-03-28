import { DefaultMetaData } from "@/components/meta-data";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Add font loading detection to prevent FOUT (Flash of Unstyled Text)
  useEffect(() => {
    // Add a class when fonts are loaded to enable transitions
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add("fonts-loaded");
      });
    } else {
      // Fallback for browsers that don't support document.fonts
      setTimeout(() => {
        document.documentElement.classList.add("fonts-loaded");
      }, 300);
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <style>{`
          /* Hide content briefly until fonts load (prevents FOUT) */
          html:not(.fonts-loaded) * {
            transition: none !important;
          }
          
          /* Safari-specific fixes */
          @supports (-webkit-touch-callout: none) {
            /* iOS Safari specific styles go here */
            body {
              /* Disable font adjustment in iOS Safari */
              -webkit-text-size-adjust: 100%;
            }
            
            /* Fix Safari font weight rendering */
            h1, h2, h3, h4, h5, h6, .text-logo {
              -webkit-font-smoothing: antialiased;
            }
          }
        `}</style>
      </Head>
      <DefaultMetaData />
      <div className="font-sans">
        <Component {...pageProps} />
      </div>
    </>
  );
}
