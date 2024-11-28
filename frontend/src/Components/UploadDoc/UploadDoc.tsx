import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useAuth } from '../../contexts/AuthContext';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';

const UploadDoc: React.FC = () => {
  const { user } = useAuth();
  const {
    files,
    uploadProgress,
    isUploading,
    error,
    addFiles,
    removeFile,
    uploadFiles,
    clearFiles
  } = useFileUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 2,
    maxSize: 5 * 1024 * 1024, // 5MB
    validator: (file) => {
      // Additional validation for file types using file extension
      const extension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          code: 'file-invalid-type',
          message: `File type .${extension} is not supported`
        };
      }
      
      // Set the correct MIME type based on extension
      if (extension === 'pdf' && !file.type) {
        Object.defineProperty(file, 'type', {
          value: 'application/pdf',
          writable: true
        });
      } else if (extension === 'doc' && !file.type) {
        Object.defineProperty(file, 'type', {
          value: 'application/msword',
          writable: true
        });
      } else if (extension === 'docx' && !file.type) {
        Object.defineProperty(file, 'type', {
          value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          writable: true
        });
      }
      
      return null;
    }
  });

  const handleUpload = async () => {
    if (!user?.email) {
      return;
    }
    await uploadFiles(user.email);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop files here, or click to select files
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, DOC, DOCX up to 5MB each (max 2 files)
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 space-y-4"
          >
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border"
              >
                <div className="flex items-center space-x-3">
                  <FiFile className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {uploadProgress[file.name] !== undefined && (
                    <div className="w-24">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                    disabled={isUploading}
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-3">
              <button
                onClick={clearFiles}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                disabled={isUploading}
              >
                Clear All
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
                className={`px-4 py-2 text-sm text-white rounded-md ${
                  isUploading || files.length === 0
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadDoc;
