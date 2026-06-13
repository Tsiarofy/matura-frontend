  import { getRouteApi } from "@tanstack/react-router";
  import { useFormations } from "@/hooks/useFormations";
  import {
    DOMAINE_LABELS,
    TYPE_CIBLE_LABELS,
    STADE_LABELS,
  } from "@/lib/constants";
  import { FormationCard } from "@/components/formations/FormationCard";
  import { Loader2 } from "lucide-react";
  import type { FormationsSearch } from "@matura/shared";

  // Note: `Route` and `filtresSchema` moved to `index.route.ts` / `@matura/shared`

  const routeApi = getRouteApi("/(dashboard)/_layout/formations/")

  export default function FormationsPage() {
    const { domaine, stade_cible, type_cible, page } = routeApi.useSearch() as FormationsSearch
    const navigate = routeApi.useNavigate()

    const { data, isLoading } = useFormations({
      domaine,
      stade_cible,
      type_cible,
      page: page ?? 1,
      limite: 12,
    });

    return (
      <div className="page-shell">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">Formations</h1>
            <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
              Ressources filtrables par domaine, stade et type de cible
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="panel-flat flex flex-wrap gap-3 p-4">
          <div className="relative">
            <select
              value={domaine ?? ""}
              onChange={(e) =>
                navigate({
                  search: {
                    domaine: e.target.value || undefined,
                    stade_cible,
                    type_cible,
                    page: 1,
                  } as any,
                })
              }
              className="w-auto min-w-[140px] max-w-[200px] h-[34px] pl-3.5 pr-8 rounded-[12px] border border-zinc-200/80 bg-zinc-50/50 text-[12px] font-semibold text-zinc-700 outline-none hover:bg-zinc-100/50 focus:border-zinc-300 focus:bg-white transition-colors cursor-pointer appearance-none"
            >
              <option value="">Tous les domaines</option>
              {Object.entries(DOMAINE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={stade_cible?.toString() ?? ""}
              onChange={(e) =>
                navigate({
                  search: {
                    domaine,
                    stade_cible: e.target.value ? parseInt(e.target.value) : undefined,
                    type_cible,
                    page: 1,
                  } as any,
                })
              }
              className="w-auto min-w-[140px] max-w-[200px] h-[34px] pl-3.5 pr-8 rounded-[12px] border border-zinc-200/80 bg-zinc-50/50 text-[12px] font-semibold text-zinc-700 outline-none hover:bg-zinc-100/50 focus:border-zinc-300 focus:bg-white transition-colors cursor-pointer appearance-none"
            >
              <option value="">Tous les stades</option>
              {Object.entries(STADE_LABELS).map(([num, label]) => (
                <option key={num} value={num}>
                  Stade {num} — {label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={type_cible ?? ""}
              onChange={(e) =>
                navigate({
                  search: {
                    domaine,
                    stade_cible,
                    type_cible: (e.target.value as any) || undefined,
                    page: 1,
                  } as any,
                })
              }
              className="w-auto min-w-[140px] max-w-[200px] h-[34px] pl-3.5 pr-8 rounded-[12px] border border-zinc-200/80 bg-zinc-50/50 text-[12px] font-semibold text-zinc-700 outline-none hover:bg-zinc-100/50 focus:border-zinc-300 focus:bg-white transition-colors cursor-pointer appearance-none"
            >
              <option value="">Tous les types</option>
              {Object.entries(TYPE_CIBLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Grille de formations */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.formations.map((f) => (
              // <div>{f.description}</div>
              <FormationCard key={f.id} formation={f} />
            ))}
          </div>
        )}
      </div>
    );
  }
