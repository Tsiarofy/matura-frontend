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
          'bg-white border-zinc-200 rounded-xl p-4',
          'hover:border-green-200 hover:shadow-sm transition-all cursor-pointer',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg leading-none">
                <Briefcase className="w-5 h-5 text-zinc-500" />
              </span>
              <h3 className="text-[13px] font-medium text-zinc-800 truncate">
                {projet.titre}
              </h3>
            </div>
            <p className="text-[11px] text-zinc-500 truncate">
              {projet.secteur}
            </p>
          </div>

          <BRLBadge brl={projet.brl_actuel} />
        </div>

        {/* Description */}
        <p className="text-[12px] text-zinc-600 line-clamp-2 mb-3 leading-relaxed">
          {projet.domaine} - {projet.type_cible}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center gap-3 mb-3 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{projet.region}</span>
          </div>
          
          {projet.mentor && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{projet.mentor.prenom} {projet.mentor.nom.charAt(0)}.</span>
            </div>
          )}

          {projet.score_global !== null && (
            <div className="flex items-center gap-1 ml-auto">
              <TrendingUp className="w-3 h-3" />
              <span className="font-medium text-green-600">{projet.score_global}%</span>
            </div>
          )}
        </div>

        {/* Stade actif */}
        {projet.stade_actif && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <StatutBadge statut={projet.stade_actif.statut} />
              <span className="text-[10px] text-zinc-400">
                Stade {projet.stade_actif.numero}/7
              </span>
            </div>
            <ProgressBar value={projet.stade_actif.completion_pct} />
          </div>
        )}

        {/* Footer date */}
        <div className="mt-3 pt-3 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400">
            Mis à jour le {formatDate(projet.maj_le, 'short')}
          </p>
        </div>
      </Card>
    </Link>
  )
}
