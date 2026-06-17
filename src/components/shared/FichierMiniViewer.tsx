import { type ReactNode, useMemo, useState } from 'react'
import {
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Video,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BASE_URL } from '@/lib/apiClient'

interface FichierMiniViewerProps {
  url: string
  type: string | null
  nom: string | null
  trigger?: ReactNode
}

export function FichierMiniViewer({ url, type, nom, trigger }: FichierMiniViewerProps) {
  const [open, setOpen] = useState(false)

  const normalizedUrl = useMemo(() => {
    if (!url) return ''
    return url.replace(/\\/g, '/')
  }, [url])

  const fullUrl = useMemo(() => {
    if (!normalizedUrl) return ''
    if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
      return normalizedUrl
    }
    const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
    const path = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`
    return `${base}${path}`
  }, [normalizedUrl])

  const normalizedType = useMemo(() => {
    return type ? type.toUpperCase().trim() : ''
  }, [type])

  const isExternalTabFile = normalizedType === 'PDF' || normalizedType === 'EXCEL';

  if (isExternalTabFile) {
    if (trigger) {
      return (
        <a href={fullUrl || '#'} target={fullUrl ? "_blank" : undefined} rel="noopener noreferrer" className="cursor-pointer">
          {trigger}
        </a>
      )
    }

    return (
      <a
        href={fullUrl || '#'}
        target={fullUrl ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11.5px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        {normalizedType === 'PDF' ? (
          <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5 text-green-600 shrink-0" />
        )}
        <span className="truncate max-w-[240px]">{nom ?? (normalizedType === 'PDF' ? 'Document PDF' : 'Fichier Excel')}</span>
      </a>
    )
  }

  const icon =
    type === 'IMAGE' ? (
      <ImageIcon className="w-3.5 h-3.5" />
    ) : type === 'VIDEO' ? (
      <Video className="w-3.5 h-3.5" />
    ) : (
      <FileText className="w-3.5 h-3.5" />
    )

  const defaultTrigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 text-[11.5px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
    >
      <Eye className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate max-w-[240px]">{nom ?? 'Voir le fichier'}</span>
    </button>
  )

  const renderContent = () => {
    switch (type) {
      case 'IMAGE':
        return (
          <div className="flex items-center justify-center max-h-[60vh] overflow-auto">
            <img
              src={fullUrl}
              alt={nom ?? 'Image'}
              className="max-w-full max-h-[60vh] object-contain rounded"
            />
          </div>
        )
      case 'VIDEO':
        return (
          <video src={fullUrl} controls className="w-full max-h-[60vh] rounded">
            Votre navigateur ne supporte pas la lecture video.
          </video>
        )
      default:
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
              {icon}
            </div>
            <p className="text-[13px] text-zinc-600">{nom ?? 'Fichier'}</p>
            <a
              href={fullUrl}
              download
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-[13px] hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </a>
          </div>
        )
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger ?? defaultTrigger}
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] p-4">
          <DialogHeader>
            <DialogTitle className="text-[13px] font-medium text-zinc-800 truncate">
              {nom ?? 'Fichier'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
