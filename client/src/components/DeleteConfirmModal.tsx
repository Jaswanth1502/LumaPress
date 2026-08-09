import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-900">{title}</h3>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};
