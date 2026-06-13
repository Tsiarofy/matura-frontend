import { type CandidatureAvecProjet } from '@/hooks/useInvestisseur'
import { Link } from '@tanstack/react-router'
import { StatutCandidature } from '@matura/shared'
import { cn } from '@/lib/utils'
import { Briefcase, User, MapPin, Users } from 'lucide-react'

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
      'bg-white border rounded-[22px] p-6 space-y-4 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200',
      statut === StatutCandidature.ACCEPTEE ? 'border-green-200' :
      statut === StatutCandidature.REJETEE  ? 'border-red-100' : 'border-zinc-100',
    )}>

      {/* Header: Briefcase Icon + Title + Status Badges */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 shrink-0">
            <Briefcase className="w-4.5 h-4.5" strokeWidth={1.25} />
          </div>
          <h3 className="font-heading font-semibold text-[15px] text-zinc-900 truncate">
            {projet.titre}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-green-700">
            BRL {brl}
          </div>
          <span className={cn(
            'text-[9px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-[0.12em]',
            STATUT_COLORS[statut as StatutCandidature],
          )}>
            {STATUT_LABELS[statut as StatutCandidature]}
          </span>
          {createdAt && (
            <p className="text-[10px] text-zinc-400 font-semibold ml-1">
              {new Date(createdAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {/* Content block indented to align with the title */}
      <div className="pl-12 space-y-3">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-[11.5px] text-zinc-450 font-medium">
          {projet.proprietaire && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-300" />
              {projet.proprietaire.prenom} {projet.proprietaire.nom}
            </span>
          )}
          {projet.secteur && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              {projet.secteur}
            </span>
          )}
          {projet.region && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-300" />
              {projet.region}
            </span>
          )}
          {projet.equipe && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-zinc-300" />
              {projet.equipe.length} membre{projet.equipe.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Description */}
        {projet.description && (
          <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2 text-thin">
            {projet.description}
          </p>
        )}

        {/* Infos universelles minimales */}
        <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
          {projet.statut && <span className="bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-full">{projet.statut}</span>}
          <span className="bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-full">BRL {brl} — {BRL_LABELS[brl] ?? `Stade ${brl}`}</span>
        </div>

        {/* Accordéon détail par stade */}
        <button
          onClick={onToggleDetail}
          aria-expanded={detailOuvert}
          className="w-full text-left text-[11.5px] font-semibold text-zinc-550 hover:text-green-700 transition-colors py-1"
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
          <div className="bg-zinc-50 border border-zinc-100 rounded-[14px] px-4 py-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Message de motivation</p>
            <p className="text-[12px] text-zinc-650 italic leading-relaxed">"{messageMotivation}"</p>
          </div>
        )}

        {/* Actions investisseur */}
        <div className="flex flex-wrap gap-2 pt-2">
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
          <Link
            to="/projets-a-financer/$projetId"
            params={{ projetId: projet.id }}
            search={{ candidatureId: candidature.id, offreId: candidature.offre.id }}
            className="text-[11px] px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors inline-flex items-center"
          >
            📋 Voir détails du projet
          </Link>
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
    <dl className="grid grid-cols-2 gap-3">
      {items.map(({ label, valeur }) => (
        <div key={label} className="flex flex-col gap-1 bg-zinc-50 border border-zinc-100 rounded-[14px] p-3">
          <dt className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">{label}</dt>
          <dd className="text-[12px] font-medium text-zinc-800">{String(valeur)}</dd>
        </div>
      ))}
    </dl>
  )
}
