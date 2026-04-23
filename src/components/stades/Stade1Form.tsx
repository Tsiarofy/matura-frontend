import { useForm, useFieldArray } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'
import { REGIONS_MADAGASCAR } from '@/lib/constants'

interface Props { stade: StadeData; onSave: (d: Record<string, unknown>) => void; saving: boolean }

export function Stade1Form({ stade, onSave, saving }: Props) {
  const donnees = stade.donnees as Record<string, unknown>

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      enonce_probleme: (donnees.enonce_probleme as string) ?? '',
      profil_affecte: {
        description: ((donnees.profil_affecte as Record<string,unknown>)?.description as string) ?? '',
        region: ((donnees.profil_affecte as Record<string,unknown>)?.region as string) ?? '',
        urbanite: ((donnees.profil_affecte as Record<string,unknown>)?.urbanite as string) ?? 'URBAIN',
        nombre_estime: ((donnees.profil_affecte as Record<string,unknown>)?.nombre_estime as number) ?? 0,
        frequence: ((donnees.profil_affecte as Record<string,unknown>)?.frequence as string) ?? 'MENSUEL',
      },
      intensite_probleme: {
        cout_actuel_ar: ((donnees.intensite_probleme as Record<string,unknown>)?.cout_actuel_ar as number) ?? 0,
        unite: ((donnees.intensite_probleme as Record<string,unknown>)?.unite as string) ?? 'AR_PAR_MOIS',
        severite: ((donnees.intensite_probleme as Record<string,unknown>)?.severite as number) ?? 3,
      },
      observations_terrain: {
        observe_directement: ((donnees.observations_terrain as Record<string,unknown>)?.observe_directement as boolean) ?? false,
        nb_personnes_interrogees: ((donnees.observations_terrain as Record<string,unknown>)?.nb_personnes_interrogees as number) ?? 0,
        methode: ((donnees.observations_terrain as Record<string,unknown>)?.methode as string) ?? 'EN_FACE',
        verbatims: ((donnees.observations_terrain as Record<string,unknown>)?.verbatims as string[]) ?? ['', ''],
      },
      solutions_existantes: (donnees.solutions_existantes as { nom: string; type: string; pourquoi_insuffisante: string; satisfaction_utilisateur: number }[]) ?? [{ nom: '', type: 'FORMELLE', pourquoi_insuffisante: '', satisfaction_utilisateur: 3 }],
      contexte_geographique: {
        niveau_principal: ((donnees.contexte_geographique as Record<string,unknown>)?.niveau_principal as string) ?? 'REGION',
        codes_selectionnes: ((donnees.contexte_geographique as Record<string,unknown>)?.codes_selectionnes as string[]) ?? [],
        noms_selectionnes: ((donnees.contexte_geographique as Record<string,unknown>)?.noms_selectionnes as string[]) ?? [],
      },
    },
  })

  const { fields: solFields, append: addSol, remove: remSol } = useFieldArray({ control, name: 'solutions_existantes' })

  const onSubmit = (data: unknown) => onSave(data as Record<string, unknown>)

  const inputCls = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const labelCls = 'block text-[11px] text-zinc-500 mb-1'
  const sectionCls = 'space-y-3 pb-5 border-b border-zinc-100 last:border-0'
  const selectCls = cn(inputCls, 'appearance-none')

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
          <button type="button" onClick={() => addSol({ nom: '', type: 'FORMELLE', pourquoi_insuffisante: '', satisfaction_utilisateur: 3 })}
            className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700">
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
        <div>
          <label className={labelCls}>Niveau principal</label>
          <select {...register('contexte_geographique.niveau_principal')} className={selectCls}>
            <option value="REGION">Région</option>
            <option value="DISTRICT">District</option>
            <option value="COMMUNE">Commune</option>
            <option value="FOKONTANY">Fokontany</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Zone(s) sélectionnée(s) *</label>
          <select
          {...register('contexte_geographique.noms_selectionnes')}
            multiple
            className={cn(inputCls, 'h-28')}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (o) => o.value)
              // RHF ne gère pas bien les selects multiples, on resoumets
              console.log(selected)
              void selected
            }}
          >
            {REGIONS_MADAGASCAR.map((r) => <option key={r} value={r}>{r}</option>)}
            {/* {console.log(selected)} */}
          </select>
          <p className="text-[10px] text-zinc-400 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs zones.</p>
        </div>
      </div>

      {/* Save */}
      <button type="submit" disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Enregistrer le Stade 1
      </button>
    </form>
  )
}
