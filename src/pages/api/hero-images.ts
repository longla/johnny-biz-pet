import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const heroDir = path.join(process.cwd(), "public", "hero");
    const files = fs.readdirSync(heroDir);

    // Filter for image files and sort them
    const images = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/\d+/)?.[0] || "0");
        return numA - numB;
      })
      .map((file) => `/hero/${file}`);

    res.status(200).json({ images });
  } catch (error) {
    console.error("Error reading hero images:", error);
    res.status(500).json({ message: "Error reading hero images" });
  }
}
