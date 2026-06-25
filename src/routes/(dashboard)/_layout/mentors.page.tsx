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
  return (
    <div className="group w-full relative cursor-pointer rounded-[22px] border border-zinc-100 bg-white p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-zinc-200 min-h-[220px]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-zinc-100 bg-zinc-50 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              <img
                src={
                  mentor.url_avatar ? `${import.meta.env.VITE_BASE_URL}${mentor.url_avatar}` : undefined
                }
                alt={`${mentor.prenom} ${mentor.nom}`}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://ui-avatars.com/api/?name=${initiales}&background=41A677&color=fff&size=128`;
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading text-[15px] font-semibold text-zinc-900">
                {mentor.prenom} {mentor.nom}
              </p>
              {profil?.annees_experience !== undefined && (
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                  {profil.annees_experience} ans d'expérience
                </p>
              )}
            </div>
          </div>
          {profil?.disponible === false && (
            <span className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] bg-red-50 text-red-700 border-red-200">
              Indisponible
            </span>
          )}
        </div>

        {/* Bio & expertises indented */}
        <div className="pl-13 space-y-3">
          {profil?.bio && (
            <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-2 text-thin">
              {profil.bio}
            </p>
          )}

          {domaines.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {domaines.slice(0, 3).map((d) => (
                <span key={d} className="rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1 text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                  {d}
                </span>
              ))}
              {domaines.length > 3 && (
                <span className="text-[10px] text-zinc-450 font-bold self-center">
                  +{domaines.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3.5 border-t border-zinc-100 mt-1 pl-13">
        {profil?.linkedin_url ? (
          <a
            href={profil.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
          </a>
        ) : (
          <span />
        )}
        <Button
          onClick={() => onDemanderClick(mentor)}
          variant="success"
          size="sm"
          className="rounded-full"
        >
          <Send className="w-3 h-3 mr-1.5" />
          Demander
        </Button>
      </div>
    </div>
  );
}

//MODAL DEMANDE 

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
          <Button onClick={onClose} className="flex-1 bg-[#f5f5f3] text-[#555552] border border-[#e2e2dc] hover:bg-[#ecece9] cursor-pointer font-semibold shadow-none rounded-[16px]">
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !projetId || envoyer.isPending || projetsDisponibles.length === 0
            }
            className="flex-1 bg-[#41A677] hover:bg-[#358E64] text-white border-none shadow-none cursor-pointer rounded-[16px]"
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

      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
          Mentors disponibles
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
          Trouvez un mentor pour accompagner votre projet.
        </p>
      </div>

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
