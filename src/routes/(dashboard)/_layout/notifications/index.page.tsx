import { Link } from '@tanstack/react-router';
import { useNotifications, useMarquerToutesLues, useMarquerLue } from '@/hooks/useNotifications';
import { Bell, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatNotificationCorps(corps: string): string {
  const dateRegex = /\[DATE:([^\]]+)\]/g;
  return corps.replace(dateRegex, (_, isoString) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  });
}

export default function NotificationsPage() {
  const { data: notifs, isLoading } = useNotifications();
  const toutLire = useMarquerToutesLues();
  const marquerLue = useMarquerLue();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-zinc-400" />
          Toutes les notifications
        </h1>
        {notifs && notifs.some(n => !n.lue) && (
          <button
            onClick={() => toutLire.mutate()}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Tout marquer lu
          </button>
        )}
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Chargement...</div>
        ) : notifs && notifs.length > 0 ? (
          <div className="divide-y divide-zinc-100">
            {notifs.map((n) => (
              <Link
                key={n.id}
                to={n.lien_relatif ?? '/dashboard'}
                onClick={() => {
                  if (!n.lue) marquerLue.mutate(n.id);
                }}
                className={cn(
                  "block p-5 hover:bg-zinc-50 transition-colors",
                  !n.lue && "bg-green-50/10"
                )}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className={cn("text-sm text-zinc-900", !n.lue && "font-bold")}>
                      {n.titre}
                    </h3>
                    <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                      {formatNotificationCorps(n.corps)}
                    </p>
                    <p className="text-xs text-zinc-400 mt-2">
                      {new Date(n.cree_le).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!n.lue && (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 mt-1" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 mb-1">Aucune notification</h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              Vous êtes à jour ! Vous n'avez aucune notification pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
