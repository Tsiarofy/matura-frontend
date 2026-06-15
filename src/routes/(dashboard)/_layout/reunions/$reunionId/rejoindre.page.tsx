import { useEffect, useState } from 'react';
import { useRejoindreReunion } from '@/hooks/useReunions';
import { MaturaLiveKitRoom } from '@/components/reunions/LiveKitRoom';
import { useNavigate, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Clock } from 'lucide-react';

export default function RejoindrePage() {
  const { reunionId } = useParams({ strict: false });
  const navigate = useNavigate();
  const rejoindre = useRejoindreReunion();
  
  const [lockedData, setLockedData] = useState<{ message: string, seconds: number, date: string } | null>(null);
  
  useEffect(() => {
    if (reunionId) {
      rejoindre.mutate(reunionId as string, {
        onError: (err: any) => {
          if (err.response?.status === 423) {
            // Locked
            setLockedData({
              message: err.response.data.message,
              seconds: err.response.data.secondes_restantes,
              date: err.response.data.date_planifiee
            });
          } else {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'accès à la réunion');
            setTimeout(() => {
              navigate({ to: '/reunions' });
            }, 100);
          }
        }
      });
    }
  }, [reunionId]);

  useEffect(() => {
    if (lockedData && lockedData.seconds > 0) {
      const interval = setInterval(() => {
        setLockedData(prev => prev ? { ...prev, seconds: prev.seconds - 1 } : null);
      }, 1000);
      return () => clearInterval(interval);
    } else if (lockedData && lockedData.seconds <= 0) {
      // Retry joining
      if (reunionId) {
        setLockedData(null);
        rejoindre.mutate(reunionId as string);
      }
    }
  }, [lockedData?.seconds]);

  if (lockedData) {
    const mins = Math.floor(lockedData.seconds / 60);
    const secs = lockedData.seconds % 60;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
        <Clock className="w-16 h-16 text-amber-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-semibold mb-2">Réunion bientôt disponible</h2>
        <p className="text-zinc-600 mb-6">{lockedData.message}</p>
        <div className="text-4xl font-mono bg-zinc-100 p-4 rounded-xl border border-zinc-200">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
        <p className="text-sm text-zinc-400 mt-4">La réunion s'ouvrira automatiquement.</p>
      </div>
    );
  }

  if (rejoindre.isPending || !rejoindre.data) {
    return <div className="flex justify-center items-center h-[70vh]">Connexion à LiveKit...</div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-zinc-950 overflow-hidden flex flex-col">
      <MaturaLiveKitRoom 
        token={rejoindre.data.token} 
        wsUrl={rejoindre.data.ws_url} 
        onLeave={() => {
          setTimeout(() => {
            navigate({ to: '/reunions' });
          }, 150);
        }}
      />
    </div>
  );
}
