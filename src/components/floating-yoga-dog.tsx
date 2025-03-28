import Image from "next/image";

export default function FloatingYogaDog() {
  return (
    <div
      className="absolute right-4 md:right-16 z-10"
      style={{
        bottom: "-60px",
        width: "180px",
        height: "180px",
      }}
    >
      <Image
        src="/yoga-dog.png"
        alt="Yoga Dog"
        width={180}
        height={180}
        className="drop-shadow-lg"
      />
    </div>
  );
}
