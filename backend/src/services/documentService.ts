import { createClient } from '@supabase/supabase-js';
import { Document, UploadCompletionDTO } from '../types/documents';
import { v4 as uuidv4 } from 'uuid';

class DocumentService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  async createPendingDocument(
    email: string,
    filename: string,
    s3Key: string,
    fileSize: number,
    fileType: string
  ): Promise<string> {
    try {
      const documentId = uuidv4();
      const { error } = await this.supabase.from('documents').insert({
        id: documentId,
        user_email: email,
        filename,
        s3_key: s3Key,
        file_size: fileSize,
        file_type: fileType,
        upload_status: 'pending',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      return documentId;
    } catch (error) {
      console.error('Error creating pending document:', error);
      throw new Error('Failed to create document record');
    }
  }

  async updateDocumentStatus(
    documentId: string,
    status: 'completed' | 'failed',
    error?: string
  ): Promise<void> {
    try {
      const { error: updateError } = await this.supabase
        .from('documents')
        .update({
          upload_status: status,
          error: error,
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating document status:', error);
      throw new Error('Failed to update document status');
    }
  }

  async getDocumentsByEmail(email: string): Promise<Document[]> {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  }

  async processUploadCompletion(completion: UploadCompletionDTO): Promise<void> {
    for (const doc of completion.documents) {
      try {
        await this.updateDocumentStatus(
          doc.documentId,
          doc.status === 'success' ? 'completed' : doc.status,
          doc.error
        );
      } catch (error) {
        console.error(`Error processing document ${doc.documentId}:`, error);
        // Continue processing other documents even if one fails
      }
    }
  }
}

export const documentService = new DocumentService();
