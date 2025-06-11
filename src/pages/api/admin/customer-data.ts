import type { NextApiRequest, NextApiResponse } from "next";
import { CustomerData, getAllCustomerData } from "../../../lib/s3";

type ResponseData = {
  success: boolean;
  data?: CustomerData[];
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Check admin password
  const adminPassword = req.headers.authorization?.replace("Bearer ", "");
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return res
      .status(500)
      .json({ success: false, message: "Admin password not configured" });
  }

  if (!adminPassword || adminPassword !== expectedPassword) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const customerData = await getAllCustomerData();

    return res.status(200).json({
      success: true,
      data: customerData,
    });
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching customer data",
    });
  }
}
