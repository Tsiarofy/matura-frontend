import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Loader2, Plus, SkipForward, Target, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreerMissions,
  useMissions,
  type FichierRequisItemDto,
  type MissionItemDto,
} from "@/hooks/useMissions";
import { useStade } from "@/hooks/useStades";

interface DefinirMissionsFormProps {
  projetId: string;
  numStade: number;
}

const TYPE_FICHIER_OPTIONS = [
  { value: "PDF", label: "Document PDF", accept: ".pdf" },
  { value: "EXCEL", label: "Excel / CSV", accept: ".xlsx,.xls,.csv" },
  { value: "IMAGE", label: "Image (PNG, JPG…)", accept: "image/*" },
  { value: "VIDEO", label: "Vidéo (MP4…)", accept: "video/*" },
] as const;

const fichierRequisVide = (): FichierRequisItemDto => ({
  type: "PDF",
  description: "",
});

const missionVide = (): MissionItemDto => ({
  titre: "",
  objectif: "",
  fichiers_requis: [],
  date_limite: undefined,
});

export function DefinirMissionsForm({
  projetId,
  numStade,
}: DefinirMissionsFormProps) {
  const [missions, setMissions] = useState<MissionItemDto[]>([missionVide()]);
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set([0]));
  const [isInitialized, setIsInitialized] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { data: missionsExistantes, isLoading: loadingMissions } = useMissions(projetId, numStade);
  const { data: stade, isLoading: loadingStade } = useStade(projetId, numStade);
  const creer = useCreerMissions(projetId, numStade);

  const isStadeValide = stade?.statut === "VALIDE";

  useEffect(() => {
    if (missionsExistantes && !isInitialized) {
      if (missionsExistantes.length > 0) {
        setMissions(
          missionsExistantes.map((m) => ({
            id: m.id,
            titre: m.titre,
            objectif: m.objectif,
            fichiers_requis: m.fichiers_requis.map((fr) => ({
              id: fr.id,
              type: fr.type,
              description: fr.description,
              ordre: fr.ordre,
            })),
            date_limite: m.date_limite
              ? new Date(m.date_limite).toISOString().split("T")[0]
              : undefined,
            ordre: m.ordre,
          })),
        );
        // Par défaut, aucune des missions existantes n'est en cours d'édition
        setEditingIndices(new Set());
      } else {
        // S'il n'y a pas de missions, on commence en évitant la première mission vide
        setEditingIndices(new Set([0]));
      }
      setIsInitialized(true);
    }
  }, [missionsExistantes, isInitialized]);

  if (loadingMissions || loadingStade) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  /** Basculer l'état d'édition d'une mission */
  const basculerEdition = (index: number) => {
    if (isStadeValide) return;
    setEditingIndices((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  /** Valider la saisie locale d'une carte de mission */
  const validerEditionCarte = (index: number) => {
    const mission = missions[index];
    if (!mission.titre.trim() || !mission.objectif.trim()) {
      toast.error("Champs requis", {
        description: "Veuillez renseigner le titre et l'objectif avant de fermer la carte.",
      });
      return;
    }
    setEditingIndices((current) => {
      const next = new Set(current);
      next.delete(index);
      return next;
    });
  };

  /** Mettre à jour un champ d'une mission */
  const updateMission = (
    index: number,
    champ: keyof MissionItemDto,
    valeur: unknown,
  ) => {
    setMissions((current) => {
      const next = [...current];
      next[index] = { ...next[index], [champ]: valeur };
      return next;
    });
  };

  /** Ajouter un fichier requis à une mission */
  const ajouterFichierRequis = (missionIndex: number) => {
    setMissions((current) => {
      const next = [...current];
      next[missionIndex] = {
        ...next[missionIndex],
        fichiers_requis: [
          ...next[missionIndex].fichiers_requis,
          fichierRequisVide(),
        ],
      };
      return next;
    });
  };

  /** Mettre à jour un fichier requis */
  const updateFichierRequis = (
    missionIndex: number,
    frIndex: number,
    champ: keyof FichierRequisItemDto,
    valeur: unknown,
  ) => {
    setMissions((current) => {
      const next = [...current];
      const frs = [...next[missionIndex].fichiers_requis];
      frs[frIndex] = { ...frs[frIndex], [champ]: valeur };
      next[missionIndex] = { ...next[missionIndex], fichiers_requis: frs };
      return next;
    });
  };

  /** Supprimer un fichier requis */
  const supprimerFichierRequis = (missionIndex: number, frIndex: number) => {
    setMissions((current) => {
      const next = [...current];
      const frs = next[missionIndex].fichiers_requis.filter(
        (_, idx) => idx !== frIndex,
      );
      next[missionIndex] = { ...next[missionIndex], fichiers_requis: frs };
      return next;
    });
  };

  const supprimerMission = (index: number) => {
    if (isStadeValide) return;
    setMissions((current) => {
      const next = current.filter((_, idx) => idx !== index);
      setEditingIndices((prevEditing) => {
        const nextEditing = new Set<number>();
        prevEditing.forEach((idx) => {
          if (idx < index) nextEditing.add(idx);
          if (idx > index) nextEditing.add(idx - 1);
        });
        return nextEditing;
      });
      return next;
    });
  };

  const ajouterMission = () => {
    if (isStadeValide) return;
    setMissions((current) => {
      const next = [...current, missionVide()];
      setEditingIndices((prev) => {
        const nextEditing = new Set(prev);
        nextEditing.add(next.length - 1);
        return nextEditing;
      });
      return next;
    });
  };

  const revenirAuStade = () =>
    navigate({
      to: "/projets/$projetId/stades/$numStade",
      params: { projetId, numStade: String(numStade) },
    });

  const handleSubmit = async () => {
    try {
      if (isStadeValide) return;

      // Une mission est considérée comme complètement vide si tous ses champs principaux sont vides
      const isMissionCompletementVide = (m: MissionItemDto) => {
        return (
          !m.titre.trim() &&
          !m.objectif.trim() &&
          m.fichiers_requis.length === 0 &&
          !m.date_limite
        );
      };

      const activeMissions = missions.filter((m) => !isMissionCompletementVide(m));

      // Si la liste est vide mais qu'il y avait des missions à l'origine, cela signifie que
      // l'utilisateur a tout supprimé de façon intentionnelle. On l'autorise à enregistrer
      // une liste vide. Sinon, s'il a laissé des cartes vides sans les supprimer, on le prévient.
      if (activeMissions.length === 0 && missions.length > 0) {
        toast.error("Aucune mission valide", {
          description: "Veuillez renseigner le titre et l'objectif d'au moins une mission, ou supprimez les cartes vides.",
        });
        return;
      }

      // Validation des longueurs et de la présence des champs requis pour les missions actives
      for (let i = 0; i < activeMissions.length; i++) {
        const m = activeMissions[i];
        if (!m.titre.trim()) {
          toast.error(`Mission #${i + 1} invalide`, {
            description: "Le titre de la mission est requis.",
          });
          return;
        }
        if (m.titre.trim().length < 3) {
          toast.error(`Mission #${i + 1} invalide`, {
            description: "Le titre de la mission doit comporter au moins 3 caractères.",
          });
          return;
        }
        if (!m.objectif.trim()) {
          toast.error(`Mission #${i + 1} invalide`, {
            description: "L'objectif de la mission est requis.",
          });
          return;
        }
        if (m.objectif.trim().length < 5) {
          toast.error(`Mission #${i + 1} invalide`, {
            description: "L'objectif de la mission doit comporter au moins 5 caractères.",
          });
          return;
        }
        for (let j = 0; j < m.fichiers_requis.length; j++) {
          const fr = m.fichiers_requis[j];
          if (!fr.description.trim()) {
            toast.error(`Mission #${i + 1} — Fichier #${j + 1} invalide`, {
              description: "La description du fichier requis est requise.",
            });
            return;
          }
          if (fr.description.trim().length < 3) {
            toast.error(`Mission #${i + 1} — Fichier #${j + 1} invalide`, {
              description: "La description du fichier requis doit comporter au moins 3 caractères.",
            });
            return;
          }
        }
      }

      // Validation des dates intelligente
      const datesInvalides = activeMissions.some((mission) => {
        if (!mission.date_limite || mission.date_limite >= today) return false;
        const existante = missionsExistantes?.find((m) => m.id === mission.id);
        if (existante) {
          const oldDateStr = existante.date_limite
            ? new Date(existante.date_limite).toISOString().split("T")[0]
            : null;
          return mission.date_limite !== oldDateStr;
        }
        return true;
      });

      if (datesInvalides) {
        toast.error("Date limite invalide", {
          description:
            "La date limite ne peut pas être dans le passé. Modifiez-la ou supprimez-la.",
        });
        return;
      }

      const payload = activeMissions.map((m, index) => ({
        ...m,
        ordre: index + 1,
        date_limite: m.date_limite || undefined, // Évite d'envoyer une chaîne vide
        fichiers_requis: m.fichiers_requis
          .filter((fr) => fr.description.trim())
          .map((fr, j) => ({ ...fr, ordre: j })),
      }));

      await creer.mutateAsync({ missions: payload });
      revenirAuStade();
    } catch (err: any) {
      console.error("Erreur de validation/soumission:", err);
      toast.error("Erreur de soumission", {
        description: err.message || String(err),
      });
    }
  };

  const handlePasser = async () => {
    if (isStadeValide) return;
    await creer.mutateAsync({ missions: [] });
    revenirAuStade();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <h1 className="text-[18px] font-semibold text-zinc-900">
            Définir les missions — Stade {numStade}
          </h1>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            Pour chaque mission, précisez les fichiers exacts que l&apos;entrepreneur devra fournir.
          </p>
        </div>
      </div>

      {isStadeValide && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-[13px] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Stade Validé</p>
            <p className="text-green-700/90 mt-0.5">Ce stade a déjà été validé par l'évaluation du mentor. Les missions sont désormais en lecture seule.</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {missions.map((mission, mIndex) => {
          const isEditing = editingIndices.has(mIndex);
          const isValidee = missionsExistantes?.find((m) => m.id === mission.id)?.statut === 'VALIDEE';

          if (!isEditing) {
            // Vue Lecture Seule / Aperçu (Premium Card)
            return (
              <div
                key={mIndex}
                className={`bg-white border rounded-xl p-5 space-y-4 shadow-sm transition-all hover:shadow-md ${
                  isValidee
                    ? 'border-green-200 bg-green-50/10'
                    : 'border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-zinc-500 flex items-center gap-1.5">
                    Mission #{mIndex + 1}
                    {isValidee && (
                      <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-semibold">
                        Validée
                      </span>
                    )}
                  </span>
                  {!isStadeValide && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => basculerEdition(mIndex)}
                        className="text-[12px] text-zinc-600 hover:text-zinc-900 border border-zinc-200 px-3 py-1 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-1 font-medium"
                      >
                        <Edit2 className="w-3 h-3 text-zinc-400" />
                        Modifier
                      </button>
                      {!isValidee && (
                        <button
                          type="button"
                          onClick={() => supprimerMission(mIndex)}
                          className="text-[12px] text-red-500 hover:text-red-700 border border-red-100 px-3 py-1 rounded-lg hover:bg-red-50/50 transition-colors flex items-center gap-1 font-medium"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          Supprimer
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-[14px] font-semibold text-zinc-800">
                    {mission.titre || <span className="text-zinc-400 italic">Sans titre</span>}
                  </h3>
                  <p className="text-[12px] text-zinc-600 leading-relaxed">
                    {mission.objectif || <span className="text-zinc-400 italic">Aucun objectif défini</span>}
                  </p>
                </div>

                {mission.date_limite && (
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                    Date limite : <span className="font-semibold text-zinc-700">{new Date(mission.date_limite).toLocaleDateString('fr-FR')}</span>
                  </p>
                )}

                <div className="border-t border-zinc-100 pt-3">
                  <p className="text-[11px] font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    Fichiers requis ({mission.fichiers_requis.length})
                  </p>
                  {mission.fichiers_requis.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 italic">Aucun fichier requis — uniquement un commentaire.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {mission.fichiers_requis.map((fr, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 bg-zinc-50 border border-zinc-150 px-2.5 py-1 rounded-lg font-medium"
                        >
                          <span className="text-green-700 font-bold">{fr.type}</span>
                          <span className="text-zinc-300">|</span>
                          <span>{fr.description}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Mode Édition
          return (
            <div
              key={mIndex}
              className={`bg-white border rounded-xl p-5 space-y-5 shadow-sm transition-all border-green-300 ring-2 ring-green-600/5`}
            >
              {/* En-tête mission */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <span className="text-[12px] font-semibold text-green-700 flex items-center gap-1.5">
                  Édition Mission #{mIndex + 1}
                  {isValidee && (
                    <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                      Validée
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => validerEditionCarte(mIndex)}
                    className="text-[11px] text-green-700 hover:text-green-800 border border-green-200 px-2.5 py-1.5 rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors font-semibold"
                  >
                    Valider la carte
                  </button>
                  {!isValidee && missions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerMission(mIndex)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">
                  Titre de la mission *
                </label>
                <textarea
                  rows={2}
                  value={mission.titre}
                  onChange={(e) => updateMission(mIndex, "titre", e.target.value)}
                  placeholder="Ex : Réaliser une enquête terrain pour l'étude de marché"
                  disabled={isValidee}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-green-400 disabled:opacity-60 disabled:bg-zinc-50"
                />
              </div>

              {/* Objectif */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">
                  Objectif général *
                </label>
                <textarea
                  rows={2}
                  value={mission.objectif}
                  onChange={(e) => updateMission(mIndex, "objectif", e.target.value)}
                  placeholder="Décrivez ce que l'entrepreneur doit atteindre ou démontrer."
                  disabled={isValidee}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-green-400 disabled:opacity-60 disabled:bg-zinc-50"
                />
              </div>

              {/* Date limite */}
              <div className="w-56">
                <label className="text-[11px] font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">
                  Date limite (optionnel)
                </label>
                <input
                  type="date"
                  value={mission.date_limite ?? ""}
                  min={today}
                  disabled={isValidee}
                  onChange={(e) =>
                    updateMission(mIndex, "date_limite", e.target.value || undefined)
                  }
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 disabled:opacity-60 disabled:bg-zinc-50"
                />
              </div>

              {/* Fichiers requis */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-zinc-600 flex items-center gap-1.5 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    Fichiers requis
                  </p>
                  {!isValidee && (
                    <button
                      type="button"
                      onClick={() => ajouterFichierRequis(mIndex)}
                      className="text-[11px] text-green-700 hover:text-green-800 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un fichier requis
                    </button>
                  )}
                </div>

                {mission.fichiers_requis.length === 0 && (
                  <p className="text-[11px] text-zinc-400 italic">
                    Aucun fichier requis — l&apos;entrepreneur soumettra uniquement un commentaire.
                  </p>
                )}

                {mission.fichiers_requis.map((fr, frIndex) => (
                  <div
                    key={frIndex}
                    className="flex gap-3 items-start bg-zinc-50 border border-zinc-150 rounded-lg p-3 shadow-inner"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2">
                      <select
                        value={fr.type}
                        disabled={isValidee}
                        onChange={(e) =>
                          updateFichierRequis(mIndex, frIndex, "type", e.target.value)
                        }
                        className="border border-zinc-200 rounded-md px-2 py-1.5 text-[12px] text-zinc-800 bg-white focus:outline-none focus:border-green-400 disabled:opacity-60"
                      >
                        {TYPE_FICHIER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={fr.description}
                        disabled={isValidee}
                        onChange={(e) =>
                          updateFichierRequis(mIndex, frIndex, "description", e.target.value)
                        }
                        placeholder="Ex : Excel listant les KPIs du trimestre"
                        className="border border-zinc-200 rounded-md px-2 py-1.5 text-[12px] text-zinc-800 focus:outline-none focus:border-green-400 disabled:opacity-60 disabled:bg-zinc-50"
                      />
                    </div>

                    {!isValidee && (
                      <button
                        type="button"
                        onClick={() => supprimerFichierRequis(mIndex, frIndex)}
                        className="mt-1 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!isStadeValide && (
        <button
          type="button"
          onClick={ajouterMission}
          className="flex items-center gap-2 text-[13px] text-green-700 hover:text-green-800 font-semibold bg-green-50/50 hover:bg-green-50 px-4 py-2 border border-dashed border-green-300 rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter une mission
        </button>
      )}

      {!isStadeValide && (
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={handlePasser}
            disabled={creer.isPending}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-[13px] hover:bg-zinc-50 transition-colors font-medium"
          >
            <SkipForward className="w-4 h-4" />
            Passer cette étape
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={creer.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-[13px] font-semibold transition-all shadow-sm"
          >
            {creer.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer les missions
          </button>
        </div>
      )}
    </div>
  );
}
