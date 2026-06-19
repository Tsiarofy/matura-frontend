import { cn, formatAr, formatDecimal } from '@/lib/utils'

interface MetriquesStadeProps {
  metriques: Record<string, unknown>
  numStade: number
}

function MetriqueItem({
  label,
  value,
  highlight,
  color,
}: {
  label: string
  value: string
  highlight?: boolean
  color?: 'green' | 'amber' | 'red' | 'indigo'
}) {
  const colorMap = {
    green:  'text-[var(--color-success-text)] bg-[var(--color-success-bg)]',
    amber:  'text-[#a16207] bg-[var(--color-tsisy-amber-bg)]',
    red:    'text-[var(--color-error)] bg-[var(--color-error-bg)]',
    indigo: 'text-[#5c61e8] bg-[var(--color-tsisy-indigo-bg)]',
  }
  const valueColor = color ? colorMap[color] : highlight ? colorMap.green : 'text-[var(--color-text-primary)] bg-transparent'

  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--color-border)] bg-white px-3.5 py-2.5">
      <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{label}</span>
      <span className={cn('text-[12px] font-semibold px-2 py-0.5 rounded-[8px]', valueColor)}>
        {value}
      </span>
    </div>
  )
}

export function MetriquesStade({ metriques, numStade }: MetriquesStadeProps) {
  if (!metriques || Object.keys(metriques).length === 0) {
    return (
      <div className="text-center py-8 text-[12px] text-[var(--color-text-muted)]">
        Enregistrez vos données pour voir les métriques calculées.
      </div>
    )
  }

  const get = (k: string) => metriques[k]

  const SectionTitle = ({ label }: { label: string }) => (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-disabled)] mb-3">
      {label}
    </p>
  )

  // ── Stade 1 ──────────────────────────────────────────────────────────────────
  if (numStade === 1) {
    const score = get('score_solidite_probleme') as number | undefined
    const marche = get('marche_preliminaire_ar') as number | undefined
    const nb = get('nb_personnes_interrogees') as number | undefined
    const sol = get('nb_solutions_existantes') as number | undefined
    return (
      <div className="space-y-2">
        <SectionTitle label="Métriques Stade 1" />
        {score !== undefined && (
          <MetriqueItem
            label="Score solidité problème"
            value={`${formatDecimal(score)}/100`}
            color={score >= 65 ? 'green' : score >= 40 ? 'amber' : 'red'}
          />
        )}
        {nb !== undefined && <MetriqueItem label="Personnes interrogées" value={String(nb)} />}
        {sol !== undefined && <MetriqueItem label="Solutions existantes" value={String(sol)} />}
        {marche !== undefined && marche > 0 && (
          <MetriqueItem label="Marché préliminaire" value={formatAr(marche, { compact: true })} color="indigo" />
        )}
      </div>
    )
  }

  // ── Stade 3 ──────────────────────────────────────────────────────────────────
  if (numStade === 3) {
    const score = get('score_marche') as number | undefined
    const ratio = get('ratio_revenu_pct') as number | undefined
    const realisme = get('niveau_realisme') as string | undefined
    const nb = get('nb_concurrents') as number | undefined
    return (
      <div className="space-y-2">
        <SectionTitle label="Métriques Stade 3" />
        {score !== undefined && (
          <MetriqueItem
            label="Score marché"
            value={`${formatDecimal(score)}/100`}
            color={score >= 65 ? 'green' : score >= 40 ? 'amber' : 'red'}
          />
        )}
        {nb !== undefined && <MetriqueItem label="Nombre de concurrents" value={String(nb)} />}
        {ratio !== undefined && <MetriqueItem label="Ratio prix/revenu (IRP)" value={`${formatDecimal(ratio)}%`} />}
        {realisme && (
          <MetriqueItem
            label="Réalisme prix"
            value={realisme}
            color={realisme === 'REALISTE' ? 'green' : realisme === 'ATTENTION' ? 'amber' : 'red'}
          />
        )}
      </div>
    )
  }

  // ── Stade 5 ──────────────────────────────────────────────────────────────────
  if (numStade === 5) {
    const pm = get('point_mort_unites') as number | undefined
    const marge = get('marge_contribution') as number | undefined
    const roi = get('roi') as number | undefined
    const ca = get('ca_previsionnel') as Record<string, number> | undefined
    const scoreEquipe = get('score_interdisciplinarite') as number | undefined
    const manquantes = get('disciplines_manquantes') as string[] | undefined
    return (
      <div className="space-y-2">
        <SectionTitle label="Métriques Stade 5" />
        {pm !== undefined && (
          <MetriqueItem
            label="Point mort (unités/an)"
            value={pm > 0 ? String(pm) : 'Non calculé'}
            color={pm > 0 ? 'green' : undefined}
          />
        )}
        {marge !== undefined && (
          <MetriqueItem label="Marge sur coût variable" value={formatAr(marge)} color={marge > 0 ? 'green' : undefined} />
        )}
        {roi !== undefined && (
          <MetriqueItem label="ROI estimé (an 3)" value={`${formatDecimal(roi)}%`} color={roi > 0 ? 'green' : 'red'} />
        )}
        {scoreEquipe !== undefined && (
          <MetriqueItem
            label="Interdisciplinarité équipe"
            value={`${formatDecimal(scoreEquipe)}%`}
            color={scoreEquipe >= 50 ? 'green' : 'amber'}
          />
        )}
        {ca && (
          <div className="rounded-[14px] border border-[var(--color-border)] bg-white px-3.5 py-3 space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-disabled)] block">
              CA prévisionnel
            </span>
            <div className="flex gap-3 text-[11px]">
              {['annee1', 'annee2', 'annee3'].map((k, i) => (
                <div key={k} className="flex-1 text-center rounded-[10px] bg-[var(--color-surface-soft)] py-2">
                  <p className="text-[var(--color-text-muted)] text-[9px] font-semibold uppercase">An {i + 1}</p>
                  <p className="text-[var(--color-text-primary)] font-semibold mt-0.5">
                    {formatAr(ca[k] ?? 0, { compact: true })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {manquantes && manquantes.length > 0 && (
          <div className="rounded-[14px] border border-[#FDE68A] bg-[var(--color-tsisy-amber-bg)] px-3.5 py-2.5">
            <p className="text-[11px] font-medium text-[#a16207]">
              Disciplines manquantes : {manquantes.join(', ')}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Autres stades (métriques génériques) ───────────────────────────────────
  const entries = Object.entries(metriques).filter(([k]) => !k.startsWith('_'))
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-[12px] text-[var(--color-text-muted)]">
        Aucune métrique disponible pour ce stade.
      </div>
    )
  }
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-disabled)] mb-3">
        Métriques
      </p>
      {entries.map(([k, v]) => (
        <MetriqueItem
          key={k}
          label={k.replace(/_/g, ' ')}
          value={typeof v === 'number' ? formatDecimal(v) : String(v)}
        />
      ))}
    </div>
  )
}
