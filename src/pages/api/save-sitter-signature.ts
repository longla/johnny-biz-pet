import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({ message: "Signature data is required" });
    }

    // Remove data URL prefix to get base64 data
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    // Log environment information
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Platform:", process.platform);
    console.log("Current working directory:", process.cwd());

    // Create signatures directory in public folder if it doesn't exist
    const signaturesDir = path.join(process.cwd(), "public", "signatures");
    console.log("Signatures directory path:", signaturesDir);

    try {
      // Check if directory exists
      if (!fs.existsSync(signaturesDir)) {
        console.log("Creating signatures directory...");
        fs.mkdirSync(signaturesDir, { recursive: true });
        console.log("Signatures directory created successfully");
      } else {
        console.log("Signatures directory already exists");
      }

      // Check directory permissions
      try {
        fs.accessSync(signaturesDir, fs.constants.W_OK);
        console.log("Directory is writable");
      } catch (permError) {
        console.error("Directory is not writable:", permError);
        throw new Error("Directory is not writable");
      }

      // Save signature as PNG file
      const signaturePath = path.join(signaturesDir, "sitter-signature.png");
      console.log("Saving signature to:", signaturePath);

      fs.writeFileSync(signaturePath, base64Data, "base64");
      console.log("Main signature file saved successfully");

      // Also save a backup with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupPath = path.join(
        signaturesDir,
        `sitter-signature-${timestamp}.png`
      );
      console.log("Saving backup signature to:", backupPath);

      fs.writeFileSync(backupPath, base64Data, "base64");
      console.log("Backup signature file saved successfully");

      // Verify files were actually written
      if (fs.existsSync(signaturePath)) {
        const stats = fs.statSync(signaturePath);
        console.log("Main signature file size:", stats.size, "bytes");
      }

      if (fs.existsSync(backupPath)) {
        const stats = fs.statSync(backupPath);
        console.log("Backup signature file size:", stats.size, "bytes");
      }

      console.log("Sitter signature saved successfully");

      res.status(200).json({
        message: "Signature saved successfully",
        path: "/signatures/sitter-signature.png",
        backup: `/signatures/sitter-signature-${timestamp}.png`,
        environment: process.env.NODE_ENV,
      });
    } catch (fsError) {
      console.error("File system error:", fsError);

      // In serverless environments, file writes might not work
      // For now, we'll still return success but log the issue
      if (process.env.NODE_ENV === "production") {
        console.warn(
          "File system write failed in production. This might be a serverless environment."
        );

        // TODO: Implement cloud storage solution (AWS S3, Cloudinary, etc.)
        return res.status(200).json({
          message:
            "Signature received (Note: File system storage not available in serverless environment)",
          warning: "Consider implementing cloud storage for production use",
          environment: process.env.NODE_ENV,
        });
      } else {
        throw fsError;
      }
    }
  } catch (error) {
    console.error("Error saving sitter signature:", error);

    // Provide more detailed error information
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails = {
      message: "Failed to save signature",
      error: errorMessage,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    console.error("Detailed error:", errorDetails);

    res.status(500).json(errorDetails);
  }
}
