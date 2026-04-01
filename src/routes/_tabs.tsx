import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import {HomeIcon,LucideUser} from "lucide-react"

export const Route = createFileRoute('/_tabs')({
  component: TabsLayout,
})

function TabsLayout() {
  return (
    <div className="flex flex-row h-screen">
      {/* 1. ZONE DE CONTENU (L'écran de l'onglet) */}
      {/* 2. BARRE D'ONGLETS (Navigation) */}
      <nav className="w-64 h-full bg-white text-gray-300  flex flex-col p-4  border-r gap-6">
        
        <Link 
          to="/" 
          // 'activeProps' permet d'ajouter des styles automatiquement 
          // quand on est sur cette page (comme Expo Router)
          activeProps={{ className: 'text-blue-600 font-bold' }}
          className="text-gray-500 flex flex-col items-center text-sm"
        >
        <div className='hover:bg-gray-300 flex flex-row w-auto items-center justify-center'>
           <HomeIcon className="w-4 h-4 mb-1 " />
           <label>Accueil</label>
        </div>
        </Link>

        <Link 
          to="/profile" 
          activeProps={{ className: 'text-blue-600 font-bold' }}
          className="text-gray-500 flex flex-col items-center text-sm"
        >
        <div className='hover:bg-gray-300 flex flex-row w-auto items-center justify-center'>
           <LucideUser className="w-4 h-4 mb-1 " />
           <label>Profil</label>
        </div>
        </Link>
      </nav>
      <div className="flex-1 overflow-y-auto p-4">
        {/* L'Outlet est indispensable : c'est ici que s'afficheront 
            index.tsx ou profile.tsx */}
        <Outlet />
      </div>
    </div>
  )
}