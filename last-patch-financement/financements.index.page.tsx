import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useFinancements } from '@/hooks/useFinancements'
import { FinancementCard } from '@/components/financement/FinancementCard'
import { FiltresFinancementPanel } from '@/components/financement/FiltresFinancementPanel'
import { StatutOffre, type FiltresFinancement } from '@matura/shared'
import { Loader2 } from 'lucide-react'

const FILTRES_INITIAUX: FiltresFinancement = {
  page: 1, limit: 20, statut: StatutOffre.OUVERTE,
}

export default function FinancementsPage() {
  const navigate = useNavigate()
  const [filtres, setFiltres] = useState<FiltresFinancement>(FILTRES_INITIAUX)
  const { data, isLoading, isError } = useFinancements(filtres)

  const handleFiltreChange = useCallback((partial: Partial<FiltresFinancement>) => {
    setFiltres((prev) => ({ ...prev, ...partial, page: 1 }))
  }, [])

  const handleReset = useCallback(() => setFiltres(FILTRES_INITIAUX), [])

  const offres = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-[20px] text-zinc-900">Financements disponibles</h1>
        <p className="text-[12px] text-zinc-500 mt-1">
          {data?.total !== undefined
            ? `${data.total} offre${data.total > 1 ? 's' : ''} disponible${data.total > 1 ? 's' : ''}`
            : 'Chargement…'}
        </p>
      </div>

      <div className="flex gap-5">
        {/* Panneau filtres */}
        <aside className="w-56 shrink-0">
          <FiltresFinancementPanel
            filtres={filtres}
            onChange={handleFiltreChange}
            onReset={handleReset}
          />
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Barre de recherche */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-2">
            <span className="text-zinc-400">🔍</span>
            <input
              type="text"
              placeholder="Rechercher une offre…"
              value={filtres.recherche ?? ''}
              onChange={(e) => handleFiltreChange({ recherche: e.target.value || undefined })}
              className="flex-1 text-[12px] text-zinc-700 outline-none bg-transparent"
            />
            {filtres.recherche && (
              <button
                onClick={() => handleFiltreChange({ recherche: undefined })}
                className="text-zinc-400 hover:text-zinc-600 text-[11px]"
              >
                ✕
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center py-12 gap-2 text-center">
              <p className="text-[13px] text-zinc-500">⚠️ Impossible de charger les offres.</p>
              <button
                onClick={() => setFiltres((f) => ({ ...f }))}
                className="text-[12px] text-green-600 hover:text-green-700"
              >
                Réessayer
              </button>
            </div>
          ) : offres.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-2 text-center">
              <p className="text-[13px] text-zinc-500">Aucune offre ne correspond à vos critères.</p>
              <button onClick={handleReset} className="text-[12px] text-green-600 hover:text-green-700">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {offres.map((offre) => (
                  <FinancementCard
                    key={offre.id}
                    offre={offre}
                    onClick={() => navigate({
                      to: '/financements/$financementId',
                      params: { financementId: offre.id },
                    })}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    disabled={filtres.page === 1}
                    onClick={() => handleFiltreChange({ page: (filtres.page ?? 1) - 1 })}
                    className="text-[12px] text-zinc-500 hover:text-zinc-700 disabled:opacity-40"
                  >
                    ← Précédent
                  </button>
                  <span className="text-[12px] text-zinc-400">
                    {filtres.page} / {totalPages}
                  </span>
                  <button
                    disabled={filtres.page === totalPages}
                    onClick={() => handleFiltreChange({ page: (filtres.page ?? 1) + 1 })}
                    className="text-[12px] text-zinc-500 hover:text-zinc-700 disabled:opacity-40"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
