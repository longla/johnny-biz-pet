import { motion } from "framer-motion";
import {
  FaClipboardCheck,
  FaHome,
  FaHandHoldingHeart,
  FaComments,
  FaPaw,
  FaShieldAlt,
} from "react-icons/fa";

const highlights = [
  {
    title: "Calm, Secure Environments",
    description: "Maintain calm, clean, and secure environments",
    icon: FaHome,
    accent: "from-[#C7E8FF] to-[#E8F7FF]",
  },
  {
    title: "Positive Reinforcement",
    description: "Use positive-reinforcement methods",
    icon: FaHandHoldingHeart,
    accent: "from-[#FFE1D6] to-[#FFF5EE]",
  },
  {
    title: "Consistent Communication",
    description: "Provide consistent communication and updates",
    icon: FaComments,
    accent: "from-[#E5E2FF] to-[#F3F1FF]",
  },
  {
    title: "Peaceful Group Play",
    description: "Create peaceful, small-group experiences",
    icon: FaPaw,
    accent: "from-[#D8F5E4] to-[#F1FFF6]",
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
          <ul className="mt-5 space-y-3 text-base text-gray-600 text-left md:text-center">
            {highlights.map(({ title, description }) => (
              <li key={title}>
                <p className="font-medium text-[#333333]">{title}</p>
                <p>{description}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map(({ title, description, icon: Icon, accent }, index) => (
            <motion.div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white p-6 shadow-xl text-center"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-[#1A9CB0]/10 text-[#1A9CB0]">
                <Icon aria-hidden="true" />
              </div>
              <h3 className="relative mt-5 text-lg font-semibold text-[#333333]">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-center text-base font-medium text-[#1A9CB0]">
          Your dog’s safety and happiness always come first.
        </p>
      </div>
    </section>
  );
}

export default SafetyTrustSection;
