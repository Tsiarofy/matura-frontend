import { useParams } from '@tanstack/react-router'
import { useFormationDetail } from '@/hooks/useFormations'
import ReactMarkdown from 'react-markdown'
import { Link } from '@tanstack/react-router'
import { PlayCircle, ChevronLeft, Loader2 } from 'lucide-react'

export default function MentorLessonViewerPage() {
  const { formationId, lessonId } = useParams({
    from: '/(dashboard)/_layout/mes-formations/$formationId/lessons/$lessonId/',
  })
  const { data: formation, isLoading } = useFormationDetail(formationId)
  const lesson = formation?.lessons.find((l) => l.id === lessonId)
  const lessonIndex = formation?.lessons.findIndex((l) => l.id === lessonId) ?? 0
  const lessonPrecedente = formation?.lessons[lessonIndex - 1]
  const lessonSuivante = formation?.lessons[lessonIndex + 1]

  // ✅ Construit et valide l'URL — jamais de "undefinedundefined" ou "localhost:3000undefined"
const validVideoUrl = (() => {
  if (!lesson?.url_video) return null
  const url = lesson.url_video.startsWith('http')
    ? lesson.url_video
    : `${import.meta.env.VITE_BASE_URL}${lesson.url_video}`
  return url.includes('undefined') ? null : url
})()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-green-600" />
      </div>
    )
  }

  if (!formation || !lesson) {
    return <p className="text-zinc-500 text-[13px]">Leçon introuvable.</p>
  }

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">

      {/* ─── CONTENU PRINCIPAL ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2">
          <Link
            to="/mes-formations"
            className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Mes Formations
          </Link>
          <span className="text-zinc-300 text-[12px]">/</span>
          <Link
            to="/mes-formations/$formationId"
            params={{ formationId }}
            className="text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors truncate"
          >
            {formation.titre}
          </Link>
        </div>

        {/* Titre de la leçon */}
        <h1 className="text-[18px] text-zinc-900 font-medium">{lesson.titre}</h1>

        {/* Lecteur vidéo */}
{/* Lecteur vidéo */}
<div className="rounded-xl overflow-hidden bg-black aspect-video">
  {validVideoUrl ? (
    <video
      key={validVideoUrl}
      src={validVideoUrl}
      width="100%"
      height="100%"
      controls
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  ) : (
    <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
      Chargement...
    </div>
  )}
</div>

        {/* Contenu texte (Markdown) */}
        <div className="prose prose-sm prose-zinc max-w-none
          prose-headings:font-semibold prose-headings:text-zinc-900
          prose-p:text-zinc-700 prose-p:leading-relaxed
          prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
          prose-code:bg-zinc-100 prose-code:text-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em]
          prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl
          prose-blockquote:border-green-400 prose-blockquote:text-zinc-600
          prose-strong:text-zinc-900
        ">
          <ReactMarkdown>{lesson.contenu_texte}</ReactMarkdown>
        </div>

        {/* Navigation leçon précédente / suivante */}
        <div className="flex justify-between pt-4 border-t border-zinc-100">
          {lessonPrecedente ? (
            <Link
              to="/mes-formations/$formationId/lessons/$lessonId"
              params={{ formationId, lessonId: lessonPrecedente.id }}
              className="text-[13px] text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {lessonPrecedente.titre}
            </Link>
          ) : <div />}

          {lessonSuivante && (
            <Link
              to="/mes-formations/$formationId/lessons/$lessonId"
              params={{ formationId, lessonId: lessonSuivante.id }}
              className="text-[13px] text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
            >
              {lessonSuivante.titre}
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Link>
          )}
        </div>
      </div>

      {/* ─── SIDEBAR LEÇONS ────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0">
        <div className="sticky top-4 bg-white border border-zinc-200 rounded-xl p-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-2 px-1">
            Leçons de la formation
          </p>
          <div className="space-y-0.5">
            {formation.lessons.map((l, idx) => {
              const isActive = l.id === lessonId
              return (
                <Link
                  key={l.id}
                  to="/mes-formations/$formationId/lessons/$lessonId"
                  params={{ formationId, lessonId: l.id }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  {isActive
                    ? <PlayCircle className="w-3.5 h-3.5 shrink-0 text-green-600" />
                    : <span className="w-3.5 h-3.5 shrink-0 text-[10px] text-zinc-400 text-center">{idx + 1}</span>
                  }
                  <span className="truncate">{l.titre}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </div>
  )
}