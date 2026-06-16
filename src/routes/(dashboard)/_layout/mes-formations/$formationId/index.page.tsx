import { Link, useNavigate,useParams } from '@tanstack/react-router'
import { useFormationDetail } from '@/hooks/useFormations'
import { Loader2, ArrowLeft, Plus, PlayCircle } from 'lucide-react'
import { DOMAINE_LABELS, TYPE_CIBLE_LABELS } from '@/lib/constants'

//, STADE_LABELS
// export const Route = createFileRoute('/(dashboard)/_layout/mes-formations/$formationId/')({})

export default function MesFormationsDetailPage() {
  const { formationId } = useParams({
    from:"/(dashboard)/_layout/mes-formations/$formationId/"
  })
  const navigate = useNavigate()
  
  const { data: formation, isLoading } = useFormationDetail(formationId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    )
  }

  if (!formation) {
    return <div className="text-zinc-500 text-center py-12">Formation introuvable.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/mes-formations' })}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-600" />
          </button>
          <div>
            <h1 className="text-[18px] text-zinc-900 font-semibold">{formation.titre}</h1>
            <p className="text-[12px] text-zinc-500">{DOMAINE_LABELS[formation.domaine] || formation.domaine}</p>
          </div>
        </div>
        <button
          onClick={() => navigate({ to: '/mes-formations/$formationId/lessons/creer', params: { formationId: formation.id } })}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter une leçon
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-sm">
        <h2 className="text-[14px] font-medium text-zinc-800">Détails de la formation</h2>
        <p className="text-[13px] text-zinc-600">{formation.description || "Aucune description fournie."}</p>
        
        <div className="flex gap-2">
          {formation.stade_cible && (
            <span className="text-[11px] bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-medium border border-amber-100">
              Stade {formation.stade_cible}
            </span>
          )}
          {formation.type_cible && (
            <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-100">
              {TYPE_CIBLE_LABELS[formation.type_cible]}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[15px] font-medium text-zinc-800">Leçons ({formation.nombre_lessons})</h2>
        {formation.lessons.length === 0 ? (
          <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-xl p-8 text-center">
            <p className="text-[13px] text-zinc-500 mb-3">Aucune leçon n'a encore été ajoutée.</p>
            <button
              onClick={() => navigate({ to: '/mes-formations/$formationId/lessons/creer', params: { formationId: formation.id } })}
              className="text-green-600 text-[13px] font-medium hover:underline"
            >
              Créer la première leçon
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {formation.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-[6px] bg-[#eef0ff] flex items-center justify-center text-[#3840C0] text-[12px] font-semibold shrink-0">
                    {lesson.ordre}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-zinc-900">{lesson.titre}</h3>
                  </div>
                </div>
                <Link
                  to="/mes-formations/$formationId/lessons/$lessonId"
                  params={{ formationId: formation.id, lessonId: lesson.id }}
                  className="flex items-center gap-1.5 text-[12px] text-green-600 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Aperçu
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
