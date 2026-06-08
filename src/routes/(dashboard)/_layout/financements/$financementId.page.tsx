import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useFinancementDetail } from "@/hooks/useFinancements";
import { PostulerModal } from "@/components/financement/PostulerModal";
import { StatutOffre, TypeFinancement } from "@matura/shared";
import {
  Loader2,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

const TYPE_LABELS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]: "Subvention",
  [TypeFinancement.PRET]: "Prêt",
  [TypeFinancement.EQUITY]: "Equity",
  [TypeFinancement.OBLIGATION]: "Obligation",
  [TypeFinancement.DON]: "Don",
};

const TYPE_COLORS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]: "bg-green-50 text-green-700 border-green-200",
  [TypeFinancement.PRET]: "bg-blue-50 text-blue-700 border-blue-200",
  [TypeFinancement.EQUITY]: "bg-purple-50 text-purple-700 border-purple-200",
  [TypeFinancement.OBLIGATION]:
    "bg-orange-50 text-orange-700 border-orange-200",
  [TypeFinancement.DON]: "bg-teal-50 text-teal-700 border-teal-200",
};

function formatMontant(
  min?: number | null,
  max?: number | null,
  devise = "MGA",
) {
  if (!min && !max) return "Non précisé";
  if (min && max)
    return `${min.toLocaleString("fr")} – ${max.toLocaleString("fr")} ${devise}`;
  if (min) return `À partir de ${min.toLocaleString("fr")} ${devise}`;
  return `Jusqu'à ${max!.toLocaleString("fr")} ${devise}`;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Non précisée";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function FinancementDetailPage() {
  const { financementId } = useParams({
    from: "/(dashboard)/_layout/financements/$financementId",
  });
  const navigate = useNavigate();
  const [postuleOpen, setPostuleOpen] = useState(false);

  const {
    data: offre,
    isLoading,
    isError,
  } = useFinancementDetail(financementId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (isError || !offre) {
    return (
      <div className="flex flex-col items-center py-20 gap-3">
        <p className="text-[13px] text-zinc-500">
          ⚠️ Impossible de charger cette offre.
        </p>
        <button
          onClick={() => navigate({ to: "/financements" })}
          className="text-[12px] text-green-600 hover:text-green-700"
        >
          ← Retour aux financements
        </button>
      </div>
    );
  }

  const canPostuler =
    offre.statut === StatutOffre.OUVERTE ||
    offre.statut === StatutOffre.EN_COURS;

  // url_avatar peut être dans profil (JSON) ou directement sur l'utilisateur
  const investisseurNom = offre.investisseur
    ? `${offre.investisseur.prenom} ${offre.investisseur.nom}`
    : null;
  const investisseurAvatar =
    (offre.investisseur?.profil as any)?.url_avatar ??
    (offre.investisseur as any)?.url_avatar ??
    null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Navigation */}
      <button
        onClick={() => navigate({ to: "/financements" })}
        className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux financements
      </button>

      {/* Header */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {investisseurAvatar && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}${investisseurAvatar}`}
                alt={investisseurNom ?? ""}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span
                  className={[
                    "text-[10px] px-1.5 py-0.5 rounded border",
                    TYPE_COLORS[offre.typeFinancement],
                  ].join(" ")}
                >
                  {TYPE_LABELS[offre.typeFinancement] ?? offre.typeFinancement}
                </span>
                <span
                  className={[
                    "text-[10px] px-1.5 py-0.5 rounded border",
                    canPostuler
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200",
                  ].join(" ")}
                >
                  {offre.statut}
                </span>
              </div>
              <h1 className="text-[17px] font-medium text-zinc-900">
                {offre.titre}
              </h1>
              {investisseurNom && (
                <p className="text-[12px] text-zinc-400 mt-0.5">
                  Proposé par{" "}
                  <span className="text-zinc-600">{investisseurNom}</span>
                </p>
              )}
            </div>
          </div>

          {/* CTA */}
          {canPostuler ? (
            <button
              onClick={() => setPostuleOpen(true)}
              className="shrink-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-[12px] font-medium rounded-lg transition-colors"
            >
              Postuler
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span>🔒</span>
              <span>Offre fermée</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-zinc-600 leading-relaxed">
          {offre.description}
        </p>
      </div>

      {/* Informations clés */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
        <h2 className="text-[13px] font-medium text-zinc-800">
          Informations clés
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={DollarSign}
            label="Montant"
            value={formatMontant(
              offre.montantMin,
              offre.montantMax,
              offre.devise,
            )}
          />
          <InfoItem
            icon={TrendingUp}
            label="Stade BRL requis"
            value={`BRL ${offre.stadeCible} minimum`}
          />
          <InfoItem
            icon={Clock}
            label="Clôture"
            value={formatDate(offre.dateCloture)}
          />
          <InfoItem
            icon={Users}
            label="Candidatures"
            value={`${offre._count?.candidatures ?? 0}`}
          />
        </div>
      </div>

      {/* Secteurs */}
      {offre.secteurs?.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
          <h2 className="text-[13px] font-medium text-zinc-800">
            Secteurs ciblés
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {offre.secteurs.map((s) => (
              <span
                key={s}
                className="text-[11px] px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Régions */}
      {offre.regions?.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
          <h2 className="text-[13px] font-medium text-zinc-800">
            Régions couvertes
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {offre.regions.map((r) => (
              <span
                key={r}
                className="text-[11px] px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Critères d'éligibilité */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h2 className="text-[12px] font-medium text-blue-800 mb-1.5">
          📋 Critères d'éligibilité
        </h2>
        <p className="text-[12px] text-blue-700">
          Votre projet doit avoir un{" "}
          <strong>BRL d'au moins {offre.stadeCible}</strong> et être actif. Le
          système sélectionnera automatiquement vos projets éligibles lors de la
          postulation.
        </p>
      </div>

      {/* Modal postulation */}
      {postuleOpen && (
        <PostulerModal
          offre={offre}
          onClose={() => setPostuleOpen(false)}
          onSuccess={() => setPostuleOpen(false)}
        />
      )}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 mt-0.5 text-zinc-600" />
      <div>
        <p className="text-[10px] text-zinc-400">{label}</p>
        <p className="text-[12px] text-zinc-700">{value}</p>
      </div>
    </div>
  );
}
