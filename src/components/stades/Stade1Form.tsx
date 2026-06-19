// maturproj-frontend/src/components/stades/Stade1Form.tsx
// Remplace complètement l'ancienne version du repo.
//
// Diff avec l'ancienne version :
//   - Suppression : GEO_BY_LEVEL, GeoCheckboxGroup, useController inline, useWatch
//   - Section D : remplacée par <GeoSelector /> (composant autonome)
//   - defaultValues.contexte_geographique : nouvelle structure hiérarchique
//     { niveau_principal, zone_principale, sous_zones }
//   Sections A, B, C : identiques à l'ancienne version

import { useForm, useFieldArray, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonneesStade1Schema } from "@matura/shared";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import type { StadeData } from "@/hooks/useStades";
import { GeoSelector } from "@/components/geo/GeoSelector";
import type { ContexteGeographique } from "@/components/geo/GeoSelector";

interface Props {
  stade: StadeData;
  onSave: (d: Record<string, unknown>) => void;
  saving: boolean;
  readOnly?: boolean;
}

export function Stade1Form({ stade, onSave, saving, readOnly = false }: Props) {
  const donnees = stade.donnees as Record<string, unknown>;
  const geoExistant = (donnees.contexte_geographique ??
    {}) as Partial<ContexteGeographique>;

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(DonneesStade1Schema),
    defaultValues: {
      enonce_probleme: (donnees.enonce_probleme as string) ?? "",

      profil_affecte: {
        description:
          ((donnees.profil_affecte as Record<string, unknown>)
            ?.description as string) ?? "",
        urbanite:
          ((donnees.profil_affecte as Record<string, unknown>)
            ?.urbanite as string) ?? "URBAIN",
        nombre_estime:
          ((donnees.profil_affecte as Record<string, unknown>)
            ?.nombre_estime as number) ?? 0,
        frequence:
          ((donnees.profil_affecte as Record<string, unknown>)
            ?.frequence as string) ?? "MENSUEL",
      },

      intensite_probleme: {
        cout_actuel_ar:
          ((donnees.intensite_probleme as Record<string, unknown>)
            ?.cout_actuel_ar as number) ?? 0,
        unite:
          ((donnees.intensite_probleme as Record<string, unknown>)
            ?.unite as string) ?? "AR_PAR_MOIS",
        severite:
          ((donnees.intensite_probleme as Record<string, unknown>)
            ?.severite as number) ?? 3,
      },

      observations_terrain: {
        observe_directement:
          ((donnees.observations_terrain as Record<string, unknown>)
            ?.observe_directement as boolean) ?? false,
        nb_personnes_interrogees:
          ((donnees.observations_terrain as Record<string, unknown>)
            ?.nb_personnes_interrogees as number) ?? 0,
        methode:
          ((donnees.observations_terrain as Record<string, unknown>)
            ?.methode as string) ?? "EN_FACE",
        verbatims: ((donnees.observations_terrain as Record<string, unknown>)
          ?.verbatims as string[]) ?? ["", ""],
      },

      solutions_existantes: (donnees.solutions_existantes as {
        nom: string;
        type: string;
        pourquoi_insuffisante: string;
        satisfaction_utilisateur: number;
      }[]) ?? [
        {
          nom: "",
          type: "FORMELLE",
          pourquoi_insuffisante: "",
          satisfaction_utilisateur: 3,
        },
      ],

      // Nouvelle structure géo hiérarchique
      // Compatible avec les données existantes en base :
      //   - si zone_principale absent → fallback sur { code: '', nom: '' }
      //   - si sous_zones absent      → fallback sur { tout_selectionner: false, items: [] }
      contexte_geographique: {
        niveau_principal: (geoExistant.niveau_principal ??
          "REGION") as ContexteGeographique["niveau_principal"],
        zone_principale: geoExistant.zone_principale ?? { code: "", nom: "" },
        sous_zones: geoExistant.sous_zones ?? {
          tout_selectionner: false,
          items: [],
        },
      },
    },
  });

  const {
    fields: solFields,
    append: addSol,
    remove: remSol,
  } = useFieldArray({
    control,
    name: "solutions_existantes",
  });

  const onSubmit = (data: unknown) => onSave(data as Record<string, unknown>);

  // ── Styles (identiques à l'ancienne version) ─────────────────────────────
  const inputCls = "flat-input h-11 px-4 py-2.5 text-[13px] rounded-[16px]";
  const labelCls = "flat-label";
  const sectionCls = "flat-section";
  const selectCls = cn(inputCls, "appearance-none");
  const textareaCls = "flat-input min-h-[90px] px-4 py-2.5 text-[13px] rounded-[16px] resize-none";

  const getSectionLetterClass = (letter: string) => {
    const upper = letter.toUpperCase();
    const index = (upper.charCodeAt(0) - 65) % 6;
    const safeIndex = index >= 0 && index < 6 ? index : 0;
    const styles = [
      { bg: "bg-[#eafdf3]", text: "text-[#318055]" }, // A
      { bg: "bg-[#E2F7F6]", text: "text-[#0D7A75]" }, // B
      { bg: "bg-[#EBF5FC]", text: "text-[#1C5F8C]" }, // C
      { bg: "bg-[#eef0ff]", text: "text-[#3840C0]" }, // D
      { bg: "bg-[#fff8e8]", text: "text-[#c47d00]" }, // E
      { bg: "bg-[#f6f6f4]", text: "text-[#757575]" }, // F
    ];
    return styles[safeIndex];
  };

  const SectionHeader = ({
    letter,
    title,
  }: {
    letter: string;
    title: string;
  }) => {
    const sStyle = getSectionLetterClass(letter);
    return (
      <p className="text-[12px] font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
        <span className={cn("w-[22px] h-[22px] rounded-[6px] text-[11px] font-semibold flex items-center justify-center flex-shrink-0", sStyle.bg, sStyle.text)}>
          {letter}
        </span>
        {title}
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <fieldset disabled={readOnly} className="space-y-4 border-none p-0 m-0">
        {/* ── A — Définition du problème ─────────────────────────────────────── */}
        <div className={sectionCls}>
          <SectionHeader letter="A" title="Définition du problème" />

          <div>
            <label className={labelCls}>
              Quelle problème observez-vous sur le terrain ? * (20-200 car.)
            </label>
            <textarea
              {...register("enonce_probleme")}
              rows={3}
              className={textareaCls}
              placeholder="Décrivez le problème observé..."
            />
            {errors.enonce_probleme && (
              <p className="text-red-500 text-[11px] mt-1">{(errors.enonce_probleme as any).message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                Qui sont les personnes touchées par ce problème ? *
              </label>
              <input
                {...register("profil_affecte.description")}
                className={inputCls}
                placeholder="Agriculteurs de la région..."
              />
              {errors.profil_affecte?.description && (
                <p className="text-red-500 text-[11px] mt-1">{(errors.profil_affecte as any).description.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>Zone d'habitation</label>
              <select
                {...register("profil_affecte.urbanite")}
                className={selectCls}
              >
                <option value="URBAIN">Urbain</option>
                <option value="PERI_URBAIN">Péri-urbain</option>
                <option value="RURAL">Rural</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>
                À quelle fréquence ce problème survient-il ?
              </label>
              <select
                {...register("profil_affecte.frequence")}
                className={selectCls}
              >
                <option value="QUOTIDIEN">Quotidien</option>
                <option value="HEBDOMADAIRE">Hebdomadaire</option>
                <option value="MENSUEL">Mensuel</option>
                <option value="OCCASIONNEL">Occasionnel</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>
                Combien de personnes sont touchées ?
              </label>
              <input
                type="number"
                min={0}
                {...register("profil_affecte.nombre_estime", {
                  valueAsNumber: true,
                })}
                className={inputCls}
                placeholder="Estimation..."
              />
              {errors.profil_affecte?.nombre_estime && (
                <p className="text-red-500 text-[11px] mt-1">{(errors.profil_affecte as any).nombre_estime.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Coût actuel (Ar)</label>
              <input
                type="number"
                min={0}
                {...register("intensite_probleme.cout_actuel_ar", {
                  valueAsNumber: true,
                })}
                className={inputCls}
                placeholder="Coût..."
              />
            </div>
            <div>
              <label className={labelCls}>Unité</label>
              <select
                {...register("intensite_probleme.unite")}
                className={selectCls}
              >
                <option value="AR_PAR_MOIS">Ar/mois</option>
                <option value="HEURES_PAR_SEMAINE">Heures/sem.</option>
                <option value="AR_PAR_TRANSACTION">Ar/transaction</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>
                Gravité (1-5) : {watch("intensite_probleme.severite")}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                {...register("intensite_probleme.severite", {
                  valueAsNumber: true,
                })}
                className="w-full accent-green-600"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                1 = Peu grave, 5 = Très grave
              </p>
            </div>
          </div>
        </div>

        {/* ── B — Validation terrain ─────────────────────────────────────────── */}
        <div className={sectionCls}>
          <SectionHeader letter="B" title="Validation terrain" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                Combien de personnes avez-vous interrogées ? *
              </label>
              <input
                type="number"
                min={0}
                {...register("observations_terrain.nb_personnes_interrogees", {
                  valueAsNumber: true,
                })}
                className={inputCls}
                placeholder="Minimum 3..."
              />
              {errors.observations_terrain?.nb_personnes_interrogees && (
                <p className="text-red-500 text-[11px] mt-1">{(errors.observations_terrain as any).nb_personnes_interrogees.message}</p>
              )}
            </div>
            <div>
              <label className={labelCls}>
                Comment avez-vous collecté ces informations ?
              </label>
              <select
                {...register("observations_terrain.methode")}
                className={selectCls}
              >
                <option value="EN_FACE">En face à face</option>
                <option value="TELEPHONE">Téléphone</option>
                <option value="INFORMEL">Informel</option>
                <option value="OBSERVATION">Observation</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="obs"
              {...register("observations_terrain.observe_directement")}
              className="w-4 h-4 accent-green-600"
            />
            <label htmlFor="obs" className="text-[12px] text-zinc-600">
              J'ai observé le problème directement
            </label>
          </div>

          <div>
            <label className={labelCls}>
              Citations des personnes interrogées (min. 2, max. 5) *
            </label>
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <input
                  key={i}
                  {...register(`observations_terrain.verbatims.${i}`)}
                  className={inputCls}
                  placeholder={`Citation ${i + 1}...`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── C — Solutions existantes ───────────────────────────────────────── */}
        <div className={sectionCls}>
          <div className="flex items-center justify-between">
            <SectionHeader letter="C" title="Solutions existantes" />
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  addSol({
                    nom: "",
                    type: "FORMELLE",
                    pourquoi_insuffisante: "",
                    satisfaction_utilisateur: 3,
                  })
                }
                className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
          </div>

          {solFields.map((f, i) => (
            <div key={f.id} className="panel-soft rounded-[18px] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  Solution {i + 1}
                </span>
                {solFields.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => remSol(i)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register(`solutions_existantes.${i}.nom`)}
                  className={inputCls}
                  placeholder="Nom de la solution"
                />
                <select
                  {...register(`solutions_existantes.${i}.type`)}
                  className={selectCls}
                >
                  <option value="FORMELLE">Formelle</option>
                  <option value="INFORMELLE">Informelle</option>
                  <option value="BRICOLAGE">Bricolage</option>
                  <option value="RIEN">Rien</option>
                </select>
              </div>
              <input
                {...register(`solutions_existantes.${i}.pourquoi_insuffisante`)}
                className={inputCls}
                placeholder="Pourquoi cette solution ne résout-elle pas le problème ?"
              />
            </div>
          ))}
        </div>

        {/* ── D — Contexte géographique ──────────────────────────────────────── */}
        <div className={sectionCls}>
          <SectionHeader letter="D" title="Contexte géographique" />
          {/*
          GeoSelector gère en autonomie :
            - Sélecteur de niveau
            - Select zone principale → GET /api/geo/regions (via useRegions)
            - Checkboxes sous-zones  → GET /api/geo/enfants (via useEnfantsGeo)
          Il écrit dans RHF via useController sur 'contexte_geographique'.
        */}
          <GeoSelector
            control={control as Control<any>}
            name="contexte_geographique"
            labelCls={labelCls}
            inputCls={inputCls}
          />
        </div>
      </fieldset>

      {/* ── Enregistrer ────────────────────────────────────────────────────── */}
      {!readOnly && (
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 h-11 px-5 rounded-[999px] border border-[var(--color-success-border)] bg-[var(--color-success)] text-white text-[13px] font-semibold transition-[filter,transform] hover:brightness-[0.98] active:scale-[0.99] disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer le Stade 1
        </button>
      )}
    </form>
  );
}
