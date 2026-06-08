import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useEvaluerStade } from "@/hooks/useStades";
import { authStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
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
      <div className="flex flex-col py-6 gap-5 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              estValide ? "bg-green-100" : "bg-red-100",
            )}
          >
            {estValide ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <RotateCcw className="w-6 h-6 text-red-500" />
            )}
          </div>
          <p className="text-[15px] text-zinc-800 font-medium">
            {estValide ? "Stade validé" : "Renvoyé en révision"}
          </p>
          {stade.score_auto !== null && (
            <p className="text-[13px] text-zinc-500">
              Note globale :{" "}
              <span
                className={cn(
                  "font-semibold",
                  estValide ? "text-green-700" : "text-red-600",
                )}
              >
                {stade.score_auto}/100
              </span>
            </p>
          )}
        </div>

        {derniereEvaluation && (
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
                Commentaire du mentor
              </p>
              <p className="text-[13px] text-zinc-700 whitespace-pre-wrap">
                {derniereEvaluation.commentaire}
              </p>
            </div>

            {!estValide && derniereEvaluation.motif_renvoi && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-red-400 font-medium mb-1.5">
                  Motif du renvoi
                </p>
                <p className="text-[13px] text-red-700 bg-red-50 p-3 rounded-lg border border-red-100 whitespace-pre-wrap">
                  {derniereEvaluation.motif_renvoi}
                </p>
              </div>
            )}

            {Object.keys(derniereEvaluation.criteres).length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-2">
                  Détail par critère
                </p>
                <div className="space-y-2">
                  {Object.entries(derniereEvaluation.criteres).map(
                    ([c, score]) => (
                      <div
                        key={c}
                        className="flex justify-between items-center bg-white border border-zinc-100 p-2.5 rounded-lg"
                      >
                        <span className="text-[12px] text-zinc-600 font-medium">
                          {CRITERE_LABELS[c] ?? c}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className="text-[12px] text-zinc-500 w-8 text-right">
                            {score}/100
                          </span>
                        </div>
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
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-[13px] text-zinc-700 font-medium">
            En attente d'évaluation
          </p>
          <p className="text-[12px] text-zinc-400 text-center max-w-xs">
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
      <div className="text-center py-8 text-[12px] text-zinc-400">
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

      <p className="text-[12px] text-zinc-500">
        Évaluez ce stade soumis par l'entrepreneur.
      </p>

      {/* Note globale */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block mb-2">
          Note globale :{" "}
          <span className="text-zinc-800 text-[14px]">{note}/100</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={note}
          onChange={(e) => setNote(Number(e.target.value))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
          <span>0 — Insuffisant</span>
          <span>40 — Seuil minimal</span>
          <span>100 — Excellent</span>
        </div>
        {note < 40 && (
          <p className="text-[11px] text-amber-600 mt-1">
            Note &lt; 40 → décision RENVOYE automatique
          </p>
        )}
      </div>

      {/* Critères par stade */}
      {criteres.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
            Critères détaillés
          </p>
          {criteres.map((c) => (
            <div key={c}>
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-zinc-700">
                  {CRITERE_LABELS[c] ?? c}
                </span>
                <span className="text-[12px] text-zinc-500">
                  {scoresCriteres[c] ?? 70}/100
                </span>
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
                className="w-full accent-green-600"
              />
            </div>
          ))}
        </div>
      )}

      {/* Commentaire */}
      <div>
        <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block mb-2">
          Commentaire (min. 50 caractères)
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={4}
          placeholder="Détaillez votre évaluation..."
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-green-400"
        />
        <p className="text-[10px] text-zinc-400 mt-0.5">
          {commentaire.length}/50 min
        </p>
      </div>

      {/* Décision */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-2">
          Décision
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDecision("VALIDE")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[13px] border transition-all",
              decision === "VALIDE"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-green-300",
            )}
          >
            ✓ Valider
          </button>
          <button
            onClick={() => setDecision("RENVOYE")}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[13px] border transition-all",
              decision === "RENVOYE"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-red-300",
            )}
          >
            ↩ Renvoyer
          </button>
        </div>
      </div>

      {/* Motif renvoi */}
      {(decision === "RENVOYE" || note < 40) && (
        <div>
          <label className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block mb-2">
            Motif du renvoi *
          </label>
          <textarea
            value={motifRenvoi}
            onChange={(e) => setMotifRenvoi(e.target.value)}
            rows={3}
            placeholder="Expliquez ce que l'entrepreneur doit corriger..."
            className="w-full border border-red-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-red-400"
          />
        </div>
      )}

      {/* Bouton soumettre */}
      <button
        onClick={handleSubmit}
        disabled={
          evaluerMutation.isPending ||
          commentaire.length < 50 ||
          (decision === "RENVOYE" && !motifRenvoi)
        }
        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors flex items-center justify-center gap-2"
      >
        {evaluerMutation.isPending && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        Enregistrer l'évaluation
      </button>
    </div>
  );
}
