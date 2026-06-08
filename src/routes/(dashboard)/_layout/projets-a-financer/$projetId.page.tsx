import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useFicheInvestisseur } from '@/hooks/useInvestisseur'
import { Loader2, ArrowLeft, Users, TrendingUp, FileText, Target, BarChart2, Banknote, ChevronDown, ChevronUp, Star } from 'lucide-react'

/**
 * Page de détail d'un projet vue par un investisseur.
 * Utilise l'endpoint /investisseur/projets/:projetId/fiche
 * qui renvoie la structure FicheInvestisseur (12 dimensions).
 */
export default function ProjetAFinancerDetailPage() {
  const { projetId } = useParams({ from: '/(dashboard)/_layout/projets-a-financer/$projetId' })
  const navigate = useNavigate()
  const { data: fiche, isLoading, isError } = useFicheInvestisseur(projetId)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <p className="text-[12px] text-zinc-400">Chargement du dossier investisseur…</p>
      </div>
    )
  }

  if (isError || !fiche) {
    return (
      <div className="flex flex-col items-center py-16 gap-3 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-[13px] text-zinc-500">Impossible de charger ce projet.</p>
        <button
          className="text-[12px] text-green-600 hover:text-green-700"
          onClick={() => navigate({ to: '/projets-a-financer' })}
        >
          ← Retour aux projets
        </button>
      </div>
    )
  }

  const { identite, equipe, score, finances, traction, besoins_financement, documents } = fiche

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      {/* ── Retour ──────────────────────────────────────────────────────── */}
      <button
        className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors"
        onClick={() => navigate({ to: '/projets-a-financer' })}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Retour aux projets
      </button>

      {/* ── En-tête ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-medium">
                BRL {identite.brl_actuel}
              </span>
              {identite.domaine && (
                <span className="text-[11px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                  {identite.domaine}
                </span>
              )}
              {identite.region && (
                <span className="text-[11px] text-zinc-400">📍 {identite.region}</span>
              )}
            </div>
            <h1 className="text-[18px] font-semibold text-zinc-900">{identite.titre}</h1>
            {identite.date_creation && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Créé le {new Date(identite.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Score global */}
          {score && (
            <div className="flex flex-col items-center px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <span className="text-[22px] font-bold text-green-700 leading-none">
                {Math.round(score.score_global)}
              </span>
              <span className="text-[9px] text-zinc-500 mt-0.5">score global</span>
            </div>
          )}
        </div>

        {identite.resume_executif && (
          <p className="mt-3 text-[12px] text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
            {identite.resume_executif}
          </p>
        )}
      </div>

      {/* ── Scores MCDA ─────────────────────────────────────────────────── */}
      {score && (
        <Section icon={<BarChart2 className="w-4 h-4" />} title="Scores d'évaluation">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Innovation', val: score.score_innovation },
              { label: 'Marché',     val: score.score_marche },
              { label: 'Équipe',     val: score.score_equipe },
              { label: 'Finance',    val: score.score_finance },
              { label: 'Exécution', val: score.score_execution },
            ].map(({ label, val }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">{label}</span>
                  <span className="text-[10px] text-zinc-700 font-medium">{Math.round(val ?? 0)}</span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min(val ?? 0, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Équipe ──────────────────────────────────────────────────────── */}
      <Section icon={<Users className="w-4 h-4" />} title="Équipe">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {equipe.fondateur.avatar_url ? (
              <img
                src={equipe.fondateur.avatar_url}
                alt={equipe.fondateur.prenom_nom}
                className="w-8 h-8 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-[12px] font-medium">
                {equipe.fondateur.prenom_nom.slice(0, 1)}
              </div>
            )}
            <div>
              <p className="text-[12px] font-medium text-zinc-800">{equipe.fondateur.prenom_nom}</p>
              <p className="text-[10px] text-zinc-400">Fondateur / Porteur de projet</p>
            </div>
          </div>

          {equipe.membres.length > 0 && (
            <div className="border-t border-zinc-100 pt-2 space-y-1.5 mt-1">
              {equipe.membres.map((m, i) => (
                <div key={i} className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium text-zinc-700">{m.prenom_nom}</p>
                    <p className="text-[10px] text-zinc-400">{m.role_projet}</p>
                  </div>
                  {m.disciplines.length > 0 && (
                    <div className="flex gap-1 flex-wrap justify-end">
                      {m.disciplines.slice(0, 2).map((d) => (
                        <span key={d} className="text-[9px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {equipe.mentor && (
            <div className="border-t border-zinc-100 pt-2 mt-1 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <p className="text-[11px] font-medium text-zinc-700">
                  Mentor : {equipe.mentor.prenom_nom}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {equipe.mentor.nb_evaluations} évaluation{equipe.mentor.nb_evaluations !== 1 ? 's' : ''}
                  {equipe.mentor.note_moyenne !== null && ` · note moy. ${equipe.mentor.note_moyenne.toFixed(1)}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ── Traction ────────────────────────────────────────────────────── */}
      {traction && (
        <Section icon={<TrendingUp className="w-4 h-4" />} title="Traction & validation">
          <div className="grid grid-cols-2 gap-3">
            <Kpi label="Clients actifs"   value={traction.nb_clients} suffix="" />
            <Kpi label="Clients payants"  value={traction.clients_payants} suffix="" />
            <Kpi label="Revenus générés"  value={traction.revenus_generes} suffix=" Ar" />
            <Kpi label="Score NPS"        value={traction.score_nps} suffix="" />
            <Kpi label="Rétention"        value={traction.taux_retention} suffix="%" />
          </div>
        </Section>
      )}

      {/* ── Finances ─────────────────────────────────────────────────────── */}
      {finances && (
        <Section icon={<Banknote className="w-4 h-4" />} title="Projections financières">
          <div className="grid grid-cols-2 gap-3">
            <Kpi label="Point mort (unités)" value={finances.point_mort_unites} suffix="" />
            <Kpi label="ROI estimé"          value={finances.roi !== null ? `${finances.roi}%` : null} suffix="" raw />
          </div>
          {finances.ca_previsionnel && (
            <div className="mt-3 space-y-2">
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">CA prévisionnel</p>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as const).map((y) => {
                  const caObj = finances.ca_previsionnel as any
                  return (
                    <div key={y} className="bg-zinc-50 rounded-lg px-3 py-2 text-center">
                      <p className="text-[9px] text-zinc-400">An {y}</p>
                      <p className="text-[12px] font-semibold text-zinc-800">
                        {caObj?.[`annee${y}`]?.toLocaleString('fr') ?? '—'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Besoins de financement ───────────────────────────────────────── */}
      {besoins_financement && (
        <Section icon={<Target className="w-4 h-4" />} title="Besoins de financement">
          <div className="space-y-2">
            {besoins_financement.montant_recherche !== null && (
              <Row label="Montant recherché" value={`${(besoins_financement.montant_recherche ?? 0).toLocaleString('fr')} Ar`} />
            )}
            {besoins_financement.type_financement && (
              <Row label="Type" value={besoins_financement.type_financement} />
            )}
            {besoins_financement.usage_des_fonds && (
              <Row label="Usage des fonds" value={String(besoins_financement.usage_des_fonds)} />
            )}
          </div>
        </Section>
      )}

      {/* ── Documents ───────────────────────────────────────────────────── */}
      {documents.length > 0 && (
        <Section icon={<FileText className="w-4 h-4" />} title="Documents">
          <div className="space-y-1.5">
            {documents.map((doc, i) => (
              <a
                key={i}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-green-700 hover:text-green-800 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{doc.nom || doc.type}</span>
              </a>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

// ─── Composants utilitaires ────────────────────────────────────────────────────

function Section({
  icon, title, children,
}: {
  icon: React.ReactNode; title: string; children: React.ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-zinc-500">{icon}</span>
        <span className="text-[13px] font-medium text-zinc-800 flex-1">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1">{children}</div>}
    </div>
  )
}

function Kpi({
  label, value, suffix, raw,
}: {
  label: string; value: number | string | null | undefined; suffix: string; raw?: boolean
}) {
  if (value === null || value === undefined) return null
  const display = raw ? value : typeof value === 'number' ? value.toLocaleString('fr') + suffix : String(value)
  return (
    <div className="bg-zinc-50 rounded-lg px-3 py-2">
      <p className="text-[9px] text-zinc-400 uppercase tracking-wide">{label}</p>
      <p className="text-[14px] font-semibold text-zinc-800 mt-0.5">{display}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[11px] text-zinc-500 shrink-0">{label}</span>
      <span className="text-[11px] text-zinc-800 font-medium text-right">{value}</span>
    </div>
  )
}
