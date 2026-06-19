import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useEvaluerStade } from "@/hooks/useStades";
import { authStore } from "@/stores/authStore";
import { cn, getScoreStyle, formatDecimal } from "@/lib/utils";
import { Star, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import type { StadeData } from "@/hooks/useStades";
import { useEvaluationsProjet } from "@/hooks/useStades";
import { AffichageCalculsInformatifs } from "./AffichageCalculsInformatifs";
import { toast } from "sonner";

const CRITERES_PAR_STADE: Record<number, string[]> = {
  1: ["clarte_probleme", "validation_terrain", "realisme_contexte"],
  2: ["coherence_canvas", "viabilite_modele", "differentiation"],
  3: ["rigueur_enquete", "connaissance_marche", "analyse_concurrence"],
  4: ["evolution_depuis_lean", "solidite_modele", "realisme_financier"],
  5: ["competences_equipe", "viabilite_financiere", "plan_action"],
  6: ["qualite_mvp", "volume_feedback", "apprentissage_iterations"],
  7: ["completude_dossier", "realisme_demande", "potentiel_impact"],
};

const CRITERE_LABELS: Record<string, string> = {
  clarte_probleme: "Clarté du problème",
  validation_terrain: "Validation terrain",
  realisme_contexte: "Réalisme contextuel",
  coherence_canvas: "Cohérence du canvas",
  viabilite_modele: "Viabilité du modèle",
  differentiation: "Différenciation",
  rigueur_enquete: "Rigueur de l'enquête",
  connaissance_marche: "Connaissance marché",
  analyse_concurrence: "Analyse concurrence",
  evolution_depuis_lean: "Évolution depuis Lean Canvas",
  solidite_modele: "Solidité du modèle",
  realisme_financier: "Réalisme financier",
  competences_equipe: "Compétences équipe",
  viabilite_financiere: "Viabilité financière",
  plan_action: "Plan d'action",
  qualite_mvp: "Qualité du MVP",
  volume_feedback: "Volume de feedback",
  apprentissage_iterations: "Apprentissages/itérations",
  completude_dossier: "Complétude du dossier",
  realisme_demande: "Réalisme de la demande",
  potentiel_impact: "Potentiel d'impact",
};

interface EvaluationStadeProps {
  stade: StadeData;
  projetId: string;
  numStade: number;
}

export function EvaluationStade({
  stade,
  projetId,
  numStade,
}: EvaluationStadeProps) {
  const user = authStore((state) => state.utilisateur);
  const isMentor = user?.role === "MENTOR";
  const evaluerMutation = useEvaluerStade(projetId, numStade);
  const { data: evaluations } = useEvaluationsProjet(projetId);
  const navigate = useNavigate();

  const derniereEvaluation = evaluations?.find((e) => e.stade_id === stade.id);

  const criteres = CRITERES_PAR_STADE[numStade] ?? [];

  // State formulaire mentor
  const [note, setNote] = useState(70);
  const [commentaire, setCommentaire] = useState("");
  const [decision, setDecision] = useState<"VALIDE" | "RENVOYE">("VALIDE");
  const [motifRenvoi, setMotifRenvoi] = useState("");
  const [scoresCriteres, setScoresCriteres] = useState<Record<string, number>>(
    Object.fromEntries(criteres.map((c) => [c, 70])),
  );

  //── Affichage de l'évaluation (pour Entrepreneur ET Mentor) ───────────────────
  if (stade.statut === "VALIDE" || stade.statut === "EN_REVISION") {
    const estValide = stade.statut === "VALIDE";
    return (
      <div className="flex flex-col py-4 gap-5">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div
            className={cn(
              "w-12 h-12 rounded-[16px] border flex items-center justify-center",
              estValide
                ? "bg-[var(--color-success-bg)] border-[var(--color-success-border)]"
                : "bg-[var(--color-error-bg)] border-[var(--color-error-border)]",
            )}
          >
            {estValide ? (
              <CheckCircle2 className="w-6 h-6 text-[var(--color-success)]" />
            ) : (
              <RotateCcw className="w-6 h-6 text-[var(--color-error)]" />
            )}
          </div>
          <p className={cn(
            "text-[15px] font-semibold",
            estValide ? "text-[var(--color-success-text)]" : "text-[var(--color-error)]"
          )}>
            {estValide ? "Stade validé" : "Renvoyé en révision"}
          </p>
          {stade.score_auto !== null && (() => {
            const scoreStyle = getScoreStyle(stade.score_auto);
            return (
              <p className="text-[13px] text-[var(--color-text-muted)]">
                Note globale :{" "}
                <span className={cn("font-semibold px-2 py-0.5 rounded border", scoreStyle.text, scoreStyle.bg, scoreStyle.border)}>
                  {formatDecimal(stade.score_auto)}/100
                </span>
              </p>
            );
          })()}
        </div>

        {derniereEvaluation && (
          <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-soft)]/50 p-5 space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-disabled)] mb-2">
                Commentaire du mentor
              </p>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                {derniereEvaluation.commentaire}
              </p>
            </div>

            {!estValide && derniereEvaluation.motif_renvoi && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-error)] mb-2">
                  Motif du renvoi
                </p>
                <p className="text-[13px] text-[var(--color-error)] bg-[var(--color-error-bg)] p-3.5 rounded-[14px] border border-[var(--color-error-border)] whitespace-pre-wrap leading-relaxed">
                  {derniereEvaluation.motif_renvoi}
                </p>
              </div>
            )}

            {Object.keys(derniereEvaluation.criteres).length > 0 && (
              <div className="pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-disabled)] mb-3">
                  Détail par critère
                </p>
                <div className="space-y-2">
                  {Object.entries(derniereEvaluation.criteres).map(
                    ([c, score]) => (
                      <div
                        key={c}
                        className="flex justify-between items-center bg-white border border-[var(--color-border)] p-3 rounded-[12px]"
                      >
                        <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                          {CRITERE_LABELS[c] ?? c}
                        </span>
                          {(() => {
                            const scStyle = getScoreStyle(score as number);
                            return (
                              <>
                                <div className="w-20 h-1.5 bg-[var(--color-surface-soft)] rounded-full overflow-hidden">
                                  <div
                                    className={cn('h-full rounded-full transition-all', scStyle.accent)}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-full border', scStyle.text, scStyle.bg, scStyle.border)}>
                                  {formatDecimal(score as number)}/100
                                </span>
                              </>
                            );
                          })()}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  //── Vue entrepreneur (En attente) ──────────────────────────────────────────────
  if (!isMentor) {
    if (stade.statut === "SOUMIS") {
      return (
        <div className="flex flex-col items-center py-10 gap-3">
          <div className="w-12 h-12 rounded-[16px] border border-[#FDE68A] bg-[var(--color-tsisy-amber-bg)] flex items-center justify-center">
            <Star className="w-6 h-6 text-[var(--color-tsisy-amber)]" />
          </div>
          <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            En attente d'évaluation
          </p>
          <p className="text-[12px] text-[var(--color-text-muted)] text-center max-w-xs leading-relaxed">
            Votre mentor est en train d'évaluer ce stade. Vous serez notifié du
            résultat.
          </p>
        </div>
      );
    }
    return null;
  }

  // ── Formulaire mentor ─────────────────────────────────────────────────────────
  if (stade.statut !== "SOUMIS") {
    return (
      <div className="text-center py-8 text-[12px] text-[var(--color-text-muted)]">
        Ce stade n'est pas encore soumis.
      </div>
    );
  }
  const handleSubmit = () => {
    evaluerMutation.mutate(
      {
        note,
        commentaire,
        criteres: scoresCriteres,
        decision,
        motif_renvoi: decision === "RENVOYE" ? motifRenvoi : undefined,
      },
      {
        onSuccess: (result) => {
          if (!result.redirection_missions) return;

          const { projetId: nextProjetId, numStade: nextNumStade } =
            result.redirection_missions;
          toast.info(`Definissez les missions du Stade ${nextNumStade}`, {
            description:
              "Le stade suivant est debloque. Guidez l'entrepreneur avec des missions.",
          });
          navigate({
            to: "/projets/$projetId/stades/$numStade/definir-missions",
            params: { projetId: nextProjetId, numStade: String(nextNumStade) },
          });
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <AffichageCalculsInformatifs
        numStade={numStade}
        calculs={stade.calculs_informatifs}
        role={user?.role as "MENTOR" | "INVESTISSEUR" | "ENTREPRENEUR"}
      />

      <p className="text-[12px] text-[var(--color-text-muted)]">
        Évaluez ce stade soumis par l'entrepreneur.
      </p>

      {/* Note globale */}
      <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flat-label mb-0">
            Note globale
          </label>
          {(() => {
            const scStyle = getScoreStyle(note);
            return (
              <span className={cn('text-[14px] font-bold px-3 py-1 rounded-full border', scStyle.text, scStyle.bg, scStyle.border)}>
                {formatDecimal(note)}/100
              </span>
            );
          })()}
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={note}
          onChange={(e) => setNote(Number(e.target.value))}
          className="w-full accent-[var(--color-success)]"
        />
        <div className="flex justify-between text-[10px] text-[var(--color-text-disabled)] font-medium">
          <span>0 — Insuffisant</span>
          <span>40 — Seuil minimal</span>
          <span>100 — Excellent</span>
        </div>
        {note < 40 && (
          <p className="text-[11px] font-medium text-[#a16207] bg-[var(--color-tsisy-amber-bg)] rounded-[10px] px-3 py-2 border border-[#FDE68A]">
            Note &lt; 40 → décision RENVOYE automatique
          </p>
        )}
      </div>

      {/* Critères par stade */}
      {criteres.length > 0 && (
        <div className="rounded-[18px] border border-[var(--color-border)] bg-white p-4 space-y-4">
          <p className="flat-label mb-0">Critères détaillés</p>
          {criteres.map((c) => (
            <div key={c} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">
                  {CRITERE_LABELS[c] ?? c}
                </span>
                {(() => {
                  const scStyle = getScoreStyle(scoresCriteres[c] ?? 70);
                  return (
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full border', scStyle.text, scStyle.bg, scStyle.border)}>
                      {formatDecimal(scoresCriteres[c] ?? 70)}/100
                    </span>
                  );
                })()}
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scoresCriteres[c] ?? 70}
                onChange={(e) =>
                  setScoresCriteres((prev) => ({
                    ...prev,
                    [c]: Number(e.target.value),
                  }))
                }
                className="w-full accent-[var(--color-success)]"
              />
            </div>
          ))}
        </div>
      )}

      {/* Commentaire */}
      <div>
        <label className="flat-label">
          Commentaire <span className="text-[var(--color-text-disabled)]">(min. 50 caractères)</span>
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={4}
          placeholder="Détaillez votre évaluation..."
          className="flat-input min-h-[100px] resize-none"
        />
        <p className={cn(
          'text-[10px] mt-0.5',
          commentaire.length >= 50 ? 'text-[var(--color-success-text)]' : 'text-[var(--color-text-muted)]'
        )}>
          {commentaire.length}/50 min
        </p>
      </div>

      {/* Décision */}
      <div>
        <p className="flat-label">Décision</p>
        <div className="flex gap-3">
          <button
            onClick={() => setDecision("VALIDE")}
            className={cn(
              "flex-1 py-2.5 rounded-[14px] text-[13px] font-semibold border transition-all",
              decision === "VALIDE"
                ? "bg-[var(--color-success)] text-white border-[var(--color-success)]"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-success-border)] hover:bg-[var(--color-success-bg)]",
            )}
          >
            ✓ Valider
          </button>
          <button
            onClick={() => setDecision("RENVOYE")}
            className={cn(
              "flex-1 py-2.5 rounded-[14px] text-[13px] font-semibold border transition-all",
              decision === "RENVOYE"
                ? "bg-[var(--color-error)] text-white border-[var(--color-error)]"
                : "bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-error-border)] hover:bg-[var(--color-error-bg)]",
            )}
          >
            ↩ Renvoyer
          </button>
        </div>
      </div>

      {/* Motif renvoi */}
      {(decision === "RENVOYE" || note < 40) && (
        <div>
          <label className="flat-label">
            Motif du renvoi *
          </label>
          <textarea
            value={motifRenvoi}
            onChange={(e) => setMotifRenvoi(e.target.value)}
            rows={3}
            placeholder="Expliquez ce que l'entrepreneur doit corriger..."
            className="flat-input min-h-[80px] resize-none border-[var(--color-error-border)] focus:ring-[color:rgba(239,91,120,0.10)]"
          />
        </div>
      )}

      {/* Bouton soumettre */}
      <button
        onClick={handleSubmit}
        disabled={
          evaluerMutation.isPending ||
          commentaire.length < 50 ||
          ((decision === "RENVOYE" || note < 40) && !motifRenvoi.trim())
        }
        className="w-full py-3 bg-[var(--color-success)] hover:brightness-95 disabled:opacity-50 text-white rounded-[14px] text-[13px] font-semibold transition-all flex items-center justify-center gap-2"
      >
        {evaluerMutation.isPending && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        Enregistrer l'évaluation
      </button>
    </div>
  );
}
