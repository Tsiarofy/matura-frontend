import type { CandidatureAvecProjet } from '@/hooks/useInvestisseur';
import { StatutCandidature } from '@maturproj/shared';

const STATUT_LABELS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'En attente',
  [StatutCandidature.EN_REVUE]: 'En revue',
  [StatutCandidature.ACCEPTEE]: 'Acceptée',
  [StatutCandidature.REJETEE]: 'Rejetée',
  [StatutCandidature.RETIREE]: 'Retirée',
};

const STATUT_COLORS: Record<StatutCandidature, string> = {
  [StatutCandidature.EN_ATTENTE]: 'badge--yellow',
  [StatutCandidature.EN_REVUE]: 'badge--blue',
  [StatutCandidature.ACCEPTEE]: 'badge--green',
  [StatutCandidature.REJETEE]: 'badge--red',
  [StatutCandidature.RETIREE]: 'badge--gray',
};

const BRL_LABELS: Record<number, string> = {
  1: 'Idée initiale',
  2: 'Concept défini',
  3: 'Prototype conceptuel',
  4: 'Prototype fonctionnel',
  5: 'Pilote validé',
  6: 'Modèle économique validé',
  7: 'Premiers revenus',
  8: 'Croissance active',
  9: 'Maturité / Scale',
};

interface Props {
  candidature: CandidatureAvecProjet;
  detailOuvert: boolean;
  onToggleDetail: () => void;
  onChangerStatut: (statut: StatutCandidature) => void;
  isUpdating: boolean;
}

/**
 * Carte d'un projet candidat — vue investisseur.
 *
 * Structure :
 *  ┌─────────────────────────────────────────────────────────┐
 *  │ [Badge BRL] Nom du projet          [Statut candidature] │
 *  │ Entrepreneur · Secteur · Région                         │
 *  │ Description (tronquée)                                  │
 *  │ ─────────────────────────────────────────────────────── │
 *  │ [Infos universelles minimales]                          │
 *  │          [▼ Voir les détails du stade BRL X]            │
 *  │  ↳ Si ouvert : résumé détaillé par stade                │
 *  │ ─────────────────────────────────────────────────────── │
 *  │ Message de motivation (si présent)                      │
 *  │ [Mettre en revue] [Accepter] [Rejeter]                  │
 *  └─────────────────────────────────────────────────────────┘
 */
export function ProjetCandidatCard({
  candidature,
  detailOuvert,
  onToggleDetail,
  onChangerStatut,
  isUpdating,
}: Props) {
  const { projet, statut, createdAt, messageMotivation } = candidature;
  const brl = projet.brl;

  return (
    <div className={`projet-candidat-card projet-candidat-card--${statut.toLowerCase()}`}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="projet-candidat-card__header">
        <div className="projet-candidat-card__header-left">
          <div className="projet-candidat-card__brl">
            <span className="brl-badge">BRL {brl}</span>
            <span className="projet-candidat-card__brl-label">
              {BRL_LABELS[brl] ?? `Stade ${brl}`}
            </span>
          </div>
          <div>
            <h3 className="projet-candidat-card__nom">{projet.nom}</h3>
            <div className="projet-candidat-card__meta">
              {projet.entrepreneur && (
                <span>👤 {projet.entrepreneur.nom}</span>
              )}
              {projet.secteur && <span>🏭 {projet.secteur}</span>}
              {projet.region && <span>📍 {projet.region}</span>}
              {projet.equipe !== undefined && (
                <span>
                  👥 {projet.equipe} membre{projet.equipe > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="projet-candidat-card__header-right">
          <span className={`badge ${STATUT_COLORS[statut as StatutCandidature]}`}>
            {STATUT_LABELS[statut as StatutCandidature]}
          </span>
          {createdAt && (
            <span className="projet-candidat-card__date">
              {new Date(createdAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>

      {/* ── Description ────────────────────────────────────────────────────── */}
      {projet.description && (
        <p className="projet-candidat-card__description">{projet.description}</p>
      )}

      {/* ── Infos universelles minimales ────────────────────────────────────── */}
      <div className="projet-candidat-card__universal">
        <InfoUniverselle brl={brl} projet={projet} />
      </div>

      {/* ── Accordéon détail par stade ──────────────────────────────────────── */}
      <button
        className="projet-candidat-card__toggle"
        onClick={onToggleDetail}
        aria-expanded={detailOuvert}
      >
        {detailOuvert
          ? `▲ Réduire les détails`
          : `▼ Voir les détails — BRL ${brl} : ${BRL_LABELS[brl] ?? ''}`}
      </button>

      {detailOuvert && (
        <div className="projet-candidat-card__details">
          <StadeDetails projet={projet} brl={brl} />
        </div>
      )}

      {/* ── Message de motivation ───────────────────────────────────────────── */}
      {messageMotivation && (
        <div className="projet-candidat-card__motivation">
          <span className="projet-candidat-card__motivation-label">
            💬 Message de motivation
          </span>
          <p>{messageMotivation}</p>
        </div>
      )}

      {/* ── Actions investisseur ────────────────────────────────────────────── */}
      <div className="projet-candidat-card__actions">
        {statut === StatutCandidature.EN_ATTENTE && (
          <button
            className="btn btn--sm btn--secondary"
            disabled={isUpdating}
            onClick={() => onChangerStatut(StatutCandidature.EN_REVUE)}
          >
            🔍 Mettre en revue
          </button>
        )}

        {(statut === StatutCandidature.EN_ATTENTE ||
          statut === StatutCandidature.EN_REVUE) && (
          <>
            <button
              className="btn btn--sm btn--success"
              disabled={isUpdating}
              onClick={() => onChangerStatut(StatutCandidature.ACCEPTEE)}
            >
              ✓ Accepter
            </button>
            <button
              className="btn btn--sm btn--danger"
              disabled={isUpdating}
              onClick={() => onChangerStatut(StatutCandidature.REJETEE)}
            >
              ✕ Rejeter
            </button>
          </>
        )}

        {(statut === StatutCandidature.ACCEPTEE ||
          statut === StatutCandidature.REJETEE) && (
          <button
            className="btn btn--sm btn--ghost"
            disabled={isUpdating}
            onClick={() => onChangerStatut(StatutCandidature.EN_REVUE)}
          >
            ↩ Remettre en revue
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Infos universelles minimales (présentes à tout stade) ───────────────────

function InfoUniverselle({ brl, projet }: { brl: number; projet: any }) {
  return (
    <div className="infos-universelles">
      {projet.createdAt && (
        <MiniInfo
          icon="📅"
          label="Créé"
          value={new Date(projet.createdAt).toLocaleDateString('fr-FR')}
        />
      )}
      {projet.statut && (
        <MiniInfo icon="📌" label="Statut" value={projet.statut} />
      )}
    </div>
  );
}

// ─── Détails complets par stade (résumé essentiel investisseur) ───────────────

function StadeDetails({ projet, brl }: { projet: any; brl: number }) {
  if (brl <= 2) {
    return (
      <dl className="stade-details">
        <DetailItem label="Problème résolu" value={projet.problemeResolu} />
        <DetailItem label="Solution proposée" value={projet.solution} />
        <DetailItem label="Cible marché" value={projet.cibleMarche} />
        <DetailItem label="Taille marché estimée" value={projet.tailleMarche} />
        <DetailItem label="Avantage concurrentiel" value={projet.avantageConcurrentiel} />
      </dl>
    );
  }

  if (brl <= 4) {
    return (
      <dl className="stade-details">
        <DetailItem
          label="MVP disponible"
          value={
            projet.mvpDisponible !== undefined
              ? projet.mvpDisponible ? 'Oui' : 'Non'
              : undefined
          }
        />
        <DetailItem label="Résultats des tests" value={projet.testUtilisateurs} />
        <DetailItem label="Propriété intellectuelle" value={projet.proprietéIntellectuelle} />
        <DetailItem label="Partenariats" value={projet.partenariats} />
      </dl>
    );
  }

  if (brl <= 6) {
    return (
      <dl className="stade-details">
        <DetailItem
          label="Revenus mensuels"
          value={
            projet.revenusMensuels !== undefined
              ? `${projet.revenusMensuels.toLocaleString('fr')} MGA`
              : undefined
          }
        />
        <DetailItem
          label="Clients actifs"
          value={projet.nbClients !== undefined ? String(projet.nbClients) : undefined}
        />
        <DetailItem label="Modèle économique" value={projet.modeleEconomique} />
        <DetailItem label="Canaux de distribution" value={projet.canaux} />
        <DetailItem
          label="Montant recherché"
          value={
            projet.investissementRecherche !== undefined
              ? `${projet.investissementRecherche.toLocaleString('fr')} MGA`
              : undefined
          }
        />
        <DetailItem label="Utilisation des fonds" value={projet.utilisationFinancement} />
      </dl>
    );
  }

  // BRL 7–9
  return (
    <dl className="stade-details">
      <DetailItem
        label="CA annuel"
        value={
          projet.chiffreAffaires !== undefined
            ? `${projet.chiffreAffaires.toLocaleString('fr')} MGA`
            : undefined
        }
      />
      <DetailItem
        label="Taux de croissance"
        value={
          projet.tauxCroissance !== undefined ? `${projet.tauxCroissance}%` : undefined
        }
      />
      <DetailItem
        label="Montant recherché"
        value={
          projet.investissementRecherche !== undefined
            ? `${projet.investissementRecherche.toLocaleString('fr')} MGA`
            : undefined
        }
      />
      <DetailItem label="Stratégie d'expansion" value={projet.strategieExpansion} />
      <DetailItem label="Gouvernance" value={projet.gouvernance} />
      <DetailItem label="Objectif exit / impact" value={projet.objectifExit} />
    </dl>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function MiniInfo({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <span className="mini-info">
      {icon} <span className="mini-info__label">{label} :</span> {value}
    </span>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <>
      <dt className="detail-item__label">{label}</dt>
      <dd className="detail-item__value">{value}</dd>
    </>
  );
}
