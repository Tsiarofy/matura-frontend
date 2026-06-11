import { useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { FichierRequis, MissionStade } from "@matura/shared";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Settings,
  Target,
  Upload,
  XCircle,
  Eye,
  Edit2,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FichierMiniViewer } from "@/components/shared/FichierMiniViewer";
import {
  useEvaluerMission,
  useMissions,
  useSoumettreReponseMission,
} from "@/hooks/useMissions";
import { cn } from "@/lib/utils";

// ─── Badge statut ─────────────────────────────────────────────────

function BadgeStatutMission({ statut }: { statut: string }) {
  const config: Record<string, { label: string; classes: string; icon: ReactNode }> = {
    INACHEVEE: {
      label: "À faire",
      classes: "bg-zinc-100 text-zinc-600",
      icon: <Clock className="w-3 h-3" />,
    },
    SOUMISE: {
      label: "En revue",
      classes: "bg-blue-50 text-blue-700 border border-blue-200",
      icon: <Clock className="w-3 h-3" />,
    },
    VALIDEE: {
      label: "Validée",
      classes: "bg-green-50 text-green-700 border border-green-200",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    REJETEE: {
      label: "Rejetée",
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

// ─── Badge type fichier ────────────────────────────────────────────

const BADGE_FICHIER: Record<string, { label: string; bg: string }> = {
  PDF: { label: "PDF", bg: "bg-red-50 text-red-600" },
  EXCEL: { label: "Excel/CSV", bg: "bg-green-50 text-green-700" },
  IMAGE: { label: "Image", bg: "bg-purple-50 text-purple-700" },
  VIDEO: { label: "Vidéo", bg: "bg-amber-50 text-amber-700" },
};

function BadgeFichierType({ type }: { type: string }) {
  const cfg = BADGE_FICHIER[type] ?? { label: type, bg: "bg-zinc-100 text-zinc-500" };
  return (
    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", cfg.bg)}>
      {cfg.label}
    </span>
  );
}

// ─── Acceptation par type ──────────────────────────────────────────

function acceptPourType(type: string): string {
  if (type === "PDF") return ".pdf";
  if (type === "IMAGE") return "image/*";
  if (type === "VIDEO") return "video/*";
  if (type === "EXCEL") return ".xlsx,.xls,.csv";
  return "*/*";
}

// ─── Ligne entrepreneur ────────────────────────────────────────────

function LigneMissionEntrepreneur({
  mission,
  projetId,
  numStade,
}: {
  mission: MissionStade;
  projetId: string;
  numStade: number;
}) {
  const [fichiersMap, setFichiersMap] = useState<Map<string, File>>(new Map());
  const [commentaire, setCommentaire] = useState(mission.soumission?.commentaire ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const soumettre = useSoumettreReponseMission(projetId, numStade, mission.id);

  const peutSoumettre =
    mission.statut === "INACHEVEE" ||
    mission.statut === "REJETEE";

  const fichiersDejaSoumis = mission.soumission?.fichiers ?? [];

  /** Retrouve le fichier soumis pour un fichier requis donné */
  const getFichierSoumis = (frId: string) =>
    fichiersDejaSoumis.find((f) => f.fichier_requis_id === frId) ?? null;

  /** Tous les fichiers requis ont été sélectionnés (ou déjà soumis si REJETEE) */
  const tousSelectionnes =
    mission.fichiers_requis.length === 0 ||
    mission.fichiers_requis.every((fr) => fichiersMap.has(fr.id));

  const handleFichierChange = (frId: string, file: File | null) => {
    setFichiersMap((prev) => {
      const next = new Map(prev);
      if (file) next.set(frId, file);
      else next.delete(frId);
      return next;
    });
  };

  const handleSoumettre = () => {
    soumettre.mutate(
      { fichiersMap, commentaire },
      { onSuccess: () => setFichiersMap(new Map()) },
    );
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col">
      {/* En-tête (Détails) */}
      <div
        className="flex items-start justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <BadgeStatutMission statut={mission.statut} />
          <div>
            <p className="text-[13px] font-medium text-zinc-800">{mission.titre}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{mission.objectif}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right shrink-0">
          {mission.date_limite && (
            <p className="text-[11px] text-zinc-500">
              {new Date(mission.date_limite).toLocaleDateString("fr-FR")}
            </p>
          )}
          <span className="text-[11px] text-zinc-400 flex items-center gap-0.5">
            <FileText className="w-3 h-3" />
            {mission.fichiers_requis.length} fichier{mission.fichiers_requis.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="px-4 py-2.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
        <Link
          to="/projets/$projetId/stades/$numStade/missions/$missionId"
          params={{ projetId, numStade: numStade.toString(), missionId: mission.id }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-lg text-[12px] font-medium transition-colors shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          Détails
        </Link>
        {peutSoumettre && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Éditer
          </button>
        )}
      </div>

      {/* Modale formulaire */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px] p-0 max-h-[85vh] flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 shrink-0">
            <h2 className="text-[16px] font-semibold text-zinc-900">Soumettre la mission</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">Complétez les fichiers requis et ajoutez un commentaire.</p>
          </div>
          <div className="px-6 py-4 overflow-y-auto space-y-4">

          {/* Motif rejet */}
          {mission.statut === "REJETEE" && mission.soumission?.motif_rejet && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <p className="text-[10px] text-red-400 font-medium mb-0.5">Motif du rejet</p>
              <p className="text-[12px] text-red-700">{mission.soumission.motif_rejet}</p>
            </div>
          )}

          {/* Liste des fichiers requis */}
          {mission.fichiers_requis.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold text-zinc-600">
                Fichiers à fournir{" "}
                <span className="text-red-400">*</span>
              </p>

              {mission.fichiers_requis.map((fr) => (
                <FichierRequisRow
                  key={fr.id}
                  fr={fr}
                  fichierSelectionne={fichiersMap.get(fr.id) ?? null}
                  fichierSoumis={getFichierSoumis(fr.id)}
                  onChange={(file) => handleFichierChange(fr.id, file)}
                />
              ))}
            </div>
          )}

          {/* Commentaire */}
          <div>
            <p className="text-[11px] text-zinc-500 mb-1">
              Commentaire ou précision (optionnel)
            </p>
            <textarea
              className="w-full text-[13px] p-2 border border-zinc-200 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
              rows={2}
              placeholder="Ajoutez un commentaire, un lien externe ou une précision pour votre mentor…"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          {/* Bouton soumettre */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSoumettre}
              disabled={
                soumettre.isPending ||
                (mission.fichiers_requis.length > 0 && !tousSelectionnes)
              }
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              {soumettre.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mission.fichiers_requis.length > 0
                ? "Soumettre les preuves"
                : "Marquer comme terminée"}
            </button>
          </div>
        </div>
        </DialogContent>
      </Dialog>

      {/* Soumission validée ou en revue : affichage lecture seule */}
      {(mission.statut === "VALIDEE" || mission.statut === "SOUMISE") && mission.soumission && (
        <div className={`border-t border-zinc-100 px-4 py-3 space-y-2 ${mission.statut === 'VALIDEE' ? 'bg-green-50/30' : 'bg-blue-50/30'}`}>
          <p className={`text-[11px] font-medium ${mission.statut === 'VALIDEE' ? 'text-green-700' : 'text-blue-700'}`}>
            Preuves soumises :
          </p>
          {mission.soumission.commentaire && (
             <p className="text-[12px] text-zinc-700 mb-2 italic">"{mission.soumission.commentaire}"</p>
          )}
          {mission.soumission.fichiers.map((f) => {
            const fr = mission.fichiers_requis.find((r) => r.id === f.fichier_requis_id);
            return (
              <div key={f.id} className="flex items-center gap-2">
                {fr && <BadgeFichierType type={fr.type} />}
                <FichierMiniViewer url={f.fichier_url} type={f.fichier_type} nom={f.fichier_nom} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Ligne d'un fichier requis dans le formulaire de soumission entrepreneur */
function FichierRequisRow({
  fr,
  fichierSelectionne,
  fichierSoumis,
  onChange,
}: {
  fr: FichierRequis;
  fichierSelectionne: File | null;
  fichierSoumis: { fichier_url: string; fichier_nom: string; fichier_type: string } | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-3 bg-white border border-zinc-100 rounded-lg p-3">
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <BadgeFichierType type={fr.type} />
          <p className="text-[12px] text-zinc-700">{fr.description}</p>
        </div>

        {/* Fichier actuel (soumission SOUMISE/REJETEE) */}
        {fichierSoumis && !fichierSelectionne && (
          <div className="mt-1">
            <p className="text-[10px] text-zinc-400 mb-0.5">Fichier actuel :</p>
            <FichierMiniViewer
              url={fichierSoumis.fichier_url}
              type={fichierSoumis.fichier_type}
              nom={fichierSoumis.fichier_nom}
            />
          </div>
        )}

        {/* Fichier sélectionné */}
        {fichierSelectionne && (
          <p className="text-[11px] text-green-700 font-medium truncate">
            ✓ {fichierSelectionne.name}
          </p>
        )}

        {!fichierSelectionne && !fichierSoumis && (
          <p className="text-[11px] text-red-400">Fichier requis</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptPourType(fr.type)}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-zinc-200 rounded-md text-[11px] text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          <Upload className="w-3 h-3" />
          {fichierSelectionne
            ? "Changer"
            : fichierSoumis
              ? "Remplacer"
              : "Ajouter"}
        </button>
        {fichierSelectionne && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[11px] text-zinc-400 hover:text-zinc-700"
          >
            Retirer
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Ligne mentor ──────────────────────────────────────────────────

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

  const handleValider = () => evaluer.mutate({ decision: "VALIDEE" });

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

  const fichiersSoumis = mission.soumission?.fichiers ?? [];

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      {/* En-tête cliquable → page de détail */}
      <Link
        to="/projets/$projetId/stades/$numStade/missions/$missionId"
        params={{ projetId, numStade: numStade.toString(), missionId: mission.id }}
        className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BadgeStatutMission statut={mission.statut} />
          <div>
            <p className="text-[13px] font-medium text-zinc-800">{mission.titre}</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{mission.objectif}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {mission.date_limite && (
            <p className="text-[11px] text-zinc-500">
              {new Date(mission.date_limite).toLocaleDateString("fr-FR")}
            </p>
          )}
          <span className="text-[11px] text-zinc-400 flex items-center gap-0.5">
            <FileText className="w-3 h-3" />
            {mission.fichiers_requis.length}
          </span>
        </div>
      </Link>

      {/* Preuves soumises + évaluation */}
      {mission.soumission && (
        <div className="border-t border-zinc-100 px-4 py-4 space-y-3 bg-zinc-50/40">
          {/* Commentaire entrepreneur */}
          {mission.soumission.commentaire && (
            <div className="bg-white border border-zinc-100 rounded-md p-3">
              <p className="text-[11px] text-zinc-500 font-medium mb-1">
                Commentaire de l&apos;entrepreneur
              </p>
              <p className="text-[13px] text-zinc-700 whitespace-pre-wrap">
                {mission.soumission.commentaire}
              </p>
            </div>
          )}

          {/* Fichiers soumis */}
          {fichiersSoumis.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-zinc-600">Fichiers soumis :</p>
              {fichiersSoumis.map((f) => {
                const fr = mission.fichiers_requis.find((r) => r.id === f.fichier_requis_id);
                return (
                  <div key={f.id} className="flex items-center gap-2 bg-white border border-zinc-100 rounded-md p-2">
                    {fr && <BadgeFichierType type={fr.type} />}
                    <FichierMiniViewer url={f.fichier_url} type={f.fichier_type} nom={f.fichier_nom} />
                    {fr && <p className="text-[11px] text-zinc-500 truncate">{fr.description}</p>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Boutons validation (seulement si SOUMISE) */}
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
                    placeholder="Expliquez pourquoi cette mission est rejetée…"
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
      )}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────

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
  const validees = liste.filter((m) => m.statut === "VALIDEE").length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
          <Target className="w-5 h-5 text-zinc-400" />
        </div>
        <div className="text-center">
          <p className="text-[13px] text-zinc-500">
            {isMentor
              ? "Aucune mission définie pour ce stade."
              : "Votre mentor n'a pas encore défini de missions pour ce stade."}
          </p>
          {isMentor && (
            <Link
              to="/projets/$projetId/stades/$numStade/definir-missions"
              params={{ projetId, numStade: String(numStade) }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors"
            >
              <Target className="w-3.5 h-3.5" />
              Définir des missions
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec compteur + lien gestion */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <p className="text-[12px] text-zinc-500">
            <span className="font-medium text-zinc-800">{validees}</span> /{" "}
            {total} missions validées
          </p>

          {isMentor && (
            <Link
              to="/projets/$projetId/stades/$numStade/definir-missions"
              params={{ projetId, numStade: String(numStade) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 rounded-lg text-[12px] font-medium transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              Gérer les missions
            </Link>
          )}
        </div>

        {validees === total ? (
          <span className="flex items-center gap-1 text-[12px] text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Toutes les missions sont complétées
          </span>
        ) : !isMentor ? (
          <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Complétez les missions pour débloquer la saisie
          </span>
        ) : null}
      </div>

      {/* Liste des missions */}
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
