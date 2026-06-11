import { useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { MissionStade } from "@matura/shared";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Settings,
  Target,
  Upload,
  XCircle,
} from "lucide-react";
import { FichierMiniViewer } from "@/components/shared/FichierMiniViewer";
import {
  useEvaluerMission,
  useMissions,
  useSoumettreReponseMission,
} from "@/hooks/useMissions";
import { cn } from "@/lib/utils";

function BadgeStatutMission({ statut }: { statut: string }) {
  const config: Record<
    string,
    { label: string; classes: string; icon: ReactNode }
  > = {
    INACHEVEE: {
      label: "Inachevee",
      classes: "bg-zinc-100 text-zinc-600",
      icon: <Clock className="w-3 h-3" />,
    },
    SOUMISE: {
      label: "Soumise",
      classes: "bg-blue-50 text-blue-700 border border-blue-200",
      icon: <Clock className="w-3 h-3" />,
    },
    VALIDEE: {
      label: "Validee",
      classes: "bg-green-50 text-green-700 border border-green-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    REJETEE: {
      label: "Rejetee",
      classes: "bg-red-50 text-red-700 border border-red-200",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  const current = config[statut] ?? config.INACHEVEE;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
        current.classes,
      )}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

function LigneMissionEntrepreneur({
  mission,
  projetId,
  numStade,
}: {
  mission: MissionStade;
  projetId: string;
  numStade: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fichierSelectionne, setFichierSelectionne] = useState<File | null>(
    null,
  );
  const [commentaire, setCommentaire] = useState(mission.soumission?.commentaire ?? "");
  const soumettre = useSoumettreReponseMission(projetId, numStade, mission.id);

  const peutSoumettre =
    mission.statut === "INACHEVEE" || mission.statut === "REJETEE" || mission.statut === "SOUMISE";
  const necessiteFichier = mission.type_preuve_attendue !== "AUCUN";
  const fichierRequis = necessiteFichier && mission.preuve_obligatoire === true;
  const labelAction = !necessiteFichier
    ? "Marquer comme terminée"
    : fichierSelectionne
      ? "Soumettre la preuve"
      : fichierRequis
        ? "Soumettre la preuve"
        : "Marquer comme terminée";

  const handleSoumettre = () => {
    const formData = new FormData();
    if (fichierSelectionne) {
      formData.append("fichier", fichierSelectionne);
    }
    if (commentaire.trim()) {
      formData.append("commentaire", commentaire.trim());
    }
    soumettre.mutate(formData, {
      onSuccess: () => setFichierSelectionne(null),
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-[100px_1fr_1fr_140px_100px] items-start">
        <div className="pt-0.5">
          <BadgeStatutMission statut={mission.statut} />
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Mission</p>
          <Link
            to={`/projets/$projetId/stades/$numStade/missions/$missionId`}
            params={{ projetId, numStade: numStade.toString(), missionId: mission.id }}
            className="text-[13px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {mission.titre}
          </Link>
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Objectif</p>
          <p className="text-[12px] text-zinc-600">{mission.objectif}</p>
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">
            Preuve{" "}
            {mission.preuve_obligatoire && (
              <span className="text-red-400">*</span>
            )}
          </p>
          {mission.soumission?.fichier_url && !peutSoumettre ? (
            <FichierMiniViewer
              url={mission.soumission.fichier_url}
              type={mission.soumission.fichier_type}
              nom={mission.soumission.fichier_nom}
            />
          ) : necessiteFichier && peutSoumettre ? (
            <div className="space-y-2">
              {mission.soumission?.fichier_url && (
                <div className="mb-2">
                  <p className="text-[10px] text-zinc-400 mb-1">Preuve actuelle :</p>
                  <FichierMiniViewer
                    url={mission.soumission.fichier_url}
                    type={mission.soumission.fichier_type}
                    nom={mission.soumission.fichier_nom}
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={
                  mission.type_preuve_attendue === "PDF"
                    ? ".pdf"
                    : mission.type_preuve_attendue === "IMAGE"
                      ? "image/*"
                      : mission.type_preuve_attendue === "VIDEO"
                        ? "video/*"
                        : mission.type_preuve_attendue === "EXCEL"
                          ? ".xlsx,.xls,.csv"
                          : "*/*"
                }
                onChange={(e) =>
                  setFichierSelectionne(e.target.files?.[0] ?? null)
                }
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-lg text-[12px] text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {fichierSelectionne
                    ? "Changer le fichier"
                    : mission.soumission?.fichier_url
                      ? "Remplacer le fichier"
                      : "Ajouter un fichier"}
                </button>
                {fichierSelectionne && (
                  <button
                    type="button"
                    onClick={() => setFichierSelectionne(null)}
                    className="text-[12px] text-zinc-500 hover:text-zinc-700"
                  >
                    Retirer
                  </button>
                )}
              </div>
              <p className="text-[11px] text-zinc-500">
                {fichierSelectionne
                  ? fichierSelectionne.name
                  : mission.soumission?.fichier_url
                    ? "Fichier actuel conservé"
                    : fichierRequis
                      ? "Fichier obligatoire"
                      : "Fichier optionnel"}
              </p>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-400">
              {mission.type_preuve_attendue === "AUCUN" ? "Aucune" : "-"}
            </span>
          )}
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Date limite</p>
          <p className="text-[11px] text-zinc-600">
            {mission.date_limite
              ? new Date(mission.date_limite).toLocaleDateString("fr-FR")
              : "Aucune"}
          </p>
        </div>
      </div>

      {/* Zone Commentaire (optionnelle) */}
      {(peutSoumettre || mission.soumission?.commentaire) && (
        <div className="mt-3">
          <p className="text-[11px] text-zinc-500 mb-1">Commentaire ou spécification (optionnel)</p>
          {peutSoumettre ? (
            <textarea
              className="w-full text-[13px] p-2 border border-zinc-200 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
              rows={2}
              placeholder="Ajoutez un commentaire, un lien externe ou une précision pour votre mentor..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          ) : (
            <div className="bg-zinc-50 p-2 rounded-md border border-zinc-100 text-[13px] text-zinc-700 whitespace-pre-wrap">
              {mission.soumission?.commentaire}
            </div>
          )}
        </div>
      )}

      {mission.statut === "REJETEE" && mission.soumission?.motif_rejet && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <p className="text-[10px] text-red-400 font-medium mb-0.5">
            Motif du rejet
          </p>
          <p className="text-[12px] text-red-700">
            {mission.soumission.motif_rejet}
          </p>
        </div>
      )}

      {peutSoumettre && (
        <button
          type="button"
          onClick={handleSoumettre}
          disabled={
            soumettre.isPending ||
            (fichierRequis && !fichierSelectionne)
          }
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-[12px] font-medium transition-colors"
        >
          {soumettre.isPending && (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          )}
          {labelAction}
        </button>
      )}
    </div>
  );
}

function LigneMissionMentor({
  mission,
  projetId,
  numStade,
}: {
  mission: MissionStade;
  projetId: string;
  numStade: number;
}) {
  const [motifRejet, setMotifRejet] = useState("");
  const [showMotif, setShowMotif] = useState(false);
  const evaluer = useEvaluerMission(projetId, numStade, mission.id);

  const handleValider = () => {
    evaluer.mutate({ decision: "VALIDEE" });
  };

  const handleRejeter = () => {
    if (!motifRejet.trim()) return;
    evaluer.mutate(
      { decision: "REJETEE", motif_rejet: motifRejet.trim() },
      {
        onSuccess: () => {
          setMotifRejet("");
          setShowMotif(false);
        },
      },
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
      <div className="grid gap-3 md:grid-cols-[100px_1fr_1fr_140px_100px] items-start">
        <div className="pt-0.5">
          <BadgeStatutMission statut={mission.statut} />
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Mission</p>
          <Link
            to={`/projets/$projetId/stades/$numStade/missions/$missionId`}
            params={{ projetId, numStade: numStade.toString(), missionId: mission.id }}
            className="text-[13px] text-blue-600 hover:text-blue-800 hover:underline font-medium"
          >
            {mission.titre}
          </Link>
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Objectif</p>
          <p className="text-[12px] text-zinc-600">{mission.objectif}</p>
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Preuve soumise</p>
          {mission.soumission?.fichier_url ? (
            <FichierMiniViewer
              url={mission.soumission.fichier_url}
              type={mission.soumission.fichier_type}
              nom={mission.soumission.fichier_nom}
            />
          ) : (
            <span className="text-[11px] text-zinc-400">-</span>
          )}
        </div>

        <div>
          <p className="text-[11px] text-zinc-400 mb-0.5">Date limite</p>
          <p className="text-[11px] text-zinc-600">
            {mission.date_limite
              ? new Date(mission.date_limite).toLocaleDateString("fr-FR")
              : "Aucune"}
          </p>
        </div>
      </div>

      {mission.soumission?.commentaire && (
        <div className="mt-3 bg-zinc-50 border border-zinc-100 rounded-md p-3">
          <p className="text-[11px] text-zinc-500 font-medium mb-1">Commentaire de l'entrepreneur</p>
          <p className="text-[13px] text-zinc-700 whitespace-pre-wrap">{mission.soumission.commentaire}</p>
        </div>
      )}

      {mission.statut === "SOUMISE" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleValider}
              disabled={evaluer.isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-[12px] font-medium transition-colors"
            >
              {evaluer.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Valider
            </button>
            <button
              type="button"
              onClick={() => setShowMotif((prev) => !prev)}
              disabled={evaluer.isPending}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg text-[12px] font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Rejeter
            </button>
          </div>

          {showMotif && (
            <div className="space-y-2">
              <textarea
                value={motifRejet}
                onChange={(e) => setMotifRejet(e.target.value)}
                rows={2}
                placeholder="Expliquez pourquoi cette mission est rejetee..."
                className="w-full border border-red-200 rounded-lg px-3 py-2 text-[12px] text-zinc-800 resize-none focus:outline-none focus:border-red-400"
              />
              <button
                type="button"
                onClick={handleRejeter}
                disabled={!motifRejet.trim() || evaluer.isPending}
                className="px-4 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-[12px] font-medium transition-colors"
              >
                Confirmer le rejet
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MissionsStadeProps {
  stadeId?: string;
  projetId: string;
  numStade: number;
  isMentor: boolean;
}

export function MissionsStade({
  projetId,
  numStade,
  isMentor,
}: MissionsStadeProps) {
  const { data: missions, isLoading } = useMissions(projetId, numStade);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  const liste = missions ?? [];
  const total = liste.length;
  const validees = liste.filter(
    (mission) => mission.statut === "VALIDEE",
  ).length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
          <Target className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="text-center">
          <p className="text-[13px] text-zinc-500">
            {isMentor
              ? "Aucune mission definie pour ce stade."
              : "Votre mentor n'a pas encore defini de missions pour ce stade."}
          </p>
          {isMentor && (
            <Link
              to="/projets/$projetId/stades/$numStade/definir-missions"
              params={{ projetId, numStade: String(numStade) }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors"
            >
              <Target className="w-3.5 h-3.5" />
              Definir des missions
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <p className="text-[12px] text-zinc-500">
            <span className="font-medium text-zinc-800">{validees}</span> /{" "}
            {total} missions validees
          </p>

          {isMentor && (
            <Link
              to="/projets/$projetId/stades/$numStade/definir-missions"
              params={{ projetId, numStade: String(numStade) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-lg text-[12px] font-medium transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Gerer les missions
            </Link>
          )}
        </div>

        {validees === total ? (
          <span className="flex items-center gap-1 text-[12px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Toutes les missions sont completees
          </span>
        ) : !isMentor ? (
          <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Completez les missions pour debloquer la saisie
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        {liste.map((mission) =>
          isMentor ? (
            <LigneMissionMentor
              key={mission.id}
              mission={mission}
              projetId={projetId}
              numStade={numStade}
            />
          ) : (
            <LigneMissionEntrepreneur
              key={mission.id}
              mission={mission}
              projetId={projetId}
              numStade={numStade}
            />
          ),
        )}
      </div>
    </div>
  );
}
