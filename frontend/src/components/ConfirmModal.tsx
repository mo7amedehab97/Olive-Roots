import React from "react";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-primary/30 shadow-xl w-full max-w-sm p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
          {title}
        </h2>
        <p className="text-gray-600 text-center mb-6">{description}</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            className="px-5 py-2.5 rounded-md font-medium bg-primary text-white shadow hover:opacity-95 transition disabled:bg-primary/70"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
          <button
            type="button"
            className="px-5 py-2.5 rounded-md font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
