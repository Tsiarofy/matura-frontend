import { TypeFinancement, type FiltresFinancement } from '@matura/shared'

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
    <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-[var(--color-text-primary)]">Filtres</p>
        {hasFiltres && (
          <button onClick={onReset} className="text-[11px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-[var(--color-text-muted)]">Type de financement</p>
        <div className="flex flex-wrap gap-1.5">
          {TYPES_FINANCEMENT.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onChange({ typeFinancement: filtres.typeFinancement === value ? undefined : value })}
              className={[
                'text-[10.5px] px-2.5 py-1 rounded-full border transition-colors font-semibold',
                filtres.typeFinancement === value
                  ? 'bg-[var(--color-success)] text-white border-[var(--color-success)]'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-border-strong)]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stade BRL */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-[var(--color-text-muted)]">
          Mon stade BRL
          <span className="ml-1 text-zinc-400">(affiche les offres accessibles)</span>
        </p>
        <select
          value={filtres.stadeCible ?? ''}
          onChange={(e) => onChange({ stadeCible: e.target.value ? Number(e.target.value) : undefined })}
          className="h-9 w-full rounded-[15px] border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] text-[var(--color-text-secondary)] outline-none transition-[border-color,box-shadow] appearance-none focus:border-[var(--color-border-strong)] focus:ring-3 focus:ring-[color:rgba(25,180,91,0.08)]"
        >
          <option value="">Tous les stades</option>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((s) => (
            <option key={s} value={s}>BRL {s}</option>
          ))}
        </select>
      </div>

      {/* Montant */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-[var(--color-text-muted)]">Montant (MGA)</p>
        <div className="flex items-center gap-2">
          <input
            type="number" placeholder="Min"
            value={filtres.montantMin ?? ''}
            min={0}
            onChange={(e) => onChange({ montantMin: e.target.value ? Number(e.target.value) : undefined })}
            className="h-9 w-full rounded-[15px] border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] text-[var(--color-text-secondary)] outline-none transition-[border-color,box-shadow] focus:border-[var(--color-border-strong)] focus:ring-3 focus:ring-[color:rgba(25,180,91,0.08)]"
          />
          <span className="text-zinc-300">—</span>
          <input
            type="number" placeholder="Max"
            value={filtres.montantMax ?? ''}
            min={0}
            onChange={(e) => onChange({ montantMax: e.target.value ? Number(e.target.value) : undefined })}
            className="h-9 w-full rounded-[15px] border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] text-[var(--color-text-secondary)] outline-none transition-[border-color,box-shadow] focus:border-[var(--color-border-strong)] focus:ring-3 focus:ring-[color:rgba(25,180,91,0.08)]"
          />
        </div>
      </div>

      {/* Secteur */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-[var(--color-text-muted)]">Secteur</p>
        <input
          type="text" placeholder="Ex : Agriculture, Tech…"
          value={filtres.secteur ?? ''}
          onChange={(e) => onChange({ secteur: e.target.value || undefined })}
          className="h-9 w-full rounded-[15px] border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] text-[var(--color-text-secondary)] outline-none transition-[border-color,box-shadow] focus:border-[var(--color-border-strong)] focus:ring-3 focus:ring-[color:rgba(25,180,91,0.08)]"
        />
      </div>

      {/* Région */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-medium text-[var(--color-text-muted)]">Région</p>
        <input
          type="text" placeholder="Ex : Analamanga, Boeny…"
          value={filtres.region ?? ''}
          onChange={(e) => onChange({ region: e.target.value || undefined })}
          className="h-9 w-full rounded-[15px] border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] text-[var(--color-text-secondary)] outline-none transition-[border-color,box-shadow] focus:border-[var(--color-border-strong)] focus:ring-3 focus:ring-[color:rgba(25,180,91,0.08)]"
        />
      </div>
    </div>
  )
}
