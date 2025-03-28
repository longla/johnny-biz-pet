import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPaw, FaTimes } from "react-icons/fa";

type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const photosPerPage = 6; // Show 6 photos per page (2 rows of 3)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/gallery-photos");
        const data = await response.json();
        setPhotos(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const goToPreviousMobile = () => {
    setMobileCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNextMobile = () => {
    setMobileCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPreviousPage = () => {
    setDesktopPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    const maxPage = Math.ceil(photos.length / photosPerPage) - 1;
    setDesktopPage((prev) => Math.min(maxPage, prev + 1));
  };

  const currentPagePhotos = photos.slice(
    desktopPage * photosPerPage,
    (desktopPage + 1) * photosPerPage
  );

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentIndex, goToPrevious, goToNext, closeLightbox]);

  // Paw print loading animation
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <FaPaw className="text-6xl text-[#F28C38]" />
        </motion.div>
      </div>
    );
  }

  return (
    <section id="gallery" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Furry Friends Gallery
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Paws, whiskers, and wagging tails - memories of our adorable guests!
          </p>
        </div>

        {/* Mobile Photo Carousel (visible only on mobile) */}
        <div className="block sm:hidden mb-8">
          <div className="relative">
            {/* Current photo */}
            <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-md">
              {photos.length > 0 && (
                <Image
                  src={photos[mobileCurrentIndex].src}
                  alt={photos[mobileCurrentIndex].alt}
                  fill
                  sizes="100vw"
                  priority
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>

            {/* Navigation buttons */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80 rounded-full p-3 transition-colors duration-200 shadow-lg"
              onClick={goToPreviousMobile}
              aria-label="Previous image"
            >
              <FaArrowLeft className="text-gray-800" />
            </button>

            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/60 hover:bg-white/80 rounded-full p-3 transition-colors duration-200 shadow-lg"
              onClick={goToNextMobile}
              aria-label="Next image"
            >
              <FaArrowRight className="text-gray-800" />
            </button>

            {/* Paw indicators */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-2 pt-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileCurrentIndex(i)}
                  className="transition-colors duration-200 p-1"
                >
                  <FaPaw
                    className={`${
                      i === mobileCurrentIndex
                        ? "text-[#F28C38]"
                        : "text-gray-400"
                    } ${i === mobileCurrentIndex ? "text-base" : "text-sm"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Photo Grid with Pagination */}
        <div className="hidden sm:block">
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-h-[800px] overflow-hidden">
              {currentPagePhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                  }}
                  onClick={() =>
                    openLightbox(photo, index + desktopPage * photosPerPage)
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="transition-all duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Navigation Arrows */}
            {desktopPage > 0 && (
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
                onClick={goToPreviousPage}
                aria-label="Previous page"
              >
                <FaArrowLeft className="text-[#1A9CB0] text-xl" />
              </button>
            )}
            {desktopPage < Math.ceil(photos.length / photosPerPage) - 1 && (
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
                onClick={goToNextPage}
                aria-label="Next page"
              >
                <FaArrowRight className="text-[#1A9CB0] text-xl" />
              </button>
            )}

            {/* Page Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({
                length: Math.ceil(photos.length / photosPerPage),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setDesktopPage(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === desktopPage ? "bg-[#1A9CB0] w-4" : "bg-gray-300"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeLightbox();
                }
              }}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] w-full mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors duration-200"
                  onClick={closeLightbox}
                >
                  <FaTimes className="text-white text-xl" />
                </button>

                {/* Navigation buttons */}
                <button
                  className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/60 rounded-full p-3 transition-colors duration-200 z-20 ml-2 md:ml-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="Previous image"
                >
                  <FaArrowLeft className="text-white text-base md:text-lg" />
                </button>

                <button
                  className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/60 rounded-full p-3 transition-colors duration-200 z-20 mr-2 md:mr-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next image"
                >
                  <FaArrowRight className="text-white text-base md:text-lg" />
                </button>

                {/* Image */}
                <div className="relative w-full" style={{ height: "80vh" }}>
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    fill
                    sizes="100vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </motion.div>

              {/* Paw print indicators */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(photos[i]);
                      setCurrentIndex(i);
                    }}
                    className={`transition-colors duration-200 p-1`}
                  >
                    <FaPaw
                      className={`${
                        i === currentIndex ? "text-[#F28C38]" : "text-white/50"
                      } ${i === currentIndex ? "text-xl" : "text-base"}`}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PhotoGallery;
