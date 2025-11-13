import { motion } from "framer-motion";
import {
  FaClipboardCheck,
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
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center rounded-full bg-[#1A9CB0]/10 px-5 py-2 text-sm font-medium text-[#1A9CB0]">
              <span className="mr-2 text-lg" role="img" aria-hidden="true">
                🧾
              </span>
              Safety &amp; Trust
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#333333] md:text-4xl">
              Your dog is cared for by people we know and trust
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Every sitter in our network is hand-selected for their compassion, professionalism, and love for dogs.
            </p>

            <motion.div
              className="mt-8 rounded-2xl border border-[#1A9CB0]/10 bg-white/80 p-6 shadow-lg backdrop-blur"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 text-[#1A9CB0]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A9CB0]/10 text-2xl">
                  <FaClipboardCheck aria-hidden="true" />
                </div>
                <span className="text-lg font-semibold">We highlight sitters who:</span>
              </div>
              <ul className="mt-5 space-y-4 text-base text-gray-600">
                {highlights.map(({ title, description }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-1 text-[#1A9CB0]">•</span>
                    <div>
                      <p className="font-medium text-[#333333]">{title}</p>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <p className="mt-6 text-base font-medium text-[#1A9CB0]">
              Your dog’s safety and happiness always come first.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {highlights.map(({ title, description, icon: Icon, accent }, index) => (
              <motion.div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white p-6 shadow-xl"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A9CB0]/10 text-[#1A9CB0]">
                  <Icon aria-hidden="true" />
                </div>
                <h3 className="relative mt-5 text-lg font-semibold text-[#333333]">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SafetyTrustSection;
