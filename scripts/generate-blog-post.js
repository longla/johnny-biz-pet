#!/usr/bin/env node

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs/promises";
import inquirer from "inquirer";
import path from "path";
import slugify from "slugify";
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
    const buffer = Buffer.from(base64String, "base64");
    // Write buffer to file
    await fs.writeFile(outputPath, buffer);
    return true;
  } catch (error) {
    console.error("Error saving image:", error.message);
    return false;
  }
}

async function generateBlogIdeas(numPosts, existingTitles = []) {
  try {
    const topics = [
      "pet sitting",
      "pet care",
      "dog walking",
      "cats and small pets",
      "pet health",
      "pet behavior",
      "pet nutrition",
      "traveling with pets",
      "leaving pets at home",
      "pet safety",
      "pet training",
      "seasonal pet care",
      "senior pet care",
      "pet anxiety",
      "pet enrichment",
    ];

    // Randomly select topics to focus on
    const shuffledTopics = [...topics].sort(() => 0.5 - Math.random());
    const selectedTopics = shuffledTopics.slice(
      0,
      Math.min(5, shuffledTopics.length)
    );

    const prompt = `
      Generate a list of ${numPosts} unique blog post ideas related to the following topics: ${selectedTopics.join(
      ", "
    )}.
      
      These blog posts will be for a pet boarding business called "Ruh-Roh Retreat" that provides luxury overnight 
      boarding, spa services, and premium pet care.
      
      Important notes:
      - Make the content broadly useful for pet owners
      - Focus on helpful content that solves real problems for pet owners
      - Each post should be unique and different from these existing titles: ${existingTitles.join(
        ", "
      )}
      
      For each blog post, provide:
      - A catchy title 
      - A brief description (2-3 sentences)
      
      Return the response as a JSON array with objects containing 'title' and 'description' fields.
      Do not include any other text or formatting, markdown code blocks, or backticks.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Clean the response text by removing markdown code block
    const cleanResponse = response
      .text()
      .replace(/^```json\n?|\n?```$/g, "")
      .trim();
    console.log("Generated blog ideas:", cleanResponse);

    try {
      const blogIdeas = JSON.parse(cleanResponse);

      // Add additional metadata to each blog idea
      const blogPosts = blogIdeas.map((post) => ({
        ...post,
        status: "pending",
        date: null,
        slug: slugify(post.title, { lower: true, strict: true }),
        hasImage: false,
      }));

      return blogPosts;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError.message);
      console.error("Raw response:", cleanResponse);
      throw new Error("Failed to parse blog ideas response");
    }
  } catch (error) {
    console.error("Error generating blog ideas:", error.message);
    throw error;
  }
}

async function loadOrGenerateBlogList() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(BLOG_LIST_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    // Try to load existing blog list
    try {
      const data = await fs.readFile(BLOG_LIST_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is invalid, ask user for number of posts and generate new ideas
      const { numPosts } = await inquirer.prompt([
        {
          type: "number",
          name: "numPosts",
          message: "How many blog post ideas would you like to generate?",
          default: 10,
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1) {
              return "Please enter a valid number greater than 0";
            }
            return true;
          },
        },
      ]);
      console.log(`Generating ${numPosts} blog post ideas...`);
      const blogPosts = await generateBlogIdeas(numPosts);
      await fs.writeFile(BLOG_LIST_FILE, JSON.stringify(blogPosts, null, 2));
      return blogPosts;
    }
  } catch (error) {
    console.error("Error loading/generating blog list:", error.message);
    throw error;
  }
}

// Check if a post with a particular slug already exists as an MD file
async function checkExistingFiles(slug) {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    await fs.access(filePath);
    return true; // File exists
  } catch (error) {
    return false; // File doesn't exist
  }
}

async function generateBlogPost(blogMeta) {
  try {
    // Check if the title mentions Ruh-Roh Retreat directly
    const mentionsProduct = blogMeta.title
      .toLowerCase()
      .includes("ruhrohretreat");

    // Determine the content format based on the title
    let contentFormat = "general";
    if (
      blogMeta.title.toLowerCase().includes("guide") ||
      blogMeta.title.toLowerCase().includes("tips") ||
      blogMeta.title.toLowerCase().includes("how to")
    ) {
      contentFormat = "tips";
    } else if (
      blogMeta.title.toLowerCase().includes("vs") ||
      blogMeta.title.toLowerCase().includes("comparison")
    ) {
      contentFormat = "comparison";
    }

    // Base prompt
    let promptBase = `
      Create a blog post ${
        mentionsProduct
          ? "for ruhrohretreat.com"
          : "about pet care and luxury pet boarding"
      }.
      ${
        !mentionsProduct
          ? "The blog is from ruhrohretreat.com, a premium pet boarding service providing luxury accommodations and specialized care."
          : ""
      }
      
      Important: 
      - Return ONLY the blog post content in Markdown format
      - Do NOT include any frontmatter, metadata, or YAML headers
      - Do NOT include the title or any heading that repeats the title
      - Start directly with the first paragraph or subheading
      
      Use this metadata for context only: 
      - Title: "${blogMeta.title}"
      - Description: "${blogMeta.description}"
      - Date: "${blogMeta.date}"
      
      Write in a practical, approachable tone
    `;

    // Add specific content guidance based on format
    if (contentFormat === "tips") {
      promptBase += `, and include 8-10 actionable tips related to the topic.`;
      if (mentionsProduct) {
        promptBase += ` Integrate Ruh-Roh Retreat services naturally where relevant, but ensure the tips are useful for all pet owners.`;
      } else {
        promptBase += ` You may mention professional pet boarding services 2-3 times as potential solutions, but most tips should be useful for all pet owners.`;
      }
    } else if (contentFormat === "comparison") {
      promptBase += ` and objectively compare different approaches or solutions, discussing pros and cons of each.`;
      if (mentionsProduct) {
        promptBase += ` Include Ruh-Roh Retreat as one of the solutions, highlighting the benefits of professional pet boarding without being overly promotional.`;
      } else {
        promptBase += ` You may briefly mention professional pet boarding services as one potential solution near the end of the article.`;
      }
    } else {
      promptBase += `. Focus on providing value and solving pet care problems.`;
      if (mentionsProduct) {
        promptBase += ` Naturally incorporate Ruh-Roh Retreat services where relevant.`;
      } else {
        promptBase += ` Only mention professional pet boarding services briefly (1-2 times) if it naturally fits the content.`;
      }
    }

    // Add closing guidance
    promptBase += `
      The content should be:
      - Educational and informative first, promotional second (if at all)
      - Around 800-1200 words
      - Include relevant subheadings for easy scanning
      - Written in a conversational, friendly tone
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(promptBase);
    const response = await result.response;
    const content = response.text();

    // Remove markdown code block wrapper if present
    const cleanContent = content.replace(/^```markdown\n?|\n?```$/g, "").trim();

    return cleanContent;
  } catch (error) {
    console.error("Error generating blog content:", error.message);
    throw error;
  }
}

async function generateBlogImage(blogMeta) {
  try {
    // Determine the key theme based on the title and description
    const title = blogMeta.title.toLowerCase();
    const description = blogMeta.description.toLowerCase();

    // Analyze the content to determine what kind of image would be good
    let imageTheme = "";

    if (title.includes("dog") || description.includes("dog")) {
      imageTheme =
        "happy dog being walked by a professional pet sitter in a park";
    } else if (title.includes("cat") || description.includes("cat")) {
      imageTheme =
        "contented cat being cared for in home environment by professional pet sitter";
    } else if (title.includes("travel") || description.includes("travel")) {
      imageTheme =
        "pet owner preparing to travel with pet care instructions for a pet sitter";
    } else if (title.includes("anxiety") || description.includes("anxiety")) {
      imageTheme = "calm pet with pet sitter in familiar home environment";
    } else if (title.includes("safety") || description.includes("safety")) {
      imageTheme = "professional pet sitter ensuring home is safe for pets";
    } else if (title.includes("health") || description.includes("health")) {
      imageTheme = "healthy happy pet with pet sitter in home environment";
    } else if (title.includes("senior") || description.includes("senior")) {
      imageTheme =
        "senior pet receiving special care from a professional pet sitter";
    } else if (
      title.includes("nutrition") ||
      description.includes("nutrition")
    ) {
      imageTheme = "pet sitter preparing healthy food for a pet at home";
    } else {
      // Default theme if no specific matches
      imageTheme =
        "professional pet sitter with happy pets in home environment";
    }

    const promptText = `
      Create an eye-catching, professional image that would work well as a cover image for a blog post titled "${blogMeta.title}".
      
      The image should:
      - Show ${imageTheme}
      - Be visually appealing with good lighting and composition
      - Use an attractive color scheme that's professional and modern
      - not include blog title, not contain any text overlays or words
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

async function updateBlogStatus(selectedPost, hasGeneratedImage = false) {
  try {
    const blogPosts = await loadOrGenerateBlogList();
    const updatedPosts = blogPosts.map((post) => {
      if (post.slug === selectedPost.slug) {
        return {
          ...post,
          status: "completed",
          date: selectedPost.date,
          hasImage: post.hasImage || hasGeneratedImage, // Update image status if image was generated
        };
      }
      return post;
    });

    await fs.writeFile(BLOG_LIST_FILE, JSON.stringify(updatedPosts, null, 2));
  } catch (error) {
    console.error("Error updating blog status:", error.message);
  }
}

async function createBlogPost() {
  try {
    // Ensure directories exist
    await fs.mkdir(POSTS_DIR, { recursive: true });
    await fs.mkdir(PUBLIC_POSTS_DIR, { recursive: true });

    // Load or generate blog list
    const blogPosts = await loadOrGenerateBlogList();

    // Get existing blog post files to filter out posts that already exist
    const existingFiles = [];
    for (const post of blogPosts) {
      if (await checkExistingFiles(post.slug)) {
        existingFiles.push(post.slug);
        // If file exists but status is pending, update to completed
        if (post.status === "pending") {
          post.status = "completed";
          post.date = post.date || new Date().toISOString().split("T")[0];
          await updateBlogStatus(post);
        }
      }
    }

    if (existingFiles.length > 0) {
      console.log(
        `Found ${existingFiles.length} blog posts already created as files but marked as pending in JSON. Updated their status.`
      );
    }

    // Filter for posts that are pending and don't have files already
    const pendingPosts = blogPosts.filter(
      (post) => post.status === "pending" && !existingFiles.includes(post.slug)
    );

    if (pendingPosts.length === 0) {
      const { numPosts } = await inquirer.prompt([
        {
          type: "number",
          name: "numPosts",
          message:
            "All posts completed. How many new blog post ideas would you like to generate?",
          default: 10,
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1) {
              return "Please enter a valid number greater than 0";
            }
            return true;
          },
        },
      ]);

      // Get all existing titles to avoid duplicates
      const existingTitles = blogPosts.map((post) => post.title);
      console.log(`Generating ${numPosts} new blog post ideas...`);
      const newPosts = await generateBlogIdeas(numPosts, existingTitles);

      // Merge new posts with existing ones
      const mergedPosts = [...blogPosts, ...newPosts];
      await fs.writeFile(BLOG_LIST_FILE, JSON.stringify(mergedPosts, null, 2));
      return createBlogPost();
    }

    // Ask if user wants to generate all pending posts or select one
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: `Found ${pendingPosts.length} pending blog posts. What would you like to do?`,
        choices: [
          { name: "Generate all pending blog posts", value: "all" },
          { name: "Select a single blog post to generate", value: "single" },
          { name: "Generate new blog post ideas", value: "new" },
        ],
      },
    ]);

    if (action === "new") {
      const { numPosts } = await inquirer.prompt([
        {
          type: "number",
          name: "numPosts",
          message: "How many new blog post ideas would you like to generate?",
          default: 5,
          validate: (input) => {
            const num = parseInt(input);
            if (isNaN(num) || num < 1) {
              return "Please enter a valid number greater than 0";
            }
            return true;
          },
        },
      ]);

      // Get all existing titles to avoid duplicates
      const existingTitles = blogPosts.map((post) => post.title);
      console.log(`Generating ${numPosts} new blog post ideas...`);
      const newPosts = await generateBlogIdeas(numPosts, existingTitles);

      // Merge new posts with existing ones
      const mergedPosts = [...blogPosts, ...newPosts];
      await fs.writeFile(BLOG_LIST_FILE, JSON.stringify(mergedPosts, null, 2));
      return createBlogPost();
    }

    if (action === "all") {
      console.log(`\nGenerating ${pendingPosts.length} blog posts...\n`);

      for (const post of pendingPosts) {
        // Skip if file already exists
        if (await checkExistingFiles(post.slug)) {
          console.log(`Skipping existing post: ${post.title}`);
          // Update its status in the JSON
          post.status = "completed";
          post.date = post.date || new Date().toISOString().split("T")[0];

          // Check if cover image exists
          const coverImagePath = path.join(
            path.join(PUBLIC_POSTS_DIR, post.slug),
            "cover.jpg"
          );
          let hasImage = false;
          try {
            await fs.access(coverImagePath);
            hasImage = true;
          } catch (error) {
            // Image doesn't exist
          }

          await updateBlogStatus(post, hasImage);
          continue;
        }

        // Add current date
        post.date = new Date().toISOString().split("T")[0];

        // Generate slug from title
        const slug = post.slug;
        const fileName = `${slug}.md`;
        const filePath = path.join(POSTS_DIR, fileName);

        // Create post directory under public/posts
        const postDir = path.join(PUBLIC_POSTS_DIR, slug);
        await fs.mkdir(postDir, { recursive: true });

        // Generate blog content
        console.log(`\nGenerating content for: ${post.title}`);
        const content = await generateBlogPost(post);

        // Check if cover image exists
        const coverImagePath = path.join(postDir, "cover.jpg");
        let hasCoverImage = false;
        try {
          await fs.access(coverImagePath);
          hasCoverImage = true;
        } catch (error) {
          // Image doesn't exist, generate one
          console.log(`Generating cover image for: ${post.title}`);
          const imageData = await generateBlogImage(post);
          if (imageData) {
            await saveBase64Image(imageData, coverImagePath);
            hasCoverImage = true;
            console.log(`Cover image created successfully.`);
          } else {
            console.log(`Failed to generate cover image.`);
          }
        }

        // Add frontmatter to content
        const frontmatter = `---
title: "${post.title}"
description: "${post.description}"
date: "${post.date}"${
          hasCoverImage ? `\ncoverImage: "/posts/${slug}/cover.jpg"` : ""
        }
---

`;

        // Write the blog post file with frontmatter and content
        await fs.writeFile(filePath, frontmatter + content, "utf8");

        // Update blog status, including image status
        await updateBlogStatus(post, hasCoverImage);

        console.log(`Blog post created: ${filePath}`);
        if (!hasCoverImage) {
          console.log(
            `To add a cover image, place it at: ${path.join(
              postDir,
              "cover.jpg"
            )}`
          );
        }
      }

      console.log("\nAll blog posts have been generated successfully!");
      return;
    }

    // Let user select a blog post to create
    const { selectedPost } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedPost",
        message: "Select a blog post to create:",
        choices: pendingPosts.map((post) => ({
          name: post.title,
          value: post,
        })),
      },
    ]);

    // Check if file already exists
    if (await checkExistingFiles(selectedPost.slug)) {
      console.log(
        `File for '${selectedPost.title}' already exists. Skipping generation.`
      );
      // Update its status in the JSON
      selectedPost.status = "completed";
      selectedPost.date =
        selectedPost.date || new Date().toISOString().split("T")[0];

      // Check if cover image exists
      const coverImagePath = path.join(
        path.join(PUBLIC_POSTS_DIR, selectedPost.slug),
        "cover.jpg"
      );
      let hasImage = false;
      try {
        await fs.access(coverImagePath);
        hasImage = true;
      } catch (error) {
        // Image doesn't exist
      }

      await updateBlogStatus(selectedPost, hasImage);
      return;
    }

    // Add current date
    selectedPost.date = new Date().toISOString().split("T")[0];

    // Generate slug from title
    const slug = selectedPost.slug;
    const fileName = `${slug}.md`;
    const filePath = path.join(POSTS_DIR, fileName);

    // Create post directory under public/posts
    const postDir = path.join(PUBLIC_POSTS_DIR, slug);
    await fs.mkdir(postDir, { recursive: true });

    // Generate blog content
    console.log("Generating blog content using Google Gemini...");
    const content = await generateBlogPost(selectedPost);

    // Check if cover image exists
    const coverImagePath = path.join(postDir, "cover.jpg");
    let hasCoverImage = false;
    try {
      await fs.access(coverImagePath);
      hasCoverImage = true;
    } catch (error) {
      // Image doesn't exist, generate one
      console.log(`Generating cover image for: ${selectedPost.title}`);
      const imageData = await generateBlogImage(selectedPost);
      if (imageData) {
        await saveBase64Image(imageData, coverImagePath);
        hasCoverImage = true;
        console.log(`Cover image created successfully.`);
      } else {
        console.log(`Failed to generate cover image.`);
      }
    }

    // Add frontmatter to content
    const frontmatter = `---
title: "${selectedPost.title}"
description: "${selectedPost.description}"
date: "${selectedPost.date}"${
      hasCoverImage ? `\ncoverImage: "/posts/${slug}/cover.jpg"` : ""
    }
---

`;

    // Write the blog post file with frontmatter and content
    await fs.writeFile(filePath, frontmatter + content, "utf8");

    // Update blog status, including image status
    await updateBlogStatus(selectedPost, hasCoverImage);

    console.log(`\nBlog post created successfully!`);
    console.log(`File: ${filePath}`);
    if (!hasCoverImage) {
      console.log(
        `\nTo add a cover image, place it at: ${path.join(
          postDir,
          "cover.jpg"
        )}`
      );
    }
  } catch (error) {
    console.error("Error creating blog post:", error.message);
    process.exit(1);
  }
}

// Run the script
createBlogPost();
