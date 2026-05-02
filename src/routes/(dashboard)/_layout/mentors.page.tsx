import { useState } from 'react'
import { useMentors, useEnvoyerDemande, type MentorPublic } from '@/hooks/useAccompagnement'
import { useProjets } from '@/hooks/useProjets'
// import { cn } from '@/lib/utils'
// import { DOMAINE_LABELS } from '@/lib/constants'
import {
  Loader2, Search, Users, ExternalLink,
  Send, X, CheckCircle2, ChevronDown,
} from 'lucide-react'

// ─── CARTE MENTOR ─────────────────────────────────────────────────────────────

function CarteMentor({
  mentor,
  onDemanderClick,
}: {
  mentor: MentorPublic
  onDemanderClick: (mentor: MentorPublic) => void
}) {
  const profil = mentor.profil
  const domaines = profil?.domaines_expertise ?? []
  const initiales = `${mentor.prenom[0]}${mentor.nom[0]}`.toUpperCase()

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col gap-3 hover:border-green-200 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <span className="text-[13px] font-medium text-green-700">{initiales}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-zinc-800">
            {mentor.prenom} {mentor.nom}
          </p>
          {profil?.annees_experience !== undefined && (
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {profil.annees_experience} ans d'expérience
            </p>
          )}
        </div>
        {profil?.disponible === false && (
          <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full shrink-0">
            Indisponible
          </span>
        )}
      </div>

      {/* Bio */}
      {profil?.bio && (
        <p className="text-[12px] text-zinc-500 line-clamp-2">{profil.bio}</p>
      )}

      {/* Domaines */}
      {domaines.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {domaines.slice(0, 4).map((d) => (
            <span
              key={d}
              className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full"
            >
              {d}
            </span>
          ))}
          {domaines.length > 4 && (
            <span className="text-[10px] text-zinc-400">+{domaines.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-50">
        {profil?.linkedin_url ? (
          <a
            href={profil.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
          >
            <ExternalLink className="w-3 h-3" /> LinkedIn
          </a>
        ) : (
          <span />
        )}
        <button
          onClick={() => onDemanderClick(mentor)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[11px] font-medium transition-colors"
        >
          <Send className="w-3 h-3" />
          Demander
        </button>
      </div>
    </div>
  )
}

// ─── MODAL DEMANDE ────────────────────────────────────────────────────────────

function ModalDemande({
  mentor,
  onClose,
}: {
  mentor: MentorPublic
  onClose: () => void
}) {
  const { data: projetsData, isLoading: loadingProjets } = useProjets({ page: 1, limite: 20 })
  const projets = projetsData?.projets ?? []
  const projetsDisponibles = projets.filter((p) => !p.mentor)

  const [projetId, setProjetId] = useState(projetsDisponibles[0]?.id ?? '')
  const [message, setMessage] = useState('')

  const envoyer = useEnvoyerDemande(projetId)

  const handleSubmit = async () => {
    if (!projetId) return
    await envoyer.mutateAsync({ mentor_id: mentor.id, message: message || undefined })
    onClose()
  }

  const initiales = `${mentor.prenom[0]}${mentor.nom[0]}`.toUpperCase()

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-[12px] font-medium text-green-700">{initiales}</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-zinc-800">
                {mentor.prenom} {mentor.nom}
              </p>
              <p className="text-[11px] text-zinc-400">Demande d'accompagnement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Sélection projet */}
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1.5">
              Projet concerné *
            </label>
            {loadingProjets ? (
              <div className="flex items-center gap-2 text-[12px] text-zinc-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Chargement...
              </div>
            ) : projetsDisponibles.length === 0 ? (
              <p className="text-[12px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Tous vos projets ont déjà un mentor assigné.
              </p>
            ) : (
              <div className="relative">
                <select
                  value={projetId}
                  onChange={(e) => setProjetId(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 appearance-none focus:outline-none focus:border-green-400 bg-white"
                >
                  {projetsDisponibles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titre} (BRL {p.brl_actuel})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Message optionnel */}
          <div>
            <label className="text-[11px] text-zinc-500 block mb-1.5">
              Message (optionnel)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Présentez votre projet et vos attentes..."
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 resize-none focus:outline-none focus:border-green-400"
            />
            <p className="text-[10px] text-zinc-400 mt-0.5 text-right">
              {message.length}/500
            </p>
          </div>

          {/* Domaines du mentor */}
          {(mentor.profil?.domaines_expertise ?? []).length > 0 && (
            <div className="bg-zinc-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-zinc-400 mb-1">Expertises de ce mentor</p>
              <div className="flex flex-wrap gap-1">
                {mentor.profil!.domaines_expertise!.map((d) => (
                  <span key={d} className="text-[10px] text-zinc-600 bg-white border border-zinc-200 px-2 py-0.5 rounded-full">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-[13px] hover:bg-zinc-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!projetId || envoyer.isPending || projetsDisponibles.length === 0}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors"
          >
            {envoyer.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Envoyer la demande
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────

export default function MentorsPage() {
  const [search, setSearch] = useState('')
  const [mentorSelectionne, setMentorSelectionne] = useState<MentorPublic | null>(null)

  const { data, isLoading } = useMentors({ disponible: true })
  const mentors = data?.mentors ?? []

  const mentorsFiltres = search.trim()
    ? mentors.filter(
        (m) =>
          `${m.prenom} ${m.nom}`.toLowerCase().includes(search.toLowerCase()) ||
          (m.profil?.domaines_expertise ?? []).some((d) =>
            d.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : mentors

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* En-tête */}
      <div>
        <h1 className="text-[20px] text-zinc-900">Mentors disponibles</h1>
        <p className="text-[12px] text-zinc-500 mt-1">
          Trouvez un mentor pour accompagner votre projet.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou domaine..."
          className="w-full border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white"
        />
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-green-600" />
        </div>
      ) : mentorsFiltres.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-zinc-400" />
          </div>
          <p className="text-[13px] text-zinc-600">
            {search ? 'Aucun mentor ne correspond à votre recherche.' : 'Aucun mentor disponible.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-[11px] text-zinc-400">
            {mentorsFiltres.length} mentor{mentorsFiltres.length > 1 ? 's' : ''} trouvé{mentorsFiltres.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  )
}
