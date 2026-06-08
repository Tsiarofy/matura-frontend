// maturproj-frontend/src/components/geo/GeoHierarchicalNavigator.tsx
// Composant de navigation hiérarchique pour la sélection géographique
// Guide l'utilisateur à travers les niveaux parent jusqu'au niveau cible

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Loader2, Check } from 'lucide-react'
import { useRegions, useEnfantsGeo, type ZoneItem } from '@/hooks/useGeo'

type Niveau='REGION' | 'DISTRICT' | 'COMMUNE' | 'FOKONTANY';
interface GeoHierarchicalNavigatorProps {
  niveauCible: 'REGION' | 'DISTRICT' | 'COMMUNE' | 'FOKONTANY'
  onSelectionComplete: (resultat: {
    niveau_principal: string
    zone_principale: ZoneItem
    chemin: ZoneItem[]
  }) => void
  labelCls?: string
  inputCls?: string
}

// Ordre des niveaux hiérarchiques
const HIERARCHIE = ['REGION', 'DISTRICT', 'COMMUNE', 'FOKONTANY'] as const
const NIVEAU_LABELS: Record<string, string> = {
  REGION: 'Région',
  DISTRICT: 'District',
  COMMUNE: 'Commune',
  FOKONTANY: 'Fokontany',
}

export function GeoHierarchicalNavigator({
  niveauCible,
  onSelectionComplete,
  labelCls,
  inputCls,
}: GeoHierarchicalNavigatorProps) {
  const cls = {
    label: labelCls ?? 'block text-[11px] text-zinc-500 mb-1',
    input: inputCls ?? 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white appearance-none',
  }

  // Déterminer les étapes nécessaires selon le niveau cible
  const indexCible = HIERARCHIE.indexOf(niveauCible)
  const etapes = HIERARCHIE.slice(0, indexCible + 1)

  // État pour stocker les sélections à chaque étape
  const [selections, setSelections] = useState<Record<string, ZoneItem>>({})
  const [etapeActive, setEtapeActive] = useState(0)

  const { data: regions = [], isLoading: loadingRegions } = useRegions()

  // Charger les enfants de l'étape précédente
  const etapePrecedente = etapeActive > 0 ? etapes[etapeActive - 1] : null
  const codeParent = etapePrecedente ? selections[etapePrecedente]?.code : ''
  const { data: enfants = [], isLoading: loadingEnfants } = useEnfantsGeo(
    etapePrecedente ?? '',
    codeParent,
  )

  // Handler pour sélectionner une zone à une étape
  const handleSelection = (niveau: Niveau, zone: ZoneItem) => {
    const nouvellesSelections = { ...selections, [niveau]: zone }
    setSelections(nouvellesSelections)

    // Passer à l'étape suivante ou terminer
    const indexEtape = etapes.indexOf(niveau)
    if (indexEtape < indexCible) {
      setEtapeActive(indexEtape + 1)
    } else {
      // Niveau cible atteint - retourner le résultat complet
      const chemin = etapes.slice(0, indexCible).map((e) => nouvellesSelections[e]).filter(Boolean)
      onSelectionComplete({
        niveau_principal: niveauCible,
        zone_principale: zone,
        chemin,
      })
    }
  }

  // Handler pour revenir à une étape précédente
  const handleRetour = (indexEtape: number) => {
    setEtapeActive(indexEtape)
    // Réinitialiser les sélections après cette étape
    const nouvellesSelections: Record<string, ZoneItem> = {}
    etapes.slice(0, indexEtape).forEach((e) => {
      if (selections[e]) {
        nouvellesSelections[e] = selections[e]
      }
    })
    setSelections(nouvellesSelections)
  }

  // Déterminer les options pour l'étape actuelle
  const niveauActuel = etapes[etapeActive]
  const options = etapeActive === 0 ? regions : enfants
  const loading = etapeActive === 0 ? loadingRegions : loadingEnfants

  return (
    <div className="space-y-4">
      {/* Stepper visuel */}
      <div className="flex items-center gap-2 flex-wrap">
        {etapes.map((etape, index) => {
          const estSelectionne = !!selections[etape]
          const estActif = index === etapeActive
          const estPasse = index < etapeActive

          return (
            <div key={etape} className="flex items-center">
              <button
                type="button"
                onClick={() => estPasse && handleRetour(index)}
                disabled={!estPasse}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all',
                  estActif
                    ? 'bg-green-100 text-green-800 font-medium border border-green-300'
                    : estPasse
                    ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 cursor-pointer'
                    : 'bg-zinc-50 text-zinc-400 border border-zinc-200',
                )}
              >
                {estSelectionne && <Check className="w-3 h-3" />}
                {NIVEAU_LABELS[etape]}
              </button>
              {index < etapes.length - 1 && (
                <ChevronRight className="w-3 h-3 text-zinc-300 mx-1" />
              )}
            </div>
          )
        })}
      </div>

      {/* Select pour l'étape actuelle */}
      <div>
        <label className={cls.label}>
          Sélectionner {NIVEAU_LABELS[niveauActuel].toLowerCase()} *
        </label>
        {loading ? (
          <div className="flex items-center gap-2 text-[12px] text-zinc-400 py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Chargement…
          </div>
        ) : (
          <select
            value={selections[niveauActuel]?.code ?? ''}
            onChange={(e) => {
              const selected = options.find((z) => z.code === e.target.value)
              if (selected) handleSelection(niveauActuel, selected)
            }}
            className={cls.input}
          >
            <option value="">
              — Sélectionner une {NIVEAU_LABELS[niveauActuel].toLowerCase()} —
            </option>
            {options.map((z) => (
              <option key={z.code} value={z.code}>
                {z.nom}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Résumé des sélections */}
      {Object.keys(selections).length > 0 && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-1">
          <p className="text-[10px] text-zinc-500 font-medium">Sélection actuelle :</p>
          {etapes.slice(0, etapeActive + 1).map((etape) => {
            const selection = selections[etape]
            if (!selection) return null
            return (
              <p key={etape} className="text-[11px] text-zinc-700">
                <span className="font-medium">{NIVEAU_LABELS[etape]} :</span> {selection.nom}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}
