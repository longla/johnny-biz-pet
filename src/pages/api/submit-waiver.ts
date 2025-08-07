import type { Fields, Files } from "formidable";
import { IncomingForm } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { storeCustomerData, storePdfDocument } from "../../lib/s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  success: boolean;
  message: string;
};

const EMAIL_CONFIG = {
  businessEmail:
    process.env.BOOKING_RECIPIENT_EMAIL || "hello@ruhrohretreat.com",
  subject: "New Pet Sitting Waiver Submitted",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Parse form data with file upload
    const form = new IncomingForm();
    const [fields, files] = await new Promise<[Fields, Files]>(
      (resolve, reject) => {
        form.parse(req, (err: any, fields: Fields, files: Files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      }
    );

    const customerEmail = Array.isArray(fields.customerEmail)
      ? fields.customerEmail[0]
      : fields.customerEmail;
    const customerName = Array.isArray(fields.customerName)
      ? fields.customerName[0]
      : fields.customerName;
    const customerPhone = Array.isArray(fields.customerPhone)
      ? fields.customerPhone[0]
      : fields.customerPhone;
    const customerAddress = Array.isArray(fields.customerAddress)
      ? fields.customerAddress[0]
      : fields.customerAddress;
    const petName = Array.isArray(fields.petName)
      ? fields.petName[0]
      : fields.petName;
    const emergencyContact = Array.isArray(fields.emergencyContact)
      ? fields.emergencyContact[0]
      : fields.emergencyContact;
    const emergencyPhone = Array.isArray(fields.emergencyPhone)
      ? fields.emergencyPhone[0]
      : fields.emergencyPhone;

    // Validate required fields
    if (
      !customerEmail ||
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !petName ||
      !emergencyContact ||
      !emergencyPhone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Get the uploaded PDF file
    const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    if (!pdfFile) {
      return res
        .status(400)
        .json({ success: false, message: "PDF file is required" });
    }

    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfFile.filepath);

    // Store customer data and PDF in S3
    let customerId: string;
    let pdfKey: string | undefined;

    try {
      // Generate a unique customer ID
      customerId = `waiver_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Store the PDF with the customer ID
      pdfKey = await storePdfDocument(
        customerId,
        pdfBuffer,
        customerName,
        petName
      );

      // Store customer data with PDF key
      await storeCustomerData(
        {
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          petName,
          emergencyContact,
          emergencyPhone,
        },
        pdfKey,
        customerId
      );

      console.log(
        `Customer data and PDF stored successfully. Customer ID: ${customerId}, PDF Key: ${pdfKey}`
      );
    } catch (error) {
      console.error("Failed to store customer data and PDF in S3:", error);
      // Continue with email sending even if S3 storage fails
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "88f0c6001@smtp-brevo.com",
        pass: process.env.EMAIL_PASS || "wkzmLHvPc2IGSK5f",
      },
    });

    // Email content for business
    const businessEmailContent = `
      <h2>New Pet Sitting Waiver Submitted</h2>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <p><strong>Address:</strong> ${customerAddress}</p>
      <p><strong>Pet Name:</strong> ${petName}</p>
      <p><strong>Emergency Contact:</strong> ${emergencyContact}</p>
      <p><strong>Emergency Phone:</strong> ${emergencyPhone}</p>
      <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <p>The completed waiver is attached to this email. Please review the document and contact the customer to schedule their pet's care.</p>
      
      <hr>
      <p><em>This waiver was submitted through the website waiver system.</em></p>
    `;

    // Email content for customer
    const customerEmailContent = `
      <h2>Thank You for Completing Your Pet Sitting Waiver</h2>
      
      <p>Dear ${customerName},</p>
      
      <p>Thank you for completing the Pet Sitting Agreement and Waiver for <strong>${petName}</strong>. 
      I have received your submission and a copy of the signed waiver is attached to this email for your records.</p>
      
      <h3>What's Next?</h3>
      <p>I will review your waiver and contact you within 24 hours to:</p>
      <ul>
        <li>Confirm your booking details</li>
        <li>Schedule a meet & greet if needed</li>
        <li>Discuss any specific care requirements for ${petName}</li>
        <li>Answer any questions you may have</li>
      </ul>
      
      <p>I'm excited to provide excellent care for ${petName} and look forward to building a lasting relationship with your family!</p>
      
      <p>Best regards,<br>
      <strong>Johnny</strong></p>
      
      <hr>
      <p><em>This is an automated confirmation email. Please save this email and the attached waiver for your records.</em></p>
    `;

    // Send email to business
    await transporter.sendMail({
      from: `"Pet Sitting Waiver System" <${
        process.env.EMAIL_FROM || "book@qrganiz.com"
      }>`,
      to: EMAIL_CONFIG.businessEmail,
      subject: `${EMAIL_CONFIG.subject} - ${customerName} (${petName})`,
      html: businessEmailContent,
      attachments: [
        {
          filename: `waiver-${customerName.replace(
            /\s+/g,
            "-"
          )}-${petName.replace(/\s+/g, "-")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
      replyTo: customerEmail,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"Johnny - Pet Sitting" <${
        process.env.EMAIL_FROM || "book@qrganiz.com"
      }>`,
      to: customerEmail,
      subject: `Waiver Confirmation - Thank you, ${customerName}!`,
      html: customerEmailContent,
      attachments: [
        {
          filename: `pet-sitting-waiver-${petName.replace(/\s+/g, "-")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    // Clean up temporary file
    fs.unlinkSync(pdfFile.filepath);

    return res.status(200).json({
      success: true,
      message:
        "Waiver submitted successfully. Confirmation emails have been sent.",
    });
  } catch (error) {
    console.error("Error processing waiver submission:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your waiver submission",
    });
  }
}
