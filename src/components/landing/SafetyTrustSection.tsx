import { motion } from "framer-motion";
import {
  FaClipboardCheck,
  FaShieldAlt,
  FaHome,
  FaHandHoldingHeart,
  FaComments,
  FaPaw,
} from "react-icons/fa";

const highlights = [
  {
    title: "Calm, Secure Environments",
    description: "Maintain calm, clean, and secure environments",
    icon: FaHome,
  },
  {
    title: "Positive Reinforcement",
    description: "Use positive-reinforcement methods",
    icon: FaHandHoldingHeart,
  },
  {
    title: "Consistent Communication",
    description: "Provide consistent communication and updates",
    icon: FaComments,
  },
  {
    title: "Peaceful Group Play",
    description: "Create peaceful, small-group experiences",
    icon: FaPaw,
  },
];

function SafetyTrustSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F8FBFF] via-white to-[#FFF8F3]" />
      <div className="relative container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A9CB0]/10 text-[#1A9CB0] px-4 py-2 text-sm font-semibold uppercase tracking-widest">
            <FaShieldAlt className="text-lg" aria-hidden="true" />
            Safety &amp; Trust
          </div>

          <h2 className="mt-6 text-3xl font-bold text-[#333333] md:text-4xl">
            Your dog is cared for by people we know and trust
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Every sitter in our network is hand-selected for their compassion, professionalism, and love for dogs.
          </p>
          <p className="mt-3 text-base text-gray-600">
            We look for calm homes, transparent communication, and sitters who follow the Ruh-Roh Playbook.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 max-w-3xl mx-auto text-center bg-white/80 border border-[#1A9CB0]/15 rounded-2xl p-8 shadow-lg backdrop-blur"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1A9CB0]/10 text-2xl text-[#1A9CB0]">
            <FaClipboardCheck aria-hidden="true" />
          </div>
          <p className="mt-4 text-lg font-semibold text-[#333333]">
            We highlight sitters who:
          </p>
          <ul className="mt-5 space-y-4 text-base text-gray-600 text-left">
            {highlights.map(({ title, description, icon: Icon }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A9CB0]/10 text-[#1A9CB0]">
                  <Icon aria-hidden="true" className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-[#333333]">{title}</p>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="mt-12 text-center text-base font-medium text-[#1A9CB0]">
          Your dog’s safety and happiness always come first.
        </p>
      </div>
    </section>
  );
}

export default SafetyTrustSection;
