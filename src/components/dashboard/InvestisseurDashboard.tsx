import { Link } from '@tanstack/react-router'
import {
  Layers,
  FileText,
  Clock,
  Coins,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useDashboardInvestisseur } from '@/hooks/useDashboard'
import { StatCard } from '@/components/shared/StatCard'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface InvestisseurDashboardProps {
  user: {
    prenom: string
    nom: string
    role: string
  }
}

export function InvestisseurDashboard({ user }: InvestisseurDashboardProps) {
  const {
    isLoading,
    isError,
    offres,
    candidatures,
    stats,
    pipeline,
    activite,
  } = useDashboardInvestisseur()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 w-full rounded-2xl bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
            Une erreur est survenue lors du chargement de votre tableau de bord investisseur.
          </div>
        </CardContent>
      </Card>
    )
  }

  const pipelineData = [
    { name: 'En attente', value: pipeline.EN_ATTENTE, color: '#f59e0b' },
    { name: 'En analyse', value: pipeline.EN_ANALYSE, color: '#3b82f6' },
    { name: 'Acceptées', value: pipeline.ACCEPTE, color: '#10b981' },
    { name: 'Refusées', value: pipeline.REFUSE, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      {/* ── Entête Minimaliste & Flat ── */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
            Dashboard Investisseur
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
            Bienvenue, {user.prenom}. Gestion de vos offres de financement.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="OFFRES ACTIVES"
          value={stats.nb_offres_actives}
          icon={Layers}
        />
        <StatCard
          label="CANDIDATURES REÇUES"
          value={stats.nb_candidatures_recues}
          icon={FileText}
        />
        <StatCard
          label="EN ATTENTE D'ANALYSE"
          value={stats.nb_candidatures_en_attente}
          icon={Clock}
          className={stats.nb_candidatures_en_attente > 0 ? 'border-amber-200 bg-amber-50/30' : ''}
        />
        <StatCard
          label="PROJETS FINANCÉS"
          value={stats.nb_projets_finances}
          icon={Coins}
          className={stats.nb_projets_finances > 0 ? 'border-secondary-orange-border bg-secondary-orange-bg' : ''}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Chart */}
        <Card className="lg:col-span-2 border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[14px] font-semibold text-zinc-900">Pipeline des candidatures</CardTitle>
            <CardDescription className="text-[11px] text-zinc-500">
              État d'avancement des candidatures reçues sur toutes vos offres.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] pt-4">
            {candidatures.length === 0 ? (
              <div className="flex h-full items-center justify-center text-zinc-400 text-[12px]">
                Aucune candidature à afficher.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} background={{ fill: '#f4f4f5', radius: 4 }}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-zinc-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-[14px] font-semibold text-zinc-900">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activite} />
          </CardContent>
        </Card>
      </div>

      {/* Offers Section */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[14px] font-semibold text-zinc-900">Mes offres de financement actives</CardTitle>
              <CardDescription className="text-[11px] text-zinc-500">
                Gérez vos offres créées et les candidatures reçues par offre.
              </CardDescription>
            </div>
            <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] h-8">
              <Link to="/mes-financements">
                <Plus className="mr-1 h-3.5 w-3.5" />
                Nouvelle offre
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {offres.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-[12px]">
              Vous n'avez pas encore créé d'offre de financement.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offres.slice(0, 3).map((o) => (
                <div key={o.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/30 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13px] font-semibold text-zinc-900 line-clamp-1">{o.titre}</h4>
                      <Badge variant="outline" className="text-[9px] shrink-0">
                        Stade &ge; {o.stadeCible}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-2">{o.description}</p>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 flex items-center justify-between text-[11px] text-zinc-500">
                    <div>
                      <span className="block text-[9px] text-zinc-400 uppercase font-semibold">Candidatures</span>
                      <span className="font-semibold text-zinc-800">{o._count.candidatures} reçue(s)</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-[11px] h-7 px-2.5">
                      <Link to="/mes-financements/$offreId/candidatures" params={{ offreId: o.id }}>
                        Gérer
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
