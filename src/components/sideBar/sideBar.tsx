import React from 'react'
import { type RoleUtilisateur, type StatutStade } from '@matura/shared'
import * as Icon from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { STADE_LABELS } from '@/lib/constants'
import type { ProjetResume } from '@matura/shared'

// ─── NAVIGATION DATA ──────────────────────────────────────────────────────────

interface NavItem {
  icon: string
  lien: string
  label: string
}

const NAV_DATA: Record<RoleUtilisateur, NavItem[]> = {
  ENTREPRENEUR: [
    { icon: 'LayoutDashboard', lien: '/dashboard', label: 'Dashboard' },
    { icon: 'FolderKanban', lien: '/projets', label: 'Mes Projets' },
    { icon: 'BadgeDollarSign', lien: '/financements', label: 'Financements' },
    { icon: 'Users', lien: '/mentors', label: 'Mentors' },
    { icon: 'GraduationCap', lien: '/formations', label: 'Formations' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
  MENTOR: [
    { icon: 'LayoutDashboard', lien: '/dashboard', label: 'Dashboard' },
    { icon: 'FolderOpen', lien: '/projets-suivis', label: 'Projets suivis' },
    { icon: 'Bell', lien: '/demandes', label: 'Demandes' },
    { icon: 'GraduationCap', lien: '/mes-formations', label: 'Mes Formations' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
  INVESTISSEUR: [
    { icon: 'LayoutDashboard', lien: '/dashboard', label: 'Dashboard' },
    { icon: 'BadgeDollarSign', lien: '/financements', label: 'Financements' },
    { icon: 'TrendingUp', lien: '/projets-a-financer', label: 'À financer' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
  ADMIN: [
    { icon: 'LayoutDashboard', lien: '/dashboard', label: 'Dashboard' },
    { icon: 'Users', lien: '/admin/mentors', label: 'Mentors' },
    { icon: 'Briefcase', lien: '/admin/investisseurs', label: 'Investisseurs' },
    { icon: 'Rocket', lien: '/admin/entrepreneurs', label: 'Entrepreneurs' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
}

// ─── ICÔNE NAV ────────────────────────────────────────────────────────────────

const IconNavigation = ({ name, isActive }: { name: string; isActive: boolean }) => {
  const LucideIcon = (Icon as Record<string, unknown>)[name] as React.ComponentType<{
    size: number
    className?: string
    strokeWidth?: number
  }> | undefined
  if (!LucideIcon) return null
  return (
    <LucideIcon
      size={16}
      strokeWidth={isActive ? 2 : 1.7}
      className={cn(
        'shrink-0 transition-colors duration-150',
        isActive ? 'text-zinc-800' : 'text-zinc-400',
      )}
    />
  )
}

// ─── ICÔNE STADE — couleurs sémantiques conservées (statut uniquement) ─────────

function StadeIconSidebar({ statut, numero }: { statut: string; numero: number }) {
  if (statut === 'VALIDE') {
    return (
      <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
        <Icon.Check size={8} strokeWidth={3} className="text-emerald-500" />
      </span>
    )
  }
  if (statut === 'VERROUILLE') {
    return <Icon.Lock size={11} className="text-zinc-300 shrink-0" />
  }
  if (statut === 'SOUMIS') {
    return (
      <span className="w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 text-[9px] font-semibold">
        {numero}
      </span>
    )
  }
  if (statut === 'EN_REVISION') {
    return (
      <span className="w-4 h-4 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-red-500 text-[9px] font-semibold">
        {numero}
      </span>
    )
  }
  // BROUILLON / DEBLOQUE
  return (
    <span className="w-4 h-4 rounded-full border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-400 text-[9px] font-medium">
      {numero}
    </span>
  )
}

// ─── SECTION PROJET COURANT ───────────────────────────────────────────────────

function ProjetCourantSection({ projet }: { projet: ProjetResume }) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const stadeActifNum = projet.stade_actif?.numero ?? null

  const stades = Array.from({ length: 7 }, (_, i) => {
    const num = i + 1
    let statut: StatutStade = 'VERROUILLE'
    if (num < (projet.brl_actuel ?? 0) + 1) {
      statut = 'VALIDE'
    } else if (num === stadeActifNum) {
      statut = (projet.stade_actif?.statut as StatutStade) ?? 'BROUILLON'
    } else if (num === (projet.brl_actuel ?? 0) + 1 && num !== stadeActifNum) {
      statut = 'DEBLOQUE'
    }
    return { num, statut }
  })

  return (
    <div className="pt-3">
      <div className="h-px bg-black/[0.06] mx-2 mb-3" />

      <p className="text-[10px] uppercase tracking-[0.08em] text-zinc-400 font-medium px-2 mb-1.5">
        Projet en cours
      </p>

      <Link
        to="/projets/$projetId"
        params={{ projetId: projet.id }}
        className="block px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-all duration-150 mb-1"
      >
        <p className="text-[12px] text-zinc-800 font-semibold leading-tight truncate">{projet.titre}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{projet.domaine} · BRL {projet.brl_actuel}</p>
      </Link>

      <div className="space-y-px px-1">
        {stades.map(({ num, statut }) => {
          const label = STADE_LABELS[num]
          const isActive = num === stadeActifNum
          const isVerrouille = statut === 'VERROUILLE'
          const isValide = statut === 'VALIDE'
          const routePath = `/projets/${projet.id}/stades/${num}`
          const isCurrentRoute = pathname.includes(`/stades/${num}`)

          const content = (
            <div
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-150',
                isVerrouille && 'opacity-35 cursor-not-allowed',
                isCurrentRoute
                  ? 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                  : !isVerrouille && 'hover:bg-black/[0.04]',
              )}
            >
              <StadeIconSidebar statut={statut} numero={num} />
              <span
                className={cn(
                  'text-[11.5px] flex-1 truncate',
                  isVerrouille && 'text-zinc-300',
                  isValide && !isCurrentRoute && 'text-zinc-400',
                  isCurrentRoute
                    ? 'text-zinc-900 font-medium'
                    : isActive && !isValide
                    ? 'text-zinc-700 font-medium'
                    : !isVerrouille && !isValide && 'text-zinc-500',
                )}
              >
                {num}. {label}
              </span>
              {isActive && !isValide && (
                <span className="text-[9px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full shrink-0 font-medium">
                  actif
                </span>
              )}
            </div>
          )

          if (isVerrouille) return <div key={num}>{content}</div>
          return (
            <Link key={num} to={routePath as never} className="block">
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── SIDEBAR PRINCIPALE ───────────────────────────────────────────────────────

export interface SideBarProps {
  role: RoleUtilisateur
  projetCourant?: ProjetResume | null
  userName?: string
  userInitials?: string
}

export const SideBar = ({ role, projetCourant, userName, userInitials }: SideBarProps) => {
  const navItems = NAV_DATA[role] ?? []
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  return (
    <aside className="flex flex-col h-screen w-60 border-r border-black/[0.06] bg-[#F7F7F7] dark:bg-[#111111] shrink-0">

      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 shrink-0">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#41A677', boxShadow: '0 3px 12px rgba(65,166,119,0.35)' }}
        >
          <span className="text-white text-[13px] font-bold select-none">M</span>
        </div>
        <div>
          <p className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
            MaturaProj
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Madagascar</p>
        </div>
      </div>

      {/* ── Corps scrollable ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">

        <p className="text-[10px] uppercase tracking-[0.08em] text-zinc-400 font-medium px-2 mb-2">
          Navigation
        </p>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.lien || pathname.startsWith(item.lien + '/')
            return (
              <Link
                key={item.lien}
                to={item.lien as never}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150',
                  isActive
                    ? 'bg-white dark:bg-zinc-800 shadow-[0_1px_6px_rgba(0,0,0,0.08),_0_0_0_1px_rgba(0,0,0,0.04)] text-zinc-900 dark:text-zinc-100 font-medium'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-zinc-700 dark:hover:text-zinc-200',
                )}
              >
                <IconNavigation name={item.icon} isActive={isActive} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Projet courant — ENTREPRENEUR uniquement */}
        {role === 'ENTREPRENEUR' && projetCourant && (
          <ProjetCourantSection projet={projetCourant} />
        )}
      </div>

      {/* ── Footer utilisateur ── */}
      {userName && (
        <div className="shrink-0 px-3 pb-4 pt-2 border-t border-black/[0.06]">
          <Link
            to="/profil"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-all duration-150 group"
          >
            {/* Avatar neutre — sans couleur verte */}
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-zinc-600 dark:text-zinc-300 text-[11px] font-semibold select-none">
                {userInitials ?? '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                {userName}
              </p>
              <p className="text-[11px] text-zinc-400">Profil & paramètres</p>
            </div>
            <Icon.ChevronRight
              size={13}
              strokeWidth={1.8}
              className="text-zinc-300 shrink-0 group-hover:text-zinc-400 transition-colors"
            />
          </Link>
        </div>
      )}
    </aside>
  )
}
