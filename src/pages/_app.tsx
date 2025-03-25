import { DefaultMetaData } from "@/components/meta-data";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultMetaData />
      <div className={`${poppins.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
