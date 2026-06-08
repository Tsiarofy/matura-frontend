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
        <p className="text-[13px] text-[var(--color-text-muted)]">Chargement de la formation...</p>
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

  return null
}
