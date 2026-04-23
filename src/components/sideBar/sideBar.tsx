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
    { icon: 'Home', lien: '/dashboard', label: 'Accueil' },
    { icon: 'LayoutDashboard', lien: '/projets', label: 'Mes Projets' },
    { icon: 'BadgeDollarSign', lien: '/financements', label: 'Financements' },
    { icon: 'Users', lien: '/mentors', label: 'Mentor disponible' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
  MENTOR: [
    { icon: 'Home', lien: '/dashboard', label: 'Accueil' },
    { icon: 'FolderOpen', lien: '/projets-suivis', label: 'Projets suivis' },
    { icon: 'Bell', lien: '/demandes', label: 'Demandes' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
  INVESTISSEUR: [
    { icon: 'Home', lien: '/dashboard', label: 'Accueil' },
    { icon: 'BadgeDollarSign', lien: '/financements', label: 'Mes financements' },
    { icon: 'TrendingUp', lien: '/projets-a-financer', label: 'Projets à financer' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
  ADMIN: [
    { icon: 'Home', lien: '/dashboard', label: 'Accueil' },
    { icon: 'Users', lien: '/admin/mentors', label: 'Mentors' },
    { icon: 'Briefcase', lien: '/admin/investisseurs', label: 'Investisseurs' },
    { icon: 'Rocket', lien: '/admin/entrepreneurs', label: 'Entrepreneurs' },
    { icon: 'User', lien: '/profil', label: 'Profil' },
  ],
}

// ─── ICÔNE STADE SIDEBAR ─────────────────────────────────────────────────────

function StadeIconSidebar({ statut, numero }: { statut: string; numero: number }) {
  if (statut === 'VALIDE') {
    return (
      <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
        <Icon.Check size={9} strokeWidth={3} className="text-white" />
      </span>
    )
  }
  if (statut === 'VERROUILLE') {
    return <Icon.Lock size={13} className="text-zinc-300 shrink-0" />
  }
  if (statut === 'SOUMIS') {
    return (
      <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shrink-0 text-white text-[9px] font-medium">
        {numero}
      </span>
    )
  }
  if (statut === 'EN_REVISION') {
    return (
      <span className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center shrink-0 text-white text-[9px] font-medium">
        {numero}
      </span>
    )
  }
  // BROUILLON / DEBLOQUE → actif
  return (
    <span className="w-4 h-4 rounded-full border-[1.5px] border-green-500 bg-green-50 flex items-center justify-center shrink-0 text-green-600 text-[9px] font-medium">
      {numero}
    </span>
  )
}

// ─── SECTION PROJET COURANT ──────────────────────────────────────────────────

function ProjetCourantSection({ projet }: { projet: ProjetResume }) {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // stade actif = premier stade non VERROUILLE et non VALIDE, ou juste le stade actif
  const stadeActifNum = projet.stade_actif?.numero ?? null

  // Reconstruit les 7 stades depuis stade_actif et brl_actuel
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
    <div className="px-3 pt-3 pb-1">
      {/* Titre section */}
      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium px-1 mb-2">
        Projet en cours
      </p>

      {/* Nom projet + lien */}
      <Link
        to="/projets/$projetId"
        params={{ projetId: projet.id }}
        className="block px-2 py-2 rounded-lg hover:bg-zinc-100 transition-colors mb-1"
      >
        <p className="text-[12px] text-zinc-800 font-medium leading-tight truncate">
          {projet.titre}
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {projet.domaine} · BRL {projet.brl_actuel}
        </p>
      </Link>

      {/* 7 stades */}
      <div className="mt-1 space-y-0.5">
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
                'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors',
                isVerrouille && 'opacity-40 cursor-not-allowed',
                !isVerrouille && !isCurrentRoute && 'hover:bg-zinc-100',
                isCurrentRoute && 'bg-green-50',
                isActive && !isCurrentRoute && 'bg-zinc-50',
              )}
            >
              <StadeIconSidebar statut={statut} numero={num} />
              <span
                className={cn(
                  'text-[12px] flex-1 truncate',
                  isVerrouille && 'text-zinc-400',
                  isValide && 'text-zinc-500',
                  isActive && 'text-zinc-800 font-medium',
                  isCurrentRoute && 'text-green-700 font-medium',
                  !isVerrouille && !isValide && !isActive && !isCurrentRoute && 'text-zinc-600',
                )}
              >
                {num}. {label}
              </span>
              {isActive && (
                <span className="text-[9px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
                  en cours
                </span>
              )}
            </div>
          )

          if (isVerrouille) {
            return <div key={num}>{content}</div>
          }

          return (
            <Link key={num} to={routePath as never} className="block">
              {content}
            </Link>
          )
        })}
      </div>

      {/* Séparateur */}
      <div className="mt-3 border-t border-zinc-100" />
    </div>
  )
}

// ─── ICÔNE NAVIGATION ─────────────────────────────────────────────────────────

const IconNavigation = ({ name }: { name: string }) => {
  const LucideIcon = (Icon as Record<string, unknown>)[name] as React.ComponentType<{ size: number; className?: string }> | undefined
  if (!LucideIcon) return null
  return <LucideIcon size={16} className="shrink-0" />
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
    <aside className="flex flex-col h-screen w-56 border-r border-zinc-200 bg-zinc-50 shrink-0">
      {/* Logo / App name */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-zinc-100">
        <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-medium">M</span>
        </div>
        <div>
          <p className="text-[13px] font-medium text-zinc-900 leading-none">MaturaProj</p>
          <p className="text-[10px] text-zinc-400 mt-0.5">Madagascar</p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Section navigation principale */}
        <nav className="px-3 py-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium px-1 mb-1.5">
            Navigation
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.lien || pathname.startsWith(item.lien + '/')
              return (
                <Link
                  key={item.lien}
                  to={item.lien as never}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800',
                  )}
                >
                  <IconNavigation name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Section projet courant — ENTREPRENEUR uniquement */}
        {role === 'ENTREPRENEUR' && projetCourant && (
          <ProjetCourantSection projet={projetCourant} />
        )}
      </div>

      {/* Footer — avatar utilisateur */}
      {userName && (
        <div className="px-3 py-3 border-t border-zinc-100">
          <Link
            to="/profil"
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span className="text-green-700 text-[11px] font-medium">{userInitials ?? '?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-zinc-800 truncate">{userName}</p>
              <p className="text-[10px] text-zinc-400">Paramètres</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  )
}
