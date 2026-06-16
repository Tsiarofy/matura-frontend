import { useState, useRef } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useMissionDetail, useSoumettreReponseMission, useEvaluerMission } from '@/hooks/useMissions'
import { useProjetDetail } from '@/hooks/useStades'
import { authStore } from '@/stores/authStore'
import { ChevronLeft, FileText, CheckCircle, Clock, XCircle, AlertCircle, Upload, Loader2, CheckCircle2, Trash2 } from 'lucide-react'
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

const BADGE_FICHIER: Record<string, { label: string; bg: string }> = {
  PDF: { label: 'PDF', bg: 'bg-red-50 text-red-600' },
  EXCEL: { label: 'Excel/CSV', bg: 'bg-green-50 text-green-700' },
  IMAGE: { label: 'Image', bg: 'bg-purple-50 text-purple-700' },
  VIDEO: { label: 'Vidéo', bg: 'bg-amber-50 text-amber-700' },
}

function BadgeFichierType({ type }: { type: string }) {
  const cfg = BADGE_FICHIER[type] ?? { label: type, bg: 'bg-zinc-100 text-zinc-500' }
  return (
    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', cfg.bg)}>
      {cfg.label}
    </span>
  )
}

function acceptPourType(type: string): string {
  if (type === "PDF") return ".pdf";
  if (type === "IMAGE") return "image/*";
  if (type === "VIDEO") return "video/*";
  if (type === "EXCEL") return ".xlsx,.xls,.csv";
  return "*/*";
}

function FichierRequisRow({ fr, fichierSelectionne, fichierSoumis, onChange }: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:border-green-400 transition-colors">
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <BadgeFichierType type={fr.type} />
          <p className="text-[13px] font-medium text-zinc-800">{fr.description}</p>
        </div>
        {fichierSoumis && !fichierSelectionne && (
          <div className="mt-2 bg-zinc-50 p-2 rounded-lg inline-block border border-zinc-100">
            <p className="text-[10px] text-zinc-400 mb-1 uppercase tracking-wider font-semibold">Fichier actuel :</p>
            <FichierMiniViewer url={fichierSoumis.fichier_url} type={fichierSoumis.fichier_type} nom={fichierSoumis.fichier_nom} />
          </div>
        )}
        {fichierSelectionne && (
          <p className="text-[12px] text-green-700 font-medium truncate flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {fichierSelectionne.name}
          </p>
        )}
        {!fichierSelectionne && !fichierSoumis && (
          <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1">
             <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Ce fichier est requis
          </p>
        )}
      </div>
      <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
        <input ref={inputRef} type="file" className="hidden" accept={acceptPourType(fr.type)} onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-zinc-300 rounded-lg text-[12px] text-zinc-700 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all font-medium">
          <Upload className="w-3.5 h-3.5" />
          {fichierSelectionne ? "Changer" : fichierSoumis ? "Remplacer" : "Ajouter un fichier"}
        </button>
        {fichierSelectionne && (
          <button type="button" onClick={() => onChange(null)} className="text-[11px] text-zinc-400 hover:text-red-500 font-medium px-2 py-1">Retirer</button>
        )}
      </div>
    </div>
  );
}

export default function MissionDetailPage() {
  const { projetId, numStade, missionId } = useParams({ strict: false }) as { projetId: string; numStade: string; missionId: string }
  const num = parseInt(numStade, 10)

  const user = authStore((state) => state.utilisateur);
  const { data: projet } = useProjetDetail(projetId);
  const isMentor = user?.role === "MENTOR" && projet?.mentor?.id === user?.id;

  const { data: mission, isLoading } = useMissionDetail(projetId, num, missionId)
  
  // States for Entrepreneur submission
  const [fichiersMap, setFichiersMap] = useState<Map<string, File>>(new Map());
  const [fichiersSupplementaires, setFichiersSupplementaires] = useState<File[]>([]);
  const [commentaire, setCommentaire] = useState("");
  const soumettre = useSoumettreReponseMission(projetId, num, missionId);

  // States for Mentor evaluation
  const [motifRejet, setMotifRejet] = useState("");
  const [showMotif, setShowMotif] = useState(false);
  const evaluer = useEvaluerMission(projetId, num, missionId);

  if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-400" /></div>
  if (!mission) return <div className="p-12 text-center text-red-500 font-medium">Mission introuvable</div>

  const fichiersSoumis = mission.soumission?.fichiers ?? []
  const fichiersAdditionnels = fichiersSoumis.filter((f: any) => !f.fichier_requis_id)

  // Logic for Entrepreneur
  const peutSoumettre = !isMentor && (mission.statut === "INACHEVEE" || mission.statut === "REJETEE");
  const tousSelectionnes = mission.fichiers_requis.length === 0 || mission.fichiers_requis.every((fr: any) => fichiersMap.has(fr.id) || fichiersSoumis.find((f: any) => f.fichier_requis_id === fr.id));

  const handleFichierChange = (frId: string, file: File | null) => {
    setFichiersMap((prev) => {
      const next = new Map(prev);
      if (file) next.set(frId, file);
      else next.delete(frId);
      return next;
    });
  };

  const handleSoumettre = () => {
    soumettre.mutate({ fichiersMap, fichiersSupplementaires, commentaire }, {
      onSuccess: () => {
        setFichiersMap(new Map());
        setFichiersSupplementaires([]);
        setCommentaire("");
      }
    });
  };

  // Logic for Mentor
  const handleValider = () => evaluer.mutate({ decision: "VALIDEE" });
  const handleRejeter = () => {
    if (!motifRejet.trim()) return;
    evaluer.mutate({ decision: "REJETEE", motif_rejet: motifRejet.trim() }, {
      onSuccess: () => {
        setMotifRejet("");
        setShowMotif(false);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Link to={`/projets/$projetId/stades/$numStade`} params={{ projetId, numStade }} className="inline-flex items-center text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
        <ChevronLeft className="w-4 h-4 mr-1" /> Retour aux missions du stade
      </Link>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <Badge variant="outline" className="text-zinc-500 font-medium">Mission {mission.ordre}</Badge>
              <BadgeStatutMission statut={mission.statut} />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 leading-tight">{mission.titre}</h1>
          </div>
          {mission.date_limite && (
            <div className="text-right bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-100">
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold mb-1">Date limite</p>
              <p className="text-sm font-semibold text-zinc-800">{new Date(mission.date_limite).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-zinc-400" /> Objectif de la mission
            </h3>
            <p className="text-[14px] text-zinc-700 leading-relaxed bg-zinc-50 p-5 rounded-xl border border-zinc-100">{mission.objectif}</p>
          </section>

          {/* Saisie Entrepreneur */}
          {peutSoumettre && (
            <section className="bg-zinc-50/50 p-6 md:p-8 border border-zinc-200 rounded-2xl space-y-8 mt-8 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-zinc-800 flex items-center gap-2 mb-1.5">
                  <Upload className="w-5 h-5 text-green-600" /> Soumettre votre travail
                </h3>
                <p className="text-[13px] text-zinc-500">Veuillez fournir les éléments demandés ci-dessous pour validation par votre mentor.</p>
              </div>

              {mission.statut === "REJETEE" && mission.soumission?.motif_rejet && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
                  <p className="text-[11px] font-bold text-red-600 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> Motif du rejet précédent
                  </p>
                  <p className="text-[14px] text-red-800 font-medium leading-relaxed">{mission.soumission.motif_rejet}</p>
                </div>
              )}

              {mission.fichiers_requis.length > 0 && (
                <div className="space-y-4">
                  <p className="text-[13px] font-semibold text-zinc-800 border-b border-zinc-150 pb-2">Fichiers à fournir obligatoirement <span className="text-red-500">*</span></p>
                  <div className="space-y-3">
                    {mission.fichiers_requis.map((fr: any) => (
                      <FichierRequisRow
                        key={fr.id}
                        fr={fr}
                        fichierSelectionne={fichiersMap.get(fr.id) ?? null}
                        fichierSoumis={fichiersSoumis.find((f: any) => f.fichier_requis_id === fr.id)}
                        onChange={(file: File | null) => handleFichierChange(fr.id, file)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-[13px] font-semibold text-zinc-800 border-b border-zinc-150 pb-2">Documents supplémentaires <span className="font-normal text-zinc-500">(Optionnel)</span></p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center w-full p-8 border-2 border-dashed border-zinc-200 rounded-xl hover:border-green-500 hover:bg-green-50/10 transition-all cursor-pointer group bg-white shadow-inner">
                    <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-green-600 transition-colors">
                      <div className="bg-zinc-50 p-3 rounded-full group-hover:bg-green-50 transition-colors">
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-green-600 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-zinc-600 group-hover:text-green-700">Cliquer pour ajouter des fichiers additionnels</span>
                    </div>
                    <input
                      type="file" multiple className="hidden"
                      onChange={(e) => {
                        if (e.target.files) setFichiersSupplementaires(prev => [...prev, ...Array.from(e.target.files as FileList)]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {fichiersSupplementaires.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {fichiersSupplementaires.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white border border-zinc-200 rounded-lg p-3 text-sm shadow-sm">
                          <div className="flex items-center gap-2 truncate text-zinc-700">
                            <FileText className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="truncate font-medium text-[13px]">{file.name}</span>
                          </div>
                          <button type="button" onClick={() => setFichiersSupplementaires(prev => prev.filter((_, i) => i !== idx))} className="text-zinc-400 hover:text-red-500 bg-zinc-50 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[13px] font-semibold text-zinc-800">Commentaire ou précision <span className="font-normal text-zinc-500">(Optionnel)</span></p>
                <textarea
                  className="w-full text-sm p-4 border border-zinc-300 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-y min-h-[120px] bg-white shadow-sm"
                  placeholder="Ajoutez un commentaire, un lien externe ou une précision pour votre mentor…"
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                />
              </div>

              <div className="pt-6 border-t border-zinc-150 flex justify-end">
                <button
                  type="button"
                  onClick={handleSoumettre}
                  disabled={soumettre.isPending || (mission.fichiers_requis.length > 0 && !tousSelectionnes)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {soumettre.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mission.fichiers_requis.length > 0 ? "Soumettre pour validation" : "Marquer comme terminée"}
                </button>
              </div>
            </section>
          )}

          {/* Vue des fichiers pour le Mentor ou pour Entrepreneur si soumis */}
          {!peutSoumettre && (
            <div className="space-y-8 bg-zinc-50/50 p-6 md:p-8 rounded-2xl border border-zinc-100">
              {/* Fichiers requis */}
              <section>
                <h3 className="text-sm font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" /> Fichiers requis ({(mission.fichiers_requis ?? []).length})
                </h3>
                {(mission.fichiers_requis ?? []).length === 0 ? (
                  <p className="text-[13px] text-zinc-400 italic bg-white p-4 rounded-xl border border-zinc-100">Aucun fichier requis par le mentor.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(mission.fichiers_requis as Array<{ id: string; type: string; description: string }>).map((fr) => {
                      const soumis = fichiersSoumis.find((f: any) => f.fichier_requis_id === fr.id)
                      return (
                        <div key={fr.id} className="flex flex-col gap-3 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <BadgeFichierType type={fr.type} />
                            <p className="text-[13px] font-medium text-zinc-700 line-clamp-2">{fr.description}</p>
                          </div>
                          <div className="pt-3 border-t border-zinc-100">
                            {soumis ? (
                              <FichierMiniViewer url={soumis.fichier_url} type={soumis.fichier_type} nom={soumis.fichier_nom} />
                            ) : (
                              <p className="text-[12px] text-zinc-400 italic flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Non soumis</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* Fichiers additionnels */}
              {fichiersAdditionnels.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" /> Fichiers additionnels ({fichiersAdditionnels.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fichiersAdditionnels.map((f: any) => (
                      <div key={f.id} className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">Additionnel</span>
                        <FichierMiniViewer url={f.fichier_url} type={f.fichier_type} nom={f.fichier_nom} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Soumission détails */}
              {mission.soumission && (
                <section>
                  <h3 className="text-sm font-semibold text-zinc-800 mb-4">Détails de la soumission</h3>
                  <div className="space-y-4">
                    {mission.soumission.commentaire && (
                      <div className="p-5 bg-white rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                        <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-400 mb-2">Commentaire de l'entrepreneur</p>
                        <p className="text-[14px] text-zinc-700 whitespace-pre-wrap leading-relaxed">{mission.soumission.commentaire}</p>
                      </div>
                    )}
                    {mission.soumission.motif_rejet && (
                      <div className="p-5 bg-red-50 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                        <p className="text-[11px] uppercase tracking-wider font-bold text-red-500 mb-2">Motif du rejet</p>
                        <p className="text-[14px] text-red-800 font-medium whitespace-pre-wrap leading-relaxed">{mission.soumission.motif_rejet}</p>
                      </div>
                    )}
                    {mission.soumission.soumis_le && (
                      <p className="text-[12px] text-zinc-500 flex items-center gap-1.5 bg-white px-3 py-2 rounded-lg border border-zinc-100 inline-flex">
                        <Clock className="w-3.5 h-3.5" />
                        Soumis le {new Date(mission.soumission.soumis_le).toLocaleDateString('fr-FR')} à {new Date(mission.soumission.soumis_le).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Validation Mentor */}
          {isMentor && mission.statut === "SOUMISE" && (
            <section className="bg-indigo-50 p-6 md:p-8 border border-indigo-200 rounded-2xl mt-8 shadow-sm">
              <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" /> Évaluation de la mission
              </h3>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleValider}
                    disabled={evaluer.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-[15px] font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {evaluer.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    Valider la mission
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMotif((prev) => !prev)}
                    disabled={evaluer.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 rounded-xl text-[15px] font-semibold transition-all shadow-sm"
                  >
                    <XCircle className="w-5 h-5" /> Signaler un problème (Rejeter)
                  </button>
                </div>
                
                {showMotif && (
                  <div className="p-6 bg-white rounded-xl border border-indigo-100 shadow-inner animate-in fade-in slide-in-from-top-4">
                    <div>
                      <label className="text-[14px] font-bold text-zinc-900 mb-1 block">Motif du rejet</label>
                      <p className="text-[12px] text-zinc-500 mb-3">Expliquez clairement à l'entrepreneur ce qu'il doit corriger ou rajouter.</p>
                      <textarea
                        value={motifRejet}
                        onChange={(e) => setMotifRejet(e.target.value)}
                        rows={4}
                        placeholder="Ex: Le document Excel n'inclut pas les projections sur 3 ans..."
                        className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-[14px] text-zinc-800 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-zinc-50/50"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleRejeter}
                        disabled={!motifRejet.trim() || evaluer.isPending}
                        className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center shadow-md"
                      >
                        {evaluer.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Confirmer le rejet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
