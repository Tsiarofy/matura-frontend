import { authStore } from "@/stores/authStore"
import { EntrepreneurDashboard } from "@/components/dashboard/EntrepreneurDashboard"
import { MentorDashboard } from "@/components/dashboard/MentorDashboard"
import { InvestisseurDashboard } from "@/components/dashboard/InvestisseurDashboard"

export default function DashboardPage() {
  const user = authStore((state) => state.utilisateur)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[200px] text-zinc-500 text-[12px]">
        Chargement de l'utilisateur...
      </div>
    )
  }

  // Rendu conditionnel selon le rôle
  switch (user.role) {
    case 'MENTOR':
      return <MentorDashboard user={user} />
    case 'INVESTISSEUR':
      return <InvestisseurDashboard user={user} />
    case 'ENTREPRENEUR':
    default:
      return <EntrepreneurDashboard user={user} />
  }
}