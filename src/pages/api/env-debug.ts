import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  environment: Record<string, string>;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Security check: Prevent access in production without a secret key
  if (
    process.env.NODE_ENV === "production" &&
    req.query.key !== process.env.DEBUG_KEY
  ) {
    return res.status(401).json({
      environment: {},
      message: "Unauthorized access to environment variables in production",
    });
  }

  // Create a safe copy of environment variables (mask sensitive values)
  const safeEnv: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      // Mask sensitive values
      if (
        key.includes("KEY") ||
        key.includes("SECRET") ||
        key.includes("PASSWORD") ||
        key.includes("PASS") ||
        key.includes("TOKEN")
      ) {
        safeEnv[key] =
          value.substring(0, 3) + "..." + value.substring(value.length - 3);
      } else {
        safeEnv[key] = value;
      }
    } else {
      safeEnv[key] = "undefined";
    }
  }

  // Log the environment variables to the server console
  console.log("Environment Variables:", safeEnv);

  // Return the safe environment variables
  return res.status(200).json({
    environment: safeEnv,
    message: "Environment variables logged and returned safely",
  });
}
