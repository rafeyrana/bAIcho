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
    clearFiles,
    maxFilesError
  } = useFileUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
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
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="mt-2 text-lg text-gray-600">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-sm text-gray-500 mt-2">
            PDF, DOC, DOCX up to 5MB each (max 2 files)
          </p>
        </div>

        {(error || maxFilesError) && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error || maxFilesError}
          </div>
        )}

        {fileRejections.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name} className="mb-2">
                <strong>{file.name}:</strong>
                <ul className="list-disc ml-4">
                  {errors.map(error => (
                    <li key={error.code}>{error.message}</li>
                  ))}
                </ul>
              </div>
            ))}
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
                  key={file.name}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <FiFile className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {uploadProgress[file.id] !== undefined && (
                      <div className="w-24">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={isUploading}
                    >
                      <FiX className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={clearFiles}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isUploading}
                >
                  Clear All
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading || files.length === 0}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isUploading || files.length === 0
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadDoc;
