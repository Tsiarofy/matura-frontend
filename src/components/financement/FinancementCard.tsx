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
        "group w-full h-64 relative cursor-pointer rounded-lg border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md",
        !isActive && "opacity-60",
      )}
    >
      <div className="relative space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="icon-chip h-10 w-10 shrink-0 rounded-[14px]">
            <BadgeDollarSign
              className="w-4.5 h-4.5 text-[var(--color-text-muted)]"
              strokeWidth={1.7}
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]",
                  TYPE_COLORS[offre.typeFinancement],
                )}
              >
                {TYPE_LABELS[offre.typeFinancement] ?? offre.typeFinancement}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em]",
                  isActive
                    ? "bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]"
                    : "bg-[var(--color-surface-input)] text-[var(--color-text-muted)] border-[var(--color-border)]",
                )}
              >
                {STATUT_LABELS[offre.statut]}
              </span>
            </div>
            <h3 className="text-[15px] font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-success-text)]">
              {offre.titre}
            </h3>
          </div>
        </div>

        {/* Investor Info */}
        {offre.investisseur && (
          <div className="flex items-center gap-2.5 text-[11px] text-[var(--color-text-muted)]">
            <div className="w-6 h-6 rounded-full bg-[var(--color-text-primary)] flex items-center justify-center text-[10px] font-bold text-white">
              {offre.investisseur.prenom.charAt(0)}
            </div>
            <span className="font-semibold text-[var(--color-text-secondary)]">
              {offre.investisseur.prenom} {offre.investisseur.nom}
            </span>
            <span>·</span>
            <span className="font-bold">BRL ≥ {offre.stadeCible}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-[12px] font-medium text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
          {offre.description}
        </p>

        {/* Footer Metrics */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3.5">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[var(--color-text-disabled)] uppercase text-[9px] font-bold tracking-widest mb-0.5">
                Montant
              </span>
              <span className="text-[var(--color-text-primary)] font-bold text-[14px]">
                {offre.montantMax
                  ? `${(offre.montantMax / 1000000).toFixed(1)}M`
                  : "—"}
                <span className="text-[10px] ml-1 text-[var(--color-text-muted)]">
                  {offre.devise}
                </span>
              </span>
            </div>
            {offre.dateCloture && (
              <div className="flex flex-col">
                <span className="text-[var(--color-text-disabled)] uppercase text-[9px] font-bold tracking-widest mb-0.5">
                  Clôture
                </span>
                <span className="text-[var(--color-text-primary)] font-bold text-[14px]">
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
            className="text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-primary)] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
