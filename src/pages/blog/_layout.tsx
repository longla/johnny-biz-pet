import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type BlogLayoutProps = {
  children: React.ReactNode;
};

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-logo">
              <Image
                src="/logo.png"
                alt="Ruh-Roh Retreat Logo"
                width={160}
                height={40}
                priority
              />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-800 hover:text-[#1A9CB0] font-medium"
              >
                Home
              </Link>
              <Link
                href="/#services"
                className="text-gray-800 hover:text-[#1A9CB0] font-medium"
              >
                Services
              </Link>
              <Link
                href="/#about"
                className="text-gray-800 hover:text-[#1A9CB0] font-medium"
              >
                About Me
              </Link>
              <Link
                href="/#testimonials"
                className="text-gray-800 hover:text-[#1A9CB0] font-medium"
              >
                Testimonials
              </Link>
              <Link
                href="/#contact"
                className="text-gray-800 hover:text-[#1A9CB0] font-medium"
              >
                Contact
              </Link>
              <Link
                href="/blog"
                className="text-gray-800 hover:text-[#1A9CB0] font-medium"
              >
                Blog
              </Link>
            </nav>
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-md">
            <div className="container mx-auto px-4 py-2 flex flex-col">
              <Link
                href="/"
                className="py-2 text-gray-800 hover:text-[#1A9CB0] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#services"
                className="py-2 text-gray-800 hover:text-[#1A9CB0] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/#about"
                className="py-2 text-gray-800 hover:text-[#1A9CB0] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Me
              </Link>
              <Link
                href="/#testimonials"
                className="py-2 text-gray-800 hover:text-[#1A9CB0] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/#contact"
                className="py-2 text-gray-800 hover:text-[#1A9CB0] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/blog"
                className="py-2 text-gray-800 hover:text-[#1A9CB0] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-[#333333] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">
                Ruh-Roh Retreat provides premium overnight boarding with luxury
                accommodations and specialized add-on services tailored to your
                pet's needs.
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#services"
                    className="text-gray-300 hover:text-white"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="text-gray-300 hover:text-white"
                  >
                    About Me
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#testimonials"
                    className="text-gray-300 hover:text-white"
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-gray-300 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Contact Info */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>12207 Pintado, Irvine, CA, 92618</li>
                <li>
                  <a href="tel:+17143294534" className="hover:text-white">
                    +1 (714) 329-4534
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@ruhrohretreat.com"
                    className="hover:text-white"
                  >
                    hello@ruhrohretreat.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Legal */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-use"
                    className="text-gray-300 hover:text-white"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>
              &copy; {new Date().getFullYear()} Ruh-Roh Retreat. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
