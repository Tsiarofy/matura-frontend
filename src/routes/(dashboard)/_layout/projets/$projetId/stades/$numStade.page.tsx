import {
  useParams,
  Link,
  useNavigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import {
  useStade,
  useEnregistrerStade,
  useSoumettre,
  useStadeGate,
  useProjetDetail,
} from "@/hooks/useStades";
import { toast } from "sonner";
import { StadeTemplate } from "@/components/projet/StadeTemplate";
import { authStore } from "@/stores/authStore";
import { Loader2, AlertCircle, ChevronLeft, GraduationCap } from "lucide-react";
import { STADE_LABELS_COMPLETS } from "@/lib/constants";
import { Stade1Form } from "@/components/stades/Stade1Form";
import { Stade2Form } from "@/components/stades/Stade2Form";
import { Stade3Form } from "@/components/stades/Stade3Form";
import { Stade4Form } from "@/components/stades/Stade4Form";
import { Stade5Form } from "@/components/stades/Stade5Form";
import { Stade6Form } from "@/components/stades/Stade6Form";
import { Stade7Form } from "@/components/stades/Stade7Form";
import { MetriquesStade } from "@/components/stades/MetriquesStade";
import { EvaluationStade } from "@/components/stades/EvaluationStade";
import { AffichageCalculsInformatifs } from "@/components/stades/AffichageCalculsInformatifs";
import { GatePanel } from "@/components/stades/GatePanel";
import type { StadeData } from "@/hooks/useStades";
import { AideStade1 } from "@/components/stades/AideStade1";
import { AideStade2 } from "@/components/stades/AideStade2";
import { AideStade3 } from "@/components/stades/AideStade3";
import { AideStade4 } from "@/components/stades/AideStade4";
import { AideStade5 } from "@/components/stades/AideStade5";
import { AideStade6 } from "@/components/stades/AideStade6";
import { AideStade7 } from "@/components/stades/AideStade7";
import { MissionsStade } from "@/components/stades/MissionsStade";
import { BoutonContacter } from "@/components/reunions/BoutonContacter";

// Map des composants d'aide
const AIDES: Record<number, React.ReactNode> = {
  1: <AideStade1 />,
  2: <AideStade2 />,
  3: <AideStade3 />,
  4: <AideStade4 />,
  5: <AideStade5 />,
  6: <AideStade6 />,
  7: <AideStade7 />,
};

// Dans le rendu StadeTemplate, remplacer :
// aide: numStade === 1 ? <AideStade1 /> : undefined,
// par :
// aide: AIDES[numStade]
// ─── FORMULAIRE PAR STADE ─────────────────────────────────────────────────────

const FORMS: Record<
  number,
  React.ComponentType<{
    stade: StadeData;
    onSave: (d: Record<string, unknown>) => void;
    saving: boolean;
    readOnly?: boolean;
  }>
> = {
  1: Stade1Form,
  2: Stade2Form,
  3: Stade3Form,
  4: Stade4Form,
  5: Stade5Form,
  6: Stade6Form,
  7: Stade7Form,
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function StadeNumPage() {
  const { projetId, numStade: numStr } = useParams({
    from: "/(dashboard)/_layout/projets/$projetId/stades/$numStade",
  });
  const numStade = parseInt(numStr, 10);
  const user = authStore((state) => state.utilisateur);

  const { data: stade, isLoading, isError } = useStade(projetId, numStade);
  const { data: stade1 } = useStade(projetId, 1);
  const { data: gate } = useStadeGate(projetId, numStade);
  const { data: projet } = useProjetDetail(projetId);
  const enregistrer = useEnregistrerStade(projetId, numStade);
  const soumettre = useSoumettre(projetId, numStade);
  const navigate = useNavigate();
  const location = useLocation();

  // Si on est sur une sous-route (ex: definir-missions), on rend l'Outlet
  // au lieu du contenu principal du stade.
  const isExactStade =
    location.pathname.endsWith(`/stades/${numStr}`) ||
    location.pathname.endsWith(`/stades/${numStr}/`);

  if (!isExactStade) {
    return <Outlet />;
  }

  // console.log("- - - - stade1- - - - - - ")
  // console.log(stade1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-green-600" />
      </div>
    );
  }

  if (isError || !stade) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-[13px] text-zinc-500">
          Stade introuvable ou accès refusé.
        </p>
      </div>
    );
  }

  const FormComponent = FORMS[numStade];
  const titre = STADE_LABELS_COMPLETS[numStade] ?? `Stade ${numStade}`;
  const isMentor = user?.role === "MENTOR" && projet?.mentor?.id === user?.id;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2">
        <Link
          to="/projets/$projetId"
          params={{ projetId }}
          className="flex items-center gap-1 text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Retour au projet
        </Link>
        <span className="text-[var(--color-text-disabled)] text-[12px]">/</span>
        <span className="text-[12px] text-[var(--color-text-secondary)] font-semibold">
          {titre}
        </span>
      </div>

      {/* Bouton formations filtrées — affiché si le projet a un type_cible */}
      {projet && !isMentor && (
        <div className="flex justify-end">
          <Link
            to="/formations"
            search={{
              stade_cible: numStade,
              ...(projet.type_cible && {
                type_cible: projet.type_cible as "B2C" | "B2B" | "B2B2C",
              }),
            }}
            className="flat-action"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Formations pour ce stade
          </Link>
        </div>
      )}

      {/* En-tête stade */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[20px] font-semibold text-[var(--color-text-primary)]">
            {titre}
          </h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
            Version {stade.version} · {stade.completion_pct}% complété
          </p>
        </div>
      </div>

      {/* Gate panel (conditions) */}
      {gate && !isMentor && (
        <div className="w-full max-w-3xl mb-4 mt-6">
          <GatePanel
            gate={gate}
            statut={stade.statut}
            onSoumettre={() => {
              if (projet && !projet.mentor) {
                toast.error("Veuillez d'abord choisir un mentor", {
                  description: "Un mentor est requis pour évaluer vos stades.",
                });
                navigate({ to: "/mentors" });
                return;
              }
              soumettre.mutate();
            }}
            submitting={soumettre.isPending}
          />
        </div>
      )}

      {/* Template 4 onglets */}
      <StadeTemplate
        stade={
          {
            ...stade,
            // messages_coherence requis par StadeDetail — on fournit un tableau vide si absent
            messages_coherence: stade.messages_coherence ?? [],
          } as import("@matura/shared").StadeDetail
        }
        ongletsContent={{
          missions: (
            <MissionsStade
              stadeId={stade.id}
              projetId={projetId}
              numStade={numStade}
              isMentor={isMentor}
            />
          ),
          saisie: FormComponent ? (
            numStade === 3 ? (
              <Stade3Form
                stade={stade}
                saving={enregistrer.isPending}
                typeProjet={
                  (projet?.type_cible as "B2C" | "B2B" | "B2B2C") ?? "B2C"
                }
                contexteGeographiqueStade1={
                  ((stade1?.donnees?.contexte_geographique ??
                    (stade1?.donnees?.bloc_marche as any)?.contexte_geographique) as {
                    niveau_principal: string;
                    zone_principale: { code: string; nom: string };
                    sous_zones?: {
                      tout_selectionner: boolean;
                      items: Array<{ code: string; nom: string }>;
                    };
                  }) ?? undefined
                }
                onSave={(donnees) => enregistrer.mutate(donnees)}
                readOnly={isMentor}
              />
            ) : (
              <FormComponent
                stade={stade}
                onSave={(donnees) => enregistrer.mutate(donnees)}
                saving={enregistrer.isPending}
                readOnly={isMentor}
              />
            )
          ) : (
            <p className="text-zinc-500 text-[13px]">
              Formulaire non disponible
            </p>
          ),
          aide: AIDES[numStade],
          metriques: (
            <div>
              <AffichageCalculsInformatifs
                numStade={numStade}
                calculs={stade.calculs_informatifs}
                role={user?.role as "MENTOR" | "INVESTISSEUR" | "ENTREPRENEUR"}
              />
              <MetriquesStade metriques={stade.metriques} numStade={numStade} />
            </div>
          ),
          evaluation: (
            <EvaluationStade
              stade={stade}
              projetId={projetId}
              numStade={numStade}
            />
          ),
          reunion: (projet?.mentor && !isMentor) ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <h3 className="text-lg font-semibold text-zinc-800">Organiser une réunion avec votre mentor</h3>
              <p className="text-sm text-zinc-500 mb-4">Vous pouvez planifier un appel ou démarrer un appel instantané pour discuter de l'avancement de ce stade.</p>
              <BoutonContacter participantId={projet.mentor.id} projetId={projetId} type="SUIVI" />
            </div>
          ) : (projet && isMentor && projet.utilisateur_id) ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <h3 className="text-lg font-semibold text-zinc-800">Organiser une réunion avec l'entrepreneur</h3>
              <p className="text-sm text-zinc-500 mb-4">Vous pouvez planifier un appel ou démarrer un appel instantané pour discuter de l'avancement de ce stade.</p>
              <BoutonContacter participantId={projet.utilisateur_id} projetId={projetId} type="SUIVI" />
            </div>
          ) : undefined,
        }}
      />
    </div>
  );
}
