/* eslint-disable @typescript-eslint/no-explicit-any */
import { type RoleUtilisateur } from "@matura/shared";
import * as Icon from "lucide-react";
import { Link } from "@tanstack/react-router";

interface TypeNavigationData {
  icon: string;
  lien: string;
  label: string;
}
interface TypeSidebar {
  ENTREPRENEUR: TypeNavigationData[];
  MENTOR: TypeNavigationData[];
  INVESTISSEUR: TypeNavigationData[];
  ADMIN: TypeNavigationData[];
}

const data: TypeSidebar = {
 ENTREPRENEUR: [
  {
    icon: "Home", // ✅ Existe
    lien: "/dashboard",
    label: "Accueil",
  },
  {
    icon: "LayoutDashboard",
    lien: "/projets",
    label: "Projets",
  },
  {
    icon: "BadgeDollarSign", // 🔄 Pour les financements
    lien: "financements",
    label: "Financements",
  },
  {
    icon: "User", // 🔄 "profil" n'existait pas
    lien: "/profil",
    label: "Profil",
  },
    {
    icon: "User", // 🔄 "profil" n'existait pas
    lien: "mentor",
    label: "Mentor disponible",
  },
],
  MENTOR: [
    {
      icon: "Home",
      lien: "/dashboard",
      label: "Accueil",
    },
    {
      icon: "FolderOpen",
      lien: "/projets",
      label: "Projets suivis",
    },
    {
      icon: "MessageSquare",
      lien: "/demandes",
      label: "Demandes accompagnement",
    }
  ],
  INVESTISSEUR: [
    {
      icon: "Home",
      lien: "/dashboard",
      label: "Accueil",
    },
    {
      icon: "BadgeDollarSign",
      lien: "/financements",
      label: "Mes financements",
    },
    {
      icon: "FolderSearch",
      lien: "/projets",
      label: "Projets à financer",
    },
    {
      icon: "User",
      lien: "/profil",
      label: "Profil",
    },
  ],
  ADMIN: [
    {
      icon: "Home",
      lien: "/dashboard",
      label: "Accueil",
    },
    {
      icon: "Users",
      lien: "/mentors",
      label: "Mentors",
    },
    {
      icon: "Building",
      lien: "/investisseurs",
      label: "Investisseurs",
    },
    {
      icon: "User",
      lien: "/entrepreneurs",
      label: "Entrepreneurs",
    },
  ],
};

export const SideBar = ({ role, projetCourant }: { role: RoleUtilisateur, projetCourant?: any }) => {
  const dataNavigation = data[role];
  console.log(projetCourant)
  return (
    // Conteneur principal : fixé à gauche, pleine hauteur, disposition en colonne
    <aside className="flex flex-col h-screen w-64 border-r bg-white">
      <nav className="flex flex-col gap-2 p-4">
        {dataNavigation.map((item: TypeNavigationData) => {
          return (
            <Link
              key={item.lien} // Toujours ajouter une key unique dans un map
              to={item.lien}
              activeProps={{ className: "text-blue-600 bg-blue-50 font-bold" }}
              className="group flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <IconNavigation name={item.icon??"House"} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  )


};

const IconNavigation = ({ name }: { name: string }) => {
  // 1. Cast the collection to any or a specific record to allow indexing
  // 2. Assign to a Capitalized variable so JSX recognizes it as a component
  const LucideIcon = (Icon as any)[name];

  if (!LucideIcon) {
    return null; // Or a fallback icon like <Icons.HelpCircle />
  }

  return (
    <div>
      <LucideIcon size={20} />
    </div>
  );
};
