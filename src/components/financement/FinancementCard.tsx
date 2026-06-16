import {
  type OffreFinancement,
  TypeFinancement,
  StatutOffre,
} from "@matura/shared";
import { BadgeDollarSign, ChevronRight } from "lucide-react";
import { cn, getAvatarStyle } from "@/lib/utils";

const TYPE_LABELS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]: "Subvention",
  [TypeFinancement.PRET]: "Prêt",
  [TypeFinancement.EQUITY]: "Equity",
  [TypeFinancement.OBLIGATION]: "Obligation",
  [TypeFinancement.DON]: "Don",
};

const TYPE_COLORS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]: "bg-[#fff8e8] text-[#c47d00] border-[#f9d98a]",
  [TypeFinancement.PRET]: "bg-[#fff8e8] text-[#c47d00] border-[#f9d98a]",
  [TypeFinancement.DON]: "bg-[#fff8e8] text-[#c47d00] border-[#f9d98a]",
  [TypeFinancement.EQUITY]: "bg-[#E2F7F6] text-[#0D7A75] border-[#A6E3E1]",
  [TypeFinancement.OBLIGATION]: "bg-[#E2F7F6] text-[#0D7A75] border-[#A6E3E1]",
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
        "w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 min-h-[240px]",
        !isActive && "opacity-60",
      )}
    >
      <div>
        {/* Header/Title Block: Icon and Title on one row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 shrink-0 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550">
            <BadgeDollarSign className="w-4.5 h-4.5" strokeWidth={1.25} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-[15px] text-zinc-900 truncate">
              {offre.titre}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
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

        {/* Content Block indented to align with the title */}
        <div className="pl-12 space-y-3">
          {offre.investisseur && (
            <div className="flex items-center gap-2 text-[12px] text-zinc-400">
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm", getAvatarStyle(offre.investisseur.prenom).bg, getAvatarStyle(offre.investisseur.prenom).text)}>
                {offre.investisseur.prenom.charAt(0)}
              </div>
              <span className="font-semibold text-zinc-550">
                {offre.investisseur.prenom} {offre.investisseur.nom}
              </span>
              <span>·</span>
              <span className="font-bold text-zinc-500">BRL ≥ {offre.stadeCible}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2 text-thin">
            {offre.description || "Aucune description fournie pour cette offre."}
          </p>
        </div>
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
          strokeWidth={1.25}
          className="text-zinc-350"
        />
      </div>
    </div>
  );
}
