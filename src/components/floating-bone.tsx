import Image from "next/image";

export default function FloatingBone() {
  return (
    <div
      className="absolute left-16 z-10"
      style={{
        bottom: "-80px",
        width: "120px",
        height: "120px",
      }}
    >
      <Image
        src="/bone.png"
        alt="Floating Bone"
        width={120}
        height={120}
        className="drop-shadow-lg rotate-[30deg]"
      />
    </div>
  );
}
