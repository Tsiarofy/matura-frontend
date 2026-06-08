import { useNavigate } from '@tanstack/react-router';
import { useMesOffres } from '@/hooks/useInvestisseur';
import { StatutOffre, TypeFinancement } from '@maturproj/shared';

const TYPE_LABELS: Record<string, string> = {
  SUBVENTION: 'Subvention',
  PRET: 'Prêt',
  EQUITY: 'Equity',
  OBLIGATION: 'Obligation',
  DON: 'Don',
};

const STATUT_COLORS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]: 'badge--green',
  [StatutOffre.EN_COURS]: 'badge--blue',
  [StatutOffre.FERMEE]: 'badge--gray',
  [StatutOffre.CLOTUREE]: 'badge--gray',
};

const STATUT_LABELS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]: 'Ouverte',
  [StatutOffre.EN_COURS]: 'En cours',
  [StatutOffre.FERMEE]: 'Fermée',
  [StatutOffre.CLOTUREE]: 'Clôturée',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Page "Mes financements" — VUE INVESTISSEUR
 *
 * Affiche les offres créées par l'investisseur.
 * Clic sur une carte → redirige vers la liste des projets candidats à cette offre.
 *
 * BUG FIX : la version précédente utilisait useMesCandidatures() (hook entrepreneur)
 * ce qui affichait les candidatures soumises au lieu des offres créées.
 */
export default function MesFinancementsPage() {
  const navigate = useNavigate();
  const { data: offres, isLoading, isError } = useMesOffres();

  const handleCardClick = (offreId: string) => {
    navigate({
      to: '/mes-financements/$offreId/candidatures',
      params: { offreId },
    });
  };

  return (
    <div className="mes-financements-page">
      <div className="page-header">
        <div className="page-header__text">
          <h1>Mes financements</h1>
          <p>Cliquez sur une offre pour consulter les projets candidats</p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => navigate({ to: '/projets-a-financer' })}
        >
          + Nouvelle offre
        </button>
      </div>

      {isLoading ? (
        <div className="state-loading">
          <div className="spinner" />
          <p>Chargement de vos offres…</p>
        </div>
      ) : isError ? (
        <div className="state-error">
          <span>⚠️</span>
          <p>Impossible de charger vos offres. Veuillez réessayer.</p>
        </div>
      ) : !offres || offres.length === 0 ? (
        <div className="state-empty">
          <span>📭</span>
          <h3>Aucune offre créée</h3>
          <p>Vous n'avez pas encore publié d'offre de financement.</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate({ to: '/projets-a-financer' })}
          >
            Créer une offre
          </button>
        </div>
      ) : (
        <div className="mes-offres-liste">
          {offres.map((offre) => (
            <article
              key={offre.id}
              className="offre-investisseur-card offre-investisseur-card--clickable"
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(offre.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(offre.id)}
              aria-label={`Voir les candidatures pour ${offre.titre}`}
            >
              {/* Header */}
              <div className="offre-investisseur-card__header">
                <div className="offre-investisseur-card__badges">
                  <span className="badge badge--type">
                    {TYPE_LABELS[offre.typeFinancement] ?? offre.typeFinancement}
                  </span>
                  <span className={`badge ${STATUT_COLORS[offre.statut as StatutOffre]}`}>
                    {STATUT_LABELS[offre.statut as StatutOffre]}
                  </span>
                </div>

                {/* Compteur candidatures — info principale */}
                <div
                  className={`candidatures-counter ${
                    offre._count.candidatures > 0
                      ? 'candidatures-counter--active'
                      : 'candidatures-counter--empty'
                  }`}
                >
                  <span className="candidatures-counter__number">
                    {offre._count.candidatures}
                  </span>
                  <span className="candidatures-counter__label">
                    candidature{offre._count.candidatures !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Corps */}
              <div className="offre-investisseur-card__body">
                <h3 className="offre-investisseur-card__titre">{offre.titre}</h3>
                <p className="offre-investisseur-card__description">
                  {offre.description}
                </p>

                <div className="offre-investisseur-card__infos">
                  <span>📊 Stade BRL ≥ {offre.stadeCible}</span>
                  {offre.dateCloture && (
                    <span>⏳ Clôture le {formatDate(offre.dateCloture)}</span>
                  )}
                  {offre.secteurs?.length > 0 && (
                    <span>🏭 {offre.secteurs.slice(0, 2).join(', ')}</span>
                  )}
                </div>
              </div>

              {/* Footer indicatif */}
              <div className="offre-investisseur-card__footer">
                <span className="offre-investisseur-card__voir">
                  {offre._count.candidatures > 0
                    ? `Voir les ${offre._count.candidatures} candidat${offre._count.candidatures > 1 ? 's' : ''} →`
                    : 'Voir les candidatures →'}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
