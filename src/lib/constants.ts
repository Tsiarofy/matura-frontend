/**
 * Constantes et labels réutilisables pour MaturaProj
 */

// ─── LABELS STADES ──────────────────────────────────────────────

export const STADE_LABELS: Record<number, string> = {
  1: 'Émergence',
  2: 'Idéation',
  3: 'Marché',
  4: 'BMC',
  5: 'Faisabilité',
  6: 'Prototype',
  7: 'Lancement',
}

export const STADE_LABELS_COMPLETS: Record<number, string> = {
  1: 'Stade 1 — Émergence',
  2: 'Stade 2 — Idéation',
  3: 'Stade 3 — Validation Marché',
  4: 'Stade 4 — Business Model Canvas',
  5: 'Stade 5 — Faisabilité',
  6: 'Stade 6 — Prototype',
  7: 'Stade 7 — Lancement',
}

// ─── COULEURS BRL ───────────────────────────────────────────────

export const BRL_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  '1-2': {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    border: 'border-zinc-200',
    dot: 'bg-zinc-400',
  },
  '3-4': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  '5': {
    bg: 'bg-[#fff7ed]',
    text: 'text-[#c2410c]',
    border: 'border-[#fed7aa]',
    dot: 'bg-orange-600',
  },
  '6-7': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-600',
  },
}

// ─── LABELS RÔLES ───────────────────────────────────────────────

export const ROLE_LABELS: Record<string, string> = {
  ENTREPRENEUR: 'Entrepreneur',
  MENTOR: 'Mentor',
  INVESTISSEUR: 'Investisseur',
  ADMIN: 'Administrateur',
}

// ─── LABELS STATUTS ─────────────────────────────────────────────

export const STATUT_STADE_LABELS: Record<string, string> = {
  VALIDE: 'Validé',
  BROUILLON: 'Brouillon',
  SOUMIS: 'Soumis',
  EN_REVISION: 'En révision',
  VERROUILLE: 'Verrouillé',
  DEBLOQUE: 'Débloqué',
}

export const STATUT_PROJET_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  EN_COURS: 'En cours',
  EN_EVALUATION: 'En évaluation',
  VALIDE: 'Validé',
  DIPLOME: 'Diplômé',
  FINANCE: 'Financé',
  ARCHIVE: 'Archivé',
}

export const STATUT_COMPTE_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente',
  APPROUVE: 'Approuvé',
  REJETE: 'Rejeté',
  SUSPENDU: 'Suspendu',
}

// ─── LABELS DOMAINES ────────────────────────────────────────────

export const DOMAINE_LABELS: Record<string, string> = {
  TECH: 'Tech',
  AGRICULTURE: 'Agriculture',
  COMMERCE: 'Commerce',
  SERVICE: 'Service',
  SOCIAL: 'Social',
  INDUSTRIE: 'Industrie',
  AUTRE: 'Autre',
}

// ─── LABELS TYPE CIBLE ──────────────────────────────────────────

export const TYPE_CIBLE_LABELS: Record<string, string> = {
  B2C: 'B2C — Clients particuliers',
  B2B: 'B2B — Entreprises',
  B2B2C: 'B2B2C — Entreprises & particuliers',
}

// ─── LABELS TYPE FINANCEMENT ────────────────────────────────────

export const TYPE_FINANCEMENT_LABELS: Record<string, string> = {
  SUBVENTION: 'Subvention',
  PRET_HONNEUR: 'Prêt d\'honneur',
  CAPITAL: 'Capital',
  BILLET_CONVERTIBLE: 'Billet convertible',
  INCUBATION: 'Incubation',
  CONCOURS: 'Concours',
  AUTRE: 'Autre',
}

// ─── LABELS SOUS-TYPE INVESTISSEUR ──────────────────────────────

export const SOUS_TYPE_INVESTISSEUR_LABELS: Record<string, string> = {
  ANGEL: 'Business Angel',
  BANQUE: 'Banque',
  ONG: 'ONG',
  FONDS_IMPACT: 'Fonds d\'impact',
  INCUBATEUR: 'Incubateur',
  ETAT: 'État',
  AUTRE: 'Autre',
}

// ─── LABELS DISCIPLINES ─────────────────────────────────────────

export const DISCIPLINE_LABELS: Record<string, string> = {
  TECH: 'Tech',
  DESIGN: 'Design',
  VENTE: 'Vente',
  FINANCE: 'Finance',
  JURIDIQUE: 'Juridique',
  MARKETING: 'Marketing',
  OPERATIONS: 'Opérations',
  EXPERT_DOMAINE: 'Expert domaine',
  COMMUNICATION: 'Communication',
}

// ─── RÉGIONS MADAGASCAR ─────────────────────────────────────────

export const REGIONS_MADAGASCAR = [
  'Analamanga',
  'Vakinankaratra',
  'Itasy',
  'Bongolava',
  'Haute Matsiatra',
  'Amoron\'i Mania',
  'Vatovavy Fitovinany',
  'Ihorombe',
  'Atsimo Atsinanana',
  'Atsinanana',
  'Analanjirofo',
  'Alaotra Mangoro',
  'Boeny',
  'Sofia',
  'Betsiboka',
  'Melaky',
  'Atsimo Andrefana',
  'Androy',
  'Anosy',
  'Menabe',
  'Diana',
  'Sava',
] as const

// ─── LIMITES & SEUILS ───────────────────────────────────────────

export const LIMITES = {
  BRL_MIN: 0,
  BRL_MAX: 7,
  BRL_VISIBLE_INVESTISSEUR: 6,
  SCORE_MIN_VISIBLE_INVESTISSEUR: 65,
  TAILLE_MAX_FICHIER_OCTETS: 10 * 1024 * 1024, // 10 Mo
  DUREE_JWT_MINUTES: 15,
  DUREE_REFRESH_TOKEN_JOURS: 7,
} as const

// ─── PAGINATION ─────────────────────────────────────────────────

export const PAGINATION_DEFAULTS = {
  PAGE_DEFAUT: 1,
  LIMITE_DEFAUT: 20,
  LIMITE_MIN: 5,
  LIMITE_MAX: 100,
} as const
