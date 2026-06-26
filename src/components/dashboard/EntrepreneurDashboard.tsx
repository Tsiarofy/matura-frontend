import { Link } from "@tanstack/react-router";
import {
  Lightbulb,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FolderPlus,
  FolderOpen,
  Rocket,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useDashboardEntrepreneur } from "@/hooks/useDashboard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCard } from "@/components/shared/StatCard";
import { ProjectProgressChart } from "@/components/dashboard/ProjectProgressChart";
import { ScoreRadarChart } from "@/components/dashboard/ScoreRadarChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDecimal } from "@/lib/utils";
import type { ProjetResume } from "@matura/shared";

interface EntrepreneurDashboardProps {
  user: {
    prenom: string;
    nom: string;
    role: string;
  };
}

// ── Carte de projet dans la liste ────────────────────────────────────────────

function ProjetListCard({ projet }: { projet: ProjetResume }) {
  const brl = projet.brl_actuel ?? 0;

  return (
    <Link
      to="/projets/$projetId"
      params={{ projetId: projet.id }}
      className="group flex items-center gap-4 rounded-[22px] border border-[var(--color-border)] bg-white p-4 shadow-sm"
    >
      {/* Thumbnail Minimaliste */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-lg font-semibold text-white",
          "bg-[#41A677]",
        )}
      >
        {projet.titre.charAt(0)}
      </div>

      {/* Info Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-[var(--color-text-primary)]">
            {projet.titre}
          </p>
          <p className="shrink-0 text-[14px] font-semibold text-[var(--color-text-primary)]">
            BRL {brl}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant="outline"
            className="border-[var(--color-border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]"
          >
            {projet.domaine}
          </Badge>
          <span className="text-[11px] text-[var(--color-text-disabled)]">
            ·
          </span>
          <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
            {projet.region}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-[var(--color-text-disabled)]">
        <ArrowRight size={18} strokeWidth={1.25} />
      </div>
    </Link>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export function EntrepreneurDashboard({ user }: EntrepreneurDashboardProps) {
  const {
    isLoading,
    isError,
    projet,
    allProjets,
    detail,
    stades,
    stats,
    activite,
  } = useDashboardEntrepreneur();

  // ── État de chargement ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 w-full rounded-2xl bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 rounded-xl bg-zinc-100" />
          <div className="h-72 rounded-xl bg-zinc-100" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 rounded-xl bg-zinc-100" />
          <div className="h-64 rounded-xl bg-zinc-100" />
        </div>
      </div>
    );
  }

  // ── Erreur ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <Card className="border-red-100 bg-red-50/50">
        <CardContent className="flex items-center gap-3 py-6">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div className="text-[13px] text-red-800">
            Une erreur est survenue lors de la récupération des données de votre
            tableau de bord.
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Aucun projet ────────────────────────────────────────────────────────────
  if (!projet) {
    return (
      <div className="space-y-6">
        <WelcomeBanner
          prenom={user.prenom}
          role="Entrepreneur"
          subtitle="Commencez par créer votre premier projet pour initier votre parcours."
          icon={Lightbulb}
          colorClass="text-green-600"
          gradientClass="from-green-500/10 via-emerald-500/5 to-transparent"
          borderClass="border-green-200/60"
          iconBgClass="bg-green-100/50"
        />
        <Card className="border-zinc-200 bg-zinc-50/50 py-12 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-zinc-200 text-zinc-400">
              <FolderPlus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-[16px] font-medium text-zinc-900">
                Aucun projet trouvé
              </h2>
              <p className="text-[12px] text-zinc-500">
                Vous devez enregistrer votre projet pour accéder au diagnostic,
                aux évaluations des mentors et aux offres de financement.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#41A677] hover:bg-[#358E64] text-white mt-2 cursor-pointer border-none shadow-none"
            >
              <Link to="/projets">
                Créer un projet
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Entête Minimaliste & Flat ── */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
           Acceuil
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
            Bienvenue, {user.prenom}. Voici l'état de vos projets.
          </p>
        </div>
        <Button
          className="h-10 px-4 text-[12px] font-semibold bg-[#41A677] hover:bg-[#358E64] text-white border-none shadow-none cursor-pointer"
        >
          <FolderPlus className="mr-1.5 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {/* ── KPI Cards (Flat) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Mes projets"
          value={stats.nb_projets}
          icon={FolderOpen}
        />
        <StatCard
          label="Candidatures"
          value={stats.nb_candidatures}
          icon={Rocket}
        />
        <StatCard
          label="Taux Accepté"
          value={`${formatDecimal((stats.nb_candidatures_acceptees / (stats.nb_candidatures || 1)) * 100)}%`}
          icon={CheckCircle2}
          delta={
            stats.nb_candidatures > 0
              ? {
                  value: 12,
                  label: "vs mois dernier",
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatCard
          label="En attente"
          value={stats.nb_candidatures_en_attente}
          icon={Sparkles}
        />
      </div>

      {/* ── Section Principale ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Progression Maturation
              </h2>
              <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2.5 py-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  7 Stades
                </span>
              </div>
            </div>
            <div className="h-[260px] w-full">
              <ProjectProgressChart stades={stades} />
            </div>
          </Card>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-bold text-black tracking-tight">
                Projets Récents
              </h2>
              <Link
                to="/projets"
                className="flex items-center gap-1 text-[11.5px] font-semibold text-[var(--color-success-text)] transition-colors hover:text-[var(--color-success)]"
              >
                Voir tout <ArrowRight size={13} strokeWidth={1.25} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {allProjets.slice(0, 3).map((p) => (
                <ProjetListCard key={p.id} projet={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Droite */}
        <div className="space-y-6">
          <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-[#F8E6B9] bg-[#FFF8E8]">
                <ShieldCheck size={16} className="text-[#F59E0B]" />
              </div>
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Indice Maturité
              </h2>
            </div>
            <div className="py-1">
              <ScoreRadarChart score={detail?.score ?? null} />
            </div>
          </Card>

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
      </div>
    </div>
  );
}
