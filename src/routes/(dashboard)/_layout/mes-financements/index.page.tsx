import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMesOffres } from '@/hooks/useInvestisseur'
import { useMesCandidatures } from '@/hooks/useFinancements'
import {authStore} from '@/stores/authStore'
import { StatutOffre, StatutCandidature, TypeFinancement } from '@matura/shared'
import { Loader2, Plus } from 'lucide-react'
import { OffreFinancementForm } from '@/components/financement/OffreFinancementForm'

const TYPE_LABELS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]:  'Subvention',
  [TypeFinancement.PRET]:        'Prêt',
  [TypeFinancement.EQUITY]:      'Equity',
  [TypeFinancement.OBLIGATION]:  'Obligation',
  [TypeFinancement.DON]:         'Don',
}

const STATUT_OFFRE_COLORS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]:  'bg-green-50 text-green-700 border-green-200',
  [StatutOffre.EN_COURS]: 'bg-blue-50 text-blue-700 border-blue-200',
  [StatutOffre.FERMEE]:   'bg-zinc-100 text-zinc-500 border-zinc-200',
  [StatutOffre.CLOTUREE]: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}

const STATUT_OFFRE_LABELS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]:  'Ouverte',
  [StatutOffre.EN_COURS]: 'En cours',
  [StatutOffre.FERMEE]:   'Fermée',
  [StatutOffre.CLOTUREE]: 'Clôturée',
}

const STATUT_CAND_LABELS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'En attente',
  [StatutCandidature.EN_REVUE]:   'En revue',
  [StatutCandidature.ACCEPTEE]:   'Acceptée',
  [StatutCandidature.REJETEE]:    'Rejetée',
  [StatutCandidature.RETIREE]:    'Retirée',
}

const STATUT_CAND_COLORS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  [StatutCandidature.EN_REVUE]:   'bg-blue-50 text-blue-700 border-blue-200',
  [StatutCandidature.ACCEPTEE]:   'bg-green-50 text-green-700 border-green-200',
  [StatutCandidature.REJETEE]:    'bg-red-50 text-red-700 border-red-200',
  [StatutCandidature.RETIREE]:    'bg-zinc-100 text-zinc-500 border-zinc-200',
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function MesFinancementsPage() {
  const utilisateur = authStore((s) => s.utilisateur)
  const isInvestisseur = utilisateur?.role === 'INVESTISSEUR'
  return isInvestisseur ? <VueInvestisseur /> : <VueEntrepreneur />
}

// ─── VUE INVESTISSEUR ─────────────────────────────────────────────────────────

function VueInvestisseur() {
  const navigate = useNavigate()
  const { data: offres, isLoading, isError } = useMesOffres()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-zinc-900">Mes financements</h1>
          <p className="text-[12px] text-zinc-500 mt-1">
            Cliquez sur une offre pour voir les projets candidats
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nouvelle offre
        </button>
      </div>

      {showForm && (
        <OffreFinancementForm onClose={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-[12px] text-zinc-500">⚠️ Impossible de charger vos offres.</p>
        </div>
      ) : !offres || offres.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <p className="text-[13px] text-zinc-500">Aucune offre créée</p>
          <p className="text-[11px] text-zinc-400">
            Commencez par publier votre première offre de financement pour attirer des candidats.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 text-[12.5px] px-3.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            Créer une offre de financement
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {offres.map((offre) => (
            <article
              key={offre.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate({
                to: '/mes-financements/$offreId/candidatures',
                params: { offreId: offre.id },
              })}
              onKeyDown={(e) => e.key === 'Enter' && navigate({
                to: '/mes-financements/$offreId/candidatures',
                params: { offreId: offre.id },
              })}
              className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3 cursor-pointer hover:border-green-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                  <span className={[
                    'text-[10px] px-1.5 py-0.5 rounded border shrink-0',
                    STATUT_OFFRE_COLORS[offre.statut as StatutOffre],
                  ].join(' ')}>
                    {STATUT_OFFRE_LABELS[offre.statut as StatutOffre]}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border bg-zinc-50 text-zinc-600 border-zinc-200 shrink-0">
                    {TYPE_LABELS[offre.typeFinancement as TypeFinancement] ?? offre.typeFinancement}
                  </span>
                </div>

                {/* Compteur candidatures */}
                <div className={[
                  'flex flex-col items-center px-2.5 py-1 rounded-lg border shrink-0',
                  offre._count.candidatures > 0
                    ? 'bg-green-50 border-green-200'
                    : 'bg-zinc-50 border-zinc-200',
                ].join(' ')}>
                  <span className={[
                    'text-[15px] font-medium leading-none',
                    offre._count.candidatures > 0 ? 'text-green-700' : 'text-zinc-400',
                  ].join(' ')}>
                    {offre._count.candidatures}
                  </span>
                  <span className="text-[9px] text-zinc-400 mt-0.5">
                    candidature{offre._count.candidatures !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-medium text-zinc-800">{offre.titre}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">{offre.description}</p>
              </div>

              <div className="flex flex-wrap gap-3 text-[10px] text-zinc-400">
                <span>📊 BRL ≥ {offre.stadeCible}</span>
                {offre.dateCloture && <span>⏳ Clôture {formatDate(offre.dateCloture)}</span>}
                {offre.secteurs?.length > 0 && <span>🏭 {offre.secteurs.slice(0, 2).join(', ')}</span>}
              </div>

              <p className="text-[11px] text-green-600">
                {offre._count.candidatures > 0
                  ? `Voir les ${offre._count.candidatures} candidat${offre._count.candidatures > 1 ? 's' : ''} →`
                  : 'Voir les candidatures →'}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── VUE ENTREPRENEUR ─────────────────────────────────────────────────────────

function VueEntrepreneur() {
  const navigate = useNavigate()
  const { data: candidatures, isLoading, isError } = useMesCandidatures()

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] text-zinc-900">Mes candidatures</h1>
          <p className="text-[12px] text-zinc-500 mt-1">
            Suivez l'état de vos postulations
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/financements' })}
          className="text-[12px] px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          Parcourir les offres
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-[12px] text-zinc-500">⚠️ Impossible de charger vos candidatures.</p>
        </div>
      ) : !candidatures || candidatures.length === 0 ? (
        <div className="flex flex-col items-center py-12 gap-3 text-center">
          <p className="text-[13px] text-zinc-500">Aucune candidature soumise</p>
          <button
            onClick={() => navigate({ to: '/financements' })}
            className="text-[12px] text-green-600 hover:text-green-700"
          >
            Découvrir les offres disponibles →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <button
                    className="text-[13px] font-medium text-zinc-800 hover:text-green-700 transition-colors text-left"
                    onClick={() => navigate({
                      to: '/financements/$financementId',
                      params: { financementId: c.offreId },
                    })}
                  >
                    {c.offre?.titre}
                  </button>
                  {c.offre?.investisseur && (
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {/* prenom + nom car le service retourne les deux champs séparés */}
                      {c.offre.investisseur.prenom} {c.offre.investisseur.nom}
                    </p>
                  )}
                </div>
                <span className={[
                  'text-[10px] px-2 py-0.5 rounded border shrink-0',
                  STATUT_CAND_COLORS[c.statut as StatutCandidature],
                ].join(' ')}>
                  {STATUT_CAND_LABELS[c.statut as StatutCandidature]}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>📁</span>
                {/* titre = champ réel Prisma Projet (pas "nom") */}
                <span>{c.projet?.titre}</span>
                {c.projet?.brl_actuel !== undefined && (
                  /* brl_actuel = champ réel Prisma Projet (pas "brl") */
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded">
                    BRL {c.projet.brl_actuel}
                  </span>
                )}
              </div>

              <p className="text-[10px] text-zinc-400">
                Postulé le{' '}
                {c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : '–'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
