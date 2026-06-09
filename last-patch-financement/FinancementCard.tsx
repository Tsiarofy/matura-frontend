import { type OffreFinancement, TypeFinancement, StatutOffre } from '@matura/shared'
import { BadgeDollarSign, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]:  'Subvention',
  [TypeFinancement.PRET]:        'Prêt',
  [TypeFinancement.EQUITY]:      'Equity',
  [TypeFinancement.OBLIGATION]:  'Obligation',
  [TypeFinancement.DON]:         'Don',
}

const TYPE_COLORS: Record<TypeFinancement, string> = {
  [TypeFinancement.SUBVENTION]:  'bg-green-50 text-green-700 border-green-200',
  [TypeFinancement.PRET]:        'bg-blue-50 text-blue-700 border-blue-200',
  [TypeFinancement.EQUITY]:      'bg-purple-50 text-purple-700 border-purple-200',
  [TypeFinancement.OBLIGATION]:  'bg-orange-50 text-orange-700 border-orange-200',
  [TypeFinancement.DON]:         'bg-teal-50 text-teal-700 border-teal-200',
}

const STATUT_LABELS: Record<StatutOffre, string> = {
  [StatutOffre.OUVERTE]:  'Ouverte',
  [StatutOffre.EN_COURS]: 'En cours',
  [StatutOffre.FERMEE]:   'Fermée',
  [StatutOffre.CLOTUREE]: 'Clôturée',
}

interface Props {
  offre: OffreFinancement & {
    investisseur?: { prenom: string; nom: string }
    _count?: { candidatures: number }
  }
  onClick: () => void
}

export function FinancementCard({ offre, onClick }: Props) {
  const isActive = offre.statut === StatutOffre.OUVERTE || offre.statut === StatutOffre.EN_COURS

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={cn(
        'bg-white border rounded-xl p-4 space-y-3 cursor-pointer',
        'hover:border-green-300 hover:shadow-sm transition-all',
        isActive ? 'border-zinc-200' : 'border-zinc-100 opacity-70',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <BadgeDollarSign className="w-4 h-4 text-zinc-400 shrink-0" />
          <p className="text-[13px] font-medium text-zinc-800 truncate">{offre.titre}</p>
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded border shrink-0',
            TYPE_COLORS[offre.typeFinancement],
          )}>
            {TYPE_LABELS[offre.typeFinancement] ?? offre.typeFinancement}
          </span>
          <span className={cn(
            'text-[10px] px-1.5 py-0.5 rounded border shrink-0',
            isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200',
          )}>
            {STATUT_LABELS[offre.statut]}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
      </div>

      {/* Investisseur + BRL */}
      {offre.investisseur && (
        <p className="text-[11px] text-zinc-400">
          par {offre.investisseur.prenom} {offre.investisseur.nom}
          {' · '}BRL ≥ {offre.stadeCible}
        </p>
      )}

      {/* Description */}
      <p className="text-[12px] text-zinc-500 line-clamp-2">{offre.description}</p>

      {/* Infos */}
      <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
        {(offre.montantMin || offre.montantMax) && (
          <span>
            💰{' '}
            {offre.montantMin && offre.montantMax
              ? `${offre.montantMin.toLocaleString('fr')} – ${offre.montantMax.toLocaleString('fr')} ${offre.devise}`
              : offre.montantMin
              ? `À partir de ${offre.montantMin.toLocaleString('fr')} ${offre.devise}`
              : `Jusqu'à ${offre.montantMax!.toLocaleString('fr')} ${offre.devise}`}
          </span>
        )}
        {offre.dateCloture && (
          <span>
            📅 Clôture le{' '}
            {new Date(offre.dateCloture).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        )}
        {offre.secteurs?.length > 0 && (
          <span>🏭 {offre.secteurs.slice(0, 2).join(', ')}</span>
        )}
        {offre._count !== undefined && (
          <span>👥 {offre._count.candidatures} candidature{offre._count.candidatures !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  )
}
