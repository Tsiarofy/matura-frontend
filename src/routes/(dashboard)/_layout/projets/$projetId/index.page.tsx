import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { useProjetDetail } from "@/hooks/useStades";
import { BRLBadge } from "@/components/shared/BRLBadge";
import { StatutBadge } from "@/components/shared/StatutBadge";
import { StadeStepperH } from "@/components/shared/StadeStepperH";
import { cn } from "@/lib/utils";
import { STADE_LABELS } from "@/lib/constants";
import { authStore } from "@/stores/authStore";
import {
  CheckCircle2,
  Lock,
  ChevronRight, //MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  Star,
  Briefcase,
} from "lucide-react";
import type { StatutStade, TypeStade } from "@matura/shared";
import { useMemo } from "react";

// ─── CARD STADE ───────────────────────────────────────────────────────────────

interface StadeCardProps {
  id: string;
  type: TypeStade;
  numero: number;
  statut: StatutStade;
  score_auto: number | null;
  completion_pct: number;
  valide_le: string | null;
  soumis_le: string | null;
  projetId: string;
}

function StadeCard({
  numero,
  statut,
  score_auto,
  completion_pct,
  projetId,
  soumis_le,
}: StadeCardProps) {
  const label = STADE_LABELS[numero] ?? `Stade ${numero}`;
  const isVerrouille = statut === "VERROUILLE";
  const bgMap: Record<string, string> = {
    VALIDE: "border-green-200 bg-green-50/40",
    SOUMIS: "border-amber-200 bg-amber-50/40",
    EN_REVISION: "border-red-200 bg-red-50/30",
    BROUILLON: "border-blue-200 bg-blue-50/30",
    DEBLOQUE: "border-zinc-200 bg-white",
    VERROUILLE: "border-zinc-100 bg-zinc-50 opacity-50",
  };
  const numBg: Record<string, string> = {
    VALIDE: "bg-green-100 text-green-700",
    SOUMIS: "bg-amber-100 text-amber-700",
    EN_REVISION: "bg-red-100 text-red-700",
    BROUILLON: "bg-blue-100 text-blue-700",
    DEBLOQUE: "bg-zinc-100 text-zinc-500",
    VERROUILLE: "bg-zinc-100 text-zinc-400",
  };

  const inner = (
    <div
      className={cn(
        "border rounded-[16px] p-3.5 transition-all",
        bgMap[statut] ?? "border-zinc-200 bg-white",
        !isVerrouille && "hover:bg-zinc-50/50",
      )}
    >
      <div className="flex items-center gap-3">
        {/* Numéro */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0",
            numBg[statut],
          )}
        >
          {statut === "VALIDE" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : isVerrouille ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            numero
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] text-zinc-800">
              {numero}. {label}
            </span>
            <StatutBadge statut={statut} />
          </div>

          {/* Barre completion si actif */}
          {!isVerrouille && statut !== "VALIDE" && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${completion_pct}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 shrink-0">
                {completion_pct}%
              </span>
            </div>
          )}

          {/* Score si évalué */}
          {score_auto !== null && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] text-zinc-500">
                Note mentor : {score_auto}/100
              </span>
            </div>
          )}

          {/* Soumis le */}
          {soumis_le && statut === "SOUMIS" && (
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Soumis le {new Date(soumis_le).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>

        {!isVerrouille && (
          <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
        )}
      </div>
    </div>
  );

  if (isVerrouille) return <div key={numero}>{inner}</div>;

  return (
    <Link
      to="/projets/$projetId/stades/$numStade"
      params={{ projetId, numStade: String(numero) }}
    >
      {inner}
    </Link>
  );
}

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────────────────

export default function ProjetDetailPage() {
  const { projetId } = useParams({
    from: "/(dashboard)/_layout/projets/$projetId/",
  });
  const navigate = useNavigate();
  const { data: projet, isLoading, isError } = useProjetDetail(projetId);
  const user = authStore((state) => state.utilisateur);
  const isMentor = user?.role === "MENTOR";
  const usrAvatarURL = useMemo(() => {
    if (!projet?.mentor?.url_avatar) return "";
    return `${import.meta.env.VITE_BASE_URL}${projet.mentor.url_avatar}`;
  }, [projet?.mentor?.url_avatar]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-green-600" />
      </div>
    );
  }

  // ── Erreur ──
  if (isError || !projet) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-[13px] text-zinc-500">
          Projet introuvable ou accès refusé.
        </p>
      </div>
    );
  }

  // Stade actif = premier non VERROUILLE et non VALIDE
  const stadeActif =
    projet.stades.find(
      (s) => s.statut !== "VERROUILLE" && s.statut !== "VALIDE",
    ) ??
    projet.stades.find(
      (s) => s.statut === "VALIDE" && s.numero === projet.brl_actuel,
    );

  const scoreGlobal = projet.score?.score_global ?? null;

  return (
    <div className="page-shell max-w-5xl">
      {/* ── En-tête ── */}
      <div className="panel-flat flex items-start justify-between gap-4 p-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="icon-chip h-9 w-9 shrink-0">
              <Briefcase className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <BRLBadge brl={projet.brl_actuel} />
            <StatutBadge statut={projet.statut} />
          </div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.04em] text-[var(--color-text-primary)]">
            {projet.titre}
          </h1>
          <p className="mt-2 line-clamp-2 text-[13px] text-[var(--color-text-muted)]">
            {projet.description}
          </p>
        </div>

        {scoreGlobal !== null && scoreGlobal > 0 && (
          <div className="panel-soft shrink-0 px-4 py-3.5 text-center">
            <p className="text-[24px] font-semibold leading-none text-[var(--color-text-primary)]">
              {Math.round(scoreGlobal)}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              Score MCDA
            </p>
          </div>
        )}
      </div>

      {/* ── Méta-infos ── */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          { label: "Domaine", value: projet.domaine },
          { label: "Région", value: projet.region },
          { label: "Cible", value: projet.type_cible },
        ].map((item) => (
          <div key={item.label} className="panel-flat p-3.5">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {item.label}
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[var(--color-text-primary)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Intervenants (Mentor / Entrepreneur) ── */}
      {isMentor && projet.proprietaire ? (
        <div className="panel-flat flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-700 text-[13px] font-bold">
              {projet.proprietaire.prenom.charAt(0).toUpperCase()}
              {projet.proprietaire.nom.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
              Porteur du projet
            </p>
            <p className="text-[14px] text-zinc-800 font-medium">
              {projet.proprietaire.prenom} {projet.proprietaire.nom}
            </p>
          </div>
        </div>
      ) : projet.mentor ? (
        <div className="panel-flat flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 overflow-hidden border border-green-200">
            {projet.mentor.url_avatar ? (
              <img
                src={usrAvatarURL}
                alt={`${projet.mentor.prenom} ${projet.mentor.nom}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-green-700 text-[13px] font-bold">
                {projet.mentor.prenom.charAt(0).toUpperCase()}
                {projet.mentor.nom.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
              Mentor assigné
            </p>
            <p className="text-[14px] text-zinc-800 font-medium">
              {projet.mentor.prenom} {projet.mentor.nom}
            </p>
          </div>
        </div>
      ) : null}

      {/* ── Stepper horizontal ── */}
      <div className="panel-flat px-4 py-3">
        <StadeStepperH
          stades={projet.stades.map((s) => ({
            type: s.type,
            numero: s.numero,
            statut: s.statut,
          }))}
          currentStade={stadeActif?.numero ?? 1}
          onStadeClick={(num) => {
            const s = projet.stades.find((st) => st.numero === num);
            if (s && s.statut !== "VERROUILLE") {
              navigate({
                to: "/projets/$projetId/stades/$numStade",
                params: { projetId, numStade: String(num) },
              });
            }
          }}
        />
      </div>

      {/* ── CTA stade actif ── */}
      {stadeActif && stadeActif.statut !== "VERROUILLE" && (
        <Link
          to="/projets/$projetId/stades/$numStade"
          params={{ projetId, numStade: String(stadeActif.numero) }}
          className={cn(
            "flex items-center justify-between rounded-[26px] px-6 py-5 shadow-sm",
            "border border-[var(--color-success-border)] bg-[var(--color-success)]",
            "transition-[filter,transform] duration-200 hover:brightness-[0.98] active:scale-[0.995]",
          )}
        >
          <div>
            <p className="text-[13px] font-semibold text-white">
              {stadeActif.statut === "SOUMIS"
                ? "En attente d'évaluation"
                : `Continuer le Stade ${stadeActif.numero}`}
            </p>
            <p className="mt-0.5 text-[11px] text-white/80">
              {STADE_LABELS[stadeActif.numero]} ·{" "}
              {stadeActif.statut === "VALIDE"
                ? "100%"
                : `${stadeActif.completion_pct}%`}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0 text-white" />
        </Link>
      )}

      {/* ── Liste des 7 stades ── */}
      <div>
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          Parcours de maturation
        </p>
        <div className="space-y-4">
          {projet.stades.map((s) => (
            <StadeCard key={s.id} {...s} projetId={projetId} />
          ))}
        </div>
      </div>

      {/* ── Score détail ── */}
      {projet.score && scoreGlobal !== null && scoreGlobal > 0 && (
        <div className="panel-flat p-5">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Scores MCDA
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Innovation", value: projet.score.score_innovation },
              { label: "Marché", value: projet.score.score_marche },
              { label: "Équipe", value: projet.score.score_equipe },
              { label: "Finance", value: projet.score.score_finance },
              { label: "Exécution", value: projet.score.score_execution },
            ].map((dim) => (
              <div
                key={dim.label}
                className="panel-soft flex items-center justify-between px-3 py-2.5"
              >
                <span className="text-[11px] text-[var(--color-text-secondary)]">
                  {dim.label}
                </span>
                <span
                  className={cn(
                    "text-[12px] font-medium",
                    dim.value >= 65
                      ? "text-green-600"
                      : dim.value >= 40
                        ? "text-amber-600"
                        : "text-zinc-400",
                  )}
                >
                  {dim.value > 0 ? Math.round(dim.value) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
