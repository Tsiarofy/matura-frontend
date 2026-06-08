import { useState } from "react";
import {
  useMentors,
  useEnvoyerDemande,
  type MentorPublic,
} from "@/hooks/useAccompagnement";
import { useProjets } from "@/hooks/useProjets";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
// import { cn } from '@/lib/utils'
// import { DOMAINE_LABELS } from '@/lib/constants'
import {
  Loader2,
  Users,
  ExternalLink,
  Send,
  X,
  ChevronDown,
} from "lucide-react";

// ─── CARTE MENTOR ─────────────────────────────────────────────────────────────

function CarteMentor({
  mentor,
  onDemanderClick,
}: {
  mentor: MentorPublic;
  onDemanderClick: (mentor: MentorPublic) => void;
}) {
  const profil = mentor.profil;
  const domaines = profil?.domaines_expertise ?? [];
  const initiales = `${mentor.prenom[0]}${mentor.nom[0]}`.toUpperCase();
  // console.log(mentor.url_avatar)
  return (
    <div className="group w-full h-64 relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-3 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={
              `${import.meta.env.VITE_BASE_URL}${mentor.url_avatar}` ||
              undefined
            }
            alt={`${mentor.prenom} ${mentor.nom}`}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${initiales}&background=10B981&color=fff&size=128`;
            }}
          />
          {/* <span className="text-[13px] font-medium text-green-700">{initiales}</span> */}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-[var(--color-text-primary)]">
            {mentor.prenom} {mentor.nom}
          </p>
          {profil?.annees_experience !== undefined && (
            <p className="text-[10.5px] text-[var(--color-text-muted)] mt-0.5">
              {profil.annees_experience} ans d'expérience
            </p>
          )}
        </div>
        {profil?.disponible === false && (
          <span className="flat-chip shrink-0">Indisponible</span>
        )}
      </div>

      {/* Bio */}
      {profil?.bio && (
        <p className="text-[11.5px] leading-relaxed text-[var(--color-text-muted)] line-clamp-2">
          {profil.bio}
        </p>
      )}

      {/* Domaines */}
      {domaines.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {domaines.slice(0, 4).map((d) => (
            <span key={d} className="flat-chip">
              {d}
            </span>
          ))}
          {domaines.length > 4 && (
            <span className="text-[10px] text-[var(--color-text-muted)]">
              +{domaines.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--color-border)]">
        {profil?.linkedin_url ? (
          <a
            href={profil.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10.5px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <ExternalLink className="w-3 h-3" /> LinkedIn
          </a>
        ) : (
          <span />
        )}
        <Button
          onClick={() => onDemanderClick(mentor)}
          variant="success"
          size="sm"
        >
          <Send className="w-3.5 h-3.5" />
          Demander
        </Button>
      </div>
    </div>
  );
}

// ─── MODAL DEMANDE ────────────────────────────────────────────────────────────

function ModalDemande({
  mentor,
  onClose,
}: {
  mentor: MentorPublic;
  onClose: () => void;
}) {
  const { data: projetsData, isLoading: loadingProjets } = useProjets({
    page: 1,
    limite: 20,
  });
  const projets = projetsData?.projets ?? [];
  const projetsDisponibles = projets.filter((p) => !p.mentor);

  const [projetId, setProjetId] = useState(projetsDisponibles[0]?.id ?? "");
  const [message, setMessage] = useState("");

  const envoyer = useEnvoyerDemande(projetId);

  const handleSubmit = async () => {
    if (!projetId) return;
    await envoyer.mutateAsync({
      mentor_id: mentor.id,
      message: message || undefined,
    });
    onClose();
  };

  const initiales = `${mentor.prenom[0]}${mentor.nom[0]}`.toUpperCase();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="panel-flat w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] flex items-center justify-center">
              <span className="text-[12px] font-semibold text-[var(--color-text-primary)]">
                {initiales}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">
                {mentor.prenom} {mentor.nom}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Demande d'accompagnement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Sélection projet */}
          <div>
            <label className="flat-label">Projet concerné *</label>
            {loadingProjets ? (
              <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Chargement...
              </div>
            ) : projetsDisponibles.length === 0 ? (
              <p className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[18px] px-3 py-2">
                Tous vos projets ont déjà un mentor assigné.
              </p>
            ) : (
              <div className="relative">
                <select
                  value={projetId}
                  onChange={(e) => setProjetId(e.target.value)}
                  className="flat-input appearance-none pr-10"
                >
                  {projetsDisponibles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titre} (BRL {p.brl_actuel})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
              </div>
            )}
          </div>

          {/* Message optionnel */}
          <div>
            <label className="flat-label">Message (optionnel)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Présentez votre projet et vos attentes..."
              className="flat-input min-h-[92px] resize-none"
            />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 text-right">
              {message.length}/500
            </p>
          </div>

          {/* Domaines du mentor */}
          {(mentor.profil?.domaines_expertise ?? []).length > 0 && (
            <div className="panel-soft rounded-[18px] px-3 py-2">
              <p className="text-[10px] text-[var(--color-text-muted)] mb-1">
                Expertises de ce mentor
              </p>
              <div className="flex flex-wrap gap-1">
                {mentor.profil!.domaines_expertise!.map((d) => (
                  <span key={d} className="flat-chip">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !projetId || envoyer.isPending || projetsDisponibles.length === 0
            }
          variant="orange"
            className="flex-1"
          >
            {envoyer.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Envoyer la demande
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [mentorSelectionne, setMentorSelectionne] =
    useState<MentorPublic | null>(null);

  const { data, isLoading } = useMentors({ disponible: true });
  const mentors = data?.mentors ?? [];

  const mentorsFiltres = search.trim()
    ? mentors.filter(
        (m) =>
          `${m.prenom} ${m.nom}`.toLowerCase().includes(search.toLowerCase()) ||
          (m.profil?.domaines_expertise ?? []).some((d) =>
            d.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : mentors;

  return (
    <div className="page-shell">
      {/* En-tête */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
          Mentors disponibles
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          Trouvez un mentor pour accompagner votre projet.
        </p>
      </div>

      {/* Barre de recherche */}
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher par nom ou domaine..."
        onClear={() => setSearch("")}
        containerClassName="max-w-[360px]"
      />

      {/* Contenu */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-green-600" />
        </div>
      ) : mentorsFiltres.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="icon-chip h-12 w-12">
            <Users className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            {search
              ? "Aucun mentor ne correspond à votre recherche."
              : "Aucun mentor disponible."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-[11px] text-[var(--color-text-muted)]">
            {mentorsFiltres.length} mentor{mentorsFiltres.length > 1 ? "s" : ""}{" "}
            trouvé{mentorsFiltres.length > 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mentorsFiltres.map((mentor) => (
              <CarteMentor
                key={mentor.id}
                mentor={mentor}
                onDemanderClick={setMentorSelectionne}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {mentorSelectionne && (
        <ModalDemande
          mentor={mentorSelectionne}
          onClose={() => setMentorSelectionne(null)}
        />
      )}
    </div>
  );
}
