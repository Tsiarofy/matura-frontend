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
      setError(err.response?.data?.message || "Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#F2F2F2" }}>

      {/* ── Panneau gauche — Branding ── */}
      <div className="relative hidden md:flex w-[48%] flex-col justify-between p-12 overflow-hidden">

        {/* Blobs décoratifs palette Adobe */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full" style={{ background: "#D7EFE2", opacity: 0.75 }} />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full" style={{ background: "#8FD9B6", opacity: 0.22 }} />
          <div className="absolute top-1/3 right-0 w-48 h-48 rounded-full" style={{ background: "#F2B199", opacity: 0.25 }} />
          <div className="absolute bottom-1/4 -right-8 w-32 h-32 rounded-full" style={{ background: "#F2B199", opacity: 0.15 }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "#41A677", boxShadow: "0 4px 16px rgba(65,166,119,0.35)" }}
          >
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <p className="text-base font-semibold leading-none" style={{ color: "#404040" }}>MaturaProj</p>
            <p className="text-xs mt-0.5" style={{ color: "#404040", opacity: 0.5 }}>Madagascar</p>
          </div>
        </div>

        {/* Titre principal */}
        <div className="relative z-10">
          <h1 className="text-[2.6rem] font-bold leading-[1.18] mb-5" style={{ color: "#404040" }}>
            Structurez votre<br />projet, trouvez<br />des financements.
          </h1>
          <p className="text-sm leading-relaxed max-w-[300px]" style={{ color: "#404040", opacity: 0.55 }}>
            La plateforme qui guide les entrepreneurs malgaches de l'idée à la réalisation,
            avec l'accompagnement de mentors et d'investisseurs.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 flex flex-col gap-3">
          {[
            { Icon: Sprout, label: "7 stades de maturation", sub: "Un parcours structuré, validé par des experts" },
            { Icon: Users, label: "Mentors qualifiés", sub: "Bénéficiez de retours d'expérience terrain" },
            { Icon: TrendingUp, label: "Accès aux financements", sub: "Subventions, prêts d'honneur, capital" },
          ].map(({ Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#D7EFE2" }}>
                <Icon className="w-4 h-4" style={{ color: "#41A677" }} />
              </div>
              <div>
                <p className="text-[13px] font-semibold leading-tight" style={{ color: "#404040" }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#404040", opacity: 0.5 }}>{sub}</p>
              </div>
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: "#404040", opacity: 0.35 }}>© 2026 MaturaProj — Tous droits réservés</p>
        </div>
      </div>

      {/* ── Panneau droit — Formulaire ── */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#FAFAFB" }}>
        <div className="w-full max-w-[400px]">

          {/* Logo mobile */}
          <div className="flex md:hidden items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#41A677" }}>
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="text-base font-semibold" style={{ color: "#404040" }}>MaturaProj</span>
          </div>

          {/* En-tête */}
          <div className="mb-8">
            <h2 className="text-[1.75rem] font-bold leading-tight mb-1" style={{ color: "#404040" }}>
              Bienvenue !
            </h2>
            <p className="text-sm" style={{ color: "#404040", opacity: 0.5 }}>
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div
              className="mb-5 p-3 rounded-xl flex items-start gap-2.5 text-sm"
              style={{ background: "#FFF0EC", border: "1px solid #F2B199" }}
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#E4A598" }} />
              <p style={{ color: "#404040" }}>{error}</p>
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
                    <FormLabel className="text-[13px] font-medium" style={{ color: "#404040" }}>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="vous@exemple.mg"
                        className="h-11 rounded-xl text-sm border-0"
                        style={{ background: "#F2F2F2", color: "#404040" }}
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
                      <FormLabel className="text-[13px] font-medium" style={{ color: "#404040" }}>Mot de passe</FormLabel>
                      <Link
                        to="/mot-de-passe-oublie"
                        className="text-xs font-medium hover:underline"
                        style={{ color: "#41A677" }}
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="h-11 rounded-xl text-sm border-0 pr-11"
                          style={{ background: "#F2F2F2", color: "#404040" }}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: "#404040", opacity: 0.4 }}
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
            className="w-full h-11 rounded-xl text-sm font-semibold mt-6 transition-all"
            style={{ background: "#41A677", color: "#fff" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Connexion en cours...</>
            ) : "Se connecter"}
          </Button>

          {/* Lien inscription */}
          <p className="text-sm text-center mt-5" style={{ color: "#404040", opacity: 0.5 }}>
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "#41A677", opacity: 1 }}>
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
