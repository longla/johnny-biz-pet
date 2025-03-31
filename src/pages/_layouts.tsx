import { DefaultMetaData } from "@/components/meta-data";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

type MainLayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  description,
  image,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <DefaultMetaData />
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 h-[80px] flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-logo">
              <Image
                src="/logo.png"
                alt="Ruh-Roh Retreat Logo"
                width={320}
                height={80}
                priority
              />
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 h-[80px] items-center">
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
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1A9CB0]"
          >
            <span className="sr-only">Open menu</span>
            {!mobileMenuOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="text-logo">
                <Image
                  src="/logo.png"
                  alt="Ruh-Roh Retreat Logo"
                  width={320}
                  height={80}
                  priority
                />
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-[#1A9CB0]"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <nav className="flex-1 flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#services"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/#about"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/#testimonials"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/#booking"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Now
              </Link>
              <Link
                href="/#meet-greet"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Meet & Greet
              </Link>
              <Link
                href="/blog"
                className="text-xl font-medium text-gray-800 hover:text-[#1A9CB0]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </nav>
            <div className="p-4 border-t">
              <div className="flex flex-col space-y-2">
                <a
                  href="tel:+17143294534"
                  className="text-gray-600 hover:text-[#1A9CB0] flex items-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +1 (714) 329-4534
                </a>
                <a
                  href="mailto:hello@ruhrohretreat.com"
                  className="text-gray-600 hover:text-[#1A9CB0] flex items-center"
                >
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  hello@ruhrohretreat.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer Section */}
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
    </>
  );
};

export default MainLayout;
