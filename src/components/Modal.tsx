import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  // 1. Add the optional maxWidth prop here
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        // 2. Use the maxWidth prop to set the class dynamically
        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-${maxWidth}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-semibold text-2xl leading-none">&times;</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;