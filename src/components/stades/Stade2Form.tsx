import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonneesStade2Schema } from "@matura/shared";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import type { StadeData } from "@/hooks/useStades";
import { useRoleLabels } from "@/hooks/useRoleLabels";
import { LABELS_STADE2 } from "@/lib/labelsStades";
import {
  StepperProgressif,
  type Etape,
} from "@/components/ui/StepperProgressif";
import { useState } from "react";

interface Props {
  stade: StadeData;
  onSave: (d: Record<string, unknown>) => void;
  saving: boolean;
  readOnly?: boolean;
}

// Mapping des 9 étapes Stade 2 avec leurs dépendances (spec Section 5)
const ETAPES_STADE2: Etape[] = [
  { id: "probleme", titre: "Problème", dependances: [] },
  { id: "segments", titre: "Segments", dependances: ["probleme"] },
  { id: "solution", titre: "Solution", dependances: ["segments"] },
  { id: "proposition", titre: "Proposition", dependances: ["solution"] },
  { id: "canaux", titre: "Canaux", dependances: ["proposition"] },
  { id: "revenus", titre: "Revenus", dependances: ["canaux"] },
  { id: "couts", titre: "Coûts", dependances: ["revenus"] },
  { id: "avantage", titre: "Avantage", dependances: ["couts"] },
  {
    id: "indicateurs",
    titre: "Indicateurs",
    dependances: [
      "probleme",
      "segments",
      "solution",
      "proposition",
      "canaux",
      "revenus",
      "couts",
      "avantage",
    ],
  },
];

const SectionWrapper = ({
  etapeId,
  children,
  readOnly,
  etapeActive,
  isLocked,
  markComplete,
}: {
  etapeId: string;
  children: React.ReactNode;
  readOnly?: boolean;
  etapeActive: string;
  isLocked: (id: string) => boolean;
  markComplete: (id: string, next?: string) => void;
}) => {
  const locked = !readOnly && isLocked(etapeId);
  const active = etapeActive === etapeId;
  return (
    <div
      className={cn(
        "relative flat-section transition-all",
        locked && "opacity-40 pointer-events-none select-none",
      )}
    >
      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <span className="text-[11px] font-medium text-zinc-500 bg-white px-3 py-1.5 rounded-full shadow border border-zinc-200">
            à remplir progressivement
          </span>
        </div>
      )}
      <div className={cn(locked && "blur-[1px]")}>{children}</div>
      {active && !locked && !readOnly && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              const idx = ETAPES_STADE2.findIndex((e) => e.id === etapeId);
              const next = ETAPES_STADE2[idx + 1]?.id;
              markComplete(etapeId, next);
            }}
            className="inline-flex items-center justify-center rounded-[999px] border border-[var(--color-success-border)] bg-[var(--color-success)] px-4 py-2 text-[12px] font-semibold text-white transition-[filter,transform] hover:brightness-[0.98] active:scale-[0.99]"
          >
            Valider et continuer →
          </button>
        </div>
      )}
    </div>
  );
};

export function Stade2Form({ stade, onSave, saving, readOnly = false }: Props) {
  const { isEntrepreneur } = useRoleLabels();
  const d = stade.donnees as Record<string, unknown>;
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def;

  const [etapeActive, setEtapeActive] = useState("probleme");
  const [etapesCompletees, setEtapesCompletees] = useState<Set<string>>(() => {
    if (readOnly) return new Set(ETAPES_STADE2.map((e) => e.id));
    return new Set();
  });

  const getLabel = (key: keyof typeof LABELS_STADE2) =>
    isEntrepreneur
      ? LABELS_STADE2[key].entrepreneur
      : LABELS_STADE2[key].professionnel;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DonneesStade2Schema),
    defaultValues: {
      bloc_probleme: {
        herite_stade1: g<string>("bloc_probleme.herite_stade1", ""),
      },
      bloc_segments_clients: {
        principal: g<string>("bloc_segments_clients.principal", ""),
        secondaire: g<string>("bloc_segments_clients.secondaire", ""),
        premiers_adoptants: g<string>(
          "bloc_segments_clients.premiers_adoptants",
          "",
        ),
      },
      bloc_solution: {
        fonctionnalites: g<any[]>("bloc_solution.fonctionnalites", [
          {
            description: "",
            priorite: "INDISPENSABLE",
            resout_probleme_principal: true,
          },
        ]),
      },
      bloc_proposition_valeur: {
        phrase_principale: g<string>(
          "bloc_proposition_valeur.phrase_principale",
          "",
        ),
        slogan: g<string>("bloc_proposition_valeur.slogan", ""),
      },
      bloc_canaux: g<any[]>("bloc_canaux", [
        { canal: "", phase: "ACQUISITION", cout: "GRATUIT" },
      ]),
      bloc_avantage_unique: {
        description: g<string>("bloc_avantage_unique.description", ""),
        type: g<"SAVOIR_LOCAL" | "RESEAU" | "EXPERTISE" | "TECHNOLOGIE" | "REGLEMENTAIRE" | "AUTRE">("bloc_avantage_unique.type", "SAVOIR_LOCAL"),
      },
      bloc_sources_revenus: g<any[]>("bloc_sources_revenus", [
        {
          modele: "ABONNEMENT",
          description: "",
          estimation_mensuelle_ar: 0,
          confiance: "MOYENNE",
        },
      ]),
      bloc_structure_couts: g<any[]>("bloc_structure_couts", [
        {
          categorie: "PERSONNEL",
          libelle: "",
          montant_mensuel_ar: 0,
          est_fixe: true,
        },
      ]),
      bloc_indicateurs_cles: g<any[]>("bloc_indicateurs_cles", [
        { indicateur: "", valeur_cible: 0, unite: "", echeance_mois: 6 },
      ]),
    },
  });

  const {
    fields: fonctFields,
    append: addFonct,
    remove: remFonct,
  } = useFieldArray({ control, name: "bloc_solution.fonctionnalites" });
  const {
    fields: canauxFields,
    append: addCanal,
    remove: remCanal,
  } = useFieldArray({ control, name: "bloc_canaux" });
  const {
    fields: revFields,
    append: addRev,
    remove: remRev,
  } = useFieldArray({ control, name: "bloc_sources_revenus" });
  const {
    fields: coutFields,
    append: addCout,
    remove: remCout,
  } = useFieldArray({ control, name: "bloc_structure_couts" });
  const {
    fields: indicFields,
    append: addIndic,
    remove: remIndic,
  } = useFieldArray({
    control,
    name: "bloc_indicateurs_cles",
  });

  const inp = "flat-input h-11 px-4 py-2.5 text-[13px] rounded-[16px]";
  const sel = cn(inp, "appearance-none");
  const textareaCls =
    "flat-input min-h-[90px] px-4 py-2.5 text-[13px] rounded-[16px] resize-none";
  const cardCls = "bg-zinc-50 rounded-lg p-3 space-y-2 mb-2";

  const markComplete = (id: string, next?: string) => {
    setEtapesCompletees((prev) => new Set([...prev, id]));
    if (next) setEtapeActive(next);
  };

  const isLocked = (etapeId: string) => {
    const etape = ETAPES_STADE2.find((e) => e.id === etapeId);
    if (!etape) return true;
    return (
      !etape.dependances.every((d) => etapesCompletees.has(d)) &&
      etapeId !== "probleme"
    );
  };

  return (
    <form
      onSubmit={handleSubmit((d) => onSave(d as Record<string, unknown>))}
      className="space-y-4"
    >
      {/* Stepper */}
      <StepperProgressif
        etapes={ETAPES_STADE2}
        etapeActive={etapeActive}
        etapesCompletees={etapesCompletees}
        onEtapeChange={setEtapeActive}
      />

      <fieldset disabled={readOnly} className="space-y-4 border-none p-0 m-0">
        {/* Section 1 — Problème */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="probleme"
        >
          <p className="text-[12px] font-medium text-zinc-700 mb-2">
            {getLabel("bloc_probleme")}
          </p>
          <input
            {...register("bloc_probleme.herite_stade1")}
            className={cn(
              inp,
              errors.bloc_probleme?.herite_stade1 && "border-red-500",
            )}
            placeholder="Décrivez le problème principal hérité du Stade 1..."
          />
          {errors.bloc_probleme?.herite_stade1 && (
            <p className="text-red-500 text-[11px] mt-1">
              {(errors.bloc_probleme.herite_stade1 as any).message}
            </p>
          )}
        </SectionWrapper>

        {/* Section 2 — Segments clients */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="segments"
        >
          <p className="text-[12px] font-medium text-zinc-700 mb-2">
            {getLabel("segment_principal")}
          </p>
          <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">
                {getLabel("segment_principal")} *
              </label>
              <input
                {...register("bloc_segments_clients.principal")}
                className={cn(
                  inp,
                  errors.bloc_segments_clients?.principal && "border-red-500",
                )}
              />
              {errors.bloc_segments_clients?.principal && (
                <p className="text-red-500 text-[11px] mt-1">
                  {(errors.bloc_segments_clients.principal as any).message}
                </p>
              )}
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">
                {getLabel("autres_segments")}
              </label>
              <input
                {...register("bloc_segments_clients.secondaire")}
                className={inp}
                placeholder="Segment secondaire"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 block mb-1">
                Premiers adoptants
              </label>
              <input
                {...register("bloc_segments_clients.premiers_adoptants")}
                className={inp}
                placeholder="Décrivez les premiers utilisateurs visés"
              />
            </div>
          </div>
        </SectionWrapper>

        {/* Section 3 — Solution */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="solution"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-zinc-700">
              {getLabel("solution")}
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  addFonct({
                    description: "",
                    priorite: "INDISPENSABLE",
                    resout_probleme_principal: false,
                  })
                }
                className="flex items-center gap-1 text-[11px] text-green-600"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
          </div>
          {fonctFields.map((f, i) => (
            <div key={f.id} className={cardCls}>
              <input
                {...register(`bloc_solution.fonctionnalites.${i}.description`)}
                className={cn(inp, "w-full")}
                placeholder="Décrivez clairement la fonctionnalité principale..."
              />
              <div className="flex gap-2 items-center">
                <select
                  {...register(`bloc_solution.fonctionnalites.${i}.priorite`)}
                  className={cn(sel, "flex-1")}
                >
                  <option value="INDISPENSABLE">Must-have</option>
                  <option value="NICE_TO_HAVE">Nice-to-have</option>
                </select>
                {fonctFields.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => remFonct(i)}
                    className="text-red-400 px-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </SectionWrapper>

        {/* Section 4 — Proposition de valeur */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="proposition"
        >
          <p className="text-[12px] font-medium text-zinc-700 mb-2">
            {getLabel("proposition_valeur")}
          </p>
          <input
            {...register("bloc_proposition_valeur.phrase_principale")}
            className={cn(
              inp,
              errors.bloc_proposition_valeur?.phrase_principale &&
                "border-red-500",
            )}
            maxLength={80}
            placeholder="Proposition de valeur unique (max 80 car.)"
          />
          {errors.bloc_proposition_valeur?.phrase_principale && (
            <p className="text-red-500 text-[11px] mt-1">
              {
                (errors.bloc_proposition_valeur.phrase_principale as any)
                  .message
              }
            </p>
          )}
          <input
            {...register("bloc_proposition_valeur.slogan")}
            className={cn(inp, "mt-2")}
            placeholder="Slogan (optionnel)"
          />
        </SectionWrapper>

        {/* Section 5 — Canaux */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="canaux"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-zinc-700">
              {getLabel("canaux")}
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  addCanal({ canal: "", phase: "ACQUISITION", cout: "GRATUIT" })
                }
                className="flex items-center gap-1 text-[11px] text-green-600"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
          </div>
          {canauxFields.map((f, i) => (
            <div key={f.id} className={cardCls}>
              <input
                {...register(`bloc_canaux.${i}.canal`)}
                className={cn(inp, "w-full")}
                placeholder="Canal principal ou partenaire de distribution"
              />
              <div className="flex gap-2 items-center">
                <select
                  {...register(`bloc_canaux.${i}.phase`)}
                  className={cn(sel, "flex-1")}
                >
                  <option value="NOTORIETE">Notoriété</option>
                  <option value="ACQUISITION">Acquisition</option>
                  <option value="RETENTION">Rétention</option>
                </select>
                <select
                  {...register(`bloc_canaux.${i}.cout`)}
                  className={cn(sel, "flex-1")}
                >
                  <option value="GRATUIT">Gratuit</option>
                  <option value="FAIBLE">Faible</option>
                  <option value="MOYEN">Moyen</option>
                  <option value="ELEVE">Élevé</option>
                </select>
                {canauxFields.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => remCanal(i)}
                    className="text-red-400 px-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </SectionWrapper>

        {/* Section 6 — Sources de revenus */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="revenus"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-zinc-700">
              {getLabel("sources_revenus")}
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  addRev({
                    modele: "ABONNEMENT",
                    description: "",
                    estimation_mensuelle_ar: 0,
                    confiance: "MOYENNE",
                  })
                }
                className="flex items-center gap-1 text-[11px] text-green-600"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
          </div>
          {revFields.map((f, i) => (
            <div
              key={f.id}
              className="bg-zinc-50 rounded-lg p-3 space-y-2 mb-2"
            >
              <input
                {...register(`bloc_sources_revenus.${i}.description`)}
                className={inp}
                placeholder="Description"
              />
              <div className="flex gap-2 items-center">
                <select
                  {...register(`bloc_sources_revenus.${i}.modele`)}
                  className={cn(sel, "flex-1")}
                >
                  {[
                    "ABONNEMENT",
                    "ACHAT_UNIQUE",
                    "COMMISSION",
                    "FREEMIUM",
                    "B2B_CONTRACT",
                    "SUBVENTION",
                    "AUTRE",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  {...register(
                    `bloc_sources_revenus.${i}.estimation_mensuelle_ar`,
                    { valueAsNumber: true },
                  )}
                  className={cn(inp, "w-28")}
                  placeholder="Ar/mois"
                />
                <select
                  {...register(`bloc_sources_revenus.${i}.confiance`)}
                  className={cn(sel, "w-24")}
                >
                  <option value="FAIBLE">Faible</option>
                  <option value="MOYENNE">Moyenne</option>
                  <option value="ELEVEE">Élevée</option>
                </select>
                {revFields.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => remRev(i)}
                    className="text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </SectionWrapper>

        {/* Section 7 — Structure de coûts */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="couts"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-zinc-700">
              {getLabel("structure_couts")}
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  addCout({
                    categorie: "PERSONNEL",
                    libelle: "",
                    montant_mensuel_ar: 0,
                    est_fixe: true,
                  })
                }
                className="flex items-center gap-1 text-[11px] text-green-600"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
          </div>
          {coutFields.map((f, i) => (
            <div key={f.id} className={cardCls}>
              <input
                {...register(`bloc_structure_couts.${i}.libelle`)}
                className={cn(inp, "w-full")}
                placeholder="Libellé du coût"
              />
              <div className="flex gap-2 items-center">
                <select
                  {...register(`bloc_structure_couts.${i}.categorie`)}
                  className={cn(sel, "flex-1")}
                >
                  {[
                    "PERSONNEL",
                    "TECH",
                    "MARKETING",
                    "LOGISTIQUE",
                    "LOYER",
                    "AUTRE",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  {...register(`bloc_structure_couts.${i}.montant_mensuel_ar`, {
                    valueAsNumber: true,
                  })}
                  className={cn(inp, "flex-1")}
                  placeholder="Ar/mois"
                />
                {coutFields.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => remCout(i)}
                    className="text-red-400 px-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </SectionWrapper>

        {/* Section 8 — Avantage unique */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="avantage"
        >
          <p className="text-[12px] font-medium text-zinc-700 mb-2">
            {getLabel("avantage_unique")}
          </p>
          <textarea
            {...register("bloc_avantage_unique.description")}
            rows={3}
            className={textareaCls}
            placeholder="Ce qui vous rend difficile à copier..."
          />
          <select
            {...register("bloc_avantage_unique.type")}
            className={cn(sel, "mt-2")}
          >
            {[
              "SAVOIR_LOCAL",
              "BREVET",
              "RESEAU",
              "TECHNOLOGIE",
              "MARQUE",
              "AUTRE",
            ].map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </SectionWrapper>

        {/* Section 9 — Indicateurs clés */}
        <SectionWrapper
          readOnly={readOnly}
          etapeActive={etapeActive}
          isLocked={isLocked}
          markComplete={markComplete}
          etapeId="indicateurs"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-medium text-zinc-700">
              {getLabel("indicateurs_cles")}
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  addIndic({
                    indicateur: "",
                    valeur_cible: 0,
                    unite: "",
                    echeance_mois: 6,
                  })
                }
                className="flex items-center gap-1 text-[11px] text-green-600"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            )}
          </div>
          {indicFields.map((f, i) => (
            <div
              key={f.id}
              className="bg-zinc-50 rounded-lg p-3 space-y-2 mb-2"
            >
              <input
                {...register(`bloc_indicateurs_cles.${i}.indicateur`)}
                className={inp}
                placeholder="Indicateur"
              />
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  {...register(`bloc_indicateurs_cles.${i}.valeur_cible`, {
                    valueAsNumber: true,
                  })}
                  className={cn(inp, "flex-1")}
                  placeholder="Cible"
                />
                <input
                  type="number"
                  min={0}
                  {...register(`bloc_indicateurs_cles.${i}.echeance_mois`, {
                    valueAsNumber: true,
                  })}
                  className={cn(inp, "flex-1")}
                  placeholder="Échéance (mois)"
                />
                {indicFields.length > 1 && !readOnly && (
                  <button
                    type="button"
                    onClick={() => remIndic(i)}
                    className="text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </SectionWrapper>
      </fieldset>

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
          Enregistrer le Stade 2
        </button>
      )}
    </form>
  );
}
