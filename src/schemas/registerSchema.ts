// src/schemas/loginSchema.ts
import { z } from "zod"

export const registerSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom : z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
  role: z.enum(["entrepreneur", "mentor", "investisseur"], {
    required_error: "Veuillez choisir un rôle",
  }),
 region:z.string().min(2, "La région doit contenir au moins 2 caractères"),
 telephone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
})

export type RegisterFormData = z.infer<typeof registerSchema>