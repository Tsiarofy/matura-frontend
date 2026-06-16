import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface BRLBadgeProps {
  brl: number
  className?: string
}

const BRL_STYLES: Record<string, string> = {
  '1-2': 'bg-[#f6f6f4] text-[#757575] border-[#eeeeea]',
  '3-4': 'bg-[#E2F7F6] text-[#0D7A75] border-[#A6E3E1]',
  '5': 'bg-[#fff8e8] text-[#c47d00] border-[#f9d98a]',
  '6-7': 'bg-[#eafdf3] text-[#318055] border-[#c5f3d8]',
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
        'flex items-center gap-1 px-1.5 py-0.5 rounded-full',
        'text-[9.5px] font-medium border',
        getBRLStyle(validBRL),
        className
      )}
    >
      <span className={cn(
        'w-1 h-1 rounded-full',
        validBRL >= 6 ? 'bg-[#41A677]' :
        validBRL === 5 ? 'bg-[#f3b63f]' :
        validBRL >= 3 ? 'bg-[#1BA8A0]' :
        'bg-[#757575]'
      )} />
      BRL {validBRL}
    </Badge>
  )
}
