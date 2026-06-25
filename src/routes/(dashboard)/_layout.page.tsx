import { Outlet, useNavigate } from "@tanstack/react-router";
import { SideBar } from "@/components/sideBar/sideBar";
import { NotificationBell, UserMenu } from "@/components/shared/TopBar";
import { authStore } from "@/stores/authStore";
import { useProjetCourant } from "@/hooks/useStades";
import { apiClient } from "@/lib/apiClient";
import { ROLE_LABELS } from "@/lib/constants";

export default function DashboardLayout() {
  const user = authStore((state) => state.utilisateur);
  const role = user?.role ??"ENTREPRENEUR";
  const navigate = useNavigate();


  const onDeconnexion = async () => {
    try {
      await apiClient.delete("auth/deconnexion");
      authStore.getState().logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Echec de la deconnexion :", error);
    }
  };



  const { data: projetCourant } = useProjetCourant({
    enabled: role === "ENTREPRENEUR",
  });

  const initiales = user
    ? `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase()
    : "?";
  const nomComplet = user ? `${user.prenom} ${user.nom}` : "";
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : "";

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-bg-shell)]">
      <div className="flex h-full overflow-hidden bg-[var(--color-bg-shell)]">
        <SideBar
          role={role}
          projetCourant={projetCourant ?? null}
          userName={nomComplet}
          userInitials={initiales}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
          {/* Floating Top Actions */}
          <div className="absolute top-4 right-8 z-50 flex items-center gap-2">
            <NotificationBell />
            <div className="w-px h-6 bg-[var(--color-border)] mx-1 hidden sm:block" />
            <UserMenu
              userName={nomComplet}
              userInitials={initiales}
              userRole={roleLabel}
              onDeconnexion={onDeconnexion}
            />
          </div>

          <main className="hide-scrollbar flex-1 overflow-y-auto px-8 pt-16 pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
