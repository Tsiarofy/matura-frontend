import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import { useFicheInvestisseur, useChangerStatutCandidature, useCandidaturesOffre } from '@/hooks/useInvestisseur'
import {
  Loader2, ArrowLeft, BarChart2, MapPin, Calendar, CheckCircle2, XCircle,
} from 'lucide-react'
import { FicheProjetInvestisseur } from '@/components/financement/FicheProjetInvestisseur'
import { cn } from '@/lib/utils'

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="border border-zinc-100 bg-white rounded-[22px] p-6">
      <h2 className="font-heading flex items-center gap-2 text-[14px] font-semibold text-[var(--color-text-primary)] mb-5 pb-3.5 border-b border-zinc-100">
        <span className="flex items-center justify-center h-7 w-7 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

// ── Score Bar ──────────────────────────────────────────────────────────────────

function ScoreBar({ label, value }: { label: string; value: number | null | undefined }) {
  const v = Math.min(Math.max(Math.round(value ?? 0), 0), 100)
  const color = v >= 65
    ? 'bg-[var(--color-success)]'
    : v >= 40
      ? 'bg-[var(--color-tsisy-amber)]'
      : 'bg-zinc-300'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{label}</span>
        <span className={cn(
          'text-[11px] font-semibold px-2 py-0.5 rounded-full',
          v >= 65 ? 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]' : v >= 40 ? 'bg-[var(--color-tsisy-amber-bg)] text-[#a16207]' : 'bg-zinc-100 text-zinc-500'
        )}>{v}</span>
      </div>
      <div className="h-1.5 bg-[var(--color-surface-soft)] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────────

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
        <Loader2 className="w-6 h-6 animate-spin text-[#6f74f7]" />
        <p className="text-[12px] text-[var(--color-text-muted)]">Chargement du dossier investisseur…</p>
      </div>
    )
  }

  if (isError || !fiche) {
    return (
      <div className="flex flex-col items-center py-16 gap-3 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-[13px] text-[var(--color-text-muted)]">Impossible de charger ce projet.</p>
        <button
          className="text-[12px] font-semibold text-[#6f74f7] hover:text-[#5c61e8] transition-colors"
          onClick={() => navigate({ to: '/projets-a-financer' })}
        >
          ← Retour aux projets
        </button>
      </div>
    )
  }

  const { identite, score } = fiche

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* ── Back ── */}
      <button
        className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        onClick={() => {
          if (offreId) {
            navigate({ to: '/mes-financements/$offreId/candidatures', params: { offreId } })
          } else {
            navigate({ to: '/projets-a-financer' })
          }
        }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {offreId ? 'Retour aux candidatures' : 'Retour aux projets'}
      </button>

      {/* ── En-tête héros ── */}
      <div className="border border-zinc-100 bg-white rounded-[22px] p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[10px] px-2.5 py-1 bg-[var(--color-success-bg)] text-[var(--color-success-text)] border border-[var(--color-success-border)] rounded-full font-semibold">
                BRL {identite.brl_actuel}
              </span>
              {identite.domaine && (
                <span className="text-[10px] px-2.5 py-1 bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-full font-semibold">
                  {identite.domaine}
                </span>
              )}
              {identite.region && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] font-medium">
                  <MapPin className="w-3 h-3" /> {identite.region}
                </span>
              )}
              {identite.date_creation && (
                <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] font-medium">
                  <Calendar className="w-3 h-3" />
                  {new Date(identite.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
            <h1 className="text-[24px] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
              {identite.titre}
            </h1>
          </div>

          {/* Score global */}
          {score && (
            <div className="flex flex-col items-center px-5 py-4 bg-[var(--color-success-bg)] border border-[var(--color-success-border)] rounded-[18px] shrink-0">
              <span className="text-[28px] font-bold text-[var(--color-success-text)] leading-none">
                {Math.round(score.score_global)}
              </span>
              <span className="text-[9px] text-[var(--color-success-text)]/70 mt-1 font-semibold uppercase tracking-wider">
                score global
              </span>
            </div>
          )}
        </div>

        {identite.resume_executif && (
          <p className="mt-4 text-[13px] text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] pt-4">
            {identite.resume_executif}
          </p>
        )}
      </div>

      {/* ── Scores MCDA ── */}
      {score && (
        <Section icon={<BarChart2 className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />} title="Scores d'évaluation MCDA">
          <div className="space-y-4">
            {[
              { label: 'Innovation', val: score.score_innovation },
              { label: 'Marché',     val: score.score_marche },
              { label: 'Équipe',     val: score.score_equipe },
              { label: 'Finance',    val: score.score_finance },
              { label: 'Exécution', val: score.score_execution },
            ].map(({ label, val }) => (
              <ScoreBar key={label} label={label} value={val} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Fiche Complète ── */}
      <FicheProjetInvestisseur fiche={fiche} />

      {/* ── Decision Investisseur ── */}
      {candidature && (
        <div className="border border-zinc-100 bg-white rounded-[22px] p-6">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                Décision de financement
              </p>
              <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
                Statut actuel :{' '}
                <span className="font-semibold text-[var(--color-text-secondary)]">{candidature.statut}</span>
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
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-success)] hover:brightness-95 text-white rounded-[12px] text-[12px] font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accepter
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
                    className="flex items-center gap-1.5 px-4 py-2 border border-[var(--color-error-border)] text-[var(--color-error)] rounded-[12px] hover:bg-[var(--color-error-bg)] text-[12px] font-semibold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Rejeter
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
                  className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-[12px] hover:bg-[var(--color-surface-soft)] text-[12px] font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  ↩ Remettre en revue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
