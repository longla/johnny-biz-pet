import { motion } from "framer-motion";
import Image from "next/image";

function LandingComponent() {
  // Animation variants for paw prints
  const pawPrintVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  // Staggered animation for multiple elements
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Bounce animation for the button
  const bounceVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5
      }
    }
  };

  return (
    <div className="font-poppins overflow-hidden">
      {/* Decorative shapes - paw prints pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-8 h-8 text-purple-300 opacity-30"
          variants={pawPrintVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,15c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,15,50,15z M20,40c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10 S25.5,40,20,40z M80,40c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S85.5,40,80,40z M35,60c-5.5,0-10,4.5-10,10s4.5,10,10,10 s10-4.5,10-10S40.5,60,35,60z M65,60c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S70.5,60,65,60z"/>
          </svg>
        </motion.div>
        <motion.div 
          className="absolute top-[30%] right-20 w-12 h-12 text-pink-300 opacity-30"
          variants={pawPrintVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.8 }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,15c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,15,50,15z M20,40c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10 S25.5,40,20,40z M80,40c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S85.5,40,80,40z M35,60c-5.5,0-10,4.5-10,10s4.5,10,10,10 s10-4.5,10-10S40.5,60,35,60z M65,60c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S70.5,60,65,60z"/>
          </svg>
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-[15%] w-10 h-10 text-teal-300 opacity-30"
          variants={pawPrintVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 1.2 }}
        >
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,15c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,15,50,15z M20,40c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10 S25.5,40,20,40z M80,40c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S85.5,40,80,40z M35,60c-5.5,0-10,4.5-10,10s4.5,10,10,10 s10-4.5,10-10S40.5,60,35,60z M65,60c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S70.5,60,65,60z"/>
          </svg>
        </motion.div>
      </div>

      {/* Hero Section with diagonal cut and gradient */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-400 overflow-hidden">
        {/* Abstract shape background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* Diagonal cut */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white transform -skew-y-3 z-10"></div>
        
        {/* Content container */}
        <div className="container mx-auto px-4 relative z-10 text-white pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl relative"
          >
            {/* Floating elements animation */}
            <motion.div 
              className="absolute -top-16 -right-16 w-32 h-32 text-blue-300 opacity-70"
              animate={{ 
                y: [0, -15, 0], 
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <svg viewBox="0 0 512 512" fill="currentColor">
                <path d="M226.5,92.9c14.6,6.9,32.1,0.4,39-14.2c6.9-14.6,0.4-32.1-14.2-39C236.6,32.7,219.2,39.2,212.3,53.8
                  C205.4,68.4,211.9,86,226.5,92.9z M78.4,163.4c-14.6-6.9-32.1-0.4-39,14.2c-6.9,14.6-0.4,32.1,14.2,39
                  c14.6,6.9,32.1,0.4,39-14.2C99.6,187.8,93.1,170.3,78.4,163.4z M413.5,177.7c14.6,6.9,32.1,0.4,39-14.2c6.9-14.6,0.4-32.1-14.2-39
                  c-14.6-6.9-32.1-0.4-39,14.2C392.4,153.3,398.9,170.8,413.5,177.7z M165.8,269.6c-14.6-6.9-32.1-0.4-39,14.2
                  c-6.9,14.6-0.4,32.1,14.2,39c14.6,6.9,32.1,0.4,39-14.2C186.9,294,180.4,276.5,165.8,269.6z M326.2,269.6
                  c-14.6-6.9-32.1-0.4-39,14.2c-6.9,14.6-0.4,32.1,14.2,39c14.6,6.9,32.1,0.4,39-14.2C347.3,294,340.8,276.5,326.2,269.6z"/>
              </svg>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Professional Pet Care in the Comfort of Your Home
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-white/90"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Loving attention for your furry family members while you&apos;re away
            </motion.p>
            
            <motion.button 
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              variants={bounceVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>
            
            {/* Image floating over the hero section */}
            <motion.div 
              className="absolute -right-16 md:right-[-20rem] top-0 w-72 h-72 md:w-[30rem] md:h-[30rem] rounded-2xl overflow-hidden shadow-2xl border-4 border-white hidden md:block"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.7,
                type: "spring",
                stiffness: 50
              }}
            >
              <Image
                src="/hero-image.jpeg"
                alt="Pet sitter playing with dogs"
                layout="fill"
                objectFit="cover"
                className="scale-110"
                quality={100}
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section with modern color scheme */}
      <section id="services" className="py-20 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white to-blue-50">
          <motion.div 
            className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full opacity-70"
            style={{ borderRadius: "62% 38% 82% 18% / 63% 34% 66% 37%" }}
            animate={{ 
              rotate: [0, 10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-0 w-80 h-80 bg-cyan-100 rounded-full opacity-60"
            style={{ borderRadius: "42% 58% 62% 38% / 53% 67% 33% 47%" }}
            animate={{ 
              rotate: [0, -10, 0],
              scale: [1, 1.03, 1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-100 rounded-full opacity-60"
            style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%" }}
            animate={{ 
              rotate: [0, 15, 0],
              scale: [1, 1.04, 1]
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="inline-block relative"
              whileInView={{ rotate: [0, -5, 0, 5, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-blue-700 mb-4 inline-block">
                Our Professional Services
              </h2>
              <motion.div
                className="absolute -right-12 -top-10 w-12 h-12 text-teal-500"
                animate={{ 
                  rotate: 15,
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity 
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.94,18.12L2.69,14.25L4.94,10.38L9.19,10.38L11.44,14.25L9.19,18.12L4.94,18.12M14.81,21L17.06,17.12L21.31,17.12L23.56,21L21.31,24.88L17.06,24.88L14.81,21M14.81,7.5L17.06,3.62L21.31,3.62L23.56,7.5L21.31,11.38L17.06,11.38L14.81,7.5M9.19,3.62L11.44,7.5L9.19,11.38L4.94,11.38L2.69,7.5L4.94,3.62L9.19,3.62Z" />
                </svg>
              </motion.div>
            </motion.div>
            <motion.p 
              className="text-xl text-blue-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We offer a variety of pet care services tailored to meet your
              pet&apos;s individual needs and your schedule.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Service 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden border-t-4 border-blue-400"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-100 rounded-full opacity-70" />
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-teal-500 to-blue-600 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
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
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-blue-600">
                  Daily Visits
                </h3>
                <p className="text-gray-600 mb-5">
                  Customized visits to your home to feed, play with, and care for
                  your pets. Includes fresh water, feeding, walking, and lots of
                  TLC.
                </p>
                <p className="font-bold text-blue-600 mb-5 text-xl">Starting at $25</p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium py-2 px-6 rounded-full transition-colors duration-300"
                  href="#"
                >
                  Learn More →
                </motion.a>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden border-t-4 border-sky-400"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-100 rounded-full opacity-70" />
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-blue-500 to-sky-600 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
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
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-sky-600">
                  Overnight Stays
                </h3>
                <p className="text-gray-600 mb-5">
                  Your pet sitter stays in your home overnight, providing
                  companionship, security, and care for your pets in their
                  familiar environment.
                </p>
                <p className="font-bold text-sky-600 mb-5 text-xl">Starting at $85</p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-sky-100 hover:bg-sky-200 text-sky-600 font-medium py-2 px-6 rounded-full transition-colors duration-300"
                  href="#"
                >
                  Learn More →
                </motion.a>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden border-t-4 border-emerald-400"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-100 rounded-full opacity-70" />
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
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
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-emerald-600">
                  Dog Walking
                </h3>
                <p className="text-gray-600 mb-5">
                  Regular exercise for your dog with personalized walks tailored
                  to their energy level, age, and preferences. Includes fresh
                  water and treats.
                </p>
                <p className="font-bold text-emerald-600 mb-5 text-xl">Starting at $20</p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-emerald-100 hover:bg-emerald-200 text-emerald-600 font-medium py-2 px-6 rounded-full transition-colors duration-300"
                  href="#"
                >
                  Learn More →
                </motion.a>
              </div>
            </motion.div>

            {/* Service 4 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center relative overflow-hidden border-t-4 border-cyan-400"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-100 rounded-full opacity-70" />
              <div className="relative">
                <motion.div 
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
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
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-cyan-600">
                  Pet Taxi
                </h3>
                <p className="text-gray-600 mb-5">
                  Transportation services for your pet to vet appointments,
                  grooming sessions, or anywhere they need to go, with a caring
                  professional.
                </p>
                <p className="font-bold text-cyan-600 mb-5 text-xl">Starting at $30</p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-cyan-100 hover:bg-cyan-200 text-cyan-600 font-medium py-2 px-6 rounded-full transition-colors duration-300"
                  href="#"
                >
                  Learn More →
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section with modern style */}
      <section id="about" className="py-20 relative">
        {/* Background patterns */}
        <div className="absolute bottom-0 left-0 w-40 h-40 text-blue-100 opacity-30">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <g>
              <path d="M30,20c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S35.5,20,30,20z"/>
              <path d="M70,20c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S75.5,20,70,20z"/>
              <path d="M50,50c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,50,50,50z"/>
              <path d="M30,80c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S35.5,80,30,80z"/>
              <path d="M70,80c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S75.5,80,70,80z"/>
            </g>
          </svg>
        </div>
        <div className="absolute top-10 right-10 w-32 h-32 text-teal-100 opacity-30">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <g>
              <path d="M30,20c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S35.5,20,30,20z"/>
              <path d="M70,20c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S75.5,20,70,20z"/>
              <path d="M50,50c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S55.5,50,50,50z"/>
              <path d="M30,80c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S35.5,80,30,80z"/>
              <path d="M70,80c-5.5,0-10,4.5-10,10s4.5,10,10,10s10-4.5,10-10S75.5,80,70,80z"/>
            </g>
          </svg>
        </div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Image with animated frame */}
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Decorative frame */}
              <motion.div 
                className="absolute -top-4 -left-4 -right-4 -bottom-4 border-4 border-dashed border-purple-300 rounded-2xl"
                animate={{
                  borderColor: ["#d8b4fe", "#c4b5fd", "#93c5fd", "#d8b4fe"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              {/* Paw print decoration */}
              <motion.div 
                className="absolute -top-8 -right-8 w-16 h-16 text-blue-400"
                animate={{ 
                  rotate: [0, 15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <svg viewBox="0 0 512 512" fill="currentColor">
                  <path d="M226.5,92.9c14.6,6.9,32.1,0.4,39-14.2c6.9-14.6,0.4-32.1-14.2-39C236.6,32.7,219.2,39.2,212.3,53.8
                    C205.4,68.4,211.9,86,226.5,92.9z M78.4,163.4c-14.6-6.9-32.1-0.4-39,14.2c-6.9,14.6-0.4,32.1,14.2,39
                    c14.6,6.9,32.1,0.4,39-14.2C99.6,187.8,93.1,170.3,78.4,163.4z M413.5,177.7c14.6,6.9,32.1,0.4,39-14.2c6.9-14.6,0.4-32.1-14.2-39
                    c-14.6-6.9-32.1-0.4-39,14.2C392.4,153.3,398.9,170.8,413.5,177.7z"/>
                </svg>
              </motion.div>
              
              {/* The main image */}
              <Image
                src="/about-image.jpeg"
                alt="Pet sitter with pets"
                width={600}
                height={450}
                className="rounded-xl shadow-xl relative z-10 border-8 border-white"
                objectFit="cover"
              />
              
              {/* Animated icon */}
              <motion.div
                className="absolute -bottom-6 -left-6 text-blue-400 w-12 h-12"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.94,18.12L2.69,14.25L4.94,10.38L9.19,10.38L11.44,14.25L9.19,18.12L4.94,18.12M14.81,21L17.06,17.12L21.31,17.12L23.56,21L21.31,24.88L17.06,24.88L14.81,21M14.81,7.5L17.06,3.62L21.31,3.62L23.56,7.5L21.31,11.38L17.06,11.38L14.81,7.5M9.19,3.62L11.44,7.5L9.19,11.38L4.94,11.38L2.69,7.5L4.94,3.62L9.19,3.62Z" />
                </svg>
              </motion.div>
            </motion.div>
            
            {/* Content */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold text-blue-600 mb-6 relative inline-block"
                whileInView={{ y: [0, -5, 0] }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                About Us
                <motion.div 
                  className="absolute h-3 bg-teal-300 bottom-1 -z-10 w-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  viewport={{ once: true }}
                />
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-700 mb-6 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Hello! I&apos;m Johny, the founder of Paws At Home. My journey into
                professional pet sitting began after 15 years of volunteering at
                local shelters and rescuing strays. I&apos;ve always had a special
                connection with animals, and I understand that they&apos;re more than
                just pets—they&apos;re family.
              </motion.p>
              
              <motion.p 
                className="text-lg text-gray-700 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                I started Paws At Home because I believe all pets deserve
                personalized care in the comfort of their own environment when
                their owners are away. My mission is to provide peace of mind
                through reliable, loving care for your furry family members.
              </motion.p>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-100px" }}
              >
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
                  <span className="text-indigo-800 font-medium">7+ Years Experience</span>
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
                  <span className="text-pink-800 font-medium">Pet First Aid Certified</span>
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
                  <span className="text-blue-800 font-medium">Insured & Bonded</span>
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="text-amber-800 font-medium">Background Checked</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We go above and beyond to ensure your pets receive the best
              possible care.
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
                Personalized Care
              </h3>
              <p className="text-gray-600">
                We create customized pet care plans based on your pet&apos;s unique
                personality, preferences, and needs.
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
                Regular Updates
              </h3>
              <p className="text-gray-600">
                We send photos and detailed updates during each visit so you can
                see your pet is happy and well-cared for.
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
                Peace of Mind
              </h3>
              <p className="text-gray-600">
                Our services are fully insured and bonded, providing protection
                and peace of mind while you&apos;re away.
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
                Familiar Environment
              </h3>
              <p className="text-gray-600">
                Your pets stay in their own comfortable home environment,
                maintaining their routine and reducing stress.
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
                We offer flexible scheduling options to accommodate your travel
                plans, work hours, or special needs.
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.5 9.5c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.5 9.5c0 .5-.5 1-1 1s-1-.5-1-1 .5-1 1-1 1 .5 1 1z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                Emergency Support
              </h3>
              <p className="text-gray-600">
                We have backup plans and emergency protocols in place to ensure
                your pet is always cared for, no matter what.
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
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - here&apos;s what pet parents have to
              say about our services.
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
                &quot;Johny is amazing with my anxious golden retriever! She sends
                photos every visit and follows his routine perfectly. I never
                worry when I&apos;m away because I know Max is in great hands.&quot;
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
                &quot;I&apos;ve tried several pet sitting services, but Paws At Home is by
                far the best. My cat Bella is usually shy around strangers, but
                she immediately warmed up to her sitter. The overnight stays
                give me such peace of mind.&quot;
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
                &quot;The peace of mind I get from knowing my senior dog Cooper is
                being cared for in his own home is priceless. Our sitter
                understands his medications and special needs perfectly. We
                couldn&apos;t be happier!&quot;
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="contact" className="py-16 bg-[#1A9CB0]">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to give your pets the care they deserve?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We&apos;re here to provide professional, loving care for your furry
            family members whenever you need us.
          </p>
          <div className="mb-8">
            <button className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 mr-4">
              Book a Consultation
            </button>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <a
              href="tel:5551234567"
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
              (555) 123-4567
            </a>
            <a
              href="mailto:hello@pawsathome.com"
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
              hello@pawsathome.com
            </a>
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
            name: "Paws At Home",
            image: "/logo.png",
            url: "https://www.pawsathome.com",
            telephone: "(555) 123-4567",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Pet Care Lane",
              addressLocality: "Anytown",
              addressRegion: "ST",
              postalCode: "12345",
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
              "https://www.facebook.com/pawsathome",
              "https://www.instagram.com/pawsathome",
            ],
          }),
        }}
      />
    </div>
  );
}

export default LandingComponent;
