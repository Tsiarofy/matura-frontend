import { Link } from "@tanstack/react-router";
import type { FormationResume } from "@matura/shared";
import { GraduationCap, Loader2, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { DOMAINE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn, getAvatarStyle } from "@/lib/utils";

interface FormationCardProps {
  formation: FormationResume;
  basePath?: "/formations" | "/mes-formations";
  onDelete?: (formation: FormationResume) => void;
  isDeleting?: boolean;
}

export function FormationCard({
  formation,
  basePath = "/formations",
  onDelete,
  isDeleting = false,
}: FormationCardProps) {
  const formationRoute =
    basePath === "/mes-formations"
      ? "/mes-formations/$formationId"
      : "/formations/$formationId";
  const canManage = basePath === "/mes-formations";

  return (
    <div className="group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 flex flex-col justify-between gap-5 min-h-[240px]">
      <div>
        {/* Header/Title Block: Icon and Title on one row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 shrink-0 rounded-[12px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-550 transition-colors">
            <GraduationCap className="w-4.5 h-4.5" strokeWidth={1.25} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-[15px] text-zinc-900 transition-colors truncate">
              {formation.titre}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] bg-[#eef0ff] text-[#3840C0] border-[#C2C5FA]">
              {DOMAINE_LABELS[formation.domaine] ?? formation.domaine}
            </span>
            {formation.stade_cible && (
              <span className="rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] bg-[#eafdf3] text-[#318055] border-[#c5f3d8]">
                BRL ≥ {formation.stade_cible}
              </span>
            )}
            {canManage && (
              <div className="ml-1 flex items-center gap-1">
                <Link
                  to={formationRoute}
                  params={{ formationId: formation.id }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700"
                  aria-label={`Modifier ${formation.titre}`}
                  title="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete?.(formation)}
                  disabled={isDeleting}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={`Supprimer ${formation.titre}`}
                  title="Supprimer"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Block indented to align with the title */}
        <div className="pl-12 space-y-3">
          <div className="flex items-center gap-2">
            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm", getAvatarStyle(formation.auteur.prenom).bg, getAvatarStyle(formation.auteur.prenom).text)}>
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
