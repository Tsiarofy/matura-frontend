import { useParams, Link } from '@tanstack/react-router'
import { useMissionDetail } from '@/hooks/useMissions'
import { ChevronLeft, FileText, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FichierMiniViewer } from '@/components/shared/FichierMiniViewer'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

function BadgeStatutMission({ statut }: { statut: string }) {
  const statuts: Record<string, { label: string; classes: string; icon: ReactNode }> = {
    INACHEVEE: { label: 'Inachevée', classes: 'bg-zinc-100 text-zinc-600', icon: <Clock className="w-3 h-3" /> },
    SOUMISE: { label: 'En revue', classes: 'bg-blue-50 text-blue-600', icon: <Clock className="w-3 h-3" /> },
    VALIDEE: { label: 'Validée', classes: 'bg-green-50 text-green-600', icon: <CheckCircle className="w-3 h-3" /> },
    REJETEE: { label: 'À refaire', classes: 'bg-red-50 text-red-600', icon: <XCircle className="w-3 h-3" /> },
  }
  const current = statuts[statut] ?? statuts['INACHEVEE']
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium', current.classes)}>
      {current.icon}
      {current.label}
    </span>
  )
}

export default function MissionDetailPage() {
  const { projetId, numStade, missionId } = useParams({ strict: false }) as {
    projetId: string
    numStade: string
    missionId: string
  }
  const num = parseInt(numStade, 10)

  const { data: mission, isLoading } = useMissionDetail(projetId, num, missionId)

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Chargement...</div>
  }

  if (!mission) {
    return <div className="p-8 text-center text-red-500">Mission introuvable</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Link
        to={`/projets/$projetId/stades/$numStade`}
        params={{ projetId, numStade }}
        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Retour aux missions du stade
      </Link>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-zinc-500">
                Mission {mission.ordre}
              </Badge>
              <BadgeStatutMission statut={mission.statut} />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900">{mission.titre}</h1>
          </div>
          {mission.date_limite && (
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Date limite</p>
              <p className="text-sm font-medium text-zinc-800">
                {new Date(mission.date_limite).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-zinc-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-400" />
              Objectif de la mission
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-lg border border-zinc-100">
              {mission.objectif}
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                Preuve attendue
              </h3>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <p className="text-sm text-zinc-700 font-medium mb-1">
                  {mission.type_preuve_attendue === 'AUCUN' ? 'Aucun fichier requis' : `Fichier ${mission.type_preuve_attendue}`}
                </p>
                <p className="text-xs text-zinc-500">
                  {mission.preuve_obligatoire ? 'Cette preuve est obligatoire' : 'Cette preuve est optionnelle'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-800 mb-2">Soumission</h3>
              {mission.soumission ? (
                <div className="space-y-3">
                  {mission.soumission.fichier_url && (
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                      <FichierMiniViewer 
                        url={mission.soumission.fichier_url}
                        type={mission.soumission.fichier_type ?? ''}
                        nom={mission.soumission.fichier_nom ?? 'Fichier'}
                      />
                    </div>
                  )}
                  {mission.soumission.commentaire && (
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                      <p className="text-xs font-medium text-zinc-500 mb-1">Commentaire ou note</p>
                      <p className="text-sm text-zinc-700 whitespace-pre-wrap">{mission.soumission.commentaire}</p>
                    </div>
                  )}
                  {mission.soumission.motif_rejet && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-xs font-medium text-red-500 mb-1">Motif du rejet par le mentor</p>
                      <p className="text-sm text-red-700 whitespace-pre-wrap">{mission.soumission.motif_rejet}</p>
                    </div>
                  )}
                  <p className="text-xs text-zinc-400">
                    Soumis le {new Date(mission.soumission.soumis_le).toLocaleDateString('fr-FR')} à {new Date(mission.soumission.soumis_le).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center text-sm text-zinc-500 italic">
                  Aucune soumission pour le moment
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
