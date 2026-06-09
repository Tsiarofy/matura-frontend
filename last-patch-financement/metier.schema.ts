import { z } from 'zod'
import {
  TypeDecisionEnum,
  DomainProjetEnum,
  StatutDemandeEnum,
} from '../enums.js'
import { StatutCandidature, TypeFinancement } from './financement.schema'

// ─── OFFRE DE FINANCEMENT ─────────────────────────────────────────────────────

export const CreationOffreSchema = z.object({
  titre:            z.string().min(5).max(100),
  description:      z.string().min(20).max(2000),
  type_financement: z.nativeEnum(TypeFinancement),
  montant_min_ar:   z.number().positive().optional(),
  montant_max_ar:   z.number().positive().optional(),
  brl_minimal:      z.number().int().min(1).max(7, 'BRL doit être entre 1 et 7'),
  secteurs_cibles:  z.array(DomainProjetEnum),
  regions_cibles:   z.array(z.string()),
  date_limite:      z.string().datetime().optional(),
})

export const OffreResumeSchema = z.object({
  id:               z.string(),
  titre:            z.string(),
  description:      z.string(),
  type_financement: z.nativeEnum(TypeFinancement),
  montant_min_ar:   z.number().nullable(),
  montant_max_ar:   z.number().nullable(),
  brl_minimal:      z.number().int(),
  secteurs_cibles:  z.array(z.string()),
  regions_cibles:   z.array(z.string()),
  date_limite:      z.string().datetime().nullable(),
  est_actif:        z.boolean(),
  cree_le:          z.string().datetime(),
  investisseur: z.object({
    id:         z.string(),
    prenom:     z.string(),
    nom:        z.string(),
    sous_type:  z.string().nullable(),
    url_avatar: z.string().nullable(),
  }),
  can_postuler:   z.boolean().optional(),
  raison_blocage: z.string().optional(),
})

// BUG FIX : défini UNE SEULE fois ici.
// financement.schema.ts ne l'exporte pas → supprime l'erreur TS2308.
export const MajStatutCandidatureSchema = z.object({
  statut: z.nativeEnum(StatutCandidature),
})

// ─── ÉVALUATION MENTOR ────────────────────────────────────────────────────────

export const CreationEvaluationSchema = z
  .object({
    note:         z.number().min(0).max(100),
    commentaire:  z.string().min(50),
    criteres:     z.record(z.number().min(0).max(100)),
    decision:     TypeDecisionEnum,
    motif_renvoi: z.string().min(20).optional(),
  })
  .refine(
    (data) => !(data.decision === 'RENVOYE' && !data.motif_renvoi),
    { message: 'Le motif de renvoi est obligatoire', path: ['motif_renvoi'] },
  )

export const EvaluationSchema = z.object({
  id:           z.string(),
  stade_id:     z.string(),
  mentor_id:    z.string(),
  note:         z.number(),
  commentaire:  z.string(),
  criteres:     z.record(z.number()),
  decision:     TypeDecisionEnum,
  motif_renvoi: z.string().nullable(),
  cree_le:      z.string().datetime(),
  mentor: z.object({ id: z.string(), prenom: z.string(), nom: z.string() }),
})

// ─── DEMANDE D'ACCOMPAGNEMENT ─────────────────────────────────────────────────

export const CreationDemandeSchema = z.object({
  projet_id: z.string().cuid(),
  mentor_id: z.string().cuid(),
  message:   z.string().min(10).max(500).optional(),
})

export const DemandeAccompagnementSchema = z.object({
  id:        z.string(),
  projet_id: z.string(),
  mentor_id: z.string(),
  message:   z.string().nullable(),
  statut:    StatutDemandeEnum,
  cree_le:   z.string().datetime(),
  mentor: z.object({ id: z.string(), prenom: z.string(), nom: z.string() }),
})

export const PaginationSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items:  z.array(itemSchema),
    total:  z.number(),
    page:   z.number(),
    pages:  z.number(),
    limite: z.number(),
  })

// ─── Types exportés ───────────────────────────────────────────────────────────

export type CreationOffreDto        = z.infer<typeof CreationOffreSchema>
export type OffreResume             = z.infer<typeof OffreResumeSchema>
export type MajStatutCandidatureDto = z.infer<typeof MajStatutCandidatureSchema>
export type CreationEvaluationDto   = z.infer<typeof CreationEvaluationSchema>
export type Evaluation              = z.infer<typeof EvaluationSchema>
export type CreationDemandeDto      = z.infer<typeof CreationDemandeSchema>
export type DemandeAccompagnement   = z.infer<typeof DemandeAccompagnementSchema>
