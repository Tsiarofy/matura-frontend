import { type RoleUtilisateur } from "@matura/shared";
import * as Icon from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ProjetResume } from "@matura/shared";

// ─── NAVIGATION DATA ──────────────────────────────────────────────────────────

interface NavItem {
  icon: string;
  lien: string;
  label: string;
}

const NAV_DATA: Record<RoleUtilisateur, NavItem[]> = {
  ENTREPRENEUR: [
    { icon: "LayoutGrid", lien: "/dashboard", label: "Dashboard" },
    { icon: "FolderKanban", lien: "/projets", label: "Mes Projets" },
    { icon: "HandCoins", lien: "/financements", label: "Financements" },
    { icon: "UsersRound", lien: "/mentors", label: "Mentors" },
    { icon: "BookOpenText", lien: "/formations", label: "Formations" },
    { icon: "CircleUserRound", lien: "/profil", label: "Profil" },
  ],
  MENTOR: [
    { icon: "LayoutGrid", lien: "/dashboard", label: "Dashboard" },
    { icon: "FolderOpen", lien: "/projets-suivis", label: "Projets suivis" },
    { icon: "BellDot", lien: "/demandes", label: "Demandes" },
    { icon: "BookOpenText", lien: "/mes-formations", label: "Mes Formations" },
    { icon: "CircleUserRound", lien: "/profil", label: "Profil" },
  ],
  INVESTISSEUR: [
    { icon: "LayoutGrid", lien: "/dashboard", label: "Dashboard" },
    {
      icon: "HandCoins",
      lien: "/mes-financements",
      label: "Financements",
    },
    {
      icon: "ChartColumnIncreasing",
      lien: "/projets-a-financer",
      label: "À financer",
    },
    { icon: "CircleUserRound", lien: "/profil", label: "Profil" },
  ],
  ADMIN: [
    { icon: "LayoutGrid", lien: "/dashboard", label: "Dashboard" },
    { icon: "UsersRound", lien: "/admin/mentors", label: "Mentors" },
    {
      icon: "BriefcaseBusiness",
      lien: "/admin/investisseurs",
      label: "Investisseurs",
    },
    { icon: "Rocket", lien: "/admin/entrepreneurs", label: "Entrepreneurs" },
    { icon: "CircleUserRound", lien: "/profil", label: "Profil" },
  ],
};

// ─── SIDEBAR PRINCIPALE ───────────────────────────────────────────────────────

export interface SideBarProps {
  role: RoleUtilisateur;
  projetCourant?: ProjetResume | null;
  userName?: string;
  userInitials?: string;
}

export const SideBar = ({ role, projetCourant, userName }: SideBarProps) => {
  const navItems = NAV_DATA[role] ?? [];
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar-surface)]">
      {/* ── Brand ── */}
      <div className="flex shrink-0 items-center gap-3 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[12px] border border-[var(--color-border-strong)] bg-white shadow-sm">
          <Icon.LayoutGrid
            size={16}
            strokeWidth={1.9}
            className="text-[var(--color-text-primary)]"
          />
        </div>
        <p className="text-[14px] font-semibold tracking-tight text-[var(--color-text-primary)]">
          MaturaProj
        </p>
      </div>

      {/* ── Navigation ── */}
      <div className="hide-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.lien || pathname.startsWith(item.lien + "/");
            return (
              <Link
                key={item.lien}
                to={item.lien as never}
                className={cn(
                  "group relative flex items-center gap-3 rounded-[12px] px-4 py-3 text-[13.5px] font-semibold transition-all duration-200",
                  isActive
                    ? "bg-white text-zinc-950 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-zinc-200/50"
                    : "text-zinc-550 hover:bg-white/60 hover:text-zinc-950",
                )}
              >
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center transition-colors duration-200",
                    isActive
                      ? "text-zinc-950"
                      : "text-zinc-400 group-hover:text-zinc-950",
                  )}
                >
                  <IconNavigation name={item.icon} isActive={isActive} />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Projet courant ── Style Flat & Compact */}
        {role === "ENTREPRENEUR" && projetCourant && (
          <div className="mt-6">
            <ProjetCourantSection projet={projetCourant} />
          </div>
        )}
      </div>

      {/* ── User Footer ── */}
      {userName && (
        <div className="shrink-0 px-3 pb-5">
          <Link
            to="/profil"
            className="group flex items-center gap-2.5 rounded-[15px] border border-transparent px-3 py-2.5 transition-all duration-200 hover:border-zinc-200/60 hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-zinc-100">
              <Icon.User
                size={14}
                strokeWidth={1.8}
                className="text-zinc-500 group-hover:text-zinc-950"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-[11.5px] font-bold text-zinc-950">
                {userName}
              </p>
              <p className="text-[9.5px] font-semibold text-zinc-400">
                Mon compte
              </p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};

// ─── Sous-composant Icône de navigation ───────────────────────────────────────

function IconNavigation({
  name,
  isActive,
}: {
  name: string;
  isActive?: boolean;
}) {
  const IconComp = (Icon as any)[name] ?? Icon.LayoutDashboard;
  return <IconComp size={18} strokeWidth={isActive ? 2 : 1.6} />;
}

// ─── Sous-composant Projet Courant ────────────────────────────────────────────

function ProjetCourantSection({ projet }: { projet: ProjetResume }) {
  const brl = projet.brl_actuel ?? 0;
  const completion =
    ("completion_pct" in projet
      ? (projet as ProjetResume & { completion_pct?: number }).completion_pct
      : 0) ?? 0;

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Projet Actif
        </span>
        <div className="rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2 py-0.5">
          <span className="text-[9px] font-bold text-[var(--color-success-text)]">
            BRL {brl}
          </span>
        </div>
      </div>

      <p className="mb-3 truncate text-[13px] font-semibold text-[var(--color-text-primary)]">
        {projet.titre}
      </p>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-semibold">
          <span className="text-[var(--color-text-muted)]">Progression</span>
          <span className="text-[var(--color-text-primary)]">
            {completion}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
          <div
            className="h-full rounded-full bg-[var(--color-success)] transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <Link
        to="/projets/$projetId"
        params={{ projetId: projet.id }}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[999px] border border-[var(--color-accent)] bg-[var(--color-accent)] py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-92"
      >
        Ouvrir
        <Icon.ArrowUpRight size={12} />
      </Link>
    </div>
  );
}
