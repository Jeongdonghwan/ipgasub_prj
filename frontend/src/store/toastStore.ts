import { create } from 'zustand'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  visible: boolean
  show: (type: 'success' | 'error' | 'info', message: string) => void
  hide: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'info',
  visible: false,
  show: (type, message) => {
    set({ type, message, visible: true })
    setTimeout(() => set({ visible: false }), 3000)
  },
  hide: () => set({ visible: false }),
}))
