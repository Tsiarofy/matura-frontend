import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Loader2, Plus, SkipForward, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreerMissions,
  useMissions,
  type FichierRequisItemDto,
  type MissionItemDto,
} from "@/hooks/useMissions";

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
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { data: missionsExistantes, isLoading } = useMissions(projetId, numStade);
  const creer = useCreerMissions(projetId, numStade);

  useEffect(() => {
    if (missionsExistantes && missionsExistantes.length > 0) {
      setMissions(
        missionsExistantes.map((m) => ({
          id: m.id,
          titre: m.titre,
          objectif: m.objectif,
          fichiers_requis: m.fichiers_requis.map((fr) => ({
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
    }
  }, [missionsExistantes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

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
    setMissions((current) => current.filter((_, idx) => idx !== index));
  };

  const ajouterMission = () => {
    setMissions((current) => [...current, missionVide()]);
  };

  const revenirAuStade = () =>
    navigate({
      to: "/projets/$projetId/stades/$numStade",
      params: { projetId, numStade: String(numStade) },
    });

  const handleSubmit = async () => {
    const datesInvalides = missions.some(
      (mission) => mission.date_limite && mission.date_limite < today,
    );
    if (datesInvalides) {
      toast.error("Date limite invalide", {
        description:
          "La date limite ne peut pas être dans le passé. Modifiez-la ou supprimez-la.",
      });
      return;
    }

    const payload = missions
      .filter((m) => m.titre.trim() && m.objectif.trim())
      .map((m, index) => ({
        ...m,
        ordre: index + 1,
        fichiers_requis: m.fichiers_requis
          .filter((fr) => fr.description.trim())
          .map((fr, j) => ({ ...fr, ordre: j })),
      }));

    await creer.mutateAsync({ missions: payload });
    revenirAuStade();
  };

  const handlePasser = async () => {
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
          <h1 className="text-[18px] text-zinc-900">
            Définir les missions — Stade {numStade}
          </h1>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            Pour chaque mission, précisez les fichiers exacts que l&apos;entrepreneur devra fournir.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {missions.map((mission, mIndex) => {
          const isValidee = missionsExistantes?.find((m) => m.id === mission.id)?.statut === 'VALIDEE'
          return (
            <div
              key={mIndex}
              className={`bg-white border rounded-xl p-5 space-y-5 ${isValidee ? 'border-green-200 bg-green-50/30' : 'border-zinc-200'}`}
            >
              {/* En-tête mission */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-zinc-600 flex items-center gap-1.5">
                  Mission #{mIndex + 1}
                  {isValidee && (
                    <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                      Validée
                    </span>
                  )}
                </span>
                {!isValidee && missions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => supprimerMission(mIndex)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Titre */}
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">
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
                <label className="text-[11px] text-zinc-500 block mb-1">
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
                <label className="text-[11px] text-zinc-500 block mb-1">
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-zinc-600 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Fichiers requis
                  </p>
                  {!isValidee && (
                    <button
                      type="button"
                      onClick={() => ajouterFichierRequis(mIndex)}
                      className="text-[11px] text-green-700 hover:text-green-800 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un fichier
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
                    className="flex gap-3 items-start bg-zinc-50 border border-zinc-100 rounded-lg p-3"
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
                        className="mt-0.5 text-zinc-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={ajouterMission}
        className="flex items-center gap-2 text-[12px] text-green-700 hover:text-green-800 font-medium"
      >
        <Plus className="w-4 h-4" />
        Ajouter une mission
      </button>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handlePasser}
          disabled={creer.isPending}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-[13px] hover:bg-zinc-50 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
          Passer cette étape
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            creer.isPending ||
            missions.every((m) => !m.titre.trim())
          }
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors"
        >
          {creer.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Enregistrer les missions
        </button>
      </div>
    </div>
  );
}
