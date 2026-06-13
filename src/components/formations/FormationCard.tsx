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
    <div className="group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 flex flex-col justify-between gap-5 min-h-[240px]">
      <div>
        {/* Header/Title Block: Icon and Title on one row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 shrink-0 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-700 transition-colors">
            <GraduationCap className="w-4.5 h-4.5" strokeWidth={1.25} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-[15px] text-zinc-900 group-hover:text-green-700 transition-colors truncate">
              {formation.titre}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] bg-zinc-50 text-zinc-500 border-zinc-200">
              {DOMAINE_LABELS[formation.domaine] ?? formation.domaine}
            </span>
            {formation.stade_cible && (
              <span className="rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] bg-amber-50 text-amber-700 border-amber-200">
                BRL ≥ {formation.stade_cible}
              </span>
            )}
          </div>
        </div>

        {/* Content Block indented to align with the title */}
        <div className="pl-12 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
              {formation.auteur.prenom.charAt(0)}
            </div>
            <p className="text-[11px] font-semibold text-zinc-400">
              Par {formation.auteur.prenom} {formation.auteur.nom}
            </p>
          </div>

          {formation.description && (
            <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2 text-thin">
              {formation.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3.5 mt-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {formation.nombre_lessons} modules
        </span>
        <Button asChild size="sm" variant="success" className="rounded-full">
          <Link to={formationRoute} params={{ formationId: formation.id }}>
            <PlayCircle size={14} className="mr-1.5" />
            {basePath === "/mes-formations" ? "Gérer" : "Lancer"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
