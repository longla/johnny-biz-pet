import { RefObject, useEffect, useState } from "react";

type MeetGreetSectionProps = {
  sectionRef: RefObject<HTMLElement>;
};

function MeetGreetSection({ sectionRef }: MeetGreetSectionProps) {
  const [isCalendlyLoading, setIsCalendlyLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;

    script.onload = () => {
      const checkCalendlyLoaded = setInterval(() => {
        if (document.querySelector(".calendly-inline-widget iframe")) {
          setIsCalendlyLoading(false);
          clearInterval(checkCalendlyLoaded);
        }
      }, 300);

      setTimeout(() => {
        setIsCalendlyLoading(false);
        clearInterval(checkCalendlyLoaded);
      }, 5000);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="meet-greet" ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Schedule a Meet & Greet</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I believe in building trust before service begins. Schedule a free 30-minute Meet & Greet to introduce your pets to
            me, discuss your specific needs, and take a tour of my space.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/hello-ruhrohretreat/30min"
            style={{ minWidth: "320px", height: "700px" }}
          >
            {isCalendlyLoading && <p className="text-center py-16 text-gray-500">Loading calendar...</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetGreetSection;
