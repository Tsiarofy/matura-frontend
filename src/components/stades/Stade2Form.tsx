import { useForm, useFieldArray } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'
import { useRoleLabels } from '@/hooks/useRoleLabels'
import { LABELS_STADE2 } from '@/lib/labelsStades'

interface Props { stade: StadeData; onSave: (d: Record<string, unknown>) => void; saving: boolean }

export function Stade2Form({ stade, onSave, saving }: Props) {
  const { isEntrepreneur } = useRoleLabels()
  const d = stade.donnees as Record<string, unknown>
  const get = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const getLabel = (key: keyof typeof LABELS_STADE2) => {
    return isEntrepreneur ? LABELS_STADE2[key].entrepreneur : LABELS_STADE2[key].professionnel
  }

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      bloc_probleme: {
        herite_stade1: (get<Record<string,unknown>>('bloc_probleme', {})).herite_stade1 as string ?? '',
        problemes_supplementaires: (get<Record<string,unknown>>('bloc_probleme', {})).problemes_supplementaires as string[] ?? [''],
      },
      bloc_segments_clients: {
        principal: (get<Record<string,unknown>>('bloc_segments_clients', {})).principal as string ?? '',
        secondaire: (get<Record<string,unknown>>('bloc_segments_clients', {})).secondaire as string ?? '',
        premiers_adoptants: (get<Record<string,unknown>>('bloc_segments_clients', {})).premiers_adoptants as string ?? '',
      },
      bloc_solution: {
        fonctionnalites: (get<Record<string,unknown>>('bloc_solution', {})).fonctionnalites as { description: string; priorite: string; resout_probleme_principal: boolean }[] ?? [{ description: '', priorite: 'INDISPENSABLE', resout_probleme_principal: true }],
      },
      bloc_proposition_valeur: {
        phrase_principale: (get<Record<string,unknown>>('bloc_proposition_valeur', {})).phrase_principale as string ?? '',
        slogan: (get<Record<string,unknown>>('bloc_proposition_valeur', {})).slogan as string ?? '',
      },
      bloc_canaux: get<{ canal: string; phase: string; cout: string }[]>('bloc_canaux', [{ canal: '', phase: 'ACQUISITION', cout: 'GRATUIT' }]),
      bloc_avantage_unique: {
        description: (get<Record<string,unknown>>('bloc_avantage_unique', {})).description as string ?? '',
        type: (get<Record<string,unknown>>('bloc_avantage_unique', {})).type as string ?? 'SAVOIR_LOCAL',
      },
      bloc_sources_revenus: get<{ modele: string; description: string; estimation_mensuelle_ar: number; confiance: string }[]>('bloc_sources_revenus', [{ modele: 'ABONNEMENT', description: '', estimation_mensuelle_ar: 0, confiance: 'MOYENNE' }]),
      bloc_structure_couts: get<{ categorie: string; libelle: string; montant_mensuel_ar: number; est_fixe: boolean }[]>('bloc_structure_couts', [{ categorie: 'PERSONNEL', libelle: '', montant_mensuel_ar: 0, est_fixe: true }]),
      bloc_indicateurs_cles: get<{ indicateur: string; valeur_cible: number; unite: string; echeance_mois: number }[]>('bloc_indicateurs_cles', [{ indicateur: '', valeur_cible: 0, unite: '', echeance_mois: 6 }]),
    },
  })

  const { fields: fonctFields, append: addFonct, remove: remFonct } = useFieldArray({ control, name: 'bloc_solution.fonctionnalites' })
  const { fields: canauxFields, append: addCanal, remove: remCanal } = useFieldArray({ control, name: 'bloc_canaux' })
  const { fields: revFields, append: addRev, remove: remRev } = useFieldArray({ control, name: 'bloc_sources_revenus' })
  const { fields: coutFields, append: addCout, remove: remCout } = useFieldArray({ control, name: 'bloc_structure_couts' })

  const inp = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const sel = cn(inp, 'appearance-none')
  const sec = 'space-y-3 pb-5 border-b border-zinc-100 last:border-0'
  const blocTitle = (letter: string, title: string) => (
    <p className="text-[12px] font-medium text-zinc-700 flex items-center gap-2 mb-2">
      <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium flex items-center justify-center">{letter}</span>
      {title}
    </p>
  )

  return (
    <form onSubmit={handleSubmit((data) => onSave(data as Record<string, unknown>))} className="space-y-5">

      {/* Problème */}
      <div className={sec}>
        {blocTitle('1', getLabel('bloc_probleme'))}
        <div>
          <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('bloc_probleme')}</label>
          <input {...register('bloc_probleme.herite_stade1')} className={inp} placeholder="Décrivez le problème principal..." />
        </div>
      </div>

      {/* Segments */}
      <div className={sec}>
        {blocTitle('2', getLabel('segment_principal'))}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('segment_principal')} *</label>
            <input {...register('bloc_segments_clients.principal')} className={inp} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('autres_segments')} *</label>
            <input {...register('bloc_segments_clients.premiers_adoptants')} className={inp} />
          </div>
        </div>
      </div>

      {/* Solution */}
      <div className={sec}>
        <div className="flex items-center justify-between">
          {blocTitle('3', getLabel('solution'))}
          <button type="button" onClick={() => addFonct({ description: '', priorite: 'INDISPENSABLE', resout_probleme_principal: false })}
            className="flex items-center gap-1 text-[11px] text-green-600">
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        {fonctFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-start">
            <input {...register(`bloc_solution.fonctionnalites.${i}.description`)} className={cn(inp, 'flex-1')} placeholder="Fonctionnalité..." />
            <select {...register(`bloc_solution.fonctionnalites.${i}.priorite`)} className={cn(sel, 'w-36')}>
              <option value="INDISPENSABLE">Must-have</option>
              <option value="NICE_TO_HAVE">Nice-to-have</option>
            </select>
            {fonctFields.length > 1 && (
              <button type="button" onClick={() => remFonct(i)} className="text-red-400 mt-2"><Trash2 className="w-3.5 h-3.5" /></button>
            )}
          </div>
        ))}
      </div>

      {/* Proposition de valeur */}
      <div className={sec}>
        {blocTitle('4', getLabel('proposition_valeur'))}
        <div>
          <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('proposition_valeur')} * (max 80 car.)</label>
          <input {...register('bloc_proposition_valeur.phrase_principale')} className={inp} maxLength={80} />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 block mb-1">Slogan (optionnel)</label>
          <input {...register('bloc_proposition_valeur.slogan')} className={inp} />
        </div>
      </div>

      {/* Canaux */}
      <div className={sec}>
        <div className="flex items-center justify-between">
          {blocTitle('5', getLabel('canaux'))}
          <button type="button" onClick={() => addCanal({ canal: '', phase: 'ACQUISITION', cout: 'GRATUIT' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {canauxFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
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
            {canauxFields.length > 1 && <button type="button" onClick={() => remCanal(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

      {/* Sources de revenus */}
      <div className={sec}>
        <div className="flex items-center justify-between">
          {blocTitle('8', getLabel('sources_revenus'))}
          <button type="button" onClick={() => addRev({ modele: 'ABONNEMENT', description: '', estimation_mensuelle_ar: 0, confiance: 'MOYENNE' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {revFields.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 grid grid-cols-2 gap-2">
            <select {...register(`bloc_sources_revenus.${i}.modele`)} className={sel}>
              {['ABONNEMENT','ACHAT_UNIQUE','COMMISSION','FREEMIUM','B2B_CONTRACT','SUBVENTION','AUTRE'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input {...register(`bloc_sources_revenus.${i}.description`)} className={inp} placeholder="Description" />
            <input type="number" {...register(`bloc_sources_revenus.${i}.estimation_mensuelle_ar`, { valueAsNumber: true })} className={inp} placeholder="Estimation Ar/mois" />
            <div className="flex gap-2">
              <select {...register(`bloc_sources_revenus.${i}.confiance`)} className={cn(sel, 'flex-1')}>
                <option value="FAIBLE">Faible</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="ELEVEE">Élevée</option>
              </select>
              {revFields.length > 1 && <button type="button" onClick={() => remRev(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          </div>
        ))}
      </div>

      {/* Structure de coûts */}
      <div className={sec}>
        <div className="flex items-center justify-between">
          {blocTitle('9', getLabel('structure_couts'))}
          <button type="button" onClick={() => addCout({ categorie: 'PERSONNEL', libelle: '', montant_mensuel_ar: 0, est_fixe: true })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {coutFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <select {...register(`bloc_structure_couts.${i}.categorie`)} className={cn(sel, 'w-32')}>
              {['PERSONNEL','TECH','MARKETING','LOGISTIQUE','LOYER','AUTRE'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input {...register(`bloc_structure_couts.${i}.libelle`)} className={cn(inp, 'flex-1')} placeholder="Libellé" />
            <input type="number" {...register(`bloc_structure_couts.${i}.montant_mensuel_ar`, { valueAsNumber: true })} className={cn(inp, 'w-32')} placeholder="Ar/mois" />
            {coutFields.length > 1 && <button type="button" onClick={() => remCout(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Enregistrer le Stade 2
      </button>
    </form>
  )
}
