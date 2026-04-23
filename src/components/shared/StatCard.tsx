import { Card } from '@/components/ui/card'
import {type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  delta?: {
    value: number
    label: string
    isPositive?: boolean
  }
  icon?: LucideIcon
  className?: string
}

export function StatCard({ label, value, delta, icon: Icon, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        'bg-zinc-50 border-zinc-200 rounded-xl p-4',
        'hover:border-zinc-300 transition-colors',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {/* Label au-dessus */}
          <p className="text-[11px] font-normal text-zinc-400">{label}</p>
          
          {/* Valeur principale */}
          <p className="text-[22px] font-medium text-zinc-900 leading-none">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
          
          {/* Delta optionnel */}
          {delta && (
            <p
              className={cn(
                'text-[11px] font-normal',
                delta.isPositive ? 'text-green-600' : 'text-amber-700'
              )}
            >
              {delta.isPositive ? '+' : ''}{delta.value}% {delta.label}
            </p>
          )}
        </div>

        {/* Icône optionnelle */}
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
            <Icon className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </Card>
  )
}
