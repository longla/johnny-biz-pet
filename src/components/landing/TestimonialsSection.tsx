import { motion } from "framer-motion";
import Image from "next/image";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

type TestimonialsSectionProps = {
  sectionRef: RefObject<HTMLElement>;
};

type Testimonial = {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
};

const TESTIMONIAL_SLIDE_INTERVAL = 5000;

function TestimonialsSection({ sectionRef }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [highlightedTestimonials, setHighlightedTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const testimonialIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const [reviewsResponse, highlightedReviewsResponse] = await Promise.all([
          fetch("/data/reviews.json"),
          fetch("/data/highlighted-reviews.json"),
        ]);

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
    if (highlightedTestimonials.length === 0) return;

    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }

    setCurrentTestimonialIndex((prev) => (prev === 0 ? highlightedTestimonials.length - 1 : prev - 1));
  }, [highlightedTestimonials.length]);

  const goToNextTestimonial = useCallback(() => {
    if (highlightedTestimonials.length === 0) return;

    if (testimonialIntervalRef.current) {
      clearInterval(testimonialIntervalRef.current);
    }

    setCurrentTestimonialIndex((prev) => (prev === highlightedTestimonials.length - 1 ? 0 : prev + 1));
  }, [highlightedTestimonials.length]);

  useEffect(() => {
    if (highlightedTestimonials.length === 0) return;

    testimonialIntervalRef.current = setInterval(() => {
      goToNextTestimonial();
    }, TESTIMONIAL_SLIDE_INTERVAL);

    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, [highlightedTestimonials.length, goToNextTestimonial]);

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
                    <h4 className="font-semibold text-[#333333]">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <FaStar key={i} className="h-5 w-5" />
                      ))}
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

  return (
    <section id="testimonials" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">What My Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take my word for it - here&apos;s what pet parents have to say about my services.
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
                {highlightedTestimonials.length > 0 && renderTestimonialCard(highlightedTestimonials[currentTestimonialIndex])}
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
      {isModalOpen && renderAllReviewsModal()}
    </section>
  );
}

export default TestimonialsSection;
