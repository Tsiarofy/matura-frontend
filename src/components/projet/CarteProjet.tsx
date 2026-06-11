import { Card } from '@/components/ui/card'
import {type ProjetResume } from '@matura/shared'
import { BRLBadge } from '@/components/shared/BRLBadge'
import { StatutBadge } from '@/components/shared/StatutBadge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { MapPin, User, Briefcase } from 'lucide-react'

interface CarteProjetProps {
  projet: ProjetResume
  className?: string
}

export function CarteProjet({ projet, className }: CarteProjetProps) {
  return (
    <Link to="/projets/$projetId" params={{ projetId: projet.id }} className="block w-full">
      <Card
        className={cn(
          "group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-zinc-200 flex flex-col justify-between min-h-[240px]",
          className
        )}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-10 h-10 rounded-[14px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-700 transition-colors">
              <Briefcase className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-1.5">
              <BRLBadge brl={projet.brl_actuel} />
              <StatutBadge statut={projet.statut} />
            </div>
          </div>

          {/* Title & Sectors */}
          <div className="space-y-1.5 mb-4">
            <h3 className="text-[17px] font-bold text-zinc-900 group-hover:text-green-700 transition-colors truncate">
              {projet.titre}
            </h3>
            <p className="text-[11.5px] font-semibold text-zinc-400 uppercase tracking-wider">
              {projet.secteur} · {projet.domaine}
            </p>
            <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2">
              Projet ciblant {projet.type_cible} dans le domaine {projet.domaine.toLowerCase()}.
            </p>
          </div>
        </div>

        <div>
          {/* Stade actif */}
          {projet.stade_actif && (
            <div className="space-y-1.5 py-3 border-y border-zinc-50 mb-3">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-zinc-650">Stade {projet.stade_actif.numero}/7</span>
                <span className="text-zinc-500">{projet.stade_actif.completion_pct}%</span>
              </div>
              <ProgressBar value={projet.stade_actif.completion_pct} />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-zinc-450 mt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-300" />
                {projet.region}
              </span>
              {projet.mentor && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-zinc-300" />
                  {projet.mentor.prenom} {projet.mentor.nom.charAt(0)}.
                </span>
              )}
            </div>

            {projet.score_global !== null && (
              <span className="font-bold text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                Score {Math.round(projet.score_global)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
