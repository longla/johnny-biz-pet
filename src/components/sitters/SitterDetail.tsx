import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

import { Sitter } from "@/data/sitters";
import PhotoGallerySection from "../landing/PhotoGallerySection";
import { Photo } from "../photo-gallery";

type SitterDetailProps = {
  sitter: Sitter;
};

const SitterDetail = ({ sitter }: SitterDetailProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviews = sitter.reviews ?? [];
  const reviewsToDisplay = showAllReviews ? reviews : reviews.slice(0, 1);
  const canToggleReviews = reviews.length > 1;
  const galleryPhotos: Photo[] =
    sitter.gallery?.map((photo, index) => ({
      id: `${sitter.id}-gallery-${index}`,
      src: photo.src,
      alt: photo.alt,
      width: photo.width ?? 1200,
      height: photo.height ?? 800,
    })) ?? [];

  return (
    <section className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
      <div className="relative w-full h-72 md:h-96">
        <Image
          src={sitter.heroImage}
          alt={`${sitter.name}'s home environment`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-8 lg:p-12 space-y-10">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1A9CB0]/10 text-[#1A9CB0] text-sm font-semibold">
              {sitter.locations.map((location) => `${location.city}, ${location.state}`).join(" • ")}
            </span>
            <span className="text-gray-500 text-sm">Serving {sitter.locations[0]?.postalCode ?? ""}</span>
          </div>
          <h1 className="text-4xl font-bold text-[#333333]">{sitter.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{sitter.tagline}</p>

          <div className="mt-8 space-y-4">
            {sitter.bio.map((paragraph, index) => (
              <p key={`${sitter.id}-bio-${index}`} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-[#333333] mb-3">Home Environment</h2>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                {sitter.homeEnvironment.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#333333] mb-3">Ruh-Roh Badges</h2>
              <div className="space-y-3">
                {sitter.badges.map((badge, badgeIndex) => (
                  <div key={`${sitter.id}-badge-${badge.key}-${badgeIndex}`} className="flex items-start gap-3">
                    <div className={`mt-1 h-3 w-3 rounded-full ${badge.earned ? "bg-[#1A9CB0]" : "bg-gray-300"}`} aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-[#333333]">{badge.title}</p>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                      {!badge.earned && <p className="text-xs text-gray-400 mt-1">In progress</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">Services & Add-ons</h2>
            <div className="flex flex-wrap gap-3">
              {sitter.services.primary.map((service) => (
                <span key={`${sitter.id}-${service}`} className="px-4 py-2 bg-[#F4F4F9] rounded-full text-sm font-semibold text-[#333333] border border-gray-100">
                  {service}
                </span>
              ))}
              {sitter.services.addOns?.map((addon) => (
                <span key={`${sitter.id}-addon-${addon}`} className="px-4 py-2 bg-white rounded-full text-sm text-[#1A9CB0] border border-[#1A9CB0]/30">
                  {addon}
                </span>
              ))}
            </div>
          </div>

          {galleryPhotos.length > 0 && (
            <PhotoGallerySection
              photos={galleryPhotos}
              title={`Inside ${sitter.name}'s Retreat`}
              description={`A peek at daily life with ${sitter.name} in ${sitter.locations[0]?.city ?? "our homes"}.`}
              variant="profile"
            />
          )}

          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-3">Verified Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Check back soon!</p>
            ) : (
              <div className="space-y-4">
                {reviewsToDisplay.map((review, reviewIndex) => (
                  <div key={`${review.id}-${reviewIndex}`} className="rounded-2xl bg-[#F4F4F9] p-4 border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#333333]">{review.client}</p>
                        <p className="text-sm text-gray-500">{`Pet: ${review.pet}`}</p>
                      </div>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[#F6C343] mt-2" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }).map((_, starIndex) => (
                        <FaStar key={`${review.id}-star-${starIndex}`} className="h-4 w-4" />
                      ))}
                    </div>
                    <p className="mt-2 text-gray-700 italic">{review.text}</p>
                  </div>
                ))}
                {canToggleReviews && (
                  <button
                    onClick={() => setShowAllReviews((prev) => !prev)}
                    className="text-[#1A9CB0] font-semibold hover:underline"
                  >
                    {showAllReviews ? "Hide additional reviews" : `View ${reviews.length - 1} more reviews`}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm text-gray-500">{sitter.availabilityNotes}</span>
            <div className="ml-auto flex flex-wrap gap-3">
              <Link
                href="/#booking"
                className="inline-flex items-center px-6 py-3 rounded-full bg-[#F28C38] text-white font-semibold hover:bg-[#e07a26] transition-colors"
              >
                Book with {sitter.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SitterDetail;
