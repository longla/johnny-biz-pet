import { ChangeEvent, FormEvent, RefObject, useEffect, useState } from "react";

import services from "../../lib/services.js";
import { Location } from "./types";

type BookingForm = {
  city: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  startDate: string;
  endDate: string;
  addons: { [key: string]: boolean };
  notes: string;
};

type BookingSectionProps = {
  sectionRef: RefObject<HTMLElement>;
  locations: Location[];
};

function BookingSection({ sectionRef, locations }: BookingSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);
  const [bookingForm, setBookingForm] = useState<BookingForm>(() => ({
    city: locations[0]?.name ?? "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    petName: "",
    petType: "dog",
    startDate: "",
    endDate: "",
    addons: {},
    notes: "",
  }));
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");
  const [nightsCount, setNightsCount] = useState<number | null>(null);

  useEffect(() => {
    if (bookingForm.startDate && bookingForm.endDate) {
      const start = new Date(bookingForm.startDate);
      const end = new Date(bookingForm.endDate);

      if (end < start) {
        setDateError("End date must be after start date");
        setNightsCount(null);
      } else {
        setDateError("");
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNightsCount(diffDays);
      }
    } else {
      setNightsCount(null);
    }
  }, [bookingForm.startDate, bookingForm.endDate]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value,
    });
  };

  const handleLocationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const newLocation = locations.find((loc) => loc.id === locationId);
    if (!newLocation) return;

    setSelectedLocation(newLocation);
    setBookingForm({
      ...bookingForm,
      city: newLocation.name,
      addons: {},
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setBookingForm({
      ...bookingForm,
      addons: {
        ...bookingForm.addons,
        [name]: checked,
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    (window as any).clarity?.("event", "Request Booking Clicked");

    if (dateError) {
      alert("Please correct the date error before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred while submitting your booking request");
      }

      setFormSubmitted(true);

      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      setBookingForm({
        city: selectedLocation?.name ?? locations[0]?.name ?? "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        petName: "",
        petType: "dog",
        startDate: "",
        endDate: "",
        addons: {},
        notes: "",
      });
      setNightsCount(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your booking request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" ref={sectionRef} className="py-20 bg-[#F4F4F9]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">Book My Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to request pet care services. I'll get back to you within 24 hours to confirm your booking.
          </p>
        </div>

        {formSubmitted ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Booking Request Received!</h3>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your request. I've received your booking details and will contact you shortly to confirm your reservation.
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setTimeout(() => {
                  sectionRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="bg-[#1A9CB0] hover:bg-[#158294] text-white font-bold py-2 px-6 rounded-full text-lg transition-colors duration-300"
            >
              Make Another Booking
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
                  Location *
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={selectedLocation?.id}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={bookingForm.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={bookingForm.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={bookingForm.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={bookingForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="petName" className="block text-gray-700 font-medium mb-2">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    required
                    value={bookingForm.petName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
                <div>
                  <label htmlFor="petType" className="block text-gray-700 font-medium mb-2">
                    Pet Type *
                  </label>
                  <select
                    id="petType"
                    name="petType"
                    required
                    value={bookingForm.petType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    required
                    value={bookingForm.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    required
                    value={bookingForm.endDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  />
                </div>
              </div>

              {nightsCount !== null && (
                <div className="mb-6 text-gray-700">
                  <p>
                    Total nights: <span className="font-semibold">{nightsCount}</span>
                  </p>
                </div>
              )}

              {dateError && <p className="text-red-500 mb-6">{dateError}</p>}

              {selectedLocation?.showAddons && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Enhance Your Pet's Stay</h3>
                  <p className="text-gray-600 mb-4">
                    Select any add-ons you'd like to include. You can always modify these later during our meet & greet.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(services).map(([category, addons]) => (
                      <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">{category}</h4>
                        <div className="space-y-2">
                          {addons.map((addon: { name: string; price: string; description: string }) => (
                            <label key={addon.name} className="flex items-start">
                              <input
                                type="checkbox"
                                name={addon.name}
                                checked={!!bookingForm.addons[addon.name]}
                                onChange={handleCheckboxChange}
                                className="mt-1 mr-3 h-4 w-4 text-[#F28C38] focus:ring-[#F28C38] border-gray-300 rounded"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{addon.name}</p>
                                <p className="text-sm text-gray-600">{addon.description}</p>
                                <p className="text-sm font-semibold text-[#F28C38]">{addon.price}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={bookingForm.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A9CB0]"
                  placeholder="Tell us about any special requirements, your pet's routine, or other important details..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !!dateError}
                  className={`${
                    isSubmitting || dateError
                      ? "bg-gray-400"
                      : "bg-[#F28C38] hover:bg-[#e07a26]"
                  } text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 relative paw-button`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Request Booking"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default BookingSection;
