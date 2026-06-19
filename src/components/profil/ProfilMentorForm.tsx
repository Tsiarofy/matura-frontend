import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProfilMentorSchema, type ProfilMentor } from "@matura/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, User, Plus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
// console.log("logger")

export function ProfilMentorForm() {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["profil", "moi"],
    queryFn: () => apiClient.get("/utilisateurs/moi").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [domaineInput, setDomaineInput] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(
    undefined,
  );

  const urlAvatar = userData?.url_avatar
    ? `${import.meta.env.VITE_BASE_URL}${userData.url_avatar}`
    : undefined;

  const avatarToShow = previewAvatar ?? urlAvatar;

  const form = useForm<any>({
    resolver: zodResolver(ProfilMentorSchema),
    defaultValues: {
      domaines_expertise: [],
      disponible: true,
    },
  });

  const hasReset = useRef(false);

  useEffect(() => {
    if (!userData?.profil) return;
    if (hasReset.current) return;
    hasReset.current = true;
    form.reset({
      ...userData.profil,
      domaines_expertise: userData.profil.domaines_expertise || [],
      disponible: userData.profil.disponible ?? true,
    });
  }, [userData?.profil, form]);

  const mutation = useMutation({
    mutationFn: (data: ProfilMentor) =>
      apiClient.patch("/utilisateurs/moi", data),
    onSuccess: () => {
      toast.success("Profil mis à jour", { description: "Vos informations ont été enregistrées." });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Erreur lors de la mise à jour du profil";
      toast.error("Erreur", { description: Array.isArray(msg) ? msg.join(" · ") : msg });
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return apiClient.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: (response) => {
      const url = response.data.url;
      apiClient.patch("/utilisateurs/moi/avatar", { url_avatar: url });
      // ✅ Nettoie la preview — urlAvatar prendra le relais après le prochain fetch
      setPreviewAvatar(undefined);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Erreur lors de l'upload de l'avatar";
      toast.error("Erreur d'upload", { description: Array.isArray(msg) ? msg.join(" · ") : msg });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Fichier trop lourd", { description: "L'avatar ne doit pas dépasser 2 Mo." });
      return;
    }
    // ✅ Preview immédiate locale sans attendre le serveur
    setPreviewAvatar(URL.createObjectURL(file));
    avatarMutation.mutate(file);
  };

  const addDomaine = () => {
    if (!domaineInput.trim()) return;
    const current = form.getValues("domaines_expertise") || [];
    if (!current.includes(domaineInput.trim())) {
      form.setValue("domaines_expertise", [...current, domaineInput.trim()]);
      setDomaineInput("");
    }
  };

  const removeDomaine = (index: number) => {
    const current = (form.getValues("domaines_expertise") as string[]) || [];
    form.setValue(
      "domaines_expertise",
      current.filter((_: string, i: number) => i !== index),
    );
  };

  const onSubmit = (data: ProfilMentor) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Photo de profil
          </CardTitle>
          <CardDescription>
            Ajoutez une photo pour personnaliser votre profil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden">
              {avatarToShow ? (
                <img
                  src={avatarToShow}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-zinc-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <label htmlFor="avatar">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span className="flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {avatarMutation.isPending
                      ? "Upload..."
                      : "Changer la photo"}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-zinc-500 mt-2">
                JPG, PNG ou GIF (max 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations de mentor</CardTitle>
          <CardDescription>Complétez votre profil de mentor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                placeholder="+261 34 00 000 00"
                {...form.register("telephone")}
              />
              {form.formState.errors.telephone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.telephone.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                placeholder="Antananarivo"
                {...form.register("ville")}
              />
              {form.formState.errors.ville && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.ville.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                placeholder="Analamanga"
                {...form.register("region")}
              />
              {form.formState.errors.region && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.region.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Décrivez votre expertise et votre expérience..."
                maxLength={500}
                {...form.register("bio")}
              />
              <p className="text-xs text-zinc-500">
                {form.watch("bio")?.length || 0}/500 caractères
              </p>
              {form.formState.errors.bio && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bio.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Domaines d'expertise</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Agriculture, Tech, Finance..."
                  value={domaineInput}
                  onChange={(e) => setDomaineInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDomaine();
                    }
                  }}
                />
                <Button type="button" onClick={addDomaine} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.watch("domaines_expertise") || []).map(
                  (domaine: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-zinc-100 px-3 py-1 rounded-full text-sm"
                    >
                      {domaine}
                      <button
                        type="button"
                        onClick={() => removeDomaine(index)}
                        className="text-zinc-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ),
                )}
              </div>
              {form.formState.errors.domaines_expertise && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.domaines_expertise.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="annees_experience">Années d'expérience</Label>
              <Input
                id="annees_experience"
                type="number"
                placeholder="5"
                min="0"
                {...form.register("annees_experience", { valueAsNumber: true })}
              />
              {form.formState.errors.annees_experience && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.annees_experience.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/votre-profil"
                {...form.register("linkedin_url")}
              />
              {form.formState.errors.linkedin_url && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.linkedin_url.message as string}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="disponible"
                {...form.register("disponible")}
                className="w-4 h-4"
              />
              <Label htmlFor="disponible" className="cursor-pointer">
                Je suis disponible pour accompagner des projets
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
              variant="orange"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer le profil"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
