import { useState, useRef } from 'react';
import { useDocuments, type DocumentEv } from '@/hooks/useDocuments';
import { File, Image as ImageIcon, Video, Link as LinkIcon, Trash2, UploadCloud, X, Loader2, FileText, Download } from 'lucide-react';
// import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  stadeId: string;
  readOnly?: boolean;
}

export function EvidencePanel({ stadeId, readOnly = false }: Props) {
  const { documents, isLoading, uploadDoc, deleteDoc } = useDocuments(stadeId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentEv | null>(null);

  const BACKEND_URL = import.meta.env.VITE_BASE_URL || window.location.origin;
  const getFullUrl = (url: string) => url.startsWith('http') ? url : `${BACKEND_URL}${url}`;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Fichier trop lourd", { description: "Le document ne doit pas dépasser 15 Mo." });
      return;
    }
    // On peut demander une description ou un type, mais pour simplifier on envoie directement
    uploadDoc.mutate({ file });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'PDF': return <FileText className="w-6 h-6 text-red-500" />;
      case 'VIDEO': return <Video className="w-6 h-6 text-purple-500" />;
      case 'LIEN': return <LinkIcon className="w-6 h-6 text-green-500" />;
      default: return <File className="w-6 h-6 text-zinc-500" />;
    }
  };

  return (
    <div className="panel-flat p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Preuves & Documents</h3>
          <p className="text-xs text-[var(--color-text-muted)]">Justifiez les informations de ce stade (photos, PDF, vidéos...)</p>
        </div>
        {!readOnly && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,application/pdf,video/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadDoc.isPending}
              variant="outline"
              size="sm"
            >
              {uploadDoc.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              Uploader
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>
      ) : documents.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-[22px] bg-[var(--color-surface-soft)]">
          <File className="w-8 h-8 text-[var(--color-text-disabled)] mx-auto mb-2" />
          <p className="text-xs text-[var(--color-text-muted)]">Aucun document pour l'instant</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex flex-col items-center justify-center p-4 border border-[var(--color-border)] rounded-[22px] cursor-pointer transition-colors bg-[var(--color-surface-soft)] hover:bg-white"
              onClick={() => setSelectedDoc(doc)}
            >
              {getIcon(doc.type_fichier)}
              <span className="mt-2 text-[11px] font-medium text-[var(--color-text-secondary)] text-center line-clamp-2 w-full break-words">
                {doc.nom}
              </span>
              
              {!readOnly && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); deleteDoc.mutate(doc.id); }}
                  disabled={deleteDoc.isPending}
                  className="absolute -top-2 -right-2 bg-white border border-[var(--color-border)] text-[var(--color-error)] rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--color-error-bg)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal d'Aperçu (Agrandissement) */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-zinc-950 border-zinc-800">
          <DialogTitle className="sr-only">Aperçu du document</DialogTitle>
          <DialogDescription className="sr-only">Affichage en grand du document {selectedDoc?.nom}</DialogDescription>
          
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-zinc-950 text-zinc-200 absolute top-0 w-full z-10 bg-opacity-80 backdrop-blur-sm">
            <div className="flex items-center gap-3 truncate pr-4">
              {selectedDoc && getIcon(selectedDoc.type_fichier)}
              <span className="text-sm font-medium truncate">{selectedDoc?.nom}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedDoc?.url && (
                <a href={getFullUrl(selectedDoc.url)} download className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full h-[60vh] flex items-center justify-center bg-zinc-950 mt-16 p-4">
            {selectedDoc?.type_fichier === 'IMAGE' ? (
              <img src={getFullUrl(selectedDoc.url)} alt={selectedDoc.nom} className="max-w-full max-h-full object-contain rounded-md" />
            ) : selectedDoc?.type_fichier === 'VIDEO' ? (
              <video src={getFullUrl(selectedDoc.url)} controls className="max-w-full max-h-full rounded-md" />
            ) : selectedDoc?.type_fichier === 'PDF' ? (
              <iframe src={getFullUrl(selectedDoc.url)} className="w-full h-full rounded-md bg-white" />
            ) : (
              <div className="flex flex-col items-center text-zinc-400">
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm text-center mb-2">Les navigateurs ne peuvent pas afficher ce type de fichier (.docx, etc.) directement dans cette fenêtre.</p>
                <a href={getFullUrl(selectedDoc?.url || '')} download className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Télécharger le document
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
