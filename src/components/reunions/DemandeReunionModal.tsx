import { useState } from 'react';
import { useDemanderReunion, useAppelInstantane } from '@/hooks/useReunions';
import type { DemandeReunionDto } from '@matura/shared';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  participantId: string;
  projetId: string;
  type: 'SUIVI' | 'ENTRETIEN';
}

export function DemandeReunionModal({ isOpen, onClose, participantId, projetId, type }: Props) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  
  const demanderReunion = useDemanderReunion();
  const appelInstantane = useAppelInstantane();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }
    
    // Create ISO string
    const datePlanifiee = new Date(`${date}T${time}:00`).toISOString();
    
    const payload: DemandeReunionDto = {
      participant_id: participantId,
      projet_id: projetId,
      type,
      date_planifiee: datePlanifiee,
      message: message || undefined,
    };

    demanderReunion.mutate(payload, {
      onSuccess: () => {
        toast.success('Demande de réunion envoyée avec succès');
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Erreur lors de la demande');
      }
    });
  };

  const handleInstantane = () => {
    appelInstantane.mutate(
      { participant_id: participantId, projet_id: projetId, type },
      {
        onSuccess: (data) => {
          navigate({ to: '/reunions/$reunionId/rejoindre', params: { reunionId: data.id } });
          onClose();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Erreur lors de l\'appel');
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Planifier une réunion</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-full">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Heure</label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Message (optionnel)</label>
            <textarea 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Sujet de la réunion..."
              className="w-full px-3 py-2 border rounded-md resize-none"
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button 
              type="submit" 
              disabled={demanderReunion.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {demanderReunion.isPending ? 'Envoi...' : 'Envoyer la demande'}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-400 text-sm">OU</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            <button 
              type="button" 
              onClick={handleInstantane}
              disabled={appelInstantane.isPending}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Démarrer un appel instantané
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
