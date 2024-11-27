import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, AlertCircle, CheckCircle, Upload } from 'lucide-react';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  uploadProgress?: number;
  error?: string;
}

const UploadDoc: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > 5) {
      setUploadError('Maximum 5 files allowed');
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
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 5
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(file => file.id !== id);
      if (updatedFiles.length === 0) {
        setUploadError(null);
      }
      return updatedFiles;
    });
  };

  const simulateUpload = (id: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === id) {
        return { ...file, uploadProgress: 0, error: undefined };
      }
      return file;
    }));

    const interval = setInterval(() => {
      setFiles(prev => {
        const updatedFiles = prev.map(file => {
          if (file.id === id) {
            const progress = (file.uploadProgress || 0) + 10;
            if (progress >= 100) {
              clearInterval(interval);
            }
            return { ...file, uploadProgress: progress };
          }
          return file;
        });
        return updatedFiles;
      });
    }, 500);
  };

  const retryUpload = (id: string) => {
    simulateUpload(id);
  };

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
        }`}
        onClick={getRootProps().onClick}
        onKeyDown={getRootProps().onKeyDown}
        onFocus={getRootProps().onFocus}
        onBlur={getRootProps().onBlur}
        onDragEnter={getRootProps().onDragEnter}
        onDragLeave={getRootProps().onDragLeave}
        onDragOver={getRootProps().onDragOver}
        onDrop={getRootProps().onDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
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
            Supported formats: PDF, DOC, DOCX (Max 5 files)
          </p>
        </div>
      </motion.div>

      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 flex items-center"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {uploadError}
        </motion.div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-2xl mt-8 space-y-4"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-black/40 border border-purple-900/30 rounded-lg p-4 flex items-center"
              >
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {file.uploadProgress !== undefined && (
                    <div className="mt-2">
                      <div className="h-2 bg-purple-900/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-purple-400"
                          initial={{ width: '0%' }}
                          animate={{ width: `${file.uploadProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {file.uploadProgress}% uploaded
                        </span>
                        {file.uploadProgress === 100 && (
                          <span className="text-green-400 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </span>
                        )}
                        {file.error && (
                          <button
                            onClick={() => retryUpload(file.id)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadDoc;
