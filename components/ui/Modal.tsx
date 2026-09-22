// frontend/components/ui/Modal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] z-[70] md:inset-x-auto md:w-[600px] md:left-1/2 md:-translate-x-1/2 bg-wedding-paper rounded-xl shadow-2xl overflow-hidden flex flex-col border border-mauli-gold"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-mauli-gold/20 bg-white">
              <h2 className="font-marathi text-2xl text-wedding-maroon font-bold">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="text-gray-500" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}