import { motion } from "framer-motion";
import Image from "next/image";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

import { getSitterById, SitterReview } from "@/data/sitters";

type TestimonialsSectionProps = {
  sectionRef: RefObject<HTMLElement>;
};

type Testimonial = SitterReview;

const TESTIMONIAL_SLIDE_INTERVAL = 5000;

function TestimonialsSection({ sectionRef }: TestimonialsSectionProps) {
  const sitter = getSitterById("johnny-irvine");
  const testimonials = useMemo(() => sitter?.reviews ?? [], [sitter]);
  const highlightedTestimonials = useMemo(() => testimonials.slice(0, Math.min(5, testimonials.length)), [testimonials]);
  const sitterName = sitter?.name ?? "Our sitters";
  const sitterPossessive = sitter?.name ? `${sitter.name}'s` : "Our sitters'";
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const testimonialIntervalRef = useRef<NodeJS.Timeout>();

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

  const renderAvatar = (testimonial: Testimonial, size: number) =>
    testimonial.image ? (
      <Image
        src={testimonial.image}
        alt={`${testimonial.client}'s pet`}
        width={size}
        height={size}
        className="rounded-full mr-4"
        style={{ objectFit: "cover" }}
      />
    ) : (
      <div
        className="rounded-full mr-4 bg-[#1A9CB0]/10 text-[#1A9CB0] flex items-center justify-center font-semibold"
        style={{ width: size, height: size }}
      >
        {testimonial.client.charAt(0)}
      </div>
    );

  const renderTestimonialCard = (testimonial: Testimonial) => (
    <motion.div key={testimonial.id} whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        {renderAvatar(testimonial, 60)}
        <div>
          <h4 className="font-semibold text-[#333333]">{testimonial.client}</h4>
          <p className="text-sm text-gray-500">{testimonial.pet}</p>
          <div className="flex text-yellow-400">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <FaStar key={`${testimonial.id}-star-${i}`} className="h-5 w-5" />
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
                  {renderAvatar(testimonial, 50)}
                  <div>
                    <h4 className="font-semibold text-[#333333]">{testimonial.client}</h4>
                    <p className="text-sm text-gray-500">{testimonial.pet}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                    <div className="flex text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <FaStar key={`${testimonial.id}-modal-${i}`} className="h-5 w-5" />
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

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">{`What ${sitterPossessive} Clients Say`}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {`Don't just take ${sitterPossessive} word for it - here is what pet parents have to say about every stay.`}
          </p>
        </div>

        <div className="relative overflow-x-hidden">
          <div className="max-w-2xl mx-auto relative">
            {renderTestimonialCard(highlightedTestimonials[currentTestimonialIndex])}
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
      </div>
      {isModalOpen && renderAllReviewsModal()}
    </section>
  );
}

export default TestimonialsSection;
