import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useStade, useEnregistrerStade, useSoumettre, useStadeGate, useProjetDetail } from '@/hooks/useStades'
import { toast } from 'sonner'
import { StadeTemplate } from '@/components/projet/StadeTemplate'
import { authStore } from '@/stores/authStore'
import { Loader2, AlertCircle, ChevronLeft } from 'lucide-react'
import { STADE_LABELS_COMPLETS } from '@/lib/constants'
import { Stade1Form } from '@/components/stades/Stade1Form'
import { Stade2Form } from '@/components/stades/Stade2Form'
import { Stade3Form } from '@/components/stades/Stade3Form'
import { Stade4Form } from '@/components/stades/Stade4Form'
import { Stade5Form } from '@/components/stades/Stade5Form'
import { Stade6Form } from '@/components/stades/Stade6Form'
import { Stade7Form } from '@/components/stades/Stade7Form'
import { AideStade1 } from '@/components/stades/AideStade1'
import { MetriquesStade } from '@/components/stades/MetriquesStade'
import { EvaluationStade } from '@/components/stades/EvaluationStade'
import { GatePanel } from '@/components/stades/GatePanel'
import type { StadeData } from '@/hooks/useStades'

// ─── FORMULAIRE PAR STADE ─────────────────────────────────────────────────────

const FORMS: Record<number, React.ComponentType<{ stade: StadeData; onSave: (d: Record<string, unknown>) => void; saving: boolean }>> = {
  1: Stade1Form,
  2: Stade2Form,
  3: Stade3Form,
  4: Stade4Form,
  5: Stade5Form,
  6: Stade6Form,
  7: Stade7Form,
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function StadeNumPage() {
  const { projetId, numStade: numStr } = useParams({
    from: '/(dashboard)/_layout/projets/$projetId/stades/$numStade',
  })
  const numStade = parseInt(numStr, 10)
  const user = authStore((state) => state.utilisateur)

  const { data: stade, isLoading, isError } = useStade(projetId, numStade)
  const { data: gate } = useStadeGate(projetId, numStade)
  const { data: projet } = useProjetDetail(projetId)
  const enregistrer = useEnregistrerStade(projetId, numStade)
  const soumettre = useSoumettre(projetId, numStade)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-green-600" />
      </div>
    )
  }

  if (isError || !stade) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-[13px] text-zinc-500">Stade introuvable ou accès refusé.</p>
      </div>
    )
  }

  const FormComponent = FORMS[numStade]
  const titre = STADE_LABELS_COMPLETS[numStade] ?? `Stade ${numStade}`
  const isMentor = user?.role === 'MENTOR'

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2">
        <Link
          to="/projets/$projetId"
          params={{ projetId }}
          className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Retour au projet
        </Link>
        <span className="text-zinc-300 text-[12px]">/</span>
        <span className="text-[12px] text-zinc-600">{titre}</span>
      </div>

      {/* En-tête stade */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] text-zinc-900">{titre}</h1>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            Version {stade.version} · {stade.completion_pct}% complété
          </p>
        </div>
      </div>

      {/* Gate panel (conditions) */}
      {gate && !isMentor && (
        <GatePanel
          gate={gate}
          statut={stade.statut}
          onSoumettre={() => {
            if (projet && !projet.mentor) {
              toast.error("Veuillez d'abord choisir un mentor", {
                description: "Un mentor est requis pour évaluer vos stades.",
              })
              navigate({ to: '/mentors' })
              return
            }
            soumettre.mutate()
          }}
          submitting={soumettre.isPending}
        />
      )}

      {/* Template 4 onglets */}
      <StadeTemplate
        stade={{
          ...stade,
          // messages_coherence requis par StadeDetail — on fournit un tableau vide si absent
          messages_coherence: stade.messages_coherence ?? [],
        } as import('@matura/shared').StadeDetail}
        ongletsContent={{
          saisie: FormComponent ? (
            <FormComponent
              stade={stade}
              onSave={(donnees) => {
                console.log("# # # # # # ")
                console.log(donnees.contexte_geographique);
                console.log("# # # # # # ")
                return(enregistrer.mutate(donnees))}}
              saving={enregistrer.isPending}
            />
          ) : (
            <p className="text-zinc-500 text-[13px]">Formulaire non disponible</p>
          ),
          aide: numStade === 1 ? <AideStade1 /> : undefined,
          preuves: (
            <div className="text-center py-8 text-[12px] text-zinc-400">
              Upload de preuves — à implémenter
            </div>
          ),
          metriques: <MetriquesStade metriques={stade.metriques} numStade={numStade} />,
          evaluation: <EvaluationStade stade={stade} projetId={projetId} numStade={numStade} />,
        }}
      />
    </div>
  )
}
