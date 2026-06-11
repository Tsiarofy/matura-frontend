import { Link } from '@tanstack/react-router'
import {
  Users,
  Clock,
  FileCheck2,
  AlertCircle,
  ArrowRight,
  User,
  MapPin,
  Tag
} from 'lucide-react'
import { useDashboardMentor } from '@/hooks/useDashboard'
import { useRepondreDemande } from '@/hooks/useAccompagnement'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <div className="h-24 w-full rounded-2xl bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-xl bg-zinc-100" />
          <div className="h-80 rounded-xl bg-zinc-100" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-red-100 bg-red-50/50">
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
    <div className="space-y-6">
      {/* ── Entête Minimaliste & Flat ── */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="PROJETS SUIVIS"
          value={stats.nb_projets_suivis}
          icon={Users}
          className={'border-secondary-orange-border bg-secondary-orange-bg'}
        />
        <StatCard
          label="ÉVALUATIONS EN ATTENTE"
          value={stats.nb_en_attente_evaluation}
          icon={Clock}
          className={stats.nb_en_attente_evaluation > 0 ? 'border-amber-200 bg-amber-50/30' : ''}
        />
        <StatCard
          label="DEMANDES D'ACCOMPAGNEMENT"
          value={stats.nb_demandes_attente}
          icon={FileCheck2}
          className={stats.nb_demandes_attente > 0 ? 'border-secondary-orange-border bg-secondary-orange-bg' : ''}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <Card className="lg:col-span-2 border-zinc-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[14px] font-semibold text-zinc-900">Mes projets suivis</CardTitle>
                <CardDescription className="text-[11px] text-zinc-500">
                  Liste des projets que vous accompagnez dans leur parcours.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-[11px] text-zinc-500 hover:text-zinc-900">
                <Link to="/projets-suivis">Voir tous ({projetsSuivis.length})</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {projetsSuivis.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-[12px]">
                Vous ne suivez aucun projet actuellement.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {projetsSuivis.slice(0, 5).map((p) => (
                  <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-semibold text-zinc-900">{p.titre}</h4>
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                          BRL {p.brl_actuel}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-zinc-400" />
                          {p.proprietaire.prenom} {p.proprietaire.nom}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                          {p.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5 text-zinc-400" />
                          {p.domaine}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {p.stade_actif ? (
                        <div className="text-right">
                          <span className="block text-[10px] text-zinc-400">Stade actif</span>
                          <span className="text-[11px] font-medium text-zinc-700">
                            Stade {p.stade_actif.numero}
                          </span>
                        </div>
                      ) : null}

                      {p.stade_actif?.en_attente_evaluation ? (
                        <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] h-8">
                          <Link to="/projets/$projetId" params={{ projetId: p.id }} search={{ stade: p.stade_actif.numero }}>
                            Évaluer
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" asChild className="text-[11px] h-8">
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
          </CardContent>
        </Card>

        {/* Demands / Requests */}
        <div className="space-y-6">
          <Card className="border-zinc-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-[14px] font-semibold text-zinc-900">Demandes en attente</CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                Demandes d'accompagnement d'entrepreneurs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demandes.length === 0 ? (
                <div className="text-center py-6 text-zinc-400 text-[12px]">
                  Aucune demande en attente.
                </div>
              ) : (
                demandes.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-xl border border-zinc-150 bg-zinc-50/50 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-[12px] font-semibold text-zinc-900">{d.projet?.titre}</h4>
                      <p className="text-[10px] text-zinc-500">
                        Par {d.projet?.proprietaire?.prenom} {d.projet?.proprietaire?.nom} (BRL {d.projet?.brl_actuel})
                      </p>
                    </div>

                    {d.message && (
                      <p className="text-[11px] text-zinc-600 italic bg-white p-2 rounded-lg border border-zinc-100 line-clamp-3">
                        "{d.message}"
                      </p>
                    )}

                    <div className="flex gap-2 justify-end pt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRepondre(d.id, 'REFUSE')}
                        disabled={repondreMutation.isPending}
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50 h-7"
                      >
                        Refuser
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRepondre(d.id, 'ACCEPTE')}
                        disabled={repondreMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] h-7"
                      >
                        Accepter
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-zinc-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-[14px] font-semibold text-zinc-900">Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activite} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
