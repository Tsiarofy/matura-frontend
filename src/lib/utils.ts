import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes avec résolution de conflits
 * @example cn('bg-red-500', 'bg-blue-500') → 'bg-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un montant en Ariary malgache
 * @param montant - Montant en Ariary
 * @param options - Options de formatage
 * @returns Montant formaté avec séparateurs et symbole Ar
 * @example formatAr(1500000) → '1 500 000 Ar'
 * @example formatAr(1500000, { compact: true }) → '1,5M Ar'
 */
export function formatAr(
  montant: number,
  options?: {
    compact?: boolean
    decimales?: number
    afficherSymbole?: boolean
  }
): string {
  const { compact = false, decimales = 0, afficherSymbole = true } = options || {}

  if (compact && montant >= 1_000_000) {
    // Format compact : 1,5M Ar
    const millions = montant / 1_000_000
    return `${millions.toFixed(decimales === 0 ? 1 : decimales)}M${afficherSymbole ? ' Ar' : ''}`
  }

  if (compact && montant >= 1_000) {
    // Format compact : 15K Ar
    const milliers = montant / 1_000
    return `${milliers.toFixed(decimales === 0 ? 0 : decimales)}K${afficherSymbole ? ' Ar' : ''}`
  }

  // Format standard : 1 500 000 Ar
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(montant)

  return afficherSymbole ? `${formatted} Ar` : formatted
}

/**
 * Formate une date en français
 * @param date - Date ISO string ou Date object
 * @param format - Format de sortie
 * @returns Date formatée
 * @example formatDate('2026-04-15T10:00:00Z') → '15 avril 2026'
 * @example formatDate('2026-04-15T10:00:00Z', 'short') → '15 avr. 2026'
 * @example formatDate('2026-04-15T10:00:00Z', 'numeric') → '15/04/2026'
 * @example formatDate('2026-04-15T10:00:00Z', 'relative') → 'il y a 2 jours'
 */
export function formatDate(
  date: string | Date,
  format: 'long' | 'short' | 'numeric' | 'relative' = 'long'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    return formatRelativeDate(dateObj)
  }

  const options: Intl.DateTimeFormatOptions = {
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    numeric: { day: '2-digit', month: '2-digit', year: 'numeric' },
  }[format]

  return dateObj.toLocaleDateString('fr-FR', options)
}

/**
 * Formate une date relative (il y a X jours/heures/mois)
 * @param date - Date object
 * @returns Date relative en français
 * @example formatRelativeDate(new Date()) → 'maintenant'
 * @example formatRelativeDate(new Date(Date.now() - 86400000)) → 'il y a 1 jour'
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return 'maintenant'
  if (diffMin < 60) return `il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`
  if (diffHour < 24) return `il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`
  if (diffDay < 30) return `il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`
  if (diffMonth < 12) return `il y a ${diffMonth} mois`
  return `il y a ${diffYear} an${diffYear > 1 ? 's' : ''}`
}

/**
 * Tronque un texte et ajoute "..." si nécessaire
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué
 * @example truncate('Un long texte...', 10) → 'Un long...'
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Génère des initiales depuis un prénom et un nom
 * @param prenom - Prénom
 * @param nom - Nom de famille
 * @returns Initiales en majuscules
 * @example getInitiales('Ravo', 'Nirina') → 'RN'
 */
export function getInitiales(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

/**
 * Calcule le pourcentage de complétion
 * @param valeurActuelle - Valeur actuelle
 * @param valeurMax - Valeur maximale
 * @returns Pourcentage entre 0 et 100
 * @example calculerPourcentage(3, 7) → 42.86
 */
export function calculerPourcentage(valeurActuelle: number, valeurMax: number): number {
  if (valeurMax === 0) return 0
  return Math.min(100, Math.max(0, (valeurActuelle / valeurMax) * 100))
}

/**
 * Attend X millisecondes (helper pour async/await)
 * @param ms - Millisecondes à attendre
 * @example await sleep(1000) // Attend 1 seconde
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Détecte si un objet est vide
 * @param obj - Objet à vérifier
 * @returns true si l'objet est vide
 * @example isEmpty({}) → true
 * @example isEmpty({ a: 1 }) → false
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0
}
