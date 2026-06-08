// components/stades/Stade5SetupCard.tsx
// Carte de configuration préalable au formulaire Stade 5.
// Collecte les informations nécessaires au calcul des métriques
// (disciplines requises, type de projet, horizon) AVANT l'édition du formulaire.

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Discipline =
  | 'TECH' | 'DESIGN' | 'VENTE' | 'FINANCE'
  | 'JURIDIQUE' | 'MARKETING' | 'OPERATIONS'
  | 'EXPERT_DOMAINE' | 'COMMUNICATION'

interface SetupData {
  disciplines_requises_projet: Discipline[]
  type_projet: 'PRODUIT' | 'SERVICE' | 'HYBRIDE'
  horizon_mois: 12 | 24 | 36
}

interface Stade5SetupCardProps {
  /** Données déjà sauvegardées (si le stade a été commencé) */
  initialSetup?: Partial<SetupData>
  /** Appelé quand l'utilisateur valide la carte — on passe au formulaire */
  onConfirm: (setup: SetupData) => void
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const DISCIPLINES: { key: Discipline; label: string; icon: string; desc: string }[] = [
  { key: 'TECH',          label: 'Tech',          icon: '⚙️', desc: 'Dev, infra, data' },
  { key: 'DESIGN',        label: 'Design',        icon: '✦',  desc: 'UX, produit, marque' },
  { key: 'VENTE',         label: 'Vente',         icon: '◈',  desc: 'Commercial, deals' },
  { key: 'FINANCE',       label: 'Finance',       icon: '◉',  desc: 'Compta, levée, budget' },
  { key: 'JURIDIQUE',     label: 'Juridique',     icon: '▣',  desc: 'Droit, conformité' },
  { key: 'MARKETING',     label: 'Marketing',     icon: '◆',  desc: 'Acquisition, contenu' },
  { key: 'OPERATIONS',    label: 'Opérations',    icon: '⬡',  desc: 'Process, logistique' },
  { key: 'EXPERT_DOMAINE',label: 'Expert métier', icon: '◎',  desc: 'Connaissance sectorielle' },
  { key: 'COMMUNICATION', label: 'Com\'',         icon: '◑',  desc: 'Relations, presse, RH' },
]

const TYPES_PROJET = [
  { key: 'PRODUIT'  as const, label: 'Produit',  desc: 'Bien physique ou logiciel' },
  { key: 'SERVICE'  as const, label: 'Service',  desc: 'Prestation, accompagnement' },
  { key: 'HYBRIDE'  as const, label: 'Hybride',  desc: 'Produit + service combinés' },
]

const HORIZONS: { val: 12 | 24 | 36; label: string }[] = [
  { val: 12, label: '1 an'  },
  { val: 24, label: '2 ans' },
  { val: 36, label: '3 ans' },
]

// ─── Composant ────────────────────────────────────────────────────────────────

export function Stade5SetupCard({ initialSetup, onConfirm }: Stade5SetupCardProps) {
  const [disciplines, setDisciplines] = useState<Discipline[]>(
    initialSetup?.disciplines_requises_projet ?? [],
  )
  const [typeProjet, setTypeProjet] = useState<SetupData['type_projet']>(
    initialSetup?.type_projet ?? 'PRODUIT',
  )
  const [horizon, setHorizon] = useState<SetupData['horizon_mois']>(
    initialSetup?.horizon_mois ?? 36,
  )
  const [error, setError] = useState<string | null>(null)

  const toggle = (d: Discipline) =>
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    )

  const handleConfirm = () => {
    if (disciplines.length < 2) {
      setError('Sélectionnez au moins 2 disciplines requises pour votre projet.')
      return
    }
    setError(null)
    onConfirm({ disciplines_requises_projet: disciplines, type_projet: typeProjet, horizon_mois: horizon })
  }

  const pct = Math.round((disciplines.length / DISCIPLINES.length) * 100)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        .s5-card {
          font-family: 'DM Mono', monospace;
          background: #0f0f0f;
          border: 1px solid #2a2a2a;
          border-radius: 4px;
          color: #e8e8e8;
          max-width: 680px;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        }

        .s5-header {
          padding: 32px 36px 24px;
          border-bottom: 1px solid #1e1e1e;
          position: relative;
        }

        .s5-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 14px;
        }

        .s5-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c8a96e;
          animation: pulse-dot 2.4s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .4; transform: scale(.7); }
        }

        .s5-title {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          font-weight: 400;
          color: #f0ece4;
          line-height: 1.2;
          margin: 0 0 8px;
        }

        .s5-title em {
          font-style: italic;
          color: #c8a96e;
        }

        .s5-subtitle {
          font-size: 12px;
          color: #555;
          line-height: 1.6;
          max-width: 480px;
        }

        /* Progress bar */
        .s5-progress {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .s5-progress-track {
          flex: 1;
          height: 2px;
          background: #1e1e1e;
          border-radius: 2px;
          overflow: hidden;
        }

        .s5-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #c8a96e, #e8c97e);
          border-radius: 2px;
          transition: width .3s ease;
        }

        .s5-progress-label {
          font-size: 11px;
          color: #444;
          min-width: 36px;
          text-align: right;
        }

        /* Body */
        .s5-body { padding: 28px 36px; }

        .s5-section { margin-bottom: 28px; }

        .s5-section-label {
          font-size: 10px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .s5-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1e1e1e;
        }

        /* Discipline grid */
        .s5-disciplines {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .s5-disc {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 12px;
          border: 1px solid #222;
          border-radius: 3px;
          cursor: pointer;
          transition: border-color .15s, background .15s;
          background: transparent;
          color: inherit;
          text-align: left;
        }

        .s5-disc:hover { border-color: #3a3a3a; background: #141414; }

        .s5-disc.active {
          border-color: #c8a96e;
          background: #1a1610;
        }

        .s5-disc-top {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #d0d0d0;
        }

        .s5-disc.active .s5-disc-top { color: #c8a96e; }

        .s5-disc-icon { font-size: 11px; }

        .s5-disc-desc {
          font-size: 10px;
          color: #3a3a3a;
          line-height: 1.3;
        }

        .s5-disc.active .s5-disc-desc { color: #6a5c3a; }

        /* Check mark */
        .s5-check {
          margin-left: auto;
          width: 14px; height: 14px;
          border: 1px solid #333;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: transparent;
          transition: all .15s;
          flex-shrink: 0;
        }

        .s5-disc.active .s5-check {
          border-color: #c8a96e;
          background: #c8a96e;
          color: #0f0f0f;
        }

        /* Type projet */
        .s5-types {
          display: flex;
          gap: 8px;
        }

        .s5-type {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #222;
          border-radius: 3px;
          cursor: pointer;
          background: transparent;
          color: inherit;
          text-align: left;
          transition: border-color .15s, background .15s;
        }

        .s5-type:hover { border-color: #3a3a3a; background: #141414; }

        .s5-type.active {
          border-color: #c8a96e;
          background: #1a1610;
        }

        .s5-type-label {
          font-size: 12px;
          color: #d0d0d0;
          margin-bottom: 2px;
        }

        .s5-type.active .s5-type-label { color: #c8a96e; }

        .s5-type-desc {
          font-size: 10px;
          color: #3a3a3a;
        }

        .s5-type.active .s5-type-desc { color: #6a5c3a; }

        /* Horizon */
        .s5-horizons {
          display: flex;
          gap: 8px;
        }

        .s5-horizon {
          flex: 1;
          padding: 10px;
          border: 1px solid #222;
          border-radius: 3px;
          cursor: pointer;
          background: transparent;
          color: #888;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          text-align: center;
          transition: border-color .15s, background .15s, color .15s;
        }

        .s5-horizon:hover { border-color: #3a3a3a; color: #ccc; }

        .s5-horizon.active {
          border-color: #c8a96e;
          background: #1a1610;
          color: #c8a96e;
        }

        /* Résumé sélection */
        .s5-summary {
          background: #141414;
          border: 1px solid #1e1e1e;
          border-radius: 3px;
          padding: 12px 14px;
          font-size: 11px;
          color: #555;
          min-height: 36px;
          line-height: 1.7;
        }

        .s5-summary-tag {
          display: inline-block;
          background: #1e1a12;
          border: 1px solid #3a2e1a;
          color: #c8a96e;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 2px;
          margin: 2px 3px 2px 0;
        }

        .s5-summary-empty { font-style: italic; }

        /* Error */
        .s5-error {
          font-size: 11px;
          color: #c45a5a;
          margin-top: -16px;
          margin-bottom: 20px;
          padding: 8px 12px;
          background: #1a0f0f;
          border: 1px solid #3a1a1a;
          border-radius: 3px;
        }

        /* Footer */
        .s5-footer {
          padding: 20px 36px 28px;
          border-top: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .s5-footer-hint {
          font-size: 11px;
          color: #333;
          max-width: 300px;
          line-height: 1.5;
        }

        .s5-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          background: #c8a96e;
          color: #0f0f0f;
          border: none;
          border-radius: 3px;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .05em;
          cursor: pointer;
          white-space: nowrap;
          transition: background .15s, transform .1s;
        }

        .s5-btn:hover { background: #d9bb82; }
        .s5-btn:active { transform: scale(.98); }
        .s5-btn:disabled {
          background: #2a2a2a;
          color: #444;
          cursor: not-allowed;
          transform: none;
        }

        .s5-btn-arrow { font-size: 14px; }

        @media (max-width: 540px) {
          .s5-disciplines { grid-template-columns: repeat(2, 1fr); }
          .s5-header, .s5-body, .s5-footer { padding-left: 20px; padding-right: 20px; }
          .s5-title { font-size: 22px; }
          .s5-footer { flex-direction: column; align-items: stretch; }
          .s5-btn { justify-content: center; }
        }
      `}</style>

      <div className="s5-card">
        {/* Header */}
        <div className="s5-header">
          <div className="s5-badge">
            <span className="s5-badge-dot" />
            Stade 5 — Faisabilité
          </div>
          <h2 className="s5-title">
            Avant de commencer,<br />
            définissez votre <em>projet idéal</em>
          </h2>
          <p className="s5-subtitle">
            Ces informations calibrent les métriques de faisabilité — score d'interdisciplinarité,
            point mort, ROI — pour votre contexte précis.
          </p>

          {/* Progress disciplines */}
          <div className="s5-progress">
            <div className="s5-progress-track">
              <div className="s5-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="s5-progress-label">
              {disciplines.length}/{DISCIPLINES.length}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="s5-body">

          {/* 1. Disciplines requises */}
          <div className="s5-section">
            <div className="s5-section-label">
              Disciplines requises pour ce projet
            </div>
            <div className="s5-disciplines">
              {DISCIPLINES.map((d) => {
                const active = disciplines.includes(d.key)
                return (
                  <button
                    key={d.key}
                    type="button"
                    className={`s5-disc${active ? ' active' : ''}`}
                    onClick={() => toggle(d.key)}
                  >
                    <div className="s5-disc-top">
                      <span className="s5-disc-icon">{d.icon}</span>
                      {d.label}
                      <span className="s5-check">{active ? '✓' : ''}</span>
                    </div>
                    <div className="s5-disc-desc">{d.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Résumé sélection */}
          <div className="s5-section" style={{ marginTop: -12 }}>
            <div className="s5-summary">
              {disciplines.length === 0
                ? <span className="s5-summary-empty">Aucune discipline sélectionnée</span>
                : disciplines.map((d) => (
                  <span key={d} className="s5-summary-tag">
                    {DISCIPLINES.find((x) => x.key === d)?.label}
                  </span>
                ))
              }
            </div>
          </div>

          {/* Error */}
          {error && <div className="s5-error">{error}</div>}

          {/* 2. Type de projet */}
          <div className="s5-section">
            <div className="s5-section-label">Type de projet</div>
            <div className="s5-types">
              {TYPES_PROJET.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className={`s5-type${typeProjet === t.key ? ' active' : ''}`}
                  onClick={() => setTypeProjet(t.key)}
                >
                  <div className="s5-type-label">{t.label}</div>
                  <div className="s5-type-desc">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Horizon prévisionnel */}
          <div className="s5-section" style={{ marginBottom: 0 }}>
            <div className="s5-section-label">Horizon prévisionnel</div>
            <div className="s5-horizons">
              {HORIZONS.map((h) => (
                <button
                  key={h.val}
                  type="button"
                  className={`s5-horizon${horizon === h.val ? ' active' : ''}`}
                  onClick={() => setHorizon(h.val)}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="s5-footer">
          <p className="s5-footer-hint">
            Ces choix seront enregistrés avec votre dossier.
            Vous pourrez les modifier depuis les paramètres du stade.
          </p>
          <button
            type="button"
            className="s5-btn"
            onClick={handleConfirm}
            disabled={disciplines.length === 0}
          >
            Continuer vers le formulaire
            <span className="s5-btn-arrow">→</span>
          </button>
        </div>
      </div>
    </>
  )
}
