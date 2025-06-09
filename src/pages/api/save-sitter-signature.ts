import { NextApiRequest, NextApiResponse } from "next";

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

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `sitter-signature-${timestamp}.png`;

    // Set headers for file download
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);

    console.log(
      `Sending signature download: ${filename} (${buffer.length} bytes)`
    );

    // Send the image buffer as response
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error processing signature download:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Failed to process signature",
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
