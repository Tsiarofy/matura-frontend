import { type EvenementActivite } from '@/hooks/useDashboard'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  activities: EvenementActivite[]
  className?: string
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours} h`
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} j`

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return dateString
  }
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        <p className="text-[14px] text-[var(--color-text-muted)] font-medium">Aucune activité récente.</p>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Ligne verticale de la timeline */}
      <div className="absolute left-[20px] top-6 bottom-6 w-[1px] bg-[#eeeeea]" />

      <div className="space-y-4 relative">
        {activities.map((act) => {
          const ageInDays = (Date.now() - new Date(act.date).getTime()) / (1000 * 60 * 60 * 24);
          const isRecent = ageInDays < 7;
          const isAncien = ageInDays >= 30;

          let dotStyle = '';
          let dotTextColor = 'text-white';

          const typeLower = act.type.toLowerCase();
          if (typeLower.includes('reunion') || typeLower.includes('appel') || typeLower.includes('rdv') || typeLower.includes('entretien') || typeLower.includes('meeting')) {
            // Réunion / appel
            dotStyle = 'bg-[#3A8FC4] shadow-[0_0_0_2px_#fff,0_0_0_4px_#B8D8F0]';
          } else if (isRecent) {
            // Événement récent / important
            dotStyle = 'bg-[#41A677] shadow-[0_0_0_2px_#fff,0_0_0_4px_#c5f3d8]';
          } else if (isAncien) {
            // Ancien / très passé
            dotStyle = 'bg-[#e5e5e1]';
            dotTextColor = 'text-[#b6b6b6]';
          } else {
            // Action passée (neutre)
            dotStyle = 'bg-[#A6E3E1]';
            dotTextColor = 'text-[#0D7A75]';
          }

          let labelColorClass = 'text-[#757575]';
          let boldColorClass = 'text-[#141414]';
          let labelFontWeight = 'font-normal';

          if (isRecent) {
            labelColorClass = 'text-[#141414]';
            boldColorClass = 'text-black font-semibold';
            labelFontWeight = 'font-medium';
          } else if (isAncien) {
            labelColorClass = 'text-[#b6b6b6]';
            boldColorClass = 'text-[#757575]';
          }

          return (
            <div key={act.id} className="flex gap-4 py-3 relative group">
              {/* Avatar Minimaliste */}
              <div className={cn(
                "w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold transition-all relative z-10",
                dotStyle,
                dotTextColor
              )}>
                {act.label.charAt(0)}
              </div>

              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-[13px] leading-tight", labelColorClass, labelFontWeight)}>
                    <strong className={cn(boldColorClass)}>{act.label.split(' ')[0]}</strong>
                    {' '}{act.label.split(' ').slice(1).join(' ')}
                  </p>
                </div>
                <p className="text-[10px] text-[#b6b6b6] mt-1 font-bold uppercase tracking-wider">
                  {formatRelativeTime(act.date)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
