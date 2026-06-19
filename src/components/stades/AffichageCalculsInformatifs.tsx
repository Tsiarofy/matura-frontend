// src/components/stades/AffichageCalculsInformatifs.tsx
// Affiche les 9 champs CalculsInformatifs pour les Mentors et Investisseurs (IEME & BRL)
// Spec Section 2 : "L'IEME exploite ces calculs. L'investisseur accède à ces mêmes calculs"
// NOTE : L'Entrepreneur ne voit PAS cette vue (transparence réservée aux évaluateurs)

import { AlertCircle, Target, Users, MapPin, Search, Database } from 'lucide-react'
import { cn, formatDecimal } from '@/lib/utils'

interface AffichageCalculsInformatifsProps {
  numStade: number
  calculs: Record<string, unknown> | null | undefined
  role: 'MENTOR' | 'INVESTISSEUR' | 'ENTREPRENEUR'
}

// Formate un nombre avec séparateur milliers
const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n))

// Badge de niveau d'alerte
function BadgeAlerte({ niveau }: { niveau: 'VERT' | 'ORANGE' | 'ROUGE' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
        niveau === 'VERT' && 'bg-green-50 text-green-700 border border-green-200',
        niveau === 'ORANGE' && 'bg-amber-50 text-amber-700 border border-amber-200',
        niveau === 'ROUGE' && 'bg-red-50 text-red-700 border border-red-200',
      )}
    >
      {niveau === 'VERT' ? '✓' : niveau === 'ORANGE' ? '⚠' : '✗'} {niveau}
    </span>
  )
}

// Rendu des 9 champs spec pour le Stade 3
function RenduStade3({ data }: { data: Record<string, unknown> }) {
  const typeClient = (data.type_client as string | undefined) ?? undefined
  const b2c = data.b2c as Record<string, unknown> | undefined
  const b2b = data.b2b as Record<string, unknown> | undefined

  if (typeClient === 'B2B2C' && (b2c || b2b)) {
    return (
      <div className="space-y-5">
        {b2c && (
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 mb-2">Volet B2C</p>
            <RenduStade3 data={b2c} />
          </div>
        )}
        {b2b && (
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 mb-2">Volet B2B</p>
            <RenduStade3 data={b2b} />
          </div>
        )}
      </div>
    )
  }

  const baseTotale = (data.base_totale as number) ?? 0
  const sourceBase = (data.source_base as string) ?? 'DECLARATIF'
  const occupee = (data.occupee_concurrents as number) ?? 0
  const disponible = (data.disponible as number) ?? 0
  const samPctTotale = (data.sam_pct_totale as number) ?? 0
  const samPctDispo = (data.sam_pct_disponible as number) ?? 0
  const somPctTotale = (data.som_pct_totale as number) ?? 0
  const somPctDispo = (data.som_pct_disponible as number) ?? 0
  const alertesIgnorees = (data.alertes_ignorees as string[]) ?? []

  // Niveau d'alerte dérivé des seuils spec Section 4.4
  const niveauAlerte: 'VERT' | 'ORANGE' | 'ROUGE' =
    samPctDispo > 80 || somPctDispo > 20
      ? 'ROUGE'
      : somPctDispo > 5
      ? 'ORANGE'
      : 'VERT'

  return (
    <div className="space-y-4">
      {/* En-tête avec source de données */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-zinc-500" />
          <span className="text-[11px] text-zinc-600 font-medium">Source de données</span>
        </div>
        <span
          className={cn(
            'text-[10px] px-2 py-0.5 rounded-full font-medium border',
            sourceBase === 'GEOSERVICE'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-zinc-50 text-zinc-600 border-zinc-200',
          )}
        >
          {sourceBase === 'GEOSERVICE' ? '✓ INSTAT certifié' : '⚠ Déclaratif'}
        </span>
      </div>

      {/* Grille des 4 métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5 text-blue-700">
            <MapPin className="w-3.5 h-3.5" />
            <p className="text-[10px]  tracking-wider font-semibold">Nombre de population dans la zone cible</p>
          </div>
          <p className="text-[18px] font-bold text-blue-900">{fmt(baseTotale)}</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5 text-orange-700">
            <Search className="w-3.5 h-3.5" />
            <p className="text-[10px]  tracking-wider font-semibold">part estimée de client des concurents</p>
          </div>
          <p className="text-[18px] font-bold text-orange-900">{fmt(occupee)}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5 text-green-700">
            <Target className="w-3.5 h-3.5" />
            <p className="text-[10px] tracking-wider font-semibold">population disponible tenant compte du part des concurents</p>
          </div>
          <p className="text-[18px] font-bold text-green-900">{fmt(disponible)}</p>
        </div>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col justify-between">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1.5">
            Réalisme
          </p>
          <BadgeAlerte niveau={niveauAlerte} />
        </div>
      </div>

      {/* Les 9 champs spec en détail */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
        <p className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
          Métriques IEME / BRL — 9 champs certifiés
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'SAM / Base totale', value: samPctTotale, warn: samPctTotale > 80 },
            {
              label: 'SAM / Marché libre',
              value: samPctDispo,
              warn: samPctDispo > 80,
              critical: samPctDispo > 80,
            },
            { label: 'SOM / Base totale', value: somPctTotale, warn: somPctTotale > 20 },
            {
              label: 'SOM / Marché libre (An 1)',
              value: somPctDispo,
              warn: somPctDispo > 5,
              critical: somPctDispo > 20,
            },
          ].map(({ label, value, warn, critical }) => (
            <div key={label} className="bg-white rounded-lg p-2">
              <p className="text-[10px] text-zinc-500 mb-0.5">{label}</p>
              <p
                className={cn(
                  'text-[14px] font-bold',
                  critical ? 'text-red-600' : warn ? 'text-amber-600' : 'text-purple-700',
                )}
              >
                {formatDecimal(value)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes ignorées par l'entrepreneur */}
      {alertesIgnorees.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <p className="text-[12px] font-semibold">
              Alertes ignorées par l'entrepreneur ({alertesIgnorees.length})
            </p>
          </div>
          <ul className="space-y-1">
            {alertesIgnorees.map((a, i) => (
              <li key={i} className="text-[11px] text-red-800 flex items-start gap-1.5">
                <span className="mt-0.5">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function AffichageCalculsInformatifs({
  numStade,
  calculs,
  role,
}: AffichageCalculsInformatifsProps) {
  // Seuls Mentor et Investisseur voient cette section (spec Section 2)
  if (role === 'ENTREPRENEUR') return null

  if (!calculs || Object.keys(calculs).length === 0) return null

  const stade3Data = calculs.stade_3 as Record<string, unknown> | undefined

  return (
    <div className="mt-4 mb-6 border border-zinc-200 rounded-xl p-4 bg-white">
      <h3 className="text-[12px] font-semibold text-zinc-700 mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
        <Users className="w-4 h-4 text-zinc-500" />
        Données analytiques (Vue Professionnelle)
      </h3>

      {numStade === 3 && stade3Data ? (
        <RenduStade3 data={stade3Data} />
      ) : (
        <p className="text-[12px] text-zinc-400">
          Aucune donnée analytique disponible pour ce stade.
        </p>
      )}
    </div>
  )
}