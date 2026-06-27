import { Card } from '@/components/ui/card'
import {type  UtilisateurPublic } from '@matura/shared'
import { cn, getInitiales } from '@/lib/utils'
import { getFileUrl } from '@/lib/apiClient'
import { ROLE_LABELS } from '@/lib/constants'
import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface ProfilCardProps {
  user: UtilisateurPublic
  className?: string
}

export function ProfilCard({ user, className }: ProfilCardProps) {
  return (
    <Link to="/profil" className="block">
      <Card
        className={cn(
          'bg-white border-zinc-200 rounded-lg p-2',
          'hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer',
          className
        )}
      >
        <div className="flex items-center gap-2">
          {/* Avatar ou initiales */}
          <div className="w-[26px] h-[26px] rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            {user.url_avatar ? (
              <img
                src={getFileUrl(user.url_avatar) || undefined}
                alt={`${user.prenom} ${user.nom}`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-medium text-white">
                {getInitiales(user.prenom, user.nom)}
              </span>
            )}
          </div>

          {/* Infos utilisateur */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-zinc-700 truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {ROLE_LABELS[user.role] || user.role}
            </p>
          </div>

          {/* Chevron */}
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.25} />
        </div>
      </Card>
    </Link>
  )
}
