import { motion } from "framer-motion";
import { FaHome, FaShieldAlt, FaCamera, FaPalette } from "react-icons/fa";

const pillars = [
  {
    title: "Boutique Comfort",
    description: "Small groups, cozy home stays, and personalized attention.",
    detail: "Sitters who align with this pillar host fewer dogs to ensure calm, low-stress stays.",
    icon: FaHome,
    accentBorder: "border-[#F28C38]",
    accentText: "text-[#F28C38]",
  },
  {
    title: "Structured & Safe",
    description: "Balanced routines, mindful introductions, and calm environments.",
    detail: "Sitters emphasize consistency and smooth transitions to help dogs settle comfortably.",
    icon: FaShieldAlt,
    accentBorder: "border-[#1A9CB0]",
    accentText: "text-[#1A9CB0]",
  },
  {
    title: "Transparent Communication",
    description: "Daily photo and video updates keep you connected, no matter where you are.",
    detail: "Many sitters also offer live video check-ins or meet-and-greets before your dog’s stay.",
    icon: FaCamera,
    accentBorder: "border-[#6C63FF]",
    accentText: "text-[#6C63FF]",
  },
  {
    title: "Personalized Vacations",
    description: "Every pup deserves a tailored experience.",
    detail: "Pet parents can choose fun enrichment add-ons to make their dog’s stay feel like a true retreat.",
    footer: "Add-ons vary by sitter.",
    icon: FaPalette,
    accentBorder: "border-[#E4572E]",
    accentText: "text-[#E4572E]",
  },
];

function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-[#F4F4F9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Why Pet Parents Choose Ruh-Roh Retreat</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our boutique philosophy is built around four pillars of comfort, structure, and trust.
          </p>
        </div>

        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Each independent sitter in our network chooses to align with these values, helping pups feel safe, happy, and right at
          home.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {pillars.map(({ title, description, detail, footer, icon: Icon, accentBorder, accentText }, index) => (
            <motion.div
              key={title}
              className={`bg-white rounded-xl shadow-lg p-8 border-t-4 ${accentBorder} flex flex-col h-full`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 35px -15px rgba(26, 156, 176, 0.35)",
              }}
            >
              <div className="flex items-center mb-6">
                <div className={`h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl ${accentText}`}>
                  <Icon aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-[#333333] ml-4">{title}</h3>
              </div>
              <p className="text-gray-600 text-base leading-relaxed">{description}</p>
              <p className="text-gray-600 text-base leading-relaxed mt-3">{detail}</p>
              {footer ? <p className="text-sm text-gray-500 mt-4">{footer}</p> : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
