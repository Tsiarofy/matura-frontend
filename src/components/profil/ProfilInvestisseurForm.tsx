import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ProfilInvestisseurSchema,
  type ProfilInvestisseur,
  SousTypeInvestisseurEnum,
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
import { Loader2, Upload, User, Plus, X } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";

export function ProfilInvestisseurForm() {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["profil", "moi"],
    queryFn: () => apiClient.get("/utilisateurs/moi").then((res) => res.data),
  });

  const [domaineInput, setDomaineInput] = useState("");
  const [urlAvatar, setUrlAvatar] = useState<string | null>(null);

  const form = useForm<ProfilInvestisseur>({
    resolver: zodResolver(ProfilInvestisseurSchema),
    defaultValues: {
      domaines_interet: [],
    },
  });

  useEffect(() => {
    if (userData?.profil && !form.formState.isDirty) {
      setUrlAvatar(getFileUrl(userData.url_avatar) || undefined);
      form.reset({
        ...userData.profil,
        domaines_interet: userData.profil.domaines_interet || [],
      });
    }
  }, [userData?.profil]);

  const mutation = useMutation({
    mutationFn: (data: ProfilInvestisseur) =>
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
      const urlAvatarResponse = response.data.url;
      setUrlAvatar(urlAvatarResponse);
      apiClient.patch("/utilisateurs/moi/avatar", {
        url_avatar: urlAvatarResponse,
      });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Erreur lors de l'upload de l'avatar";
      toast.error("Erreur d'upload", { description: Array.isArray(msg) ? msg.join(" · ") : msg });
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

  const addDomaine = useCallback(() => {
    if (domaineInput.trim()) {
      const current = form.getValues("domaines_interet") || [];
      if (!current.includes(domaineInput.trim())) {
        form.setValue("domaines_interet", [...current, domaineInput.trim()], {
          shouldValidate: true,
        });
        setDomaineInput("");
      }
    }
  }, [domaineInput, form]);

  const removeDomaine = useCallback(
    (index: number) => {
      const current = form.getValues("domaines_interet") || [];
      form.setValue(
        "domaines_interet",
        current.filter((_: string, i: number) => i !== index),
        { shouldValidate: true },
      );
    },
    [form],
  );

  const sousTypes = useMemo(() => SousTypeInvestisseurEnum.options, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const onSubmit = (data: ProfilInvestisseur) => {
    mutation.mutate(data);
  };

  const imageSrc = urlAvatar?.startsWith("blob:")
    ? urlAvatar
    : `${import.meta.env.VITE_BASE_URL}${urlAvatar}`;

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
                  src={imageSrc}
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
                    {avatarMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
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

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations d'investisseur</CardTitle>
          <CardDescription>
            Complétez votre profil d'investisseur
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
                  {String(form.formState.errors.telephone.message)}
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
                  {String(form.formState.errors.ville.message)}
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
                  {String(form.formState.errors.region.message)}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Décrivez votre profil d'investisseur..."
                maxLength={500}
                {...form.register("bio")}
              />
              <p className="text-xs text-zinc-500">
                {form.watch("bio")?.length || 0}/500 caractères
              </p>
              {form.formState.errors.bio && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.bio.message)}
                </p>
              )}
            </div>

            {/* Sous type */}
            <div className="space-y-2">
              <Label htmlFor="sous_type">Type d'investisseur</Label>
              <Select
                value={form.watch("sous_type") || ""}
                onValueChange={(value) =>
                  form.setValue("sous_type", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  {sousTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.sous_type && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.sous_type.message)}
                </p>
              )}
            </div>

            {/* Domaines d'intérêt */}
            <div className="space-y-2">
              <Label>Domaines d'intérêt</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Agriculture, Tech, Finance..."
                  value={domaineInput}
                  onChange={(e) => setDomaineInput(e.target.value)}
                  onBlur={() => addDomaine()} 
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
                {(form.watch("domaines_interet") || []).map(
                  (domaine: string, index: number) => (
                    <div
                      key={domaine}
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
              {form.formState.errors.domaines_interet && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.domaines_interet.message)}
                </p>
              )}
            </div>

            {/* Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min_ar">Budget minimum (Ar)</Label>
                <Input
                  id="budget_min_ar"
                  type="number"
                  placeholder="1000000"
                  min="0"
                  {...form.register("budget_min_ar", { valueAsNumber: true })}
                />
                {form.formState.errors.budget_min_ar && (
                  <p className="text-sm text-red-500">
                    {String(form.formState.errors.budget_min_ar.message)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget_max_ar">Budget maximum (Ar)</Label>
                <Input
                  id="budget_max_ar"
                  type="number"
                  placeholder="10000000"
                  min="0"
                  {...form.register("budget_max_ar", { valueAsNumber: true })}
                />
                {form.formState.errors.budget_max_ar && (
                  <p className="text-sm text-red-500">
                    {String(form.formState.errors.budget_max_ar.message)}
                  </p>
                )}
              </div>
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
                  {String(form.formState.errors.linkedin_url.message)}
                </p>
              )}
            </div>

            {/* Site web */}
            <div className="space-y-2">
              <Label htmlFor="site_web">Site web</Label>
              <Input
                id="site_web"
                placeholder="https://votre-site.com"
                {...form.register("site_web")}
              />
              {form.formState.errors.site_web && (
                <p className="text-sm text-red-500">
                  {String(form.formState.errors.site_web.message)}
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
