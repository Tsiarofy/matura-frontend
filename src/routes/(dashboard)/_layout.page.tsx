import { Outlet} from '@tanstack/react-router'
import {SideBar} from "@/components/sideBar"
import { authStore } from '@/stores/authStore'


export default function DashboardLayout() {
  const user=authStore((state)=>state.utilisateur)
  const role= user?.role || 'INVESTISSEUR' // Rôle par défaut si l'utilisateur n'est pas défini
  return (
    <div className="flex flex-row h-screen">
      <SideBar role={role}/>
      <div className=" bg-amber-600 flex-1 overflow-y-auto p-4">
        {/* L'Outlet est indispensable : c'est ici que s'afficheront 
            index.tsx ou profile.tsx */}
        <Outlet />
      </div>
    </div>
  )
}