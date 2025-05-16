import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
  closeOnClickOutside = true,
  size = 'md',
  hideCloseButton = false,
}) => {
  // Size mapping
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const modalSize = sizes[size] || maxWidth;

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-secondary-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={closeOnClickOutside ? onClose : undefined}
          aria-hidden="true"
        ></div>

        {/* Modal */}
        <div
          className={`relative bg-white rounded-xl shadow-lg border border-secondary-100 transition-all transform ${modalSize} w-full`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-secondary-100">
            <h3 id="modal-title" className="text-lg font-semibold text-secondary-900">{title}</h3>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="text-secondary-500 hover:text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-5 text-secondary-700">{children}</div>

          {/* Footer */}
          {footer ? (
            <div className="p-5 border-t border-secondary-100 bg-secondary-50">{footer}</div>
          ) : (
            <div className="p-5 border-t border-secondary-100 bg-secondary-50 flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>OK</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
