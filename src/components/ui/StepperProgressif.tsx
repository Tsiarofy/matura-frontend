// maturproj-frontend/src/components/ui/StepperProgressif.tsx
// Composant stepper avec logique d'invalidation progressive.
//
// Quand un entrepreneur modifie une étape parente (ex: zone géo, TAM),
// les étapes enfants dépendantes (SAM, SOM) sont automatiquement
// réinitialisées pour garantir l'intégrité des calculs en cascade.
//
// Architecture :
// - Chaque step déclare ses dépendances via `dependsOn`
// - Quand une étape change, toutes les étapes qui en dépendent sont invalidées
// - Le composant gère la navigation et la validation visuelle
// - Découplé : utilisable pour tout formulaire multi-étapes (pas uniquement Stade 3)

import { useState, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Check, AlertTriangle, ChevronRight } from 'lucide-react'

// ─── TYPES ──────────────────────────────────────────────────────

export interface StepDefinition {
  /** Identifiant unique de l'étape */
  id: string
  /** Titre affiché dans le stepper */
  label: string
  /** Étapes dont celle-ci dépend (invalidation en cascade) */
  dependsOn?: string[]
  /** Fonction de validation optionnelle : retourne true si l'étape est complète */
  isValid?: () => boolean
}

interface StepperProgressifProps {
  /** Définitions des étapes */
  steps: StepDefinition[]
  /** Étape active courante */
  activeStep: string
  /** Callback quand l'utilisateur change d'étape */
  onStepChange: (stepId: string) => void
  /** Callback d'invalidation : appelé avec les IDs des étapes à réinitialiser */
  onInvalidate?: (invalidatedStepIds: string[]) => void
  /** Étapes modifiées depuis la dernière sauvegarde */
  dirtySteps?: Set<string>
  /** Variante visuelle */
  variant?: 'horizontal' | 'vertical'
  /** Classe CSS additionnelle */
  className?: string
}

// ─── COMPOSANT ──────────────────────────────────────────────────

export function StepperProgressif({
  steps,
  activeStep,
  onStepChange,
  onInvalidate,
  dirtySteps = new Set(),
  variant = 'horizontal',
  className,
}: StepperProgressifProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [invalidatedSteps, setInvalidatedSteps] = useState<Set<string>>(new Set())

  // Construire le graphe de dépendances inversé (pour savoir qui dépend de qui)
  const dependencyGraph = useMemo(() => {
    const graph = new Map<string, string[]>()
    for (const step of steps) {
      if (step.dependsOn) {
        for (const parentId of step.dependsOn) {
          const existing = graph.get(parentId) ?? []
          existing.push(step.id)
          graph.set(parentId, existing)
        }
      }
    }
    return graph
  }, [steps])

  // Quand une étape parente est modifiée (dirty), invalider les enfants
  useEffect(() => {
    const toInvalidate = new Set<string>()

    const collectDependents = (stepId: string) => {
      const children = dependencyGraph.get(stepId) ?? []
      for (const childId of children) {
        if (!toInvalidate.has(childId)) {
          toInvalidate.add(childId)
          collectDependents(childId) // cascade récursive
        }
      }
    }

    for (const dirtyId of dirtySteps) {
      collectDependents(dirtyId)
    }

    if (toInvalidate.size > 0) {
      setInvalidatedSteps(toInvalidate)
      // Retirer les étapes invalidées du set complété
      setCompletedSteps((prev) => {
        const next = new Set(prev)
        for (const id of toInvalidate) next.delete(id)
        return next
      })
      // Notifier le parent
      onInvalidate?.(Array.from(toInvalidate))
    }
  }, [dirtySteps, dependencyGraph, onInvalidate])

  // Valider automatiquement l'étape courante si la condition est remplie
  useEffect(() => {
    const currentStep = steps.find((s) => s.id === activeStep)
    if (currentStep?.isValid?.()) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep.id))
      // Retirer de invalidated si re-complété
      setInvalidatedSteps((prev) => {
        const next = new Set(prev)
        next.delete(currentStep.id)
        return next
      })
    }
  }, [activeStep, steps])

  const handleStepClick = useCallback(
    (stepId: string) => {
      onStepChange(stepId)
    },
    [onStepChange],
  )

  const activeIdx = steps.findIndex((s) => s.id === activeStep)

  const isHorizontal = variant === 'horizontal'

  return (
    <div
      className={cn(
        isHorizontal ? 'flex items-center gap-1' : 'flex flex-col gap-2',
        className,
      )}
    >
      {steps.map((step, idx) => {
        const isActive = step.id === activeStep
        const isCompleted = completedSteps.has(step.id)
        const isInvalidated = invalidatedSteps.has(step.id)
        const isPast = idx < activeIdx

        return (
          <div
            key={step.id}
            className={cn(
              isHorizontal ? 'flex items-center gap-1' : 'flex items-start gap-3',
            )}
          >
            {/* Indicateur de step */}
            <button
              type="button"
              onClick={() => handleStepClick(step.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-green-400/50',
                isActive && 'bg-green-600 text-white shadow-sm shadow-green-200',
                isCompleted && !isActive && 'bg-green-50 text-green-700 hover:bg-green-100',
                isInvalidated && 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200',
                !isActive && !isCompleted && !isInvalidated && isPast && 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
                !isActive && !isCompleted && !isInvalidated && !isPast && 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100',
              )}
            >
              {/* Icône de statut */}
              {isCompleted && !isInvalidated ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : isInvalidated ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-500',
                )}>
                  {idx + 1}
                </span>
              )}

              {step.label}
            </button>

            {/* Connecteur (sauf dernier) */}
            {idx < steps.length - 1 && isHorizontal && (
              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
            )}
          </div>
        )
      })}
    </div>
  )
}
