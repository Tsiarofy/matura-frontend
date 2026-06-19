import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { useProjetDetail } from "@/hooks/useStades";
import { BRLBadge } from "@/components/shared/BRLBadge";
import { StatutBadge } from "@/components/shared/StatutBadge";
import { StadeStepperH } from "@/components/shared/StadeStepperH";
import { cn, getAvatarStyle, formatDecimal } from "@/lib/utils";
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
        "bg-white border rounded-[18px] p-5 transition-all duration-300",
        statut === "VERROUILLE"
          ? "border-zinc-100/80 bg-zinc-50/50 opacity-60"
          : "border-zinc-100 hover:border-zinc-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.02)] cursor-pointer",
      )}
    >
      <div className="flex items-center gap-4">
        {/* Numéro */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0",
            numBg[statut],
          )}
        >
          {statut === "VALIDE" ? (
            <CheckCircle2 className="w-4.5 h-4.5" />
          ) : isVerrouille ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            numero
          )}
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-heading text-[14px] font-semibold text-zinc-900">
              {numero}. {label}
            </span>
            <StatutBadge statut={statut} />
          </div>

          {/* Barre completion si actif */}
          {!isVerrouille && statut !== "VALIDE" && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${completion_pct}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-semibold shrink-0">
                {formatDecimal(completion_pct)}%
              </span>
            </div>
          )}

          {/* Score si évalué */}
          {score_auto !== null && (
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-[12px] font-medium text-zinc-500">
                Note mentor : {formatDecimal(score_auto)}/100
              </span>
            </div>
          )}

          {/* Soumis le */}
          {soumis_le && statut === "SOUMIS" && (
            <p className="text-[10.5px] text-zinc-400 font-medium">
              Soumis le {new Date(soumis_le).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>

        {!isVerrouille && (
          <ChevronRight className="w-5 h-5 text-zinc-300 shrink-0" />
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
    const mentorAny = projet?.mentor as any;
    if (!mentorAny?.url_avatar) return "";
    return `${import.meta.env.VITE_BASE_URL}${mentorAny.url_avatar}`;
  }, [projet?.mentor]);

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
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12">
      {/* ── En-tête ── */}
      <div className="border border-zinc-100 bg-white rounded-[22px] flex items-start justify-between gap-4 p-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="icon-chip h-9 w-9 shrink-0">
              <Briefcase className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <BRLBadge brl={projet.brl_actuel} />
            <StatutBadge statut={projet.statut} />
          </div>
          <h1 className="font-heading text-[24px] font-semibold leading-tight tracking-[-0.03em] text-[var(--color-text-primary)]">
            {projet.titre}
          </h1>
          <p className="mt-2 line-clamp-2 text-[13px] text-[var(--color-text-muted)] text-thin">
            {projet.description}
          </p>
        </div>

        {scoreGlobal !== null && scoreGlobal > 0 && (
          <div className="panel-soft shrink-0 px-4 py-3.5 text-center">
            <p className="text-[24px] font-semibold leading-none text-[var(--color-text-primary)]">
              {formatDecimal(scoreGlobal)}
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
          <div
            key={item.label}
            className="border border-zinc-100 bg-white rounded-[22px] p-4.5"
          >
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
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
        <div className="border border-zinc-100 bg-white rounded-[22px] flex items-center gap-3.5 p-5">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              getAvatarStyle(projet.proprietaire.prenom).bg,
            )}
          >
            <span
              className={cn(
                "text-[13px] font-bold",
                getAvatarStyle(projet.proprietaire.prenom).text,
              )}
            >
              {projet.proprietaire.prenom.charAt(0).toUpperCase()}
              {projet.proprietaire.nom.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[9.5px] text-zinc-400 uppercase tracking-wider font-bold">
              Porteur du projet
            </p>
            <p className="text-[14px] text-zinc-800 font-medium">
              {projet.proprietaire.prenom} {projet.proprietaire.nom}
            </p>
          </div>
        </div>
      ) : projet.mentor ? (
        <div className="border border-zinc-100 bg-white rounded-[22px] flex items-center gap-3.5 p-5">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden border",
              (projet.mentor as any).url_avatar
                ? "border-zinc-200"
                : getAvatarStyle(projet.mentor.prenom)
                    .bg.replace("bg-", "border-")
                    .replace("[", "[")
                    .replace("]", "]/50"),
            )}
          >
            {(projet.mentor as any).url_avatar ? (
              <img
                src={usrAvatarURL}
                alt={`${projet.mentor.prenom} ${projet.mentor.nom}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className={cn(
                  "text-[13px] font-bold",
                  getAvatarStyle(projet.mentor.prenom).text,
                )}
              >
                {projet.mentor.prenom.charAt(0).toUpperCase()}
                {projet.mentor.nom.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-[9.5px] text-zinc-400 uppercase tracking-wider font-bold">
              Mentor assigné
            </p>
            <p className="text-[14px] text-zinc-800 font-medium">
              {projet.mentor.prenom} {projet.mentor.nom}
            </p>
          </div>
        </div>
      ) : null}

      {/* ── Stepper horizontal ── */}
      <div className="border border-zinc-100 bg-white rounded-[22px] px-5 py-4">
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
            "flex items-center justify-between rounded-[22px] px-6 py-5 shadow-[0_8px_30px_rgba(25,180,91,0.12)]",
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
                : `${formatDecimal(stadeActif.completion_pct)}%`}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 shrink-0 text-white" />
        </Link>
      )}

      <div className="pt-8">
        <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
          Parcours de maturation
        </p>
        <div className="space-y-8">
          {projet.stades.map((s) => (
            <StadeCard key={s.id} {...s} projetId={projetId} />
          ))}
        </div>
      </div>

      {/* ── Score détail ── */}
      {projet.score && scoreGlobal !== null && scoreGlobal > 0 && (
        <div className="border border-zinc-100 bg-white rounded-[22px] p-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
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
                  {dim.value > 0 ? formatDecimal(dim.value) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
