import { Outlet, useNavigate } from "@tanstack/react-router";
import { SideBar } from "@/components/sideBar/sideBar";
import { authStore } from "@/stores/authStore";
import { useProjetCourant } from "@/hooks/useStades";
import { Button } from "@/components/ui/button";
// import { useDeconnexion } from "@/hooks/useDeconnexion";
import { apiClient } from "@/lib/apiClient";
// import from "react"

// Middleware de protection pour vérifier l'authentification
// export const Route = createFileRoute('/(dashboard)/_layout')({

//   component: DashboardLayout,
// });

export default function DashboardLayout() {
  const user = authStore((state) => state.utilisateur);
  const role = user?.role ?? "INVESTISSEUR";
  const navigate=useNavigate();

 const onDeconnexion = async () => {
    // const store=authStore();
    // store.logout();
    try {
      await apiClient.delete("auth/deconnexion"); 
      authStore.getState().logout();
        navigate({to:"/login"});
      } catch (error) {
        console.error("Echec de la deconnexion :", error);
    }
}

  // Uniquement pour ENTREPRENEUR
  const { data: projetCourant } = useProjetCourant();

  const initiales = user
    ? `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase()
    : "?";
  const nomComplet = user ? `${user.prenom} ${user.nom}` : "";

  // const deconnexion=useDeconnexion(); 

  return (
    <div className="flex flex-col">
      <div className="flex  h-15 w-full b-red rounded-tl-lg rounded-tr-lg bg-slate-400 items-center justify-between px-4">
        <h1 className="text-2xl font-bold mb-4">
          Bienvenue sur votre tableau de bord !
        </h1>
        <Button onClick={()=>{
        onDeconnexion()
      // console.log("blablabla")  
      }
        }> Deconnexion </Button>  
      </div>
      <div className="flex flex-row h-screen">

        <SideBar
          role={role}
          projetCourant={projetCourant ?? null}
          userName={nomComplet}
          userInitials={initiales}
        />
        {/* <div className="bg-zinc-50 flex-1 overflow-y-auto p-6"> */}
  
      <div className="bg-zinc-50 flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
   </div>
  );
}
