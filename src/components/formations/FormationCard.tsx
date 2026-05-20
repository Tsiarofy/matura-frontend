import { Link } from '@tanstack/react-router'
import type { FormationResume } from '@matura/shared'
import { GraduationCap, PlayCircle } from 'lucide-react'
import { DOMAINE_LABELS, TYPE_CIBLE_LABELS, STADE_LABELS } from '@/lib/constants'

interface FormationCardProps {
  formation: FormationResume
  basePath?: '/formations' | '/mes-formations'
}

export function FormationCard({ formation, basePath = '/formations' }: FormationCardProps) {

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3 hover:shadow-sm transition-shadow">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
          <GraduationCap className="w-4.5 h-4.5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-zinc-900 leading-tight truncate">
            {formation.titre}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            par {formation.auteur.prenom} {formation.auteur.nom}
          </p>
        </div>
      </div>

      {/* Description */}
      {formation.description && (
        <p className="text-[12px] text-zinc-500 line-clamp-2">{formation.description}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[10px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">
          {DOMAINE_LABELS[formation.domaine] ?? formation.domaine}
        </span>
        {formation.stade_cible && (
          <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
            Stade {formation.stade_cible} — {STADE_LABELS[formation.stade_cible as keyof typeof STADE_LABELS]}
          </span>
        )}
        {formation.type_cible && (
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {TYPE_CIBLE_LABELS[formation.type_cible] ?? formation.type_cible}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-zinc-400">
          {formation.nombre_lessons} leçon{formation.nombre_lessons > 1 ? 's' : ''}
        </span>
        <Link
          to={`${basePath}/$formationId`}
          params={{ formationId: formation.id }}
          className="flex items-center gap-1 text-[12px] text-green-600 hover:text-green-700 font-medium"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          {basePath === '/mes-formations' ? 'Gérer' : 'Commencer'}
        </Link>
      </div>
    </div>
  )
}
