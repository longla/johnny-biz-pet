const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

// Sample waiver sections (same as in the actual waiver)
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
    content: `Early Pickup or Removal Due to Behavior: If my dog displays disruptive or unsafe behavior (e.g., excessive barking, destruction, aggression, or stress to other dogs), I understand that I may be required to pick up my dog early or arrange alternative care.`,
    requiresInitial: true,
  },
  {
    title: "Pet Separation When Sitter Is Away",
    content: `I understand that while the sitter may be away from the home for short periods (typically 1-2 hours max), dogs will be safely separated into different areas of the home. These areas may include bedrooms, the master bathroom, the walk-in closet (for smaller dogs only), or the patio, depending on temperament and safety. Pets may also be placed in crates for safety during short absences, but only with prior client approval.`,
    requiresInitial: true,
  },
  {
    title: "No Liability for Pre-Existing or Behavioral Issues",
    content: `I agree not to hold the sitter liable for illness, injury, or behavioral regression during the stay, particularly in cases involving pre-existing conditions or behavioral issues that were not disclosed.`,
    requiresInitial: true,
  },
  {
    title: "Refund Policy",
    content: `I understand that refunds are at the discretion of the sitter. Partial or full refunds may be considered depending on the situation, but are not guaranteed. If damage, disruption, behavioral issues, or changes to my travel plans result in early termination of the stay, refunds may not be provided.`,
    requiresInitial: true,
  },
  {
    title: "Privacy & Data Protection",
    content: `I understand that any personal information I provide - including my name, phone number, address, and optional identification - will be kept strictly confidential and used only for the purpose of pet care and resolving emergencies. The sitter agrees not to misuse my personal data.`,
    requiresInitial: true,
  },
];

// Sample data
const testData = {
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  petName: "Buddy",
  emergencyContact: "Jane Doe",
  emergencyPhone: "(555) 123-4567",
  initials: ["JD", "JD", "JD", "JD", "JD", "JD", "JD", "JD", "JD"], // Sample initials for each section
};

// Load sitter signature function (same as in waiver)
const loadSitterSignature = async () => {
  try {
    const signaturePath = path.join(
      process.cwd(),
      "public",
      "signatures",
      "sitter-signature.png"
    );
    if (fs.existsSync(signaturePath)) {
      const imageBuffer = fs.readFileSync(signaturePath);
      return `data:image/png;base64,${imageBuffer.toString("base64")}`;
    }
    return null;
  } catch (error) {
    console.log("No sitter signature found:", error.message);
    return null;
  }
};

// Generate test PDF function (same logic as in waiver component)
const generateTestPDF = async () => {
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
  pdf.text(`Customer Name: ${testData.customerName}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Email: ${testData.customerEmail}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Pet Name: ${testData.petName}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Emergency Contact: ${testData.emergencyContact}`, 20, yPosition);
  yPosition += 6;
  pdf.text(`Emergency Phone: ${testData.emergencyPhone}`, 20, yPosition);
  yPosition += 10;

  // Agreement date
  pdf.text(`Agreement Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 20;

  // Check if we need a new page for the introduction
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = 20;
  }

  // Agreement introduction
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("AGREEMENT INTRODUCTION:", 20, yPosition);
  yPosition += 9;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  const introText = `This agreement is designed to help create a safe, happy environment for your dog and protect everyone involved. It is based on real experiences and reflects my commitment to quality care, transparency, and mutual protection. This agreement supplements the terms agreed upon via Rover and helps clarify responsibilities in cases not covered by Rover policies.`;
  const splitIntro = pdf.splitTextToSize(introText, pageWidth - 40);
  pdf.text(splitIntro, 20, yPosition);

  // Debug information
  console.log("📄 Introduction text details:");
  console.log(`  - Y position: ${yPosition}`);
  console.log(`  - Number of lines: ${splitIntro.length}`);
  console.log(`  - Page height: ${pageHeight}`);
  console.log(`  - Text content: "${introText.substring(0, 30)}..."`);

  yPosition += splitIntro.length * 6 + 15;

  // Add a separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, yPosition - 10, pageWidth - 20, yPosition - 10);
  pdf.setDrawColor(0, 0, 0);

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

    if (section.requiresInitial && testData.initials[i]) {
      // Add initial as text
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Customer Initials: ${testData.initials[i]}`,
        pageWidth - 80,
        yPosition
      );
      pdf.setFont("helvetica", "normal");
    }

    yPosition += 20;
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

  // Customer signature area (use sitter signature for testing visualization)
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

  // Date section for customer
  pdf.text("Date:", dateStartX, yPosition);
  pdf.line(dateStartX + 20, yPosition, dateStartX + 20 + dateWidth, yPosition);
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
  pdf.line(dateStartX + 20, yPosition, dateStartX + 20 + dateWidth, yPosition);
  pdf.text(
    `${new Date().toLocaleDateString()}`,
    dateStartX + 22,
    yPosition - 3
  );

  return pdf;
};

// Main test function
const testPDFGeneration = async () => {
  try {
    console.log("🧪 Starting PDF generation test...");

    console.log("📋 Test data:");
    console.log(`  Customer: ${testData.customerName}`);
    console.log(`  Pet: ${testData.petName}`);
    console.log(`  Email: ${testData.customerEmail}`);

    const pdf = await generateTestPDF();

    // Save the test PDF
    const outputPath = path.join(process.cwd(), "test-waiver.pdf");
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log("✅ PDF generation test completed successfully!");
    console.log(`📁 Test PDF saved to: ${outputPath}`);
    console.log(
      `📄 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`
    );

    // Check if sitter signature was loaded
    const sitterSigPath = path.join(
      process.cwd(),
      "public",
      "signatures",
      "sitter-signature.png"
    );
    if (fs.existsSync(sitterSigPath)) {
      console.log("✅ Sitter signature loaded successfully");
    } else {
      console.log("⚠️  No sitter signature found - using line placeholder");
    }
  } catch (error) {
    console.error("❌ PDF generation test failed:");
    console.error(error);
    process.exit(1);
  }
};

// Run the test
if (require.main === module) {
  testPDFGeneration();
}

module.exports = { testPDFGeneration, generateTestPDF };
