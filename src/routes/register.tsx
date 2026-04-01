// Login.tsx
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@schemas/registerSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createFileRoute } from "@tanstack/react-router"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@components/ui/form"
import * as axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {} from "axios"


export const Route = createFileRoute('/register')({
  component: Login,
})

export default function Login() {

  const axiosInstance = axios.default.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema), // ← validation automatique
    defaultValues: {
      nom: "",
      prenom:"",
      password: "",
      email: "",
      role: "entrepreneur",
      region:"Antsirabe",

    }
  })

  // Cette fonction s'exécute SEULEMENT si le formulaire est valide
  const onSubmit = async (data: RegisterFormData) => {
        try {
        console.log(data)
        const response = await axiosInstance.post("auth/singup,", data)
        console.log(response.data)
        form.reset() // Réinitialise le formulaire après une soumission réussie
        }catch (error) {
          console.error(error)
        }

  }
  const roles = [
    { id: "entrepreneur", title: "Entrepreneur", description: "Inscrire entantqu'entrepreneur" },
    { id: "mentor", title: "Mentor", description: "Inscrire entantque mentor" },
    { id: "investisseur", title: "Investisseur", description: "Inscrire entantqu'investisseur" },
  ]

  return (
    <div className="flex  items-center justify-center p-10">
      <Card className="w-100 h-2xl shadow-2xs">
        <CardHeader>
          <CardTitle>Maturproj</CardTitle>
          <CardDescription>Une plateforme de maturation de projet</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="nom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nom</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Entrer le nom"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
                }
              />
          <Controller
                name="prenom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Prenom</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Entrer votre mail"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
                }
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Entrer votre mail"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
                }
              />
              <Controller
                name="password"
                
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Mot de passe</FieldLabel>
                    <Input
                      type="password"
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Entrer le mot de passe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
                }
              />
              <Controller
                name="region"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Region</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Entrer le mot de passe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
                }
              />
              <Controller
                name="telephone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Télephone</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Entrer le mot de passe"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
                }
              />
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLegend>S'insrire entant que</FieldLegend>
                    <FieldDescription>
                      Choisissez votre rôle pour accéder aux fonctionnalités adaptées à vos besoins.
                    </FieldDescription>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {roles.map((role) => (
                        <FieldLabel key={role.id} htmlFor={`form-rhf-radiogroup-${role.id}`}>
                          <Field orientation="horizontal" className="flex" data-invalid={fieldState.invalid}>
                            <RadioGroupItem
                              value={role.id}
                              id={`form-rhf-radiogroup-${role.id}`}
                              aria-invalid={fieldState.invalid}
                            />
                            <FieldContent className="ml-2">
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
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => { form.reset() }}>
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>

    </div>
  )
}