import { authStore } from "@/stores/authStore";

export default function DashboardPage() {
  const user=authStore((state) => state.utilisateur);
  // console.log(user?.name)
  return (
    <div className="h-180 w-200 bg-white">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur votre tableau de bord !</h1>
      <p className="text-gray-600 mb-2">Bonjour, {user?.prenom || 'Utilisateur'} {user?.email || ''} ({user?.role || 'Rôle non spécifié'})</p>
      <p className="text-gray-600">Ici, vous pouvez accéder à vos informations personnelles, gérer vos paramètres et bien plus encore.</p>
    </div>
  )
}