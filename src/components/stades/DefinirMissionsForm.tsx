import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, SkipForward, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreerMissions,
  useMissions,
  type MissionItemDto,
} from "@/hooks/useMissions";

interface DefinirMissionsFormProps {
  projetId: string;
  numStade: number;
}

const TYPE_PREUVE_OPTIONS = [
  { value: "AUCUN", label: "Aucune preuve" },
  { value: "PDF", label: "Document PDF" },
  { value: "EXCEL", label: "Fichier Excel / CSV" },
  { value: "IMAGE", label: "Image (PNG, JPG...)" },
  { value: "VIDEO", label: "Video (MP4...)" },
] as const;

const missionVide = (): MissionItemDto => ({
  titre: "",
  objectif: "",
  type_preuve_attendue: "AUCUN",
  preuve_obligatoire: false,
  date_limite: undefined,
});

export function DefinirMissionsForm({
  projetId,
  numStade,
}: DefinirMissionsFormProps) {
  const [missions, setMissions] = useState<MissionItemDto[]>([missionVide()]);
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { data: missionsExistantes, isLoading } = useMissions(
    projetId,
    numStade,
  );
  const creer = useCreerMissions(projetId, numStade);

  useEffect(() => {
    if (missionsExistantes && missionsExistantes.length > 0) {
      setMissions(
        missionsExistantes.map((m) => ({
          titre: m.titre,
          objectif: m.objectif,
          type_preuve_attendue: m.type_preuve_attendue as any,
          preuve_obligatoire: m.preuve_obligatoire,
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

  const update = (
    index: number,
    champ: keyof MissionItemDto,
    valeur: unknown,
  ) => {
    setMissions((current) => {
      const next = [...current];
      const mission = { ...next[index], [champ]: valeur };
      if (champ === "type_preuve_attendue" && valeur === "AUCUN") {
        mission.preuve_obligatoire = false;
      }
      next[index] = mission;
      return next;
    });
  };

  const supprimer = (index: number) => {
    setMissions((current) => current.filter((_, idx) => idx !== index));
  };

  const ajouter = () => {
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
      .filter((mission) => mission.titre.trim() && mission.objectif.trim())
      .map((mission, index) => ({
        ...mission,
        ordre: index + 1,
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
            Definir les missions - Stade {numStade}
          </h1>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            Ces missions guident l&apos;entrepreneur avant qu&apos;il puisse
            remplir la saisie.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {missions.map((mission, index) => (
          <div
            key={index}
            className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-zinc-600">
                Mission #{index + 1}
              </span>
              {missions.length > 1 && (
                <button
                  type="button"
                  onClick={() => supprimer(index)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">
                Titre de la mission *
              </label>
              <textarea
                rows={2}
                value={mission.titre}
                onChange={(e) => update(index, "titre", e.target.value)}
                placeholder="Ex : Faire une enquete terrain pour l'etude de marche"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-green-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">
                Objectif *
              </label>
              <textarea
                rows={2}
                value={mission.objectif}
                onChange={(e) => update(index, "objectif", e.target.value)}
                placeholder="Ex : Remettre un livrable clair avec la preuve demandee"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-green-400"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">
                  Type de preuve attendue
                </label>
                <select
                  value={mission.type_preuve_attendue}
                  onChange={(e) =>
                    update(index, "type_preuve_attendue", e.target.value)
                  }
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white"
                >
                  {TYPE_PREUVE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">
                  Date limite (optionnel)
                </label>
                <input
                  type="date"
                  value={mission.date_limite ?? ""}
                  min={today}
                  onChange={(e) =>
                    update(index, "date_limite", e.target.value || undefined)
                  }
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            {mission.type_preuve_attendue !== "AUCUN" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mission.preuve_obligatoire}
                  onChange={(e) =>
                    update(index, "preuve_obligatoire", e.target.checked)
                  }
                  className="rounded accent-green-600"
                />
                <span className="text-[12px] text-zinc-700">
                  Preuve obligatoire pour soumettre
                </span>
              </label>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={ajouter}
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
          Passer cette etape
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            creer.isPending ||
            missions.every((mission) => !mission.titre.trim())
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
