import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const galleryPath = path.join(process.cwd(), "public", "images", "gallery");
    const files = fs.readdirSync(galleryPath);

    const photos = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map((file, index) => ({
        id: String(index + 1),
        src: `/images/gallery/${file}`,
        alt: file.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
        width: 1200,
        height: 800,
      }));

    return res.status(200).json(photos);
  } catch (error) {
    console.error("Error reading gallery directory:", error);
    return res.status(500).json({ message: "Error fetching gallery photos" });
  }
}
