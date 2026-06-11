import { Link } from "@tanstack/react-router";
import type { MissionStade } from "@matura/shared";
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2, Settings, Target, Eye, XCircle } from "lucide-react";
import { useMissions } from "@/hooks/useMissions";
import { cn } from "@/lib/utils";

function BadgeStatutMission({ statut }: { statut: string }) {
  const config: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
    INACHEVEE: { label: "À faire", classes: "bg-zinc-100 text-zinc-600", icon: <Clock className="w-3 h-3" /> },
    SOUMISE: { label: "En revue", classes: "bg-blue-50 text-blue-700 border border-blue-200", icon: <Clock className="w-3 h-3" /> },
    VALIDEE: { label: "Validée", classes: "bg-green-50 text-green-700 border border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
    REJETEE: { label: "Rejetée", classes: "bg-red-50 text-red-700 border border-red-200", icon: <XCircle className="w-3 h-3" /> },
  };
  const current = config[statut] ?? config.INACHEVEE;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", current.classes)}>
      {current.icon}
      {current.label}
    </span>
  );
}

function LigneMissionOverview({ mission, projetId, numStade }: { mission: MissionStade; projetId: string; numStade: number }) {
  return (
    <Link
      to="/projets/$projetId/stades/$numStade/missions/$missionId"
      params={{ projetId, numStade: String(numStade), missionId: mission.id }}
      className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col hover:bg-zinc-50 transition-colors shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-4">
        <div className="flex items-center gap-4">
          <BadgeStatutMission statut={mission.statut} />
          <div>
            <p className="text-[14px] font-semibold text-zinc-800">{mission.titre}</p>
            <p className="text-[12px] text-zinc-500 mt-1 line-clamp-1">{mission.objectif}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 shrink-0">
          {mission.date_limite && (
            <div className="text-right hidden sm:block">
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Date limite</p>
              <p className="text-[12px] font-medium text-zinc-700 mt-0.5">{new Date(mission.date_limite).toLocaleDateString("fr-FR")}</p>
            </div>
          )}
          <span className="text-[12px] font-medium text-zinc-500 flex items-center gap-1.5 bg-zinc-100 px-2.5 py-1.5 rounded-md border border-zinc-200">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            {mission.fichiers_requis.length} fichier{mission.fichiers_requis.length > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-300 text-zinc-700 rounded-lg text-[12px] font-medium shadow-sm hover:bg-zinc-50 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Détails
          </span>
        </div>
      </div>
    </Link>
  );
}

interface MissionsStadeProps {
  stadeId?: string;
  projetId: string;
  numStade: number;
  isMentor: boolean;
}

export function MissionsStade({ projetId, numStade, isMentor }: MissionsStadeProps) {
  const { data: missions, isLoading } = useMissions(projetId, numStade);

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-green-600" /></div>;

  const liste = missions ?? [];
  const total = liste.length;
  const validees = liste.filter((m) => m.statut === "VALIDEE").length;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center"><Target className="w-5 h-5 text-zinc-400" /></div>
        <div className="text-center">
          <p className="text-[13px] text-zinc-500">{isMentor ? "Aucune mission définie pour ce stade." : "Votre mentor n'a pas encore défini de missions pour ce stade."}</p>
          {isMentor && (
            <Link to="/projets/$projetId/stades/$numStade/definir-missions" params={{ projetId, numStade: String(numStade) }} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm">
              <Target className="w-3.5 h-3.5" />
              Définir des missions
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
            <p className="text-[13px] text-zinc-600"><span className="font-semibold text-zinc-900">{validees}</span> / {total} validées</p>
          </div>
          {isMentor && (
            <Link to="/projets/$projetId/stades/$numStade/definir-missions" params={{ projetId, numStade: String(numStade) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg text-[12px] font-medium transition-colors shadow-sm">
              <Settings className="w-3.5 h-3.5" /> Gérer les missions
            </Link>
          )}
        </div>
        {validees === total ? (
          <span className="flex items-center gap-1.5 text-[12px] text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 font-medium"><CheckCircle2 className="w-4 h-4" /> Stade complété</span>
        ) : !isMentor ? (
          <span className="flex items-center gap-1.5 text-[12px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium"><AlertCircle className="w-4 h-4" /> En attente de validation</span>
        ) : null}
      </div>
      
      <div className="space-y-3">
        {liste.map((mission) => (
          <LigneMissionOverview key={mission.id} mission={mission} projetId={projetId} numStade={numStade} />
        ))}
      </div>
    </div>
  );
}
