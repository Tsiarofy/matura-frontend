import { useForm, useFieldArray, useWatch, useController } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2, MapPin, Check } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'
import { REGIONS_MADAGASCAR } from '@/lib/constants'

interface Props { stade: StadeData; onSave: (d: Record<string, unknown>) => void; saving: boolean }

// ─── GEO DATA ─────────────────────────────────────────────────────────────────
// These would normally come from your API/constants, but we structure them
// so each level maps to its list of { code, nom } entries.
// Regions use the existing REGIONS_MADAGASCAR constant (treated as both code and nom).
// Districts / Communes / Fokontany would come from your DonneesGeographiques table.

type GeoOption = { code: string; nom: string }

// Adapt this to your real data source. For now we derive from REGIONS_MADAGASCAR.
const GEO_BY_LEVEL: Record<string, GeoOption[]> = {
  REGION: REGIONS_MADAGASCAR.map((r) => ({ code: r, nom: r })),
  // TODO: replace these with real district/commune/fokontany data from your API
  DISTRICT: REGIONS_MADAGASCAR.map((r) => ({ code: `DIST_${r}`, nom: `District de ${r}` })),
  COMMUNE: REGIONS_MADAGASCAR.map((r) => ({ code: `COM_${r}`, nom: `Commune de ${r}` })),
  FOKONTANY: REGIONS_MADAGASCAR.map((r) => ({ code: `FOK_${r}`, nom: `Fokontany de ${r}` })),
}

// ─── GEO CHECKBOX GROUP ───────────────────────────────────────────────────────
interface GeoCheckboxGroupProps {
  options: GeoOption[]
  selectedCodes: string[]
  selectedNoms: string[]
  onChange: (codes: string[], noms: string[]) => void
}

function GeoCheckboxGroup({ options, selectedCodes, selectedNoms, onChange }: GeoCheckboxGroupProps) {
  const toggle = (opt: GeoOption) => {
    const alreadySelected = selectedCodes.includes(opt.code)
    if (alreadySelected) {
      onChange(
        selectedCodes.filter((c) => c !== opt.code),
        selectedNoms.filter((n) => n !== opt.nom),
      )
    } else {
      onChange([...selectedCodes, opt.code], [...selectedNoms, opt.nom])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
      {options.map((opt) => {
        const checked = selectedCodes.includes(opt.code)
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] text-left transition-all border',
              checked
                ? 'bg-green-50 border-green-400 text-green-800 font-medium'
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
            <span className="truncate">{opt.nom}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── FORM ─────────────────────────────────────────────────────────────────────
export function Stade1Form({ stade, onSave, saving }: Props) {
  const donnees = stade.donnees as Record<string, unknown>
  const geo = (donnees.contexte_geographique as Record<string, unknown>) ?? {}

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      enonce_probleme: (donnees.enonce_probleme as string) ?? '',
      profil_affecte: {
        description: ((donnees.profil_affecte as Record<string, unknown>)?.description as string) ?? '',
        region: ((donnees.profil_affecte as Record<string, unknown>)?.region as string) ?? '',
        urbanite: ((donnees.profil_affecte as Record<string, unknown>)?.urbanite as string) ?? 'URBAIN',
        nombre_estime: ((donnees.profil_affecte as Record<string, unknown>)?.nombre_estime as number) ?? 0,
        frequence: ((donnees.profil_affecte as Record<string, unknown>)?.frequence as string) ?? 'MENSUEL',
      },
      intensite_probleme: {
        cout_actuel_ar: ((donnees.intensite_probleme as Record<string, unknown>)?.cout_actuel_ar as number) ?? 0,
        unite: ((donnees.intensite_probleme as Record<string, unknown>)?.unite as string) ?? 'AR_PAR_MOIS',
        severite: ((donnees.intensite_probleme as Record<string, unknown>)?.severite as number) ?? 3,
      },
      observations_terrain: {
        observe_directement: ((donnees.observations_terrain as Record<string, unknown>)?.observe_directement as boolean) ?? false,
        nb_personnes_interrogees: ((donnees.observations_terrain as Record<string, unknown>)?.nb_personnes_interrogees as number) ?? 0,
        methode: ((donnees.observations_terrain as Record<string, unknown>)?.methode as string) ?? 'EN_FACE',
        verbatims: ((donnees.observations_terrain as Record<string, unknown>)?.verbatims as string[]) ?? ['', ''],
      },
      solutions_existantes: (donnees.solutions_existantes as { nom: string; type: string; pourquoi_insuffisante: string; satisfaction_utilisateur: number }[]) ??
        [{ nom: '', type: 'FORMELLE', pourquoi_insuffisante: '', satisfaction_utilisateur: 3 }],
      contexte_geographique: {
        niveau_principal: (geo.niveau_principal as string) ?? 'REGION',
        codes_selectionnes: (geo.codes_selectionnes as string[]) ?? [],
        noms_selectionnes: (geo.noms_selectionnes as string[]) ?? [],
      },
    },
  })

  const { fields: solFields, append: addSol, remove: remSol } = useFieldArray({ control, name: 'solutions_existantes' })

  // ── Geo: watch level to filter options ──────────────────────────────────────
  const niveauPrincipal = watch('contexte_geographique.niveau_principal')
  const geoOptions = GEO_BY_LEVEL[niveauPrincipal] ?? GEO_BY_LEVEL.REGION

  // Controller for codes_selectionnes & noms_selectionnes (arrays, need manual control)
  const { field: codesField } = useController({ control, name: 'contexte_geographique.codes_selectionnes' })
  const { field: nomsField } = useController({ control, name: 'contexte_geographique.noms_selectionnes' })

  // When level changes, clear previously selected zones (they belong to another level)
  const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNiveau = e.target.value
    // Clear selections when switching level — zones from different levels don't mix
    codesField.onChange([])
    nomsField.onChange([])
    // Let RHF handle the niveau field via register normally
  }

  const handleGeoChange = (codes: string[], noms: string[]) => {
    codesField.onChange(codes)
    nomsField.onChange(noms)
  }

  const onSubmit = (data: unknown) => onSave(data as Record<string, unknown>)

  // ── Styles ──────────────────────────────────────────────────────────────────
  const inputCls = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const labelCls = 'block text-[11px] text-zinc-500 mb-1'
  const sectionCls = 'space-y-3 pb-5 border-b border-zinc-100 last:border-0'
  const selectCls = cn(inputCls, 'appearance-none')

  const selectedCodes = codesField.value as string[]
  const selectedNoms = nomsField.value as string[]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* A — Problème */}
      <div className={sectionCls}>
        <p className="text-[12px] font-medium text-zinc-700 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] flex items-center justify-center">A</span>
          Définition du problème
        </p>
        <div>
          <label className={labelCls}>Énoncé du problème * (20-200 car.)</label>
          <textarea {...register('enonce_probleme')} rows={3} className={cn(inputCls, 'resize-none')} placeholder="Décrivez le problème observé..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Description du profil affecté *</label>
            <input {...register('profil_affecte.description')} className={inputCls} placeholder="Agriculteurs de la région..." />
          </div>
          <div>
            <label className={labelCls}>Région</label>
            <select {...register('profil_affecte.region')} className={selectCls}>
              {REGIONS_MADAGASCAR.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Urbanité</label>
            <select {...register('profil_affecte.urbanite')} className={selectCls}>
              <option value="URBAIN">Urbain</option>
              <option value="PERI_URBAIN">Péri-urbain</option>
              <option value="RURAL">Rural</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Fréquence du problème</label>
            <select {...register('profil_affecte.frequence')} className={selectCls}>
              <option value="QUOTIDIEN">Quotidien</option>
              <option value="HEBDOMADAIRE">Hebdomadaire</option>
              <option value="MENSUEL">Mensuel</option>
              <option value="OCCASIONNEL">Occasionnel</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Nombre estimé de personnes</label>
            <input type="number" {...register('profil_affecte.nombre_estime', { valueAsNumber: true })} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Coût actuel (Ar)</label>
            <input type="number" {...register('intensite_probleme.cout_actuel_ar', { valueAsNumber: true })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Unité</label>
            <select {...register('intensite_probleme.unite')} className={selectCls}>
              <option value="AR_PAR_MOIS">Ar/mois</option>
              <option value="HEURES_PAR_SEMAINE">Heures/sem.</option>
              <option value="AR_PAR_TRANSACTION">Ar/transaction</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Sévérité (1-5) : {watch('intensite_probleme.severite')}</label>
            <input type="range" min={1} max={5} {...register('intensite_probleme.severite', { valueAsNumber: true })} className="w-full accent-green-600" />
          </div>
        </div>
      </div>

      {/* B — Terrain */}
      <div className={sectionCls}>
        <p className="text-[12px] font-medium text-zinc-700 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] flex items-center justify-center">B</span>
          Validation terrain
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Nb personnes interrogées *</label>
            <input type="number" {...register('observations_terrain.nb_personnes_interrogees', { valueAsNumber: true })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Méthode</label>
            <select {...register('observations_terrain.methode')} className={selectCls}>
              <option value="EN_FACE">En face à face</option>
              <option value="TELEPHONE">Téléphone</option>
              <option value="INFORMEL">Informel</option>
              <option value="OBSERVATION">Observation</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="obs" {...register('observations_terrain.observe_directement')} className="w-4 h-4 accent-green-600" />
          <label htmlFor="obs" className="text-[12px] text-zinc-600">J'ai observé le problème directement</label>
        </div>
        <div>
          <label className={labelCls}>Verbatims (min. 2, max. 5) *</label>
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <input key={i} {...register(`observations_terrain.verbatims.${i}`)} className={inputCls} placeholder={`Verbatim ${i + 1}...`} />
            ))}
          </div>
        </div>
      </div>

      {/* C — Solutions existantes */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] flex items-center justify-center">C</span>
            Solutions existantes
          </p>
          <button
            type="button"
            onClick={() => addSol({ nom: '', type: 'FORMELLE', pourquoi_insuffisante: '', satisfaction_utilisateur: 3 })}
            className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {solFields.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">Solution {i + 1}</span>
              {solFields.length > 1 && (
                <button type="button" onClick={() => remSol(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input {...register(`solutions_existantes.${i}.nom`)} className={inputCls} placeholder="Nom de la solution" />
              <select {...register(`solutions_existantes.${i}.type`)} className={selectCls}>
                <option value="FORMELLE">Formelle</option>
                <option value="INFORMELLE">Informelle</option>
                <option value="BRICOLAGE">Bricolage</option>
                <option value="RIEN">Rien</option>
              </select>
            </div>
            <input {...register(`solutions_existantes.${i}.pourquoi_insuffisante`)} className={inputCls} placeholder="Pourquoi insuffisante ?" />
          </div>
        ))}
      </div>

      {/* D — Géographie */}
      <div className={sectionCls}>
        <p className="text-[12px] font-medium text-zinc-700 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] flex items-center justify-center">D</span>
          Contexte géographique
        </p>

        {/* Level selector — onChange clears zones */}
        <div>
          <label className={labelCls}>Niveau principal</label>
          <select
            {...register('contexte_geographique.niveau_principal')}
            className={selectCls}
            onChange={handleNiveauChange}
          >
            <option value="REGION">Région</option>
            <option value="DISTRICT">District</option>
            <option value="COMMUNE">Commune</option>
            <option value="FOKONTANY">Fokontany</option>
          </select>
        </div>

        {/* Zone checkboxes — rendered according to selected level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={cn(labelCls, 'mb-0')}>
              Zone(s) sélectionnée(s) *
            </label>
            {selectedCodes.length > 0 && (
              <span className="text-[10px] text-green-600 font-medium">
                {selectedCodes.length} sélectionnée{selectedCodes.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Pill summary of selected zones */}
          {selectedNoms.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedNoms.map((nom, idx) => (
                <span
                  key={selectedCodes[idx]}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-[10px] font-medium"
                >
                  <MapPin className="w-2.5 h-2.5" />
                  {nom}
                  <button
                    type="button"
                    onClick={() => handleGeoChange(
                      selectedCodes.filter((_, i) => i !== idx),
                      selectedNoms.filter((_, i) => i !== idx),
                    )}
                    className="ml-0.5 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <GeoCheckboxGroup
            options={geoOptions}
            selectedCodes={selectedCodes}
            selectedNoms={selectedNoms}
            onChange={handleGeoChange}
          />

          {selectedCodes.length === 0 && (
            <p className="text-[10px] text-amber-500 mt-1.5 flex items-center gap-1">
              <span>⚠</span> Sélectionnez au moins une zone pour valider cette section.
            </p>
          )}
        </div>
      </div>

      {/* Save */}
      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Enregistrer le Stade 1
      </button>
    </form>
  )
}
