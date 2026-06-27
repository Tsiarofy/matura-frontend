import { useParams } from '@tanstack/react-router'
import { getFileUrl } from '@/lib/apiClient'
import { useFormationDetail } from '@/hooks/useFormations'
// import ReactPlayer from 'react-player'
import ReactMarkdown from 'react-markdown'
import { Link } from '@tanstack/react-router'
import { PlayCircle, ChevronLeft } from 'lucide-react'
import { Loader2 } from 'lucide-react'

// export const Route = createFileRoute('/(dashboard)/_layout/formations/$formationId/lessons/$lessonId/')({})

export default function LessonViewerPage() {
  const { formationId, lessonId } = useParams({
 from :"/(dashboard)/_layout/formations/$formationId/lessons/$lessonId/"
    }
  )
  // const Player=ReactPlayer as React.ComponentType<ReactPlayerProps>;
  const { data: formation, isLoading } = useFormationDetail(formationId)
  const lesson = formation?.lessons.find((l) => l.id === lessonId)
  const lessonIndex = formation?.lessons.findIndex((l) => l.id === lessonId) ?? 0
  const lessonPrecedente = formation?.lessons[lessonIndex - 1]
  const lessonSuivante = formation?.lessons[lessonIndex + 1]
  const videoUrl = getFileUrl(lesson?.url_video);
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
    <div className="mx-auto flex w-full max-w-6xl gap-6">

      {/* ─── CONTENU PRINCIPAL ─────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2">
          <Link
            to="/formations"
            className="flex items-center gap-1 text-[12px] text-[#757575] hover:text-[#318055] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#b6b6b6]" />
            Formations
          </Link>
          <span className="text-[#b6b6b6] text-[12px]">/</span>
          <span className="text-[12px] text-[#41A677] font-medium truncate">{formation.titre}</span>
        </div>

        {/* Titre de la leçon */}
        <h1 className="text-[18px] font-semibold text-[var(--color-text-primary)]">{lesson.titre}</h1>

        {/* Lecteur vidéo */}
        <div className="panel-flat overflow-hidden bg-black aspect-video">
          {videoUrl && (
            <video
              src={videoUrl}
              width="100%"
              height="100%"
              controls
              autoPlay={true}
              style={{ display: 'block', width: '100%', height: '100%' }}
            />
          )}
        </div>

        {/* Contenu texte (Markdown) */}
        <div className="prose prose-sm prose-zinc max-w-none
          prose-headings:font-semibold prose-headings:text-[#6f74f7]
          prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed
          prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline
          prose-code:bg-zinc-100 prose-code:text-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em]
          prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl
          prose-blockquote:border-[var(--color-border-strong)] prose-blockquote:text-[var(--color-text-secondary)]
          prose-strong:text-[var(--color-text-primary)]
        ">
          <ReactMarkdown>{lesson.contenu_texte}</ReactMarkdown>
        </div>

        {/* Navigation leçon précédente / suivante */}
        <div className="flex justify-between pt-4 border-t border-[var(--color-border)]">
          {lessonPrecedente ? (
            <Link
              to="/formations/$formationId/lessons/$lessonId"
              params={{ formationId, lessonId: lessonPrecedente.id }}
              className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {lessonPrecedente.titre}
            </Link>
          ) : <div />}

          {lessonSuivante && (
            <Link
              to="/formations/$formationId/lessons/$lessonId"
              params={{ formationId, lessonId: lessonSuivante.id }}
              className="text-[13px] text-[var(--color-text-primary)] flex items-center gap-1 font-semibold hover:opacity-80"
            >
              {lessonSuivante.titre}
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Link>
          )}
        </div>
      </div>

      {/* ─── SIDEBAR LEÇONS ────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0">
        <div className="panel-flat sticky top-4 p-3">
          <p className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] font-medium mb-2 px-1">
            Leçons de la formation
          </p>
          <div className="space-y-0.5">
            {formation.lessons.map((l, idx) => {
              const isActive = l.id === lessonId
              return (
                <Link
                  key={l.id}
                  to="/formations/$formationId/lessons/$lessonId"
                  params={{ formationId, lessonId: l.id }}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-[14px] border border-transparent text-[12px] transition-colors ${
                    isActive
                      ? 'bg-white text-[var(--color-text-primary)] border-[var(--color-border)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {isActive
                    ? <PlayCircle className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-primary)]" />
                    : <span className="w-3.5 h-3.5 shrink-0 text-[10px] text-[var(--color-text-muted)] text-center">{idx + 1}</span>
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

