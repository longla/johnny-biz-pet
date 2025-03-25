// Import required dependencies using ES modules
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { writeFileSync } from "fs";

// Load environment variables
dotenv.config();

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateImage() {
  // Define the prompt for image generation
  const contents = [
    {
      text: "Hi, can you create a image of a flower",
    },
  ];

  // Set responseModalities to include "Image" so the model can generate an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    },
  });

  try {
    // Generate content with the prompt
    const response = await model.generateContent(contents);

    // Process each part of the response
    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);

    // More detailed error information if available
    if (error.response) {
      console.error("Error details:", JSON.stringify(error.response, null, 2));
    }
  }
}

// Execute the image generation
generateImage();
