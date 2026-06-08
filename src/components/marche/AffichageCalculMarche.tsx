import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalculMarcheResult {
  population_totale: number
  population_concernee: number
  parts_concurrents_zone_pct: number
  population_occupee_concurrents: number
  population_disponible: number
  sam_pct_utilisateurs: number
  sam_pct_population_totale: number
  som_pct_utilisateurs: number
  som_pct_population_totale: number
  alertes: string[]
  niveau_alerte: 'VERT' | 'ORANGE' | 'ROUGE'
}

interface AffichageCalculMarcheProps {
  calculs: CalculMarcheResult
  typeClient: 'B2B' | 'B2C'
  samSaisi: number
  somSaisi: number
}

export function AffichageCalculMarche({ calculs, typeClient, samSaisi, somSaisi }: AffichageCalculMarcheProps) {
  if (typeClient === 'B2B') {
    return null // Pas d'affichage pour B2B
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  return (
    <div className="space-y-4">
      {/* Population totale */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-medium text-blue-900">Population totale de la zone</p>
        </div>
        <p className="text-2xl font-bold text-blue-700">{formatNumber(calculs.population_totale)} personnes</p>
      </div>

      {/* Population concernée */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <p className="text-sm font-medium text-indigo-900">Population concernée (utilisateurs potentiels)</p>
        </div>
        <p className="text-2xl font-bold text-indigo-700">{formatNumber(calculs.population_concernee)} personnes</p>
      </div>

      {/* Parts concurrents */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <p className="text-sm font-medium text-orange-900">Marché occupé par les concurrents</p>
        </div>
        <p className="text-lg font-semibold text-orange-700 mb-1">
          {calculs.parts_concurrents_zone_pct.toFixed(1)}% de la zone
        </p>
        <p className="text-sm text-orange-600">
          = {formatNumber(calculs.population_occupee_concurrents)} personnes
        </p>
      </div>

      {/* Population disponible */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-900">Population disponible</p>
        </div>
        <p className="text-2xl font-bold text-green-700">{formatNumber(calculs.population_disponible)} personnes</p>
      </div>

      {/* SAM */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <p className="text-sm font-medium text-purple-900">Votre SAM (Marché adressable serviceable)</p>
        </div>
        <p className="text-2xl font-bold text-purple-700 mb-2">{formatNumber(samSaisi)} personnes</p>
        <div className="space-y-1 text-sm text-purple-600">
          <p>• Représente {calculs.sam_pct_utilisateurs.toFixed(1)}% des utilisateurs calculés</p>
          <p>• Représente {calculs.sam_pct_population_totale.toFixed(1)}% de la population totale</p>
        </div>
      </div>

      {/* SOM */}
      <div className={cn(
        'border rounded-xl p-4',
        calculs.niveau_alerte === 'VERT' && 'bg-emerald-50 border-emerald-200',
        calculs.niveau_alerte === 'ORANGE' && 'bg-amber-50 border-amber-200',
        calculs.niveau_alerte === 'ROUGE' && 'bg-red-50 border-red-200'
      )}>
        <div className="flex items-center gap-2 mb-2">
          {calculs.niveau_alerte === 'VERT' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
          {calculs.niveau_alerte === 'ORANGE' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {calculs.niveau_alerte === 'ROUGE' && <AlertTriangle className="w-5 h-5 text-red-600" />}
          <p className={cn(
            'text-sm font-medium',
            calculs.niveau_alerte === 'VERT' && 'text-emerald-900',
            calculs.niveau_alerte === 'ORANGE' && 'text-amber-900',
            calculs.niveau_alerte === 'ROUGE' && 'text-red-900'
          )}>
            Votre SOM (Marché réaliste an 1)
          </p>
        </div>
        <p className={cn(
          'text-2xl font-bold mb-2',
          calculs.niveau_alerte === 'VERT' && 'text-emerald-700',
          calculs.niveau_alerte === 'ORANGE' && 'text-amber-700',
          calculs.niveau_alerte === 'ROUGE' && 'text-red-700'
        )}>
          {formatNumber(somSaisi)} personnes
        </p>
        <div className={cn(
          'space-y-1 text-sm',
          calculs.niveau_alerte === 'VERT' && 'text-emerald-600',
          calculs.niveau_alerte === 'ORANGE' && 'text-amber-600',
          calculs.niveau_alerte === 'ROUGE' && 'text-red-600'
        )}>
          <p>• Représente {calculs.som_pct_utilisateurs.toFixed(1)}% des utilisateurs calculés</p>
          <p>• Représente {calculs.som_pct_population_totale.toFixed(1)}% de la population totale</p>
        </div>
      </div>

      {/* Alertes */}
      {calculs.alertes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-900">Alertes</p>
          </div>
          <ul className="space-y-2">
            {calculs.alertes.map((alerte, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{alerte}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
