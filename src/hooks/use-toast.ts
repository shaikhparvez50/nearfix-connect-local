
import { useState } from "react";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...props }]);
  };

  return { toasts, toast };
};
