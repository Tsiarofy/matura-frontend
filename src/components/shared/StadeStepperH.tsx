import { TypeStade, StatutStade } from '@matura/shared'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StadeInfo {
  type: TypeStade
  numero: number
  statut: StatutStade
}

interface StadeStepperHProps {
  stades: StadeInfo[]
  currentStade: number
  onStadeClick?: (numero: number) => void
  className?: string
}

const STADE_LABELS: Record<number, string> = {
  1: 'Émergence',
  2: 'Idéation',
  3: 'Marché',
  4: 'BMC',
  5: 'Faisabilité',
  6: 'Prototype',
  7: 'Lancement',
}

function getStadeCircleClasses(stade: StadeInfo, isCurrent: boolean): string {
  if (stade.statut === 'VALIDE') {
    return 'bg-green-600 text-white border-green-600'
  }
  if (isCurrent) {
    return 'bg-white text-green-600 border-green-500 border-[1.5px]'
  }
  if (stade.statut === 'EN_REVISION') {
    return 'bg-amber-50 text-amber-700 border-amber-400 border-[1.5px]'
  }
  if (stade.statut === 'VERROUILLE') {
    return 'bg-zinc-100 text-zinc-400 border-zinc-200'
  }
  return 'bg-white text-zinc-600 border-zinc-200'
}

function getConnectorClasses(prevStade?: StadeInfo): string {
  if (prevStade?.statut === 'VALIDE') {
    return 'bg-green-200'
  }
  return 'bg-zinc-200'
}

export function StadeStepperH({ stades, currentStade, onStadeClick, className }: StadeStepperHProps) {
  return (
    <div className={cn('w-full py-4', className)}>
      <div className="flex items-center justify-between">
        {stades.map((stade, index) => {
          const isCurrent = stade.numero === currentStade
          const isClickable = stade.statut !== 'VERROUILLE' && onStadeClick
          const prevStade = index > 0 ? stades[index - 1] : undefined

          return (
            <div key={stade.numero} className="flex items-center flex-1">
              {/* Connecteur gauche (sauf pour le premier) */}
              {index > 0 && (
                <div className={cn('h-px flex-1', getConnectorClasses(prevStade))} />
              )}

              {/* Cercle stade */}
              <div className="flex flex-col items-center gap-1 px-2">
                <button
                  onClick={() => isClickable && onStadeClick(stade.numero)}
                  disabled={!isClickable}
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    'text-[11px] font-medium transition-all',
                    getStadeCircleClasses(stade, isCurrent),
                    isClickable && 'hover:scale-110 cursor-pointer',
                    !isClickable && 'cursor-not-allowed'
                  )}
                >
                  {stade.statut === 'VALIDE' ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  ) : (
                    stade.numero
                  )}
                </button>

                {/* Label */}
                <span
                  className={cn(
                    'text-[9px] font-normal text-center whitespace-nowrap',
                    isCurrent ? 'text-green-600 font-medium' : 'text-zinc-400'
                  )}
                >
                  {STADE_LABELS[stade.numero]}
                </span>
              </div>

              {/* Connecteur droit (sauf pour le dernier) */}
              {index < stades.length - 1 && (
                <div className={cn('h-px flex-1', getConnectorClasses(stade))} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
