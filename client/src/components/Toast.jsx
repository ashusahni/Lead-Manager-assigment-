import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 duration-200 bg-white text-slate-800 border-slate-200">
      {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
      {isError && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
      {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-600 shrink-0" />}

      <span className="text-xs font-medium">{toast.message}</span>

      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
