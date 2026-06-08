import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useCandidaturesOffre, useChangerStatutCandidature } from '@/hooks/useInvestisseur';
import { useFinancementDetail } from '@/hooks/useFinancements';
import { StatutCandidature } from '@maturproj/shared';
import type { CandidatureAvecProjet } from '@/hooks/useInvestisseur';
import { ProjetCandidatCard } from '@/components/financement/ProjetCandidatCard';

const STATUTS_FILTRE: { value: StatutCandidature | 'TOUS'; label: string }[] = [
  { value: 'TOUS', label: 'Tous' },
  { value: StatutCandidature.EN_ATTENTE, label: 'En attente' },
  { value: StatutCandidature.EN_REVUE, label: 'En revue' },
  { value: StatutCandidature.ACCEPTEE, label: 'Acceptées' },
  { value: StatutCandidature.REJETEE, label: 'Rejetées' },
];

export default function CandidaturesOffrePage() {
  const { offreId } = useParams({
    from: '/mes-financements/$offreId/candidatures',
  });
  const navigate = useNavigate();
  const [filtreStatut, setFiltreStatut] = useState<StatutCandidature | 'TOUS'>('TOUS');
  const [projetDetailOuvert, setProjetDetailOuvert] = useState<string | null>(null);

  const { data: offre } = useFinancementDetail(offreId);
  const { data: candidatures, isLoading, isError } = useCandidaturesOffre(offreId);
  const changerStatut = useChangerStatutCandidature();

  const candidaturesFiltrees = (candidatures ?? []).filter(
    (c) => filtreStatut === 'TOUS' || c.statut === filtreStatut,
  );

  const handleChangerStatut = (
    candidature: CandidatureAvecProjet,
    statut: StatutCandidature,
  ) => {
    changerStatut.mutate({ candidatureId: candidature.id, statut, offreId });
  };

  return (
    <div className="candidatures-offre-page">
      {/* Fil d'Ariane */}
      <button
        className="back-link"
        onClick={() => navigate({ to: '/mes-financements' })}
      >
        ← Retour à mes financements
      </button>

      {/* En-tête */}
      <div className="page-header">
        <div className="page-header__text">
          <h1>Projets candidats</h1>
          {offre && (
            <p className="candidatures-offre-page__offre-titre">
              Offre : <strong>{offre.titre}</strong>
              {offre.stadeCible && (
                <span className="brl-badge brl-badge--sm" style={{ marginLeft: 8 }}>
                  BRL ≥ {offre.stadeCible}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Stats rapides */}
        {candidatures && candidatures.length > 0 && (
          <div className="candidatures-stats">
            <StatItem
              count={
                candidatures.filter((c) => c.statut === StatutCandidature.EN_ATTENTE).length
              }
              label="En attente"
              color="yellow"
            />
            <StatItem
              count={
                candidatures.filter((c) => c.statut === StatutCandidature.EN_REVUE).length
              }
              label="En revue"
              color="blue"
            />
            <StatItem
              count={
                candidatures.filter((c) => c.statut === StatutCandidature.ACCEPTEE).length
              }
              label="Acceptées"
              color="green"
            />
          </div>
        )}
      </div>

      {/* Filtres statut */}
      {candidatures && candidatures.length > 0 && (
        <div className="candidatures-filtres">
          {STATUTS_FILTRE.map(({ value, label }) => {
            const count =
              value === 'TOUS'
                ? candidatures.length
                : candidatures.filter((c) => c.statut === value).length;
            return (
              <button
                key={value}
                className={`chip ${filtreStatut === value ? 'chip--active' : ''}`}
                onClick={() => setFiltreStatut(value)}
              >
                {label}
                {count > 0 && <span className="chip__count">{count}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Contenu */}
      {isLoading ? (
        <div className="state-loading">
          <div className="spinner" />
          <p>Chargement des candidatures…</p>
        </div>
      ) : isError ? (
        <div className="state-error">
          <span>⚠️</span>
          <p>Impossible de charger les candidatures.</p>
        </div>
      ) : !candidatures || candidatures.length === 0 ? (
        <div className="state-empty">
          <span>📭</span>
          <h3>Aucune candidature reçue</h3>
          <p>Personne n'a encore postulé à cette offre.</p>
        </div>
      ) : candidaturesFiltrees.length === 0 ? (
        <div className="state-empty">
          <span>🔍</span>
          <p>Aucune candidature avec ce statut.</p>
          <button className="btn btn--ghost" onClick={() => setFiltreStatut('TOUS')}>
            Voir toutes
          </button>
        </div>
      ) : (
        <div className="candidatures-liste">
          {candidaturesFiltrees.map((candidature) => (
            <ProjetCandidatCard
              key={candidature.id}
              candidature={candidature}
              detailOuvert={projetDetailOuvert === candidature.id}
              onToggleDetail={() =>
                setProjetDetailOuvert((prev) =>
                  prev === candidature.id ? null : candidature.id,
                )
              }
              onChangerStatut={(statut) => handleChangerStatut(candidature, statut)}
              isUpdating={changerStatut.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatItem({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: 'yellow' | 'blue' | 'green';
}) {
  if (count === 0) return null;
  return (
    <div className={`stat-item stat-item--${color}`}>
      <span className="stat-item__count">{count}</span>
      <span className="stat-item__label">{label}</span>
    </div>
  );
}
