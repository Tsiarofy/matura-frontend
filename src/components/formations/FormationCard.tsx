import { Link } from "@tanstack/react-router";
import type { FormationResume } from "@matura/shared";
import { GraduationCap, PlayCircle } from "lucide-react";
import { DOMAINE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface FormationCardProps {
  formation: FormationResume;
  basePath?: "/formations" | "/mes-formations";
}

export function FormationCard({
  formation,
  basePath = "/formations",
}: FormationCardProps) {
  const formationRoute =
    basePath === "/mes-formations"
      ? "/mes-formations/$formationId"
      : "/formations/$formationId";

  return (
    <div className="group w-full h-64 relative rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md">
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="icon-chip h-11 w-11 shrink-0 rounded-[16px]">
            <GraduationCap
              className="w-5 h-5 text-[var(--color-text-muted)]"
              strokeWidth={1.7}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-semibold leading-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-success-text)] truncate">
              {formation.titre}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-[var(--color-text-primary)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                {formation.auteur.prenom.charAt(0)}
              </div>
              <p className="text-[12px] font-semibold text-[var(--color-text-muted)]">
                {formation.auteur.prenom} {formation.auteur.nom}
              </p>
            </div>
          </div>
        </div>

        {formation.description && (
          <p className="text-[13px] font-medium text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            {formation.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] bg-[var(--color-surface-input)] text-[var(--color-text-muted)] border-[var(--color-border)]">
            {DOMAINE_LABELS[formation.domaine] ?? formation.domaine}
          </span>
          {formation.stade_cible && (
            <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] bg-amber-50 text-amber-700 border-amber-200">
              BRL ≥ {formation.stade_cible}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-disabled)]">
            {formation.nombre_lessons} modules
          </span>
          <Button asChild size="sm" variant="success">
            <Link to={formationRoute} params={{ formationId: formation.id }}>
              <PlayCircle size={16} strokeWidth={2} />
              {basePath === "/mes-formations" ? "Gérer" : "Lancer"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
