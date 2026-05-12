// src/routes/(auth)/register.page.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  InscriptionSchema,
  type InscriptionDto,
  type AuthResponse,
} from "@matura/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, Link } from "@tanstack/react-router";
import { apiClient } from "@/lib/apiClient";
import { authStore } from "@/stores/authStore";
import { Sprout, Users, Briefcase } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const store = authStore();

  const form = useForm<InscriptionDto>({
    resolver: zodResolver(InscriptionSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "ENTREPRENEUR",
    },
  });

  const onSubmit = async (formData: InscriptionDto) => {
    try {
      const { data }: { data: AuthResponse } = await apiClient.post(
        "/auth/inscription",
        formData,
      );
      store.setAuth(data.token, data.utilisateur);
      form.reset();
      navigate({ to: "/profil" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erreur d'inscription :",
          error.response?.data?.message || error.message,
        );
      } else {
        console.error("Une erreur inattendue est survenue", error);
      }
    }
  };

  const rolesDisponibles = [
    {
      id: "ENTREPRENEUR",
      label: "Entrepreneur",
      desc: "Structurez votre projet et accédez aux financements.",
      icon: Sprout,
    },
    {
      id: "MENTOR",
      label: "Mentor",
      desc: "Accompagnez des porteurs de projet avec votre expertise.",
      icon: Users,
    },
    {
      id: "INVESTISSEUR",
      label: "Investisseur",
      desc: "Découvrez des projets innovants à financer.",
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50">
      {/* Left Panel – Branding (identique à login, cohérence) */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div
              className="h-8 w-8 rounded-xl flex items-center justify-center"
              style={{ background: '#41A677', boxShadow: '0 4px 16px rgba(65,166,119,0.35)' }}
            >
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-lg font-medium text-zinc-900">MaturaProj</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-zinc-900 mb-3">
            Rejoignez l'écosystème<br />de l'innovation malgache.
          </h1>
          <p className="text-sm text-zinc-500 max-w-md">
            Créez votre compte en quelques secondes et commencez à donner vie à
            vos idées.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {rolesDisponibles.map((role) => {
            const Icon = role.icon;
            return (
              <div key={role.id} className="flex items-start gap-3">
                <div className="p-2 rounded-xl flex items-center justify-center" style={{ background: '#D7EFE2' }}>
                  <Icon className="h-4 w-4" style={{ color: '#41A677' }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">{role.label}</p>
                  <p className="text-xs text-zinc-500">{role.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-zinc-400 mt-8">
          © 2026 MaturaProj — Tous droits réservés
        </p>
      </div>

      {/* Right Panel – Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-12">
        <Card className="w-full max-w-xl border-0.5 border-zinc-200 shadow-none bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-medium text-zinc-900">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Choisissez votre profil et commencez l'aventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="nom"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Nom</FieldLabel>
                        <Input {...field} placeholder="Rakoto" className="h-9 text-sm" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="prenom"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Prénom</FieldLabel>
                        <Input {...field} placeholder="Jean" className="h-9 text-sm" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email professionnel</FieldLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="jean.rakoto@exemple.mg"
                        className="h-9 text-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Mot de passe</FieldLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="h-9 text-sm"
                      />
                      <FieldDescription className="text-xs">
                        8 caractères min. (1 majuscule, 1 chiffre)
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FieldSet>
                      <FieldLegend>Type de profil</FieldLegend>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid grid-cols-1 gap-2"
                      >
                        {rolesDisponibles.map((r) => (
                          <label
                            key={r.id}
                            className={`flex items-start gap-3 p-3 rounded-md border-0.5 cursor-pointer transition-colors ${
                              field.value === r.id
                                ? 'border-[#41A677] bg-[#D7EFE2]/30'
                                : 'border-zinc-200 hover:bg-zinc-50'
                            }`}
                          >
                            <RadioGroupItem value={r.id} id={r.id} className="mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-800">
                                {r.label}
                              </span>
                              <span className="text-xs text-zinc-500">{r.desc}</span>
                            </div>
                          </label>
                        ))}
                      </RadioGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </FieldSet>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              form="register-form"
              className="w-full h-11 rounded-xl text-sm font-semibold"
              style={{ background: '#41A677', color: '#fff' }}
            >
              Créer mon compte
            </Button>
            <p className="text-sm text-zinc-500 text-center">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline" style={{ color: '#41A677' }}
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}