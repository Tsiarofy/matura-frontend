// Exemple de syntaxe v4 dans React
interface ProfileCardProps {
  name: string;
  role: string;
  isOnline: boolean;
}

export default function ProfileCard({ name, role, isOnline }:ProfileCardProps) {
  return (
    <div className="group relative p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300">
      
      {/* Badge "Online" avec positionnement absolu */}
      {isOnline && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      )}

      <div className="space-y-4"> 
      {/* space-y-4 ajoute une marge automatique entre les enfants verticaux */}
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-slate-500">{role}</p>
        
        {/* Bouton avec effet Hover et Active (v4) */}
        <button className="w-full py-2 bg-slate-900 text-white rounded-lg font-semibold 
                           hover:bg-indigo-600 active:scale-95 transition-all">
          Voir le profil
        </button>
      </div>
    </div>
  );
}