import type { NextApiRequest, NextApiResponse } from "next";
import { getPdfDocument } from "../../../lib/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Check admin password
  const { password, pdfKey, filename } = req.query;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!pdfKey || typeof pdfKey !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "PDF key is required" });
  }

  try {
    const pdfBuffer = await getPdfDocument(pdfKey);

    if (!pdfBuffer) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    // Set appropriate headers for PDF download
    const downloadFilename = filename || `waiver-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${downloadFilename}"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while downloading the PDF",
    });
  }
}
