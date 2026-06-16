// src/components/ui/StepperProgressif.tsx
// Stepper progressif bloquant avec invalidation en cascade (spec Section 4.1)
// L'invalidation se fait via onEtapeChange — le parent (Stade2Form etc.)
// est responsable du reset des données enfants (via react-hook-form setValue)

import { cn } from '@/lib/utils'
import { Check, ChevronRight, Lock } from 'lucide-react'

export interface Etape {
  id: string
  titre: string
  description?: string
  dependances: string[]
}

interface StepperProgressifProps {
  etapes: Etape[]
  etapeActive: string
  etapesCompletees: Set<string>
  onEtapeChange: (etapeId: string) => void
  // Callback optionnel déclenché quand une étape parente est modifiée
  // Permet au parent d'invalider les étapes enfants
  onEtapeReinitialisee?: (etapesAInvalider: string[]) => void
}

export function StepperProgressif({
  etapes,
  etapeActive,
  etapesCompletees,
  onEtapeChange,
  onEtapeReinitialisee,
}: StepperProgressifProps) {
  const estAccessible = (etape: Etape, index: number): boolean => {
    if (index === 0) return true
    return etape.dependances.every((depId) => etapesCompletees.has(depId))
  }

  const estCompletee = (etapeId: string): boolean => etapesCompletees.has(etapeId)

  const collecterEtapesDependantes = (racineId: string): string[] => {
    const dependantsDirects = etapes
      .filter((e) => e.dependances.includes(racineId))
      .map((e) => e.id)

    const visited = new Set<string>()
    const result: string[] = []

    const dfs = (id: string) => {
      if (visited.has(id)) return
      visited.add(id)
      result.push(id)
      etapes
        .filter((e) => e.dependances.includes(id))
        .forEach((e) => dfs(e.id))
    }

    dependantsDirects.forEach(dfs)
    return result
  }

  // Quand l'utilisateur retourne sur une étape déjà complétée,
  // on invalide en cascade toutes les étapes qui en dépendent
  const handleEtapeClick = (etapeId: string, accessible: boolean) => {
    if (!accessible) return

    const etapesAInvalider = collecterEtapesDependantes(etapeId)

    if (etapesAInvalider.length > 0 && onEtapeReinitialisee) {
      onEtapeReinitialisee(etapesAInvalider)
    }

    onEtapeChange(etapeId)
  }

  return (
    <div className="w-full space-y-3">
      {/* Stepper horizontal */}
      <div className="flex items-start justify-between gap-1">
        {etapes.map((etape, index) => {
          const accessible = estAccessible(etape, index)
          const completee = estCompletee(etape.id)
          const active = etapeActive === etape.id

          return (
            <div key={etape.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                {/* Bouton cercle — disabled si non accessible */}
                <button
                  type="button"
                  onClick={() => handleEtapeClick(etape.id, accessible)}
                  disabled={!accessible}
                  title={
                    !accessible
                      ? 'Complétez les étapes précédentes pour débloquer'
                      : etape.titre
                  }
                  aria-label={
                    !accessible
                      ? `${etape.titre} — à remplir progressivement`
                      : etape.titre
                  }
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all shrink-0',
                    completee && 'bg-[#41A677] text-white',
                    !completee && active && 'bg-[#3A8FC4] text-white shadow-[0_0_0_3px_#EBF5FC]',
                    !completee && !active && accessible && 'bg-[#f6f6f4] text-[#b6b6b6] border border-[#e5e5e1] hover:bg-[#eeeeea] hover:text-[#757575] cursor-pointer',
                    !accessible && 'bg-[#f6f6f4] text-[#b6b6b6] border border-[#e5e5e1] cursor-not-allowed opacity-60',
                  )}
                >
                  {completee ? (
                    <Check className="w-4 h-4" />
                  ) : !accessible ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </button>
 
                {/* Label */}
                <div className="mt-1.5 text-center px-1 w-full">
                  <p
                    className={cn(
                      'text-[10px] font-medium leading-tight truncate',
                      active && 'text-[#1C5F8C] font-semibold',
                      completee && 'text-[#318055] font-semibold',
                      !accessible && 'text-[#b6b6b6]',
                      accessible && !active && !completee && 'text-[#b6b6b6]',
                    )}
                  >
                    {etape.titre}
                  </p>
                  {/* Mention obligatoire spec Section 4.1 */}
                  {!accessible && (
                    <p className="text-[9px] text-[#b6b6b6] italic leading-tight">
                      à remplir progressivement
                    </p>
                  )}
                </div>
              </div>
 
              {/* Connecteur entre étapes */}
              {index < etapes.length - 1 && (
                <ChevronRight
                  className={cn(
                    'w-3 h-3 mx-0.5 flex-shrink-0 mb-4',
                    completee ? 'text-[#41A677]' : 'text-[#e5e5e1]',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
 
      {/* Barre de progression */}
      <div className="w-full bg-[#eeeeea] rounded-full h-1">
        <div
          className="bg-[#41A677] h-1 rounded-full transition-all duration-500"
          style={{
            width: `${
              etapes.length > 0
                ? (etapesCompletees.size / etapes.length) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  )
}