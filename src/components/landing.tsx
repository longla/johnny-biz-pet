import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import services from "../lib/services.js";
import FloatingBone from "./floating-bone";
import FloatingYogaDog from "./floating-yoga-dog";
import PhotoGallery from "./photo-gallery";

type Testimonial = {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
};

function LandingComponent() {
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    petName: "",
    petType: "dog",
    startDate: "",
    endDate: "",
    addons: {} as { [key: string]: boolean },
    notes: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookingRef = useRef<HTMLElement>(null);
  const meetGreetRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);

  // Add state to track Calendly loading status
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

  // Add state for date validation and nights calculation
  const [dateError, setDateError] = useState("");
  const [nightsCount, setNightsCount] = useState<number | null>(null);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [highlightedTestimonials, setHighlightedTestimonials] = useState<
    Testimonial[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hero slideshow state
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroIntervalRef = useRef<NodeJS.Timeout>();
  const testimonialIntervalRef = useRef<NodeJS.Timeout>();

  // Load hero images
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
        // Fallback to default hero image if API fails
        setHeroImages(["/hero/hero-1.jpeg"]);
      }
    };

    loadHeroImages();
  }, []);

  // Setup slideshow interval
  useEffect(() => {
    if (heroImages.length > 1) {
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000); // Change image every 5 seconds
    }

    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, [heroImages.length]);

  // Navigation functions for hero slideshow
  const goToPreviousHero = () => {
    setCurrentHeroIndex(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
    }
  };

  const goToNextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
      heroIntervalRef.current = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
    }
  };

  // Calculate nights when dates change
  useEffect(() => {
    if (bookingForm.startDate && bookingForm.endDate) {
      const start = new Date(bookingForm.startDate);
      const end = new Date(bookingForm.endDate);

      // Check if end date is after start date
      if (end < start) {
        setDateError("End date must be after start date");
        setNightsCount(null);
      } else {
        setDateError("");
        // Calculate nights between dates
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNightsCount(diffDays);
      }
    } else {
      setNightsCount(null);
    }
  }, [bookingForm.startDate, bookingForm.endDate]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const [reviewsResponse, highlightedReviewsResponse] = await Promise.all(
          [fetch("/data/reviews.json"), fetch("/data/highlighted-reviews.json")]
        );

        if (!reviewsResponse.ok || !highlightedReviewsResponse.ok) {
          throw new Error("Failed to fetch testimonials");
        }

        const [reviews, highlightedReviews] = await Promise.all([
          reviewsResponse.json(),
          highlightedReviewsResponse.json(),
        ]);

        setTestimonials(reviews);
        setHighlightedTestimonials(highlightedReviews);
        setTestimonialLoading(false);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        setTestimonialLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  const goToPreviousTestimonial = useCallback(() => {
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }
    setCurrentTestimonialIndex((prev) =>
      prev === 0 ? highlightedTestimonials.length - 1 : prev - 1
    );
  }, [highlightedTestimonials.length]);

  const goToNextTestimonial = useCallback(() => {
    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }
    setCurrentTestimonialIndex((prev) =>
      prev === highlightedTestimonials.length - 1 ? 0 : prev + 1
    );
  }, [highlightedTestimonials.length]);

  useEffect(() => {
    testimonialIntervalRef.current = setInterval(() => {
      goToNextTestimonial();
    }, 5000); // Slide every 5 seconds

    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, [highlightedTestimonials.length, goToNextTestimonial]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value,
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setBookingForm({
      ...bookingForm,
      addons: {
        ...bookingForm.addons,
        [name]: checked,
      },
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    (window as any).clarity?.("event", "Request Booking Clicked");

    // Validate dates before submission
    if (dateError) {
      alert("Please correct the date error before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the booking request to our API endpoint
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "An error occurred while submitting your booking request"
        );
      }

      // Show success message
      setFormSubmitted(true);

      // Ensure we stay on the booking section
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Reset form
      setBookingForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        petName: "",
        petType: "dog",
        startDate: "",
        endDate: "",
        addons: {} as { [key: string]: boolean },
        notes: "",
      });
      setNightsCount(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "There was an error submitting your booking request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll to booking section when "Book Now" is clicked
  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to meet & greet section when "Meet & Greet" is clicked
  const scrollToMeetGreet = () => {
    meetGreetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to testimonials section when "Read Reviews" is clicked
  const scrollToTestimonials = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load Calendly script once component is mounted
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;

    // Set up event listener to detect when Calendly is loaded
    script.onload = () => {
      // Calendly needs a bit of time to initialize after script loads
      const checkCalendlyLoaded = setInterval(() => {
        // Check if Calendly widget is initialized
        if (document.querySelector(".calendly-inline-widget iframe")) {
          setIsCalendlyLoading(false);
          clearInterval(checkCalendlyLoaded);
        }
      }, 300);

      // Fallback timeout in case the iframe check doesn't work
      setTimeout(() => {
        setIsCalendlyLoading(false);
        clearInterval(checkCalendlyLoaded);
      }, 5000);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Render testimonial card
  const renderTestimonialCard = (testimonial: Testimonial) => (
    <motion.div
      key={testimonial.id}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col"
    >
      <div className="flex items-center mb-4">
        <Image
          src={testimonial.image}
          alt={`${testimonial.name}'s pet`}
          width={60}
          height={60}
          className="rounded-full mr-4"
          style={{ objectFit: "cover" }}
        />
        <div>
          <h4 className="font-semibold text-[#333333]">{testimonial.name}</h4>
          <div className="flex text-yellow-400">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <FaStar key={i} className="h-5 w-5" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 italic flex-grow">{testimonial.text}</p>
    </motion.div>
  );

  const renderAllReviewsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center py-4">
      <div className="bg-white rounded-lg shadow-lg flex flex-col max-w-full mx-4 w-full h-full sm:max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">All Reviews</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-2xl">
            &times;
          </button>
        </div>
        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name}'s pet`}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <h4 className="font-semibold text-[#333333]">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <FaStar key={i} className="h-5 w-5" />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Testimonials Section
  const renderTestimonialsSection = () => (
    <section id="testimonials" ref={testimonialsRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            What My Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take my word for it - here&apos;s what pet parents
            have to say about my services.
          </p>
        </div>

        {testimonialLoading ? (
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative overflow-x-hidden">
              <div className="max-w-2xl mx-auto relative">
                {highlightedTestimonials.length > 0 &&
                  renderTestimonialCard(
                    highlightedTestimonials[currentTestimonialIndex]
                  )}
                <button
                  onClick={goToPreviousTestimonial}
                  className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-[#1A9CB0] hover:text-[#F28C38] transition-colors"
                  aria-label="Previous testimonial"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNextTestimonial}
                  className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-[#1A9CB0] hover:text-[#F28C38] transition-colors"
                  aria-label="Next testimonial"
                >
                  <FaArrowRight className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-2 px-6 rounded-full text-lg transition-colors duration-300"
                >
                  View All Reviews
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
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
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
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
                transition={{
                  duration: 1.2,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.3,
                }}
                className="absolute inset-0 bg-black"
              />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white flex flex-col justify-center items-center text-center pb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.5,
            }}
            className="max-w-2xl"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.6,
              }}
            >
              Boutique In-Home Dog Sitting — Structured Care, Happy Tails
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-white/90"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.7,
              }}
            >
              Your dog deserves more than just care — they deserve a vacation.
            </motion.p>
            <motion.p
              className="text-lg md:text-xl mb-8 text-white/90"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.75,
              }}
            >
              Ruh-Roh Retreat connects pet parents with independent sitters who share our boutique philosophy of structure, comfort, and personalized attention.
            </motion.p>
          </motion.div>
        </div>

        {/* Hero CTAs and Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent pt-8 pb-4">
          <div className="container mx-auto px-4">
            {/* Call-to-action buttons */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 80 }} // Increased y for more space
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.8,
              }}
            >
              <button
                onClick={scrollToBooking}
                className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
              >
                🐾 Find a Sitter
              </button>
              <button
                onClick={scrollToMeetGreet}
                className="bg-[#1A9CB0] hover:bg-[#158294] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
              >
                📩 Submit a Request
              </button>
            </motion.div>

            {/* Slideshow Navigation */}
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
                        currentHeroIndex === index
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/75"
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

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              💛 Why Pet Parents Choose Ruh-Roh Retreat
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Our boutique philosophy is built around four pillars of comfort, structure, and trust.
              Each independent sitter in our network chooses to align with these values, helping pups feel safe, happy, and right at home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1: Boutique Comfort */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Boutique Comfort
              </h3>
              <p className="text-gray-600 mb-4">
                Small groups, cozy home stays, and personalized attention.
                Sitters who align with this pillar host fewer dogs to ensure calm, low-stress stays.
              </p>
            </div>

            {/* Pillar 2: Structured & Safe */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">🧘</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Structured & Safe
              </h3>
              <p className="text-gray-600 mb-4">
                Balanced routines, mindful introductions, and calm environments.
                Sitters emphasize consistency and smooth transitions to help dogs settle comfortably.
              </p>
            </div>

            {/* Pillar 3: Transparent Communication */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Transparent Communication
              </h3>
              <p className="text-gray-600 mb-4">
                Daily photo and video updates keep you connected, no matter where you are.
                Many sitters also offer live video check-ins or meet-and-greets before your dog’s stay.
              </p>
            </div>

            {/* Pillar 4: Personalized Vacations */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Personalized Vacations
              </h3>
              <p className="text-gray-600 mb-4">
                Every pup deserves a tailored experience.
                Pet parents can choose fun enrichment add-ons to make their dog’s stay feel like a true retreat.
                Add-ons vary by sitter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              ✨ Vacation-Style Add-Ons
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Make your dog’s stay extra special with enrichment activities that balance fun, comfort, and relaxation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Add-on 1: Sniffari Nature Walks */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500"
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl text-blue-500">🌳</div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  Sniffari Nature Walks
                </h3>
                <p className="text-gray-600">adventure walks that engage your dog’s senses</p>
              </div>
            </motion.div>

            {/* Add-on 2: PAW-casso Painting */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500"
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl text-green-500">🎨</div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  PAW-casso Painting
                </h3>
                <p className="text-gray-600">a keepsake masterpiece created by your pup</p>
              </div>
            </motion.div>

            {/* Add-on 3: Pup Cup & Treat Outings */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500"
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl text-purple-500">☕</div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  Pup Cup & Treat Outings
                </h3>
                <p className="text-gray-600">coffee-shop trips for wagging tails</p>
              </div>
            </motion.div>

            {/* Add-on 4: Cuddle & Movie Night */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-red-500"
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl text-red-500">🎥</div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  Cuddle & Movie Night
                </h3>
                <p className="text-gray-600">cozy downtime with cuddles and a film</p>
              </div>
            </motion.div>

            {/* Add-on 5: Massage & Brushing */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-yellow-500"
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl text-yellow-500">💆</div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  Massage & Brushing
                </h3>
                <p className="text-gray-600">spa-style care for coat and comfort</p>
              </div>
            </motion.div>

            {/* Add-on 6: Calming Aromatherapy */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-indigo-500"
              whileHover={{
                y: -10,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl text-indigo-500">🪷</div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">
                  Calming Aromatherapy
                </h3>
                <p className="text-gray-600">helps anxious pups unwind and rest easy</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Additional options such as obedience refreshers or puzzle feeders may be available. Add-ons vary by sitter.
            </p>
            <button
              onClick={scrollToBooking}
              className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-4 px-10 rounded-full text-xl transition-transform transform hover:scale-105 duration-300 shadow-lg"
            >
              Book Your Pet's Stay
            </button>
          </div>
        </div>
        <FloatingYogaDog />
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              🧭 How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Booking through Ruh-Roh Retreat is simple, transparent, and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl text-[#F28C38] mb-4">🐶</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Browse Sitters
              </h3>
              <p className="text-gray-600">
                View sitter profiles with photos, reviews, home details, and Ruh-Roh Badges.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl text-[#1A9CB0] mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Submit a Request
              </h3>
              <p className="text-gray-600">
                Choose your sitter, enter dates, and share details about your pup.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl text-[#F28C38] mb-4">👋</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Meet & Greet
              </h3>
              <p className="text-gray-600">
                Your chosen sitter contacts you to schedule a meet-and-greet and confirm fit.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-5xl text-[#1A9CB0] mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">
                Book & Relax
              </h3>
              <p className="text-gray-600">
                Once booked, your sitter provides updates while your dog enjoys their boutique retreat.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-sm text-gray-500 italic">
              Ruh-Roh Retreat connects clients and independent sitters but does not set pricing, guarantee services, or supervise sitters.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Sitters Section */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              🐕‍🦺 Meet Our Sitters
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Our sitters are independent professionals who share the Ruh-Roh philosophy of structure, calm, and compassion.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
              <li>
                <span className="font-semibold">Verified client reviews</span>
              </li>
              <li>
                <span className="font-semibold">Ruh-Roh Badges earned</span>
              </li>
              <li>
                <span className="font-semibold">Home environment details</span>
              </li>
              <li>
                <span className="font-semibold">Personalized bio</span>
              </li>
            </ul>
            <p className="text-center text-sm text-gray-500 italic mt-8">
              Sitters manage their own schedules, pricing, and bookings.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="relative">
        <PhotoGallery />
        <FloatingBone />
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <Image
                src="/about-image.jpg"
                alt="Pet sitter with pets"
                width={600}
                height={450}
                className="rounded-lg shadow-lg"
                objectFit="cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-6">
                About Me
              </h2>
              <motion.p
                className="text-lg text-gray-700 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Hi, I'm Johnny! I run a boutique-style dog care experience out
                of my peaceful home, where your pup is treated like family and
                pampered like they're on vacation. After over 15 years of
                hands-on experience—including time as a vet assistant—I left the
                corporate world behind to do what I love full-time: caring for
                dogs.
              </motion.p>
              <motion.p
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Every stay is customized to your dog's personality and needs.
                Whether they're shy and sensitive or playful and high-energy, I
                create a calm, nurturing space where they can thrive. I'm home
                all day, which means your pup gets round-the-clock attention,
                comfort, and companionship. No crowded kennels, no rushed potty
                breaks—just a safe, cozy retreat designed for relaxation and
                joy.
              </motion.p>
              <motion.p
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                And yes, I go the extra mile. From enrichment walks and cuddle
                time to optional extras like PAW-casso paintings and storytime,
                I make sure each dog feels safe, engaged, and loved while you're
                away. My place is kept sparkling clean, and I send tons of
                updates so you'll always know your pup is happy and in good
                hands.
              </motion.p>
              <motion.p
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                I genuinely care about every dog that comes through my door—and
                I think it shows. Let's give your pup the kind of care you wish
                every dog could have.
              </motion.p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Feature 1 */}
                <motion.div
                  className="flex items-center bg-purple-50 p-4 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, backgroundColor: "#f3e8ff" }}
                >
                  <div className="w-12 h-12 mr-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span className="text-indigo-800 font-medium">
                    15+ Years Experience
                  </span>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  className="flex items-center bg-pink-50 p-4 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, backgroundColor: "#fce7f3" }}
                >
                  <div className="w-12 h-12 mr-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-pink-800 font-medium">
                    Medication Administration
                  </span>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  className="flex items-center bg-blue-50 p-4 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, backgroundColor: "#eff6ff" }}
                >
                  <div className="w-12 h-12 mr-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-800 font-medium">
                    Background Checked
                  </span>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  className="flex items-center bg-amber-50 p-4 rounded-xl shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, backgroundColor: "#fef3c7" }}
                >
                  <div className="w-12 h-12 mr-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-amber-800 font-medium">
                    Regular Photo Updates
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      {renderTestimonialsSection()}

      {/* Booking Section */}
      <section id="booking" ref={bookingRef} className="py-20 bg-[#F4F4F9]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Book My Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to request pet care services. I'll get
              back to you within 24 hours to confirm your booking.
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Booking Request Received!
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your request. I've received your booking details
                and will contact you shortly to confirm your reservation.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  // Ensure we stay on the booking section
                  setTimeout(() => {
                    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="bg-[#1A9CB0] hover:bg-[#158294] text-white font-bold py-2 px-6 rounded-full text-lg transition-colors duration-300"
              >
                Make Another Booking
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={bookingForm.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={bookingForm.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="petName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Pet Name *
                    </label>
                    <input
                      type="text"
                      id="petName"
                      name="petName"
                      required
                      value={bookingForm.petName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="petType"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Pet Type *
                    </label>
                    <select
                      id="petType"
                      name="petType"
                      required
                      value={bookingForm.petType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      required
                      value={bookingForm.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]} // Prevent past dates
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      End Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      required
                      value={bookingForm.endDate}
                      onChange={handleInputChange}
                      min={
                        bookingForm.startDate ||
                        new Date().toISOString().split("T")[0]
                      } // Make end date after start date
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0] ${
                        dateError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {dateError && (
                      <p className="text-red-500 text-sm mt-1">{dateError}</p>
                    )}
                  </div>
                </div>

                {/* Display number of nights */}
                {nightsCount !== null && !dateError && (
                  <div className="mb-6 p-4 bg-[#F4F9F9] rounded-lg">
                    <p className="text-center text-gray-700 font-medium">
                      {nightsCount === 1
                        ? "Your booking is for 1 night"
                        : `Your booking is for ${nightsCount} nights`}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-3">
                    Additional Services (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(services).map(([category, addons]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {category}
                        </h4>
                        {addons.map((addon) => (
                          <div
                            key={addon.name}
                            className="flex items-center mb-2"
                          >
                            <input
                              type="checkbox"
                              id={addon.name}
                              name={addon.name}
                              checked={bookingForm.addons[addon.name] || false}
                              onChange={handleCheckboxChange}
                              className="w-5 h-5 text-[#1A9CB0] border-gray-300 rounded focus:ring-[#1A9CB0]"
                            />
                            <label
                              htmlFor={addon.name}
                              className="ml-2 text-gray-700"
                            >
                              {addon.name} ({addon.price})
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="notes"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                    placeholder="Tell us about any special requirements, your pet's routine, or other important details..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || !!dateError}
                    className={`${
                      isSubmitting || dateError
                        ? "bg-gray-400"
                        : "bg-[#F28C38] hover:bg-[#e07a26]"
                    } text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 relative paw-button`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Request Booking"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>





      {/* Schema Markup for Local Business - Keeping this to provide structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Ruh-Roh Retreat",
            image: "https://www.ruhrohretreat.com",
            url: "https://www.ruhrohretreat.com",
            telephone: "+17143294534",
            address: {
              "@type": "PostalAddress",
              streetAddress: "13212 Telmo",
              addressLocality: "Irvine",
              addressRegion: "CA",
              postalCode: "92618",
              addressCountry: "US",
            },
            priceRange: "$$",
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "08:00",
                closes: "18:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Saturday"],
                opens: "09:00",
                closes: "17:00",
              },
            ],
            sameAs: [
              "https://www.facebook.com/ruhrohretreat",
              "https://www.instagram.com/ruhrohretreat",
            ],
          }),
        }}
      />
      {isModalOpen && renderAllReviewsModal()}
    </div>
  );
}

export default LandingComponent;
