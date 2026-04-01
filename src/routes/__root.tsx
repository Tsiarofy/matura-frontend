import { Button } from '@/components/ui/button';
import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// On utilise createRootRoute (pas createFileRoute) car c'est la racine
export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const navigate=useNavigate();
  return (
    <>

      {/* Ici, tu peux mettre des choses qui apparaissent sur TOUTES les pages 
          (comme une barre de chargement globale ou un Toast container)
      */}
      {/* <Button onClick={()=>navigate("/login")}>navigate</Button> */}
      <div className="w-full h-20 bg-white flex flex-row items-center p-10 justify-between content-evenly border shadow-2xs ">
        <div className='flex flex-col'>
            <h2 className="text-lg font-bold text-black">Mon Application</h2>
            <p className='text-gray-100/80 text-xs'>mardi le 3 décembre 2025</p>
        </div>

        <Button className="ml-4 bg-green-700" onClick={()=>navigate({to: "/register"})}>register</Button>
      </div>
      <main>
        {/* L'Outlet est INDISPENSABLE : c'est ici que tes routes 
            (comme /profile ou /login) vont s'afficher.
        */}
      <Outlet />
      </main>
      
      {/* Le composant Devtools : il ajoute un petit logo TanStack 
          en bas à droite pour voir ton arbre de routes en temps réel.
          Il ne s'affiche qu'en mode développement.
      */}
      {/* <TanStackRouterDevtools /> */}
    </>
  )
}