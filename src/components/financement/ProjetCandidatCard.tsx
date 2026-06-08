import { type CandidatureAvecProjet } from '@/hooks/useInvestisseur'
import { StatutCandidature } from '@matura/shared'
import { cn } from '@/lib/utils'

const STATUT_LABELS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'En attente',
  [StatutCandidature.EN_REVUE]:   'En revue',
  [StatutCandidature.ACCEPTEE]:   'Acceptée',
  [StatutCandidature.REJETEE]:    'Rejetée',
  [StatutCandidature.RETIREE]:    'Retirée',
}

const STATUT_COLORS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [StatutCandidature.EN_REVUE]:   'bg-blue-50 text-blue-700 border-blue-200',
  [StatutCandidature.ACCEPTEE]:   'bg-green-50 text-green-700 border-green-200',
  [StatutCandidature.REJETEE]:    'bg-red-50 text-red-700 border-red-200',
  [StatutCandidature.RETIREE]:    'bg-zinc-100 text-zinc-500 border-zinc-200',
}

// BRL labels — correspond aux TypeStade Prisma
const BRL_LABELS: Record<number, string> = {
  1: 'Émergence',
  2: 'Idéation',
  3: 'Marché',
  4: 'BMC',
  5: 'Faisabilité',
  6: 'Prototype',
  7: 'Lancement',
}

interface Props {
  candidature: CandidatureAvecProjet
  detailOuvert: boolean
  onToggleDetail: () => void
  onChangerStatut: (statut: StatutCandidature) => void
  isUpdating: boolean
}

export function ProjetCandidatCard({
  candidature, detailOuvert, onToggleDetail, onChangerStatut, isUpdating,
}: Props) {
  const { projet, statut, createdAt, messageMotivation } = candidature
  const brl = projet.brl_actuel   // champ réel Prisma Projet

  return (
    <div className={cn(
      'bg-white border rounded-xl p-4 space-y-3',
      statut === StatutCandidature.ACCEPTEE ? 'border-green-200' :
      statut === StatutCandidature.REJETEE  ? 'border-red-100' : 'border-zinc-200',
    )}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="bg-green-50 border border-green-200 rounded-lg px-2 py-1 text-center shrink-0">
            <p className="text-[13px] font-medium text-green-700 leading-none">{brl}</p>
            <p className="text-[8px] text-green-600 mt-0.5">BRL</p>
          </div>
          <div className="flex-1 min-w-0">
            {/* "titre" = champ réel Prisma Projet */}
            <p className="text-[13px] font-medium text-zinc-800 truncate">{projet.titre}</p>
            <div className="flex flex-wrap gap-2 mt-0.5 text-[11px] text-zinc-400">
              {projet.proprietaire && (
                <span>👤 {projet.proprietaire.prenom} {projet.proprietaire.nom}</span>
              )}
              {projet.secteur && <span> {projet.secteur}</span>}
              {projet.region && <span> {projet.region}</span>}
              {projet.equipe && (
                <span>👥 {projet.equipe.length} membre{projet.equipe.length > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded border',
            STATUT_COLORS[statut as StatutCandidature],
          )}>
            {STATUT_LABELS[statut as StatutCandidature]}
          </span>
          {createdAt && (
            <p className="text-[10px] text-zinc-400">
              {new Date(createdAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {projet.description && (
        <p className="text-[11px] text-zinc-500 line-clamp-2">{projet.description}</p>
      )}

      {/* Infos universelles minimales */}
      <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400">
        {projet.statut && <span>{projet.statut}</span>}
        <span> BRL {brl} — {BRL_LABELS[brl] ?? `Stade ${brl}`}</span>
      </div>

      {/* Accordéon détail par stade */}
      <button
        onClick={onToggleDetail}
        aria-expanded={detailOuvert}
        className="w-full text-left text-[11px] text-zinc-500 hover:text-zinc-700 transition-colors py-1"
      >
        {detailOuvert
          ? '▲ Réduire les détails'
          : `▼ Voir les détails — BRL ${brl} : ${BRL_LABELS[brl] ?? ''}`}
      </button>

      {detailOuvert && (
        <div className="border-t border-zinc-100 pt-3">
          <StadeDetails projet={projet} brl={brl} />
        </div>
      )}

      {/* Message de motivation */}
      {messageMotivation && (
        <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5">
          <p className="text-[10px] text-zinc-400 mb-1">💬 Message de motivation</p>
          <p className="text-[11px] text-zinc-600">{messageMotivation}</p>
        </div>
      )}

      {/* Actions investisseur */}
      <div className="flex flex-wrap gap-2 pt-1">
        {statut === StatutCandidature.EN_ATTENTE && (
          <button
            disabled={isUpdating}
            onClick={() => onChangerStatut(StatutCandidature.EN_REVUE)}
            className="text-[11px] px-3 py-1.5 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            🔍 Mettre en revue
          </button>
        )}
        {(statut === StatutCandidature.EN_ATTENTE || statut === StatutCandidature.EN_REVUE) && (
          <>
            <button
              disabled={isUpdating}
              onClick={() => onChangerStatut(StatutCandidature.ACCEPTEE)}
              className="text-[11px] px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              ✓ Accepter
            </button>
            <button
              disabled={isUpdating}
              onClick={() => onChangerStatut(StatutCandidature.REJETEE)}
              className="text-[11px] px-3 py-1.5 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              ✕ Rejeter
            </button>
          </>
        )}
        {(statut === StatutCandidature.ACCEPTEE || statut === StatutCandidature.REJETEE) && (
          <button
            disabled={isUpdating}
            onClick={() => onChangerStatut(StatutCandidature.EN_REVUE)}
            className="text-[11px] px-3 py-1.5 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            ↩ Remettre en revue
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Détails par stade ────────────────────────────────────────────────────────
// Extrait les données depuis projet.stades (JSON Prisma) selon le BRL courant

function StadeDetails({ projet, brl }: { projet: CandidatureAvecProjet['projet']; brl: number }) {
  // Trouver le stade courant dans les stades du projet
  const typeStade = `STADE_${brl}_${(['EMERGENCE','IDEATION','MARCHE','BMC','FAISABILITE','PROTOTYPE','LANCEMENT'])[brl - 1] ?? brl}`
  const stade = projet.stades?.find((s) => s.type === typeStade) ?? projet.stades?.[brl - 1]
  const donnees = (stade?.donnees ?? {}) as Record<string, unknown>
  const finances = projet.finances
  const score = projet.score

  const items: { label: string; valeur: unknown }[] = []

  if (brl <= 2) {
    if (donnees.probleme_identifie) items.push({ label: 'Problème', valeur: donnees.probleme_identifie })
    if (donnees.proposition_valeur)  items.push({ label: 'Proposition de valeur', valeur: donnees.proposition_valeur })
    if (donnees.cible_principale)    items.push({ label: 'Cible', valeur: donnees.cible_principale })
    if (donnees.avantage_concurrentiel) items.push({ label: 'Avantage concurrentiel', valeur: donnees.avantage_concurrentiel })
  } else if (brl === 3) {
    if (donnees.tam)             items.push({ label: 'TAM', valeur: `${Number(donnees.tam).toLocaleString('fr')} MGA` })
    if (donnees.sam)             items.push({ label: 'SAM', valeur: `${Number(donnees.sam).toLocaleString('fr')} MGA` })
    if (donnees.positionnement)  items.push({ label: 'Positionnement', valeur: donnees.positionnement })
    if (stade?.score_auto)       items.push({ label: 'Score marché', valeur: `${stade.score_auto}/100` })
  } else if (brl === 4) {
    if (donnees.sources_revenus)  items.push({ label: 'Sources de revenus', valeur: String(donnees.sources_revenus) })
    if (donnees.canaux_distribution) items.push({ label: 'Canaux', valeur: String(donnees.canaux_distribution) })
    if (stade?.score_auto)        items.push({ label: 'Score BMC', valeur: `${stade.score_auto}/100` })
  } else if (brl === 5) {
    if (finances?.point_mort_unites) items.push({ label: 'Point mort', valeur: `${finances.point_mort_unites.toLocaleString('fr')} unités` })
    if (finances?.besoin_financement) items.push({ label: 'Besoin financement', valeur: `${finances.besoin_financement.toLocaleString('fr')} MGA` })
    if (finances?.autonomie_mois)    items.push({ label: 'Autonomie', valeur: `${finances.autonomie_mois} mois` })
    if (finances?.roi)               items.push({ label: 'ROI estimé', valeur: `${finances.roi}%` })
  } else if (brl === 6) {
    if (donnees.nb_clients_actifs) items.push({ label: 'Clients actifs', valeur: String(donnees.nb_clients_actifs) })
    if (donnees.score_nps)         items.push({ label: 'Score NPS', valeur: String(donnees.score_nps) })
    if (donnees.taux_retention_pct) items.push({ label: 'Rétention', valeur: `${donnees.taux_retention_pct}%` })
    if (stade?.score_auto)          items.push({ label: 'Score prototype', valeur: `${stade.score_auto}/100` })
  } else {
    // BRL 7
    if (donnees.clients_payants)    items.push({ label: 'Clients payants', valeur: String(donnees.clients_payants) })
    if (donnees.revenus_generes_ar) items.push({ label: 'Revenus générés', valeur: `${Number(donnees.revenus_generes_ar).toLocaleString('fr')} MGA` })
    if (donnees.resume_executif)    items.push({ label: 'Résumé exécutif', valeur: donnees.resume_executif })
    if (score?.score_global)        items.push({ label: 'Score global', valeur: `${score.score_global.toFixed(1)}/100` })
  }

  if (items.length === 0) {
    return <p className="text-[11px] text-zinc-400">Données du stade non disponibles.</p>
  }

  return (
    <dl className="space-y-1.5">
      {items.map(({ label, valeur }) => (
        <div key={label} className="flex items-start gap-2">
          <dt className="text-[10px] text-zinc-400 w-32 shrink-0 pt-0.5">{label}</dt>
          <dd className="text-[11px] text-zinc-700 flex-1">{String(valeur)}</dd>
        </div>
      ))}
    </dl>
  )
}
