import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
    addons: {
      spaBath: false,
      specialCare: false,
      premiumPlay: false,
    },
    notes: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookingRef = useRef<HTMLElement>(null);
  const meetGreetRef = useRef<HTMLElement>(null);

  // Add state to track Calendly loading status
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

  // Add state for date validation and nights calculation
  const [dateError, setDateError] = useState("");
  const [nightsCount, setNightsCount] = useState<number | null>(null);

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
        addons: {
          spaBath: false,
          specialCare: false,
          premiumPlay: false,
        },
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

  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-image.jpeg"
            alt="Pet sitter playing with dogs"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Ruh-Roh Retreat - Not Your Average Pet Sitter
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-white/90"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Trustworthy, reliable pet care with regular photo updates and
              peace of mind
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToBooking}
                className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
              >
                Book Now
              </button>
              <button
                onClick={scrollToMeetGreet}
                className="bg-[#1A9CB0] hover:bg-[#158294] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
              >
                Meet & Greet
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              My Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I offer premium overnight boarding with luxury accommodations and
              specialized add-on services tailored to your pet's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-600">
                Luxury Overnight Boarding
              </h3>
              <p className="text-gray-600 mb-5">
                Premium overnight care in my cozy home. Your pet will enjoy
                comfortable accommodations, personalized attention, and a
                home-like environment with my 24/7 supervision.
              </p>
              <p className="font-bold text-blue-600 mb-4 text-xl">
                Starting at $40/night
              </p>
              <a
                href="#"
                className="text-[#F28C38] font-medium hover:underline"
              >
                Learn More →
              </a>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-sky-600">
                Spa Bath Experience
              </h3>
              <p className="text-gray-600 mb-5">
                Keep your pet fresh and clean with my premium bathing service.
                Includes gentle shampoo, conditioning, towel-drying, and a light
                brushing before they return home.
              </p>
              <p className="font-bold text-sky-600 mb-4 text-xl">Add-on: $25</p>
              <a
                href="#"
                className="text-[#F28C38] font-medium hover:underline"
              >
                Learn More →
              </a>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-emerald-600">
                Special Care Package
              </h3>
              <p className="text-gray-600 mb-5">
                For pets with special needs or seniors. Includes medication
                administration, extra potty breaks, specialized diet
                preparation, and additional comfort accommodations.
              </p>
              <p className="font-bold text-emerald-600 mb-4 text-xl">
                Add-on: $15/night
              </p>
              <a
                href="#"
                className="text-[#F28C38] font-medium hover:underline"
              >
                Learn More →
              </a>
            </motion.div>

            {/* Service 4 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-cyan-600">
                Premium Play Sessions
              </h3>
              <p className="text-gray-600 mb-5">
                Add extra one-on-one play time for your energetic pet. Each
                session includes 30 minutes of dedicated activity tailored to
                your pet's preferences and energy level.
              </p>
              <p className="font-bold text-cyan-600 mb-4 text-xl">
                Add-on: $15/session
              </p>
              <a
                href="#"
                className="text-[#F28C38] font-medium hover:underline"
              >
                Learn More →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <Image
                src="/about-image.jpeg"
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
                Hello! I'm Johnny, the founder of Ruh-Roh Retreat. As a
                certified pet care specialist with over 7 years of experience,
                I've created a premium overnight boarding service that provides
                a home-away-from-home for your beloved pets. My home offers
                luxury accommodations and premium add-on services that make each
                stay special.
              </motion.p>
              <motion.p
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Ruh-Roh Retreat specializes in premium overnight boarding with
                luxurious accommodations and specialized add-on services. My
                mission is to provide peace of mind through reliable, loving
                care for your furry family members in my cozy home environment.
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
                    7+ Years Experience
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
                    Background Checked & Insured
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

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Why Choose Ruh-Roh Retreat
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Not your average pet sitting service - I go above and beyond to
              ensure your pets receive exceptional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-14 h-14 mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Senior Pet Specialists
              </h3>
              <p className="text-gray-600">
                I have extensive experience caring for senior pets and pets with
                special needs, ensuring they receive the specialized attention
                they deserve.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-14 h-14 mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
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
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Daily Photos & Updates
              </h3>
              <p className="text-gray-600">
                I send detailed updates with photos during each visit so you can
                see your pet is happy and enjoying their time with me.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-14 h-14 mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
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
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Medication Administration
              </h3>
              <p className="text-gray-600">
                Experienced in administering medications including oral
                medications, injections, and specialized diets for pets with
                health conditions.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-14 h-14 mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Comfortable Home Environment
              </h3>
              <p className="text-gray-600">
                Your pet will enjoy staying in my comfortable, pet-friendly home
                located in a peaceful, well-maintained community. I provide cozy
                sleeping areas and plenty of space for your pet to relax while
                you're away.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-14 h-14 mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600">
                Adaptable to your pet's routine and your schedule with early
                morning, evening, and weekend availability for ultimate
                convenience.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-14 h-14 mb-4 bg-[#1A9CB0] rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Genuine Pet Lover
              </h3>
              <p className="text-gray-600">
                Not just a service provider - a genuine animal lover who forms
                real bonds with your pets and treats them like family members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Image
                  src="/testimonial-pet-1.jpeg"
                  alt="Client's pet"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                  objectFit="cover"
                />
                <div>
                  <h4 className="font-semibold text-[#333333]">Sarah & Max</h4>
                  <div className="flex text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &quot;Johny is amazing with my anxious golden retriever! She
                sends photos every visit and follows his routine perfectly. I
                never worry when I&apos;m away because I know Max is in great
                hands.&quot;
              </p>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Image
                  src="/testimonial-pet-1.jpeg"
                  alt="Client's pet"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                  objectFit="cover"
                />
                <div>
                  <h4 className="font-semibold text-[#333333]">
                    Michael & Bella
                  </h4>
                  <div className="flex text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &quot;I&apos;ve tried several pet sitting services, but Ruh-Roh
                Retreat is by far the best. My cat Bella is usually shy around
                strangers, but she immediately warmed up to her sitter. The
                overnight stays give me such peace of mind.&quot;
              </p>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Image
                  src="/testimonial-pet-1.jpeg"
                  alt="Client's pet"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                  objectFit="cover"
                />
                <div>
                  <h4 className="font-semibold text-[#333333]">
                    Jennifer & Cooper
                  </h4>
                  <div className="flex text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                &quot;The peace of mind I get from knowing my senior dog Cooper
                is being cared for in his own home is priceless. Johnny
                understands his medications and special needs perfectly. We
                couldn&apos;t be happier!&quot;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="spaBath"
                        name="spaBath"
                        checked={bookingForm.addons.spaBath}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-[#1A9CB0] border-gray-300 rounded focus:ring-[#1A9CB0]"
                      />
                      <label htmlFor="spaBath" className="ml-2 text-gray-700">
                        Spa Bath Experience (+$25)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="specialCare"
                        name="specialCare"
                        checked={bookingForm.addons.specialCare}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-[#1A9CB0] border-gray-300 rounded focus:ring-[#1A9CB0]"
                      />
                      <label
                        htmlFor="specialCare"
                        className="ml-2 text-gray-700"
                      >
                        Special Care Package (+$15/night)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="premiumPlay"
                        name="premiumPlay"
                        checked={bookingForm.addons.premiumPlay}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-[#1A9CB0] border-gray-300 rounded focus:ring-[#1A9CB0]"
                      />
                      <label
                        htmlFor="premiumPlay"
                        className="ml-2 text-gray-700"
                      >
                        Premium Play Sessions (+$15/session)
                      </label>
                    </div>
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

      {/* Meet & Greet Section */}
      <section id="meet-greet" ref={meetGreetRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Schedule a Meet & Greet
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I believe in building trust before service begins. Schedule a free
              30-minute Meet & Greet session to introduce your pets to me and
              discuss your specific needs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/baolonguit/30min"
              style={{ minWidth: "320px", height: "700px" }}
            >
              {isCalendlyLoading && (
                <p className="text-center py-16 text-gray-500">
                  Loading calendar...
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="contact" className="py-16 bg-[#1A9CB0]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for the Ruh-Roh Retreat experience?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            My luxury overnight boarding with premium add-on services will make
            your pet's stay truly special while you're away.
          </p>
          <div className="mb-8">
            <button
              onClick={scrollToBooking}
              className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 mr-4"
            >
              Book Now
            </button>
            <button
              onClick={scrollToMeetGreet}
              className="bg-white text-[#1A9CB0] hover:bg-[#158294] hover:text-white border-2 border-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300"
            >
              Meet & Greet
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <a
              href="tel:+17143294534"
              className="flex items-center text-xl hover:underline"
            >
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              +1 (714) 329-4534
            </a>
            <a
              href="mailto:hello@ruhrohretreat.com"
              className="flex items-center text-xl hover:underline"
            >
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
            </a>
          </div>

          {/* Location Information */}
          <div className="mt-12">
            <div className="flex items-center justify-center mb-4">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xl">12207 Pintado, Irvine, CA, 92618</span>
            </div>

            <div className="w-full h-96 mt-4 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.9727388869344!2d-117.74094292357964!3d33.65830823932711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dce780a7a164f9%3A0xef1ed94c97fe61b0!2s12207%20Pintado%2C%20Irvine%2C%20CA%2092618!5e0!3m2!1sen!2sus!4v1715195402075!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ruh-Roh Retreat Location"
              ></iframe>
            </div>
          </div>
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
            image: "/logo.png",
            url: "https://www.ruhrohrretreat.com",
            telephone: "+17143294534",
            address: {
              "@type": "PostalAddress",
              streetAddress: "12207 Pintado",
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
              "https://www.facebook.com/ruhrohrretreat",
              "https://www.instagram.com/ruhrohrretreat",
            ],
          }),
        }}
      />
    </div>
  );
}

export default LandingComponent;
