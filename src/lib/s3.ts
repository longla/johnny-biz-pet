import {
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutBucketVersioningCommand,
  PutObjectCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "ruhrohretreat";

export interface CustomerData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  petName: string;
  emergencyContact: string;
  emergencyPhone: string;
  submissionDate: string;
  timestamp: number;
}

export async function storeCustomerData(
  customerData: Omit<CustomerData, "id" | "submissionDate" | "timestamp">
): Promise<void> {
  try {
    const id = `waiver_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const timestamp = Date.now();
    const submissionDate = new Date().toISOString();

    const dataToStore: CustomerData = {
      id,
      ...customerData,
      submissionDate,
      timestamp,
    };

    const key = `customer-data/${new Date().getFullYear()}/${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${id}.json`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(dataToStore, null, 2),
        ContentType: "application/json",
        Metadata: {
          customerName: customerData.customerName,
          petName: customerData.petName,
          submissionDate: submissionDate,
        },
      })
    );

    console.log(`Customer data stored successfully: ${key}`);
  } catch (error) {
    console.error("Error storing customer data to S3:", error);
    // Don't throw the error - we don't want to break the waiver submission
  }
}

export async function getAllCustomerData(): Promise<CustomerData[]> {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "customer-data/",
    });

    const listResponse = await s3Client.send(listCommand);
    const customerDataList: CustomerData[] = [];

    if (listResponse.Contents) {
      for (const object of listResponse.Contents) {
        if (object.Key && object.Key.endsWith(".json")) {
          try {
            const getCommand = new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: object.Key,
            });

            const getResponse = await s3Client.send(getCommand);
            const body = await getResponse.Body?.transformToString();

            if (body) {
              const customerData = JSON.parse(body) as CustomerData;
              customerDataList.push(customerData);
            }
          } catch (error) {
            console.error(
              `Error reading customer data file ${object.Key}:`,
              error
            );
          }
        }
      }
    }

    // Sort by timestamp (most recent first)
    return customerDataList.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching customer data from S3:", error);
    return [];
  }
}

export async function createS3BucketIfNotExists(): Promise<void> {
  try {
    // Check if bucket already exists
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`✅ S3 bucket ${BUCKET_NAME} already exists`);
    return;
  } catch (error: any) {
    if (error.name !== "NotFound") {
      console.error(`Error checking bucket ${BUCKET_NAME}:`, error);
      throw error;
    }
  }

  try {
    console.log(`🔧 Creating S3 bucket: ${BUCKET_NAME}...`);

    const region = process.env.AWS_REGION || "us-east-1";
    const createParams: any = {
      Bucket: BUCKET_NAME,
    };

    // For regions other than us-east-1, we need to specify the location constraint
    if (region !== "us-east-1") {
      createParams.CreateBucketConfiguration = {
        LocationConstraint: region,
      };
    }

    await s3Client.send(new CreateBucketCommand(createParams));
    console.log(`✅ Successfully created bucket: ${BUCKET_NAME}`);

    // Configure bucket to be private
    console.log("🔒 Setting bucket to private...");
    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: BUCKET_NAME,
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
        Bucket: BUCKET_NAME,
        VersioningConfiguration: {
          Status: "Enabled",
        },
      })
    );
    console.log("✅ Versioning enabled");
  } catch (error: any) {
    console.error(`❌ Error creating bucket ${BUCKET_NAME}:`, error);
    throw error;
  }
}
