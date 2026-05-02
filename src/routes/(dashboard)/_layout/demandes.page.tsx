import { useState } from 'react'
import { Link } from '@tanstack/react-router'
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
  Briefcase,
} from 'lucide-react'

// ─── CARTE DEMANDE ────────────────────────────────────────────────────────────

function CarteDemande({ demande }: { demande: DemandeAccompagnement }) {
  const repondre = useRepondreDemande()
  const projet = demande.projet
  const entrepreneur = projet?.proprietaire

  const isEnAttente = demande.statut === 'EN_ATTENTE'

  return (
    <div className={cn(
      'bg-white border rounded-xl p-4 space-y-3 transition-all',
      isEnAttente ? 'border-amber-200' : 'border-zinc-200 opacity-70',
    )}>
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
            <p className="text-[13px] font-medium text-zinc-800 truncate">
              {projet?.titre ?? '—'}
            </p>
            {projet?.brl_actuel !== undefined && (
              <BRLBadge brl={projet.brl_actuel} />
            )}
          </div>
          {entrepreneur && (
            <p className="text-[11px] text-zinc-400 mt-0.5">
              par {entrepreneur.prenom} {entrepreneur.nom}
            </p>
          )}
        </div>
        <StatutBadge statut={demande.statut} />
      </div>

      {/* Description projet */}
      {projet?.description && (
        <p className="text-[12px] text-zinc-500 line-clamp-2">{projet.description}</p>
      )}

      {/* Message de l'entrepreneur */}
      {demande.message && (
        <div className="bg-zinc-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-zinc-400 mb-0.5">Message</p>
          <p className="text-[12px] text-zinc-600 italic">"{demande.message}"</p>
        </div>
      )}

      {/* Date */}
      <p className="text-[10px] text-zinc-400">
        Reçu le {new Date(demande.cree_le).toLocaleDateString('fr-FR')}
      </p>

      {/* Actions */}
      {isEnAttente && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => repondre.mutate({ demandeId: demande.id, statut: 'REFUSE' })}
            disabled={repondre.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-[12px] hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-3.5 h-3.5" />
            Refuser
          </button>
          <button
            onClick={() => repondre.mutate({ demandeId: demande.id, statut: 'ACCEPTE' })}
            disabled={repondre.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
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

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="bg-white border border-zinc-200 rounded-xl p-4 hover:border-green-200 transition-colors block"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
          <Briefcase className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-medium text-zinc-800 truncate">
              {projet.titre}
            </p>
            <BRLBadge brl={projet.brl_actuel} />
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {projet.proprietaire.prenom} {projet.proprietaire.nom} · {projet.region}
          </p>

          {stade && (
            <div className={cn(
              'inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-[11px]',
              stade.en_attente_evaluation
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-zinc-50 text-zinc-600',
            )}>
              {stade.en_attente_evaluation
                ? <AlertCircle className="w-3 h-3" />
                : <Clock className="w-3 h-3" />
              }
              Stade {stade.numero} — {label}
              {stade.en_attente_evaluation && ' · À évaluer'}
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0 mt-1" />
      </div>
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

  console.log("demandesData", demandesData)
  console.log("projetsSuivis", projetsSuivis)
  console.log("demandes", demandes)
  console.log("enAttente", enAttente)
  console.log("projets", projets)
  console.log("projetsAvecEval", projetsAvecEval)
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* En-tête */}
      <div>
        <h1 className="text-[20px] text-zinc-900">Espace mentor</h1>
        <p className="text-[12px] text-zinc-500 mt-1">
          Gérez vos demandes et évaluez les projets que vous suivez.
        </p>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
        <button
          onClick={() => setOnglet('demandes')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] transition-all',
            onglet === 'demandes'
              ? 'bg-white text-zinc-800 font-medium shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          <Bell className="w-3.5 h-3.5" />
          Demandes reçues
          {enAttente.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] flex items-center justify-center">
              {enAttente.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setOnglet('projets')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] transition-all',
            onglet === 'projets'
              ? 'bg-white text-zinc-800 font-medium shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Projets suivis
          {projetsAvecEval.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-400 text-white text-[9px] flex items-center justify-center">
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
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : demandes.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-[13px] text-zinc-500">Aucune demande reçue.</p>
            </div>
          ) : (
            <>
              {enAttente.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-2">
                    En attente ({enAttente.length})
                  </p>
                  <div className="space-y-2">
                    {enAttente.map((d) => <CarteDemande key={d.id} demande={d} />)}
                  </div>
                </div>
              )}
              {demandes.filter((d) => d.statut !== 'EN_ATTENTE').length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-2 mt-4">
                    Traitées
                  </p>
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
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : projets.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-[13px] text-zinc-500">
                Vous ne suivez aucun projet pour l'instant.
              </p>
              <p className="text-[11px] text-zinc-400 text-center max-w-xs">
                Acceptez une demande d'accompagnement pour commencer.
              </p>
            </div>
          ) : (
            <>
              {projetsAvecEval.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-[12px] text-amber-700">
                    {projetsAvecEval.length} stade{projetsAvecEval.length > 1 ? 's' : ''} en attente d'évaluation.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {projets.map((p) => <CarteProjetSuivi key={p.id} projet={p} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
