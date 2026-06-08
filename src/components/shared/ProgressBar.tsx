import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, max = 100, showLabel = false, className }: ProgressBarProps) {
  // Calcul du pourcentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>Complétion</span>
          <span className="font-medium text-zinc-700">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <Progress 
        value={percentage} 
        className="h-[3px] bg-zinc-200"
        // Le composant shadcn/ui Progress utilise déjà les CSS variables
        // On override juste la hauteur ici
      />
    </div>
  )
}
