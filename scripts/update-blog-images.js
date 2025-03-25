#!/usr/bin/env node

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, "../posts");
const PUBLIC_POSTS_DIR = path.join(__dirname, "../public/posts");
const BLOG_LIST_FILE = path.join(__dirname, "../data/blog-posts.json");

// Google Gemini API configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper function to save base64 image to file
async function saveBase64Image(base64String, outputPath) {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64String, 'base64');
    // Write buffer to file
    await fs.writeFile(outputPath, buffer);
    return true;
  } catch (error) {
    console.error("Error saving image:", error.message);
    return false;
  }
}

async function generateBlogImage(blogMeta) {
  try {
    // Determine the key theme based on the title and description
    const title = blogMeta.title.toLowerCase();
    const description = blogMeta.description.toLowerCase();
    
    // Analyze the content to determine what kind of image would be good
    let imageTheme = "";
    
    if (title.includes("organization") || description.includes("organization")) {
      imageTheme = "organized space with clean shelves and labeled boxes";
    } else if (title.includes("productivity") || description.includes("productivity")) {
      imageTheme = "person efficiently managing tasks, clean workspace with digital tools";
    } else if (title.includes("declutter") || description.includes("declutter")) {
      imageTheme = "before and after of organized space, minimal clean home";
    } else if (title.includes("storage") || description.includes("storage")) {
      imageTheme = "well-organized storage space with labeled containers";
    } else if (title.includes("inventory") || description.includes("inventory")) {
      imageTheme = "organized shelves with items neatly arranged and categorized";
    } else if (title.includes("moving") || description.includes("moving")) {
      imageTheme = "organized moving boxes with clear labeling system";
    } else if (title.includes("garage") || description.includes("garage")) {
      imageTheme = "well-organized garage with tool storage and clear spaces";
    } else if (title.includes("basement") || description.includes("basement")) {
      imageTheme = "clean organized basement with proper storage solutions";
    } else if (title.includes("digital") || description.includes("digital")) {
      imageTheme = "organized digital workspace with folders and clean desktop";
    } else if (title.includes("document") || description.includes("document")) {
      imageTheme = "neatly organized document filing system with labels";
    } else if (title.includes("packing") || description.includes("packing")) {
      imageTheme = "efficiently packed suitcase with neatly organized items";
    } else {
      // Default theme if no specific matches
      imageTheme = "organized home or workspace with clean aesthetic";
    }
    
    const promptText = `
      Create an eye-catching, professional image that would work well as a cover image for a blog post titled "${blogMeta.title}".
      
      The image should:
      - Show ${imageTheme}
      - Be visually appealing with good lighting and composition
      - Use an attractive color scheme that's professional and modern
      - NOT contain any text overlays or words
      - Have a clean, uncluttered composition that would look good when shared on social media
      - Be appropriate as a thumbnail/cover image that makes people want to read the article
      - Have a professional photography style (not cartoon or illustrated)
      
      Make the image high-quality, vibrant, and aspirational.
    `;

    // Create a prompt object as expected by the API
    const contents = [{ text: promptText }];

    // Use the correct model for image generation
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });
    
    console.log("Generating image with Gemini...");
    const response = await model.generateContent(contents);
    
    // Process each part of the response
    for (const part of response.response.candidates[0].content.parts) {
      // Look for inline data (the image)
      if (part.inlineData) {
        console.log("Image generated successfully!");
        return part.inlineData.data; // Return the base64 image data
      } else if (part.text) {
        console.log("Text response from image generation:", part.text);
      }
    }
    
    console.log("No image data found in the response");
    return null;
  } catch (error) {
    console.error("Error generating blog image:", error.message);
    
    // More detailed error information if available
    if (error.response) {
      console.error("Error details:", JSON.stringify(error.response, null, 2));
    }
    
    return null;
  }
}

async function checkImageExists(slug) {
  const coverImagePath = path.join(path.join(PUBLIC_POSTS_DIR, slug), "cover.jpg");
  try {
    await fs.access(coverImagePath);
    return true; // Image exists
  } catch (error) {
    return false; // Image doesn't exist
  }
}

async function updateBlogPostImages() {
  try {
    // Load blog posts data
    const data = await fs.readFile(BLOG_LIST_FILE, "utf8");
    const blogPosts = JSON.parse(data);
    
    let updatedPosts = false;
    
    // Process each blog post
    for (const post of blogPosts) {
      // Check if post has hasImage property
      if (!('hasImage' in post)) {
        // Check if image exists for this post
        const hasImage = await checkImageExists(post.slug);
        post.hasImage = hasImage;
        updatedPosts = true;
        console.log(`Updated post "${post.title}": hasImage = ${hasImage}`);
        
        // If no image exists, generate one
        if (!hasImage) {
          console.log(`Generating image for: ${post.title}`);
          
          // Create post directory if it doesn't exist
          const postDir = path.join(PUBLIC_POSTS_DIR, post.slug);
          await fs.mkdir(postDir, { recursive: true });
          
          const coverImagePath = path.join(postDir, "cover.jpg");
          const imageData = await generateBlogImage(post);
          
          if (imageData) {
            await saveBase64Image(imageData, coverImagePath);
            post.hasImage = true;
            console.log(`Image created successfully for: ${post.title}`);
          } else {
            console.log(`Failed to generate image for: ${post.title}`);
          }
        }
      }
    }
    
    // Save updated blog posts data
    if (updatedPosts) {
      await fs.writeFile(BLOG_LIST_FILE, JSON.stringify(blogPosts, null, 2));
      console.log("Blog posts data updated with image status.");
    } else {
      console.log("All blog posts already have image status information.");
    }
    
  } catch (error) {
    console.error("Error updating blog post images:", error.message);
  }
}

// Run the update script
updateBlogPostImages();