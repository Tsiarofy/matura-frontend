// import React from "React";
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useFormationDetail } from '@/hooks/useFormations'
import { Loader2 } from 'lucide-react'
import { PlayCircle } from "lucide-react"
import { authStore } from '@/stores/authStore'


export default function FormationLessonPage() {
  const { formationId } = useParams({
    from: '/(dashboard)/_layout/formations/$formationId/lessons/',
  })
  
  const navigate = useNavigate()
  const { data: formation, isLoading, error } = useFormationDetail(formationId)
  const role = authStore((s) => s.utilisateur?.role)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <p className="text-[13px] text-[var(--color-text-muted)]">Chargement des leçons...</p>
      </div>
    )
  }

  if (error || !formation) {
    return (
      <div className="page-shell max-w-md">
        <div className="panel-flat p-6 text-center space-y-4">
          <p className="text-[14px] text-[var(--color-text-primary)] font-semibold">Formation introuvable</p>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            La formation demandée n'existe pas ou vous n'avez pas les droits pour y accéder.
          </p>
          <button
            onClick={() => navigate({ to: role === 'MENTOR' ? '/mes-formations' : '/formations' })}
            className="flat-action"
          >
            Retour aux formations
          </button>
        </div>
      </div>
    )
  }

  if (formation.lessons && formation.lessons.length === 0) {
    return (
      <div className="page-shell max-w-md">
        <div className="panel-flat p-6 text-center space-y-4">
          <p className="text-[14px] text-[var(--color-text-primary)] font-semibold">{formation.titre}</p>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            Cette formation ne contient aucune leçon pour le moment.
          </p>
          <button
            onClick={() => navigate({ to: role === 'MENTOR' ? '/mes-formations' : '/formations' })}
            className="flat-action"
          >
            Retour aux formations
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell max-w-4xl">
      <div className="panel-flat p-6 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Formation
            </p>
            <h1 className="mt-1 truncate text-[18px] font-semibold text-[var(--color-text-primary)]">
              {formation.titre}
            </h1>
          </div>
          <button
            onClick={() => navigate({ to: role === 'MENTOR' ? '/mes-formations' : '/formations' })}
            className="flat-action shrink-0"
          >
            Retour aux formations
          </button>
        </div>

        <div className="grid gap-3">
          {formation.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between gap-3 rounded-[20px] border border-[var(--color-border)] bg-white px-4 py-3 transition-colors hover:bg-[var(--color-surface-soft)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#eef0ff] text-[12px] font-semibold text-[#3840C0]">
                  {lesson.ordre}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-semibold text-[var(--color-text-primary)]">
                    {lesson.titre}
                  </h3>
                </div>
              </div>
              <Link
                to="/formations/$formationId/lessons/$lessonId"
                params={{ formationId: formation.id, lessonId: lesson.id }}
                className="flat-action shrink-0"
              >
                <PlayCircle className="w-4 h-4" />
                Lire la vidéo
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
