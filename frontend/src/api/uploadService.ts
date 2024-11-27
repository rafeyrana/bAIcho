import axios, { AxiosError } from 'axios';

export interface UploadResponse {
  success: boolean;
  fileIds: string[];
  error?: string;
}

export interface UploadProgress {
  [filename: string]: number;
}

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fileName?: string
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

const VALID_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 2;

export const validateFile = (file: File): void => {
  if (!VALID_TYPES.includes(file.type)) {
    throw new UploadError(
      `File type not supported: ${file.type}. Please upload PDF or DOC files only.`,
      'INVALID_FILE_TYPE',
      file.name
    );
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError(
      `File size exceeds 5MB limit: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      'FILE_TOO_LARGE',
      file.name
    );
  }
};

export const uploadDocuments = async (
  files: File[],
  email: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  // Validate number of files
  if (files.length > MAX_FILES) {
    throw new UploadError(
      `Maximum ${MAX_FILES} files allowed`,
      'TOO_MANY_FILES'
    );
  }

  // Validate each file
  files.forEach(validateFile);

  const formData = new FormData();
  formData.append('email', email);
  
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await axios.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          const progressObj: UploadProgress = {};
          files.forEach(file => {
            progressObj[file.name] = progress;
          });
          onProgress(progressObj);
        }
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new UploadError(
        axiosError.response?.data?.message || 'Upload failed',
        'UPLOAD_FAILED'
      );
    }
    throw new UploadError('An unexpected error occurred', 'UNKNOWN_ERROR');
  }
};
