import { useForm, useFieldArray } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'

interface Props { stade: StadeData; onSave: (d: Record<string, unknown>) => void; saving: boolean }

export function Stade3Form({ stade, onSave, saving }: Props) {
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      taille_marche: {
        tam: { valeur: 0, unite: 'PERSONNES', source: '' },
        part_concurrents_pct: 0,
        sam: { valeur: 0, taux_penetration_pct: 0, justification: '' },
        som: { valeur: 0, delai_mois: 12, justification: '' },
        ...g<Record<string,unknown>>('taille_marche', {}),
      },
      enquete: {
        taille_echantillon: 0,
        methode: 'EN_FACE',
        regions_couvertes: [''],
        taux_reponse_positive: 0,
        wtp_moyen_ar: 0,
        ...g<Record<string,unknown>>('enquete', {}),
      },
      concurrents: g<{ nom: string; type: string; forces: string[]; faiblesses: string[]; prix_estime_ar: number; part_marche_estimee_pct: number; votre_differentiation: string }[]>('concurrents', [
        { nom: '', type: 'DIRECT', forces: [''], faiblesses: [''], prix_estime_ar: 0, part_marche_estimee_pct: 0, votre_differentiation: '' },
      ]),
      positionnement_prix: {
        prix_min_acceptable_ar: 0,
        prix_max_acceptable_ar: 0,
        prix_recommande_ar: 0,
        modele_prix: 'UNITE',
        irp: { revenu_moyen_zone_ar: 0, frequence_achat: 'MENSUEL' },
        ...g<Record<string,unknown>>('positionnement_prix', {}),
      },
      sources_marche: g<{ type: string; titre: string; annee: number; url: string; donnee_utilisee: string }[]>('sources_marche', [
        { type: 'INSTAT', titre: '', annee: 2024, url: '', donnee_utilisee: '' },
      ]),
    },
  })

  const { fields: concFields, append: addConc, remove: remConc } = useFieldArray({ control, name: 'concurrents' })
  const { fields: srcFields, append: addSrc, remove: remSrc } = useFieldArray({ control, name: 'sources_marche' })

  const inp = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const sel = cn(inp, 'appearance-none')
  const sec = 'space-y-3 pb-5 border-b border-zinc-100 last:border-0'

  return (
    <form onSubmit={handleSubmit((data) => onSave(data as Record<string, unknown>))} className="space-y-5">

      {/* TAM/SAM/SOM */}
      <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">Taille du marché (TAM / SAM / SOM)</p>
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
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">SAM — Marché adressable serviceable</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" {...register('taille_marche.sam.valeur', { valueAsNumber: true })} className={inp} placeholder="Valeur" />
            <input type="number" {...register('taille_marche.sam.taux_penetration_pct', { valueAsNumber: true })} className={inp} placeholder="Taux penetration %" />
          </div>
          <input {...register('taille_marche.sam.justification')} className={inp} placeholder="Justification" />
        </div>
        <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-zinc-500 font-medium">SOM — Marché réaliste an 1</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" {...register('taille_marche.som.valeur', { valueAsNumber: true })} className={inp} placeholder="Valeur" />
            <input type="number" {...register('taille_marche.som.delai_mois', { valueAsNumber: true })} className={inp} placeholder="Délai (mois)" />
          </div>
          <input {...register('taille_marche.som.justification')} className={inp} placeholder="Justification" />
        </div>
      </div>

      {/* Enquête */}
      <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">Enquête terrain</p>
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

      {/* Positionnement prix + IRP */}
      <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">Positionnement prix & IRP</p>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" {...register('positionnement_prix.prix_min_acceptable_ar', { valueAsNumber: true })} className={inp} placeholder="Prix min (Ar)" />
          <input type="number" {...register('positionnement_prix.prix_recommande_ar', { valueAsNumber: true })} className={inp} placeholder="Prix recommandé (Ar)" />
          <input type="number" {...register('positionnement_prix.prix_max_acceptable_ar', { valueAsNumber: true })} className={inp} placeholder="Prix max (Ar)" />
        </div>
        <select {...register('positionnement_prix.modele_prix')} className={sel}>
          {['UNITE','ABONNEMENT_MENSUEL','ABONNEMENT_ANNUEL','COMMISSION_PCT','PALIERS'].map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
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

      {/* Concurrents */}
      <div className={sec}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">Concurrents (min. 3)</p>
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

      {/* Sources */}
      <div className={sec}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">Sources de données (min. 1)</p>
          <button type="button" onClick={() => addSrc({ type: 'INSTAT', titre: '', annee: 2024, url: '', donnee_utilisee: '' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {srcFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <select {...register(`sources_marche.${i}.type`)} className={cn(sel, 'w-28')}>
              {['INSTAT','EDBM','GEM','HABAKA','BANQUE_MONDIALE','UPLOAD','EXTERNE'].map(t => <option key={t} value={t}>{t}</option>)}
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
