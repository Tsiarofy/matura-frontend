import {
  type OffreFinancement,
  TypeFinancement,
  StatutOffre,
} from "@matura/shared";
import { BadgeDollarSign, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]: "Subvention",
  [TypeFinancement.PRET]: "Prêt",
  [TypeFinancement.EQUITY]: "Equity",
  [TypeFinancement.OBLIGATION]: "Obligation",
  [TypeFinancement.DON]: "Don",
};

const TYPE_COLORS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]: "bg-green-50 text-green-700 border-green-200",
  [TypeFinancement.PRET]: "bg-blue-50 text-blue-700 border-blue-200",
  [TypeFinancement.EQUITY]: "bg-purple-50 text-purple-700 border-purple-200",
  [TypeFinancement.OBLIGATION]:
    "bg-orange-50 text-orange-700 border-orange-200",
  [TypeFinancement.DON]: "bg-teal-50 text-teal-700 border-teal-200",
};

const STATUT_LABELS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]: "Ouverte",
  [StatutOffre.EN_COURS]: "En cours",
  [StatutOffre.FERMEE]: "Fermée",
  [StatutOffre.CLOTUREE]: "Clôturée",
};

interface Props {
  offre: OffreFinancement & {
    investisseur?: { prenom: string; nom: string };
    _count?: { candidatures: number };
  };
  onClick: () => void;
}

export function FinancementCard({ offre, onClick }: Props) {
  const isActive =
    offre.statut === StatutOffre.OUVERTE ||
    offre.statut === StatutOffre.EN_COURS;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={cn(
        "group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-zinc-200 flex flex-col justify-between gap-5 min-h-[240px]",
        !isActive && "opacity-60",
      )}
    >
      <div>
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-[14px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-700 transition-colors">
            <BadgeDollarSign className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]",
                TYPE_COLORS[offre.typeFinancement],
              )}
            >
              {TYPE_LABELS[offre.typeFinancement] ?? offre.typeFinancement}
            </span>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]",
                isActive
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-zinc-50 text-zinc-400 border-zinc-200",
              )}
            >
              {STATUT_LABELS[offre.statut]}
            </span>
          </div>
        </div>

        {/* Title & Info */}
        <div className="space-y-1.5 mb-3">
          <h3 className="text-[16px] font-bold text-zinc-900 group-hover:text-green-700 transition-colors truncate">
            {offre.titre}
          </h3>
          {offre.investisseur && (
            <div className="flex items-center gap-2 text-[12px] text-zinc-400">
              <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                {offre.investisseur.prenom.charAt(0)}
              </div>
              <span className="font-semibold text-zinc-500">
                {offre.investisseur.prenom} {offre.investisseur.nom}
              </span>
              <span>·</span>
              <span className="font-bold text-zinc-500">BRL ≥ {offre.stadeCible}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2">
          {offre.description || "Aucune description fournie pour cette offre."}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-1">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-zinc-400 uppercase text-[9px] font-bold tracking-wider mb-0.5">
              Montant
            </span>
            <span className="text-zinc-800 font-bold text-[14px]">
              {offre.montantMax
                ? `${(offre.montantMax / 1000000).toFixed(1)}M`
                : "—"}
              <span className="text-[10px] ml-1 text-zinc-400 font-normal">
                {offre.devise}
              </span>
            </span>
          </div>
          {offre.dateCloture && (
            <div className="flex flex-col">
              <span className="text-zinc-400 uppercase text-[9px] font-bold tracking-wider mb-0.5">
                Clôture
              </span>
              <span className="text-zinc-800 font-bold text-[14px]">
                {new Date(offre.dateCloture).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          )}
        </div>
        <ChevronRight
          size={18}
          strokeWidth={2}
          className="text-zinc-350 group-hover:text-zinc-800 transition-colors"
        />
      </div>
    </div>
  );
}
