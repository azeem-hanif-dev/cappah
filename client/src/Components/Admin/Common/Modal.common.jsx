import React from "react";
import { X } from "lucide-react";
const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className={` bg-admintext text-white p-6 rounded shadow-md ${className}`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="content font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition-colors "
          >
            <X />
          </button>
        </div>

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
