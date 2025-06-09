import { motion } from "framer-motion";
import jsPDF from "jspdf";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const WaiverPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [initials, setInitials] = useState<string[]>([]);
  const [userInitials, setUserInitials] = useState<string>(""); // Store user's initials for auto-fill
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
      title: "Dog Behavior in New Environments",
      content: `I understand that dogs may behave differently in unfamiliar environments. Barking, anxiety, destructive behavior, or stress responses may occur even if my dog has not displayed these behaviors at home.`,
      requiresInitial: true,
    },
    {
      title: "Accurate Behavior Disclosure",
      content: `I confirm that I have truthfully disclosed all known behavioral issues, including but not limited to: barking, anxiety, destructiveness, reactivity, or intolerance to confinement. I understand that failure to disclose these issues may result in early termination of the stay and/or financial responsibility for damages.`,
      requiresInitial: true,
    },
    {
      title: "Emergency Contact & Alternate Arrangements",
      content: `I have provided a local emergency contact who is available to pick up my dog within 2 hours if requested. If the contact is unavailable, I understand that alternate arrangements with another sitter may be necessary.`,
      requiresInitial: true,
    },
    {
      title: "Property Damage Responsibility",
      content: `I understand this is the sitter's personal residence, not a commercial facility. If my dog causes damage (e.g., carpet, furniture, doors, walls, or personal belongings), I agree to reimburse the full cost of repair or replacement.`,
      requiresInitial: true,
    },
    {
      title: "Veterinary Care Authorization",
      content: `If my dog becomes ill or injured during the stay, I authorize the sitter to seek veterinary care and agree to reimburse any related expenses, including emergency transport fees.`,
      requiresInitial: true,
    },
    {
      title: "Early Pickup or Removal Due to Behavior",
      content: `If my dog displays disruptive or unsafe behavior (e.g., excessive barking, destruction, aggression, or stress to other dogs), I understand that I may be required to pick up my dog early or arrange alternative care.`,
      requiresInitial: true,
    },
    {
      title: "Pet Separation When Sitter Is Away",
      content: `I understand that while the sitter may be away from the home for short periods (typically 1-2 hours max), dogs will be safely separated into different areas of the home. These areas may include bedrooms, the master bathroom, the walk-in closet (for smaller dogs only), or the patio, depending on temperament and safety.`,
      requiresInitial: true,
    },
    {
      title: "No Liability for Pre-Existing or Behavioral Issues",
      content: `I agree not to hold the sitter liable for illness, injury, or behavioral regression during the stay, particularly in cases involving pre-existing conditions or behavioral issues that were not disclosed.`,
      requiresInitial: true,
    },
    {
      title: "Refund Policy",
      content: `I understand that refunds are at the discretion of the sitter. If damage, disruption, behavioral issues, or changes to my travel plans result in early termination of the stay, refunds may not be provided.`,
      requiresInitial: true,
    },
  ];

  const resetSignature = () => {
    signatureRef.current?.clear();
    setHasSignature(false);
  };

  const handleInitialChange = (index: number, value: string) => {
    const newInitials = [...initials];
    const upperValue = value.toUpperCase(); // Convert to uppercase for consistency
    newInitials[index] = upperValue;
    setInitials(newInitials);
  };

  const handleInitialBlur = (index: number) => {
    // Store the first complete initials when user finishes editing
    const currentValue = initials[index];
    if (!userInitials && currentValue && currentValue.trim().length >= 2) {
      setUserInitials(currentValue);
    }
  };

  const handleInitialClick = (index: number) => {
    // Auto-fill with previously entered initials if this field is empty
    if (!initials[index] && userInitials) {
      const newInitials = [...initials];
      newInitials[index] = userInitials;
      setInitials(newInitials);
    }
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

  const loadSitterSignature = async (): Promise<string | null> => {
    try {
      const response = await fetch("/signatures/sitter-signature.png");
      if (response.ok) {
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
      return null;
    } catch (error) {
      console.log("No sitter signature found");
      return null;
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Set default font size for better readability
    pdf.setFontSize(11);

    // Header
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Pet Sitting Agreement & Waiver", pageWidth / 2, yPosition, {
      align: "center",
    });

    yPosition += 22;

    // Customer Information
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Customer Information:", 20, yPosition);
    yPosition += 9;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Customer Name: ${customerName}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Email: ${customerEmail}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Pet Name: ${petName}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Emergency Contact: ${emergencyContact}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Emergency Phone: ${emergencyPhone}`, 20, yPosition);
    yPosition += 10;

    // Agreement date
    pdf.text(
      `Agreement Date: ${new Date().toLocaleDateString()}`,
      20,
      yPosition
    );
    yPosition += 12;

    // Waiver sections
    for (let i = 0; i < waiverSections.length; i++) {
      const section = waiverSections[i];

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${i + 1}. ${section.title}`, 20, yPosition);
      yPosition += 9;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const splitText = pdf.splitTextToSize(section.content, pageWidth - 40);
      pdf.text(splitText, 20, yPosition);
      yPosition += splitText.length * 4.5 + 9;

      if (section.requiresInitial && initials[i]) {
        // Add initial as text
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          `Customer Initials: ${initials[i]}`,
          pageWidth - 80,
          yPosition
        );
        pdf.setFont("helvetica", "normal");
      }

      yPosition += 15;
    }

    // Signature section
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Customer Signature and Acknowledgment", 20, yPosition);
    yPosition += 13;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    const acknowledgmentText = `By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions outlined in this Pet Sitting Agreement. I confirm that all information provided is accurate and complete.`;
    const splitAck = pdf.splitTextToSize(acknowledgmentText, pageWidth - 40);
    pdf.text(splitAck, 20, yPosition);
    yPosition += splitAck.length * 4.5 + 13;

    // Signature Lines Section
    yPosition += 10;

    // Define consistent dimensions and layout - clean inline format (fit within page margins)
    const signatureWidth = 70; // Reduced to fit page
    const signatureHeight = 25;
    const signatureStartX = 75; // Start after "Customer Signature:" label
    const dateStartX = 150; // Date section starts after signature (reduced)
    const dateWidth = 35; // Reduced date area width to fit page

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    // Customer Signature Row
    pdf.text("Customer Signature:", 20, yPosition);

    // Customer signature area
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      try {
        const signatureData = signatureRef.current.toDataURL();
        pdf.addImage(
          signatureData,
          "PNG",
          signatureStartX,
          yPosition - 15,
          signatureWidth,
          signatureHeight
        );
      } catch (error) {
        pdf.line(
          signatureStartX,
          yPosition,
          signatureStartX + signatureWidth,
          yPosition
        );
      }
    } else {
      pdf.line(
        signatureStartX,
        yPosition,
        signatureStartX + signatureWidth,
        yPosition
      );
    }

    // Add signature line underneath
    pdf.line(
      signatureStartX,
      yPosition,
      signatureStartX + signatureWidth,
      yPosition
    );

    // Date section for customer
    pdf.text("Date:", dateStartX, yPosition);
    pdf.line(
      dateStartX + 20,
      yPosition,
      dateStartX + 20 + dateWidth,
      yPosition
    );
    pdf.text(
      `${new Date().toLocaleDateString()}`,
      dateStartX + 22,
      yPosition - 3
    );

    yPosition += 25;

    // Check if we need a new page for sitter signature (need more space for signature + date)
    if (yPosition > pageHeight - 70) {
      pdf.addPage();
      yPosition = 20;
    }

    // Sitter Signature Row
    pdf.text("Sitter Signature:", 20, yPosition);

    // Sitter signature area
    try {
      const sitterSignatureData = await loadSitterSignature();
      if (sitterSignatureData) {
        pdf.addImage(
          sitterSignatureData,
          "PNG",
          signatureStartX,
          yPosition - 15,
          signatureWidth,
          signatureHeight
        );
      } else {
        pdf.line(
          signatureStartX,
          yPosition,
          signatureStartX + signatureWidth,
          yPosition
        );
      }
    } catch (error) {
      pdf.line(
        signatureStartX,
        yPosition,
        signatureStartX + signatureWidth,
        yPosition
      );
    }

    // Add signature line underneath
    pdf.line(
      signatureStartX,
      yPosition,
      signatureStartX + signatureWidth,
      yPosition
    );

    // Date section for sitter
    pdf.text("Date:", dateStartX, yPosition);
    pdf.line(
      dateStartX + 20,
      yPosition,
      dateStartX + 20 + dateWidth,
      yPosition
    );
    pdf.text(
      `${new Date().toLocaleDateString()}`,
      dateStartX + 22,
      yPosition - 3
    );

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
            <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
              Pet Sitting Agreement & Waiver
            </h1>
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
                  {waiverSections[currentSection - 1].title}
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
                          onBlur={() => handleInitialBlur(currentSection - 1)}
                          onClick={() => handleInitialClick(currentSection - 1)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-semibold text-lg uppercase cursor-pointer"
                          placeholder={userInitials || "A.B."}
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
                          {userInitials && (
                            <span className="text-blue-600 block mt-1">
                              💡 Tip: Click the input field to auto-fill with
                              your initials ({userInitials})
                            </span>
                          )}
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
                  <div className="flex flex-col gap-4">
                    <div className="border border-gray-300 rounded overflow-hidden">
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
                          width:
                            typeof window !== "undefined" &&
                            window.innerWidth < 768
                              ? Math.min(350, window.innerWidth - 80)
                              : 400,
                          height: 150,
                          className: "signature-canvas bg-white max-w-full",
                        }}
                      />
                    </div>
                    <div className="flex justify-center">
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
