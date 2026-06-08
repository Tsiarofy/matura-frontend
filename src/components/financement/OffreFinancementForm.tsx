import { useState } from 'react'
import { useCreerOffre } from '@/hooks/useInvestisseur'
import { TypeFinancement } from '@matura/shared'
import { Loader2, X } from 'lucide-react'

const TYPES: { value: TypeFinancement; label: string }[] = [
  { value: TypeFinancement.SUBVENTION,  label: 'Subvention' },
  { value: TypeFinancement.PRET,        label: 'Prêt' },
  { value: TypeFinancement.EQUITY,      label: 'Equity / Capital' },
  { value: TypeFinancement.OBLIGATION,  label: 'Obligation' },
  { value: TypeFinancement.DON,         label: 'Don' },
]

export function OffreFinancementForm({ onClose }: { onClose: () => void }) {
  const creer = useCreerOffre()
  const [form, setForm] = useState({
    titre:          '',
    description:    '',
    typeFinancement: TypeFinancement.SUBVENTION,
    montantMin:     '',
    montantMax:     '',
    stadeCible:     '6',
    dateCloture:    '',
  })

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))
  const cls = 'w-full text-[12px] text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors'

  const handleSubmit = () => {
    creer.mutate(
      {
        titre:           form.titre,
        description:     form.description,
        typeFinancement: form.typeFinancement,
        stadeCible:      parseInt(form.stadeCible, 10),
        montantMin:      form.montantMin ? parseFloat(form.montantMin) : undefined,
        montantMax:      form.montantMax ? parseFloat(form.montantMax) : undefined,
        secteurs:        [],
        regions:         [],
        dateCloture:     form.dateCloture || undefined,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-medium text-zinc-900">Nouvelle offre</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-zinc-500">Titre</label>
        <input type="text" value={form.titre}
          onChange={(e) => set('titre', e.target.value)}
          placeholder="Appel à projets agritech…" className={cls} />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-zinc-500">Description</label>
        <textarea rows={3} value={form.description}
          onChange={(e) => set('description', e.target.value)}  
          className={`${cls} resize-none`} />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] text-zinc-500">Type de financement</label>
        <select value={form.typeFinancement}
          onChange={(e) => set('typeFinancement', e.target.value)} className={cls}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500">Montant min (MGA)</label>
          <input type="number" value={form.montantMin}
            onChange={(e) => set('montantMin', e.target.value)} className={cls} />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500">Montant max (MGA)</label>
          <input type="number" value={form.montantMax}
            onChange={(e) => set('montantMax', e.target.value)} className={cls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500">
            Stade BRL minimal requis
          </label>
          <select value={form.stadeCible}
            onChange={(e) => set('stadeCible', e.target.value)} className={cls}>
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>BRL {n}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-500">Date de clôture</label>
          <input type="date" value={form.dateCloture}
            onChange={(e) => set('dateCloture', e.target.value)} className={cls} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onClose}
          className="flex-1 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-[12px] hover:bg-zinc-50 transition-colors">
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={creer.isPending || !form.titre || !form.description}
          className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
        >
          {creer.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Publier l'offre
        </button>
      </div>
    </div>
  )
}
