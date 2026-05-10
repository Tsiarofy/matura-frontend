import { useForm, useFieldArray } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'
import { useRoleLabels } from '@/hooks/useRoleLabels'
import { LABELS_STADE2 } from '@/lib/labelsStades'
import { StepperProgressif, type Etape } from '@/components/ui/StepperProgressif'
import { AideStade2 } from '@/components/stades/AideStade2'
import { useState } from 'react'

interface Props {
  stade: StadeData
  onSave: (d: Record<string, unknown>) => void
  saving: boolean
}

// Mapping des 9 étapes Stade 2 avec leurs dépendances (spec Section 5)
const ETAPES_STADE2: Etape[] = [
  { id: 'probleme',         titre: 'Problème',       dependances: [] },
  { id: 'segments',         titre: 'Segments',        dependances: ['probleme'] },
  { id: 'solution',         titre: 'Solution',        dependances: ['segments'] },
  { id: 'proposition',      titre: 'Proposition',     dependances: ['solution'] },
  { id: 'canaux',           titre: 'Canaux',          dependances: ['proposition'] },
  { id: 'revenus',          titre: 'Revenus',         dependances: ['canaux'] },
  { id: 'couts',            titre: 'Coûts',           dependances: ['revenus'] },
  { id: 'avantage',         titre: 'Avantage',        dependances: ['couts'] },
  { id: 'indicateurs',      titre: 'Indicateurs',     dependances: ['probleme','segments','solution','proposition','canaux','revenus','couts','avantage'] },
]

export function Stade2Form({ stade, onSave, saving }: Props) {
  const { isEntrepreneur } = useRoleLabels()
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const [etapeActive, setEtapeActive] = useState('probleme')
  const [etapesCompletees, setEtapesCompletees] = useState<Set<string>>(new Set())

  const getLabel = (key: keyof typeof LABELS_STADE2) =>
    isEntrepreneur ? LABELS_STADE2[key].entrepreneur : LABELS_STADE2[key].professionnel

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      bloc_probleme: {
        herite_stade1: g<string>('bloc_probleme.herite_stade1', ''),
      },
      bloc_segments_clients: {
        principal: g<string>('bloc_segments_clients.principal', ''),
        secondaire: g<string>('bloc_segments_clients.secondaire', ''),
        premiers_adoptants: g<string>('bloc_segments_clients.premiers_adoptants', ''),
      },
      bloc_solution: {
        fonctionnalites: g<any[]>('bloc_solution.fonctionnalites', [
          { description: '', priorite: 'INDISPENSABLE', resout_probleme_principal: true },
        ]),
      },
      bloc_proposition_valeur: {
        phrase_principale: g<string>('bloc_proposition_valeur.phrase_principale', ''),
        slogan: g<string>('bloc_proposition_valeur.slogan', ''),
      },
      bloc_canaux: g<any[]>('bloc_canaux', [{ canal: '', phase: 'ACQUISITION', cout: 'GRATUIT' }]),
      bloc_avantage_unique: {
        description: g<string>('bloc_avantage_unique.description', ''),
        type: g<string>('bloc_avantage_unique.type', 'SAVOIR_LOCAL'),
      },
      bloc_sources_revenus: g<any[]>('bloc_sources_revenus', [
        { modele: 'ABONNEMENT', description: '', estimation_mensuelle_ar: 0, confiance: 'MOYENNE' },
      ]),
      bloc_structure_couts: g<any[]>('bloc_structure_couts', [
        { categorie: 'PERSONNEL', libelle: '', montant_mensuel_ar: 0, est_fixe: true },
      ]),
      bloc_indicateurs_cles: g<any[]>('bloc_indicateurs_cles', [
        { indicateur: '', valeur_cible: 0, unite: '', echeance_mois: 6 },
      ]),
    },
  })

  const { fields: fonctFields, append: addFonct, remove: remFonct } =
    useFieldArray({ control, name: 'bloc_solution.fonctionnalites' })
  const { fields: canauxFields, append: addCanal, remove: remCanal } =
    useFieldArray({ control, name: 'bloc_canaux' })
  const { fields: revFields, append: addRev, remove: remRev } =
    useFieldArray({ control, name: 'bloc_sources_revenus' })
  const { fields: coutFields, append: addCout, remove: remCout } =
    useFieldArray({ control, name: 'bloc_structure_couts' })
  const { fields: indicFields, append: addIndic, remove: remIndic } =
    useFieldArray({ control, name: 'bloc_indicateurs_cles' })

  const inp = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const sel = cn(inp, 'appearance-none')

  const markComplete = (id: string, next?: string) => {
    setEtapesCompletees(prev => new Set([...prev, id]))
    if (next) setEtapeActive(next)
  }

  // Helper pour afficher/masquer une section selon l'étape active
  const isVisible = (etapeId: string) => {
    const idx = ETAPES_STADE2.findIndex(e => e.id === etapeId)
    const activeIdx = ETAPES_STADE2.findIndex(e => e.id === etapeActive)
    return idx <= activeIdx || etapesCompletees.has(etapeId)
  }

  const isLocked = (etapeId: string) => {
    const etape = ETAPES_STADE2.find(e => e.id === etapeId)
    if (!etape) return true
    return !etape.dependances.every(d => etapesCompletees.has(d)) &&
      etapeId !== 'probleme'
  }

  const SectionWrapper = ({
    etapeId,
    children,
  }: {
    etapeId: string
    children: React.ReactNode
  }) => {
    const locked = isLocked(etapeId)
    const active = etapeActive === etapeId
    return (
      <div className={cn(
        'relative pb-5 border-b border-zinc-100 last:border-0 transition-all',
        locked && 'opacity-40 pointer-events-none select-none',
      )}>
        {locked && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <span className="text-[11px] font-medium text-zinc-500 bg-white px-3 py-1.5 rounded-full shadow border border-zinc-200">
              à remplir progressivement
            </span>
          </div>
        )}
        <div className={cn(locked && 'blur-[1px]')}>{children}</div>
        {active && !locked && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                const idx = ETAPES_STADE2.findIndex(e => e.id === etapeId)
                const next = ETAPES_STADE2[idx + 1]?.id
                markComplete(etapeId, next)
              }}
              className="text-[11px] bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              Valider et continuer →
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(d => onSave(d as Record<string, unknown>))} className="space-y-5">
      {/* Stepper */}
      <StepperProgressif
        etapes={ETAPES_STADE2}
        etapeActive={etapeActive}
        etapesCompletees={etapesCompletees}
        onEtapeChange={setEtapeActive}
      />

      {/* Section 1 — Problème */}
      <SectionWrapper etapeId="probleme">
        <p className="text-[12px] font-medium text-zinc-700 mb-2">
          {getLabel('bloc_probleme')}
        </p>
        <input
          {...register('bloc_probleme.herite_stade1')}
          className={inp}
          placeholder="Décrivez le problème principal hérité du Stade 1..."
        />
      </SectionWrapper>

      {/* Section 2 — Segments clients */}
      <SectionWrapper etapeId="segments">
        <p className="text-[12px] font-medium text-zinc-700 mb-2">
          {getLabel('segment_principal')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">
              {getLabel('segment_principal')} *
            </label>
            <input {...register('bloc_segments_clients.principal')} className={inp} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">
              {getLabel('autres_segments')}
            </label>
            <input {...register('bloc_segments_clients.premiers_adoptants')} className={inp} />
          </div>
        </div>
      </SectionWrapper>

      {/* Section 3 — Solution */}
      <SectionWrapper etapeId="solution">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">{getLabel('solution')}</p>
          <button
            type="button"
            onClick={() => addFonct({ description: '', priorite: 'INDISPENSABLE', resout_probleme_principal: false })}
            className="flex items-center gap-1 text-[11px] text-green-600"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {fonctFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-start mb-2">
            <input
              {...register(`bloc_solution.fonctionnalites.${i}.description`)}
              className={cn(inp, 'flex-1')}
              placeholder="Fonctionnalité..."
            />
            <select {...register(`bloc_solution.fonctionnalites.${i}.priorite`)} className={cn(sel, 'w-36')}>
              <option value="INDISPENSABLE">Must-have</option>
              <option value="NICE_TO_HAVE">Nice-to-have</option>
            </select>
            {fonctFields.length > 1 && (
              <button type="button" onClick={() => remFonct(i)} className="text-red-400 mt-2">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </SectionWrapper>

      {/* Section 4 — Proposition de valeur */}
      <SectionWrapper etapeId="proposition">
        <p className="text-[12px] font-medium text-zinc-700 mb-2">
          {getLabel('proposition_valeur')}
        </p>
        <input
          {...register('bloc_proposition_valeur.phrase_principale')}
          className={inp}
          maxLength={80}
          placeholder="Proposition de valeur unique (max 80 car.)"
        />
        <input
          {...register('bloc_proposition_valeur.slogan')}
          className={cn(inp, 'mt-2')}
          placeholder="Slogan (optionnel)"
        />
      </SectionWrapper>

      {/* Section 5 — Canaux */}
      <SectionWrapper etapeId="canaux">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">{getLabel('canaux')}</p>
          <button
            type="button"
            onClick={() => addCanal({ canal: '', phase: 'ACQUISITION', cout: 'GRATUIT' })}
            className="flex items-center gap-1 text-[11px] text-green-600"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {canauxFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center mb-2">
            <input {...register(`bloc_canaux.${i}.canal`)} className={cn(inp, 'flex-1')} placeholder="Canal..." />
            <select {...register(`bloc_canaux.${i}.phase`)} className={cn(sel, 'w-32')}>
              <option value="NOTORIETE">Notoriété</option>
              <option value="ACQUISITION">Acquisition</option>
              <option value="RETENTION">Rétention</option>
            </select>
            <select {...register(`bloc_canaux.${i}.cout`)} className={cn(sel, 'w-28')}>
              <option value="GRATUIT">Gratuit</option>
              <option value="FAIBLE">Faible</option>
              <option value="MOYEN">Moyen</option>
              <option value="ELEVE">Élevé</option>
            </select>
            {canauxFields.length > 1 && (
              <button type="button" onClick={() => remCanal(i)} className="text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </SectionWrapper>

      {/* Section 6 — Sources de revenus */}
      <SectionWrapper etapeId="revenus">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">{getLabel('sources_revenus')}</p>
          <button
            type="button"
            onClick={() => addRev({ modele: 'ABONNEMENT', description: '', estimation_mensuelle_ar: 0, confiance: 'MOYENNE' })}
            className="flex items-center gap-1 text-[11px] text-green-600"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {revFields.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 grid grid-cols-2 gap-2 mb-2">
            <select {...register(`bloc_sources_revenus.${i}.modele`)} className={sel}>
              {['ABONNEMENT','ACHAT_UNIQUE','COMMISSION','FREEMIUM','B2B_CONTRACT','SUBVENTION','AUTRE'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input {...register(`bloc_sources_revenus.${i}.description`)} className={inp} placeholder="Description" />
            <input
              type="number"
              {...register(`bloc_sources_revenus.${i}.estimation_mensuelle_ar`, { valueAsNumber: true })}
              className={inp}
              placeholder="Estimation Ar/mois"
            />
            <div className="flex gap-2">
              <select {...register(`bloc_sources_revenus.${i}.confiance`)} className={cn(sel, 'flex-1')}>
                <option value="FAIBLE">Faible</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="ELEVEE">Élevée</option>
              </select>
              {revFields.length > 1 && (
                <button type="button" onClick={() => remRev(i)} className="text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </SectionWrapper>

      {/* Section 7 — Structure de coûts */}
      <SectionWrapper etapeId="couts">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">{getLabel('structure_couts')}</p>
          <button
            type="button"
            onClick={() => addCout({ categorie: 'PERSONNEL', libelle: '', montant_mensuel_ar: 0, est_fixe: true })}
            className="flex items-center gap-1 text-[11px] text-green-600"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {coutFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center mb-2">
            <select {...register(`bloc_structure_couts.${i}.categorie`)} className={cn(sel, 'w-32')}>
              {['PERSONNEL','TECH','MARKETING','LOGISTIQUE','LOYER','AUTRE'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input {...register(`bloc_structure_couts.${i}.libelle`)} className={cn(inp, 'flex-1')} placeholder="Libellé" />
            <input
              type="number"
              {...register(`bloc_structure_couts.${i}.montant_mensuel_ar`, { valueAsNumber: true })}
              className={cn(inp, 'w-32')}
              placeholder="Ar/mois"
            />
            {coutFields.length > 1 && (
              <button type="button" onClick={() => remCout(i)} className="text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </SectionWrapper>

      {/* Section 8 — Avantage unique */}
      <SectionWrapper etapeId="avantage">
        <p className="text-[12px] font-medium text-zinc-700 mb-2">
          {getLabel('avantage_unique')}
        </p>
        <textarea
          {...register('bloc_avantage_unique.description')}
          rows={3}
          className={cn(inp, 'resize-none')}
          placeholder="Ce qui vous rend difficile à copier..."
        />
        <select {...register('bloc_avantage_unique.type')} className={cn(sel, 'mt-2')}>
          {['SAVOIR_LOCAL','BREVET','RESEAU','TECHNOLOGIE','MARQUE','AUTRE'].map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
      </SectionWrapper>

      {/* Section 9 — Indicateurs clés */}
      <SectionWrapper etapeId="indicateurs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">{getLabel('indicateurs_cles')}</p>
          <button
            type="button"
            onClick={() => addIndic({ indicateur: '', valeur_cible: 0, unite: '', echeance_mois: 6 })}
            className="flex items-center gap-1 text-[11px] text-green-600"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {indicFields.map((f, i) => (
          <div key={f.id} className="grid grid-cols-4 gap-2 mb-2">
            <input {...register(`bloc_indicateurs_cles.${i}.indicateur`)} className={cn(inp, 'col-span-2')} placeholder="Indicateur" />
            <input
              type="number"
              {...register(`bloc_indicateurs_cles.${i}.valeur_cible`, { valueAsNumber: true })}
              className={inp}
              placeholder="Cible"
            />
            <input
              type="number"
              {...register(`bloc_indicateurs_cles.${i}.echeance_mois`, { valueAsNumber: true })}
              className={inp}
              placeholder="Mois"
            />
          </div>
        ))}
      </SectionWrapper>

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Enregistrer le Stade 2
      </button>
    </form>
  )
}