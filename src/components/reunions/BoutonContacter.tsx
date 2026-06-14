import { useState } from 'react';
import { useAppelInstantane } from '@/hooks/useReunions';
import { DemandeReunionModal } from './DemandeReunionModal';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  participantId: string;
  projetId: string;
  type: 'SUIVI' | 'ENTRETIEN';
}

export function BoutonContacter({ participantId, projetId, type }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appelInstantane = useAppelInstantane();
  const navigate = useNavigate();

  const handleInstantane = () => {
    appelInstantane.mutate(
      { participant_id: participantId, projet_id: projetId, type },
      {
        onSuccess: (data) => {
          navigate({ to: '/reunions/$reunionId/rejoindre', params: { reunionId: data.id } });
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Erreur lors de l\'appel');
        }
      }
    );
  };

  return (
    <div className="flex gap-2 items-center">
      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
        <Calendar className="w-4 h-4 mr-2" />
        Réserver
      </Button>
      <Button size="sm" onClick={handleInstantane} disabled={appelInstantane.isPending}>
        <Phone className="w-4 h-4 mr-2" />
        Appeler
      </Button>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/reunions' })} className="text-zinc-600 hover:text-zinc-900">
        <CalendarDays className="w-4 h-4 mr-2" />
        Gérer les réunions
      </Button>
      
      {isModalOpen && (
        <DemandeReunionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          participantId={participantId}
          projetId={projetId}
          type={type}
        />
      )}
    </div>
  );
}
