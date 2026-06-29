import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import {
  useFormationDetail,
  useModifierFormation,
  useModifierLesson,
  useSupprimerFormation,
  useSupprimerLesson,
} from "@/hooks/useFormations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  ArrowLeft,
  Plus,
  PlayCircle,
  Pencil,
  Trash2,
  UploadCloud,
  Link as LinkIcon,
  Video,
} from "lucide-react";
import {
  DOMAINE_LABELS,
  STADE_LABELS,
  TYPE_CIBLE_LABELS,
} from "@/lib/constants";

const formationSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(150),
  description: z.string().max(1000).optional(),
  domaine: z.string().min(1, "Le domaine est requis"),
  stade_cible: z.any().optional(),
  type_cible: z.any().optional(),
});

const lessonSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(150),
  ordre: z.number().min(1, "L'ordre doit etre superieur a 0"),
  url_video: z.string().optional(),
  contenu_texte: z.string().min(1, "Le contenu texte est requis"),
});

type FormationFormValues = z.infer<typeof formationSchema>;
type LessonFormValues = z.infer<typeof lessonSchema>;

export default function MesFormationsDetailPage() {
  const { formationId } = useParams({
    from: "/(dashboard)/_layout/mes-formations/$formationId/",
  });
  const navigate = useNavigate();
  const { data: formation, isLoading } = useFormationDetail(formationId);
  const modifierFormation = useModifierFormation(formationId);
  const supprimerFormation = useSupprimerFormation();
  const supprimerLesson = useSupprimerLesson(formationId);

  const [formationDialogOpen, setFormationDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedLesson =
    formation?.lessons.find((lesson) => lesson.id === selectedLessonId) ?? null;
  const modifierLesson = useModifierLesson(formationId, selectedLessonId ?? "");

  const {
    register: registerFormation,
    handleSubmit: handleFormationSubmit,
    reset: resetFormation,
    formState: { errors: formationErrors },
  } = useForm<FormationFormValues>({
    resolver: zodResolver(formationSchema),
  });

  const {
    register: registerLesson,
    handleSubmit: handleLessonSubmit,
    reset: resetLesson,
    formState: { errors: lessonErrors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
  });

  useEffect(() => {
    if (!formation) return;
    resetFormation({
      titre: formation.titre,
      description: formation.description ?? "",
      domaine: formation.domaine,
      stade_cible: formation.stade_cible ?? "",
      type_cible: formation.type_cible ?? "",
    });
  }, [formation, resetFormation]);

  useEffect(() => {
    if (!selectedLesson) return;
    resetLesson({
      titre: selectedLesson.titre,
      ordre: selectedLesson.ordre,
      url_video: selectedLesson.url_video,
      contenu_texte: selectedLesson.contenu_texte,
    });
  }, [selectedLesson, resetLesson]);

  const handleDeleteFormation = () => {
    if (!formation) return;
    const confirmed = window.confirm(
      `Supprimer la formation "${formation.titre}" ? Cette action supprimera aussi toutes ses lecons et peut impacter des entrepreneurs qui la consultent deja.`,
    );
    if (!confirmed) return;
    supprimerFormation.mutate(formation.id, {
      onSuccess: () => navigate({ to: "/mes-formations" }),
    });
  };

  const handleDeleteLesson = (lessonId: string, titre: string) => {
    const confirmed = window.confirm(
      `Supprimer la lecon "${titre}" ? Cette action est irreversible.`,
    );
    if (!confirmed) return;
    supprimerLesson.mutate(lessonId);
  };

  const openLessonEditor = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setUploadMode("url");
    setVideoFile(null);
    setLessonDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="text-zinc-500 text-center py-12">
        Formation introuvable.
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: "/mes-formations" })}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-600" />
            </button>
            <div>
              <h1 className="text-[18px] text-zinc-900 font-semibold">
                {formation.titre}
              </h1>
              <p className="text-[12px] text-zinc-500">
                {DOMAINE_LABELS[formation.domaine] || formation.domaine}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFormationDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-[13px] font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <Pencil className="w-4 h-4" />
              Modifier
            </button>
            <button
              type="button"
              onClick={handleDeleteFormation}
              disabled={supprimerFormation.isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {supprimerFormation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Supprimer
            </button>
            <button
              onClick={() =>
                navigate({
                  to: "/mes-formations/$formationId/lessons/creer",
                  params: { formationId: formation.id },
                })
              }
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter une leçon
            </button>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[14px] font-medium text-zinc-800">
              Détails de la formation
            </h2>
            <span className="text-[11px] text-zinc-400">
              {formation.nombre_lessons} leçon
              {formation.nombre_lessons > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-[13px] text-zinc-600">
            {formation.description || "Aucune description fournie."}
          </p>

          <div className="flex flex-wrap gap-2">
            {formation.stade_cible && (
              <span className="text-[11px] bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-medium border border-amber-100">
                Stade {formation.stade_cible} -{" "}
                {STADE_LABELS[formation.stade_cible]}
              </span>
            )}
            {formation.type_cible && (
              <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium border border-blue-100">
                {TYPE_CIBLE_LABELS[formation.type_cible]}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-[15px] font-medium text-zinc-800">
            Leçons ({formation.nombre_lessons})
          </h2>
          {formation.lessons.length === 0 ? (
            <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-xl p-8 text-center">
              <p className="text-[13px] text-zinc-500 mb-3">
                Aucune leçon n'a encore été ajoutée.
              </p>
              <button
                onClick={() =>
                  navigate({
                    to: "/mes-formations/$formationId/lessons/creer",
                    params: { formationId: formation.id },
                  })
                }
                className="text-green-600 text-[13px] font-medium hover:underline"
              >
                Créer la première leçon
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {formation.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between gap-4 bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-8 h-8 rounded-[6px] bg-[#eef0ff] flex items-center justify-center text-[#3840C0] text-[12px] font-semibold shrink-0">
                      {lesson.ordre}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-medium text-zinc-900 truncate">
                        {lesson.titre}
                      </h3>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {lesson.url_video}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openLessonEditor(lesson.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50"
                      aria-label={`Modifier ${lesson.titre}`}
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteLesson(lesson.id, lesson.titre)
                      }
                      disabled={
                        supprimerLesson.isPending &&
                        supprimerLesson.variables === lesson.id
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                      aria-label={`Supprimer ${lesson.titre}`}
                      title="Supprimer"
                    >
                      {supprimerLesson.isPending &&
                      supprimerLesson.variables === lesson.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      to="/mes-formations/$formationId/lessons/$lessonId"
                      params={{
                        formationId: formation.id,
                        lessonId: lesson.id,
                      }}
                      className="flex items-center gap-1.5 text-[12px] text-green-600 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Aperçu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={formationDialogOpen} onOpenChange={setFormationDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier la formation</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations visibles par les entrepreneurs.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleFormationSubmit((data) => {
              modifierFormation.mutate(
                {
                  titre: data.titre,
                  description: data.description || undefined,
                  domaine: data.domaine as never,
                  stade_cible:
                    typeof data.stade_cible === "number"
                      ? data.stade_cible
                      : undefined,
                  type_cible: (data.type_cible as never) || undefined,
                },
                {
                  onSuccess: () => setFormationDialogOpen(false),
                },
              );
            })}
            className="space-y-4"
          >
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Titre *
              </label>
              <input
                {...registerFormation("titre")}
                className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
              {formationErrors.titre && (
                <p className="text-red-500 text-[11px] mt-1">
                  {formationErrors.titre.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Description
              </label>
              <textarea
                {...registerFormation("description")}
                rows={4}
                className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
              {formationErrors.description && (
                <p className="text-red-500 text-[11px] mt-1">
                  {formationErrors.description.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Domaine *
              </label>
              <select
                {...registerFormation("domaine")}
                className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              >
                <option value="">Sélectionner un domaine</option>
                {Object.entries(DOMAINE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {formationErrors.domaine && (
                <p className="text-red-500 text-[11px] mt-1">
                  {formationErrors.domaine.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                  Stade cible
                </label>
                <select
                  {...registerFormation("stade_cible")}
                  className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  <option value="">Tous les stades</option>
                  {Object.entries(STADE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      Stade {value} - {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                  Type cible
                </label>
                <select
                  {...registerFormation("type_cible")}
                  className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  <option value="">Tous les types</option>
                  {Object.entries(TYPE_CIBLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setFormationDialogOpen(false)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={modifierFormation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-green-700 disabled:opacity-60"
              >
                {modifierFormation.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Enregistrer
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier la leçon</DialogTitle>
            <DialogDescription>
              Ajustez le contenu sans recréer la leçon.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleLessonSubmit(async (data) => {
              if (!selectedLessonId) return;
              
              let finalVideoUrl = data.url_video;

              if (uploadMode === "file") {
                if (!videoFile) {
                  toast.error("Veuillez sélectionner un fichier vidéo");
                  return;
                }
                try {
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append("video", videoFile);
                  const res = await apiClient.post("/upload/video", formData, {
                    timeout: 0,
                    onUploadProgress: (progressEvent) => {
                      if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                      }
                    }
                  });
                  finalVideoUrl = res.data.url;
                } catch (e) {
                  console.error("Erreur d'upload", e);
                  toast.error("Erreur lors de l'upload de la vidéo");
                  setIsUploading(false);
                  setUploadProgress(0);
                  return;
                } finally {
                  setIsUploading(false);
                  setUploadProgress(0);
                }
              }

              if (!finalVideoUrl) {
                toast.error("Une URL de vidéo ou un fichier est requis");
                return;
              }

              modifierLesson.mutate({ ...data, url_video: finalVideoUrl }, {
                onSuccess: () => setLessonDialogOpen(false),
              });
            })}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                  Titre *
                </label>
                <input
                  {...registerLesson("titre")}
                  className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
                {lessonErrors.titre && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {lessonErrors.titre.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                  Ordre *
                </label>
                <input
                  type="number"
                  {...registerLesson("ordre", { valueAsNumber: true })}
                  className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
                {lessonErrors.ordre && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {lessonErrors.ordre.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Vidéo de la leçon *
              </label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`flex-1 flex justify-center items-center gap-2 py-2 border rounded-lg text-[13px] transition-all ${
                    uploadMode === "url"
                      ? "border-green-600 text-green-700 bg-green-50"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" /> URL externe
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`flex-1 flex justify-center items-center gap-2 py-2 border rounded-lg text-[13px] transition-all ${
                    uploadMode === "file"
                      ? "border-green-600 text-green-700 bg-green-50"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <UploadCloud className="w-4 h-4" /> Uploader un fichier
                </button>
              </div>

              {uploadMode === "url" ? (
                <input
                  {...registerLesson("url_video")}
                  className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                />
              ) : (
                <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer relative overflow-hidden">
                  <input
                    type="file"
                    accept="video/mp4,video/x-m4v,video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Video className="w-8 h-8 text-zinc-400 mb-2" />
                  <p className="text-[13px] font-medium text-zinc-700">
                    {videoFile ? videoFile.name : "Cliquez ou glissez une vidéo"}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">MP4, MOV, AVI jusqu'à 500MB</p>
                </div>
              )}
              {lessonErrors.url_video && uploadMode === "url" && (
                <p className="text-red-500 text-[11px] mt-1">
                  {lessonErrors.url_video.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[13px] font-medium text-zinc-700 mb-1">
                Contenu texte *
              </label>
              <textarea
                {...registerLesson("contenu_texte")}
                rows={12}
                className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 font-mono outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
              />
              {lessonErrors.contenu_texte && (
                <p className="text-red-500 text-[11px] mt-1">
                  {lessonErrors.contenu_texte.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setLessonDialogOpen(false)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={modifierLesson.isPending || isUploading}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-green-700 disabled:opacity-60 relative overflow-hidden"
              >
                {isUploading && (
                  <div 
                    className="absolute inset-0 bg-green-500/20" 
                    style={{ width: `${uploadProgress}%`, transition: 'width 0.3s' }} 
                  />
                )}
                {(modifierLesson.isPending || isUploading) && (
                  <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                )}
                <span className="relative z-10">
                  {isUploading ? `Upload en cours... ${uploadProgress}%` : "Enregistrer"}
                </span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
