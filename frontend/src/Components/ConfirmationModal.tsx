import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={onClose}
          />

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="inline-block transform overflow-hidden rounded-lg bg-black/90 border border-purple-900/30 backdrop-blur-sm px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
          >
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-bold leading-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {title}
                </h3>
                <div className="mt-4">
                  <p className="text-lg text-gray-300">
                    {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:from-purple-700 hover:to-pink-700 sm:w-auto sm:text-sm"
                onClick={onConfirm}
              >
                {confirmText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-purple-900/30 bg-black/40 px-4 py-2.5 text-base font-semibold text-gray-300 shadow-sm hover:bg-black/60 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                {cancelText}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
