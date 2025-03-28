import Image from "next/image";

export default function FloatingYogaDog() {
  return (
    <div
      className="absolute right-8 z-10"
      style={{
        bottom: "-60px",
        width: "120px",
        height: "120px",
      }}
    >
      <Image
        src="/yoga-dog.png"
        alt="Yoga Dog"
        width={120}
        height={120}
        className="drop-shadow-lg"
      />
    </div>
  );
}
