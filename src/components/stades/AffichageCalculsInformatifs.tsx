// maturproj-frontend/src/components/stades/AffichageCalculsInformatifs.tsx
// Composant universel de transparence marché (Schema-on-Read).
//
// Consomme le JSON `calculs_informatifs` stocké dans le stade et l'affiche
// sous forme de cartes d'audit. Utilisé dans deux contextes critiques :
//
// 1. Vue Mentor (IEME) — intégré dans EvaluationStade.tsx
//    → Affiche les alertes ignorées par l'entrepreneur
//    → Permet un retour objectif et factuel
//
// 2. Vue Investisseur (BRL) — intégré dans le rapport/Data Room
//    → Mise en page orientée "Audit"
//    → Signale si la source est déclarative (B2B) vs validée (GeoService/B2C)

import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  Building2,
  Eye,
  BarChart3,
  ShieldAlert,
  Info,
} from 'lucide-react'
import type { CalculsInformatifs, CalculsStade3 } from '@matura/shared'

interface AffichageCalculsInformatifsProps {
  /** JSON calculs_informatifs lu depuis le stade */
  calculs: CalculsInformatifs | null | undefined
  /** Mode d'affichage : 'mentor' ou 'investisseur' */
  mode: 'mentor' | 'investisseur'
  /** Classe CSS additionnelle */
  className?: string
}

// ─── COMPOSANT ──────────────────────────────────────────────────

export function AffichageCalculsInformatifs({ calculs, mode, className }: AffichageCalculsInformatifsProps) {
  if (!calculs?.stade_3) {
    return (
      <div className={cn('text-center py-6 text-[12px] text-zinc-400', className)}>
        <Eye className="w-5 h-5 mx-auto mb-2 opacity-40" />
        Aucun calcul de marché disponible pour ce projet.
      </div>
    )
  }

  const s3 = calculs.stade_3

  if (mode === 'mentor') {
    return <VueMentor data={s3} className={className} />
  }

  return <VueInvestisseur data={s3} className={className} />
}

// ─── VUE MENTOR (IEME) ──────────────────────────────────────────

function VueMentor({ data, className }: { data: CalculsStade3; className?: string }) {
  const hasAlertes = data.alertes_ignorees.length > 0
  const somDangereux = data.som_pct_disponible > 20
  const somAmbitieux = data.som_pct_disponible > 5 && !somDangereux

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
        <BarChart3 className="w-3.5 h-3.5" />
        Analyse marché — Transparence
      </p>

      {/* Résumé pour le mentor */}
      <div className={cn(
        'rounded-lg p-4 space-y-2',
        somDangereux ? 'bg-red-50 border border-red-200' : somAmbitieux ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200',
      )}>
        <div className="flex items-start gap-2">
          {somDangereux ? (
            <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          ) : somAmbitieux ? (
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className={cn('text-[12px] font-medium',
              somDangereux ? 'text-red-800' : somAmbitieux ? 'text-amber-800' : 'text-green-800',
            )}>
              Le SOM déclaré par l'entrepreneur représente {data.som_pct_disponible.toFixed(1)}% du marché libre sur la zone.
            </p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Base marché : {data.base_totale.toLocaleString()} ({data.type_cible})
              — Source : {data.source_base === 'GEOSERVICE' ? 'GeoService (auto)' : 'Déclaratif (estimation)'}
            </p>
          </div>
        </div>
      </div>

      {/* Détails des métriques */}
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <MetriqueCard
          icon={<Users className="w-3.5 h-3.5" />}
          label="Base totale"
          value={data.base_totale.toLocaleString()}
          badge={data.source_base}
        />
        <MetriqueCard
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="Marché disponible"
          value={data.disponible.toLocaleString()}
          highlight={data.disponible > 0}
        />
        <MetriqueCard
          icon={<Building2 className="w-3.5 h-3.5" />}
          label="Occupé (concurrents)"
          value={data.occupee_concurrents.toLocaleString()}
        />
        <MetriqueCard
          icon={<BarChart3 className="w-3.5 h-3.5" />}
          label="SAM / libre"
          value={`${data.sam_pct_disponible.toFixed(1)}%`}
        />
      </div>

      {/* Alertes ignorées */}
      {hasAlertes && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-red-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {data.alertes_ignorees.length} alerte(s) d'irréalisme générée(s) par le système
          </p>
          {data.alertes_ignorees.map((alerte, i) => (
            <div key={i} className="bg-red-50 border border-red-100 rounded-md px-3 py-1.5 text-[11px] text-red-700">
              {alerte}
            </div>
          ))}
        </div>
      )}

      {!hasAlertes && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-md px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <p className="text-[11px] text-green-700">Aucune alerte d'irréalisme — objectifs dans les bornes BRL.</p>
        </div>
      )}
    </div>
  )
}

// ─── VUE INVESTISSEUR (BRL) ─────────────────────────────────────

function VueInvestisseur({ data, className }: { data: CalculsStade3; className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
        Audit Marché — Transparence BRL
      </p>

      {/* Indicateurs clés */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-[12px]">
          <tbody>
            <AuditRow
              label="Taille totale du marché"
              value={data.base_totale.toLocaleString()}
              note={data.source_base === 'GEOSERVICE'
                ? '✓ Source vérifiée (GeoService — données INSTAT)'
                : '⚠ Estimation déclarative de l\'entrepreneur'}
              noteType={data.source_base === 'GEOSERVICE' ? 'success' : 'warning'}
            />
            <AuditRow
              label="Part capturée par la concurrence"
              value={data.occupee_concurrents.toLocaleString()}
            />
            <AuditRow
              label="Marché disponible (libre)"
              value={data.disponible.toLocaleString()}
            />
            <AuditRow
              label="SAM visé"
              value={`${data.sam_pct_disponible.toFixed(1)}% du marché libre`}
            />
            <AuditRow
              label="SOM visé (An 1)"
              value={`${data.som_pct_disponible.toFixed(1)}% du marché libre`}
              note={data.som_pct_disponible > 20
                ? 'Objectif jugé irréaliste par le système (>20%)'
                : data.som_pct_disponible > 5
                  ? 'Objectif ambitieux (5-20%)'
                  : 'Objectif réaliste (<5%)'}
              noteType={data.som_pct_disponible > 20 ? 'danger' : data.som_pct_disponible > 5 ? 'warning' : 'success'}
            />
            <AuditRow
              label="Type de marché"
              value={data.type_cible}
            />
          </tbody>
        </table>
      </div>

      {/* Source fiabilité */}
      {data.source_base === 'DECLARATIF' && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-700">
            <strong>Note :</strong> La taille totale du marché est une estimation de l'entrepreneur
            (projet B2B/B2B2C). Contrairement aux projets B2C, ce chiffre n'a pas été validé par
            le GeoService (données INSTAT). L'investisseur est invité à vérifier cette hypothèse.
          </p>
        </div>
      )}

      {/* Alertes */}
      {data.alertes_ignorees.length > 0 && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[11px] text-red-700 font-medium">
              Alertes de réalisme ({data.alertes_ignorees.length})
            </p>
            <ul className="mt-1 space-y-0.5">
              {data.alertes_ignorees.map((a, i) => (
                <li key={i} className="text-[11px] text-red-600">• {a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SOUS-COMPOSANTS ────────────────────────────────────────────

function MetriqueCard({
  icon, label, value, badge, highlight,
}: {
  icon: React.ReactNode; label: string; value: string; badge?: string; highlight?: boolean
}) {
  return (
    <div className="bg-zinc-50 rounded-lg px-3 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-[11px] text-zinc-500">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn('text-[12px] font-medium', highlight ? 'text-green-700' : 'text-zinc-800')}>
          {value}
        </span>
        {badge && (
          <span className={cn(
            'text-[9px] px-1.5 py-0.5 rounded-full font-medium',
            badge === 'GEOSERVICE' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600',
          )}>
            {badge === 'GEOSERVICE' ? 'auto' : 'décl.'}
          </span>
        )}
      </div>
    </div>
  )
}

function AuditRow({
  label, value, note, noteType,
}: {
  label: string; value: string; note?: string; noteType?: 'success' | 'warning' | 'danger'
}) {
  return (
    <tr className="border-b border-zinc-100 last:border-0">
      <td className="px-4 py-2.5 text-zinc-600">{label}</td>
      <td className="px-4 py-2.5 text-right font-medium text-zinc-800">{value}</td>
      {note && (
        <td className="px-4 py-2.5">
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full',
            noteType === 'success' && 'bg-green-100 text-green-700',
            noteType === 'warning' && 'bg-amber-100 text-amber-700',
            noteType === 'danger' && 'bg-red-100 text-red-700',
          )}>
            {note}
          </span>
        </td>
      )}
    </tr>
  )
}
