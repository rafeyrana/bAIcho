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

  const validateFile = (file: File): string | null => {
    console.log("this is the file type", file.type);
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

      const fileList = Array.from(newFiles);
      if (files.length + fileList.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      console.log("this is the file list", fileList);

      // Create new File objects with the same properties
      const validatedFiles: UploadFile[] = fileList.map(file => {
        // Create a new File object with all the original properties
        const newFile = new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });

        // Add our custom properties
        return Object.assign(newFile, {
          id: uuidv4(),
          preview: undefined,
          uploadProgress: undefined,
          error: undefined
        }) as UploadFile;
      });

      console.log("these are the validated files", validatedFiles);

      // Validate each file
      for (const file of validatedFiles) {
        console.log(file);
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
  }, []);

  const uploadFiles = useCallback(async (email: string) => {
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    setIsUploading(true);
    setError(null);

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
  }, []);

  return {
    files,
    uploadProgress,
    isUploading,
    error,
    addFiles,
    removeFile,
    uploadFiles,
    clearFiles
  };
};
