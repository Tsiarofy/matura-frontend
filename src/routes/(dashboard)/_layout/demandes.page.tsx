import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  useDemandesMentor,
  useRepondreDemande,
  useProjetsSuivis,
  type DemandeAccompagnement,
  type ProjetSuivi,
} from '@/hooks/useAccompagnement'
import { StatutBadge } from '@/components/shared/StatutBadge'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { STADE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  Loader2, Bell, FolderOpen, CheckCircle2,
  XCircle, ChevronRight, Clock, AlertCircle,
} from 'lucide-react'

// ─── CARTE DEMANDE ────────────────────────────────────────────────────────────

function CarteDemande({ demande }: { demande: DemandeAccompagnement }) {
  const repondre = useRepondreDemande()
  const navigate = useNavigate()
  const projet = demande.projet
  const entrepreneur = projet?.proprietaire

  const isEnAttente = demande.statut === 'EN_ATTENTE'

  return (
    <div className={cn(
      'bg-white border rounded-[18px] p-5 space-y-3 transition-all',
      isEnAttente
        ? 'border-[#FDE68A]'
        : 'border-[var(--color-border)] opacity-70',
    )}>
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">
              {projet?.titre ?? '—'}
            </p>
            {projet?.brl_actuel !== undefined && (
              <BRLBadge brl={projet.brl_actuel} />
            )}
          </div>
          {entrepreneur && (
            <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
              par {entrepreneur.prenom} {entrepreneur.nom}
            </p>
          )}
        </div>
        <StatutBadge statut={demande.statut} />
      </div>

      {/* Description projet */}
      {projet?.description && (
        <p className="text-[12px] text-[var(--color-text-muted)] line-clamp-2">{projet.description}</p>
      )}

      {/* Message de l'entrepreneur */}
      {demande.message && (
        <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2.5">
          <p className="text-[10px] font-semibold text-[var(--color-text-disabled)] mb-0.5">Message</p>
          <p className="text-[12px] text-[var(--color-text-secondary)] italic">"{demande.message}"</p>
        </div>
      )}

      {/* Date */}
      <p className="text-[10px] text-[var(--color-text-disabled)] font-medium">
        Reçu le {new Date(demande.cree_le).toLocaleDateString('fr-FR')}
      </p>

      {/* Actions */}
      {isEnAttente && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => repondre.mutate({ demandeId: demande.id, statut: 'REFUSE' })}
            disabled={repondre.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-[12px] text-[12px] font-semibold hover:bg-[var(--color-error-bg)] hover:text-[var(--color-error)] hover:border-[var(--color-error-border)] transition-all disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            Refuser
          </button>
          <button
            onClick={() =>
              repondre.mutate(
                { demandeId: demande.id, statut: 'ACCEPTE' },
                {
                  onSuccess: (result) => {
                    if (!result.redirection_missions) return

                    const { projetId, numStade } = result.redirection_missions
                    navigate({
                      to: '/projets/$projetId/stades/$numStade/definir-missions',
                      params: { projetId, numStade: String(numStade) },
                    })
                  },
                },
              )
            }
            disabled={repondre.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[var(--color-success)] hover:brightness-95 text-white rounded-[12px] text-[12px] font-semibold transition-all disabled:opacity-50"
          >
            {repondre.isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <CheckCircle2 className="w-3.5 h-3.5" />
            }
            Accepter
          </button>
        </div>
      )}
    </div>
  )
}

// ─── CARTE PROJET SUIVI ───────────────────────────────────────────────────────

function CarteProjetSuivi({ projet }: { projet: ProjetSuivi }) {
  const stade = projet.stade_actif
  const label = stade ? STADE_LABELS[stade.numero] : null
  const needsEval = stade?.en_attente_evaluation

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="panel-flat p-4 flex items-start gap-3 group hover:border-zinc-300 hover:shadow-sm transition-all duration-200 block"
    >
      <div className="w-8 h-8 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold text-[var(--color-text-muted)] group-hover:bg-[var(--color-success-bg)] group-hover:border-[var(--color-success-border)] group-hover:text-[var(--color-success-text)] transition-colors">
        {projet.titre.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-success-text)] transition-colors">
            {projet.titre}
          </p>
          <BRLBadge brl={projet.brl_actuel} />
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
          {projet.proprietaire.prenom} {projet.proprietaire.nom} · {projet.region}
        </p>

        {stade && (
          <div className={cn(
            'inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-semibold border',
            needsEval
              ? 'bg-[var(--color-tsisy-amber-bg)] text-[#a16207] border-[#FDE68A]'
              : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border)]',
          )}>
            {needsEval
              ? <AlertCircle className="w-3 h-3" />
              : <Clock className="w-3 h-3" />
            }
            Stade {stade.numero} — {label}
            {needsEval && ' · À évaluer'}
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-[var(--color-text-disabled)] group-hover:text-[var(--color-success)] shrink-0 mt-1 transition-colors" />
    </Link>
  )
}

// ─── PAGE DEMANDES ────────────────────────────────────────────────────────────

export default function DemandesPage() {
  const [onglet, setOnglet] = useState<'demandes' | 'projets'>('demandes')

  const { data: demandesData, isLoading: loadingDemandes } = useDemandesMentor()
  const { data: projetsSuivis, isLoading: loadingProjets } = useProjetsSuivis()

  const demandes = demandesData?.demandes ?? []
  const enAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE')
  const projets = projetsSuivis ?? []
  const projetsAvecEval = projets.filter((p) => p.stade_actif?.en_attente_evaluation)

  return (
    <div className="page-shell max-w-3xl mx-auto w-full">
      {/* En-tête */}
      <div>
        <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
          Espace mentor
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
          Gérez vos demandes et évaluez les projets que vous suivez.
        </p>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1">
        <button
          onClick={() => setOnglet('demandes')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-[12px] text-[12px] font-semibold transition-all',
            onglet === 'demandes'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
          )}
        >
          <Bell className="w-3.5 h-3.5" />
          Demandes reçues
          {enAttente.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[var(--color-tsisy-amber)] text-white text-[9px] flex items-center justify-center">
              {enAttente.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setOnglet('projets')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-[12px] text-[12px] font-semibold transition-all',
            onglet === 'projets'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
          )}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Projets suivis
          {projetsAvecEval.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[var(--color-error)] text-white text-[9px] flex items-center justify-center">
              {projetsAvecEval.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Onglet Demandes ── */}
      {onglet === 'demandes' && (
        <div className="space-y-3">
          {loadingDemandes ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-success)]" />
            </div>
          ) : demandes.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
              <p className="text-[13px] text-[var(--color-text-muted)]">Aucune demande reçue.</p>
            </div>
          ) : (
            <>
              {enAttente.length > 0 && (
                <div>
                  <p className="flat-label mb-2">En attente ({enAttente.length})</p>
                  <div className="space-y-2">
                    {enAttente.map((d) => <CarteDemande key={d.id} demande={d} />)}
                  </div>
                </div>
              )}
              {demandes.filter((d) => d.statut !== 'EN_ATTENTE').length > 0 && (
                <div>
                  <p className="flat-label mb-2 mt-4">Traitées</p>
                  <div className="space-y-2">
                    {demandes
                      .filter((d) => d.statut !== 'EN_ATTENTE')
                      .map((d) => <CarteDemande key={d.id} demande={d} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Onglet Projets suivis ── */}
      {onglet === 'projets' && (
        <div className="space-y-3">
          {loadingProjets ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-success)]" />
            </div>
          ) : projets.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                <FolderOpen className="w-5 h-5 text-[var(--color-text-muted)]" />
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                  Vous ne suivez aucun projet pour l'instant.
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] text-center max-w-xs">
                  Acceptez une demande d'accompagnement pour commencer.
                </p>
              </div>
            </div>
          ) : (
            <>
              {projetsAvecEval.length > 0 && (
                <div className="flex items-center gap-3 rounded-[18px] border border-[#FDE68A] bg-[var(--color-tsisy-amber-bg)] px-4 py-3.5">
                  <AlertCircle className="w-4 h-4 text-[var(--color-tsisy-amber)] shrink-0" />
                  <p className="text-[12px] font-semibold text-[#a16207]">
                    {projetsAvecEval.length} stade{projetsAvecEval.length > 1 ? 's' : ''} en attente d'évaluation.
                  </p>
                </div>
              )}
              <div className="space-y-2.5">
                {projets.map((p) => <CarteProjetSuivi key={p.id} projet={p} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
