import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeBannerProps {
  prenom: string
  role: string
  subtitle: string
  icon: LucideIcon
  colorClass: string        // ex: 'text-green-600'
  gradientClass: string     // ex: 'from-green-500/10 via-emerald-500/5 to-transparent'
  borderClass: string       // ex: 'border-green-200/60'
  iconBgClass: string       // ex: 'bg-green-100'
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 6)  return 'Bonne nuit'
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export function WelcomeBanner({
  prenom,
  role,
  subtitle,
  icon: Icon,
  colorClass,
  gradientClass,
  borderClass,
  iconBgClass,
}: WelcomeBannerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-white px-6 py-5 shadow-sm',
        'bg-gradient-to-r',
        gradientClass,
        borderClass,
      )}
    >
      {/* Fond décoratif */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative flex items-center gap-4">
        {/* Icône rôle */}
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[var(--color-border)]',
            iconBgClass,
          )}
        >
          <Icon className={cn('h-5 w-5', colorClass)} strokeWidth={1.25} />
        </div>

        {/* Texte */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[20px] font-semibold leading-tight text-[var(--color-text-primary)]">
              {getGreeting()}, {prenom}
            </h1>
            <span
              className={cn(
                'inline-block rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide',
                iconBgClass,
                colorClass,
              )}
            >
              {role}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-text-muted)]">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}
