import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { sitters } from "@/data/sitters";

function getAverageRating(reviewsLength: number, totalStars: number) {
  if (reviewsLength === 0) return null;
  return totalStars / reviewsLength;
}

function SittersPage() {
  return (
    <>
      <Head>
        <title>Meet Our Sitters | Ruh-Roh Retreat</title>
        <meta name="description" content="Browse verified Ruh-Roh Retreat sitters in Irvine and Wildomar." />
      </Head>
      <Header />
      <main className="bg-[#F4F4F9] min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="uppercase tracking-widest text-sm font-semibold text-[#1A9CB0]">Meet Our Sitters</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mt-4">Handpicked hosts for boutique dog vacations</h1>
            <p className="text-lg text-gray-600 mt-4">
              Every Ruh-Roh sitter earns badges for communication, stability, and spotless home environments. Compare locations
              below and open a profile to explore bios, services, and verified reviews.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {sitters.map((sitter) => {
              const totalStars = sitter.reviews.reduce((sum, review) => sum + review.rating, 0);
              const reviewsCount = sitter.reviews.length;
              const averageRating = getAverageRating(reviewsCount, totalStars);

              return (
                <article key={sitter.id} className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
                  <div className="relative h-56 w-full">
                    <Image src={sitter.heroImage} alt={`${sitter.name}'s home`} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[#333333]">{sitter.name}</h2>
                        <p className="text-sm text-gray-500">
                          {sitter.locations.map((location) => `${location.city}, ${location.state}`).join(" • ")}
                        </p>
                      </div>
                      {averageRating && (
                        <div className="flex items-center gap-1 text-[#F6C343]" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
                          <FaStar className="h-5 w-5" />
                          <span className="text-base font-semibold text-[#333333]">{averageRating.toFixed(1)}</span>
                          <span className="text-sm text-gray-500">({reviewsCount})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mt-3">{sitter.bio[0]}</p>

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Badges</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sitter.badges.map((badge) => (
                          <span
                            key={`${sitter.id}-${badge.key}`}
                            className={`text-sm px-3 py-1 rounded-full border ${
                              badge.earned ? "bg-[#1A9CB0]/10 text-[#1A9CB0] border-[#1A9CB0]/30" : "text-gray-400 border-gray-200"
                            }`}
                          >
                            {badge.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <Link
                        href={`/sitters/${sitter.id}`}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#F28C38] text-white font-semibold hover:bg-[#e07a26] transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href="/#booking"
                        className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#1A9CB0] text-white font-semibold hover:bg-[#157c8d] transition-colors"
                      >
                        Book This Sitter
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SittersPage;
