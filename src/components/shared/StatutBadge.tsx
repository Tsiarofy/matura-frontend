import { Badge } from '@/components/ui/badge'
import type {StatutStade } from '@matura/shared'
import { cn } from '@/lib/utils'

interface StatutBadgeProps {
  statut: StatutStade | string
  className?: string
}

const getBadgeStyles = (status: string) => {
  const s = status.toUpperCase().replace(/_/g, ' ').trim();
  
  if (s === 'VALIDE' || s === 'VALIDEE' || s === 'VALIDÉ' || s === 'CONFIRME' || s === 'CONFIRMÉE') {
    return { bg: 'bg-[#eafdf3]', text: 'text-[#318055]', border: 'border-[#c5f3d8]', label: s.startsWith('CONFIRM') ? 'Confirmé' : 'Validé', dot: 'bg-[#41A677]' };
  }
  if (s === 'OUVERTE' || s === 'OUVERT') {
    return { bg: 'bg-[#eafdf3]', text: 'text-[#41A677]', border: 'border-[#c5f3d8]', label: 'Ouverte', dot: 'bg-[#41A677]' };
  }
  if (s.startsWith('BRL')) {
    return { bg: 'bg-[#eafdf3]', text: 'text-[#318055]', border: 'border-[#c5f3d8]', label: status, dot: 'bg-[#41A677]' };
  }
  if (s === 'SUIVI') {
    return { bg: 'bg-[#E2F7F6]', text: 'text-[#0D7A75]', border: 'border-[#A6E3E1]', label: 'Suivi', dot: 'bg-[#1BA8A0]' };
  }
  if (s === 'BROUILLON') {
    return { bg: 'bg-[#E2F7F6]', text: 'text-[#0D7A75]', border: 'border-[#A6E3E1]', label: 'Brouillon', dot: 'bg-[#1BA8A0]' };
  }
  if (s === 'EN COURS') {
    return { bg: 'bg-[#EBF5FC]', text: 'text-[#1C5F8C]', border: 'border-[#B8D8F0]', label: 'En cours', dot: 'bg-[#3A8FC4]' };
  }
  if (s === 'INSTANTANE' || s === 'INSTANTANÉ') {
    return { bg: 'bg-[#EBF5FC]', text: 'text-[#1C5F8C]', border: 'border-[#B8D8F0]', label: 'Instantané', dot: 'bg-[#3A8FC4]' };
  }
  if (s === 'FORMATION') {
    return { bg: 'bg-[#eef0ff]', text: 'text-[#3840C0]', border: 'border-[#C2C5FA]', label: 'Formation', dot: 'bg-[#6f74f7]' };
  }
  if (s === 'EN ATTENTE' || s === 'SOUMIS') {
    return { bg: 'bg-[#fff8e8]', text: 'text-[#c47d00]', border: 'border-[#f9d98a]', label: status === 'SOUMIS' ? 'Soumis' : 'En attente', dot: 'bg-[#f3b63f]' };
  }
  if (s === 'EN ANALYSE') {
    return { bg: 'bg-[#fff8e8]', text: 'text-[#c47d00]', border: 'border-[#f9d98a]', label: 'En analyse', dot: 'bg-[#f3b63f]' };
  }
  if (s === 'SUBVENTION') {
    return { bg: 'bg-[#fff8e8]', text: 'text-[#c47d00]', border: 'border-[#f9d98a]', label: 'Subvention', dot: 'bg-[#f3b63f]' };
  }
  if (s === 'TERMINEE' || s === 'TERMINÉE' || s === 'TERMINE') {
    return { bg: 'bg-[#f6f6f4]', text: 'text-[#757575]', border: 'border-[#e5e5e1]', label: 'Terminée', dot: 'bg-[#757575]' };
  }
  if (s === 'INACTIF' || s === 'INACTIVE' || s === 'VERROUILLE' || s === 'VERROUILLÉ') {
    return { bg: 'bg-[#f6f6f4]', text: 'text-[#b6b6b6]', border: 'border-[#e5e5e1]', label: status === 'VERROUILLE' ? 'Verrouillé' : 'Inactif', dot: 'bg-[#b6b6b6]' };
  }
  if (s === 'REFUSE' || s === 'REFUSÉ') {
    return { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]', label: 'Refusé', dot: 'bg-[#DC2626]' };
  }
  if (s === 'REJETE' || s === 'REJETÉ' || s === 'EN REVISION' || s === 'EN_REVISION') {
    return { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]', label: status === 'EN_REVISION' ? 'En révision' : 'Rejeté', dot: 'bg-[#DC2626]' };
  }

  return { bg: 'bg-[#f6f6f4]', text: 'text-[#757575]', border: 'border-[#e5e5e1]', label: status, dot: 'bg-[#757575]' };
};

export function StatutBadge({ statut, className }: StatutBadgeProps) {
  const config = getBadgeStyles(statut);

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 py-[3px] px-[10px] rounded-[20px]',
        'text-[11px] font-medium border-[0.5px]',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </Badge>
  )
}
