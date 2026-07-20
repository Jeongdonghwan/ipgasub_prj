import { CheckCircle, XCircle, Info } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const ICON_COLORS = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
}

export default function Toast() {
  const { message, type, visible, hide } = useToastStore()

  if (!visible) return null

  const Icon = ICONS[type]

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg ${COLORS[type]}`}>
        <Icon className={`w-4 h-4 shrink-0 ${ICON_COLORS[type]}`} />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={hide} className="ml-2 opacity-50 hover:opacity-100 text-lg leading-none">&times;</button>
      </div>
    </div>
  )
}
