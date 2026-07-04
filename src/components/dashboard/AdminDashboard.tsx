import { Link } from "@tanstack/react-router";
import {
  Users,
  BriefcaseBusiness,
  Rocket,
  AlertCircle,
  FolderOpen
} from "lucide-react";
import { useAdminStats } from "@/hooks/useAdmin";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  user: {
    prenom: string;
    nom: string;
    role: string;
  };
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 w-full rounded-2xl bg-zinc-100" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-zinc-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <Card className="border-red-100 bg-red-50/50">
        <CardContent className="flex items-center gap-3 py-6">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div className="text-[13px] text-red-800">
            Une erreur est survenue lors de la récupération des données de votre
            tableau de bord administrateur.
          </div>
        </CardContent>
      </Card>
    );
  }

  const enAttenteTotal = stats.nb_mentors_en_attente + stats.nb_investisseurs_en_attente;

  return (
    <div className="space-y-8">
      {/* ── Entête Minimaliste & Flat ── */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
           Administration
          </h1>
          <p className="text-[13px] font-medium text-[var(--color-text-muted)]">
            Bienvenue, {user.prenom}. Voici l'état de la plateforme.
          </p>
        </div>
      </div>

      {/* ── KPI Cards (Flat) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Entrepreneurs"
          value={stats.nb_entrepreneurs}
          icon={Rocket}
          slot={1}
        />
        <StatCard
          label="Mentors Approuvés"
          value={stats.nb_mentors_approuves}
          icon={Users}
          slot={2}
        />
        <StatCard
          label="Investisseurs Approuvés"
          value={stats.nb_investisseurs_approuves}
          icon={BriefcaseBusiness}
          slot={3}
        />
        <StatCard
          label="En attente de validation"
          value={enAttenteTotal}
          icon={AlertCircle}
          slot={4}
        />
      </div>

      {/* ── Section Principale ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Résumé des validations */}
        <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Validations en attente
              </h2>
              <div className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1">
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                  {enAttenteTotal} à traiter
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-zinc-200">
                    <Users className="w-4 h-4 text-zinc-600" />
                  </div>
                  <span className="text-[14px] font-medium text-zinc-800">Mentors</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-zinc-900">{stats.nb_mentors_en_attente}</span>
                  <Button asChild size="sm" variant="outline" className="h-7 text-[11px] rounded-lg cursor-pointer">
                    <Link to="/admin/mentors">Gérer</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-zinc-200">
                    <BriefcaseBusiness className="w-4 h-4 text-zinc-600" />
                  </div>
                  <span className="text-[14px] font-medium text-zinc-800">Investisseurs</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-zinc-900">{stats.nb_investisseurs_en_attente}</span>
                  <Button asChild size="sm" variant="outline" className="h-7 text-[11px] rounded-lg cursor-pointer">
                    <Link to="/admin/investisseurs">Gérer</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Résumé des projets */}
        <Card className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              Projets sur la plateforme
            </h2>
            <FolderOpen className="w-4 h-4 text-[var(--color-text-muted)]" />
          </div>
          
          <div className="flex items-center justify-around h-[120px]">
             <div className="text-center">
               <div className="text-[32px] font-semibold text-[var(--color-text-primary)] tracking-tight">
                 {stats.nb_projets}
               </div>
               <div className="text-[12px] font-medium text-[var(--color-text-muted)]">Total des projets</div>
             </div>
             
             <div className="w-px h-16 bg-zinc-100"></div>
             
             <div className="text-center">
               <div className="text-[32px] font-semibold text-[var(--color-success)] tracking-tight">
                 {stats.nb_projets_diplomes}
               </div>
               <div className="text-[12px] font-medium text-[var(--color-text-muted)]">Projets diplômés</div>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
