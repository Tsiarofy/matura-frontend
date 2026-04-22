import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface BRLBadgeProps {
  brl: number
  className?: string
}

const BRL_STYLES: Record<string, string> = {
  '1-2': 'bg-zinc-100 text-zinc-600 border-zinc-200',
  '3-4': 'bg-amber-50 text-amber-700 border-amber-200',
  '5': 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]',
  '6-7': 'bg-green-50 text-green-700 border-green-200',
}

function getBRLStyle(brl: number): string {
  if (brl >= 1 && brl <= 2) return BRL_STYLES['1-2']
  if (brl >= 3 && brl <= 4) return BRL_STYLES['3-4']
  if (brl === 5) return BRL_STYLES['5']
  if (brl >= 6 && brl <= 7) return BRL_STYLES['6-7']
  return BRL_STYLES['1-2'] // Fallback
}

export function BRLBadge({ brl, className }: BRLBadgeProps) {
  // Validation
  const validBRL = Math.max(0, Math.min(7, brl))
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 rounded-full',
        'text-[11px] font-medium border',
        getBRLStyle(validBRL),
        className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        validBRL >= 6 ? 'bg-green-600' :
        validBRL === 5 ? 'bg-orange-600' :
        validBRL >= 3 ? 'bg-amber-400' :
        'bg-zinc-400'
      )} />
      BRL {validBRL}
    </Badge>
  )
}
