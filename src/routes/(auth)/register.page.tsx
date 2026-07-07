// src/routes/(auth)/register.page.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Sprout, Users, Briefcase, AlertCircle, Loader2, TrendingUp } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const store = authStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setIsLoading(true);
    setError(null);
    try {
      const { data }: { data: AuthResponse } = await apiClient.post(
        "/auth/inscription",
        formData,
      );
      store.setAuth(data.token, data.utilisateur);
      form.reset();
      navigate({ to: "/profil" });
    } catch (err: any) {
      console.error("Erreur d'inscription :", err);
      let errorMsg = "Une erreur est survenue lors de l'inscription.";
      if (err.response) {
        if (err.response.status >= 500) {
          errorMsg = `Le serveur est temporairement indisponible (Erreur ${err.response.status}).`;
        } else if (err.response.data?.message) {
          errorMsg = Array.isArray(err.response.data.message) 
            ? err.response.data.message.join(", ") 
            : err.response.data.message;
        }
      } else if (err.request) {
        errorMsg = "Impossible de joindre le serveur. Veuillez vérifier votre connexion.";
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
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
    <div className="flex min-h-screen flex-col bg-[var(--color-sidebar-surface)] p-4 md:flex-row md:p-5">
      {/* Left Panel – Branding */}
      <div className="hidden w-[47%] flex-col justify-between p-12 md:flex auth-left-panel">
        <div className="auth-stairs" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] border border-[#41A677]/40 bg-[#41A677] shadow-sm">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <p className="text-base font-semibold leading-none text-[var(--color-text-primary)]">Matura</p>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Madagascar</p>
          </div>
        </div>

        {/* Titre */}
        <div>
          <h1 className="mb-5 text-[2.8rem] font-semibold leading-[1.12] tracking-[-0.05em] text-[var(--color-text-primary)]">
            Rejoignez l'écosystème<br />de l'innovation<br />malgache.
          </h1>
          <p className="max-w-[340px] text-[14px] leading-relaxed text-[var(--color-text-muted)]">
            Créez votre compte en quelques secondes et commencez à donner vie à vos idées.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-white px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white border border-[#41A677]">
              <Sprout className="h-4 w-4 text-[#41A677]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-[var(--color-text-primary)]">7 stades de maturation</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">Un parcours validé par des experts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-white px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white border border-[#41A677]">
              <Users className="h-4 w-4 text-[#41A677]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-[var(--color-text-primary)]">Mentors qualifiés</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">Bénéficiez de retours terrain</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-white px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white border border-[#41A677]">
              <TrendingUp className="h-4 w-4 text-[#41A677]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-[var(--color-text-primary)]">Accès aux financements</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">Subventions, prêts, capital</p>
            </div>
          </div>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">© 2026 Matura — Tous droits réservés</p>
        </div>
      </div>


      {/* Right Panel – Registration Form */}
      <div className="flex flex-1 items-center justify-center rounded-[30px] border border-[var(--color-border)] bg-[var(--color-bg-shell)] p-6 md:p-10 lg:p-12">
        <Card className="w-full max-w-xl rounded-[30px] border border-[var(--color-border)] bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-[var(--color-text-primary)]">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-sm text-[var(--color-text-muted)]">
              Choisissez votre profil et commencez l'aventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-[18px] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] p-3 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-error)]" />
                <p className="text-[var(--color-text-primary)]">{error}</p>
              </div>
            )}
            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="nom"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Nom</FieldLabel>
                        <Input {...field} placeholder="Rakoto" className="h-9 text-sm" disabled={isLoading} />
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
                        <Input {...field} placeholder="Jean" className="h-9 text-sm" disabled={isLoading} />
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        {rolesDisponibles.map((r) => {
                          const isSelected = field.value === r.id;
                          let selectedBg = '';
                          let selectedBorder = '';
                          let primaryColor = '';

                          if (isSelected) {
                            if (r.id === 'entrepreneur') {
                              selectedBg = 'bg-[#eafdf3]';
                              selectedBorder = 'border-[#41A677]';
                              primaryColor = '#41A677';
                            } else if (r.id === 'mentor') {
                              selectedBg = 'bg-[#E2F7F6]';
                              selectedBorder = 'border-[#1BA8A0]';
                              primaryColor = '#1BA8A0';
                            } else if (r.id === 'investisseur') {
                              selectedBg = 'bg-[#eef0ff]';
                              selectedBorder = 'border-[#6f74f7]';
                              primaryColor = '#6f74f7';
                            }
                          }

                          return (
                            <label
                              key={r.id}
                              style={isSelected ? { '--primary': primaryColor, borderWidth: '1.5px' } as React.CSSProperties : undefined}
                              className={`flex cursor-pointer items-start gap-3 rounded-[18px] border p-3 transition-colors ${
                                isSelected
                                  ? `${selectedBg} ${selectedBorder}`
                                  : 'border-[var(--color-border)] bg-[var(--color-surface-soft)]/45 hover:bg-[var(--color-surface-soft)]'
                              }`}
                            >
                              <RadioGroupItem value={r.id} id={r.id} className="mt-0.5" />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                  {r.label}
                                </span>
                                <span className="text-xs text-[var(--color-text-muted)]">{r.desc}</span>
                              </div>
                            </label>
                          );
                        })}
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
              variant="success"
              className="h-11 w-full text-sm font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Inscription en cours...</>
              ) : "Créer mon compte"}
            </Button>
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-semibold text-[var(--color-success)] hover:underline"
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
