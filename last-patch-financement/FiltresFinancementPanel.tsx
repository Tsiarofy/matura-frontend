import { TypeFinancement, StatutOffre, type FiltresFinancement } from '@matura/shared'

const TYPES_FINANCEMENT: { value: TypeFinancement; label: string }[] = [
  { value: TypeFinancement.SUBVENTION,  label: 'Subvention' },
  { value: TypeFinancement.PRET,        label: 'Prêt' },
  { value: TypeFinancement.EQUITY,      label: 'Equity' },
  { value: TypeFinancement.OBLIGATION,  label: 'Obligation' },
  { value: TypeFinancement.DON,         label: 'Don' },
]

interface Props {
  filtres: FiltresFinancement
  onChange: (partial: Partial<FiltresFinancement>) => void
  onReset: () => void
}

export function FiltresFinancementPanel({ filtres, onChange, onReset }: Props) {
  const hasFiltres =
    !!filtres.typeFinancement || !!filtres.secteur || !!filtres.region ||
    !!filtres.montantMin || !!filtres.montantMax || !!filtres.stadeCible

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-zinc-700">Filtres</p>
        {hasFiltres && (
          <button onClick={onReset} className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <p className="text-[11px] text-zinc-500">Type de financement</p>
        <div className="flex flex-wrap gap-1.5">
          {TYPES_FINANCEMENT.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ typeFinancement: filtres.typeFinancement === value ? undefined : value })}
              className={[
                'text-[11px] px-2.5 py-1 rounded-full border transition-colors',
                filtres.typeFinancement === value
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stade BRL */}
      <div className="space-y-1.5">
        <p className="text-[11px] text-zinc-500">
          Mon stade BRL
          <span className="ml-1 text-zinc-400">(affiche les offres accessibles)</span>
        </p>
        <select
          value={filtres.stadeCible ?? ''}
          onChange={(e) => onChange({ stadeCible: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full text-[12px] text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
        >
          <option value="">Tous les stades</option>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((s) => (
            <option key={s} value={s}>BRL {s}</option>
          ))}
        </select>
      </div>

      {/* Montant */}
      <div className="space-y-1.5">
        <p className="text-[11px] text-zinc-500">Montant (MGA)</p>
        <div className="flex items-center gap-2">
          <input
            type="number" placeholder="Min"
            value={filtres.montantMin ?? ''}
            min={0}
            onChange={(e) => onChange({ montantMin: e.target.value ? Number(e.target.value) : undefined })}
            className="flex-1 text-[12px] text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
          />
          <span className="text-zinc-300">—</span>
          <input
            type="number" placeholder="Max"
            value={filtres.montantMax ?? ''}
            min={0}
            onChange={(e) => onChange({ montantMax: e.target.value ? Number(e.target.value) : undefined })}
            className="flex-1 text-[12px] text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      {/* Secteur */}
      <div className="space-y-1.5">
        <p className="text-[11px] text-zinc-500">Secteur</p>
        <input
          type="text" placeholder="Ex : Agriculture, Tech…"
          value={filtres.secteur ?? ''}
          onChange={(e) => onChange({ secteur: e.target.value || undefined })}
          className="w-full text-[12px] text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
        />
      </div>

      {/* Région */}
      <div className="space-y-1.5">
        <p className="text-[11px] text-zinc-500">Région</p>
        <input
          type="text" placeholder="Ex : Analamanga, Boeny…"
          value={filtres.region ?? ''}
          onChange={(e) => onChange({ region: e.target.value || undefined })}
          className="w-full text-[12px] text-zinc-700 border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 transition-colors"
        />
      </div>
    </div>
  )
}
