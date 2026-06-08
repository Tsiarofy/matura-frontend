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

interface FichierMiniViewerProps {
  url: string
  type: string | null
  nom: string | null
  trigger?: ReactNode
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'

export function FichierMiniViewer({ url, type, nom, trigger }: FichierMiniViewerProps) {
  const [open, setOpen] = useState(false)

  const fullUrl = useMemo(() => {
    return url.startsWith('http') ? url : `${BASE_URL}${url}`
  }, [url])

  const icon =
    type === 'PDF' ? (
      <FileText className="w-3.5 h-3.5" />
    ) : type === 'IMAGE' ? (
      <ImageIcon className="w-3.5 h-3.5" />
    ) : type === 'VIDEO' ? (
      <Video className="w-3.5 h-3.5" />
    ) : type === 'EXCEL' ? (
      <FileSpreadsheet className="w-3.5 h-3.5" />
    ) : (
      <FileText className="w-3.5 h-3.5" />
    )

  const defaultTrigger = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-800 hover:underline"
    >
      <Eye className="w-3.5 h-3.5" />
      {nom ?? 'Voir le fichier'}
    </button>
  )

  const renderContent = () => {
    switch (type) {
      case 'PDF':
        return (
          <iframe
            src={fullUrl}
            className="w-full h-[60vh] rounded border border-zinc-200"
            title={nom ?? 'Fichier PDF'}
          />
        )
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
              Telecharger
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
