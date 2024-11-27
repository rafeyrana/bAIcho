import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { uploadDocuments, UploadError, UploadProgress } from '../../api/uploadService';
import { useAuth } from '../../contexts/AuthContext';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  uploadProgress?: number;
  error?: string;
}

const UploadDoc: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateFileProgress = useCallback((fileName: string, progress: number) => {
    setFiles(prev => prev.map(file => 
      file.name === fileName ? { ...file, uploadProgress: progress } : file
    ));
  }, []);

  const handleUploadProgress = useCallback((progress: UploadProgress) => {
    Object.entries(progress).forEach(([fileName, value]) => {
      updateFileProgress(fileName, value);
    });
  }, [updateFileProgress]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user?.email) {
      setUploadError('Please login to upload documents');
      return;
    }

    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substring(7),
      preview: URL.createObjectURL(file),
      uploadProgress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
    setUploadError(null);

    try {
      setIsUploading(true);
      await uploadDocuments(acceptedFiles, user.email, handleUploadProgress);
      
      // Mark files as completed
      setFiles(prev => prev.map(file => ({
        ...file,
        uploadProgress: 100
      })));
    } catch (error) {
      if (error instanceof UploadError) {
        setUploadError(error.message);
        
        // Mark affected file as failed if specified
        if (error.fileName) {
          setFiles(prev => prev.map(file => 
            file.name === error.fileName 
              ? { ...file, error: error.message, uploadProgress: 0 } 
              : file
          ));
        }
      } else {
        setUploadError('An unexpected error occurred during upload');
      }
    } finally {
      setIsUploading(false);
    }
  }, [user?.email, handleUploadProgress]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== fileId);
      if (updatedFiles.length === 0) {
        setUploadError(null);
      }
      return updatedFiles;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 2,
    disabled: isUploading
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          Ready to brainrot?
        </h1>
        <p className="text-xl text-gray-300">
          Just upload your study document and let's get started
        </p>
      </motion.div>

      <motion.div
        className={`w-full max-w-2xl p-8 rounded-xl border-2 border-dashed transition-colors duration-300 ${
          isDragActive ? 'border-purple-400 bg-purple-900/20' : 'border-purple-900/30 bg-black/40'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={getRootProps().onClick}
        onKeyDown={getRootProps().onKeyDown}
        onFocus={getRootProps().onFocus}
        onBlur={getRootProps().onBlur}
        onDragEnter={getRootProps().onDragEnter}
        onDragLeave={getRootProps().onDragLeave}
        onDragOver={getRootProps().onDragOver}
        onDrop={getRootProps().onDrop}
        whileHover={{ scale: isUploading ? 1 : 1.02 }}
        whileTap={{ scale: isUploading ? 1 : 0.98 }}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">
            {isDragActive
              ? 'Drop your documents here...'
              : 'Drag & drop your documents here, or click to select'}
          </p>
          <p className="text-gray-400 mt-2">
            Supported formats: PDF, DOC, DOCX (Max 2 files, 5MB each)
          </p>
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl mt-4 p-4 bg-black/40 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <FileText className="text-purple-400" />
              <div>
                <p className="text-gray-200">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {file.uploadProgress !== undefined && file.uploadProgress < 100 && !file.error && (
                <div className="w-24 bg-purple-900/30 rounded-full h-2">
                  <div
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.uploadProgress}%` }}
                  />
                </div>
              )}
              
              {file.error ? (
                <AlertCircle className="text-red-400" />
              ) : file.uploadProgress === 100 ? (
                <CheckCircle className="text-green-400" />
              ) : null}
              
              <button
                onClick={() => removeFile(file.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="text-red-400" />
            <p className="text-red-400">{uploadError}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadDoc;
