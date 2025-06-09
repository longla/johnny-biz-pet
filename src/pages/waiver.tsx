import { motion } from "framer-motion";
import jsPDF from "jspdf";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const WaiverPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [initials, setInitials] = useState<string[]>([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [petName, setPetName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  // Waiver sections that require initials
  const waiverSections = [
    {
      title: "Pet Care and Custody Agreement",
      content: `I acknowledge that Ruh-Roh Retreat will provide pet care services for my pet(s) as described in our agreement. I understand that my pet will be cared for in a home environment and will receive personal attention and care.

I agree to provide accurate and complete information about my pet's health, behavior, medical needs, and any special requirements. I will inform Ruh-Roh Retreat of any changes to my pet's condition or needs.`,
      requiresInitial: true,
    },
    {
      title: "Medical Care and Emergency Authorization",
      content: `I authorize Ruh-Roh Retreat to seek emergency veterinary care for my pet if needed. I understand that I will be responsible for all veterinary costs incurred during the care period.

I will provide current veterinary contact information and authorize Ruh-Roh Retreat to communicate with my veterinarian regarding my pet's care. In case of emergency, I authorize necessary medical treatment to be administered.`,
      requiresInitial: true,
    },
    {
      title: "Liability and Release",
      content: `I understand that pet care involves inherent risks. I release Ruh-Roh Retreat from liability for any injury, illness, or death of my pet that may occur due to natural causes, pet-to-pet interactions, or unforeseeable circumstances beyond reasonable control.

I acknowledge that Ruh-Roh Retreat has taken reasonable precautions to ensure my pet's safety and well-being. I agree that this release extends to all family members, employees, and agents of Ruh-Roh Retreat.`,
      requiresInitial: true,
    },
    {
      title: "Property and Damage",
      content: `I agree to be responsible for any damage caused by my pet to property or other pets while in the care of Ruh-Roh Retreat. I understand that normal wear and tear is expected and accepted.

I acknowledge that I have disclosed any destructive behaviors or tendencies of my pet. I agree to cover costs for any damage beyond normal wear and tear that occurs during the care period.`,
      requiresInitial: true,
    },
    {
      title: "Medication and Special Care",
      content: `I authorize Ruh-Roh Retreat to administer medications as directed and to provide special care as needed for my pet's health and comfort. I will provide clear written instructions for all medications and special care requirements.

I understand that while every effort will be made to follow medication schedules precisely, I release Ruh-Roh Retreat from liability for any adverse reactions or missed doses, provided reasonable care was exercised.`,
      requiresInitial: true,
    },
    {
      title: "Communication and Updates",
      content: `I understand that Ruh-Roh Retreat will provide regular updates about my pet's well-being through photos, videos, and messages. I acknowledge that the frequency of updates may vary based on circumstances and the length of care.

I agree to provide current contact information and to be reasonably available for communication regarding my pet's care. I will inform Ruh-Roh Retreat of any changes to my contact information during the care period.`,
      requiresInitial: true,
    },
  ];

  const resetSignature = () => {
    signatureRef.current?.clear();
    setHasSignature(false);
  };

  const handleInitialChange = (index: number, value: string) => {
    const newInitials = [...initials];
    newInitials[index] = value.toUpperCase(); // Convert to uppercase for consistency
    setInitials(newInitials);
  };

  const isAllRequiredFieldsComplete = () => {
    const requiredInitials = waiverSections.filter(
      (section) => section.requiresInitial
    ).length;
    const hasAllInitials =
      initials.filter((initial) => initial && initial.trim().length > 0)
        .length === requiredInitials;
    const hasSignatureComplete = hasSignature;
    const hasRequiredInfo =
      customerName &&
      customerEmail &&
      petName &&
      emergencyContact &&
      emergencyPhone;

    return hasAllInitials && hasSignatureComplete && hasRequiredInfo;
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Pet Sitting Agreement & Waiver", pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "Ruh-Roh Retreat - Premium Pet Care Services",
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    pdf.text(
      "12207 Pintado, Irvine, CA, 92618 | (714) 329-4534",
      pageWidth / 2,
      yPosition + 8,
      { align: "center" }
    );

    yPosition += 25;

    // Customer Information
    pdf.setFont("helvetica", "bold");
    pdf.text("Customer Information:", 20, yPosition);
    yPosition += 10;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Customer Name: ${customerName}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Email: ${customerEmail}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Pet Name: ${petName}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Emergency Contact: ${emergencyContact}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Emergency Phone: ${emergencyPhone}`, 20, yPosition);
    yPosition += 15;

    // Agreement date
    pdf.text(
      `Agreement Date: ${new Date().toLocaleDateString()}`,
      20,
      yPosition
    );
    yPosition += 15;

    // Waiver sections
    for (let i = 0; i < waiverSections.length; i++) {
      const section = waiverSections[i];

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFont("helvetica", "bold");
      pdf.text(`${i + 1}. ${section.title}`, 20, yPosition);
      yPosition += 10;

      pdf.setFont("helvetica", "normal");
      const splitText = pdf.splitTextToSize(section.content, pageWidth - 40);
      pdf.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 10;

      if (section.requiresInitial && initials[i]) {
        // Add initial as text
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `Customer Initials: ${initials[i]}`,
          pageWidth - 80,
          yPosition
        );
        pdf.setFont("helvetica", "normal");
      }

      yPosition += 20;
    }

    // Signature section
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont("helvetica", "bold");
    pdf.text("Customer Signature and Acknowledgment", 20, yPosition);
    yPosition += 15;

    pdf.setFont("helvetica", "normal");
    const acknowledgmentText = `By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions outlined in this Pet Sitting Agreement. I confirm that all information provided is accurate and complete.`;
    const splitAck = pdf.splitTextToSize(acknowledgmentText, pageWidth - 40);
    pdf.text(splitAck, 20, yPosition);
    yPosition += splitAck.length * 5 + 15;

    // Add signature
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      try {
        const signatureData = signatureRef.current.toDataURL();
        pdf.addImage(signatureData, "PNG", 20, yPosition, 120, 40);
      } catch (error) {
        pdf.text("[ Customer Signature ]", 20, yPosition + 20);
      }
    }

    pdf.text("Customer Signature", 20, yPosition + 45);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPosition + 45);

    return pdf;
  };

  const handleSubmit = async () => {
    if (!isAllRequiredFieldsComplete()) {
      alert(
        "Please complete all required fields, initials, and signature before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const pdf = await generatePDF();
      const pdfBlob = pdf.output("blob");

      // Create FormData to send PDF and email info
      const formData = new FormData();
      formData.append("pdf", pdfBlob, "pet-sitting-waiver.pdf");
      formData.append("customerEmail", customerEmail);
      formData.append("customerName", customerName);
      formData.append("petName", petName);

      const response = await fetch("/api/submit-waiver", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        throw new Error("Failed to submit waiver");
      }
    } catch (error) {
      console.error("Error submitting waiver:", error);
      alert("There was an error submitting your waiver. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Waiver Completed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the pet sitting agreement waiver. A copy
            has been sent to your email and our team.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Pet Sitting Agreement & Waiver
            </h1>
            <p className="text-center mt-2 text-blue-100">
              Ruh-Roh Retreat - Premium Pet Care Services
            </p>
            <div className="text-center mt-4 text-sm text-blue-100">
              <p>12207 Pintado, Irvine, CA, 92618 | (714) 329-4534</p>
              <p>hello@ruhrohretreat.com</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-2">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{
                width: `${
                  ((currentSection + 1) / (waiverSections.length + 2)) * 100
                }%`,
              }}
            />
          </div>

          <div className="p-6">
            {/* Customer Information Section */}
            {currentSection === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Customer Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Name *
                    </label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your pet's name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact person"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Emergency contact phone number"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Waiver Sections */}
            {currentSection > 0 && currentSection <= waiverSections.length && (
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {currentSection}. {waiverSections[currentSection - 1].title}
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {waiverSections[currentSection - 1].content}
                  </p>
                </div>

                {waiverSections[currentSection - 1].requiresInitial && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Please enter your initials to acknowledge this section:
                    </h3>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Your Initials *
                        </label>
                        <input
                          type="text"
                          value={initials[currentSection - 1] || ""}
                          onChange={(e) =>
                            handleInitialChange(
                              currentSection - 1,
                              e.target.value
                            )
                          }
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-lg uppercase"
                          placeholder="A.B."
                          maxLength={10}
                          required
                        />
                        {initials[currentSection - 1] && (
                          <span className="text-green-600 text-sm">
                            ✓ Initials entered
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 max-w-md">
                        <p>
                          Enter your initials (e.g., "J.D." for John Doe) to
                          acknowledge that you have read and agree to this
                          section.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Final Signature Section */}
            {currentSection === waiverSections.length + 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  Final Signature
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    By signing below, I acknowledge that I have read,
                    understood, and agree to all terms and conditions outlined
                    in this Pet Sitting Agreement. I confirm that all
                    information provided is accurate and complete.
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Please sign below:
                  </h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="border border-gray-300 rounded">
                      <SignatureCanvas
                        ref={signatureRef}
                        onEnd={() => {
                          // Check if signature has content after drawing ends
                          if (
                            signatureRef.current &&
                            !signatureRef.current.isEmpty()
                          ) {
                            setHasSignature(true);
                          }
                        }}
                        canvasProps={{
                          width: 400,
                          height: 150,
                          className: "signature-canvas bg-white",
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={resetSignature}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Clear Signature
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Review Checklist:
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li
                      className={`flex items-center gap-2 ${
                        customerName &&
                        customerEmail &&
                        petName &&
                        emergencyContact &&
                        emergencyPhone
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      <span>
                        {customerName &&
                        customerEmail &&
                        petName &&
                        emergencyContact &&
                        emergencyPhone
                          ? "✓"
                          : "○"}
                      </span>
                      Customer information completed
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        initials.filter((i) => i && i.trim().length > 0)
                          .length ===
                        waiverSections.filter((s) => s.requiresInitial).length
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      <span>
                        {initials.filter((i) => i && i.trim().length > 0)
                          .length ===
                        waiverSections.filter((s) => s.requiresInitial).length
                          ? "✓"
                          : "○"}
                      </span>
                      All sections initialed (
                      {initials.filter((i) => i && i.trim().length > 0).length}/
                      {waiverSections.filter((s) => s.requiresInitial).length})
                    </li>
                    <li
                      className={`flex items-center gap-2 ${
                        hasSignature ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      <span>{hasSignature ? "✓" : "○"}</span>
                      Final signature completed
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() =>
                  setCurrentSection(Math.max(0, currentSection - 1))
                }
                disabled={currentSection === 0}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentSection < waiverSections.length + 1 ? (
                <button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isAllRequiredFieldsComplete() || isSubmitting}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Waiver"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaiverPage;
