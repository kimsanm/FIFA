import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '5xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
  overlayClassName?: string;
  id?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
  '2xl': 'max-w-4xl',
  '3xl': 'max-w-5xl',
  '5xl': 'max-w-7xl',
  full: 'max-w-full h-full m-0 rounded-none',
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = '',
  overlayClassName = '',
  id,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const modalElement = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          id={id || 'global-modal'}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className={`fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer ${overlayClassName}`}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className={`relative w-full ${sizeClasses[size]} rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col max-h-[90vh] ${className}`}
          >
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-5 border-b border-slate-850 bg-slate-950/40 shrink-0">
                {title ? (
                  <div className="font-sans text-sm font-extrabold text-white tracking-tight">
                    {title}
                  </div>
                ) : (
                  <div />
                )}

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full border border-slate-800 bg-slate-950/80 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-lime-400"
                    title="Close modal"
                    id="modal-close-btn"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Modal Body / Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalElement, document.body);
}
