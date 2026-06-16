import { type TypeStade, type StatutStade } from '@matura/shared'
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
    return 'bg-[#41A677] text-white border-transparent'
  }
  if (isCurrent) {
    return 'bg-[#3A8FC4] text-white border-transparent shadow-[0_0_0_3px_#EBF5FC]'
  }
  return 'bg-[#f6f6f4] text-[#b6b6b6] border-[#e5e5e1] border-[1.5px]'
}

function getConnectorStyle(leftStade: StadeInfo, rightStade: StadeInfo, currentStade: number): string {
  const leftDone = leftStade.statut === 'VALIDE';
  const rightDone = rightStade.statut === 'VALIDE';
  const leftActive = leftStade.numero === currentStade;
  const rightActive = rightStade.numero === currentStade;

  if (leftDone && rightDone) {
    return 'bg-[#41A677] h-[1.5px]';
  }
  if (leftDone && rightActive) {
    return 'bg-gradient-to-r from-[#41A677] to-[#3A8FC4] h-[1.5px]';
  }
  if (leftActive && rightDone) {
    return 'bg-gradient-to-r from-[#3A8FC4] to-[#41A677] h-[1.5px]';
  }
  return 'bg-[#e5e5e1] h-[1.5px]';
}

export function StadeStepperH({ stades, currentStade, onStadeClick, className }: StadeStepperHProps) {
  return (
    <div className={cn('w-full py-4', className)}>
      <div className="flex items-center justify-between">
        {stades.map((stade, index) => {
          const isCurrent = stade.numero === currentStade
          const isClickable = stade.statut !== 'VERROUILLE' && onStadeClick

          return (
            <div key={stade.numero} className="flex items-center flex-1">
              {/* Connecteur gauche (sauf pour le premier) */}
              {index > 0 && (
                <div className={cn('flex-1', getConnectorStyle(stades[index - 1], stade, currentStade))} />
              )}

              {/* Cercle stade */}
              <div className="flex flex-col items-center gap-1.5 px-2">
                <button
                  onClick={() => isClickable && onStadeClick(stade.numero)}
                  disabled={!isClickable}
                  className={cn(
                    'w-[26px] h-[26px] rounded-full flex items-center justify-center',
                    'text-[11px] font-semibold transition-all',
                    getStadeCircleClasses(stade, isCurrent),
                    isClickable && 'hover:scale-110 cursor-pointer',
                    !isClickable && 'cursor-not-allowed'
                  )}
                >
                  {stade.statut === 'VALIDE' ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  ) : (
                    stade.numero
                  )}
                </button>

                {/* Label */}
                <span
                  className={cn(
                    'text-[9px] text-center whitespace-nowrap transition-colors',
                    stade.statut === 'VALIDE' ? 'text-[#318055] font-medium' :
                    isCurrent ? 'text-[#1C5F8C] font-semibold' : 'text-[#b6b6b6]'
                  )}
                >
                  {STADE_LABELS[stade.numero]}
                </span>
              </div>

              {/* Connecteur droit (sauf pour le dernier) */}
              {index < stades.length - 1 && (
                <div className={cn('flex-1', getConnectorStyle(stade, stades[index + 1], currentStade))} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
