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
  pdfKey?: string; // S3 key for the PDF file
}

export async function storeCustomerData(
  customerData: Omit<CustomerData, "id" | "submissionDate" | "timestamp">,
  pdfKey?: string,
  customId?: string
): Promise<string> {
  try {
    const id =
      customId ||
      `waiver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    const submissionDate = new Date().toISOString();

    const dataToStore: CustomerData = {
      id,
      ...customerData,
      submissionDate,
      timestamp,
      pdfKey, // Include PDF key if provided
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
    return id; // Return the customer ID
  } catch (error) {
    console.error("Error storing customer data to S3:", error);
    throw error;
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

export async function storePdfDocument(
  customerId: string,
  pdfBuffer: Buffer,
  customerName: string,
  petName: string
): Promise<string> {
  try {
    const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, "-");
    const sanitizedPetName = petName.replace(/[^a-zA-Z0-9]/g, "-");

    const key = `customer-pdfs/${new Date().getFullYear()}/${(
      new Date().getMonth() + 1
    )
      .toString()
      .padStart(
        2,
        "0"
      )}/${customerId}-${sanitizedCustomerName}-${sanitizedPetName}.pdf`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
        Metadata: {
          customerId: customerId,
          customerName: customerName,
          petName: petName,
          uploadDate: new Date().toISOString(),
        },
      })
    );

    console.log(`PDF stored successfully: ${key}`);
    return key;
  } catch (error) {
    console.error("Error storing PDF to S3:", error);
    throw error;
  }
}

export async function getPdfDocument(pdfKey: string): Promise<Buffer | null> {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: pdfKey,
    });

    const getResponse = await s3Client.send(getCommand);

    if (getResponse.Body) {
      // Convert the response body to a buffer
      const bodyBytes = await getResponse.Body.transformToByteArray();
      return Buffer.from(bodyBytes);
    }

    return null;
  } catch (error) {
    console.error(`Error retrieving PDF from S3 (${pdfKey}):`, error);
    return null;
  }
}
