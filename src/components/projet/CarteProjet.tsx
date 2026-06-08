import { Card } from '@/components/ui/card'
import {type ProjetResume } from '@matura/shared'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { StatutBadge } from '@/components/shared/StatutBadge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { cn, formatDate } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { MapPin, User, TrendingUp, Briefcase } from 'lucide-react'

interface CarteProjetProps {
  projet: ProjetResume
  className?: string
}

export function CarteProjet({ projet, className }: CarteProjetProps) {
  return (
    <Link to="/projets/$projetId" params={{ projetId: projet.id }}>
      <Card
        className={cn(
          "group w-full h-64 relative cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="icon-chip h-11 w-11 shrink-0 rounded-[16px]">
                <Briefcase className="w-5 h-5 text-[var(--color-text-muted)]" strokeWidth={1.7} />
              </span>
              <h3 className="truncate text-[16px] font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-success-text)]">
                {projet.titre}
              </h3>
            </div>
            <p className="truncate text-[12px] text-[var(--color-text-muted)]">
              {projet.secteur}
            </p>
          </div>

          <BRLBadge brl={projet.brl_actuel} />
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-[13px] font-medium leading-relaxed text-[var(--color-text-secondary)]">
          {projet.domaine} - {projet.type_cible}
        </p>

        {/* Métadonnées */}
        <div className="mb-4 flex items-center gap-3 text-[12px] text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{projet.region}</span>
          </div>
          
          {projet.mentor && (
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{projet.mentor.prenom} {projet.mentor.nom.charAt(0)}.</span>
            </div>
          )}

          {projet.score_global !== null && (
            <div className="flex items-center gap-1 ml-auto">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold text-[var(--color-success-text)]">{projet.score_global}%</span>
            </div>
          )}
        </div>

        {/* Stade actif */}
        {projet.stade_actif && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <StatutBadge statut={projet.stade_actif.statut} />
              <span className="text-[10px] text-[var(--color-text-disabled)]">
                Stade {projet.stade_actif.numero}/7
              </span>
            </div>
            <ProgressBar value={projet.stade_actif.completion_pct} />
          </div>
        )}

        {/* Footer date */}
        <div className="mt-4 border-t border-[var(--color-border)] pt-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-disabled)]">
            Mis à jour le {formatDate(projet.maj_le, 'short')}
          </p>
        </div>
      </Card>
    </Link>
  )
}
