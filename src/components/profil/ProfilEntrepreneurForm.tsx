import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ProfilEntrepreneurSchema,
  type ProfilEntrepreneur,
} from "@matura/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient, getFileUrl } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Upload, User } from "lucide-react";

export function ProfilEntrepreneurForm() {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["profil", "moi"],
    queryFn: () => apiClient.get("/utilisateurs/moi").then((res) => res.data),
  });

  const form = useForm<ProfilEntrepreneur>({
    resolver: zodResolver(ProfilEntrepreneurSchema),
    defaultValues: {},
  });

  const [urlAvatar, setUrlAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.profil && !form.formState.isDirty) {
      console.log(
        "Initialisation du formulaire avec les données utilisateur:",
        userData.profil,
      );
      setUrlAvatar(getFileUrl(userData.url_avatar) || null);
      form.reset(userData.profil);
    }
  }, [userData, form]);

  const mutation = useMutation({
    mutationFn: (data: ProfilEntrepreneur) =>
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
      // console.log("before the upload")
      // console.log(formData);
      // console.log("after the upload")
      return apiClient.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    },
    onSuccess: (response) => {
      const rawUrl = response.data.url;
      console.log("Avatar uploadé avec succès, URL:", rawUrl);
      setUrlAvatar(getFileUrl(rawUrl) || null);
      apiClient.patch("/utilisateurs/moi/avatar", { url_avatar: rawUrl });
    },
    onError: (error) => {
      console.error("Erreur lors de l'upload de l'avatar:", error);
      console.error(error);
      toast.error("Erreur", { description: "Erreur lors de l'upload de la photo de profil" });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Fichier trop lourd", { description: "L'avatar ne doit pas dépasser 2 Mo." });
        return;
      }
      avatarMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const onSubmit = (data: ProfilEntrepreneur) => {
    mutation.mutate(data);
  };

  // console
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
              {urlAvatar ? (
                <img
                  src={urlAvatar}
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
                    Changer la photo
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

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Complétez votre profil d'entrepreneur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                placeholder="+261 34 00 000 00"
                {...form.register("telephone")}
              />
              {form.formState.errors.telephone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.telephone.message}
                </p>
              )}
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                placeholder="Antananarivo"
                {...form.register("ville")}
              />
              {form.formState.errors.ville && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.ville.message}
                </p>
              )}
            </div>

            {/* Région */}
            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                placeholder="Analamanga"
                {...form.register("region")}
              />
              {form.formState.errors.region && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.region.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Décrivez-vous en quelques mots..."
                maxLength={500}
                {...form.register("bio")}
              />
              <p className="text-xs text-zinc-500">
                {form.watch("bio")?.length || 0}/500 caractères
              </p>
              {form.formState.errors.bio && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.bio.message}
                </p>
              )}
            </div>

            {/* Secteur d'activité */}
            <div className="space-y-2">
              <Label htmlFor="secteur_activite">Secteur d'activité</Label>
              <Input
                id="secteur_activite"
                placeholder="Agriculture, Tech, Commerce..."
                {...form.register("secteur_activite")}
              />
              {form.formState.errors.secteur_activite && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.secteur_activite.message}
                </p>
              )}
            </div>

            {/* Parcours */}
            <div className="space-y-2">
              <Label htmlFor="parcours">Parcours</Label>
              <Textarea
                id="parcours"
                placeholder="Décrivez votre parcours professionnel et entrepreneurial..."
                maxLength={1000}
                {...form.register("parcours")}
              />
              <p className="text-xs text-zinc-500">
                {form.watch("parcours")?.length || 0}/1000 caractères
              </p>
              {form.formState.errors.parcours && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.parcours.message}
                </p>
              )}
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/votre-profil"
                {...form.register("linkedin_url")}
              />
              {form.formState.errors.linkedin_url && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.linkedin_url.message}
                </p>
              )}
            </div>

            {/* Type cible */}
            <div className="space-y-2">
              <Label htmlFor="type_cible">Type de clientèle cible</Label>
              <Select
                value={form.watch("type_cible") || ""}
                onValueChange={(value) =>
                  form.setValue("type_cible", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2C">B2C (Particuliers)</SelectItem>
                  <SelectItem value="B2B">B2B (Entreprises)</SelectItem>
                  <SelectItem value="B2B2C">B2B2C (Mixte)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type_cible && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.type_cible.message}
                </p>
              )}
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
