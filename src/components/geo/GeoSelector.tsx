// maturproj-frontend/src/components/geo/GeoSelector.tsx
// Composant autonome de sélection géographique hiérarchique.
//
// UX :
//   Étape 1 — Choisir le niveau (REGION / DISTRICT / COMMUNE / FOKONTANY)
//   Étape 2 — Choisir la zone principale dans la liste du niveau (select)
//   Étape 3 — Choisir les sous-zones via checkboxes (chargées dynamiquement)
//              ou cocher "Tout sélectionner" pour cibler toute la zone parente
//
// Données : issues de GET /api/geo/regions et GET /api/geo/enfants (useGeo hook)
// RHF     : useController sur le champ 'contexte_geographique' (objet entier)

import { useController, type Control } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { MapPin, ChevronRight, Loader2, Check, Users } from 'lucide-react'
import { useRegions, useEnfantsGeo, usePopulationCalcul, type ZoneItem, type StatistiquesZone } from '@/hooks/useGeo'
import { GeoHierarchicalNavigator } from './GeoHierarchicalNavigator'

// ─── TYPES (exportés pour defaultValues dans Stade1Form) ──────────────────────

export interface SousZones {
  tout_selectionner: boolean
  items: ZoneItem[]
}

export interface ContexteGeographique {
  niveau_principal: 'REGION' | 'DISTRICT' | 'COMMUNE' | 'FOKONTANY'
  zone_principale: ZoneItem
  sous_zones: SousZones
}

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const NIVEAU_LABELS: Record<string, string> = {
  REGION:    'Région',
  DISTRICT:  'District',
  COMMUNE:   'Commune',
  FOKONTANY: 'Fokontany',
}

// Libellé pluriel du niveau fils — affiché dans les titres et feedbacks
const SOUS_NIVEAU_LABELS: Record<string, string> = {
  REGION:    'districts',
  DISTRICT:  'communes',
  COMMUNE:   'fokontany',
  FOKONTANY: '',          // terminal — pas de sous-zones
}

// ─── SOUS-COMPOSANT : CHECKBOX ITEM ──────────────────────────────────────────

interface CheckboxItemProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[12px] text-left transition-all border',
        checked
          ? 'bg-green-50 border-green-300 text-green-800'
          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50',
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors',
          checked ? 'bg-green-500 border-green-500' : 'border-zinc-300 bg-white',
        )}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

interface GeoSelectorProps {
  control:   Control<any>
  name:      string        // chemin RHF, ex: 'contexte_geographique'
  labelCls?: string
  inputCls?: string
}

export function GeoSelector({ control, name, labelCls, inputCls }: GeoSelectorProps) {
  const cls = {
    label: labelCls ?? 'block text-[11px] text-zinc-500 mb-1',
    input: inputCls ?? 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white appearance-none',
  }

  // RHF — lit/écrit l'objet ContexteGeographique entier
  const { field } = useController({ control, name })
  const value: ContexteGeographique = field.value ?? {
    niveau_principal: 'REGION',
    zone_principale:  { code: '', nom: '' },
    sous_zones:       { tout_selectionner: false, items: [] },
  }

  const isTerminal    = value.niveau_principal === 'FOKONTANY'
  const sousLabel     = SOUS_NIVEAU_LABELS[value.niveau_principal]
  const aZonePrincipale = !!value.zone_principale?.code
  const useHierarchicalNavigator = value.niveau_principal !== 'REGION'

  // ── Données API via useGeo ─────────────────────────────────────────────────
  const { data: regions = [], isLoading: loadingRegions } = useRegions()

  const { data: enfants = [], isLoading: loadingEnfants } = useEnfantsGeo(
    value.niveau_principal,
    value.zone_principale?.code ?? '',
  )

  // Calcul de population en temps réel
  const { data: population, isLoading: loadingPopulation } = usePopulationCalcul(
    value.niveau_principal,
    value.zone_principale?.code ?? '',
    value.sous_zones,
  )

  // ── Handlers ───────────────────────────────────────────────────────────────

  // Changer de niveau → tout réinitialiser (zone + sous-zones)
  const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    field.onChange({
      niveau_principal: e.target.value as ContexteGeographique['niveau_principal'],
      zone_principale:  { code: '', nom: '' },
      sous_zones:       { tout_selectionner: false, items: [] },
    })
  }

  // Changer de zone principale → réinitialiser les sous-zones
  const handleZonePrincipaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = regions.find((z) => z.code === e.target.value)
    if (!selected) return
    field.onChange({
      ...value,
      zone_principale: selected,
      sous_zones: {
        tout_selectionner: isTerminal, // FOKONTANY = terminal → tout par défaut
        items: [],
      },
    })
  }

  // Cocher / décocher "Tout sélectionner"
  const handleToutSelectionner = (checked: boolean) => {
    field.onChange({
      ...value,
      sous_zones: {
        tout_selectionner: checked,
        items: [],  // vider les sélections individuelles quand "tout" est coché
      },
    })
  }

  // Cocher / décocher une sous-zone individuelle
  const handleToggleSousZone = (zone: ZoneItem, checked: boolean) => {
    const currentItems = value.sous_zones.items ?? []
    const newItems = checked
      ? [...currentItems, zone]
      : currentItems.filter((z) => z.code !== zone.code)

    field.onChange({
      ...value,
      sous_zones: { tout_selectionner: false, items: newItems },
    })
  }

  // Handler pour GeoHierarchicalNavigator
  const handleNavigationComplete = (resultat: {
    niveau_principal: string
    zone_principale: ZoneItem
    chemin: ZoneItem[]
  }) => {
    const niveauCible = resultat.niveau_principal as ContexteGeographique['niveau_principal']
    const estTerminal = niveauCible === 'FOKONTANY'
    
    field.onChange({
      niveau_principal: niveauCible,
      zone_principale: resultat.zone_principale,
      sous_zones: {
        tout_selectionner: estTerminal, // Seulement auto-sélection si terminal (FOKONTANY)
        items: [],
      },
    })
  }

  const selectedSousCodes = new Set((value.sous_zones.items ?? []).map((z) => z.code))

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">

      {/* Étape 1 — Niveau géographique */}
      <div>
        <label className={cls.label}>Niveau géographique</label>
        <select
          value={value.niveau_principal}
          onChange={handleNiveauChange}
          className={cls.input}
        >
          <option value="REGION">Région</option>
          <option value="DISTRICT">District</option>
          <option value="COMMUNE">Commune</option>
          <option value="FOKONTANY">Fokontany</option>
        </select>
      </div>

      {/* Étape 2 — Zone principale */}
      {useHierarchicalNavigator ? (
        <GeoHierarchicalNavigator
          niveauCible={value.niveau_principal}
          onSelectionComplete={handleNavigationComplete}
          labelCls={cls.label}
          inputCls={cls.input}
        />
      ) : (
        <div>
          <label className={cls.label}>
            {NIVEAU_LABELS[value.niveau_principal]} ciblée *
          </label>
          {loadingRegions ? (
            <div className="flex items-center gap-2 text-[12px] text-zinc-400 py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Chargement…
            </div>
          ) : (
            <select
              value={value.zone_principale?.code ?? ''}
              onChange={handleZonePrincipaleChange}
              className={cls.input}
            >
              <option value="">
                — Sélectionner une {NIVEAU_LABELS[value.niveau_principal].toLowerCase()} —
              </option>
              {regions.map((z) => (
                <option key={z.code} value={z.code}>{z.nom}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Étape 3 — Sous-zones (masquée si terminal ou pas de zone parente) */}
      {aZonePrincipale && !isTerminal && (
        <div className="border border-zinc-100 rounded-xl p-3 space-y-2 bg-zinc-50">

          {/* En-tête */}
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium text-zinc-600">
              {sousLabel} ciblés dans {value.zone_principale.nom}
            </span>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
          </div>

          {loadingEnfants ? (
            <div className="flex items-center gap-2 text-[12px] text-zinc-400 py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Chargement des {sousLabel}…
            </div>
          ) : (
            <>
              {/* Option "Tout sélectionner" */}
              <CheckboxItem
                label={`Tout sélectionner — tous les ${sousLabel} de ${value.zone_principale.nom}`}
                checked={value.sous_zones.tout_selectionner}
                onChange={handleToutSelectionner}
              />

              {/* Liste individuelle — visible seulement si "Tout" n'est pas coché */}
              {!value.sous_zones.tout_selectionner && (
                <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pt-1 border-t border-zinc-200 mt-1">
                  {enfants.map((z) => (
                    <CheckboxItem
                      key={z.code}
                      label={z.nom}
                      checked={selectedSousCodes.has(z.code)}
                      onChange={(checked) => handleToggleSousZone(z, checked)}
                    />
                  ))}
                </div>
              )}

              {/* Feedback quantitatif */}
              {!value.sous_zones.tout_selectionner && (
                <p className="text-[10px] text-zinc-400 pt-1">
                  {selectedSousCodes.size === 0
                    ? `Aucun ${sousLabel.slice(0, -1)} sélectionné — cochez "Tout sélectionner" pour cibler toute la zone.`
                    : `${selectedSousCodes.size} ${sousLabel.slice(0, -1)}${selectedSousCodes.size > 1 ? 's' : ''} sélectionné${selectedSousCodes.size > 1 ? 's' : ''}`
                  }
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Feedback — zone parente manquante */}
      {!aZonePrincipale && (
        <p className="text-[10px] text-amber-500 flex items-center gap-1">
          <span>⚠</span> Sélectionnez une {NIVEAU_LABELS[value.niveau_principal].toLowerCase()} pour continuer.
        </p>
      )}

      {/* Affichage de la population en temps réel */}
      {aZonePrincipale && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-medium text-blue-800">Population estimée</span>
          </div>
          {loadingPopulation ? (
            <div className="flex items-center gap-2 text-[11px] text-blue-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Calcul en cours…
            </div>
          ) : population ? (
            <div className="space-y-1">
              <p className="text-[12px] text-blue-900 font-medium">
                {formatNumber(population.population_2018)} habitants (2018)
              </p>
              <p className="text-[10px] text-blue-600">
                Projection : {formatNumber(population.projection_actuelle)} habitants
              </p>
              <p className="text-[10px] text-blue-500">
                {population.nb_fokontany} fokontany{population.nb_fokontany > 1 ? 's' : ''}
              </p>
            </div>
          ) : (
            <p className="text-[10px] text-blue-400">Données non disponibles</p>
          )}
        </div>
      )}
    </div>
  )
}

// Fonction utilitaire pour formater les nombres
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}
