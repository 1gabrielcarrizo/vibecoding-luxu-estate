"use client";

import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  icon?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false,
  icon = "info",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#152e2a] rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-dropdown border border-nordic/10 dark:border-primary/20 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDestructive
                ? "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                : "bg-hint-green text-mosque dark:bg-emerald-950/40 dark:text-emerald-300"
            }`}
          >
            <span className="material-icons text-2xl">{icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-nordic dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm text-nordic/70 dark:text-gray-300 leading-relaxed font-sf-pro">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-nordic/10 dark:border-gray-700/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-nordic/70 hover:text-nordic dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-nordic/5 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 text-sm font-medium rounded-lg text-white shadow-sm transition-all cursor-pointer ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-mosque hover:bg-mosque/90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

