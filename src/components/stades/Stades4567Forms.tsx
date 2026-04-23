// ─── STADE 4 — BMC ───────────────────────────────────────────────────────────
import { useForm, useFieldArray } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'

interface Props { stade: StadeData; onSave: (d: Record<string, unknown>) => void; saving: boolean }

const inp = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
const sel = cn(inp, 'appearance-none')
const SaveBtn = ({ saving, label }: { saving: boolean; label: string }) => (
  <button type="submit" disabled={saving}
    className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors">
    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
    {label}
  </button>
)

export function Stade4Form({ stade, onSave, saving }: Props) {
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      evolution_lean_canvas: {
        ce_qui_a_change: (g<Record<string,unknown>>('evolution_lean_canvas', {})).ce_qui_a_change as string ?? '',
        hypotheses_confirmees: (g<Record<string,unknown>>('evolution_lean_canvas', {})).hypotheses_confirmees as string[] ?? [''],
        hypotheses_infirmees: (g<Record<string,unknown>>('evolution_lean_canvas', {})).hypotheses_infirmees as string[] ?? [''],
      },
      propositions_valeur: g<{ proposition: string; pour_segment: string; validee_par_enquete: boolean }[]>('propositions_valeur', [{ proposition: '', pour_segment: '', validee_par_enquete: false }]),
      segments_clients: g<{ nom: string; taille_estimee: number; potentiel_revenu_ar: number; priorite: string }[]>('segments_clients', [{ nom: '', taille_estimee: 0, potentiel_revenu_ar: 0, priorite: 'PRINCIPAL' }]),
      ressources_cles: g<{ ressource: string; type: string; deja_possedee: boolean }[]>('ressources_cles', [{ ressource: '', type: 'HUMAIN', deja_possedee: false }]),
      activites_cles: g<{ activite: string; type: string; est_coeur_metier: boolean }[]>('activites_cles', [{ activite: '', type: 'PRODUCTION', est_coeur_metier: true }]),
      partenaires_cles: g<{ partenaire: string; type: string; pourquoi_essentiel: string; risque_si_absent: string; statut: string }[]>('partenaires_cles', [{ partenaire: '', type: 'FOURNISSEUR', pourquoi_essentiel: '', risque_si_absent: 'MOYEN', statut: 'IDENTIFIE' }]),
      sources_revenus: g<{ nom: string; modele: string; prix_ar: number; volume_mensuel: number; confiance: string }[]>('sources_revenus', [{ nom: '', modele: 'ABONNEMENT', prix_ar: 0, volume_mensuel: 0, confiance: 'MOYENNE' }]),
      structure_couts: g<{ categorie: string; libelle: string; montant_mensuel_ar: number; est_fixe: boolean }[]>('structure_couts', [{ categorie: 'PERSONNEL', libelle: '', montant_mensuel_ar: 0, est_fixe: true }]),
    },
  })

  const { fields: pvF, append: addPv, remove: remPv } = useFieldArray({ control, name: 'propositions_valeur' })
  const { fields: partF, append: addPart, remove: remPart } = useFieldArray({ control, name: 'partenaires_cles' })
  const { fields: revF, append: addRev, remove: remRev } = useFieldArray({ control, name: 'sources_revenus' })
  const { fields: coutF, append: addCout, remove: remCout } = useFieldArray({ control, name: 'structure_couts' })

  return (
    <form onSubmit={handleSubmit((data) => onSave(data as Record<string, unknown>))} className="space-y-5">
      {/* Évolution */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">Évolution depuis le Lean Canvas</p>
        <textarea {...register('evolution_lean_canvas.ce_qui_a_change')} rows={3}
          className={cn(inp, 'resize-none')} placeholder="Ce qui a changé depuis S2 (min 20 car.)..." />
      </div>

      {/* Propositions de valeur */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Propositions de valeur</p>
          <button type="button" onClick={() => addPv({ proposition: '', pour_segment: '', validee_par_enquete: false })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {pvF.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <input {...register(`propositions_valeur.${i}.proposition`)} className={cn(inp, 'flex-1')} placeholder="Proposition de valeur" />
            <input {...register(`propositions_valeur.${i}.pour_segment`)} className={cn(inp, 'w-36')} placeholder="Pour segment" />
            {pvF.length > 1 && <button type="button" onClick={() => remPv(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

      {/* Partenaires clés */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Partenaires clés</p>
          <button type="button" onClick={() => addPart({ partenaire: '', type: 'FOURNISSEUR', pourquoi_essentiel: '', risque_si_absent: 'MOYEN', statut: 'IDENTIFIE' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {partF.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input {...register(`partenaires_cles.${i}.partenaire`)} className={cn(inp, 'flex-1')} placeholder="Partenaire" />
              <select {...register(`partenaires_cles.${i}.type`)} className={cn(sel, 'w-40')}>
                {['FOURNISSEUR','ALLIANCE_STRATEGIQUE','CO_ENTREPRISE','ACHETEUR_VENDEUR'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
              </select>
              {partF.length > 1 && <button type="button" onClick={() => remPart(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <input {...register(`partenaires_cles.${i}.pourquoi_essentiel`)} className={inp} placeholder="Pourquoi essentiel ?" />
            <div className="flex gap-2">
              <select {...register(`partenaires_cles.${i}.risque_si_absent`)} className={cn(sel, 'flex-1')}>
                {['FAIBLE','MOYEN','ELEVE','CRITIQUE'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select {...register(`partenaires_cles.${i}.statut`)} className={cn(sel, 'flex-1')}>
                {['IDENTIFIE','CONTACTE','ACCORD'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Sources revenus */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Sources de revenus</p>
          <button type="button" onClick={() => addRev({ nom: '', modele: 'ABONNEMENT', prix_ar: 0, volume_mensuel: 0, confiance: 'MOYENNE' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {revF.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <input {...register(`sources_revenus.${i}.nom`)} className={cn(inp, 'w-32')} placeholder="Nom" />
            <select {...register(`sources_revenus.${i}.modele`)} className={cn(sel, 'w-36')}>
              {['ABONNEMENT','ACHAT_UNIQUE','COMMISSION','FREEMIUM','B2B_CONTRACT','SUBVENTION','AUTRE'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="number" {...register(`sources_revenus.${i}.prix_ar`, { valueAsNumber: true })} className={cn(inp, 'w-28')} placeholder="Prix Ar" />
            <input type="number" {...register(`sources_revenus.${i}.volume_mensuel`, { valueAsNumber: true })} className={cn(inp, 'w-20')} placeholder="Vol/mois" />
            {revF.length > 1 && <button type="button" onClick={() => remRev(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

      {/* Structure coûts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Structure de coûts</p>
          <button type="button" onClick={() => addCout({ categorie: 'PERSONNEL', libelle: '', montant_mensuel_ar: 0, est_fixe: true })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {coutF.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <select {...register(`structure_couts.${i}.categorie`)} className={cn(sel, 'w-32')}>
              {['PERSONNEL','TECH','MARKETING','LOGISTIQUE','LOYER','AUTRE'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input {...register(`structure_couts.${i}.libelle`)} className={cn(inp, 'flex-1')} placeholder="Libellé" />
            <input type="number" {...register(`structure_couts.${i}.montant_mensuel_ar`, { valueAsNumber: true })} className={cn(inp, 'w-28')} placeholder="Ar/mois" />
            {coutF.length > 1 && <button type="button" onClick={() => remCout(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

      <SaveBtn saving={saving} label="Enregistrer le Stade 4" />
    </form>
  )
}

// ─── STADE 5 — FAISABILITÉ ────────────────────────────────────────────────────
export function Stade5Form({ stade, onSave, saving }: Props) {
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      disciplines_requises_projet: g<string[]>('disciplines_requises_projet', []),
      membres_equipe: g<{ prenom_nom: string; role_projet: string; disciplines: string[]; annees_experience: number; engagement: string; est_fondateur: boolean }[]>('membres_equipe', [
        { prenom_nom: '', role_projet: '', disciplines: [], annees_experience: 0, engagement: 'TEMPS_PLEIN', est_fondateur: true },
      ]),
      finances: {
        prix_vente_ar: 0,
        investissement_initial_ar: 0,
        besoin_financement_ar: 0,
        type_financement: 'MIXTE',
        unites_projetees: { annee1: 0, annee2: 0, annee3: 0 },
        charges_fixes: [{ libelle: '', montant_mensuel_ar: 0 }],
        charges_variables: [{ libelle: '', montant_par_unite_ar: 0 }],
        ...g<Record<string,unknown>>('finances', {}),
      },
      jalons: g<{ titre: string; date_cible: string; responsable: string; metrique_succes: string; budget_ar: number }[]>('jalons', [
        { titre: '', date_cible: '', responsable: '', metrique_succes: '', budget_ar: 0 },
      ]),
    },
  })

  const { fields: memF, append: addMem, remove: remMem } = useFieldArray({ control, name: 'membres_equipe' })
  const { fields: fixF, append: addFix, remove: remFix } = useFieldArray({ control, name: 'finances.charges_fixes' })
  const { fields: varF, append: addVar, remove: remVar } = useFieldArray({ control, name: 'finances.charges_variables' })
  const { fields: jalF, append: addJal, remove: remJal } = useFieldArray({ control, name: 'jalons' })

  const DISCIPLINES = ['TECH','DESIGN','VENTE','FINANCE','JURIDIQUE','MARKETING','OPERATIONS','EXPERT_DOMAINE','COMMUNICATION']

  return (
    <form onSubmit={handleSubmit((data) => onSave(data as Record<string, unknown>))} className="space-y-5">
      {/* Membres */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Équipe</p>
          <button type="button" onClick={() => addMem({ prenom_nom: '', role_projet: '', disciplines: [], annees_experience: 0, engagement: 'TEMPS_PLEIN', est_fondateur: false })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {memF.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input {...register(`membres_equipe.${i}.prenom_nom`)} className={cn(inp, 'flex-1')} placeholder="Prénom Nom" />
              <input {...register(`membres_equipe.${i}.role_projet`)} className={cn(inp, 'flex-1')} placeholder="Rôle" />
              {memF.length > 1 && <button type="button" onClick={() => remMem(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select {...register(`membres_equipe.${i}.engagement`)} className={sel}>
                <option value="TEMPS_PLEIN">Temps plein</option><option value="TEMPS_PARTIEL">Temps partiel</option><option value="CONSEILLER">Conseiller</option>
              </select>
              <input type="number" {...register(`membres_equipe.${i}.annees_experience`, { valueAsNumber: true })} className={inp} placeholder="Années d'exp." />
            </div>
            <div className="flex flex-wrap gap-1">
              {DISCIPLINES.map((disc) => (
                <label key={disc} className="flex items-center gap-1 text-[11px] cursor-pointer">
                  <input type="checkbox" value={disc} {...register(`membres_equipe.${i}.disciplines`)} className="w-3 h-3 accent-green-600" />
                  {disc}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Finances */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">Finances</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Prix vente (Ar) *</label>
            <input type="number" {...register('finances.prix_vente_ar', { valueAsNumber: true })} className={inp} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Investissement initial (Ar)</label>
            <input type="number" {...register('finances.investissement_initial_ar', { valueAsNumber: true })} className={inp} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Besoin financement (Ar)</label>
            <input type="number" {...register('finances.besoin_financement_ar', { valueAsNumber: true })} className={inp} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['annee1','annee2','annee3'].map((a, i) => (
            <div key={a}>
              <label className="text-[11px] text-zinc-500 block mb-1">Unités an {i+1}</label>
              <input type="number" {...register(`finances.unites_projetees.${a}` as never, { valueAsNumber: true })} className={inp} />
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-zinc-500">Charges fixes (mensuel)</label>
            <button type="button" onClick={() => addFix({ libelle: '', montant_mensuel_ar: 0 })} className="text-[11px] text-green-600 flex items-center gap-1"><Plus className="w-3 h-3" />+</button>
          </div>
          {fixF.map((f, i) => (
            <div key={f.id} className="flex gap-2 mb-1">
              <input {...register(`finances.charges_fixes.${i}.libelle` as never)} className={cn(inp, 'flex-1')} placeholder="Libellé" />
              <input type="number" {...register(`finances.charges_fixes.${i}.montant_mensuel_ar` as never, { valueAsNumber: true })} className={cn(inp, 'w-32')} placeholder="Ar/mois" />
              {fixF.length > 1 && <button type="button" onClick={() => remFix(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-zinc-500">Charges variables (par unité)</label>
            <button type="button" onClick={() => addVar({ libelle: '', montant_par_unite_ar: 0 })} className="text-[11px] text-green-600 flex items-center gap-1"><Plus className="w-3 h-3" />+</button>
          </div>
          {varF.map((f, i) => (
            <div key={f.id} className="flex gap-2 mb-1">
              <input {...register(`finances.charges_variables.${i}.libelle` as never)} className={cn(inp, 'flex-1')} placeholder="Libellé" />
              <input type="number" {...register(`finances.charges_variables.${i}.montant_par_unite_ar` as never, { valueAsNumber: true })} className={cn(inp, 'w-32')} placeholder="Ar/unité" />
              {varF.length > 1 && <button type="button" onClick={() => remVar(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* Jalons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Jalons (min. 3)</p>
          <button type="button" onClick={() => addJal({ titre: '', date_cible: '', responsable: '', metrique_succes: '', budget_ar: 0 })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {jalF.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input {...register(`jalons.${i}.titre`)} className={cn(inp, 'flex-1')} placeholder="Titre jalon" />
              <input type="date" {...register(`jalons.${i}.date_cible`)} className={cn(inp, 'w-36')} />
              {jalF.length > 1 && <button type="button" onClick={() => remJal(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input {...register(`jalons.${i}.responsable`)} className={inp} placeholder="Responsable" />
              <input {...register(`jalons.${i}.metrique_succes`)} className={inp} placeholder="Métrique de succès" />
            </div>
          </div>
        ))}
      </div>

      <SaveBtn saving={saving} label="Enregistrer le Stade 5" />
    </form>
  )
}

// ─── STADE 6 — PROTOTYPE ─────────────────────────────────────────────────────
export function Stade6Form({ stade, onSave, saving }: Props) {
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      mvp: {
        type: 'SERVICE',
        description: '',
        url: '',
        fonctionnalites_testees: [{ fonctionnalite: '', resultat: 'FONCTIONNE', raison: '' }],
        ...g<Record<string,unknown>>('mvp', {}),
      },
      retours_clients: g<{ date: string; profil: string; type_interaction: string; verbatim: string; sentiment: string; action_prise: string }[]>('retours_clients', [
        { date: '', profil: '', type_interaction: 'ENTRETIEN', verbatim: '', sentiment: 'POSITIF', action_prise: '' },
      ]),
      metriques_usage: {
        total_utilisateurs_atteints: 0, clients_payants: 0, revenus_generes_ar: 0,
        taux_retention_pct: 0, score_nps: 0, taux_conversion_pct: 0,
        ...g<Record<string,unknown>>('metriques_usage', {}),
      },
      iterations: g<{ version: string; date: string; declencheur: string; changement: string; impact_metriques: string }[]>('iterations', [
        { version: 'v1.0', date: '', declencheur: '', changement: '', impact_metriques: '' },
      ]),
    },
  })

  const { fields: retF, append: addRet, remove: remRet } = useFieldArray({ control, name: 'retours_clients' })
  const { fields: iterF, append: addIter, remove: remIter } = useFieldArray({ control, name: 'iterations' })

  return (
    <form onSubmit={handleSubmit((data) => onSave(data as Record<string, unknown>))} className="space-y-5">
      {/* MVP */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">MVP</p>
        <div className="grid grid-cols-2 gap-3">
          <select {...register('mvp.type')} className={cn(sel)}>
            {['APPLICATION_DIGITALE','PRODUIT_PHYSIQUE','SERVICE','PAGE_WEB','PROCESSUS_MANUEL'].map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
          </select>
          <input {...register('mvp.url')} className={inp} placeholder="URL (optionnel)" />
        </div>
        <textarea {...register('mvp.description')} rows={3} className={cn(inp, 'resize-none')} placeholder="Description du MVP (min 20 car.)" />
      </div>

      {/* Métriques d'usage */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">Métriques d'usage</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['total_utilisateurs_atteints', 'Utilisateurs atteints'],
            ['clients_payants', 'Clients payants *'],
            ['revenus_generes_ar', 'Revenus générés (Ar)'],
            ['taux_retention_pct', 'Rétention (%)'],
            ['score_nps', 'NPS (-100 à 100)'],
            ['taux_conversion_pct', 'Conversion (%)'],
          ].map(([k, label]) => (
            <div key={k}>
              <label className="text-[11px] text-zinc-500 block mb-1">{label}</label>
              <input type="number" {...register(`metriques_usage.${k}` as never, { valueAsNumber: true })} className={inp} />
            </div>
          ))}
        </div>
      </div>

      {/* Retours clients */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Retours clients (min. 5) — {retF.length}</p>
          <button type="button" onClick={() => addRet({ date: '', profil: '', type_interaction: 'ENTRETIEN', verbatim: '', sentiment: 'POSITIF', action_prise: '' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {retF.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input type="date" {...register(`retours_clients.${i}.date`)} className={cn(inp, 'w-36')} />
              <input {...register(`retours_clients.${i}.profil`)} className={cn(inp, 'flex-1')} placeholder="Profil client" />
              <select {...register(`retours_clients.${i}.sentiment`)} className={cn(sel, 'w-32')}>
                {['POSITIF','NEGATIF','NEUTRE','MIXTE'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {retF.length > 1 && <button type="button" onClick={() => remRet(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <input {...register(`retours_clients.${i}.verbatim`)} className={inp} placeholder="Verbatim du retour" />
            <input {...register(`retours_clients.${i}.action_prise`)} className={inp} placeholder="Action prise suite à ce retour *" />
          </div>
        ))}
      </div>

      {/* Itérations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium text-zinc-700">Itérations (min. 1)</p>
          <button type="button" onClick={() => addIter({ version: '', date: '', declencheur: '', changement: '', impact_metriques: '' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {iterF.map((f, i) => (
          <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input {...register(`iterations.${i}.version`)} className={cn(inp, 'w-24')} placeholder="v1.0" />
              <input type="date" {...register(`iterations.${i}.date`)} className={cn(inp, 'w-36')} />
              {iterF.length > 1 && <button type="button" onClick={() => remIter(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
            <input {...register(`iterations.${i}.declencheur`)} className={inp} placeholder="Déclencheur" />
            <input {...register(`iterations.${i}.changement`)} className={inp} placeholder="Changement effectué" />
            <input {...register(`iterations.${i}.impact_metriques`)} className={inp} placeholder="Impact sur les métriques" />
          </div>
        ))}
      </div>

      <SaveBtn saving={saving} label="Enregistrer le Stade 6" />
    </form>
  )
}

// ─── STADE 7 — LANCEMENT ─────────────────────────────────────────────────────
export function Stade7Form({ stade, onSave, saving }: Props) {
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      resume_executif: {
        phrase_accroche: '',
        description_courte: '',
        ...g<Record<string,unknown>>('resume_executif', {}),
      },
      demande_financement: {
        montant_ar: 0,
        type: 'SUBVENTION',
        pourcentage_parts_offert: 0,
        utilisation: [{ categorie: 'DEV_PRODUIT', montant_ar: 0, justification: '', delai_mois: 6 }],
        projections_retour: { ca_annee1_ar: 0, ca_annee2_ar: 0, ca_annee3_ar: 0, date_point_mort: '' },
        ...g<Record<string,unknown>>('demande_financement', {}),
      },
      contexte_investisseur: {
        type_investisseur_cible: 'ANGEL',
        pourquoi_maintenant: '',
        impact_local_madagascar: '',
        strategie_sortie: '',
        ...g<Record<string,unknown>>('contexte_investisseur', {}),
      },
      pitch_deck_url: g<string>('pitch_deck_url', ''),
    },
  })

  const { fields: utilF, append: addUtil, remove: remUtil } = useFieldArray({ control, name: 'demande_financement.utilisation' as never })

  return (
    <form onSubmit={handleSubmit((data) => onSave(data as Record<string, unknown>))} className="space-y-5">
      {/* Résumé exécutif */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">Résumé exécutif</p>
        <input {...register('resume_executif.phrase_accroche')} className={inp} maxLength={200} placeholder="Phrase d'accroche (max 200 car.) *" />
        <textarea {...register('resume_executif.description_courte')} rows={4} className={cn(inp, 'resize-none')} placeholder="Description courte (50-1000 car.) *" />
      </div>

      {/* Demande financement */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">Demande de financement</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Montant demandé (Ar) *</label>
            <input type="number" {...register('demande_financement.montant_ar', { valueAsNumber: true })} className={inp} />
          </div>
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Type de financement</label>
            <select {...register('demande_financement.type')} className={sel}>
              {['SUBVENTION','PRET','CAPITAL','BILLET_CONVERTIBLE','MIXTE'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['ca_annee1_ar','CA An 1'],['ca_annee2_ar','CA An 2'],['ca_annee3_ar','CA An 3']].map(([k,l]) => (
            <div key={k}>
              <label className="text-[11px] text-zinc-500 block mb-1">{l} (Ar)</label>
              <input type="number" {...register(`demande_financement.projections_retour.${k}` as never, { valueAsNumber: true })} className={inp} />
            </div>
          ))}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] text-zinc-500">Utilisation des fonds</label>
            <button type="button" onClick={() => addUtil({ categorie: 'MARKETING', montant_ar: 0, justification: '', delai_mois: 6 } as never)}
              className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3 h-3" />+</button>
          </div>
          {utilF.map((f, i) => (
            <div key={f.id} className="flex gap-2 items-center mb-1">
              <select {...register(`demande_financement.utilisation.${i}.categorie` as never)} className={cn(sel, 'w-36')}>
                {['DEV_PRODUIT','MARKETING','EQUIPE','INFRASTRUCTURE','FONDS_ROULEMENT','AUTRE'].map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
              </select>
              <input type="number" {...register(`demande_financement.utilisation.${i}.montant_ar` as never, { valueAsNumber: true })} className={cn(inp, 'w-32')} placeholder="Montant Ar" />
              <input {...register(`demande_financement.utilisation.${i}.justification` as never)} className={cn(inp, 'flex-1')} placeholder="Justification" />
              {utilF.length > 1 && <button type="button" onClick={() => remUtil(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
            </div>
          ))}
        </div>
      </div>

      {/* Contexte investisseur */}
      <div className="space-y-3 pb-5 border-b border-zinc-100">
        <p className="text-[12px] font-medium text-zinc-700">Contexte investisseur</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1">Type d'investisseur ciblé</label>
            <select {...register('contexte_investisseur.type_investisseur_cible')} className={sel}>
              {['ANGEL','INCUBATEUR','FONDS_SEED','INSTITUTIONNEL','BAILLEUR'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 block mb-1">Pourquoi maintenant ? *</label>
          <textarea {...register('contexte_investisseur.pourquoi_maintenant')} rows={2} className={cn(inp, 'resize-none')} />
        </div>
        <div>
          <label className="text-[11px] text-zinc-500 block mb-1">Impact local Madagascar *</label>
          <textarea {...register('contexte_investisseur.impact_local_madagascar')} rows={2} className={cn(inp, 'resize-none')} />
        </div>
      </div>

      {/* Pitch deck */}
      <div>
        <label className="text-[11px] text-zinc-500 block mb-1">URL Pitch Deck (optionnel)</label>
        <input {...register('pitch_deck_url')} className={inp} placeholder="https://..." />
      </div>

      <SaveBtn saving={saving} label="Enregistrer le Stade 7" />
    </form>
  )
}
