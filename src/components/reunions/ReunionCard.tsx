import { useEffect, useState } from 'react';
import type { ReunionSession } from '@matura/shared';
import { useConfirmerReunion, useRefuserReunion } from '@/hooks/useReunions';
import { useNavigate } from '@tanstack/react-router';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { Video, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  reunion: ReunionSession;
}

export function ReunionCard({ reunion }: Props) {
  const user = authStore((s) => s.utilisateur);
  const navigate = useNavigate();
  const confirmer = useConfirmerReunion();
  const refuser = useRefuserReunion();
  
  const [countdown, setCountdown] = useState<string>('');
  
  const isParticipant = user?.id === reunion.participant_id;
  const isInitiator = user?.id === reunion.initiateur_id;
  const otherPerson = isInitiator ? reunion.participant : reunion.initiateur;

  useEffect(() => {
    if (reunion.date_planifiee && (reunion.statut === 'CONFIRME' || reunion.statut === 'EN_COURS')) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const planifie = new Date(reunion.date_planifiee!).getTime();
        const diff = planifie - now;
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${days > 0 ? days + 'j ' : ''}${hours}h ${mins}m ${secs}s`);
        } else {
          setCountdown('Maintenant');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [reunion.date_planifiee, reunion.statut]);

  const handleRejoindre = () => {
    navigate({ to: '/reunions/$reunionId/rejoindre', params: { reunionId: reunion.id } });
  };

  const handleConfirmer = () => {
    confirmer.mutate(reunion.id, {
      onSuccess: () => toast.success('Réunion confirmée'),
    });
  };

  const handleRefuser = () => {
    refuser.mutate(reunion.id, {
      onSuccess: () => toast.success('Réunion refusée'),
    });
  };

  return (
    <div className="border border-zinc-200 rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {reunion.type}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            reunion.statut === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-700' :
            reunion.statut === 'CONFIRME' ? 'bg-green-100 text-green-700' :
            reunion.statut === 'REFUSE' ? 'bg-red-100 text-red-700' :
            reunion.statut === 'EN_COURS' ? 'bg-purple-100 text-purple-700' :
            'bg-zinc-100 text-zinc-700'
          }`}>
            {reunion.statut}
          </span>
        </div>
        
        <h4 className="font-medium text-zinc-900">
          Avec {otherPerson.prenom} {otherPerson.nom}
        </h4>
        
        <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
          {reunion.date_planifiee ? (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(reunion.date_planifiee).toLocaleString('fr-FR')}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <Video className="w-4 h-4" />
              Appel instantané
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {reunion.statut === 'EN_ATTENTE' && isParticipant && (
          <div className="flex gap-2">
            <button onClick={handleConfirmer} disabled={confirmer.isPending} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Confirmer
            </button>
            <button onClick={handleRefuser} disabled={refuser.isPending} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium">
              <XCircle className="w-4 h-4" /> Refuser
            </button>
          </div>
        )}
        
        {reunion.statut === 'EN_ATTENTE' && isInitiator && (
          <p className="text-sm text-zinc-500 italic">En attente de confirmation</p>
        )}

        {(reunion.statut === 'CONFIRME' || reunion.statut === 'EN_COURS') && (
          <div className="flex flex-col items-end gap-1">
            <button 
              onClick={handleRejoindre} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition"
            >
              <Video className="w-4 h-4" />
              Rejoindre
            </button>
            {countdown && <span className="text-xs text-blue-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> {countdown}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
