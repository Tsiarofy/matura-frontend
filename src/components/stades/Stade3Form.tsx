// maturproj-frontend/src/components/stades/Stade3Form.tsx
// Formulaire Stade 3 — Validation Marché (Refonte BRL dynamique)
//
// Changements clés par rapport à la version précédente :
// 1. Hérite du `type_cible` du projet (B2B, B2C, B2B2C)
// 2. B2C : base TAM auto-alimentée par GeoService (population projetée)
//    B2B/B2B2C : champ manuel "Taille estimée de votre marché cible"
// 3. Calculs temps réel via useCalculMarche (0ms, pas d'appel API)
// 4. Alertes visuelles de réalisme BRL
// 5. Sauvegarde du JSON calculs_informatifs dans la mutation
// 6. StepperProgressif pour navigation intra-formulaire avec invalidation

import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2, AlertTriangle, Info, Building2, Users } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'
import { useCalculMarche } from '@/hooks/useCalculMarche'
import { useRoleLabels } from '@/hooks/useRoleLabels'
import { useProjetDetail } from '@/hooks/useStades'
import { StepperProgressif, type StepDefinition } from '@/components/ui/StepperProgressif'

interface Props {
  stade: StadeData
  projetId: string
  onSave: (d: Record<string, unknown>) => void
  saving: boolean
  /** Population projetée issue du GeoService (Stade 1) — utilisée en B2C */
  populationProjetee?: number
}

// ─── STEPS DU FORMULAIRE ─────────────────────────────────────────

const STEPS: StepDefinition[] = [
  { id: 'marche', label: 'Taille marché', dependsOn: [] },
  { id: 'enquete', label: 'Enquête', dependsOn: [] },
  { id: 'concurrents', label: 'Concurrents', dependsOn: ['marche'] },
  { id: 'prix', label: 'Positionnement prix', dependsOn: [] },
  { id: 'sources', label: 'Sources', dependsOn: [] },
]

export function Stade3Form({ stade, onSave, saving, projetId, populationProjetee }: Props) {
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def
  const labels = useRoleLabels()

  // Récupérer le type_cible du projet
  const { data: projet } = useProjetDetail(projetId)
  const typeCible = (projet?.type_cible ?? 'B2C') as 'B2B' | 'B2C' | 'B2B2C'
  const isB2C = typeCible === 'B2C'

  // Stepper state
  const [activeStep, setActiveStep] = useState('marche')
  const [dirtySteps, setDirtySteps] = useState<Set<string>>(new Set())

  const existingTailleMarche = g<Record<string, unknown>>('taille_marche', {})

  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      taille_marche: {
        population_reference: (existingTailleMarche.population_reference as number) ?? (populationProjetee ?? 0),
        // En B2B: ce champ est la saisie manuelle de l'estimation
        // En B2C: ce champ est pré-rempli par le GeoService (lecture seule)
        tam: { valeur: 0, unite: 'PERSONNES' as const, source: '' },
        part_concurrents_pct: 0,
        sam: { valeur: 0, taux_penetration_pct: 0, justification: '' },
        som: { valeur: 0, delai_mois: 12, justification: '' },
        ...existingTailleMarche,
      },
      enquete: {
        taille_echantillon: 0,
        methode: 'EN_FACE' as const,
        regions_couvertes: [''],
        taux_reponse_positive: 0,
        wtp_moyen_ar: 0,
        ...g<Record<string, unknown>>('enquete', {}),
      },
      concurrents: g<{
        nom: string; type: string; forces: string[]; faiblesses: string[];
        prix_estime_ar: number; part_marche_estimee_pct: number; votre_differentiation: string
      }[]>('concurrents', [
        { nom: '', type: 'DIRECT', forces: [''], faiblesses: [''], prix_estime_ar: 0, part_marche_estimee_pct: 0, votre_differentiation: '' },
      ]),
      positionnement_prix: {
        prix_min_acceptable_ar: 0,
        prix_max_acceptable_ar: 0,
        prix_recommande_ar: 0,
        modele_prix: 'UNITE' as const,
        irp: { revenu_moyen_zone_ar: 0, frequence_achat: 'MENSUEL' as const },
        ...g<Record<string, unknown>>('positionnement_prix', {}),
      },
      sources_marche: g<{ type: string; titre: string; annee: number; url: string; donnee_utilisee: string }[]>('sources_marche', [
        { type: 'INSTAT', titre: '', annee: 2024, url: '', donnee_utilisee: '' },
      ]),
    },
  })

  // ── Watch pour calculs temps réel ────────────────────────────────
  const watchedTailleMarche = useWatch({ control, name: 'taille_marche' })
  const watchedConcurrents = useWatch({ control, name: 'concurrents' })

  const baseTotale = watchedTailleMarche?.population_reference ?? 0
  const samValeur = watchedTailleMarche?.sam?.valeur ?? 0
  const somValeur = watchedTailleMarche?.som?.valeur ?? 0

  // Extraire les parts de marché concurrents
  const partsConcurrents = useMemo(() =>
    (watchedConcurrents ?? []).map((c) => c?.part_marche_estimee_pct ?? 0),
    [watchedConcurrents]
  )

  // Hook de calcul marché temps réel (0ms)
  const calculsMarche = useCalculMarche(typeCible, baseTotale, partsConcurrents, samValeur, somValeur)

  // ── Field arrays ────────────────────────────────────────────────
  const { fields: concFields, append: addConc, remove: remConc } = useFieldArray({ control, name: 'concurrents' })
  const { fields: srcFields, append: addSrc, remove: remSrc } = useFieldArray({ control, name: 'sources_marche' })

  // ── Stepper handlers ────────────────────────────────────────────
  const handleInvalidate = useCallback((invalidatedIds: string[]) => {
    // Ici on pourrait reset les champs des étapes invalidées
    // Pour l'instant on signale visuellement
    console.info('[StepperProgressif] Étapes invalidées:', invalidatedIds)
  }, [])

  // ── Sauvegarde avec calculs_informatifs ─────────────────────────
  const onSubmit = handleSubmit((data) => {
    // Injecter les calculs informatifs dans les données envoyées au backend
    const payload: Record<string, unknown> = {
      ...data,
      // Les calculs sont enregistrés séparément dans calculs_informatifs
      _calculs_informatifs: calculsMarche ? {
        stade_3: calculsMarche,
      } : undefined,
    }
    onSave(payload)
  })

  // ── Styles ──────────────────────────────────────────────────────
  const inp = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const sel = cn(inp, 'appearance-none')
  const sec = 'space-y-3 pb-5 border-b border-zinc-100 last:border-0'

  return (
    <form onSubmit={onSubmit} className="space-y-5">

      {/* Stepper Progressif */}
      <StepperProgressif
        steps={STEPS}
        activeStep={activeStep}
        onStepChange={setActiveStep}
        onInvalidate={handleInvalidate}
        dirtySteps={dirtySteps}
        className="mb-4"
      />

      {/* ── Indicateur B2B/B2C ─────────────────────────────────────── */}
      <div className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium',
        isB2C ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100',
      )}>
        {isB2C ? <Users className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
        <span>
          Projet {typeCible} — {isB2C ? 'Base marché automatique (GeoService)' : 'Base marché déclarative (estimation manuelle)'}
        </span>
      </div>

      {/* ── TAM/SAM/SOM ────────────────────────────────────────────── */}
      <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">{labels.taille_marche}</p>

        {/* Base de marché : B2C auto / B2B manuel */}
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">{labels.base_marche_label}</p>
          {isB2C ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                {...register('taille_marche.population_reference', { valueAsNumber: true })}
                className={cn(inp, 'bg-zinc-100 cursor-not-allowed')}
                readOnly
              />
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">
                Auto — GeoService
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="number"
                {...register('taille_marche.population_reference', { valueAsNumber: true })}
                className={inp}
                placeholder="Nombre estimé d'entreprises / organisations cibles dans votre zone"
                onChange={(e) => {
                  setDirtySteps(prev => new Set(prev).add('marche'))
                }}
              />
              <p className="text-[10px] text-amber-600 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Estimation déclarative — L'investisseur sera informé que ce chiffre est une estimation.
              </p>
            </div>
          )}
        </div>

        {/* TAM */}
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">TAM — Marché total adressable</p>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" {...register('taille_marche.tam.valeur', { valueAsNumber: true })} className={inp} placeholder="Valeur" />
            <select {...register('taille_marche.tam.unite')} className={sel}>
              <option value="PERSONNES">Personnes</option>
              <option value="AR_PAR_AN">Ar/an</option>
            </select>
            <input {...register('taille_marche.tam.source')} className={inp} placeholder="Source" />
          </div>
        </div>

        {/* Part concurrents */}
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">Part de marché occupée par les concurrents (%)</p>
          <input
            type="number"
            {...register('taille_marche.part_concurrents_pct', { valueAsNumber: true })}
            className={inp}
            min={0} max={100}
            placeholder="Total parts de marché concurrents (%)"
          />
        </div>

        {/* SAM */}
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">{labels.sam_label}</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" {...register('taille_marche.sam.valeur', { valueAsNumber: true })} className={inp} placeholder="Valeur" />
            <input type="number" {...register('taille_marche.sam.taux_penetration_pct', { valueAsNumber: true })} className={inp} placeholder="Taux pénétration %" />
          </div>
          <input {...register('taille_marche.sam.justification')} className={inp} placeholder="Justification" />
        </div>

        {/* SOM */}
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">{labels.som_label}</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" {...register('taille_marche.som.valeur', { valueAsNumber: true })} className={inp} placeholder="Valeur" />
            <input type="number" {...register('taille_marche.som.delai_mois', { valueAsNumber: true })} className={inp} placeholder="Délai (mois)" />
          </div>
          <input {...register('taille_marche.som.justification')} className={inp} placeholder="Justification" />
        </div>

        {/* ── CALCULS TEMPS RÉEL ──────────────────────────────────── */}
        {calculsMarche && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-3">
            <p className="text-[11px] font-semibold text-green-800 uppercase tracking-wider">Indicateurs marché (temps réel)</p>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div className="flex justify-between">
                <span className="text-zinc-600">Marché occupé (concurrents)</span>
                <span className="font-medium text-zinc-800">{calculsMarche.occupee_concurrents.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Marché disponible</span>
                <span className="font-medium text-green-700">{calculsMarche.disponible.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">SAM / Marché libre</span>
                <span className="font-medium text-zinc-800">{calculsMarche.sam_pct_disponible.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">SOM / Marché libre</span>
                <span className={cn('font-medium', calculsMarche.som_pct_disponible > 20 ? 'text-red-600' : calculsMarche.som_pct_disponible > 5 ? 'text-amber-600' : 'text-green-700')}>
                  {calculsMarche.som_pct_disponible.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-zinc-600">Source données marché</span>
                <span className={cn('text-[11px] px-2 py-0.5 rounded-full font-medium',
                  calculsMarche.source_base === 'GEOSERVICE' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700',
                )}>
                  {calculsMarche.source_base === 'GEOSERVICE' ? '✓ GeoService (validé)' : '⚠ Déclaratif (estimation)'}
                </span>
              </div>
            </div>

            {/* Alertes de réalisme */}
            {calculsMarche.alertes_ignorees.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {calculsMarche.alertes_ignorees.map((alerte, i) => (
                  <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-700 font-medium">{alerte}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Enquête ────────────────────────────────────────────────── */}
      <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">{labels.enquete}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Taille échantillon *</label>
            <input type="number" {...register('enquete.taille_echantillon', { valueAsNumber: true })} className={inp} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Méthode</label>
            <select {...register('enquete.methode')} className={sel}>
              <option value="EN_FACE">En face</option><option value="TELEPHONE">Téléphone</option>
              <option value="EN_LIGNE">En ligne</option><option value="MIXTE">Mixte</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Taux réponse positive (%)</label>
            <input type="number" {...register('enquete.taux_reponse_positive', { valueAsNumber: true })} className={inp} min={0} max={100} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Prix moyen acceptable (Ar)</label>
            <input type="number" {...register('enquete.wtp_moyen_ar', { valueAsNumber: true })} className={inp} />
          </div>
        </div>
      </div>

      {/* ── Positionnement prix + IRP ──────────────────────────────── */}
      <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">{labels.positionnement_prix}</p>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" {...register('positionnement_prix.prix_min_acceptable_ar', { valueAsNumber: true })} className={inp} placeholder="Prix min (Ar)" />
          <input type="number" {...register('positionnement_prix.prix_recommande_ar', { valueAsNumber: true })} className={inp} placeholder="Prix recommandé (Ar)" />
          <input type="number" {...register('positionnement_prix.prix_max_acceptable_ar', { valueAsNumber: true })} className={inp} placeholder="Prix max (Ar)" />
        </div>
        <select {...register('positionnement_prix.modele_prix')} className={sel}>
          {['UNITE', 'ABONNEMENT_MENSUEL', 'ABONNEMENT_ANNUEL', 'COMMISSION_PCT', 'PALIERS'].map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
        </select>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-blue-700 font-medium">IRP — Indice de Réalisme Prix</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" {...register('positionnement_prix.irp.revenu_moyen_zone_ar', { valueAsNumber: true })} className={inp} placeholder="Revenu moyen zone (Ar)" />
            <select {...register('positionnement_prix.irp.frequence_achat')} className={sel}>
              <option value="UNIQUE">Unique</option><option value="MENSUEL">Mensuel</option>
              <option value="HEBDOMADAIRE">Hebdomadaire</option><option value="QUOTIDIEN">Quotidien</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Concurrents ────────────────────────────────────────────── */}
      <div className={sec}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">{labels.concurrents} (min. 3)</p>
          <button type="button" onClick={() => addConc({ nom: '', type: 'DIRECT', forces: [''], faiblesses: [''], prix_estime_ar: 0, part_marche_estimee_pct: 0, votre_differentiation: '' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {concFields.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">Concurrent {i + 1}</span>
              {concFields.length > 1 && <button type="button" onClick={() => remConc(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input {...register(`concurrents.${i}.nom`)} className={inp} placeholder="Nom concurrent" />
              <select {...register(`concurrents.${i}.type`)} className={sel}>
                <option value="DIRECT">Direct</option><option value="INDIRECT">Indirect</option><option value="SUBSTITUT">Substitut</option>
              </select>
            </div>
            <input {...register(`concurrents.${i}.votre_differentiation`)} className={inp} placeholder="Votre différenciation vs ce concurrent" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" {...register(`concurrents.${i}.prix_estime_ar`, { valueAsNumber: true })} className={inp} placeholder="Prix estimé (Ar)" />
              <input type="number" {...register(`concurrents.${i}.part_marche_estimee_pct`, { valueAsNumber: true })} className={inp} placeholder="Part marché (%)" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Sources ────────────────────────────────────────────────── */}
      <div className={sec}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">Sources de données (min. 1)</p>
          <button type="button" onClick={() => addSrc({ type: 'INSTAT', titre: '', annee: 2024, url: '', donnee_utilisee: '' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {srcFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <select {...register(`sources_marche.${i}.type`)} className={cn(sel, 'w-28')}>
              {['INSTAT', 'EDBM', 'GEM', 'HABAKA', 'BANQUE_MONDIALE', 'UPLOAD', 'EXTERNE'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input {...register(`sources_marche.${i}.titre`)} className={cn(inp, 'flex-1')} placeholder="Titre de la source" />
            <input type="number" {...register(`sources_marche.${i}.annee`, { valueAsNumber: true })} className={cn(inp, 'w-20')} placeholder="Année" />
            {srcFields.length > 1 && <button type="button" onClick={() => remSrc(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Enregistrer le Stade 3
      </button>
    </form>
  )
}
