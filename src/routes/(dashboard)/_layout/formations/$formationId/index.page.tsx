import { useParams, useNavigate } from '@tanstack/react-router'
import { useFormationDetail } from '@/hooks/useFormations'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { authStore } from '@/stores/authStore'

export default function FormationRedirectPage() {
  const { formationId } = useParams({
    from: '/(dashboard)/_layout/formations/$formationId/',
  })

  const navigate = useNavigate()
  const { data: formation, isLoading, error } = useFormationDetail(formationId)
  const role = authStore((s) => s.utilisateur?.role)

  useEffect(() => {
    if (formation) {
      if (role === 'MENTOR') {
        navigate({
          to: '/mes-formations/$formationId',
          params: { formationId },
          replace: true,
        })
        return
      }
      if (formation.lessons && formation.lessons.length > 0) {
        navigate({
          to: '/formations/$formationId/lessons',
          params: {
            formationId,
          },
          replace: true,
        })
      }
    }
  }, [formation, formationId, navigate, role])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <p className="text-[13px] text-zinc-500">Chargement de la formation...</p>
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

  return null
}
