import { Link } from '@tanstack/react-router'
import {
  Users,
  Clock,
  FileCheck2,
  AlertCircle,
  ArrowRight,
  User,
  MapPin,
  Tag,
  Activity,
} from 'lucide-react'
import { useDashboardMentor } from '@/hooks/useDashboard'
import { useRepondreDemande } from '@/hooks/useAccompagnement'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface MentorDashboardProps {
  user: {
    prenom: string
    nom: string
    role: string
  }
}

export function MentorDashboard({ user }: MentorDashboardProps) {
  const {
    isLoading,
    isError,
    projetsSuivis,
    demandes,
    stats,
    activite,
  } = useDashboardMentor()

  const repondreMutation = useRepondreDemande()

  const handleRepondre = async (demandeId: string, statut: 'ACCEPTE' | 'REFUSE') => {
    repondreMutation.mutate({ demandeId, statut })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 rounded-xl bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-[22px] bg-zinc-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-[28px] bg-zinc-100" />
          <div className="h-80 rounded-[28px] bg-zinc-100" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-red-100 bg-red-50/50 rounded-[22px]">
        <CardContent className="flex items-center gap-3 py-6">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div className="text-[13px] text-red-800">
            Une erreur est survenue lors du chargement de votre tableau de bord mentor.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Entête ── */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
            Dashboard Mentor
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
            Bienvenue, {user.prenom}. Voici les projets que vous accompagnez.
          </p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Projets suivis"
          value={stats.nb_projets_suivis}
          icon={Users}
        />
        <StatCard
          label="Évaluations en attente"
          value={stats.nb_en_attente_evaluation}
          icon={Clock}
        />
        <StatCard
          label="Demandes d'accompagnement"
          value={stats.nb_demandes_attente}
          icon={FileCheck2}
        />
      </div>

      {/* ── Section Principale ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[28px] border border-[#eeeeea] bg-white p-5 shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              Mes projets suivis
            </h2>
            <Button size="sm" asChild variant="secondary" className="text-[11px] shadow-none cursor-pointer font-semibold rounded-xl h-8 px-3">
              <Link to="/projets-suivis">
                Voir tous ({projetsSuivis.length})
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {projetsSuivis.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)] text-[12px]">
              Vous ne suivez aucun projet actuellement.
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {projetsSuivis.slice(0, 5).map((p) => (
                <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-semibold text-[var(--color-text-primary)]">{p.titre}</h4>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]">
                        BRL {p.brl_actuel}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-[var(--color-text-disabled)]" />
                        {p.proprietaire?.prenom} {p.proprietaire?.nom}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[var(--color-text-disabled)]" />
                        {p.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5 text-[var(--color-text-disabled)]" />
                        {p.domaine}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {p.stade_actif ? (
                      <div className="text-right">
                        <span className="block text-[10px] text-[var(--color-text-disabled)] uppercase tracking-wider font-semibold">Stade actif</span>
                        <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
                          Stade {p.stade_actif.numero}
                        </span>
                      </div>
                    ) : null}

                    {p.stade_actif?.en_attente_evaluation ? (
                      <Button size="sm" asChild variant="outline" className="text-[11px] h-8 shadow-none cursor-pointer font-semibold rounded-xl px-3.5">
                        <Link to="/projets/$projetId" params={{ projetId: p.id }}>
                          Évaluer
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" asChild variant="neutral" className="text-[11px] h-8 shadow-none cursor-pointer font-semibold rounded-xl px-3.5 border border-[#eeeeea]">
                        <Link to="/projets/$projetId" params={{ projetId: p.id }}>
                          Consulter
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Demandes */}
          <Card className="rounded-[28px] border border-[#A6E3E1] bg-[#E2F7F6] p-5 shadow-none">
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)] mb-1">
              Demandes en attente
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)] mb-5">
              Demandes d'accompagnement reçues.
            </p>

            <div className="space-y-3">
              {demandes.length === 0 ? (
                <div className="text-center py-6 text-[var(--color-text-muted)] text-[12px]">
                  Aucune demande en attente.
                </div>
              ) : (
                demandes.map((d) => (
                  <div key={d.id} className="rounded-[18px] border border-[#A6E3E1] bg-white p-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[12px] font-semibold text-[var(--color-text-primary)]">{d.projet?.titre}</h4>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Par {d.projet?.proprietaire?.prenom} {d.projet?.proprietaire?.nom} · BRL {d.projet?.brl_actuel}
                      </p>
                    </div>

                    {d.message && (
                      <p className="text-[11px] text-[#0D7A75] italic bg-[#E2F7F6] p-2.5 rounded-[14px] border border-[#A6E3E1] line-clamp-3">
                        "{d.message}"
                      </p>
                    )}

                    <div className="flex gap-2 justify-end pt-1">
                      <Button
                        size="sm"
                        onClick={() => handleRepondre(d.id, 'REFUSE')}
                        disabled={repondreMutation.isPending}
                        variant="neutral"
                        className="h-7 text-[11px] px-3.5 rounded-lg shadow-none font-semibold cursor-pointer border border-[#eeeeea]"
                      >
                        Refuser
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRepondre(d.id, 'ACCEPTE')}
                        disabled={repondreMutation.isPending}
                        variant="default"
                        className="h-7 text-[11px] px-3.5 rounded-lg shadow-none font-semibold cursor-pointer border-none"
                      >
                        Accepter
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Activité
              </h2>
              <Activity size={14} className="text-[var(--color-text-muted)]" />
            </div>
            <ActivityFeed activities={activite} />
          </Card>
        </div>
      </div>
    </div>
  )
}
