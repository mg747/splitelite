'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: 'bg-red-500/20',
      iconColor: 'text-red-400',
      button: 'bg-red-500 hover:bg-red-600 text-white',
    },
    warning: {
      icon: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      button: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    default: {
      icon: 'bg-primary-500/20',
      iconColor: 'text-primary-400',
      button: 'btn-primary',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="modal-3d bg-dark-900/95 rounded-2xl w-full max-w-md border border-dark-700 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${styles.icon}`}>
              <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-dark-300 text-sm">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all ${styles.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
