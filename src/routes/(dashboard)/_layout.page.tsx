import { Outlet } from '@tanstack/react-router'
import { SideBar } from '@/components/utils/sideBar'
import { authStore } from '@/stores/authStore'
import { useProjetCourant } from '@/hooks/useStades'

export default function DashboardLayout() {
  const user = authStore((state) => state.utilisateur)
  const role = user?.role ?? 'INVESTISSEUR'

  // Uniquement pour ENTREPRENEUR
  const { data: projetCourant } = useProjetCourant()

  const initiales = user
    ? `${user.prenom[0] ?? ''}${user.nom[0] ?? ''}`.toUpperCase()
    : '?'
  const nomComplet = user ? `${user.prenom} ${user.nom}` : ''

  return (
    <div className="flex flex-row h-screen">
      <SideBar
        role={role}
        projetCourant={projetCourant ?? null}
        userName={nomComplet}
        userInitials={initiales}
      />
      <div className="bg-zinc-50 flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  )
}
