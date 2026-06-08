import { useNavigate,useParams } from '@tanstack/react-router'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAjouterLesson, useFormationDetail } from '@/hooks/useFormations'
import { Loader2, ArrowLeft, UploadCloud, Link as LinkIcon, Video } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/apiClient'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const formSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis').max(150),
  ordre: z.coerce.number().min(1, "L'ordre doit être supérieur à 0"),
  contenu_texte: z.string().min(1, 'Le contenu texte est requis'),
  url_video: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// export const Route = createFileRoute('/(dashboard)/_layout/mes-formations/$formationId/lessons/creer')({})

export default function CreerLessonPage() {
  const { formationId } = useParams({
    from:"/(dashboard)/_layout/mes-formations/$formationId/lessons/creer"
  })
  const navigate = useNavigate()
  
  const { data: formation } = useFormationDetail(formationId)
  const ajouterLesson = useAjouterLesson(formationId)

  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      titre: '',
      ordre: 1,
      contenu_texte: '',
      url_video: '',
    },
  })

  const [mdTab, setMdTab] = useState<'edit' | 'preview'>('edit')
  const contenuTexte = watch('contenu_texte')

  // Set default ordre when formation is loaded
  useEffect(() => {
    if (formation) {
      reset({
        titre: '',
        ordre: formation.nombre_lessons + 1,
        contenu_texte: '',
        url_video: '',
      })
    }
  }, [formation, reset])

  const onSubmit = async (data: FormValues) => {
    let finalVideoUrl = data.url_video

    if (uploadMode === 'file') {
      if (!videoFile) {
        toast.error('Veuillez sélectionner un fichier vidéo')
        return
      }
      try {
        setIsUploading(true)
        const formData = new FormData()
        formData.append('video', videoFile)
        const res = await apiClient.post('/upload/video', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        finalVideoUrl = res.data.url
      } catch(e) {
        console.log("on a rencontré une erreur lors de l'uploads")
        // if(res)
        
        console.log(e);
        toast.error('Erreur lors de l\'upload de la vidéo')
        setIsUploading(false)
        return
      } finally {
        setIsUploading(false)
      }
    }

    if (!finalVideoUrl) {
      toast.error('Une URL de vidéo ou un fichier est requis')
      return
    }

    ajouterLesson.mutate(
      {
        titre: data.titre,
        ordre: data.ordre,
        contenu_texte: data.contenu_texte,
        url_video: finalVideoUrl,
      },
      {
        onSuccess: () => {
          toast.success('Leçon ajoutée avec succès')
          navigate({
            to: '/mes-formations/$formationId',
            params: { formationId },
          })
        },
        onError: () => {
          toast.error('Erreur lors de l\'ajout de la leçon')
        },
      }
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/mes-formations/$formationId', params: { formationId } })}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <div>
          <h1 className="text-[18px] text-zinc-900 font-semibold">Ajouter une leçon</h1>
          <p className="text-[12px] text-zinc-500">Pour la formation : {formation?.titre}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-[13px] font-medium text-zinc-700 mb-1">Titre de la leçon *</label>
            <input
              {...register('titre')}
              className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              placeholder="Ex: Introduction au marché B2B"
            />
            {errors.titre && <p className="text-red-500 text-[11px] mt-1">{errors.titre.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1">Ordre *</label>
            <input
              type="number"
              {...register('ordre')}
              className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
            {errors.ordre && <p className="text-red-500 text-[11px] mt-1">{errors.ordre.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-700 mb-1">Vidéo de la leçon *</label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex-1 flex justify-center items-center gap-2 py-2 border rounded-lg text-[13px] transition-all ${uploadMode === 'url' ? 'border-green-600 text-green-700 bg-green-50' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
            >
              <LinkIcon className="w-4 h-4" /> URL externe (YouTube, etc.)
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex-1 flex justify-center items-center gap-2 py-2 border rounded-lg text-[13px] transition-all ${uploadMode === 'file' ? 'border-green-600 text-green-700 bg-green-50' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
            >
              <UploadCloud className="w-4 h-4" /> Uploader un fichier
            </button>
          </div>

          {uploadMode === 'url' ? (
            <input
              {...register('url_video')}
              className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              placeholder="Ex: https://www.youtube.com/watch?v=..."
            />
          ) : (
            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer relative overflow-hidden">
              <input
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Video className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-[13px] font-medium text-zinc-700">
                {videoFile ? videoFile.name : 'Cliquez ou glissez une vidéo'}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">MP4, MOV, AVI jusqu'à 500MB</p>
            </div>
          )}
          {errors.url_video && uploadMode === 'url' && <p className="text-red-500 text-[11px] mt-1">{errors.url_video.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[13px] font-medium text-zinc-700">
              Contenu texte (Markdown) *
            </label>
            <div className="flex items-center gap-3">
              {/* Import fichier .md */}
              <label className="cursor-pointer flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors">
                <UploadCloud className="w-3.5 h-3.5" />
                Importer .md
                <input
                  type="file"
                  accept=".md,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      setValue('contenu_texte', ev.target?.result as string)
                      setMdTab('preview')
                    }
                    reader.readAsText(file)
                  }}
                />
              </label>
              {/* Onglets Éditer / Aperçu */}
              <div className="flex border border-zinc-200 rounded-lg overflow-hidden text-[12px]">
                <button
                  type="button"
                  onClick={() => setMdTab('edit')}
                  className={`px-3 py-1 transition-colors ${mdTab === 'edit' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}
                >Éditer</button>
                <button
                  type="button"
                  onClick={() => setMdTab('preview')}
                  className={`px-3 py-1 transition-colors ${mdTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}
                >Aperçu</button>
              </div>
            </div>
          </div>

          {mdTab === 'edit' ? (
            <>
              <textarea
                {...register('contenu_texte')}
                rows={12}
                className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono"
                placeholder={`## Introduction\n\nDécrivez ici le contenu de la leçon...\n\n**Points importants :**\n- Point 1\n- Point 2\n\n> Conseil ou citation importante`}
              />
              <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                💡 <code className="bg-zinc-100 px-1 rounded text-zinc-600">## Titre</code> = titre de section &nbsp;·&nbsp;
                <code className="bg-zinc-100 px-1 rounded text-zinc-600">**texte**</code> = <strong>gras</strong> &nbsp;·&nbsp;
                <code className="bg-zinc-100 px-1 rounded text-zinc-600">- item</code> = liste &nbsp;·&nbsp;
                <code className="bg-zinc-100 px-1 rounded text-zinc-600">`code`</code> = code inline
              </p>
            </>
          ) : (
            <div className="min-h-[280px] border border-zinc-200 rounded-lg p-4 bg-white prose prose-sm prose-zinc max-w-none
              prose-headings:font-semibold prose-headings:text-zinc-900
              prose-p:text-zinc-700 prose-p:leading-relaxed
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-zinc-100 prose-code:text-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em]
              prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl
              prose-blockquote:border-green-400 prose-blockquote:text-zinc-600
              prose-strong:text-zinc-900
            ">
              {contenuTexte
                ? <ReactMarkdown>{contenuTexte}</ReactMarkdown>
                : <p className="text-zinc-400 text-[13px] italic">Rien à prévisualiser. Basculez sur "Éditer" pour saisir du contenu.</p>
              }
            </div>
          )}
          {errors.contenu_texte && <p className="text-red-500 text-[11px] mt-1">{errors.contenu_texte.message}</p>}
        </div>

        <div className="pt-4 flex justify-end border-t border-zinc-100">
          <button
            type="submit"
            disabled={ajouterLesson.isPending || isUploading}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {(ajouterLesson.isPending || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? 'Upload en cours...' : 'Ajouter la leçon'}
          </button>
        </div>
      </form>
    </div>
  )
}
