import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Define response type
type ResponseData = {
  success: boolean;
  message: string;
};

// Configure email settings
const EMAIL_CONFIG = {
  recipientEmail:
    process.env.BOOKING_RECIPIENT_EMAIL || "johnny_gerrard@icloud.com", // Use environment variable with fallback
  subject: "New Booking Request",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      petName,
      petType,
      startDate,
      endDate,
      addons,
      notes,
    } = req.body;

    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !petName ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate pet type (must be dog or cat)
    if (petType !== "dog" && petType !== "cat") {
      return res
        .status(400)
        .json({ success: false, message: "Pet type must be dog or cat" });
    }

    // Validate that end date is after start date
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res
        .status(400)
        .json({ success: false, message: "End date must be after start date" });
    }

    // Calculate number of nights
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format addons for email
    const selectedAddons = Object.entries(addons)
      .filter(([_, selected]) => selected)
      .map(([name, _]) => {
        switch (name) {
          case "extraWalk":
            return "Extra Walk (+$10/day)";
          case "medicationAdmin":
            return "Medication Administration (+$5/day)";
          case "plantWatering":
            return "Plant Watering (+$5/visit)";
          case "houseSitting":
            return "House Sitting (+$15/day)";
          default:
            return name;
        }
      });

    // Format dates for email
    const formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create email content
    const emailContent = `
      <h2>New Booking Request</h2>
      <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Pet Name:</strong> ${petName}</p>
      <p><strong>Pet Type:</strong> ${
        petType.charAt(0).toUpperCase() + petType.slice(1)
      }</p>
      <p><strong>Service Period:</strong> ${formattedStartDate} to ${formattedEndDate}</p>
      <p><strong>Number of Nights:</strong> ${nights}</p>
      
      ${
        selectedAddons.length > 0
          ? `
        <h3>Additional Services:</h3>
        <ul>
          ${selectedAddons.map((addon) => `<li>${addon}</li>`).join("")}
        </ul>
      `
          : ""
      }
      
      ${
        notes
          ? `
        <h3>Additional Notes:</h3>
        <p>${notes}</p>
      `
          : ""
      }
    `;

    // Setup nodemailer transporter
    // IMPORTANT: EMAIL_SECURE must be set to 'false' in production
    // Setting it to 'true' will cause email sending to fail with most SMTP providers
    // when using port 587 with STARTTLS
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "88f0c6001@smtp-brevo.com",
        pass: process.env.EMAIL_PASS || "wkzmLHvPc2IGSK5f",
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Ruh-Roh Retreat Website" <${
        process.env.EMAIL_FROM || "book@qrganiz.com"
      }>`,
      to: EMAIL_CONFIG.recipientEmail,
      subject: EMAIL_CONFIG.subject,
      html: emailContent,
      replyTo: email,
    });

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Booking request sent successfully" });
  } catch (error) {
    console.error("Error processing booking request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
}
