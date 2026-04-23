import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useProjetDetail } from '@/hooks/useStades'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { StatutBadge } from '@/components/shared/StatutBadge'
import { StadeStepperH } from '@/components/shared/StadeStepperH'
import { cn } from '@/lib/utils'
import { DOMAINE_ICONS, STADE_LABELS } from '@/lib/constants'
import {
  CheckCircle2, Lock, ChevronRight, //MapPin,
  User, ArrowRight, Loader2, AlertCircle, Star,
} from 'lucide-react'
import type { StatutStade, TypeStade } from '@matura/shared'

// ─── CARD STADE ───────────────────────────────────────────────────────────────

interface StadeCardProps {
  id: string
  type: TypeStade
  numero: number
  statut: StatutStade
  score_auto: number | null
  completion_pct: number
  valide_le: string | null
  soumis_le: string | null
  projetId: string
}

function StadeCard({ numero, statut, score_auto, completion_pct, projetId, soumis_le }: StadeCardProps) {
  const label = STADE_LABELS[numero] ?? `Stade ${numero}`
  const isVerrouille = statut === 'VERROUILLE'

  const bgMap: Record<string, string> = {
    VALIDE: 'border-green-200 bg-green-50/40',
    SOUMIS: 'border-amber-200 bg-amber-50/40',
    EN_REVISION: 'border-red-200 bg-red-50/30',
    BROUILLON: 'border-blue-200 bg-blue-50/30',
    DEBLOQUE: 'border-zinc-200 bg-white',
    VERROUILLE: 'border-zinc-100 bg-zinc-50 opacity-50',
  }
  const numBg: Record<string, string> = {
    VALIDE: 'bg-green-100 text-green-700',
    SOUMIS: 'bg-amber-100 text-amber-700',
    EN_REVISION: 'bg-red-100 text-red-700',
    BROUILLON: 'bg-blue-100 text-blue-700',
    DEBLOQUE: 'bg-zinc-100 text-zinc-500',
    VERROUILLE: 'bg-zinc-100 text-zinc-400',
  }

  const inner = (
    <div className={cn('border rounded-xl p-4 transition-all', bgMap[statut] ?? 'border-zinc-200 bg-white', !isVerrouille && 'hover:shadow-sm')}>
      <div className="flex items-center gap-3">
        {/* Numéro */}
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0', numBg[statut])}>
          {statut === 'VALIDE' ? <CheckCircle2 className="w-4 h-4" /> : isVerrouille ? <Lock className="w-3.5 h-3.5" /> : numero}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-zinc-800">{numero}. {label}</span>
            <StatutBadge statut={statut} />
          </div>

          {/* Barre completion si actif */}
          {!isVerrouille && statut !== 'VALIDE' && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${completion_pct}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 shrink-0">{completion_pct}%</span>
            </div>
          )}

          {/* Score si évalué */}
          {score_auto !== null && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] text-zinc-500">Note mentor : {score_auto}/100</span>
            </div>
          )}

          {/* Soumis le */}
          {soumis_le && statut === 'SOUMIS' && (
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Soumis le {new Date(soumis_le).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>

        {!isVerrouille && <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />}
      </div>
    </div>
  )

  if (isVerrouille) return <div key={numero}>{inner}</div>

  return (
    <Link
      to="/projets/$projetId/stades/$numStade"
      params={{ projetId, numStade: String(numero) }}
    >
      {inner}
    </Link>
  )
}

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────────────────

export default function ProjetDetailPage() {
  const { projetId } = useParams({ from: '/(dashboard)/_layout/projets/$projetId/' })
  const navigate = useNavigate()
  const { data: projet, isLoading, isError } = useProjetDetail(projetId)

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-green-600" />
      </div>
    )
  }

  // ── Erreur ──
  if (isError || !projet) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-[13px] text-zinc-500">Projet introuvable ou accès refusé.</p>
      </div>
    )
  }

  // Stade actif = premier non VERROUILLE et non VALIDE
  const stadeActif = projet.stades.find(
    (s) => s.statut !== 'VERROUILLE' && s.statut !== 'VALIDE',
  ) ?? projet.stades.find((s) => s.statut === 'VALIDE' && s.numero === projet.brl_actuel)

  const scoreGlobal = projet.score?.score_global ?? null

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ── En-tête ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xl">{DOMAINE_ICONS[projet.domaine] ?? '📌'}</span>
            <BRLBadge brl={projet.brl_actuel} />
            <StatutBadge statut={projet.statut} />
          </div>
          <h1 className="text-[20px] text-zinc-900 leading-tight">{projet.titre}</h1>
          <p className="text-[12px] text-zinc-500 mt-1 line-clamp-2">{projet.description}</p>
        </div>

        {scoreGlobal !== null && scoreGlobal > 0 && (
          <div className="shrink-0 text-center bg-white border border-zinc-200 rounded-xl px-4 py-3">
            <p className="text-[22px] text-zinc-900 leading-none">{Math.round(scoreGlobal)}</p>
            <p className="text-[10px] text-zinc-400 mt-1">Score MCDA</p>
          </div>
        )}
      </div>

      {/* ── Méta-infos ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Domaine', value: projet.domaine },
          { label: 'Région', value: projet.region },
          { label: 'Cible', value: projet.type_cible },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-zinc-200 rounded-xl p-3">
            <p className="text-[10px] text-zinc-400">{item.label}</p>
            <p className="text-[12px] text-zinc-700 mt-0.5 font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── Mentor ── */}
      {projet.mentor && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-green-700" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400">Mentor assigné</p>
            <p className="text-[13px] text-zinc-800">{projet.mentor.prenom} {projet.mentor.nom}</p>
          </div>
        </div>
      )}

      {/* ── Stepper horizontal ── */}
      <div className="bg-white border border-zinc-200 rounded-xl px-5 py-2">
        <StadeStepperH
          stades={projet.stades.map((s) => ({
            type: s.type,
            numero: s.numero,
            statut: s.statut,
          }))}
          currentStade={stadeActif?.numero ?? 1}
          onStadeClick={(num) => {
            const s = projet.stades.find((st) => st.numero === num)
            if (s && s.statut !== 'VERROUILLE') {
              navigate({ to: '/projets/$projetId/stades/$numStade', params: { projetId, numStade: String(num) } })
            }
          }}
        />
      </div>

      {/* ── CTA stade actif ── */}
      {stadeActif && stadeActif.statut !== 'VERROUILLE' && (
        <Link
          to="/projets/$projetId/stades/$numStade"
          params={{ projetId, numStade: String(stadeActif.numero) }}
          className="flex items-center justify-between bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 py-3.5 transition-colors"
        >
          <div>
            <p className="text-[13px] font-medium">
              {stadeActif.statut === 'SOUMIS' ? 'En attente d\'évaluation' : `Continuer le Stade ${stadeActif.numero}`}
            </p>
            <p className="text-[11px] text-green-100 mt-0.5">
              {STADE_LABELS[stadeActif.numero]} · {stadeActif.statut === 'VALIDE' ? '100%' : `${stadeActif.completion_pct}%`}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </Link>
      )}

      {/* ── Liste des 7 stades ── */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">
          Parcours de maturation
        </p>
        <div className="space-y-2">
          {projet.stades.map((s) => (
            <StadeCard
              key={s.id}
              {...s}
              projetId={projetId}
            />
          ))}
        </div>
      </div>

      {/* ── Score détail ── */}
      {projet.score && scoreGlobal !== null && scoreGlobal > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">Scores MCDA</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Innovation', value: projet.score.score_innovation },
              { label: 'Marché', value: projet.score.score_marche },
              { label: 'Équipe', value: projet.score.score_equipe },
              { label: 'Finance', value: projet.score.score_finance },
              { label: 'Exécution', value: projet.score.score_execution },
            ].map((dim) => (
              <div key={dim.label} className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-2">
                <span className="text-[11px] text-zinc-600">{dim.label}</span>
                <span className={cn(
                  'text-[12px] font-medium',
                  dim.value >= 65 ? 'text-green-600' : dim.value >= 40 ? 'text-amber-600' : 'text-zinc-400',
                )}>
                  {dim.value > 0 ? Math.round(dim.value) : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
