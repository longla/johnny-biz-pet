import Image from "next/image";
import MainLayout from "./_layouts";

export default function About() {
  return (
    <MainLayout
      title="About Us - Ruh-Roh Retreat | Professional Pet Sitting Services"
      description="Learn about Ruh-Roh Retreat's mission, values, and commitment to providing exceptional pet sitting services in your home."
    >
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          About Ruh-Roh Retreat
        </h1>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Image
              src="/about-image.jpg"
              alt="Ruh-Roh Retreat Facility"
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-gray-700">
              At Ruh-Roh Retreat, we believe that pets deserve the same level of
              care and attention when their owners are away as they receive at
              home. Our mission is to provide professional, reliable, and loving
              pet sitting services that give you peace of mind and your pets the
              comfort they deserve.
            </p>

            <h2 className="text-2xl font-semibold">Our Values</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Professionalism and reliability</li>
              <li>Safety and security</li>
              <li>Personalized care for each pet</li>
              <li>Open communication with pet owners</li>
              <li>Continuous improvement and learning</li>
            </ul>

            <h2 className="text-2xl font-semibold">Our Commitment</h2>
            <p className="text-gray-700">
              We are committed to providing exceptional service to both pets and
              their owners. Our team of experienced pet sitters undergoes
              thorough background checks and receives ongoing training to ensure
              the highest standards of care.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
