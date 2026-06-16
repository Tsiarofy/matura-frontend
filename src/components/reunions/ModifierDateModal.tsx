import { useState } from 'react';
import { useModifierDateReunion } from '@/hooks/useReunions';
import { toast } from 'sonner';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reunionId: string;
  currentDate?: string | null;
}

export function ModifierDateModal({ isOpen, onClose, reunionId, currentDate }: Props) {
  const [date, setDate] = useState(() => {
    if (currentDate) {
      return new Date(currentDate).toISOString().split('T')[0];
    }
    return '';
  });
  const [time, setTime] = useState(() => {
    if (currentDate) {
      const d = new Date(currentDate);
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    }
    return '';
  });
  
  const [dateError, setDateError] = useState('');
  
  const modifierDate = useModifierDateReunion();

  const validateDateTime = (selectedDate: string, selectedTime: string) => {
    if (selectedDate && selectedTime) {
      const parsed = new Date(`${selectedDate}T${selectedTime}:00`);
      if (parsed.getTime() <= Date.now()) {
        setDateError("La date et l'heure doivent être dans le futur.");
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }
    
    const parsedDate = new Date(`${date}T${time}:00`);
    if (parsedDate.getTime() <= Date.now()) {
      setDateError("La date et l'heure doivent être dans le futur.");
      toast.error('La date et l\'heure de la réunion doivent être dans le futur.');
      return;
    }

    const datePlanifiee = parsedDate.toISOString();

    modifierDate.mutate({ id: reunionId, date_planifiee: datePlanifiee }, {
      onSuccess: () => {
        toast.success('Proposition de nouvelle date envoyée');
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Erreur lors de la modification');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Proposer une autre date</h2>
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
              onChange={(e) => {
                setDate(e.target.value);
                validateDateTime(e.target.value, time);
              }}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all duration-200 ${
                dateError 
                  ? 'border-red-300 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-400' 
                  : 'border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Heure</label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                validateDateTime(date, e.target.value);
              }}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-all duration-200 ${
                dateError 
                  ? 'border-red-300 bg-red-50/20 text-red-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-400' 
                  : 'border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {dateError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200/60 text-red-800 p-2.5 rounded-lg text-xs mt-2.5 shadow-sm transition-all duration-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-0.5">
                  <span className="font-semibold block text-red-900">Date/Heure non valide</span>
                  <span className="leading-relaxed block">{dateError}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              onClick={onClose}
              variant="neutral"
              className="w-1/2 py-2 text-sm font-medium cursor-pointer border border-[#eeeeea]"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={modifierDate.isPending || !!dateError}
              variant="default"
              className="w-1/2 py-2 text-sm font-medium cursor-pointer"
            >
              {modifierDate.isPending ? 'Envoi...' : 'Valider'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
