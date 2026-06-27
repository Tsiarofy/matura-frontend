import { Link } from "@tanstack/react-router";
import type { MissionStade } from "@matura/shared";
import { AlertCircle, CheckCircle2, Clock, FileText, Loader2, Settings, Target, XCircle } from "lucide-react";
import { useMissions } from "@/hooks/useMissions";
import { cn } from "@/lib/utils";

function BadgeStatutMission({ statut }: { statut: string }) {
  const config: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
    INACHEVEE: { label: "À faire", classes: "bg-[#f6f6f4] text-[#b6b6b6] border-[#e5e5e1] border-[0.5px]", icon: <Clock className="w-3 h-3" /> },
    SOUMISE: { label: "En revue", classes: "bg-[#EBF5FC] text-[#1C5F8C] border-[#B8D8F0] border-[0.5px]", icon: <Clock className="w-3 h-3" /> },
    VALIDEE: { label: "Validée", classes: "bg-[#eafdf3] text-[#318055] border-[#c5f3d8] border-[0.5px]", icon: <CheckCircle2 className="w-3 h-3" /> },
    REJETEE: { label: "Rejetée", classes: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] border-[0.5px]", icon: <XCircle className="w-3 h-3" /> },
  };
  const current = config[statut] ?? config.INACHEVEE;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium", current.classes)}>
      {current.icon}
      {current.label}
    </span>
  );
}

function LigneMissionOverview({ mission, projetId, numStade }: { mission: MissionStade; projetId: string; numStade: number }) {
  const isDone = mission.statut === "VALIDEE";
  const isActive = mission.statut === "SOUMISE";
  const isTodo = mission.statut === "INACHEVEE" || mission.statut === "REJETEE";

  return (
    <Link
      to="/projets/$projetId/stades/$numStade/missions/$missionId"
      params={{ projetId, numStade: String(numStade), missionId: mission.id }}
      className={cn(
        "rounded-xl overflow-hidden flex flex-col transition-colors shadow-sm",
        isDone && "bg-[#F5FDF8] border-[0.5px] border-[#c5f3d8] hover:bg-[#eafdf3]",
        isActive && "bg-[#F2F8FD] border-[0.5px] border-[#B8D8F0] hover:bg-[#EBF5FC]",
        isTodo && "bg-white border-[0.5px] border-[#eeeeea] hover:bg-zinc-50"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-4">
        <div className="flex items-center gap-4">
          {/* Custom Indicator/Checkbox icon */}
          {isDone ? (
            <div className="w-[17px] h-[17px] rounded bg-[#41A677] text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
          ) : isActive ? (
            <div className="w-[17px] h-[17px] rounded bg-[#3A8FC4] text-white flex items-center justify-center text-[8px] font-bold shrink-0">●</div>
          ) : (
            <div className="w-[17px] h-[17px] rounded bg-[#f6f6f4] border-[1.5px] border-[#e5e5e1] shrink-0" />
          )}
          
          <div>
            <p className={cn(
              "text-[14px] font-semibold",
              isDone && "text-[#333333]",
              isActive && "text-[#141414]",
              isTodo && "text-[#757575]"
            )}>
              {mission.titre}
            </p>
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
          <BadgeStatutMission statut={mission.statut} />
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
  statutStade?: string;
}

export function MissionsStade({ projetId, numStade, isMentor, statutStade }: MissionsStadeProps) {
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
          {isMentor && statutStade !== "VALIDE" && (
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
          {isMentor && statutStade !== "VALIDE" && (
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
