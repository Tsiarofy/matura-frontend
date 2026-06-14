import { useMesReunions } from '@/hooks/useReunions';
import { ReunionCard } from './ReunionCard';
import { Video } from 'lucide-react';

export function ReunionScreen() {
  const { data: reunions, isLoading } = useMesReunions();

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-500">Chargement des réunions...</div>;
  }

  if (!reunions || reunions.length === 0) {
    return (
      <div className="p-12 text-center border rounded-2xl bg-zinc-50 border-dashed">
        <Video className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 mb-1">Aucune réunion</h3>
        <p className="text-sm text-zinc-500">Vous n'avez pas de réunions planifiées ou d'historique récent.</p>
      </div>
    );
  }

  const aVenir = reunions.filter(r => r.statut === 'CONFIRME' || r.statut === 'EN_COURS');
  const enAttente = reunions.filter(r => r.statut === 'EN_ATTENTE');
  const historique = reunions.filter(r => r.statut === 'TERMINEE' || r.statut === 'EXPIREE' || r.statut === 'REFUSE');

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Mes Réunions</h1>
        <p className="text-zinc-500">Gérez vos appels vidéo avec vos mentors ou investisseurs.</p>
      </div>

      {enAttente.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            En attente de confirmation ({enAttente.length})
          </h2>
          <div className="space-y-3">
            {enAttente.map(r => <ReunionCard key={r.id} reunion={r} />)}
          </div>
        </section>
      )}

      {aVenir.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            À venir & En cours ({aVenir.length})
          </h2>
          <div className="space-y-3">
            {aVenir.map(r => <ReunionCard key={r.id} reunion={r} />)}
          </div>
        </section>
      )}

      {historique.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
            Historique
          </h2>
          <div className="space-y-3 opacity-75">
            {historique.map(r => <ReunionCard key={r.id} reunion={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
