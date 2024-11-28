import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Missing required AWS configuration');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  async generatePresignedUrl(
    email: string,
    filename: string,
    fileType: string
  ): Promise<{ presignedUrl: string; s3Key: string }> {
    try {
      if (!email || !filename || !fileType) {
        throw new Error('Missing required parameters for presigned URL generation');
      }

      // Generate a unique key for the file
      const timestamp = new Date().getTime();
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9@._-]/g, '_');
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const s3Key = `${sanitizedEmail}/${timestamp}_${sanitizedFilename}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        ContentType: fileType,
        ACL: 'private',
        Metadata: {
          'x-amz-acl': 'private'
        }
      });

      // Generate presigned URL with longer expiration
      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });

      return {
        presignedUrl,
        s3Key,
      };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  async verifyFileUpload(s3Key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error verifying file upload:', error);
      return false;
    }
  }
}

export const s3Service = new S3Service();
