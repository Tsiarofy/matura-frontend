import { z } from 'zod'

// ─── Enums alignés sur schema.prisma MIGRÉ ───────────────────────────────────

export enum TypeFinancement {
  SUBVENTION  = 'SUBVENTION',
  PRET        = 'PRET',
  EQUITY      = 'EQUITY',
  OBLIGATION  = 'OBLIGATION',
  DON         = 'DON',
}

export enum StatutOffre {
  OUVERTE  = 'OUVERTE',
  EN_COURS = 'EN_COURS',
  FERMEE   = 'FERMEE',
  CLOTUREE = 'CLOTUREE',
}

export enum StatutCandidature {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_REVUE   = 'EN_REVUE',
  ACCEPTEE   = 'ACCEPTEE',
  REJETEE    = 'REJETEE',
  RETIREE    = 'RETIREE',
}

export const BRL_MINIMUM_POSTULATION = 6

// ─── Schémas Zod ─────────────────────────────────────────────────────────────

export const OffreFinancementSchema = z.object({
  id:               z.string(),
  titre:            z.string().min(3).max(200),
  description:      z.string().min(10),
  typeFinancement:  z.nativeEnum(TypeFinancement),
  montantMin:       z.number().positive().optional().nullable(),
  montantMax:       z.number().positive().optional().nullable(),
  devise:           z.string().default('MGA'),
  stadeCible:       z.number().int().min(1).max(9),
  secteurs:         z.array(z.string()).default([]),
  regions:          z.array(z.string()).default([]),
  dateCloture:      z.string().datetime().optional().nullable(),
  statut:           z.nativeEnum(StatutOffre).default(StatutOffre.OUVERTE),
  investisseurId:   z.string(),
  createdAt:        z.string().datetime().optional(),
  updatedAt:        z.string().datetime().optional(),
})

export type OffreFinancement = z.infer<typeof OffreFinancementSchema>

export const CreerOffreSchema = OffreFinancementSchema.omit({
  id: true, investisseurId: true, statut: true, createdAt: true, updatedAt: true,
}).partial({
  dateCloture: true, montantMin: true, montantMax: true,
  secteurs: true, regions: true, devise: true,
})

export type CreerOffreDto = z.infer<typeof CreerOffreSchema>

export const CandidatureSchema = z.object({
  id:                z.string(),
  offreId:           z.string(),
  projetId:          z.string(),
  entrepreneurId:    z.string(),
  statut:            z.nativeEnum(StatutCandidature).default(StatutCandidature.EN_ATTENTE),
  messageMotivation: z.string().max(2000).optional().nullable(),
  brlAuMoment:       z.number().int(),
  createdAt:         z.string().datetime().optional(),
  updatedAt:         z.string().datetime().optional(),
})

export type Candidature = z.infer<typeof CandidatureSchema>

export const PostulerSchema = z.object({
  projetId:          z.string().min(1),
  messageMotivation: z.string().max(2000).optional(),
})

export type PostulerDto = z.infer<typeof PostulerSchema>

export const FiltresFinancementSchema = z.object({
  recherche:       z.string().optional(),
  typeFinancement: z.nativeEnum(TypeFinancement).optional(),
  secteur:         z.string().optional(),
  region:          z.string().optional(),
  montantMin:      z.number().positive().optional(),
  montantMax:      z.number().positive().optional(),
  statut:          z.nativeEnum(StatutOffre).optional(),
  stadeCible:      z.number().int().min(1).max(9).optional(),
  page:            z.number().int().min(1).default(1),
  limit:           z.number().int().min(1).max(100).default(20),
})

export type FiltresFinancement = z.infer<typeof FiltresFinancementSchema>

export const PaginatedOffresSchema = z.object({
  data:       z.array(OffreFinancementSchema),
  total:      z.number(),
  page:       z.number(),
  limit:      z.number(),
  totalPages: z.number(),
})

export type PaginatedOffres = z.infer<typeof PaginatedOffresSchema>

export const ProjetEligibleSchema = z.object({
  id:            z.string(),
  nom:           z.string(),
  description:   z.string().optional().nullable(),
  brl:           z.number().int().min(1).max(9),
  secteur:       z.string().optional().nullable(),
  region:        z.string().optional().nullable(),
  statut:        z.string().optional().nullable(),
  dateCreation:  z.string().datetime().optional().nullable(),
  membreEquipe:  z.number().int().optional(),
  dejaCandidaté: z.boolean().default(false),
})

export type ProjetEligible = z.infer<typeof ProjetEligibleSchema>
