import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { documentService } from '../services/documentService';
import { UploadFile, UploadProgress } from '../types/documents';

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

interface UseFileUploadReturn {
  files: UploadFile[];
  uploadProgress: UploadProgress;
  isUploading: boolean;
  error: string | null;
  maxFilesError: string | null;
  addFiles: (newFiles: FileList | File[]) => void;
  removeFile: (fileId: string) => void;
  uploadFiles: (email: string) => Promise<void>;
  clearFiles: () => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const {
    maxFiles = 2,
    maxSizeInMB = 5,
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  } = options;

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxFilesError, setMaxFilesError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeInMB}MB limit`;
    }

    return null;
  };

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      setMaxFilesError(null);

      const fileList = Array.from(newFiles);
      if (files.length + fileList.length > maxFiles) {
        setMaxFilesError(`You can only upload up to ${maxFiles} files at a time. Please remove some files before adding more.`);
        return;
      }

      // Create new File objects with the same properties
      const validatedFiles: UploadFile[] = fileList.map(file => {
        const newFile = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });

        return Object.assign(newFile, {
          id: uuidv4(),
          preview: undefined,
          uploadProgress: undefined,
          error: undefined
        }) as UploadFile;
      });

      // Validate each file
      for (const file of validatedFiles) {
        const error = validateFile(file);
        if (error) {
          setError(error);
          return;
        }
      }

      setFiles(prev => [...prev, ...validatedFiles]);
    },
    [files.length, maxFiles, allowedTypes, maxSizeInMB]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    setMaxFilesError(null);
  }, []);

  const uploadFiles = useCallback(async (email: string) => {
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    setIsUploading(true);
    setError(null);
    setMaxFilesError(null);

    try {
      await documentService.uploadDocuments(files, email, (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          ...progress
        }));
      });

      // Clear files after successful upload
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [files]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setUploadProgress({});
    setError(null);
    setMaxFilesError(null);
  }, []);

  return {
    files,
    uploadProgress,
    isUploading,
    error,
    maxFilesError,
    addFiles,
    removeFile,
    uploadFiles,
    clearFiles
  };
};
