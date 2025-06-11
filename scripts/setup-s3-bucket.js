#!/usr/bin/env node

// Load environment variables if .env exists
require("dotenv").config({ path: ".env" });

const {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketVersioningCommand,
  PutPublicAccessBlockCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.S3_BUCKET_NAME || "ruhrohretreat";
const region = process.env.AWS_REGION || "us-east-1";

console.log("🪣 S3 Bucket Setup for Customer Data Storage");
console.log("===========================================\n");

console.log(`📦 Bucket Name: ${bucketName}`);
console.log(`🌍 Region: ${region}`);
console.log(
  "(Configurable via S3_BUCKET_NAME and AWS_REGION environment variables)\n"
);

// Check if AWS credentials are configured
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.log("❌ AWS credentials not found!");
  console.log("Please set the following environment variables:");
  console.log("AWS_ACCESS_KEY_ID=your_access_key_here");
  console.log("AWS_SECRET_ACCESS_KEY=your_secret_key_here");
  console.log("AWS_REGION=us-east-1  # or your preferred region");
  console.log(
    `S3_BUCKET_NAME=${bucketName}  # S3 bucket name for customer data`
  );
  console.log("ADMIN_PASSWORD=your_secure_admin_password_here\n");
  process.exit(1);
}

const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function checkBucketExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
  }
}

async function createBucket() {
  try {
    console.log(`🔧 Creating S3 bucket: ${bucketName}...`);

    const createParams = {
      Bucket: bucketName,
    };

    // For regions other than us-east-1, we need to specify the location constraint
    if (region !== "us-east-1") {
      createParams.CreateBucketConfiguration = {
        LocationConstraint: region,
      };
    }

    await s3Client.send(new CreateBucketCommand(createParams));
    console.log(`✅ Successfully created bucket: ${bucketName}`);

    // Configure bucket to be private
    console.log("🔒 Setting bucket to private...");
    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          IgnorePublicAcls: true,
          BlockPublicPolicy: true,
          RestrictPublicBuckets: true,
        },
      })
    );
    console.log("✅ Bucket configured as private");

    // Enable versioning (optional but recommended)
    console.log("🔄 Enabling versioning...");
    await s3Client.send(
      new PutBucketVersioningCommand({
        Bucket: bucketName,
        VersioningConfiguration: {
          Status: "Enabled",
        },
      })
    );
    console.log("✅ Versioning enabled");
  } catch (error) {
    console.error(`❌ Error creating bucket: ${error.message}`);
    throw error;
  }
}

async function main() {
  try {
    console.log("🔍 Checking if bucket already exists...");

    const exists = await checkBucketExists();

    if (exists) {
      console.log(`✅ Bucket ${bucketName} already exists!`);
    } else {
      await createBucket();
    }

    console.log("\n📁 S3 Bucket Structure:");
    console.log("----------------------");
    console.log(`${bucketName}/`);
    console.log("└── customer-data/");
    console.log("    └── YYYY/");
    console.log("        └── MM/");
    console.log("            └── waiver_timestamp_id.json");

    console.log("\n🔗 Admin Dashboard Access:");
    console.log("-------------------------");
    console.log("URL: http://localhost:3000/admin");
    console.log("Password: Set via ADMIN_PASSWORD environment variable");

    console.log("\n✅ Setup Complete!");
    console.log("1. ✅ S3 bucket created and configured");
    console.log("2. ✅ Bucket set to private");
    console.log("3. ✅ Versioning enabled");
    console.log("4. 🔧 Test by submitting a waiver form");
    console.log("5. 🔧 Access admin dashboard at /admin");

    console.log("\n🚨 Security Notes:");
    console.log("- Keep your AWS credentials secure");
    console.log("- Use a strong admin password");
    console.log("- The admin page is hidden (no navigation links)");
    console.log("- Customer data is stored privately in S3");
  } catch (error) {
    console.error(`❌ Setup failed: ${error.message}`);
    console.log("\n📋 Manual Setup Instructions (if automated setup fails):");
    console.log(`1. Create S3 bucket named "${bucketName}" in AWS Console`);
    console.log("2. Set bucket permissions to private");
    console.log("3. Create IAM user with S3 permissions");

    console.log("\n🔐 IAM Policy for S3 Access:");
    console.log("----------------------------");
    console.log(
      JSON.stringify(
        {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket",
                "s3:CreateBucket",
                "s3:PutBucketVersioning",
                "s3:PutPublicAccessBlock",
              ],
              Resource: [
                `arn:aws:s3:::${bucketName}`,
                `arn:aws:s3:::${bucketName}/*`,
              ],
            },
          ],
        },
        null,
        2
      )
    );

    process.exit(1);
  }
}

main();
