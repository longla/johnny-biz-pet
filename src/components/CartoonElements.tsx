// Cartoon Elements component with various decorative elements
import Image from "next/image";
import React from "react";

export const CartoonElements = {
  // Logo Component
  Logo: () => (
    <div className="flex items-center">
      <div className="relative h-12 w-12 mr-3">
        <div className="absolute inset-0 bg-primary-400 rounded-full shadow-lg transform -rotate-6"></div>
        <div className="absolute inset-1 flex items-center justify-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="24" r="8" fill="#F9A03F" />
            <circle cx="14" cy="18" r="5" fill="#F9A03F" />
            <circle cx="26" cy="18" r="5" fill="#F9A03F" />
            <circle cx="16" cy="12" r="4" fill="#F9A03F" />
            <circle cx="24" cy="12" r="4" fill="#F9A03F" />
          </svg>
        </div>
      </div>
      <div className="font-Fredoka text-xl text-primary-600">
        Paws <span className="text-orange-500">At Home</span>
      </div>
    </div>
  ),

  // Cloud background for hero section
  CloudBg: () => (
    <div className="hero-cloud-bg">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white bg-opacity-30"
          style={{
            width: `${Math.random() * 150 + 100}px`,
            height: `${Math.random() * 100 + 50}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
          }}
        ></div>
      ))}
    </div>
  ),

  // Wavy Divider - improved version
  WavyDivider: ({
    color = "primary",
  }: {
    color?: "primary" | "skyblue" | "orange";
  }) => {
    let bgColor = "bg-primary-300";
    if (color === "skyblue") bgColor = "bg-skyblue-300";
    if (color === "orange") bgColor = "bg-orange-300";

    return (
      <div className="relative h-16 w-full overflow-hidden my-8">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className={`fill-current ${bgColor}`}
            opacity=".25"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            className={`fill-current ${bgColor}`}
            opacity=".5"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className={`fill-current ${bgColor}`}
            opacity=".75"
          />
        </svg>
      </div>
    );
  },

  // Paw Print Pattern
  PawPattern: ({
    count = 10,
    color = "primary",
  }: {
    count?: number;
    color?: "primary" | "skyblue" | "orange";
  }) => {
    let colorClass = "text-primary-300";
    if (color === "skyblue") colorClass = "text-skyblue-300";
    if (color === "orange") colorClass = "text-orange-300";

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.15]">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`absolute ${colorClass}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 40 40"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="24" r="8" />
              <circle cx="14" cy="18" r="5" />
              <circle cx="26" cy="18" r="5" />
              <circle cx="16" cy="12" r="4" />
              <circle cx="24" cy="12" r="4" />
            </svg>
          </div>
        ))}
      </div>
    );
  },

  // Section with cartoon-styled header
  SectionTitle: ({
    title,
    icon,
  }: {
    title: string;
    icon?: React.ReactNode;
  }) => (
    <div className="section-title">
      <div className="h-1 w-16 bg-orange-300 rounded-full"></div>
      <h2 className="px-6 mx-4 text-center text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
        {icon && <span className="text-primary-500">{icon}</span>}
        {title}
      </h2>
      <div className="h-1 w-16 bg-orange-300 rounded-full"></div>
    </div>
  ),

  // Service Card with cartoon styling
  ServiceCard: ({
    title,
    description,
    icon,
    petAccent = "dog",
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    petAccent?: "dog" | "cat" | "both";
  }) => {
    const petEmoji =
      petAccent === "dog"
        ? "🐶"
        : petAccent === "cat"
        ? "🐱"
        : Math.random() > 0.5
        ? "🐶"
        : "🐱";

    return (
      <div className="card group relative overflow-hidden">
        {/* Corner pet accent */}
        <div className="absolute top-1 right-1 text-lg opacity-30 group-hover:opacity-100 transition-opacity">
          {petEmoji}
        </div>

        <div className="service-icon text-primary-500 text-4xl mb-4">
          {icon}
        </div>
        <h3 className="font-Fredoka text-xl mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  },

  // Testimonial with speech bubble
  Testimonial: ({
    text,
    author,
    petName,
    petType = "dog",
    imageSrc,
  }: {
    text: string;
    author: string;
    petName: string;
    petType?: "dog" | "cat";
    imageSrc?: string;
  }) => (
    <div className="mb-12">
      <div className="speech-bubble mb-6">
        <p className="text-gray-700 italic">{text}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="pet-avatar flex-shrink-0">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${petName}, ${author}'s pet`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-orange-100 flex items-center justify-center text-2xl">
              {petType === "dog" ? "🐶" : "🐱"}
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-800">{author}</p>
          <p className="text-sm text-gray-500">
            Owner of {petName} the {petType === "dog" ? "dog" : "cat"}
          </p>
        </div>
      </div>
    </div>
  ),

  // Polaroid Frame with improved styling
  PolaroidFrame: ({
    src,
    alt,
    caption,
    rotate = "right",
  }: {
    src: string;
    alt: string;
    caption: string;
    rotate?: "right" | "left" | "none";
  }) => {
    const rotationClass =
      rotate === "right" ? "rotate-2" : rotate === "left" ? "-rotate-2" : "";

    return (
      <div className={`polaroid-frame transform ${rotationClass}`}>
        <img src={src} alt={alt} className="mb-2 w-full" />
        <p className="text-center font-Comic text-gray-700">{caption}</p>
      </div>
    );
  },

  // Wooden Sign with improved styling
  WoodenSign: ({ children }: { children: React.ReactNode }) => (
    <div className="wooden-sign">{children}</div>
  ),

  // Cartoon Button
  Button: ({
    children,
    onClick,
    color = "primary",
    className = "",
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    color?: "primary" | "skyblue" | "orange";
    className?: string;
  }) => {
    let buttonClass = "bg-primary-500 hover:bg-primary-600 border-primary-700";
    if (color === "skyblue")
      buttonClass = "bg-skyblue-500 hover:bg-skyblue-600 border-skyblue-700";
    if (color === "orange")
      buttonClass = "bg-orange-500 hover:bg-orange-600 border-orange-700";

    return (
      <button
        onClick={onClick}
        className={`cartoon-button ${buttonClass} ${className}`}
      >
        {children}
      </button>
    );
  },

  // Pet Silhouette
  PetSilhouette: ({
    type = "dog",
    color = "primary",
  }: {
    type?: "dog" | "cat";
    color?: "primary" | "skyblue" | "orange";
  }) => {
    let colorClass = "text-primary-500";
    if (color === "skyblue") colorClass = "text-skyblue-500";
    if (color === "orange") colorClass = "text-orange-500";

    if (type === "dog") {
      return (
        <svg
          className={`${colorClass} w-24 h-24 floating`}
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M75,40 Q90,30 85,15 Q83,5 75,10 Q65,15 60,25 L55,20 Q45,10 35,15 Q25,20 30,30 L25,30 Q15,30 10,40 Q5,50 10,60 Q15,70 25,75 L20,85 Q18,90 25,90 Q30,90 35,85 L45,85 Q50,95 60,95 Q70,95 75,85 L85,85 Q90,80 85,75 Q80,70 75,75 Q90,65 90,50 Q90,40 75,40 Z" />
        </svg>
      );
    }

    return (
      <svg
        className={`${colorClass} w-24 h-24 floating`}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50,15 Q20,20 20,50 Q20,80 50,85 Q80,80 80,50 Q80,20 50,15 Z M30,40 Q25,40 25,45 Q25,50 30,50 Q35,50 35,45 Q35,40 30,40 Z M70,40 Q65,40 65,45 Q65,50 70,50 Q75,50 75,45 Q75,40 70,40 Z M40,65 Q50,75 60,65 Z M25,25 L15,15 Z M75,25 L85,15 Z M55,85 L60,95 Z M45,85 L40,95 Z" />
      </svg>
    );
  },
};

export default CartoonElements;
