import { motion } from "framer-motion";
import Image from "next/image";

function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <Image
              src="/about-image.jpg"
              alt="Pet sitter with pets"
              width={600}
              height={450}
              className="rounded-lg shadow-lg"
              objectFit="cover"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-6">About Me</h2>
            <motion.p
              className="text-lg text-gray-700 mb-6 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Hi, I'm Johnny! I run a boutique-style dog care experience out of my peaceful home, where your pup is treated like
              family and pampered like they're on vacation. After over 15 years of hands-on experience—including time as a vet
              assistant—I left the corporate world behind to do what I love full-time: caring for dogs.
            </motion.p>
            <motion.p
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Every stay is customized to your dog's personality and needs. Whether they're shy and sensitive or playful and
              high-energy, I create a calm, nurturing space where they can thrive. I'm home all day, which means your pup gets
              round-the-clock attention, comfort, and companionship. No crowded kennels, no rushed potty breaks—just a safe, cozy
              retreat designed for relaxation and joy.
            </motion.p>
            <motion.p
              className="text-lg text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              And yes, I go the extra mile. From enrichment walks and cuddle time to optional extras like PAW-casso paintings and
              storytime, I make sure each dog feels safe, engaged, and loved while you're away. My place is kept sparkling clean,
              and I send tons of updates so you'll always know your pup is happy and in good hands.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
