// src/routes/(auth)/register.page.tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterFormData,
} from "@/schemas/registerSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";   // ← mieux que * as axios

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
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegisterPage() {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { "Content-Type": "application/json" },
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      password: "",
      email: "",
      telephone: "",
      role: "entrepreneur",
      region: "Antsirabe",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Envoi des données :", data);
      const response = await axiosInstance.post("/auth/signup", data);  // ← corrigé "singup" → "signup"
      console.log("Réponse :", response.data);
      form.reset();
      // Tu peux ajouter ici une redirection vers login ou dashboard
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      // Gère l'erreur (toast, message, etc.)
    }
  };

  const roles = [
    { id: "entrepreneur", title: "Entrepreneur", description: "Inscrire en tant qu'entrepreneur" },
    { id: "mentor", title: "Mentor", description: "Inscrire en tant que mentor" },
    { id: "investisseur", title: "Investisseur", description: "Inscrire en tant qu'investisseur" },
  ];

  return (
    <div className="flex items-center justify-center p-10 min-h-screen  bg-salte-800">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="bg-blue-500 justify-center">
          <CardTitle className="text-3xl">Maturproj</CardTitle>
          <CardDescription>Une plateforme de maturation de projet</CardDescription>
        </CardHeader>

        <CardContent>
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Nom */}
              <Controller
                name="nom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nom</FieldLabel>
                    <Input {...field} placeholder="Votre nom" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Prénom */}
              <Controller
                name="prenom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Prénom</FieldLabel>
                    <Input {...field} placeholder="Votre prénom" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" {...field} placeholder="exemple@email.com" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Mot de passe */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Mot de passe</FieldLabel>
                    <Input type="password" {...field} placeholder="••••••••" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Région */}
              <Controller
                name="region"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Région</FieldLabel>
                    <Input {...field} placeholder="Antsirabe" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Téléphone */}
              <Controller
                name="telephone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Téléphone</FieldLabel>
                    <Input {...field} placeholder="+261 34 00 000 00" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Rôle */}
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLegend>S'inscrire en tant que</FieldLegend>
                    <FieldDescription>
                      Choisissez votre rôle pour accéder aux fonctionnalités adaptées.
                    </FieldDescription>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {roles.map((role) => (
                        <FieldLabel key={role.id} htmlFor={`role-${role.id}`}>
                          <Field orientation="horizontal" className="flex items-start">
                            <RadioGroupItem
                              value={role.id}
                              id={`role-${role.id}`}
                            />
                            <FieldContent className="ml-3">
                              <FieldTitle>{role.title}</FieldTitle>
                              <FieldDescription>{role.description}</FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldSet>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Réinitialiser
          </Button>
          <Button type="submit" form="register-form">
            S'inscrire
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}