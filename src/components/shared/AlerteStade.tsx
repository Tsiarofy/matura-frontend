import { Alert } from '@/components/ui/alert'
import { Alerte } from '@matura/shared'
import { cn } from '@/lib/utils'
import { AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react'

interface AlerteStadeProps {
  alerte: Alerte
  onResolve?: () => void
  className?: string
}

const ALERTE_CONFIG = {
  CRITIQUE: {
    icon: XCircle,
    classes: 'bg-red-50 text-red-800 border-red-100',
    iconClasses: 'text-red-600',
  },
  ATTENTION: {
    icon: AlertCircle,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    iconClasses: 'text-amber-600',
  },
  INFO: {
    icon: Info,
    classes: 'bg-blue-50 text-blue-800 border-blue-100',
    iconClasses: 'text-blue-600',
  },
  SUCCES: {
    icon: CheckCircle2,
    classes: 'bg-green-50 text-green-800 border-green-200',
    iconClasses: 'text-green-600',
  },
} as const

type NiveauAlerte = keyof typeof ALERTE_CONFIG

export function AlerteStade({ alerte, onResolve, className }: AlerteStadeProps) {
  // Normaliser le niveau (au cas où l'API renvoie 'SUCCES' au lieu de définir dans le type)
  const niveau = (alerte.niveau.toUpperCase() === 'SUCCES' ? 'SUCCES' : alerte.niveau) as NiveauAlerte
  const config = ALERTE_CONFIG[niveau] || ALERTE_CONFIG.INFO
  const Icon = config.icon

  return (
    <Alert
      className={cn(
        'flex items-start gap-2 px-3 py-2.5 rounded-lg border text-[12px]',
        config.classes,
        alerte.resolue && 'opacity-50',
        className
      )}
    >
      <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', config.iconClasses)} strokeWidth={2} />
      
      <div className="flex-1 min-w-0">
        <p className="leading-relaxed">{alerte.message}</p>
        {alerte.resolue && (
          <p className="text-[10px] mt-1 opacity-70">✓ Résolu</p>
        )}
      </div>

      {/* Bouton résoudre optionnel */}
      {!alerte.resolue && onResolve && niveau !== 'SUCCES' && (
        <button
          onClick={onResolve}
          className={cn(
            'text-[10px] font-medium px-2 py-1 rounded-md',
            'hover:bg-white/50 transition-colors flex-shrink-0'
          )}
        >
          Résoudre
        </button>
      )}
    </Alert>
  )
}
