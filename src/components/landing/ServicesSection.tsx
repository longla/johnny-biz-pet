import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

import FloatingYogaDog from "../floating-yoga-dog";

type ServicesSectionProps = {
  onBookNow: () => void;
};

function ServicesSection({ onBookNow }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            A La Carte Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every pet's stay includes my full attention, but you can enhance their experience with these specialized add-ons.
            Mix and match to create the perfect retreat for your furry friend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500"
            whileHover={{
              y: -10,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl text-blue-500">🐾</div>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">Standard Care</h3>
              <p className="text-2xl font-bold text-blue-500 mt-4">$45/night</p>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <FaCheckCircle className="text-blue-500 mr-3" />
                Four 15-minute walks daily
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-blue-500 mr-3" />
                Potty breaks & yard cleanup
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-blue-500 mr-3" />
                Fresh water & scheduled feeding
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-blue-500 mr-3" />
                Daily photo & video updates
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-blue-500 mr-3" />
                Constant companionship & affection
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500"
            whileHover={{
              y: -10,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl text-green-500">🧠</div>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">Enrichment Activities</h3>
              <p className="text-gray-500">Stimulate their mind & body</p>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li>
                Sniffari Walk - <span className="font-semibold text-green-600">$10</span>
              </li>
              <li>
                Extended Walk (20 min) - <span className="font-semibold text-green-600">$15</span>
              </li>
              <li>
                Jogging Session (20 min) - <span className="font-semibold text-green-600">$15</span>
              </li>
              <li>
                Dog Park Trip - <span className="font-semibold text-green-600">$15</span>
              </li>
              <li>
                Puzzle Feeder / Frozen Kong - <span className="font-semibold text-green-600">$5</span>
              </li>
              <li>
                PAW-casso Painting - <span className="font-semibold text-green-600">$20</span>
              </li>
              <li>
                Puppuccino & Treat Outing - <span className="font-semibold text-green-600">$15</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500"
            whileHover={{
              y: -10,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="text-center mb-6">
              <div className="text-5xl text-purple-500">💆‍♂️</div>
              <h3 className="text-2xl font-bold text-gray-800 mt-4">Wellness & Spa</h3>
              <p className="text-gray-500">For extra pampering & care</p>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li>
                Bath & Blow Dry - <span className="font-semibold text-purple-600">$40</span>
              </li>
              <li>
                Massage & Brushing - <span className="font-semibold text-purple-600">$15</span>
              </li>
              <li>
                Calming Aromatherapy - <span className="font-semibold text-purple-600">$10</span>
              </li>
              <li>
                Teeth Brushing - <span className="font-semibold text-purple-600">$5</span>
              </li>
              <li>
                Nail Trim - <span className="font-semibold text-purple-600">$10</span>
              </li>
              <li>
                Basic Obedience Reinforcement - <span className="font-semibold text-purple-600">$15</span>
              </li>
              <li>
                Cuddle & Movie Night - <span className="font-semibold text-purple-600">$10</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={onBookNow}
            className="bg-[#F28C38] hover:bg-[#e07a26] text-white font-bold py-4 px-10 rounded-full text-xl transition-transform transform hover:scale-105 duration-300 shadow-lg"
          >
            Book Your Pet's Stay
          </button>
        </div>
      </div>
      <FloatingYogaDog />
    </section>
  );
}

export default ServicesSection;
