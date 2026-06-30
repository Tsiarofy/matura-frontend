import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ConnexionDto, ConnexionSchema, type AuthResponse } from "@matura/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useNavigate } from "@tanstack/react-router";
import { apiClient } from "@/lib/apiClient";
import { authStore } from "@/stores/authStore";
import { Sprout, Users, TrendingUp, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

// ─── Palette Adobe Core 2.0 ───────────────────────────────────────────────────
// #41A677 vert primaire · #8FD9B6 mint · #D7EFE2 mint tint
// #F2B199 saumon secondaire · #F2F2F2 fond · #404040 charcoal

export default function LoginPage() {
  const store = authStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ConnexionDto>({
    resolver: zodResolver(ConnexionSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (dto: ConnexionDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data }: { data: AuthResponse } = await apiClient.post("auth/connexion", dto);
      await store.setAuth(data.token, data.utilisateur);
      navigate({ to: "/dashboard" });
      form.reset();
    } catch (err: any) {
      console.error("Erreur de connexion :", err);
      let errorMsg = "Identifiants incorrects. Veuillez réessayer.";
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

  return (
    <div className="flex min-h-screen bg-[var(--color-sidebar-surface)] p-4 md:p-5">

      {/* ── Panneau gauche — Branding ── */}
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
            <p className="text-base font-semibold leading-none text-[var(--color-text-primary)]">MaturaProj</p>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Madagascar</p>
          </div>
        </div>

        {/* Titre principal */}
        <div>
          <h1 className="mb-5 text-[2.8rem] font-semibold leading-[1.12] tracking-[-0.05em] text-[var(--color-text-primary)]">
            Structurez votre<br />projet, trouvez<br />des financements.
          </h1>
          <p className="max-w-[340px] text-[14px] leading-relaxed text-[var(--color-text-muted)]">
            La plateforme qui guide les entrepreneurs malgaches de l'idée à la réalisation,
            avec l'accompagnement de mentors et d'investisseurs.
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
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">Un parcours structuré, validé par des experts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-white px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white border border-[#41A677]">
              <Users className="h-4 w-4 text-[#41A677]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-[var(--color-text-primary)]">Mentors qualifiés</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">Bénéficiez de retours d'expérience terrain</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-[20px] border border-[var(--color-border)] bg-white px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white border border-[#41A677]">
              <TrendingUp className="h-4 w-4 text-[#41A677]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-[var(--color-text-primary)]">Accès aux financements</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">Subventions, prêts d'honneur, capital</p>
            </div>
          </div>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">© 2026 MaturaProj — Tous droits réservés</p>
        </div>
      </div>

      {/* ── Panneau droit — Formulaire ── */}
      <div className="flex flex-1 items-center justify-center rounded-[30px] border border-[var(--color-border)] bg-[var(--color-bg-shell)] p-8">
        <div className="w-full max-w-[420px]">

          {/* Logo mobile */}
          <div className="flex md:hidden items-center gap-3 mb-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-[var(--color-success-border)] bg-[var(--color-success)]">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="text-base font-semibold text-[var(--color-text-primary)]">MaturaProj</span>
          </div>

          {/* En-tête */}
          <div className="mb-8">
            <h2 className="mb-1 text-[1.9rem] font-semibold leading-tight tracking-[-0.04em] text-[var(--color-text-primary)]">
              Bienvenue !
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div
              className="mb-5 flex items-start gap-2.5 rounded-[18px] border border-[var(--color-error-border)] bg-[var(--color-error-bg)] p-3 text-sm"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-error)]" />
              <p className="text-[var(--color-text-primary)]">{error}</p>
            </div>
          )}

          {/* Formulaire */}
          <Form {...form}>
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-medium text-[var(--color-text-primary)]">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="vous@exemple.mg"
                        className="h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-1.5">
                      <FormLabel className="text-[13px] font-medium text-[var(--color-text-primary)]">Mot de passe</FormLabel>
                      <a
                        href="#"
                        className="text-xs font-medium text-[var(--color-success)] hover:underline"
                      >
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 pr-11"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* CTA */}
          <Button
            type="submit"
            form="login-form"
            variant="success"
            className="mt-6 h-11 w-full text-sm font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connexion en cours...</>
            ) : "Se connecter"}
          </Button>

          {/* Lien inscription */}
          <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold text-[var(--color-success)] hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
