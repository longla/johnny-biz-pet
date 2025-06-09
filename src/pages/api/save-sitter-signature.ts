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

    // Create signatures directory in public folder if it doesn't exist
    const signaturesDir = path.join(process.cwd(), "public", "signatures");
    if (!fs.existsSync(signaturesDir)) {
      fs.mkdirSync(signaturesDir, { recursive: true });
    }

    // Save signature as PNG file
    const signaturePath = path.join(signaturesDir, "sitter-signature.png");
    fs.writeFileSync(signaturePath, base64Data, "base64");

    // Also save a backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(
      signaturesDir,
      `sitter-signature-${timestamp}.png`
    );
    fs.writeFileSync(backupPath, base64Data, "base64");

    console.log("Sitter signature saved successfully");

    res.status(200).json({
      message: "Signature saved successfully",
      path: "/signatures/sitter-signature.png",
    });
  } catch (error) {
    console.error("Error saving sitter signature:", error);
    res.status(500).json({ message: "Failed to save signature" });
  }
}
