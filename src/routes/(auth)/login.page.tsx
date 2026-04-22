import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type ConnexionDto,
  ConnexionSchema,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "@tanstack/react-router";
import { apiClient } from "@/lib/apiClient";
import { authStore } from "@/stores/authStore";
import { Sprout, Users, TrendingUp, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const store = authStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ConnexionDto>({
    resolver: zodResolver(ConnexionSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (dto: ConnexionDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data }: { data: AuthResponse } = await apiClient.post(
        "auth/connexion",
        dto,
      );
      await store.setAuth(data.token, data.utilisateur);
      navigate({ to: "/dashboard" });
      form.reset();
    } catch (err: any) {
      console.error("Erreur de connexion :", err);
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50">
      {/* Left Panel – Branding */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-10 lg:p-12 border-b md:border-b-0 md:border-r border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
              <span className="text-white text-xs font-medium">M</span>
            </div>
            <span className="text-lg font-medium text-zinc-900">MaturaProj</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-zinc-900 mb-3">
            Structurez votre projet,<br />trouvez des financements.
          </h1>
          <p className="text-sm text-zinc-500 max-w-md">
            La plateforme qui guide les entrepreneurs malgaches de l'idée à la
            réalisation, avec l'accompagnement de mentors et d'investisseurs.
          </p>
        </div>

        {/* Features / Stats */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-md border border-green-200">
              <Sprout className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">7 stades de maturation</p>
              <p className="text-xs text-zinc-500">Un parcours structuré, validé par des experts</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-md border border-green-200">
              <Users className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">Mentors qualifiés</p>
              <p className="text-xs text-zinc-500">Bénéficiez de retours d'expérience terrain</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-md border border-green-200">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800">Accès aux financements</p>
              <p className="text-xs text-zinc-500">Subventions, prêts d'honneur, capital</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mt-8">
          © 2026 MaturaProj — Tous droits réservés
        </p>
      </div>

      {/* Right Panel – Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-12">
        <Card className="w-full max-w-md border-0.5 border-zinc-200 shadow-none bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-medium text-zinc-900">Connexion</CardTitle>
            <CardDescription className="text-sm text-zinc-500">
              Accédez à votre espace personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-100 flex items-start gap-2 text-red-800 text-xs animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <Form {...form}>
              <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="vous@exemple.mg"
                          className="h-9 text-sm"
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Mot de passe</FormLabel>
                        <Link
                          to="/mot-de-passe-oublie"
                          className="text-xs text-green-600 hover:underline"
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
                            className="h-9 text-sm pr-10"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              form="login-form"
              className="w-full bg-green-600 hover:bg-green-700 text-white h-9 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
            <p className="text-sm text-zinc-500 text-center">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-green-600 font-medium hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
