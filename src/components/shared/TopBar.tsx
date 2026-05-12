import React, { useState, useRef, useEffect } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, LogOut, User, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':            'Tableau de bord',
  '/projets':              'Mes Projets',
  '/financements':         'Financements',
  '/mentors':              'Mentors disponibles',
  '/profil':               'Profil',
  '/projets-suivis':       'Projets suivis',
  '/demandes':             'Demandes',
  '/projets-a-financer':   'Projets à financer',
  '/admin':                'Administration',
  '/admin/mentors':        'Mentors',
  '/admin/investisseurs':  'Investisseurs',
  '/admin/entrepreneurs':  'Entrepreneurs',
  '/stades':               'Stades',
}

function useBreadcrumbs() {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { path: string; label: string }[] = []
  let path = ''

  for (const seg of segments) {
    path += '/' + seg
    const label = ROUTE_LABELS[path]
    if (label) {
      crumbs.push({ path, label })
    } else if (/^\d+$/.test(seg)) {
      // ID numérique — on ignore dans le breadcrumb
    } else {
      // Segment non mappé : on capitalize
      crumbs.push({ path, label: seg.charAt(0).toUpperCase() + seg.slice(1) })
    }
  }

  return crumbs
}

// ─── USER MENU DROPDOWN ───────────────────────────────────────────────────────

interface UserMenuProps {
  userName?: string
  userInitials?: string
  userRole?: string
  onDeconnexion: () => void
}

function UserMenu({ userName, userInitials, userRole, onDeconnexion }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer sur clic extérieur
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Fermer sur Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all',
          'hover:bg-black/[0.05] active:bg-black/[0.08]',
          open && 'bg-black/[0.05]',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {/* Avatar gradient */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
          <span className="text-white text-[11px] font-semibold leading-none select-none">
            {userInitials ?? '?'}
          </span>
        </div>
        {userName && (
          <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-200 max-w-[130px] truncate hidden sm:block">
            {userName}
          </span>
        )}
        {/* Chevron animé */}
        <ChevronRight
          size={13}
          strokeWidth={2}
          className={cn(
            'text-zinc-400 transition-transform duration-200 hidden sm:block',
            open ? 'rotate-90' : 'rotate-0',
          )}
        />
      </button>

      {/* Menu panel — glassmorphism */}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-[calc(100%+8px)] z-50 w-56',
            'bg-white/90 dark:bg-zinc-900/90',
            'backdrop-blur-2xl',
            'border border-black/[0.08] dark:border-white/[0.10]',
            'rounded-2xl p-1.5',
            'shadow-[0_8px_32px_rgba(0,0,0,0.12),_0_2px_8px_rgba(0,0,0,0.08)]',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150',
          )}
        >
          {/* Entête utilisateur */}
          <div className="px-3 py-2.5 mb-1">
            <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {userName ?? 'Utilisateur'}
            </p>
            {userRole && (
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                {userRole}
              </p>
            )}
          </div>

          {/* Séparateur */}
          <div className="h-px bg-black/[0.06] dark:bg-white/[0.08] mx-1 mb-1" />

          {/* Mon profil */}
          <Link
            to="/profil"
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px]',
              'text-zinc-700 dark:text-zinc-300',
              'hover:bg-black/[0.05] dark:hover:bg-white/[0.07]',
              'transition-colors duration-150',
            )}
            role="menuitem"
          >
            <User size={14} strokeWidth={1.8} className="text-zinc-400 shrink-0" />
            Mon profil
          </Link>

          {/* Paramètres (non-cliquable pour l'instant) */}
          <button
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px]',
              'text-zinc-700 dark:text-zinc-300',
              'hover:bg-black/[0.05] dark:hover:bg-white/[0.07]',
              'transition-colors duration-150',
            )}
            role="menuitem"
          >
            <Settings size={14} strokeWidth={1.8} className="text-zinc-400 shrink-0" />
            Paramètres
          </button>

          {/* Séparateur */}
          <div className="h-px bg-black/[0.06] dark:bg-white/[0.08] mx-1 my-1" />

          {/* Déconnexion */}
          <button
            onClick={() => { setOpen(false); onDeconnexion() }}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[13px]',
              'text-red-600 dark:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-500/10',
              'transition-colors duration-150',
            )}
            role="menuitem"
          >
            <LogOut size={14} strokeWidth={1.8} className="shrink-0" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}

// ─── TOPBAR PRINCIPALE ────────────────────────────────────────────────────────

export interface TopBarProps {
  userName?: string
  userInitials?: string
  userRole?: string
  onDeconnexion: () => void
}

export function TopBar({ userName, userInitials, userRole, onDeconnexion }: TopBarProps) {
  const crumbs = useBreadcrumbs()

  return (
    <header
      className={cn(
        'h-[52px] shrink-0 z-20',
        'flex items-center justify-between px-6',
        'glass border-b border-black/[0.06] dark:border-white/[0.08]',
      )}
    >
      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-1 text-[13px] min-w-0"
      >
        <span className="text-zinc-400 dark:text-zinc-500 shrink-0">MaturaProj</span>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <React.Fragment key={crumb.path}>
              <ChevronRight
                size={13}
                strokeWidth={2}
                className="text-zinc-300 dark:text-zinc-600 shrink-0"
              />
              {isLast ? (
                <span className="font-medium text-zinc-800 dark:text-zinc-100 truncate">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path as never}
                  className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          )
        })}
      </nav>

      {/* ── Actions droite ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Cloche de notification */}
        <button
          className={cn(
            'relative w-8 h-8 rounded-xl flex items-center justify-center',
            'text-zinc-400 dark:text-zinc-500',
            'hover:bg-black/[0.05] dark:hover:bg-white/[0.07]',
            'hover:text-zinc-600 dark:hover:text-zinc-300',
            'transition-all duration-150',
          )}
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.7} />
          {/* Dot indicateur */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-900" />
        </button>

        {/* Menu utilisateur */}
        <UserMenu
          userName={userName}
          userInitials={userInitials}
          userRole={userRole}
          onDeconnexion={onDeconnexion}
        />
      </div>
    </header>
  )
}
