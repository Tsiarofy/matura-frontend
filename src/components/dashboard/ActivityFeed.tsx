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
    <div className={cn('space-y-0', className)}>
      {activities.map((act) => {
        let iconBg = 'bg-[var(--color-surface-icon-bg)]'
        let iconColor = 'text-[var(--color-text-muted)]'

        switch (act.type) {
          case 'STADE_VALIDE':
            iconBg = 'bg-[var(--color-success-bg)]'
            iconColor = 'text-[var(--color-success-text)]'
            break
          case 'STADE_SOUMIS':
            iconBg = 'bg-amber-50'
            iconColor = 'text-amber-600'
            break
          case 'EVALUATION':
            iconBg = 'bg-purple-50'
            iconColor = 'text-purple-600'
            break
          case 'MISSION_SOUMISE':
            iconBg = 'bg-blue-50'
            iconColor = 'text-blue-600'
            break
          case 'CANDIDATURE_RECUE':
            iconBg = 'bg-indigo-50'
            iconColor = 'text-indigo-600'
            break
          case 'MISSION_VALIDEE':
            iconBg = 'bg-emerald-50'
            iconColor = 'text-emerald-600'
            break
          case 'MISSION_REJETEE':
            iconBg = 'bg-red-50'
            iconColor = 'text-red-600'
            break
          case 'DEMANDE_ACCEPTEE':
            iconBg = 'bg-blue-50'
            iconColor = 'text-blue-700'
            break
          case 'DEMANDE_REFUSEE':
            iconBg = 'bg-orange-50'
            iconColor = 'text-orange-600'
            break
          case 'CANDIDATURE':
            iconBg = 'bg-indigo-50'
            iconColor = 'text-indigo-600'
            break
          case 'MENTOR':
            iconBg = 'bg-teal-50'
            iconColor = 'text-teal-600'
            break
        }

        return (
          <div key={act.id} className="flex gap-4 py-4 border-b border-[var(--color-bg-shell)] last:border-0 group">
            {/* Avatar Minimaliste */}
            <div className={cn(
              "w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold",
              iconBg,
              iconColor
            )}>
              {act.label.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-tight font-medium">
                  <strong className="text-[var(--color-text-primary)] font-bold">{act.label.split(' ')[0]}</strong>
                  {' '}{act.label.split(' ').slice(1).join(' ')}
                </p>
              </div>
              <p className="text-[11px] text-[var(--color-text-disabled)] mt-1 font-bold uppercase tracking-wider">
                {formatRelativeTime(act.date)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
