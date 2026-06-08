import React, { useState, useRef, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import * as Icon from "lucide-react";
import { cn } from "@/lib/utils";

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/projets": "Mes Projets",
  "/financements": "Financements",
  "/mentors": "Mentors disponibles",
  "/profil": "Profil",
  "/projets-suivis": "Projets suivis",
  "/demandes": "Demandes",
  "/projets-a-financer": "Projets à financer",
  "/admin": "Administration",
  "/admin/mentors": "Mentors",
  "/admin/investisseurs": "Investisseurs",
  "/admin/entrepreneurs": "Entrepreneurs",
  "/stades": "Stades",
};

function useBreadcrumbs() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { path: string; label: string }[] = [];
  let path = "";

  for (const seg of segments) {
    path += "/" + seg;
    const label = ROUTE_LABELS[path];
    if (label) {
      crumbs.push({ path, label });
    } else if (/^\d+$/.test(seg)) {
      // ID numérique — on ignore dans le breadcrumb
    } else {
      // Segment non mappé : on capitalize
      crumbs.push({ path, label: seg.charAt(0).toUpperCase() + seg.slice(1) });
    }
  }

  return crumbs;
}

// ─── USER MENU DROPDOWN ───────────────────────────────────────────────────────

interface UserMenuProps {
  userName?: string;
  userInitials?: string;
  userRole?: string;
  onDeconnexion: () => void;
}

function UserMenu({
  userName,
  userInitials,
  userRole,
  onDeconnexion,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer sur clic extérieur
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-pill)] px-2 py-1.5 transition-all",
          "hover:bg-black/[0.04] active:bg-black/[0.06]",
          open && "bg-black/[0.04]",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white bg-[var(--color-surface-icon-bg)]">
          <span className="select-none text-[12px] font-semibold leading-none text-[var(--color-text-primary)]">
            {userInitials ?? "?"}
          </span>
        </div>
        {userName && (
          <span className="text-[14px] font-medium max-w-[140px] truncate hidden sm:block text-[var(--color-text-secondary)]">
            {userName}
          </span>
        )}
        {/* Chevron animé */}
        <Icon.ChevronRight
          size={16}
          strokeWidth={1.5}
          className={cn(
            "transition-transform duration-200 hidden sm:block text-[var(--color-text-muted)]",
            open ? "rotate-90" : "rotate-0",
          )}
        />
      </button>

      {/* Menu panel — glassmorphism */}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-[calc(100%+8px)] z-50 w-56",
            "bg-white",
            "border border-[var(--color-border)]",
            "rounded-[20px] p-1.5",
            "shadow-[var(--shadow-3)]",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150",
          )}
        >
          {/* Entête utilisateur */}
          <div className="px-3 py-2.5 mb-1">
            <p className="text-[14px] font-semibold truncate text-[var(--color-text-primary)]">
              {userName ?? "Utilisateur"}
            </p>
            {userRole && (
              <p className="text-[12px] mt-0.5 text-[var(--color-text-muted)]">
                {userRole}
              </p>
            )}
          </div>

          {/* Séparateur */}
          <div className="h-px mx-1 mb-1 bg-[var(--color-border)]" />

          {/* Mon profil */}
          <Link
            to="/profil"
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px]",
              "text-[var(--color-text-secondary)]",
              "hover:bg-black/[0.04]",
              "transition-colors duration-150",
            )}
            role="menuitem"
          >
            <Icon.User
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-[var(--color-text-muted)]"
            />
            Mon profil
          </Link>

          {/* Paramètres (non-cliquable pour l'instant) */}
          <button
            className={cn(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px]",
              "text-[var(--color-text-secondary)]",
              "hover:bg-black/[0.04]",
              "transition-colors duration-150",
            )}
            role="menuitem"
          >
            <Icon.Settings
              size={16}
              strokeWidth={1.5}
              className="shrink-0 text-[var(--color-text-muted)]"
            />
            Paramètres
          </button>

          {/* Séparateur */}
          <div className="h-px mx-1 my-1 bg-[var(--color-border)]" />

          {/* Déconnexion */}
          <button
            onClick={() => {
              setOpen(false);
              onDeconnexion();
            }}
            className={cn(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px]",
              "text-[var(--color-error)]",
              "hover:bg-[var(--color-error-bg)]",
              "transition-colors duration-150",
            )}
            role="menuitem"
          >
            <Icon.LogOut size={16} strokeWidth={1.5} className="shrink-0" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

// ─── TOPBAR PRINCIPALE ────────────────────────────────────────────────────────

export interface TopBarProps {
  userName?: string;
  userInitials?: string;
  userRole?: string;
  onDeconnexion: () => void;
}

export function TopBar({ userName, userInitials, userRole, onDeconnexion }: TopBarProps) {
  const crumbs = useBreadcrumbs()

  return (
    <header
      className={cn(
        'z-20 flex h-[76px] shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-shell)] px-8',
      )}
    >
      {/* ── Breadcrumb ── */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <nav
          aria-label="Fil d'Ariane"
          className="hidden min-w-0 items-center gap-1 text-[14px] lg:flex"
        >
          <span className="shrink-0 font-medium text-[var(--color-text-muted)]">MaturaProj</span>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <React.Fragment key={crumb.path}>
                <Icon.ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-[var(--color-text-disabled)] mx-1"
                />
                {isLast ? (
                  <span className="font-bold truncate text-[var(--color-text-primary)]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path as never}
                    className="transition-colors truncate text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      </div>

      {/* ── Actions droite ── */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition-all duration-150 hover:bg-[var(--color-surface-soft)]',
          )}
          aria-label="Settings"
        >
          <Icon.Settings size={20} strokeWidth={1.5} />
        </button>

        <button
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition-all duration-150 hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-secondary)]',
          )}
          aria-label="Notifications"
        >
          <Icon.Bell size={20} strokeWidth={1.5} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--color-bg-shell)]" />
        </button>

        <div className="w-px h-6 bg-[var(--color-border)] mx-1 hidden sm:block" />

        <UserMenu
          userName={userName}
          userInitials={userInitials}
          userRole={userRole}
          onDeconnexion={onDeconnexion}
        />
      </div>
    </header>
  );
}
