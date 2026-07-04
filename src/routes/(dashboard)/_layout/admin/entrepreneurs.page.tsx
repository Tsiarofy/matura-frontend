import { useState } from "react";
import { useAdminEntrepreneurs } from "@/hooks/useAdmin";
import { SearchInput } from "@/components/ui/input";
import { Loader2, Rocket } from "lucide-react";
import { getFileUrl } from "@/lib/apiClient";
import { authStore } from "@/stores/authStore";

export default function AdminEntrepreneursPage() {
  const user = authStore((state) => state.utilisateur);
  if (user?.role !== 'ADMIN') {
    window.location.href = '/dashboard';
    return null;
  }

  const [search, setSearch] = useState("");
  
  const { data: entrepreneurs, isLoading } = useAdminEntrepreneurs();

  const entrepreneursFiltres = (entrepreneurs ?? [])
    .filter(e => 
      `${e.prenom} ${e.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="page-shell">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
            Entrepreneurs
          </h1>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Consultez la liste des entrepreneurs inscrits sur la plateforme.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          onClear={() => setSearch("")}
          containerClassName="w-full sm:max-w-[360px]"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-green-600" />
        </div>
      ) : entrepreneursFiltres.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="icon-chip h-12 w-12 bg-zinc-100">
            <Rocket className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            Aucun entrepreneur trouvé.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entrepreneursFiltres.map((entrepreneur) => (
            <div key={entrepreneur.id} className="rounded-[22px] border border-zinc-200 bg-white p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                    <img 
                      src={getFileUrl(entrepreneur.url_avatar) || `https://ui-avatars.com/api/?name=${entrepreneur.prenom}+${entrepreneur.nom}&background=f4f4f5&color=3f3f46`} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-zinc-900">{entrepreneur.prenom} {entrepreneur.nom}</h3>
                    <p className="text-[12px] text-zinc-500">{entrepreneur.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-50 rounded-xl p-3 text-[12px] text-zinc-600 space-y-1">
                <p><strong>Projets :</strong> {entrepreneur._count?.projets_possedes ?? 0} projet(s)</p>
                <p><strong>Secteur :</strong> {entrepreneur.profil?.secteur_activite || 'Non spécifié'}</p>
                <p><strong>Inscription :</strong> {new Date(entrepreneur.cree_le).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
