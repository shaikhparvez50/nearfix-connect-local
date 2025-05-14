
import { Toast as ToastPrimitive } from "@/components/ui/toast"
import { useToast as useToastInternal } from "@/components/ui/use-toast"

export type Toast = ToastPrimitive & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export function useToast() {
  return useToastInternal()
}
