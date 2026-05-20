// import React from "React";
import { useParams, useNavigate,Link} from '@tanstack/react-router'
import { useFormationDetail } from '@/hooks/useFormations'
import { Loader2 } from 'lucide-react'
import {PlayCircle} from "lucide-react"
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
        <p className="text-[13px] text-zinc-500">Chargement des leçons...</p>
      </div>
    )
  }

  if (error || !formation) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white border border-zinc-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
        <p className="text-[14px] text-zinc-800 font-medium">Formation introuvable</p>
        <p className="text-[12px] text-zinc-500">
          La formation demandée n'existe pas ou vous n'avez pas les droits pour y accéder.
        </p>
        <button
          onClick={() => navigate({ to: role === 'MENTOR' ? '/mes-formations' : '/formations' })}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors inline-block"
        >
          Retour aux formations
        </button>
      </div>
    )
  }

  if (formation.lessons && formation.lessons.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white border border-zinc-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
        <p className="text-[14px] text-zinc-800 font-medium">{formation.titre}</p>
        <p className="text-[12px] text-zinc-500">
          Cette formation ne contient aucune leçon pour le moment.
        </p>
        <button
          onClick={() => navigate({ to: role === 'MENTOR' ? '/mes-formations' : '/formations' })}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors inline-block"
        >
          Retour aux formations
        </button>
      </div>
    )
  }

  return (
      <div className="max-w-md mx-auto mt-12 bg-white border border-zinc-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
        <p className="text-[14px] text-zinc-800 font-medium">{formation.titre}</p>
        {
          <div className="grid gap-3">
            {formation.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 text-[12px] font-medium">
                    {lesson.ordre}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-zinc-900">{lesson.titre}</h3>
                  </div>
                </div>
                <Link
                  to="/formations/$formationId/lessons/$lessonId"
                  params={{ formationId: formation.id, lessonId: lesson.id }}
                  className="flex items-center gap-1.5 text-[12px] text-green-600 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Lire la vidéo
                </Link>
              </div>
            ))}
          </div>
}

        <button
          onClick={() => navigate({ to: role === 'MENTOR' ? '/mes-formations' : '/formations' })}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors inline-block"
        >
          Retour aux formations
        </button>
      </div>
  )
}
