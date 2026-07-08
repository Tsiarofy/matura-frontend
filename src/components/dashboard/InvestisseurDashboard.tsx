import { Link } from '@tanstack/react-router'
import {
  Layers,
  FileText,
  Clock,
  Coins,
  AlertCircle,
  ArrowRight,
  Plus,
  Activity,
  BarChart2,
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
import { Card, CardContent } from '@/components/ui/card'
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
        <div className="h-10 w-64 rounded-xl bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
            Une erreur est survenue lors du chargement de votre tableau de bord investisseur.
          </div>
        </CardContent>
      </Card>
    )
  }

  const pipelineData = [
    { name: 'En attente', value: pipeline.EN_ATTENTE, color: '#f3b63f' },
    { name: 'En analyse', value: pipeline.EN_ANALYSE, color: '#1BA8A0' },
    { name: 'Acceptées', value: pipeline.ACCEPTE, color: '#41A677' },
    { name: 'Refusées', value: pipeline.REFUSE, color: '#DC2626' },
  ]

  return (
    <div className="space-y-8">
      {/* ── Entête ── */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
            Acceuil Investisseur
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
            Bienvenue, {user.prenom}. Gestion de vos offres de financement.
          </p>
        </div>
        <Button className="h-10 w-35 px-4 text-[12px] font-semibold flex  bg-[#41A677] hover:bg-[#358E64] text-white border-none shadow-none cursor-pointer">
          <Link to="/mes-financements">
            <Plus className="mr-1.5 h-4 w-4" />
            Nouvelle offre
          </Link>
        </Button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Offres actives"
          value={stats.nb_offres_actives}
          icon={Layers}
        />
        <StatCard
          label="Candidatures reçues"
          value={stats.nb_candidatures_recues}
          icon={FileText}
        />
        <StatCard
          label="En attente d'analyse"
          value={stats.nb_candidatures_en_attente}
          icon={Clock}
        />
        <StatCard
          label="Projets financés"
          value={stats.nb_projets_finances}
          icon={Coins}
        />
      </div>

      {/* ── Section Principale ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Chart */}
        <Card className="lg:col-span-2 rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                <BarChart2 size={16} className="text-[var(--color-success-text)]" />
              </div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Pipeline des candidatures
              </h2>
            </div>
            <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2.5 py-1">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Vue globale
              </span>
            </div>
          </div>
          <div className="h-[240px]">
            {candidatures.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[var(--color-text-muted)] text-[12px]">
                Aucune candidature à afficher.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={85} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ border: '1px solid #eeeeea', borderRadius: 12, fontSize: 12, boxShadow: '0 8px 20px rgba(20,20,20,0.04)' }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} background={{ fill: '#f6f6f4', radius: 6 }}>
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              Activité
            </h2>
            <Activity size={14} className="text-[var(--color-text-muted)]" />
          </div>
          <ActivityFeed activities={activite} />
        </Card>
      </div>

      {/* ── Offres Section ── */}
      <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              Mes offres actives
            </h2>
            <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
              Gérez vos offres et les candidatures reçues par offre.
            </p>
          </div>
          <Button size="sm" asChild variant="secondary" className="text-[11px] shadow-none cursor-pointer font-semibold rounded-xl h-8 px-3">
            <Link to="/mes-financements">
              Voir tout <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>

        {offres.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)] text-[12px]">
            Vous n'avez pas encore créé d'offre de financement.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offres.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="flex flex-col justify-between gap-4 rounded-[22px] border border-[var(--color-border)] bg-white p-5 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[13px] font-semibold text-[var(--color-text-primary)] line-clamp-1">{o.titre}</h4>
                    <Badge variant="outline" className="text-[9px] shrink-0 border-[var(--color-border)]">
                      Stade ≥ {o.stadeCible}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-2">{o.description}</p>
                </div>

                <div className="border-t border-[var(--color-border)] pt-3 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] text-[var(--color-text-disabled)] uppercase font-semibold tracking-wider">Candidatures</span>
                    <span className="font-semibold text-[13px] text-[var(--color-text-primary)]">
                      {o._count.candidatures} reçue{o._count.candidatures !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <Button size="sm" asChild variant="outline" className="text-[11px] h-7 px-3.5 shadow-none cursor-pointer font-semibold rounded-xl">
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
      </Card>
    </div>
  )
}
