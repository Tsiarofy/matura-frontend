import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router' // AJOUTÉ
import './index.css'

// 1. Importer l'arbre de routes généré par le plugin
import { routeTree } from './routeTree.gen'

// 2. Créer l'instance du router
const router = createRouter({ routeTree })

// 3. SÉCURISER LE TYPAGE (C'est l'étape magique pour tes erreurs)
// Cela dit à TypeScript : "Regarde dans mon routeTree pour valider les liens"
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 4. On remplace <App /> par le fournisseur du Router */}
    <RouterProvider router={router} />
  </StrictMode>,
)