import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
type MainLayoutProps = {
  children: React.ReactNode;
  title?: string; // Make title optional
  description?: string;
  image?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => (
  <>
    <div className="mainContainer h-[60px]  flex items-center justify-between">
      <Link href="/" className="logo text-2xl font-bold hover:no-underline">
        <span className="text-primary-500">QR</span>
        <span className="text-gray-950">ganiz</span>
      </Link>
      <a
        href="https://www.amazon.com/dp/B0DHWMZP82"
        className="flex items-center px-4 py-1 text-white text-sm rounded-full bg-primary-500 hover:brightness-110"
      >
        <ShoppingCartIcon className="mr-2 w-4" />
        Buy on Amazon
      </a>
    </div>
    <main>{children}</main>
    <div className="relative w-full h-24">
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-24"
        >
          <path
            d="M0,0V120H1200V0C1000,60 600,120 0,0Z"
            className="fill-primary-600"
          ></path>
          <path
            d="M0,0V120H1200V0C1000,60 600,120 0,0Z"
            className="fill-primary-600"
            opacity="0.5"
          ></path>
        </svg>
      </div>
    </div>
    <section className="mainContainer bg-primary-600 text-white">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="flex gap-3 my-4">
          <Link href="/terms-of-use">Term of Use</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div>
          ©2025 <span className="font-bold">JOY</span> Digital Solutions, LLC.
          All rights reserved.
        </div>
      </div>
    </section>
  </>
);

export default MainLayout;
