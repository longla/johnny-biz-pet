import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type HeroSectionProps = {
  onBookNow: () => void;
  onReadReviews: () => void;
};

const HERO_ROTATION_INTERVAL = 5000;
const HERO_FADE_EASE = cubicBezier(0.4, 0, 0.2, 1);

function HeroSection({ onBookNow, onReadReviews }: HeroSectionProps) {
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const response = await fetch("/api/hero-images");
        if (!response.ok) {
          throw new Error("Failed to fetch hero images");
        }

        const data = await response.json();
        setHeroImages(data.images);
      } catch (error) {
        console.error("Error loading hero images:", error);
        setHeroImages(["/hero/hero-1.jpeg"]);
      }
    };

    loadHeroImages();
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, HERO_ROTATION_INTERVAL);
    }

    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, [heroImages.length]);

  const goToPreviousHero = () => {
    if (heroImages.length === 0) return;

    setCurrentHeroIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, HERO_ROTATION_INTERVAL);
    }
  };

  const goToNextHero = () => {
    if (heroImages.length === 0) return;

    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);

    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, HERO_ROTATION_INTERVAL);
    }
  };

  return (
    <section className="relative h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={image}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentHeroIndex ? 1 : 0,
              scale: index === currentHeroIndex ? 1 : 1.05,
            }}
            transition={{
              duration: 1.2,
              ease: HERO_FADE_EASE,
              opacity: { duration: 1.2, ease: HERO_FADE_EASE },
              scale: { duration: 1.2, ease: HERO_FADE_EASE },
            }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt="Pet sitter playing with dogs"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority={index === 0}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1.2, ease: HERO_FADE_EASE, delay: 0.3 }}
              className="absolute inset-0 bg-black"
            />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 text-white flex flex-col justify-center items-center text-center pb-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: HERO_FADE_EASE, delay: 0.5 }}
          className="max-w-2xl"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: HERO_FADE_EASE, delay: 0.6 }}
          >
            Ruh-Roh Retreat - Not Your Average Pet Sitter
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 text-white/90"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: HERO_FADE_EASE, delay: 0.7 }}
          >
            Trustworthy, reliable pet care where dogs can have fun, be goofy, and feel at ease. Customize their experience with
            unique add-ons tailored to their needs!
          </motion.p>
          <motion.p
            className="text-lg md:text-xl mb-8 text-white/90"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: HERO_FADE_EASE, delay: 0.75 }}
          >
            Over 60 5-star reviews from happy pet parents on Rover
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent pt-8 pb-4">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: HERO_FADE_EASE, delay: 0.8 }}
          >
            <button
              onClick={onBookNow}
              className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
            >
              Book Now
            </button>
            <button
              onClick={onReadReviews}
              className="bg-transparent hover:bg-[#F28C38] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 border-2 border-[#F28C38]"
            >
              Read Reviews
            </button>
            <Link
              href="/sitters"
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 border-2 border-white/40"
            >
              Meet Our Sitters
            </Link>
          </motion.div>

          {heroImages.length > 1 && (
            <div className="flex items-center justify-between">
              <motion.button
                onClick={goToPreviousHero}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/30 hover:bg-white/50 p-3 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <FaArrowLeft className="h-6 w-6 text-white" />
              </motion.button>

              <div className="flex space-x-2">
                {heroImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentHeroIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentHeroIndex === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <motion.button
                onClick={goToNextHero}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/30 hover:bg-white/50 p-3 rounded-full transition-colors"
                aria-label="Next image"
              >
                <FaArrowRight className="h-6 w-6 text-white" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
