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
import { Button } from '@/components/ui/button'
import { STADE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  Loader2, Bell, FolderOpen, CheckCircle2,
  XCircle, Clock, AlertCircle, Briefcase,
} from 'lucide-react'



function CarteDemande({ demande }: { demande: DemandeAccompagnement }) {
  const repondre = useRepondreDemande()
  const navigate = useNavigate()
  const projet = demande.projet
  const entrepreneur = projet?.proprietaire

  const isEnAttente = demande.statut === 'EN_ATTENTE'

  return (
    <div className={cn(
      'group w-full relative rounded-[22px] border bg-white p-6 flex flex-col justify-between gap-5 transition-all duration-300',
      isEnAttente
        ? 'border-[#A6E3E1] shadow-none'
        : 'border-zinc-100 opacity-70',
    )}>
      <div>
        {/* Header: Icon + Title + BRLBadge & Statut */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-[12px] bg-[#E2F7F6] border border-[#A6E3E1] flex items-center justify-center text-[#0D7A75] shrink-0">
            <Briefcase className="w-4.5 h-4.5" strokeWidth={1.25} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-[15px] font-semibold text-zinc-900 truncate">
              {projet?.titre ?? '—'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {projet?.brl_actuel !== undefined && (
              <BRLBadge brl={projet.brl_actuel} />
            )}
            <StatutBadge statut={demande.statut} />
          </div>
        </div>

   
        <div className="pl-12 space-y-3">
          {entrepreneur && (
            <p className="text-[12px] text-zinc-505 font-semibold leading-none">
              par {entrepreneur.prenom} {entrepreneur.nom}
            </p>
          )}

          {/* Description projet */}
          {projet?.description && (
            <p className="text-[12.5px] text-zinc-505 leading-relaxed line-clamp-2 text-thin">
              {projet.description}
            </p>
          )}

          {/* Message de l'entrepreneur */}
          {demande.message && (
            <div className="rounded-[14px] border border-[#A6E3E1] bg-[#E2F7F6] p-3.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#0D7A75] mb-1">Message de l'entrepreneur</p>
              <p className="text-[12px] text-[#0D7A75] italic font-medium leading-relaxed">"{demande.message}"</p>
            </div>
          )}

          {/* Date */}
          <p className="text-[10px] text-zinc-400 font-semibold">
            Reçu le {new Date(demande.cree_le).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Actions */}
      {isEnAttente && (
        <div className="flex gap-2 pt-2 pl-12">
          <Button
            onClick={() => repondre.mutate({ demandeId: demande.id, statut: 'REFUSE' })}
            disabled={repondre.isPending}
            variant="neutral"
            className="flex-1 h-9 rounded-[12px] text-[12px] font-semibold"
          >
            <XCircle className="w-3.5 h-3.5" />
            Refuser
          </Button>
          <Button
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
            variant="default"
            className="flex-1 h-9 rounded-[12px] text-[12px] font-semibold"
          >
            {repondre.isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <CheckCircle2 className="w-3.5 h-3.5" />
            }
            Accepter
          </Button>
        </div>
      )}
    </div>
  )
}


function CarteProjetSuivi({ projet }: { projet: ProjetSuivi }) {
  const stade = projet.stade_actif
  const label = stade ? STADE_LABELS[stade.numero] : null
  const needsEval = stade?.en_attente_evaluation

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-zinc-200 hover:shadow-none block"
    >
      <div>
        {/* Header: Avatar + Title + Badge */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-[12px] bg-[#eafdf3] border border-[#c5f3d8] flex items-center justify-center shrink-0 text-[12px] font-bold text-[#257a4e] transition-colors">
            {projet.titre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-[15px] font-semibold text-zinc-900 transition-colors truncate">
              {projet.titre}
            </h3>
          </div>
          {projet.brl_actuel !== undefined && (
            <BRLBadge brl={projet.brl_actuel} />
          )}
        </div>


        <div className="pl-12 space-y-2.5">
          <p className="text-[11.5px] text-zinc-550 font-semibold leading-none">
            {projet.proprietaire.prenom} {projet.proprietaire.nom} · <span className="text-zinc-400 font-medium">{projet.region}</span>
          </p>

          {stade && (
            <div className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.10em] border',
              needsEval
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-[#eafdf3] text-[#257a4e] border border-[#c5f3d8]',
            )}>
              {needsEval
                ? <AlertCircle className="w-3 h-3" />
                : <Clock className="w-3 h-3 text-[#257a4e]" />
              }
              Stade {stade.numero} — {label}
              {needsEval && ' · À évaluer'}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}


export default function DemandesPage() {
  const [onglet, setOnglet] = useState<'demandes' | 'projets'>('demandes')

  const { data: demandesData, isLoading: loadingDemandes } = useDemandesMentor()
  const { data: projetsSuivis, isLoading: loadingProjets } = useProjetsSuivis()

  const demandes = demandesData?.demandes ?? []
  const enAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE')
  const projets = projetsSuivis ?? []
  const projetsAvecEval = projets.filter((p) => p.stade_actif?.en_attente_evaluation)

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* En-tête */}
      <div>
        <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
          Espace mentor
        </h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
          Gérez vos demandes et évaluez les projets que vous suivez.
        </p>
      </div>

      <div className="flex p-1 bg-zinc-100/70 backdrop-blur-sm rounded-[16px] border border-zinc-200/40 max-w-full overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setOnglet('demandes')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-[12px] text-[12px] font-semibold transition-all cursor-pointer',
            onglet === 'demandes'
              ? 'bg-[#41A677] text-white shadow-sm'
              : 'text-zinc-500 hover:text-[#41A677]',
          )}
        >
          <Bell className={cn('w-3.5 h-3.5', onglet === 'demandes' ? 'text-white' : 'text-zinc-400')} />
          Demandes reçues
          {enAttente.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[var(--color-tsisy-amber)] text-white text-[9px] flex items-center justify-center font-bold">
              {enAttente.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setOnglet('projets')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-[12px] text-[12px] font-semibold transition-all cursor-pointer',
            onglet === 'projets'
              ? 'bg-[#41A677] text-white shadow-sm'
              : 'text-zinc-500 hover:text-[#41A677]',
          )}
        >
          <FolderOpen className={cn('w-3.5 h-3.5', onglet === 'projets' ? 'text-white' : 'text-zinc-400')} />
          Projets suivis
          {projetsAvecEval.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-[var(--color-tsisy-teal)] text-white text-[9px] flex items-center justify-center font-bold">
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
