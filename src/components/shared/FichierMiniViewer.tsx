import { type ReactNode, useMemo, useState, useEffect } from 'react'
import {
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Video,
  Loader2,
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import * as XLSX from 'xlsx'

interface FichierMiniViewerProps {
  url: string
  type: string | null
  nom: string | null
  trigger?: ReactNode
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

function ExcelViewer({ url }: { url: string }) {
  const [tableData, setTableData] = useState<any[][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndParse = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Network response was not ok')
        const buffer = await response.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) throw new Error('No sheets found')
        const firstSheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json<any[]>(firstSheet, { header: 1 })
        setTableData(jsonData.slice(0, 100)) // Limiter à 100 lignes
      } catch (err) {
        setError('Impossible de lire le fichier Excel.')
      } finally {
        setLoading(false)
      }
    }
    fetchAndParse()
  }, [url])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <p className="text-[12px] text-zinc-400">Chargement et lecture du tableur...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-[13px] text-zinc-600">{error}</p>
        <a
          href={url}
          download
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-[13px]"
        >
          <Download className="w-4 h-4" /> Télécharger
        </a>
      </div>
    )
  }

  return (
    <div className="max-h-[60vh] overflow-auto rounded border border-zinc-200 bg-white">
      <table className="w-full text-[11px] border-collapse">
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i} className={i === 0 ? 'bg-zinc-100 font-semibold' : 'hover:bg-zinc-50'}>
              {row.map((cell, j) => (
                <td key={j} className="border border-zinc-200 px-2.5 py-1.5 text-zinc-700 whitespace-nowrap">
                  {cell !== null && cell !== undefined ? String(cell) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FichierMiniViewer({ url, type, nom, trigger }: FichierMiniViewerProps) {
  const [open, setOpen] = useState(false)

  const fullUrl = useMemo(() => {
    return url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
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
          <div className="w-full h-[60vh] rounded border border-zinc-200 overflow-hidden">
            <object
              data={fullUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex flex-col items-center justify-center h-full gap-4 p-4 bg-zinc-50">
                <FileText className="w-12 h-12 text-zinc-400" />
                <p className="text-[13px] text-zinc-600 text-center">
                  Impossible d'afficher le PDF dans le navigateur.
                </p>
                <a
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Ouvrir dans un nouvel onglet
                </a>
              </div>
            </object>
          </div>
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
      case 'EXCEL':
        return <ExcelViewer url={fullUrl} />
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
