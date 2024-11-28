export interface UploadFile extends File {
  id: string;
  preview?: string;
  uploadProgress?: number;
  error?: string;
}

export interface PresignedUrlResponse {
  documentId: string;
  presignedUrl: string;
  s3Key: string;
}

export interface DocumentUploadResponse {
  uploads: PresignedUrlResponse[];
}

export interface UploadProgress {
  [filename: string]: number;
}

export interface DocumentMetadata {
  size: number;
  type: string;
  lastModified: string;
}

export interface UploadCompletion {
  documents: {
    documentId: string;
    s3Key: string;
    status: 'success' | 'failed';
    error?: string;
    metadata: DocumentMetadata;
  }[];
  email: string;
}

export interface Document {
  id: string;
  user_email: string;
  filename: string;
  s3_key: string;
  file_size: number;
  file_type: string;
  upload_status: 'pending' | 'completed' | 'failed';
  error?: string;
  created_at: Date;
}
