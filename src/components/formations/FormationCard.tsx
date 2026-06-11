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
    <div className="group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-zinc-200 flex flex-col justify-between gap-5 min-h-[240px]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-[14px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 group-hover:bg-green-50 group-hover:border-green-100 group-hover:text-green-700 transition-colors">
            <GraduationCap className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-1.5">
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

        {/* Title & Author */}
        <div className="space-y-1.5 mb-3">
          <h3 className="text-[16px] font-bold text-zinc-900 group-hover:text-green-700 transition-colors truncate">
            {formation.titre}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
              {formation.auteur.prenom.charAt(0)}
            </div>
            <p className="text-[12px] font-medium text-zinc-400">
              Par {formation.auteur.prenom} {formation.auteur.nom}
            </p>
          </div>
        </div>

        {/* Description */}
        {formation.description && (
          <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2">
            {formation.description}
          </p>
        )}
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
