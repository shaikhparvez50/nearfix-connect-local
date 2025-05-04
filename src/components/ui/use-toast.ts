import { useState } from "react";

type Toast = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  };

  return { toasts, showToast };
};

export const useToastAction = () => {
  const { showToast } = useToast();
  return { toast: showToast };
};
