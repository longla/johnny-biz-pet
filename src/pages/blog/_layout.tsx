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
    <>
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-logo">
              Ruh-Roh <span className="highlight">Retreat</span>
            </Link>
          </div>
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

      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer Section */}
      <footer className="bg-[#333333] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 - About */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Ruh-Roh Retreat</h3>
              <p className="mb-4">
                Premium overnight pet boarding service providing luxury
                accommodations and specialized care for your furry family
                members.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-[#F28C38]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#F28C38]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 - Services */}
            <div>
              <h3 className="text-xl font-semibold mb-4">My Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/#services" className="hover:text-[#F28C38]">
                    Luxury Overnight Boarding
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-[#F28C38]">
                    Spa Bath Experience
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-[#F28C38]">
                    Special Care Package
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-[#F28C38]">
                    Premium Play Sessions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Me</h3>
              <address className="not-italic">
                <p className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  12207 Pintado, Irvine, CA, 92618
                </p>
                <p className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +1 (714) 329-4534
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  hello@ruhrohretreat.com
                </p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between">
            <p>
              © {new Date().getFullYear()} Ruh-Roh Retreat. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-[#F28C38]">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="hover:text-[#F28C38]">
                Terms of Use
              </Link>
              <Link href="/blog" className="hover:text-[#F28C38]">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default BlogLayout;
