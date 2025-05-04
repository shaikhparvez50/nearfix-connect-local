import { useEffect } from 'react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`p-4 rounded-lg shadow-lg ${
          toast.variant === 'destructive'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}
      >
        <h3 className="font-bold">{toast.title}</h3>
        <p className="text-sm">{toast.description}</p>
      </div>
    </div>
  );
};

export default Toast; 