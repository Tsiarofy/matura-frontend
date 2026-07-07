import { useState } from "react";
import { useAdminInvestisseurs, useMajStatutCompte } from "@/hooks/useAdmin";
import { SearchInput } from "@/components/ui/input";
import { Loader2, BriefcaseBusiness, Check, X, ShieldAlert } from "lucide-react";
import { StatutBadge } from "@/components/shared/StatutBadge";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/lib/apiClient";
import { authStore } from "@/stores/authStore";

export default function AdminInvestisseursPage() {
  const user = authStore((state) => state.utilisateur);
  if (user?.role !== 'ADMIN') {
    window.location.href = '/dashboard';
    return null;
  }

  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<"TOUS" | "EN_ATTENTE" | "APPROUVE" | "REJETE">("TOUS");
  
  const { data: investisseurs, isLoading } = useAdminInvestisseurs();
  const majStatut = useMajStatutCompte();

  const investisseursFiltres = (investisseurs ?? [])
    .filter(i => filtre === "TOUS" || i.statut_compte === filtre)
    .filter(i => 
      `${i.prenom} ${i.nom}`.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      (i.profil?.sous_type || "").toLowerCase().includes(search.toLowerCase())
    );

  const handleStatut = (id: string, statut: 'APPROUVE' | 'REJETE' | 'SUSPENDU') => {
    const actionLabel = statut === 'APPROUVE' ? 'approuver' : (statut === 'REJETE' ? 'rejeter' : 'suspendre');
    if (confirm(`Êtes-vous sûr de vouloir ${actionLabel} ce compte ?`)) {
      majStatut.mutate({ id, statut });
    }
  };

  return (
    <div className="page-shell">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)]">
            Validation des Investisseurs
          </h1>
          <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
            Gérez les inscriptions et les accès des investisseurs sur la plateforme.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email ou type..."
          onClear={() => setSearch("")}
          containerClassName="w-full sm:max-w-[360px]"
        />
        
        <div className="flex bg-white rounded-full border border-zinc-200 p-1 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {(["TOUS", "EN_ATTENTE", "APPROUVE", "REJETE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors whitespace-nowrap ${
                filtre === f 
                  ? "bg-zinc-100 text-zinc-900" 
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-green-600" />
        </div>
      ) : investisseursFiltres.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="icon-chip h-12 w-12 bg-zinc-100">
            <BriefcaseBusiness className="w-6 h-6 text-[var(--color-text-muted)]" />
          </div>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            Aucun investisseur trouvé pour ce filtre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investisseursFiltres.map((investisseur) => (
            <div key={investisseur.id} className="rounded-[22px] border border-zinc-200 bg-white p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                    <img 
                      src={getFileUrl(investisseur.url_avatar) || `https://ui-avatars.com/api/?name=${investisseur.prenom}+${investisseur.nom}&background=f4f4f5&color=3f3f46`} 
                      alt="avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-zinc-900">{investisseur.prenom} {investisseur.nom}</h3>
                    <p className="text-[12px] text-zinc-500">{investisseur.email}</p>
                  </div>
                </div>
                <StatutBadge statut={investisseur.statut_compte} />
              </div>
              
              <div className="bg-zinc-50 rounded-xl p-3 text-[12px] text-zinc-600 space-y-1">
                <p><strong>Type :</strong> {investisseur.profil?.sous_type || 'Non spécifié'}</p>
                <p><strong>Intérêts :</strong> {investisseur.profil?.domaines_interet?.join(', ') || 'Non spécifié'}</p>
                {investisseur.profil?.site_web && (
                  <p><a href={investisseur.profil.site_web} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Site web</a></p>
                )}
              </div>

              {investisseur.statut_compte === 'EN_ATTENTE' && (
                <div className="flex gap-2 mt-auto">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={() => handleStatut(investisseur.id, 'REJETE')}
                    disabled={majStatut.isPending}
                  >
                    <X className="w-4 h-4 mr-1" /> Rejeter
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none cursor-pointer"
                    onClick={() => handleStatut(investisseur.id, 'APPROUVE')}
                    disabled={majStatut.isPending}
                  >
                    <Check className="w-4 h-4 mr-1" /> Approuver
                  </Button>
                </div>
              )}
              {investisseur.statut_compte === 'APPROUVE' && (
                <div className="flex mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-200 text-amber-600 hover:bg-amber-50 text-[12px] h-8 cursor-pointer"
                    onClick={() => handleStatut(investisseur.id, 'SUSPENDU')}
                    disabled={majStatut.isPending}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Suspendre l'accès
                  </Button>
                </div>
              )}
              {investisseur.statut_compte === 'SUSPENDU' && (
                <div className="flex mt-auto">
                  <Button 
                    variant="outline" 
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 text-[12px] h-8 cursor-pointer"
                    onClick={() => handleStatut(investisseur.id, 'APPROUVE')}
                    disabled={majStatut.isPending}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" /> Réactiver l'accès
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
