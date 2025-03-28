import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingBone() {
  return (
    <motion.div
      className="absolute left-4 md:left-16 z-10"
      style={{
        bottom: "-80px",
        width: "120px",
        height: "120px",
      }}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Image
        src="/bone.png"
        alt="Floating Bone"
        width={120}
        height={120}
        className="drop-shadow-lg rotate-[30deg]"
      />
    </motion.div>
  );
}
