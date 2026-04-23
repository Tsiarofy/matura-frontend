import { cn, formatAr } from '@/lib/utils'

interface MetriquesStadeProps {
  metriques: Record<string, unknown>
  numStade: number
}

function MetriqueItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-zinc-50 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className={cn('text-[13px] font-medium', highlight ? 'text-green-700' : 'text-zinc-800')}>
        {value}
      </span>
    </div>
  )
}

export function MetriquesStade({ metriques, numStade }: MetriquesStadeProps) {
  if (!metriques || Object.keys(metriques).length === 0) {
    return (
      <div className="text-center py-8 text-[12px] text-zinc-400">
        Enregistrez vos données pour voir les métriques calculées.
      </div>
    )
  }

  const get = (k: string) => metriques[k]

  // ── Stade 1 ──────────────────────────────────────────────────────────────────
  if (numStade === 1) {
    const score = get('score_solidite_probleme') as number | undefined
    const marche = get('marche_preliminaire_ar') as number | undefined
    const nb = get('nb_personnes_interrogees') as number | undefined
    const sol = get('nb_solutions_existantes') as number | undefined
    return (
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">Métriques Stade 1</p>
        {score !== undefined && <MetriqueItem label="Score solidité problème" value={`${score}/100`} highlight={score >= 50} />}
        {nb !== undefined && <MetriqueItem label="Personnes interrogées" value={String(nb)} />}
        {sol !== undefined && <MetriqueItem label="Solutions existantes" value={String(sol)} />}
        {marche !== undefined && marche > 0 && <MetriqueItem label="Marché préliminaire" value={formatAr(marche, { compact: true })} />}
      </div>
    )
  }

  // ── Stade 3 ──────────────────────────────────────────────────────────────────
  if (numStade === 3) {
    const score = get('score_marche') as number | undefined
    const ratio = get('ratio_revenu_pct') as number | undefined
    const realisme = get('niveau_realisme') as string | undefined
    const nb = get('nb_concurrents') as number | undefined
    const realismeColor = realisme === 'REALISTE' ? 'text-green-700' : realisme === 'ATTENTION' ? 'text-amber-700' : 'text-red-600'
    return (
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">Métriques Stade 3</p>
        {score !== undefined && <MetriqueItem label="Score marché" value={`${score}/100`} highlight={score >= 50} />}
        {nb !== undefined && <MetriqueItem label="Nombre de concurrents" value={String(nb)} />}
        {ratio !== undefined && <MetriqueItem label="Ratio prix/revenu (IRP)" value={`${ratio}%`} />}
        {realisme && (
          <div className="bg-zinc-50 rounded-lg px-3 py-2.5 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">Réalisme prix</span>
            <span className={cn('text-[12px] font-medium', realismeColor)}>{realisme}</span>
          </div>
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
        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">Métriques Stade 5</p>
        {pm !== undefined && <MetriqueItem label="Point mort (unités/an)" value={pm > 0 ? String(pm) : 'Non calculé'} highlight={pm > 0} />}
        {marge !== undefined && <MetriqueItem label="Marge sur coût variable" value={formatAr(marge)} highlight={marge > 0} />}
        {roi !== undefined && <MetriqueItem label="ROI estimé (an 3)" value={`${roi}%`} highlight={roi > 0} />}
        {scoreEquipe !== undefined && <MetriqueItem label="Interdisciplinarité équipe" value={`${scoreEquipe}%`} highlight={scoreEquipe >= 50} />}
        {ca && (
          <div className="bg-zinc-50 rounded-lg px-3 py-2.5 space-y-1">
            <span className="text-[11px] text-zinc-500 block mb-1">CA prévisionnel</span>
            <div className="flex gap-3 text-[11px]">
              {['annee1', 'annee2', 'annee3'].map((k, i) => (
                <div key={k} className="flex-1 text-center">
                  <p className="text-zinc-400">An {i + 1}</p>
                  <p className="text-zinc-800 font-medium">{formatAr(ca[k] ?? 0, { compact: true })}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {manquantes && manquantes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <p className="text-[11px] text-amber-700">
              Disciplines manquantes : {manquantes.join(', ')}
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Autres stades (métriques génériques) ──────────────────────────────────────
  const entries = Object.entries(metriques).filter(([k]) => !k.startsWith('_'))
  if (entries.length === 0) {
    return <div className="text-center py-8 text-[12px] text-zinc-400">Aucune métrique disponible pour ce stade.</div>
  }
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">Métriques</p>
      {entries.map(([k, v]) => (
        <MetriqueItem key={k} label={k.replace(/_/g, ' ')} value={String(v)} />
      ))}
    </div>
  )
}
