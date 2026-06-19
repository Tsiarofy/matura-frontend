// src/components/stades/Stade3Form.tsx
// Stade 3 — Validation Marché (B2C/B2B/B2B2C)
// Implémente le workflow de la donnée spec Section 2 :
//   - B2C : population via GeoService (INSTAT)
//   - B2B : saisie déclarative
//   - B2B2C : deux formulaires distincts avec conservation d'état
// Les 9 champs CalculsInformatifs sont construits et sauvegardés

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DonneesStade3Schema } from "@matura/shared";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Save, Loader2, MapPin } from "lucide-react";
import type { StadeData } from "@/hooks/useStades";
import { useRoleLabels } from "@/hooks/useRoleLabels";
import { LABELS_STADE3 } from "@/lib/labelsStades";
import {
  StepperProgressif,
  type Etape,
} from "@/components/ui/StepperProgressif";
import { AffichageCalculMarche } from "@/components/marche/AffichageCalculMarche";
import { useCalculMarche } from "@/hooks/useCalculMarche";

// console.log(Geo)

interface Props {
  stade: StadeData;
  onSave: (d: Record<string, unknown>) => void;
  saving: boolean;
  readOnly?: boolean;
  typeProjet?: "B2C" | "B2B" | "B2B2C";
  contexteGeographiqueStade1?: {
    niveau_principal: string;
    zone_principale: { code: string; nom: string };
    sous_zones?: {
      tout_selectionner: boolean;
      items: Array<{ code: string; nom: string }>;
    };
  };
  onUpdateZone?: (zone: unknown) => void;
}

type FormValues = {
  type_client: "B2C" | "B2B" | "B2B2C";
  pct_utilisateurs: number;
  zone_modifiee: boolean;
  contexte_geographique:
    | {
        niveau_principal: string;
        zone_principale: { code: string; nom: string };
        sous_zones?: {
          tout_selectionner: boolean;
          items: Array<{ code: string; nom: string }>;
        };
      }
    | undefined;
  enquete: {
    taille_echantillon: number;
    methode: string;
    taux_reponse_positive: number;
    wtp_moyen_ar: number;
  };
  concurrents: Array<{
    nom: string;
    type: string;
    part_globale_pct: number;
    part_zone_pct: number;
    prix_estime_ar: number;
    votre_differentiation: string;
  }>;
  taille_marche: { tam_valeur: number; sam_valeur: number; som_valeur: number };
  positionnement_prix: {
    prix_min_acceptable_ar: number;
    prix_max_acceptable_ar: number;
    prix_recommande_ar: number;
    modele_prix: string;
    irp: { revenu_moyen_zone_ar: number; frequence_achat: string };
  };
  sources_marche: Array<{
    type: string;
    titre: string;
    annee: number;
    url: string;
    donnee_utilisee: string;
  }>;
};

// Étapes du stepper (spec Section 5 — Stade 3)
const ETAPES_B2C: Etape[] = [
  { id: "zone_geographique", titre: "Zone ciblée", dependances: [] },
  {
    id: "type_client",
    titre: "Type client",
    dependances: ["zone_geographique"],
  },
  {
    id: "pct_utilisateurs",
    titre: "Utilisateurs",
    dependances: ["type_client"],
  },
  {
    id: "concurrents",
    titre: "Concurrents",
    dependances: ["pct_utilisateurs"],
  },
  { id: "tam", titre: "TAM", dependances: ["concurrents"] },
  { id: "sam", titre: "SAM", dependances: ["tam"] },
  { id: "som", titre: "SOM", dependances: ["sam"] },
];

// Styles partagés — cohérence avec les autres StadeXForm
const inp = "flat-input h-11 px-4 py-2.5 text-[13px] rounded-[16px]";
const sel = cn(inp, "appearance-none");
const sec = "flat-section";
const cardCls = "bg-zinc-50 rounded-lg p-3 space-y-2";

export function Stade3Form({
  stade,
  onSave,
  saving,
  readOnly = false,
  typeProjet = "B2C",
  contexteGeographiqueStade1,
  onUpdateZone: _onUpdateZone,
}: Props) {
  void _onUpdateZone;

  const { isEntrepreneur } = useRoleLabels();
  const d = stade.donnees as Record<string, unknown>;
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def;

  const getLabel = (key: keyof typeof LABELS_STADE3) =>
    isEntrepreneur
      ? LABELS_STADE3[key].entrepreneur
      : LABELS_STADE3[key].professionnel;

  // ── Stepper état ──────────────────────────────────────────────────────────
  const [etapeActive, setEtapeActive] = useState("zone_geographique");
  const [etapesCompletees, setEtapesCompletees] = useState<Set<string>>(() => {
    if (readOnly) return new Set(ETAPES_B2C.map((e) => e.id));
    return new Set();
  });
  const [alertesIgnoreesParFormulaire, setAlertesIgnoreesParFormulaire] =
    useState<{
      B2C: string[];
      B2B: string[];
    }>(() => {
      const calculs = stade.calculs_informatifs as unknown;
      const st3 =
        calculs &&
        typeof calculs === "object" &&
        "stade_3" in calculs &&
        typeof (calculs as { stade_3?: unknown }).stade_3 === "object"
          ? ((calculs as { stade_3?: unknown }).stade_3 as Record<
              string,
              unknown
            >)
          : undefined;

      const b2c =
        (st3?.b2c as Record<string, unknown> | undefined) ?? undefined;
      const b2b =
        (st3?.b2b as Record<string, unknown> | undefined) ?? undefined;

      const baseAlertesIgnorees =
        (st3?.alertes_ignorees as string[] | undefined) ?? [];
      return {
        B2C:
          (b2c?.alertes_ignorees as string[] | undefined) ??
          baseAlertesIgnorees,
        B2B: (b2b?.alertes_ignorees as string[] | undefined) ?? [],
      };
    });

  // ── B2B2C : conservation des données entre onglets ────────────────────────
  // On stocke les données de chaque formulaire dans des refs pour éviter
  // la perte lors du basculement d'onglet
  const [formulaireActifB2B2C, setFormulaireActifB2B2C] = useState<
    "B2C" | "B2B"
  >("B2C");
  const donneesB2CSauvegardees = useRef<Record<string, unknown> | null>(null);
  const donneesB2BSauvegardees = useRef<Record<string, unknown> | null>(null);

  // console.log('Rendu Stade3Form', { stade, contexteGeographiqueStade1 })

  // console.log(contexteGeographiqueStade1)

  // ── Formulaire principal ──────────────────────────────────────────────────
  const { register, control, handleSubmit, watch, getValues, reset, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(DonneesStade3Schema) as any,
      defaultValues: {
        type_client: typeProjet,
        pct_utilisateurs: g<number>("pct_utilisateurs", 0),
        zone_modifiee: g<boolean>("zone_modifiee", false),
        contexte_geographique:
          contexteGeographiqueStade1 ?? g("contexte_geographique", undefined),
        enquete: {
          taille_echantillon: 0,
          methode: "EN_FACE",
          taux_reponse_positive: 0,
          wtp_moyen_ar: 0,
          ...g<Record<string, unknown>>("enquete", {}),
        },
        concurrents: g<
          {
            nom: string;
            type: string;
            part_globale_pct: number;
            part_zone_pct: number;
            prix_estime_ar: number;
            votre_differentiation: string;
          }[]
        >("concurrents", [
          {
            nom: "",
            type: "DIRECT",
            part_globale_pct: 0,
            part_zone_pct: 0,
            prix_estime_ar: 0,
            votre_differentiation: "",
          },
        ]),
        taille_marche: {
          tam_valeur: 0,
          sam_valeur: 0,
          som_valeur: 0,
          ...g<Record<string, unknown>>("taille_marche", {}),
        },
        positionnement_prix: {
          prix_min_acceptable_ar: 0,
          prix_max_acceptable_ar: 0,
          prix_recommande_ar: 0,
          modele_prix: "UNITE",
          irp: { revenu_moyen_zone_ar: 0, frequence_achat: "MENSUEL" },
          ...g<Record<string, unknown>>("positionnement_prix", {}),
        },
        sources_marche: g<
          {
            type: string;
            titre: string;
            annee: number;
            url: string;
            donnee_utilisee: string;
          }[]
        >("sources_marche", [
          {
            type: "INSTAT",
            titre: "",
            annee: 2024,
            url: "",
            donnee_utilisee: "",
          },
        ]),
      },
    });

  const {
    fields: concFields,
    append: addConc,
    remove: remConc,
  } = useFieldArray({
    control,
    name: "concurrents",
  });
  const {
    fields: srcFields,
    append: addSrc,
    remove: remSrc,
  } = useFieldArray({
    control,
    name: "sources_marche",
  });

  // ── Valeurs surveillées pour calculs temps réel ───────────────────────────
  const pctUtilisateurs = watch("pct_utilisateurs");
  const concurrents = watch("concurrents");
  const tamValeur = watch("taille_marche.tam_valeur");
  const samValeur = watch("taille_marche.sam_valeur");
  const somValeur = watch("taille_marche.som_valeur");
  const contexteGeo = contexteGeographiqueStade1;
  // watch('contexte_geographique') as
  // ContexteGeographique | undefined

  const typeClientActif: "B2C" | "B2B" =
    typeProjet === "B2B"
      ? "B2B"
      : typeProjet === "B2B2C"
        ? formulaireActifB2B2C
        : "B2C";

  const alertesIgnoreesActives = alertesIgnoreesParFormulaire[typeClientActif];

  // ── Calcul de marché temps réel (latence 0ms côté client)

  // console.log(contexteGeo?.niveau_principal)
  // console.log(contexteGeo?.zone_principale)
  // console.log(contexteGeo?.zone_principale.code)
  // console.log(contexteGeo?.sous_zones)
  // // console.log(contexteGeo.)
  const calculMarcheQuery = useCalculMarche({
    typeClient: typeClientActif,
    codeZone: contexteGeo?.zone_principale?.code ?? "",
    niveauZone: contexteGeo?.niveau_principal ?? "",
    sousZone: contexteGeo?.sous_zones ?? {
      tout_selectionner: false,
      items: [],
    },
    pctUtilisateurs: pctUtilisateurs ?? 0,
    partsConcurrents: concurrents ?? [],
    tam_valeur: tamValeur ?? 0,
    sam_valeur: samValeur ?? 0,
    som_valeur: somValeur ?? 0,
  });

  // ── Stepper helpers ───────────────────────────────────────────────────────
  const markStepComplete = (stepId: string, nextStepId?: string) => {
    setEtapesCompletees((prev) => new Set([...prev, stepId]));
    if (nextStepId) setEtapeActive(nextStepId);
  };

  // Invalidation en cascade (spec Section 4.1)
  const handleEtapeReinitialisee = (etapesAInvalider: string[]) => {
    setEtapesCompletees((prev) => {
      const nouvellesCompletees = new Set(prev);
      etapesAInvalider.forEach((id) => nouvellesCompletees.delete(id));
      return nouvellesCompletees;
    });
  };

  const isStepAccessible = (stepId: string): boolean => {
    const currentIndex = ETAPES_B2C.findIndex((s) => s.id === etapeActive);
    const stepIndex = ETAPES_B2C.findIndex((s) => s.id === stepId);
    return stepIndex <= currentIndex || etapesCompletees.has(stepId);
  };

  // Overlay de blocage visuel (spec Section 4.1)
  const renderOverlay = (stepId: string) => {
    if (isStepAccessible(stepId)) return null;
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
        <span className="text-[11px] font-medium text-zinc-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-zinc-200">
          à remplir progressivement
        </span>
      </div>
    );
  };

  // ── B2B2C : basculement entre formulaires ─────────────────────────────────
  const handleTabChange = (nouveauFormulaire: "B2C" | "B2B") => {
    if (formulaireActifB2B2C === nouveauFormulaire) return;

    // Sauvegarder les données actuelles dans le ref correspondant
    const donnéesActuelles = getValues();
    if (formulaireActifB2B2C === "B2C") {
      donneesB2CSauvegardees.current = donnéesActuelles;
    } else {
      donneesB2BSauvegardees.current = donnéesActuelles;
    }

    // Restaurer les données de l'autre formulaire si disponibles
    const donneesAPrestorer =
      nouveauFormulaire === "B2C"
        ? donneesB2CSauvegardees.current
        : donneesB2BSauvegardees.current;

    if (donneesAPrestorer) {
      reset(donneesAPrestorer as Parameters<typeof reset>[0]);
    }

    setFormulaireActifB2B2C(nouveauFormulaire);
  };

  const construireCalculsStade3 = (
    typeClient: "B2C" | "B2B",
    data: FormValues,
  ) => {
    if (typeClient === "B2C" && calculMarcheQuery.data) {
      const c = calculMarcheQuery.data;
      return {
        base_totale: c.base_totale,
        source_base: c.source_base,
        occupee_concurrents: c.occupee_concurrents,
        disponible: c.disponible,
        sam_pct_totale: c.sam_pct_totale,
        sam_pct_disponible: c.sam_pct_disponible,
        som_pct_totale: c.som_pct_totale,
        som_pct_disponible: c.som_pct_disponible,
        alertes_ignorees: alertesIgnoreesParFormulaire.B2C,
        type_client: "B2C" as const,
        pct_utilisateurs: data.pct_utilisateurs,
        population_totale: c.population_totale,
        population_concernee: c.population_concernee,
        parts_concurrents_zone_pct: c.parts_concurrents_zone_pct,
        population_occupee_concurrents: c.population_occupee_concurrents,
        population_disponible: c.population_disponible,
        sam_pct_utilisateurs: c.sam_pct_utilisateurs,
        som_pct_utilisateurs: c.som_pct_utilisateurs,
        sam_saisi: data.taille_marche?.sam_valeur ?? 0,
        som_saisi: data.taille_marche?.som_valeur ?? 0,
        tam_saisi: c.base_totale,
        alertes: c.alertes,
      };
    }

    const tam = data.taille_marche?.tam_valeur ?? 0;
    const sam = data.taille_marche?.sam_valeur ?? 0;
    const som = data.taille_marche?.som_valeur ?? 0;
    return {
      base_totale: tam,
      source_base: "DECLARATIF" as const,
      occupee_concurrents: 0,
      disponible: tam,
      sam_pct_totale: tam > 0 ? (sam / tam) * 100 : 0,
      sam_pct_disponible: tam > 0 ? (sam / tam) * 100 : 0,
      som_pct_totale: tam > 0 ? (som / tam) * 100 : 0,
      som_pct_disponible: tam > 0 ? (som / tam) * 100 : 0,
      alertes_ignorees: alertesIgnoreesParFormulaire.B2B,
      type_client: "B2B" as const,
      tam_saisi: tam,
      sam_saisi: sam,
      som_saisi: som,
      alertes: [],
    };
  };

  // ── Construction des calculs_informatifs (spec Section 3.2) ──────────────
  const construireCalculsInformatifs = (data: FormValues) => {
    if (typeProjet !== "B2B2C") {
      return { stade_3: construireCalculsStade3(typeClientActif, data) };
    }

    const b2c = donneesB2CSauvegardees.current as FormValues | null;
    const b2b = donneesB2BSauvegardees.current as FormValues | null;
    const b2cCalculs = b2c ? construireCalculsStade3("B2C", b2c) : undefined;
    const b2bCalculs = b2b ? construireCalculsStade3("B2B", b2b) : undefined;

    return {
      stade_3: {
        // La "vue principale" reste l’onglet actif, mais on embarque les deux
        ...(construireCalculsStade3(typeClientActif, data) as Record<
          string,
          unknown
        >),
        type_client: "B2B2C" as const,
        ...(b2cCalculs ? { b2c: b2cCalculs } : {}),
        ...(b2bCalculs ? { b2b: b2bCalculs } : {}),
      },
    };
  };

  // ── Soumission ────────────────────────────────────────────────────────────
  const onSubmitHandler = (data: FormValues) => {
    // En B2B2C, on s’assure que les 2 formulaires sont sauvegardés en mémoire
    if (typeProjet === "B2B2C") {
      if (formulaireActifB2B2C === "B2C") donneesB2CSauvegardees.current = data;
      if (formulaireActifB2B2C === "B2B") donneesB2BSauvegardees.current = data;
    }

    const calculs_informatifs = construireCalculsInformatifs(data);

    if (typeProjet === "B2B2C") {
      onSave({
        ...data,
        calculs_informatifs,
        b2c_donnees: donneesB2CSauvegardees.current,
        b2b_donnees: donneesB2BSauvegardees.current,
      });
      return;
    }

    onSave({ ...data, calculs_informatifs });
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────
  const estB2C =
    typeProjet === "B2C" ||
    (typeProjet === "B2B2C" && formulaireActifB2B2C === "B2C");
  const estB2B =
    typeProjet === "B2B" ||
    (typeProjet === "B2B2C" && formulaireActifB2B2C === "B2B");

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      {/* ── Sélecteur B2B2C ──────────────────────────────────────────────── */}
      {typeProjet === "B2B2C" && (
        <div className="flex gap-2">
          {(["B2C", "B2B"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={cn(
                "flex-1 py-2 px-4 rounded-[18px] text-[12px] font-semibold transition-colors border",
                formulaireActifB2B2C === t
                  ? "bg-[var(--color-success)] text-white border-[var(--color-success-border)]"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
              )}
            >
              Formulaire {t}
            </button>
          ))}
        </div>
      )}

      <fieldset disabled={readOnly} className="space-y-4 border-none p-0 m-0">

        {/* ── Formulaire B2C ───────────────────────────────────────────────── */}
        {estB2C && (
          <>
            <StepperProgressif
              etapes={ETAPES_B2C}
              etapeActive={etapeActive}
              etapesCompletees={etapesCompletees}
              onEtapeChange={setEtapeActive}
              onEtapeReinitialisee={handleEtapeReinitialisee}
            />

            {/* Étape 1 : Zone géographique */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("zone_geographique") &&
                  "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("zone_geographique")}
              <p className="text-[12px] font-semibold text-[var(--color-text-secondary)] mb-2">
                {getLabel("zone_geographique")}
              </p>
              <div className="panel-soft rounded-[18px] p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <p className="text-[13px] text-[var(--color-text-primary)]">
                    {contexteGeo?.zone_principale?.nom || "Non défini"} (
                    {contexteGeo?.niveau_principal})
                  </p>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Zone héritée du Stade 1. Redéfinissez-la dans le Stade 1 si
                  nécessaire.
                </p>
              </div>
              {etapeActive === "zone_geographique" && (
                <button
                  type="button"
                  onClick={() =>
                    markStepComplete("zone_geographique", "type_client")
                  }
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Valider et continuer →
                </button>
              )}
            </div>

            {/* Étape 2 : Type client (hérité projet) */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("type_client") &&
                  "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("type_client")}
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                {getLabel("type_projet")}
              </p>
              <div className="bg-zinc-50 rounded-lg p-3 space-y-1">
                <p className="text-[13px] text-zinc-800 font-medium">
                  {typeClientActif}
                </p>
                <p className="text-[11px] text-zinc-400">
                  Défini lors de la création du projet. (B2B = déclaratif, B2C =
                  base INSTAT)
                </p>
              </div>
              {etapeActive === "type_client" && (
                <button
                  type="button"
                  onClick={() =>
                    markStepComplete("type_client", "pct_utilisateurs")
                  }
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Valider et continuer →
                </button>
              )}
            </div>

            {/* Étape 3 : Pourcentage utilisateurs */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("pct_utilisateurs") &&
                  "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("pct_utilisateurs")}
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                {getLabel("estimation_utilisateurs")}
              </p>
              <input
                type="number" min={0}
                {...register("pct_utilisateurs", {
                  valueAsNumber: true,
                  min: 0,
                  max: 100,
                })}
                className={inp}
                placeholder="Pourcentage de la population (0-100)"
              />
              {calculMarcheQuery.data && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mt-2">
                  <p className="text-[12px] text-indigo-700">
                    Population concernée ={" "}
                    <strong>
                      {new Intl.NumberFormat("fr-FR").format(
                        calculMarcheQuery.data.population_concernee,
                      )}
                    </strong>{" "}
                    personnes
                  </p>
                </div>
              )}
              {etapeActive === "pct_utilisateurs" && (
                <button
                  type="button"
                  onClick={() =>
                    markStepComplete("pct_utilisateurs", "concurrents")
                  }
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Valider et continuer →
                </button>
              )}
            </div>

            {/* Données de validation (hors stepper spec) */}
            <div className={sec}>
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                Enquêtes terrain
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1">
                    {getLabel("enquete_taille")}
                  </label>
                  <input
                    type="number" min={0}
                    {...register("enquete.taille_echantillon", {
                      valueAsNumber: true,
                    })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1">
                    {getLabel("enquete_methode")}
                  </label>
                  <select {...register("enquete.methode")} className={sel}>
                    <option value="EN_FACE">En face</option>
                    <option value="TELEPHONE">Téléphone</option>
                    <option value="EN_LIGNE">En ligne</option>
                    <option value="MIXTE">Mixte</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1">
                    {getLabel("enquete_taux_reponse")}
                  </label>
                  <input
                    type="number"
                    {...register("enquete.taux_reponse_positive", {
                      valueAsNumber: true,
                    })}
                    className={inp}
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1">
                    {getLabel("enquete_prix")}
                  </label>
                  <input
                    type="number" min={0}
                    {...register("enquete.wtp_moyen_ar", {
                      valueAsNumber: true,
                    })}
                    className={inp}
                  />
                </div>
              </div>
            </div>

            {/* Étape 4 : Concurrents */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("concurrents") &&
                  "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("concurrents")}
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-medium text-zinc-700">
                  {getLabel("concurrents")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    addConc({
                      nom: "",
                      type: "DIRECT",
                      part_globale_pct: 0,
                      part_zone_pct: 0,
                      prix_estime_ar: 0,
                      votre_differentiation: "",
                    })
                  }
                  className="flex items-center gap-1 text-[11px] text-green-600"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>
              {concFields.map((f, i) => (
                <div
                  key={f.id}
                  className={cn(cardCls, "mb-2")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      Concurrent {i + 1}
                    </span>
                    {concFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remConc(i)}
                        className="text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[4fr_2fr]">
                    <input
                      {...register(`concurrents.${i}.nom`)}
                      className={cn(inp, "w-full")}
                      placeholder={getLabel("concurrent_nom")}
                    />
                    <select
                      {...register(`concurrents.${i}.type`)}
                      className={cn(sel, "w-full")}
                    >
                      <option value="DIRECT">Direct</option>
                      <option value="INDIRECT">Indirect</option>
                      <option value="SUBSTITUT">Substitut</option>
                    </select>
                  </div>
                  <input
                    {...register(`concurrents.${i}.votre_differentiation`)}
                    className={inp}
                    placeholder={getLabel("concurrent_differentiation")}
                  />
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <input
                      type="number" min={0}
                      {...register(`concurrents.${i}.part_globale_pct`, {
                        valueAsNumber: true,
                      })}
                      className={inp}
                      placeholder="% global"
                    />
                    <input
                      type="number" min={0}
                      {...register(`concurrents.${i}.part_zone_pct`, {
                        valueAsNumber: true,
                      })}
                      className={inp}
                      placeholder="% zone"
                    />
                    <input
                      type="number" min={0}
                      {...register(`concurrents.${i}.prix_estime_ar`, {
                        valueAsNumber: true,
                      })}
                      className={inp}
                      placeholder="Prix (Ar)"
                    />
                  </div>
                </div>
              ))}
              {calculMarcheQuery.data &&
                calculMarcheQuery.data.parts_concurrents_zone_pct > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-[12px] text-orange-700">
                      {calculMarcheQuery.data.parts_concurrents_zone_pct.toFixed(
                        1,
                      )}
                      % du marché dans votre zone est occupé par vos concurrents
                    </p>
                  </div>
                )}
              {etapeActive === "concurrents" && (
                <button
                  type="button"
                  onClick={() => markStepComplete("concurrents", "tam")}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Valider et continuer →
                </button>
              )}
            </div>

            {/* Étape 5 : TAM */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("tam") && "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("tam")}
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                {getLabel("tam")}
              </p>
              {typeClientActif === "B2C" ? (
                <div className="bg-zinc-50 rounded-lg p-3 space-y-1">
                  <p className="text-[11px] text-zinc-400">
                    TAM auto (population INSTAT de la zone).
                  </p>
                  <p className="text-[16px] font-bold text-zinc-900">
                    {new Intl.NumberFormat("fr-FR").format(
                      calculMarcheQuery.data?.base_totale ?? 0,
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="number" min={0}
                    {...register("taille_marche.tam_valeur", {
                      valueAsNumber: true,
                    })}
                    className={inp}
                    placeholder="Nombre d'entreprises"
                  />
                  {errors.taille_marche?.tam_valeur && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.tam_valeur.message}</p>}
                  {errors.taille_marche?.message && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.message}</p>}
                </>
              )}

              {etapeActive === "tam" && (
                <button
                  type="button"
                  onClick={() => markStepComplete("tam", "sam")}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Valider et continuer →
                </button>
              )}
            </div>

            {/* Étape 6 : SAM */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("sam") && "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("sam")}
              <p className="text-[12px] font-medium text-zinc-700 mb-1">
                {getLabel("sam")}
              </p>
              <input
                type="number" min={0}
                {...register("taille_marche.sam_valeur", {
                  valueAsNumber: true,
                })}
                className={inp}
                placeholder="Nombre de personnes"
              />
              {errors.taille_marche?.sam_valeur && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.sam_valeur.message}</p>}
              {errors.taille_marche?.message && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.message}</p>}
              {calculMarcheQuery.data && (
                <div className="mt-2 text-[11px] text-zinc-600">
                  Le SAM représente{" "}
                  <strong>
                    {calculMarcheQuery.data.sam_pct_totale.toFixed(1)}%
                  </strong>{" "}
                  de la base totale, et{" "}
                  <strong>
                    {calculMarcheQuery.data.sam_pct_disponible.toFixed(1)}%
                  </strong>{" "}
                  du marché libre.
                </div>
              )}
              {etapeActive === "sam" && (
                <button
                  type="button"
                  onClick={() => markStepComplete("sam", "som")}
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
                >
                  Valider et continuer →
                </button>
              )}
            </div>

            {/* Étape 7 : SOM */}
            <div
              className={cn(
                sec,
                "relative",
                !isStepAccessible("som") && "opacity-50 pointer-events-none",
              )}
            >
              {renderOverlay("som")}
              <p className="text-[12px] font-medium text-zinc-700 mb-1">
                {getLabel("som")}
              </p>
              <input
                type="number" min={0}
                {...register("taille_marche.som_valeur", {
                  valueAsNumber: true,
                })}
                className={inp}
                placeholder="Nombre de personnes"
              />
              {errors.taille_marche?.som_valeur && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.som_valeur.message}</p>}
              {errors.taille_marche?.message && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.message}</p>}

              {/* Alertes de réalisme temps réel (spec Section 4.4) */}
              {calculMarcheQuery.data && (
                <div className="mt-4">
                  <AffichageCalculMarche
                    calculs={calculMarcheQuery.data}
                    typeClient={typeClientActif}
                    samSaisi={samValeur ?? 0}
                    somSaisi={somValeur ?? 0}
                  />
                  {calculMarcheQuery.data.alertes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-[11px] font-medium text-zinc-600">
                        Alertes (vous pouvez les ignorer)
                      </p>
                      {calculMarcheQuery.data.alertes.map((a) => {
                        const ignored = alertesIgnoreesActives.includes(a);
                        return (
                          <div
                            key={a}
                            className="flex items-start justify-between gap-3 bg-zinc-50 border border-zinc-200 rounded-lg p-2"
                          >
                            <p className="text-[11px] text-zinc-700 flex-1">
                              {a}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                setAlertesIgnoreesParFormulaire((prev) => {
                                  const cur = prev[typeClientActif];
                                  const next = ignored
                                    ? cur.filter((x) => x !== a)
                                    : [...cur, a];
                                  return { ...prev, [typeClientActif]: next };
                                })
                              }
                              className={cn(
                                "text-[10px] font-medium px-2 py-1 rounded border",
                                ignored
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300",
                              )}
                            >
                              {ignored ? "Ignorée" : "Ignorer"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Formulaire B2B ───────────────────────────────────────────────── */}
        {estB2B && (
          <>
            <div className={sec}>
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                {getLabel("tam")}
              </p>
              <input
                type="number" min={0}
                {...register("taille_marche.tam_valeur", {
                  valueAsNumber: true,
                })}
                className={inp}
                placeholder="Nombre d'entreprises"
              />
              {errors.taille_marche?.tam_valeur && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.tam_valeur.message}</p>}
              {errors.taille_marche?.message && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.message}</p>}
            </div>
            <div className={sec}>
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                {getLabel("sam")}
              </p>
              <input
                type="number" min={0}
                {...register("taille_marche.sam_valeur", {
                  valueAsNumber: true,
                })}
                className={inp}
                placeholder="Nombre d'entreprises"
              />
              {errors.taille_marche?.sam_valeur && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.sam_valeur.message}</p>}
              {errors.taille_marche?.message && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.message}</p>}
            </div>
            <div className={sec}>
              <p className="text-[12px] font-medium text-zinc-700 mb-2">
                {getLabel("som")}
              </p>
              <input
                type="number" min={0}
                {...register("taille_marche.som_valeur", {
                  valueAsNumber: true,
                })}
                className={inp}
                placeholder="Nombre d'entreprises"
              />
              {errors.taille_marche?.som_valeur && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.som_valeur.message}</p>}
              {errors.taille_marche?.message && <p className="text-red-500 text-[11px] mt-1">{errors.taille_marche.message}</p>}
            </div>
            <div className={sec}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-medium text-zinc-700">
                  {getLabel("concurrents")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    addConc({
                      nom: "",
                      type: "DIRECT",
                      part_globale_pct: 0,
                      part_zone_pct: 0,
                      prix_estime_ar: 0,
                      votre_differentiation: "",
                    })
                  }
                  className="flex items-center gap-1 text-[11px] text-green-600"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>
              {concFields.map((f, i) => (
                <div
                  key={f.id}
                  className={cn(cardCls, "mb-2")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      Concurrent {i + 1}
                    </span>
                    {concFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remConc(i)}
                        className="text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-[4fr_2fr]">
                    <input
                      {...register(`concurrents.${i}.nom`)}
                      className={cn(inp, "w-full")}
                      placeholder={getLabel("concurrent_nom")}
                    />
                    <select
                      {...register(`concurrents.${i}.type`)}
                      className={cn(sel, "w-full")}
                    >
                      <option value="DIRECT">Direct</option>
                      <option value="INDIRECT">Indirect</option>
                      <option value="SUBSTITUT">Substitut</option>
                    </select>
                  </div>
                  <input
                    {...register(`concurrents.${i}.votre_differentiation`)}
                    className={inp}
                    placeholder={getLabel("concurrent_differentiation")}
                  />
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <input
                      type="number" min={0}
                      {...register(`concurrents.${i}.part_globale_pct`, {
                        valueAsNumber: true,
                      })}
                      className={cn(inp, "flex-1")}
                      placeholder="% marché global"
                    />
                    <input
                      type="number" min={0}
                      {...register(`concurrents.${i}.prix_estime_ar`, {
                        valueAsNumber: true,
                      })}
                      className={cn(inp, "flex-1")}
                      placeholder="Prix estimé (Ar)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Positionnement prix + IRP (commun B2C étape 6 / B2B) ──────────── */}
        <div className={cn("space-y-4", "relative")}>
          <div className={sec}>
            <p className="text-[12px] font-semibold text-[var(--color-text-secondary)] mb-2">
              Positionnement prix & IRP
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">
                  Prix min (Ar)
                </label>
                <input
                  type="number" min={0}
                  {...register("positionnement_prix.prix_min_acceptable_ar", {
                    valueAsNumber: true,
                  })}
                  className={inp}
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">
                  Prix recommandé (Ar) *
                </label>
                <input
                  type="number" min={0}
                  {...register("positionnement_prix.prix_recommande_ar", {
                    valueAsNumber: true,
                  })}
                  className={inp}
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">
                  Prix max (Ar)
                </label>
                <input
                  type="number" min={0}
                  {...register("positionnement_prix.prix_max_acceptable_ar", {
                    valueAsNumber: true,
                  })}
                  className={inp}
                />
              </div>
            </div>
            <select
              {...register("positionnement_prix.modele_prix")}
              className={cn(sel, "mt-2")}
            >
              {[
                "UNITE",
                "ABONNEMENT_MENSUEL",
                "ABONNEMENT_ANNUEL",
                "COMMISSION_PCT",
                "PALIERS",
              ].map((m) => (
                <option key={m} value={m}>
                  {m.replace("_", " ")}
                </option>
              ))}
            </select>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2 mt-2">
              <p className="text-[11px] text-blue-700 font-medium">
                IRP — Indice de Réalisme Prix
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number" min={0}
                  {...register("positionnement_prix.irp.revenu_moyen_zone_ar", {
                    valueAsNumber: true,
                  })}
                  className={inp}
                  placeholder="Revenu moyen zone (Ar)"
                />
                <select
                  {...register("positionnement_prix.irp.frequence_achat")}
                  className={sel}
                >
                  <option value="UNIQUE">Unique</option>
                  <option value="MENSUEL">Mensuel</option>
                  <option value="HEBDOMADAIRE">Hebdomadaire</option>
                  <option value="QUOTIDIEN">Quotidien</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sources de données */}
          <div className={sec}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-zinc-700">
                Sources de données (min. 1) *
              </p>
              <button
                type="button"
                onClick={() =>
                  addSrc({
                    type: "INSTAT",
                    titre: "",
                    annee: 2024,
                    url: "",
                    donnee_utilisee: "",
                  })
                }
                className="flex items-center gap-1 text-[11px] text-green-600"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter
              </button>
            </div>
            {srcFields.map((f, i) => (
              <div key={f.id} className={cn(cardCls, "mb-2")}>
                <input
                  {...register(`sources_marche.${i}.titre`)}
                  className={cn(inp, "w-full")}
                  placeholder="Titre de la source"
                />
                <div className="flex gap-2 items-center">
                  <select
                    {...register(`sources_marche.${i}.type`)}
                    className={cn(sel, "flex-1")}
                  >
                    {[
                      "INSTAT",
                      "EDBM",
                      "GEM",
                      "HABAKA",
                      "BANQUE_MONDIALE",
                      "UPLOAD",
                      "EXTERNE",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number" min={0}
                    {...register(`sources_marche.${i}.annee`, {
                      valueAsNumber: true,
                    })}
                    className={cn(inp, "flex-1")}
                    placeholder="Année"
                  />
                  {srcFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remSrc(i)}
                      className="text-red-400 px-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
          Enregistrer le Stade 3
        </button>
      )}
    </form>
  );
}
