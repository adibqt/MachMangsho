import React from 'react';

const ConfirmDeleteModal = ({ open, title = 'Delete Item', message = 'Are you sure?', confirmText = 'Delete', cancelText = 'Cancel', onCancel, onConfirm, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={!loading ? onCancel : undefined} />
      <div className="relative bg-white w-full max-w-md mx-4 rounded-lg shadow-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onCancel} disabled={loading} className="text-gray-500 hover:text-gray-800 disabled:opacity-50">✕</button>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700">
          {message}
        </div>
        <div className="px-5 py-4 flex justify-end gap-3 bg-gray-50 border-t border-gray-100">
          <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 rounded border disabled:opacity-50">{cancelText}</button>
          <button type="button" onClick={onConfirm} disabled={loading} className="px-5 py-2 rounded text-white disabled:opacity-70" style={{ backgroundColor: '#c9595a' }}>
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
