import { useParams, Link } from '@tanstack/react-router'
import { useFicheInvestisseur } from '@/hooks/useInvestisseur'
import { Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

function LigneStat({ label, valeur }: { label: string; valeur: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
      <p className="text-[12px] text-zinc-500">{label}</p>
      <p className="text-[12px] text-zinc-800 font-medium">{valeur}</p>
    </div>
  )
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-3">{titre}</p>
      {children}
    </div>
  )
}

function DimensionScore({ label, valeur }: { label: string; valeur: number }) {
  const couleur = valeur >= 75 ? 'bg-green-500' : valeur >= 50 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-3">
      <p className="text-[12px] text-zinc-600 w-24 shrink-0">{label}</p>
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', couleur)} style={{ width: `${valeur}%` }} />
      </div>
      <p className="text-[12px] font-medium text-zinc-700 w-8 text-right">{Math.round(valeur)}</p>
    </div>
  )
}

export default function FicheProjetInvestisseurPage() {
  const { projetId } = useParams({
    from: '/(dashboard)/_layout/projets-a-financer/$projetId',
  })
  const { data: fiche, isLoading } = useFicheInvestisseur(projetId)
  const formatAr = (n: number | null | undefined) =>
    n != null ? `${n.toLocaleString('fr-MG')} Ar` : '—'

  if (isLoading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-green-600" />
    </div>
  )
  if (!fiche) return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <p className="text-[13px] text-zinc-500">Fiche introuvable ou non accessible.</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link to="/projets-a-financer"
        className="inline-flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />Retour à la liste
      </Link>

      {/* En-tête */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[18px] text-zinc-900">{fiche.titre}</h1>
            <p className="text-[12px] text-zinc-400 mt-0.5">
              {fiche.domaine} · {fiche.region}
              {fiche.mentor && ` · Suivi par ${fiche.mentor.prenom_nom}`}
            </p>
          </div>
          {fiche.score && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-center shrink-0">
              <p className="text-[24px] font-medium text-green-700 leading-none">
                {Math.round(fiche.score.score_global)}
              </p>
              <p className="text-[10px] text-green-600 mt-0.5">score global</p>
            </div>
          )}
        </div>
        {fiche.resume_executif && (
          <p className="text-[12px] text-zinc-600 mt-3 leading-relaxed">{fiche.resume_executif}</p>
        )}
      </div>

      {fiche.score && (
        <Section titre="Évaluation MCDA">
          <div className="space-y-2">
            <DimensionScore label="Innovation" valeur={fiche.score.score_innovation} />
            <DimensionScore label="Marché"     valeur={fiche.score.score_marche} />
            <DimensionScore label="Équipe"     valeur={fiche.score.score_equipe} />
            <DimensionScore label="Finance"    valeur={fiche.score.score_finance} />
            <DimensionScore label="Exécution"  valeur={fiche.score.score_execution} />
          </div>
        </Section>
      )}

      {fiche.finances && (
        <Section titre="Données financières">
          <LigneStat label="Point mort (unités)" valeur={fiche.finances.point_mort_unites ?? '—'} />
          <LigneStat label="ROI estimé" valeur={fiche.finances.roi != null ? `${fiche.finances.roi} %` : '—'} />
          {fiche.finances.ca_previsionnel && (
            <>
              <LigneStat label="CA prévi. An 1" valeur={formatAr(fiche.finances.ca_previsionnel.annee1)} />
              <LigneStat label="CA prévi. An 2" valeur={formatAr(fiche.finances.ca_previsionnel.annee2)} />
              <LigneStat label="CA prévi. An 3" valeur={formatAr(fiche.finances.ca_previsionnel.annee3)} />
            </>
          )}
        </Section>
      )}

      {fiche.traction && (
        <Section titre="Traction">
          <LigneStat label="Clients payants" valeur={(fiche.traction.clients_payants as number) ?? '—'} />
          <LigneStat label="Revenus générés" valeur={formatAr(fiche.traction.revenus_generes_ar as number)} />
          <LigneStat label="Score NPS"       valeur={(fiche.traction.score_nps as number) ?? '—'} />
          <LigneStat label="Taux rétention"  valeur={fiche.traction.taux_retention_pct != null ? `${fiche.traction.taux_retention_pct} %` : '—'} />
        </Section>
      )}

      {fiche.demande_financement && (
        <Section titre="Demande de financement">
          <LigneStat label="Montant souhaité" valeur={formatAr(fiche.demande_financement.montant_ar as number)} />
          <LigneStat label="Type" valeur={String(fiche.demande_financement.type ?? '—')} />
        </Section>
      )}

      {fiche.equipe.length > 0 && (
        <Section titre="Équipe fondatrice">
          {fiche.equipe.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div>
                <p className="text-[12px] text-zinc-800 font-medium">{m.prenom_nom}</p>
                <p className="text-[11px] text-zinc-400">{m.role_projet}</p>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {m.disciplines.map((d) => (
                  <span key={d} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded">{d}</span>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
