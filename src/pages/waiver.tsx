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
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [petName, setPetName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);
  // Don't change content of the waiver sections.
  // Waiver sections that require initials
  const waiverSections = [
    {
      title: "Dogs in New Environments",
      content: `Dogs can act differently in a new place — even the sweetest pup might bark more, feel anxious, or chew things when they normally wouldn't. That's completely normal, but it helps to be prepared.`,
      requiresInitial: true,
    },
    {
      title: "Honest Behavior Info",
      content: `Please let me know about any habits or behaviors ahead of time — barking, chewing, reactivity, anxiety, etc. This isn't to judge your dog; it's so I can set them up for success. If something important isn't shared, I may need to end the stay early and any related damages would be the owner's responsibility.`,
      requiresInitial: true,
    },
    {
      title: "Emergency Contact",
      content: `I'll need a local contact who can pick up your dog within 2 hours if needed. If that person isn't available, I may have to make other arrangements for your dog's care.`,
      requiresInitial: true,
    },
    {
      title: "Damage to My Home",
      content: `This is my personal home, not a kennel. If your dog directly causes damage (for example: carpet, furniture, walls, or personal items), I'll document it and share photos with you. You agree to cover the cost of repair or replacement for the specific damage your dog caused.`,
      requiresInitial: true,
    },
    {
      title: "Vet Care",
      content: `If your dog needs the vet, I'll always try to reach you first for non-emergencies. In an emergency, I'll do what's best for your dog right away. If possible, I'll use your preferred vet. Owners are responsible for any vet costs.`,
      requiresInitial: true,
    },
    {
      title: "Early Pickup for Behavior Issues",
      content: `If your dog shows unsafe or very disruptive behavior (like constant barking, destruction, or aggression), I may need you to pick them up early or arrange other care.`,
      requiresInitial: true,
    },
    {
      title: "Separation When I'm Away",
      content: `When I'm out for short periods (usually no more than 1-2 hours), dogs are safely separated into their own spaces — like a bedroom, bathroom, or crate (with your permission). This keeps everyone safe and stress-free.`,
      requiresInitial: true,
    },
    {
      title: "Multi-Dog Environment",
      content: `I work hard to match dogs who get along, supervise play, and keep everyone safe. Still, in any group of dogs, there’s always a small risk of accidental injury or disagreements. By booking, you accept this small inherent risk.`,
      requiresInitial: true,
    },
    {
      title: "Illness, Injury, and Negligence",
      content: `I'm not responsible for illness, injury, or behavioral changes caused by pre-existing conditions or undisclosed behavioral issues.
If something happens due to clear and provable negligence (which means ignoring basic safety steps that a reasonable sitter would follow), then I would take responsibility. This does not include unforeseeable accidents or things that could not have reasonably been prevented.`,
      requiresInitial: true,
    },
    {
      title: "Pre-Existing Conditions",
      content: `I'm not responsible for medical costs or outcomes related to pre-existing or chronic conditions, or issues not disclosed before the stay.`,
      requiresInitial: true,
    },
    {
      title: "Flea Prevention",
      content: `To keep our home a comfortable, itch-free space for all dogs, every pet must be up to date on a vet-approved flea prevention before their stay. If fleas are found at drop-off or during the stay, we will contact you right away. Your dog may need a flea bath or treatment (at your expense) and may be separated from other pets to prevent spreading. This policy helps protect all dogs in our care and ensures a safe, clean environment for everyone.`,
      requiresInitial: true,
    },
    {
      title: "Refunds",
      content: `Refunds aren't guaranteed, but I always aim to be fair based on the circumstances.`,
      requiresInitial: true,
    },
    {
      title: "Privacy",
      content: `Any personal info you share (name, phone, address, etc.) is kept private and used only for your dog’s care or emergencies.`,
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
      customerPhone &&
      customerAddress &&
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
    pdf.text(`Phone: ${customerPhone}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Address: ${customerAddress}`, 20, yPosition);
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

    // Agreement introduction
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    const introText = `This agreement is designed to help create a safe, happy environment for your dog and protect everyone involved. It is based on real experiences and reflects my commitment to quality care, transparency, and mutual protection.`;
    const splitIntro = pdf.splitTextToSize(introText, pageWidth - 40);
    pdf.text(splitIntro, 20, yPosition);
    yPosition += splitIntro.length * 5 + 10;

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
      formData.append("customerPhone", customerPhone);
      formData.append("customerAddress", customerAddress);
      formData.append("petName", petName);
      formData.append("emergencyContact", emergencyContact);
      formData.append("emergencyPhone", emergencyPhone);

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
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Waiver
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
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Address *
                    </label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full home address"
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

                {/* Agreement Introduction */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Agreement Introduction:
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      This agreement is here to make sure your dog's stay is
                      happy, safe, and comfortable — and that we both know what
                      to expect. It's based on real experiences and is meant to
                      protect you, your dog, and my home. It works alongside
                      Rover's terms and covers things they may not.
                    </p>
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
                  Customer Signature and Acknowledgment
                </h2>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    By signing below, I confirm I've read and agree to this
                    agreement, and all the information I've given is accurate.
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
                        customerPhone &&
                        customerAddress &&
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
                        customerPhone &&
                        customerAddress &&
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
