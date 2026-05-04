import { cn } from '@/lib/utils'
import { Check, ChevronRight } from 'lucide-react'

export interface Etape {
  id: string
  titre: string
  description?: string
  dependances: string[] // IDs des étapes précédentes requises
}

interface StepperProgressifProps {
  etapes: Etape[]
  etapeActive: string
  etapesCompletees: Set<string>
  onEtapeChange: (etapeId: string) => void
}

export function StepperProgressif({
  etapes,
  etapeActive,
  etapesCompletees,
  onEtapeChange,
}: StepperProgressifProps) {
  const estAccessible = (etape: Etape, index: number) => {
    // Première étape toujours accessible
    if (index === 0) return true
    
    // Vérifier si toutes les dépendances sont complétées
    const dependancesSatisfaites = etape.dependances.every(
      (depId) => etapesCompletees.has(depId)
    )
    
    return dependancesSatisfaites
  }

  const estCompletee = (etapeId: string) => etapesCompletees.has(etapeId)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {etapes.map((etape, index) => {
          const accessible = estAccessible(etape, index)
          const completee = estCompletee(etape.id)
          const active = etapeActive === etape.id

          return (
            <div key={etape.id} className="flex items-center flex-1">
              <button
                onClick={() => accessible && onEtapeChange(etape.id)}
                disabled={!accessible}
                className={cn(
                  'flex flex-col items-center flex-1 min-w-0',
                  !accessible && 'opacity-50 cursor-not-allowed',
                  accessible && !active && 'cursor-pointer hover:opacity-80 transition-opacity'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    completee && 'bg-green-500 text-white',
                    !completee && active && 'bg-blue-500 text-white',
                    !completee && !active && accessible && 'bg-zinc-200 text-zinc-600',
                    !completee && !active && !accessible && 'bg-zinc-100 text-zinc-400'
                  )}
                >
                  {completee ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-xs font-medium truncate',
                      active && 'text-blue-600',
                      !active && 'text-zinc-600'
                    )}
                  >
                    {etape.titre}
                  </p>
                  {etape.description && (
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                      {etape.description}
                    </p>
                  )}
                </div>
              </button>
              {index < etapes.length - 1 && (
                <ChevronRight
                  className={cn(
                    'w-4 h-4 mx-2 flex-shrink-0',
                    completee && 'text-green-500',
                    !completee && 'text-zinc-300'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      
      {/* Message pour étapes non accessibles */}
      {!estAccessible(etapes.find((e) => e.id === etapeActive)!, etapes.findIndex((e) => e.id === etapeActive)) && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            ⚠️ Cette étape sera accessible une fois les étapes précédentes complétées.
          </p>
        </div>
      )}
    </div>
  )
}
