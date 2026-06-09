import { useState } from 'react'
import { useProjetsEligibles, usePostuler } from '@/hooks/useFinancements'
import { type OffreFinancement, type ProjetEligible, BRL_MINIMUM_POSTULATION } from '@matura/shared'
import { Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  offre: OffreFinancement & { investisseur?: { prenom: string; nom: string } }
  onClose: () => void
  onSuccess: () => void
}

export function PostulerModal({ offre, onClose, onSuccess }: Props) {
  const [selectedProjet, setSelectedProjet] = useState<ProjetEligible | null>(null)
  const [message, setMessage] = useState('')
  const [etape, setEtape] = useState<'selection' | 'confirmation'>('selection')

  const { data: projets, isLoading, isError } = useProjetsEligibles(offre.id, true)
  const postuler = usePostuler(offre.id)

  const brlMinimum = Math.max(BRL_MINIMUM_POSTULATION, offre.stadeCible)

  const handlePostuler = async () => {
    if (!selectedProjet) return
    try {
      await postuler.mutateAsync({
        projetId:          selectedProjet.id,
        messageMotivation: message.trim() || undefined,
      })
      onSuccess()
    } catch {
      // erreur affichée via postuler.error
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl border border-zinc-200 w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-zinc-100">
          <div>
            <h2 className="text-[15px] font-medium text-zinc-900">Postuler à une offre</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">{offre.titre}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Étape 1 : sélection du projet */}
        {etape === 'selection' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
              <p className="text-[11px] text-blue-700">
                📋 Seuls vos projets avec un BRL ≥ {brlMinimum}
                {offre.stadeCible > BRL_MINIMUM_POSTULATION
                  ? ` (stade cible requis : BRL ${offre.stadeCible})`
                  : ' (seuil minimum absolu)'}
                {' '}sont affichés.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[12px]">Analyse de vos projets…</span>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-[12px] text-zinc-500">
                  ⚠️ Impossible de charger vos projets.
                </p>
              </div>
            ) : !projets || projets.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="text-[13px] text-zinc-600">Aucun projet éligible</p>
                <p className="text-[11px] text-zinc-400">
                  Vous n'avez pas de projet actif avec un BRL ≥ {brlMinimum}.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-zinc-400">
                  {projets.length} projet{projets.length > 1 ? 's' : ''} éligible{projets.length > 1 ? 's' : ''}
                </p>
                {projets.map((projet) => (
                  <ProjetEligibleRow
                    key={projet.id}
                    projet={projet}
                    selected={selectedProjet?.id === projet.id}
                    onSelect={() => !projet.dejaCandidaté && setSelectedProjet(projet)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Étape 2 : message de motivation */}
        {etape === 'confirmation' && selectedProjet && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-zinc-500">Offre</p>
                <p className="text-[12px] font-medium text-zinc-700">{offre.titre}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-zinc-500">Projet</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[12px] font-medium text-zinc-700">{selectedProjet.nom}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded">
                    BRL {selectedProjet.brl}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-zinc-500">
                Message de motivation <span className="text-zinc-400">(facultatif)</span>
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                placeholder="Présentez pourquoi votre projet correspond à cette offre…"
                className="w-full text-[12px] text-zinc-700 border border-zinc-200 rounded-lg p-3 resize-none outline-none focus:border-green-500 transition-colors"
              />
              <p className="text-[10px] text-zinc-400 text-right">{message.length}/2000</p>
            </div>

            {postuler.isError && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <p className="text-[11px] text-red-600">
                  {(postuler.error as any)?.response?.data?.message ?? 'Une erreur est survenue.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-2 p-5 border-t border-zinc-100">
          {etape === 'selection' ? (
            <>
              <button onClick={onClose}
                className="flex-1 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-[12px] hover:bg-zinc-50 transition-colors">
                Annuler
              </button>
              <button
                disabled={!selectedProjet || selectedProjet.dejaCandidaté}
                onClick={() => setEtape('confirmation')}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40"
              >
                Suivant →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEtape('selection')}
                className="flex-1 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-[12px] hover:bg-zinc-50 transition-colors">
                ← Retour
              </button>
              <button
                disabled={postuler.isPending}
                onClick={handlePostuler}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
              >
                {postuler.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirmer la candidature
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Ligne projet éligible ────────────────────────────────────────────────────

function ProjetEligibleRow({
  projet, selected, onSelect,
}: {
  projet: ProjetEligible
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={projet.dejaCandidaté ? -1 : 0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
        selected
          ? 'border-green-400 bg-green-50'
          : projet.dejaCandidaté
          ? 'border-zinc-100 bg-zinc-50 cursor-not-allowed opacity-60'
          : 'border-zinc-200 hover:border-zinc-300',
      )}
    >
      <div className={cn(
        'w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center',
        selected ? 'border-green-500' : 'border-zinc-300',
      )}>
        {selected && <div className="w-2 h-2 rounded-full bg-green-500" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[12px] font-medium text-zinc-800">{projet.nom}</p>
          <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded">
            BRL {projet.brl}
          </span>
        </div>
        {projet.description && (
          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{projet.description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-zinc-400">
          {projet.secteur && <span>🏭 {projet.secteur}</span>}
          {projet.region && <span>📍 {projet.region}</span>}
          {projet.membreEquipe !== undefined && (
            <span>👤 {projet.membreEquipe} membre{projet.membreEquipe > 1 ? 's' : ''}</span>
          )}
        </div>
        {projet.dejaCandidaté && (
          <p className="text-[10px] text-green-600 mt-1">✓ Candidature déjà soumise</p>
        )}
      </div>
    </div>
  )
}
