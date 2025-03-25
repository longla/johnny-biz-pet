import { motion } from "framer-motion";
import {
  CalendarIcon,
  CameraIcon,
  DogIcon,
  HeartIcon,
  HomeIcon,
  ListTodoIcon,
  MapPinIcon,
  MessageSquareIcon,
  PawPrintIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";

function LandingComponent() {
  return (
    <>
      <div className="mainContainer relative text-center py-16">
        <motion.h2
          className="text-4xl font-bold text-gray-950 lg:text-6xl lg:mt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          Expert Pet Care When You Can't Be There
        </motion.h2>

        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <a
            href="#contact"
            className="flex items-center px-8 py-4 text-white rounded-full bg-primary-500 hover:scale-105 transition-transform"
          >
            <CalendarIcon className="mr-2 w-6" />
            <span className="text-2xl">Book Now</span>
          </a>
        </motion.div>

        <motion.p
          className="mt-6 text-gray-600 text-2xl lg:mt-8 lg:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Loving, reliable pet care in the comfort of your home.
          Your furry family members deserve the best - even when you're away.
        </motion.p>

        <motion.div
          className="my-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="w-full md:w-4/5 lg:w-3/5 rounded-xl overflow-hidden shadow-xl"
            whileHover={{
              scale: 1.03,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
          >
            <Image
              src="/product_image.png" 
              alt="Happy pets with their sitter"
              width={1200}
              height={800}
              className="w-full h-auto rounded-xl"
              priority
            />
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 w-[100%] rotate-180">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-primary-600"
            ></path>
          </svg>
        </div>
      </div>
      <section className="mainContainer relative flex flex-col md:flex-row bg-primary-600 py-12">
        <div className="w-full pt-8 md:pt-0 text-white text-2xl md:px-10 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.5,
              delay: 0,
            }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            className="w-full p-6 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
          >
            <div className="w-full">
              <h3 className="font-bold text-2xl mb-3 flex items-center gap-3 text-white">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-primary-200"
                >
                  <HomeIcon className="w-8 h-8" />
                </motion.div>
                In-Home Pet Visits
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                We come to your home to feed, walk, and provide personalized attention to your 
                pets. Regular visits keep your pets comfortable in their familiar environment while 
                you're away, reducing stress and anxiety.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.5,
              delay: 0.1,
            }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            className="w-full p-6 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
          >
            <div className="w-full">
              <h3 className="font-bold text-2xl mb-3 flex items-center gap-3 text-white">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-primary-200"
                >
                  <DogIcon className="w-8 h-8" />
                </motion.div>
                Dog Walking Services
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Keep your dog healthy and happy with our professional walking services. 
                We provide regular exercise, mental stimulation, and playtime tailored to 
                your dog's energy level, age, and preferences.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.5,
              delay: 0.2,
            }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            className="w-full p-6 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
          >
            <div className="w-full">
              <h3 className="font-bold text-2xl mb-3 flex items-center gap-3 text-white">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-primary-200"
                >
                  <CameraIcon className="w-8 h-8" />
                </motion.div>
                Photo Updates
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Receive adorable photos and updates about your pet during every visit. 
                Stay connected with your furry friends while you're away and enjoy peace of 
                mind knowing they're happy and well-cared for.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.5,
              delay: 0.3,
            }}
            whileHover={{
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            className="w-full p-6 rounded-2xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 shadow-lg border border-white/10"
          >
            <div className="w-full">
              <h3 className="font-bold text-2xl mb-3 flex items-center gap-3 text-white">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-primary-200"
                >
                  <ShieldCheckIcon className="w-8 h-8" />
                </motion.div>
                Pet First Aid Certified
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Your pets' safety is our top priority. All of our pet sitters are certified 
                in pet first aid and can handle emergencies calmly and effectively. We're prepared 
                for anything to keep your pets safe.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative w-full h-24">
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-24"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-primary-600"
            ></path>
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-primary-600/50"
            ></path>
          </svg>
        </div>
      </div>

      <section className="relative mainContainer pt-12 pb-16">
        <motion.h1
          className="text-center text-4xl font-semibold mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          Why Pet Parents Choose Us
        </motion.h1>
        <div className="lg:mt-10 flex flex-col md:flex-row flex-wrap justify-center items-stretch gap-6 lg:gap-10">
          {[
            {
              icon: <HeartIcon className="w-12 h-12 text-primary-500" />,
              title: "Passionate Pet Lovers",
              text: "Our team consists of dedicated animal lovers who treat your pets like their own.",
            },
            {
              icon: <StarIcon className="w-12 h-12 text-primary-500" />,
              title: "Professional Experience",
              text: "Years of experience caring for pets of all species, breeds, ages, and health conditions.",
            },
            {
              icon: <ShieldCheckIcon className="w-12 h-12 text-primary-500" />,
              title: "Insured & Bonded",
              text: "Fully insured services give you complete peace of mind while you're away.",
            },
            {
              icon: <MessageSquareIcon className="w-12 h-12 text-primary-500" />,
              title: "Clear Communication",
              text: "Regular updates, photos, and detailed notes about your pet's activities and wellbeing.",
            },
            {
              icon: <PawPrintIcon className="w-12 h-12 text-primary-500" />,
              title: "Customized Care",
              text: "Personalized care plans tailored to your pet's unique needs and preferences.",
            },
            {
              icon: <UserIcon className="w-12 h-12 text-primary-500" />,
              title: "Background Checked",
              text: "All sitters undergo thorough background checks for your safety and security.",
            },
          ].map(({ icon, title, text }, index) => (
            <motion.div
              key={index}
              className="w-full md:w-[45%] flex flex-col items-center px-8 py-10 bg-white rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: index * 0.1,
                mass: 0.5,
              }}
            >
              <motion.div
                className="bg-primary-50 rounded-full p-4 mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {icon}
              </motion.div>
              <motion.h3
                className="text-2xl font-bold text-gray-900 mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {title}
              </motion.h3>
              <motion.p
                className="text-gray-600 text-xl text-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {text}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative bg-primary-50 py-16">
        <div className="mainContainer">
          <motion.h2
            className="text-center text-4xl font-semibold mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            How It Works
          </motion.h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {[
              {
                icon: <CalendarIcon className="w-10 h-10 text-primary-500" />,
                title: "Schedule a Meet & Greet",
                text: "We'll visit your home to meet you and your pets, understand their routines, and address any questions.",
              },
              {
                icon: <ListTodoIcon className="w-10 h-10 text-primary-500" />,
                title: "Customize Your Plan",
                text: "We'll create a personalized care plan based on your pet's needs, schedule, and your preferences.",
              },
              {
                icon: <PawPrintIcon className="w-10 h-10 text-primary-500" />,
                title: "Enjoy Peace of Mind",
                text: "Relax knowing your pets are receiving loving care in the comfort of their own home.",
              },
            ].map(({ icon, title, text }, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary-200 rounded-full blur-md opacity-50 scale-110"></div>
                  <div className="relative bg-white p-4 rounded-full shadow-md">
                    {icon}
                  </div>
                  {index < 2 && (
                    <motion.div
                      className="hidden md:block absolute top-1/2 -right-8 w-8 h-0.5 bg-primary-300"
                      initial={{ width: 0 }}
                      whileInView={{ width: "2rem" }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 0.3 }}
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mainContainer py-16">
        <motion.h2
          className="text-center text-4xl font-semibold mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          Get Started Today
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Tell Us About Your Pet</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                  placeholder="Type, age, special needs, etc."
                ></textarea>
              </div>
              <motion.button 
                type="submit" 
                className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Request a Meet & Greet
              </motion.button>
            </form>
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2 flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-primary-500" />
                Our Service Areas
              </h3>
              <p className="text-gray-600 text-lg">
                We proudly serve pets and their parents in the following areas:
              </p>
              <ul className="mt-3 text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <PawPrintIcon className="w-4 h-4 text-primary-400" />
                  Downtown
                </li>
                <li className="flex items-center gap-2">
                  <PawPrintIcon className="w-4 h-4 text-primary-400" />
                  Westside
                </li>
                <li className="flex items-center gap-2">
                  <PawPrintIcon className="w-4 h-4 text-primary-400" />
                  Northpark
                </li>
                <li className="flex items-center gap-2">
                  <PawPrintIcon className="w-4 h-4 text-primary-400" />
                  Eastdale
                </li>
                <li className="flex items-center gap-2">
                  <PawPrintIcon className="w-4 h-4 text-primary-400" />
                  South Hills
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquareIcon className="w-6 h-6 text-primary-500" />
                Contact Details
              </h3>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> (555) 123-4567
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> hello@pawsathome.com
              </p>
              <p className="text-gray-700">
                <strong>Hours:</strong> 7 days a week, 7am-9pm
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-primary-600 text-white py-10">
        <div className="mainContainer text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to give your pets the best care?</h2>
            <p className="text-xl mb-6">Book your free consultation today!</p>
            <motion.a
              href="#contact"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-full font-medium text-lg hover:bg-primary-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default LandingComponent;