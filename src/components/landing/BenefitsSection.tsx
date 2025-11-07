function BenefitsSection() {
  return (
    <section className="py-20 bg-[#F4F4F9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Why Pet Parents Choose Ruh-Roh Retreat</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A home-away-from-home for your pup, with personalized attention, premium add-ons, and peace of mind for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">👩‍⚕️</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Vet Assistant Trained</h3>
              <p className="text-gray-600">Confident in handling everything from medication to post-op care.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">🏡</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Safe, Calm Home</h3>
              <p className="text-gray-600">I host only friendly, house-trained dogs for a peaceful & stress-free stay.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">💎</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Boutique Experience</h3>
              <p className="text-gray-600">
                Your dog stays in a calm, cozy environment with access to enrichment, relaxation, and personalized care — more
                like a luxury retreat than a kennel.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">💖</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">I'm Home All Day</h3>
              <p className="text-gray-600">Your pup gets full-day attention, comfort, and supervision.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">🧼</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Sparkling Clean Space</h3>
              <p className="text-gray-600">I deep-clean after every stay to ensure a healthy environment.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">🌳</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Outdoor Fun</h3>
              <p className="text-gray-600">Private dog park, walking trails, and grassy areas just steps from my door.</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <div className="text-4xl mr-4">🤝</div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#333333]">Trust & Transparency</h3>
              <p className="text-gray-600">
                I give pet parents peace of mind with a home tour during the Meet & Greet so you know exactly where your dog will
                stay. I’m always upfront about how I run my home and will check with you before doing anything out of the
                ordinary with your dog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
