import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useFicheInvestisseur, useChangerStatutCandidature, useCandidaturesOffre } from '@/hooks/useInvestisseur'
import { Loader2, ArrowLeft, BarChart2 } from 'lucide-react'
import { FicheProjetInvestisseur } from '@/components/financement/FicheProjetInvestisseur'

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-zinc-100 rounded-[22px] p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-[14px] font-semibold text-zinc-900 mb-4 pb-3 border-b border-zinc-100">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * Page de détail d'un projet vue par un investisseur.
 * Utilise l'endpoint /investisseur/projets/:projetId/fiche
 * qui renvoie la structure FicheInvestisseur (12 dimensions).
 */
export default function ProjetAFinancerDetailPage() {
  const { projetId } = useParams({ from: '/(dashboard)/_layout/projets-a-financer/$projetId' })
  const navigate = useNavigate()
  const { candidatureId, offreId } = useSearch({ from: '/(dashboard)/_layout/projets-a-financer/$projetId' })
  const { data: fiche, isLoading, isError } = useFicheInvestisseur(projetId)

  const { data: candidatures } = useCandidaturesOffre(offreId ?? '', !!offreId)
  const candidature = candidatures?.find((c) => c.id === candidatureId)
  const changerStatut = useChangerStatutCandidature()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <p className="text-[12px] text-zinc-400">Chargement du dossier investisseur…</p>
      </div>
    )
  }

  if (isError || !fiche) {
    return (
      <div className="flex flex-col items-center py-16 gap-3 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-[13px] text-zinc-500">Impossible de charger ce projet.</p>
        <button
          className="text-[12px] text-green-600 hover:text-green-700"
          onClick={() => navigate({ to: '/projets-a-financer' })}
        >
          ← Retour aux projets
        </button>
      </div>
    )
  }

  const { identite, score } = fiche

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      {/* ── Retour ──────────────────────────────────────────────────────── */}
      <button
        className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors"
        onClick={() => {
          if (offreId) {
            navigate({ to: '/mes-financements/$offreId/candidatures', params: { offreId } })
          } else {
            navigate({ to: '/projets-a-financer' })
          }
        }}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {offreId ? 'Retour aux candidatures' : 'Retour aux projets'}
      </button>

      {/* ── En-tête ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-zinc-100 rounded-[22px] p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-medium">
                BRL {identite.brl_actuel}
              </span>
              {identite.domaine && (
                <span className="text-[11px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                  {identite.domaine}
                </span>
              )}
              {identite.region && (
                <span className="text-[11px] text-zinc-400">📍 {identite.region}</span>
              )}
            </div>
            <h1 className="text-[18px] font-semibold text-zinc-900">{identite.titre}</h1>
            {identite.date_creation && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Créé le {new Date(identite.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Score global */}
          {score && (
            <div className="flex flex-col items-center px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <span className="text-[22px] font-bold text-green-700 leading-none">
                {Math.round(score.score_global)}
              </span>
              <span className="text-[9px] text-zinc-500 mt-0.5">score global</span>
            </div>
          )}
        </div>

        {identite.resume_executif && (
          <p className="mt-3 text-[12px] text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
            {identite.resume_executif}
          </p>
        )}
      </div>

      {/* ── Scores MCDA ─────────────────────────────────────────────────── */}
      {score && (
        <Section icon={<BarChart2 className="w-4 h-4" />} title="Scores d'évaluation">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Innovation', val: score.score_innovation },
              { label: 'Marché',     val: score.score_marche },
              { label: 'Équipe',     val: score.score_equipe },
              { label: 'Finance',    val: score.score_finance },
              { label: 'Exécution', val: score.score_execution },
            ].map(({ label, val }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">{label}</span>
                  <span className="text-[10px] text-zinc-700 font-medium">{Math.round(val ?? 0)}</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min(val ?? 0, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Fiche Complète ─────────────────────────────────────────────────── */}
      <div className="mt-8">
        <FicheProjetInvestisseur fiche={fiche} />
      </div>

      {/* ── Actions Investisseur ───────────────────────────────────────────── */}
      {candidature && (
        <div className="flex gap-4 mt-6 p-5 bg-zinc-50 rounded-xl border border-zinc-200 items-center flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <p className="text-[13px] text-zinc-800 font-semibold">
              Décision de financement
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Statut actuel de la candidature : <span className="font-semibold text-zinc-700">{candidature.statut}</span>
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {(candidature.statut === 'EN_ATTENTE' || candidature.statut === 'EN_REVUE') && (
              <>
                <button
                  disabled={changerStatut.isPending}
                  onClick={() =>
                    changerStatut.mutate(
                      { candidatureId: candidatureId!, statut: 'ACCEPTEE' as any, offreId: offreId! },
                      {
                        onSuccess: () =>
                          navigate({
                            to: '/mes-financements/$offreId/candidatures',
                            params: { offreId: offreId! },
                          }),
                      }
                    )
                  }
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  ✓ Accepter
                </button>
                <button
                  disabled={changerStatut.isPending}
                  onClick={() =>
                    changerStatut.mutate(
                      { candidatureId: candidatureId!, statut: 'REJETEE' as any, offreId: offreId! },
                      {
                        onSuccess: () =>
                          navigate({
                            to: '/mes-financements/$offreId/candidatures',
                            params: { offreId: offreId! },
                          }),
                      }
                    )
                  }
                  className="px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-[12px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  ✕ Rejeter
                </button>
              </>
            )}
            {(candidature.statut === 'ACCEPTEE' || candidature.statut === 'REJETEE') && (
              <button
                disabled={changerStatut.isPending}
                onClick={() =>
                  changerStatut.mutate({
                    candidatureId: candidatureId!,
                    statut: 'EN_REVUE' as any,
                    offreId: offreId!,
                  })
                }
                className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 text-[12px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                ↩ Remettre en revue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

