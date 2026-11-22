import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, lead }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !lead) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(lead.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-slate-900">Delete Lead</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete lead{' '}
                <span className="font-semibold text-slate-800">{lead.name}</span> from{' '}
                <span className="font-semibold text-slate-800">{lead.company}</span>? This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm shadow-rose-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {deleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Lead</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
