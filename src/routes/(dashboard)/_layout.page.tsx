import { Outlet, useNavigate } from "@tanstack/react-router";
import { SideBar } from "@/components/sideBar/sideBar";
import { TopBar } from "@/components/shared/TopBar";
import { authStore } from "@/stores/authStore";
import { useProjetCourant } from "@/hooks/useStades";
import { apiClient } from "@/lib/apiClient";
import { ROLE_LABELS } from "@/lib/constants";

export default function DashboardLayout() {
  const user = authStore((state) => state.utilisateur);
  const role = user?.role ?? "INVESTISSEUR";
  const navigate = useNavigate();

  // ── Déconnexion (logique inchangée) ──────────────────────────────────────
  const onDeconnexion = async () => {
    try {
      await apiClient.delete("auth/deconnexion");
      authStore.getState().logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Echec de la deconnexion :", error);
    }
  };

  // ── Projet courant (ENTREPRENEUR uniquement, logique inchangée) ───────────

  const { data: projetCourant } = useProjetCourant({
    enabled: role === "ENTREPRENEUR",
  });

  const initiales = user
    ? `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase()
    : "?";
  const nomComplet = user ? `${user.prenom} ${user.nom}` : "";
  const roleLabel = user ? (ROLE_LABELS[user.role] ?? user.role) : "";

  return (
    // Conteneur racine — plein écran, pas de scroll global
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <SideBar
        role={role}
        projetCourant={projetCourant ?? null}
        userName={nomComplet}
        userInitials={initiales}
      />

      {/* ── Zone principale (TopBar + contenu) ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* TopBar sticky glassmorphism */}
        <TopBar
          userName={nomComplet}
          userInitials={initiales}
          userRole={roleLabel}
          onDeconnexion={onDeconnexion}
        />

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
