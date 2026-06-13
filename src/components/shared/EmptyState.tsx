import { Button } from '@/components/ui/button'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {/* Icône */}
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-zinc-400" strokeWidth={1.25} />
        </div>
      )}

      {/* Titre */}
      <h3 className="text-[15px] font-medium text-zinc-800 mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[12px] text-zinc-500 max-w-sm mb-6">
          {description}
        </p>
      )}

      {/* Action optionnelle */}
      {action && (
        <Button
          onClick={action.onClick}
          size="sm"
          variant="success"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
