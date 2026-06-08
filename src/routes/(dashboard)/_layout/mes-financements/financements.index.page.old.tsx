import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useFinancements } from '@/hooks/useFinancements';
import { FinancementCard } from '@/components/financement/FinancementCard';
import { FiltresFinancementPanel } from '@/components/financement/FiltresFinancementPanel';
import { TypeFinancement, StatutOffre, type FiltresFinancement } from '@maturproj/shared';

const FILTRES_INITIAUX: FiltresFinancement = {
  page: 1,
  limit: 20,
  statut: StatutOffre.OUVERTE,
};

export default function FinancementsPage() {
  const navigate = useNavigate();
  const [filtres, setFiltres] = useState<FiltresFinancement>(FILTRES_INITIAUX);
  const { data, isLoading, isError } = useFinancements(filtres);

  const handleFiltreChange = useCallback(
    (partial: Partial<FiltresFinancement>) => {
      setFiltres((prev) => ({ ...prev, ...partial, page: 1 }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setFiltres(FILTRES_INITIAUX);
  }, []);

  const handleCardClick = (id: string) => {
    navigate({ to: '/financements/$financementId', params: { financementId: id } });
  };

  const offres = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="financements-page">
      {/* En-tête */}
      <div className="page-header">
        <div className="page-header__text">
          <h1>Financements disponibles</h1>
          <p>
            {data?.total !== undefined
              ? `${data.total} offre${data.total > 1 ? 's' : ''} disponible${data.total > 1 ? 's' : ''}`
              : 'Chargement…'}
          </p>
        </div>
      </div>

      <div className="financements-layout">
        {/* Panneau filtres */}
        <aside className="financements-layout__aside">
          <FiltresFinancementPanel
            filtres={filtres}
            onChange={handleFiltreChange}
            onReset={handleReset}
          />
        </aside>

        {/* Grille des offres */}
        <main className="financements-layout__main">
          {/* Barre de recherche rapide */}
          <div className="search-bar">
            <span className="search-bar__icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher une offre de financement…"
              value={filtres.recherche ?? ''}
              onChange={(e) =>
                handleFiltreChange({ recherche: e.target.value || undefined })
              }
              className="search-bar__input"
            />
            {filtres.recherche && (
              <button
                className="search-bar__clear"
                onClick={() => handleFiltreChange({ recherche: undefined })}
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>

          {/* Contenu */}
          {isLoading ? (
            <div className="financements-grid financements-grid--loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="financement-card-skeleton" />
              ))}
            </div>
          ) : isError ? (
            <div className="state-error">
              <span>⚠️</span>
              <p>Impossible de charger les offres. Veuillez réessayer.</p>
              <button onClick={() => setFiltres((f) => ({ ...f }))}>Réessayer</button>
            </div>
          ) : offres.length === 0 ? (
            <div className="state-empty">
              <span>📭</span>
              <p>Aucune offre ne correspond à vos critères.</p>
              <button onClick={handleReset}>Réinitialiser les filtres</button>
            </div>
          ) : (
            <>
              <div className="financements-grid">
                {offres.map((offre) => (
                  <FinancementCard
                    key={offre.id}
                    offre={offre}
                    onClick={() => handleCardClick(offre.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={filtres.page === 1}
                    onClick={() => handleFiltreChange({ page: (filtres.page ?? 1) - 1 })}
                  >
                    ← Précédent
                  </button>
                  <span>
                    Page {filtres.page} / {totalPages}
                  </span>
                  <button
                    disabled={filtres.page === totalPages}
                    onClick={() => handleFiltreChange({ page: (filtres.page ?? 1) + 1 })}
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
  );
}
