import { Request, Response } from 'express';
import { s3Service } from '../services/s3Service';
import { documentService } from '../services/documentService';
import { RequestUploadDTO, UploadCompletionDTO } from '../types/documents';

export class DocumentController {
  constructor() {
    // Bind methods to ensure correct 'this' context
    this.requestUpload = this.requestUpload.bind(this);
    this.confirmUpload = this.confirmUpload.bind(this);
    this.getDocuments = this.getDocuments.bind(this);
  }

  async requestUpload(req: any, res: any) {
    try {
      const { files, email } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files specified' });
      }

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const uploads = await Promise.all(
        files.map(async (file:any) => {
          // Generate presigned URL
          const { presignedUrl, s3Key } = await s3Service.generatePresignedUrl(
            email,
            file.filename,
            file.fileType
          );

          // Create pending document record
          const documentId = await documentService.createPendingDocument(
            email,
            file.filename,
            s3Key,
            file.size,
            file.fileType
          );

          return {
            documentId,
            presignedUrl,
            s3Key,
          };
        })
      );

      res.json({ uploads });
    } catch (error) {
      console.error('Error in requestUpload:', error);
      res.status(500).json({ error: 'Failed to process upload request' });
    }
  }

  async confirmUpload(req: any, res: any) {
    try {
      const completion = req.body;

      if (!completion.email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!completion.documents || completion.documents.length === 0) {
        return res.status(400).json({ error: 'No documents specified' });
      }

      // Verify each file exists in S3
      for (const doc of completion.documents) {
        const exists = await s3Service.verifyFileExists(doc.s3Key);
        if (!exists && doc.status === 'success') {
          doc.status = 'failed';
          doc.error = 'File not found in S3';
        }
      }

      // Update document statuses in database
      await documentService.processUploadCompletion(completion);

      res.json({ message: 'Upload completion processed successfully' });
    } catch (error) {
      console.error('Error in confirmUpload:', error);
      res.status(500).json({ error: 'Failed to process upload completion' });
    }
  }

  async getDocuments(req: any, res: any) {
    try {
      const email = req.query.email as string;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const documents = await documentService.getDocumentsByEmail(email);
      res.json({ documents });
    } catch (error) {
      console.error('Error in getDocuments:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  }
}

// Create a single instance of the controller
export const documentController = new DocumentController();
