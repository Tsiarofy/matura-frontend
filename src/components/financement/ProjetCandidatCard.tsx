import { type CandidatureAvecProjet } from '@/hooks/useInvestisseur'
import { Link } from '@tanstack/react-router'
import { StatutCandidature } from '@matura/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Briefcase, User, MapPin, Users, Eye, FileText, Check, X, RotateCcw } from 'lucide-react'

const STATUT_LABELS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'En attente',
  [StatutCandidature.EN_REVUE]:   'En revue',
  [StatutCandidature.ACCEPTEE]:   'Acceptée',
  [StatutCandidature.REJETEE]:    'Rejetée',
  [StatutCandidature.RETIREE]:    'Retirée',
}

const STATUT_COLORS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'bg-[#fff8e8] text-[#c47d00] border-[#f9d98a]',
  [StatutCandidature.EN_REVUE]:   'bg-[#E2F7F6] text-[#0D7A75] border-[#A6E3E1]',
  [StatutCandidature.ACCEPTEE]:   'bg-[#eafdf3] text-[#318055] border-[#c5f3d8]',
  [StatutCandidature.REJETEE]:    'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  [StatutCandidature.RETIREE]:    'bg-[#f6f6f4] text-[#757575] border-[#eeeeea]',
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
      'group w-full relative rounded-[22px] border bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 flex flex-col justify-between gap-5',
      statut === StatutCandidature.ACCEPTEE ? 'border-[#c5f3d8] bg-[#eafdf3]/30' :
      statut === StatutCandidature.REJETEE  ? 'border-[#FECACA] bg-[#FEF2F2]/30' :
      statut === StatutCandidature.EN_REVUE ? 'border-[#A6E3E1] bg-[#E2F7F6]/30' : 'border-zinc-100',
    )}>

      {/* Header: Icon + Title + Status Badges */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 shrink-0 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 transition-colors">
          <Briefcase className="w-4.5 h-4.5" strokeWidth={1.25} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-[15px] text-zinc-900 transition-colors truncate">
            {projet.titre}
          </h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-emerald-50 border border-emerald-200/50 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            BRL {brl}
          </div>
          <span className={cn(
            'text-[9px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-[0.12em]',
            STATUT_COLORS[statut as StatutCandidature],
          )}>
            {STATUT_LABELS[statut as StatutCandidature]}
          </span>
          {createdAt && (
            <p className="text-[10px] text-zinc-400 font-semibold ml-1 shrink-0">
              Postulé le {new Date(createdAt).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>

      {/* Content block indented */}
      <div className="pl-12 space-y-4">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-[11.5px] text-zinc-550 font-medium">
          {projet.proprietaire && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-zinc-400" />
              {projet.proprietaire.prenom} {projet.proprietaire.nom}
            </span>
          )}
          {projet.secteur && (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {projet.secteur}
            </span>
          )}
          {projet.region && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-zinc-400" />
              {projet.region}
            </span>
          )}
          {projet.equipe && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-zinc-450" />
              {projet.equipe.length} membre{projet.equipe.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Description */}
        {projet.description && (
          <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2">
            {projet.description}
          </p>
        )}

        {/* Infos universelles minimales */}
        <div className="flex flex-wrap gap-2 text-[9.5px] text-zinc-400 font-semibold uppercase tracking-wider">
          {projet.statut && <span className="bg-zinc-50 border border-zinc-200/60 px-2.5 py-0.5 rounded-full">{projet.statut}</span>}
          <span className="bg-zinc-50 border border-zinc-200/60 px-2.5 py-0.5 rounded-full">BRL {brl} — {BRL_LABELS[brl] ?? `Stade ${brl}`}</span>
        </div>

        {/* Accordéon détail par stade */}
        <button
          onClick={onToggleDetail}
          aria-expanded={detailOuvert}
          className="inline-flex items-center text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
        >
          {detailOuvert
            ? '▲ Réduire les détails'
            : `▼ Voir les détails — BRL ${brl} : ${BRL_LABELS[brl] ?? ''}`}
        </button>

        {detailOuvert && (
          <div className="border-t border-zinc-100/70 pt-4 animate-slide-down">
            <StadeDetails projet={projet} brl={brl} />
          </div>
        )}

        {/* Message de motivation */}
        {messageMotivation && (
          <div className="bg-zinc-50/40 border border-zinc-200/40 rounded-[20px] px-4.5 py-3.5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-[20px]" />
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Message de motivation</p>
            <p className="text-[12.5px] text-zinc-650 italic leading-relaxed">"{messageMotivation}"</p>
          </div>
        )}

        {/* Actions investisseur */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-100/85">
          {statut === StatutCandidature.EN_ATTENTE && (
            <button
              disabled={isUpdating}
              onClick={() => onChangerStatut(StatutCandidature.EN_REVUE)}
              className="inline-flex items-center gap-1.5 text-[11.5px] px-3.5 py-2 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50/50 transition-colors font-semibold disabled:opacity-50 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" /> Mettre en revue
            </button>
          )}
          {(statut === StatutCandidature.EN_ATTENTE || statut === StatutCandidature.EN_REVUE) && (
            <Link
              to="/projets-a-financer/$projetId"
              params={{ projetId: projet.id }}
              search={{ candidatureId: candidature.id, offreId: candidature.offre.id }}
              className="text-[11.5px] px-3.5 py-2 border border-zinc-200 text-zinc-650 hover:bg-zinc-550/10 rounded-xl transition-colors font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" /> Fiche projet
            </Link>
          )}
          {(statut === StatutCandidature.EN_ATTENTE || statut === StatutCandidature.EN_REVUE) && (
            <>
              <Button
                disabled={isUpdating}
                onClick={() => onChangerStatut(StatutCandidature.ACCEPTEE)}
                variant="default"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold shadow-none cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Accepter
              </Button>
              <Button
                disabled={isUpdating}
                onClick={() => onChangerStatut(StatutCandidature.REJETEE)}
                variant="destructive"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold shadow-none cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Rejeter
              </Button>
            </>
          )}
          {(statut === StatutCandidature.ACCEPTEE || statut === StatutCandidature.REJETEE) && (
            <>
              <Link
                to="/projets-a-financer/$projetId"
                params={{ projetId: projet.id }}
                search={{ candidatureId: candidature.id, offreId: candidature.offre.id }}
                className="text-[11.5px] px-3.5 py-2 border border-zinc-200 text-zinc-650 hover:bg-zinc-550/10 rounded-xl transition-colors font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" /> Fiche projet
              </Link>
              <Button
                disabled={isUpdating}
                onClick={() => onChangerStatut(StatutCandidature.EN_REVUE)}
                variant="orange"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold shadow-none cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Remettre en revue
              </Button>
            </>
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
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map(({ label, valeur }) => (
        <div key={label} className="flex flex-col gap-1 bg-zinc-50/45 border border-zinc-200/35 rounded-[14px] p-3">
          <dt className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">{label}</dt>
          <dd className="text-[12px] font-medium text-zinc-750 leading-normal">{String(valeur)}</dd>
        </div>
      ))}
    </dl>
  )
}
