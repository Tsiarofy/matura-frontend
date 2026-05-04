import React from 'react'
import { AlertCircle, Target, Users, MapPin, Search } from 'lucide-react'

interface AffichageCalculsInformatifsProps {
  numStade: number
  calculs: Record<string, unknown> | null | undefined
  role: 'MENTOR' | 'INVESTISSEUR' | 'ENTREPRENEUR'
}

export function AffichageCalculsInformatifs({ numStade, calculs, role }: AffichageCalculsInformatifsProps) {
  if (!calculs || Object.keys(calculs).length === 0) {
    return null;
  }

  // Seuls le Mentor et l'Investisseur voient ces données (ou l'entrepreneur si on veut la transparence totale)
  if (role === 'ENTREPRENEUR') {
    return null; // On cache si l'entrepreneur ne doit pas le voir ici
  }

  const renderStade3 = (data: any) => {
    if (data.type_client === 'B2B') {
      return (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">TAM Saisi</p>
            <p className="text-xl font-bold text-zinc-800">{new Intl.NumberFormat('fr-FR').format(data.tam_saisi)} ents.</p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">SAM Saisi</p>
            <p className="text-xl font-bold text-zinc-800">{new Intl.NumberFormat('fr-FR').format(data.sam_saisi)} ents.</p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">SOM Saisi</p>
            <p className="text-xl font-bold text-zinc-800">{new Intl.NumberFormat('fr-FR').format(data.som_saisi)} ents.</p>
          </div>
        </div>
      );
    }

    // B2C
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-blue-700">
              <MapPin className="w-4 h-4" />
              <p className="text-xs uppercase tracking-wider font-semibold">Pop. Totale</p>
            </div>
            <p className="text-xl font-bold text-blue-900">{new Intl.NumberFormat('fr-FR').format(data.population_totale)}</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-indigo-700">
              <Users className="w-4 h-4" />
              <p className="text-xs uppercase tracking-wider font-semibold">Cible ({data.pct_utilisateurs}%)</p>
            </div>
            <p className="text-xl font-bold text-indigo-900">{new Intl.NumberFormat('fr-FR').format(data.population_concernee)}</p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-orange-700">
              <Search className="w-4 h-4" />
              <p className="text-xs uppercase tracking-wider font-semibold">Conc. ({data.parts_concurrents_zone_pct}%)</p>
            </div>
            <p className="text-xl font-bold text-orange-900">{new Intl.NumberFormat('fr-FR').format(data.population_occupee_concurrents)}</p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-green-700">
              <Target className="w-4 h-4" />
              <p className="text-xs uppercase tracking-wider font-semibold">Disponible</p>
            </div>
            <p className="text-xl font-bold text-green-900">{new Intl.NumberFormat('fr-FR').format(data.population_disponible)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
             <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">SAM ({new Intl.NumberFormat('fr-FR').format(data.sam_saisi)})</p>
             <p className="text-sm font-medium text-zinc-700">
               Représente <span className="font-bold">{data.sam_pct_utilisateurs?.toFixed(1)}%</span> des cibles
             </p>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm">
             <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">SOM ({new Intl.NumberFormat('fr-FR').format(data.som_saisi)})</p>
             <p className="text-sm font-medium text-zinc-700">
               Représente <span className="font-bold">{data.som_pct_utilisateurs?.toFixed(1)}%</span> des cibles
             </p>
          </div>
        </div>

        {data.alertes && data.alertes.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
               <AlertCircle className="w-4 h-4" />
               <p className="text-sm font-bold">Alertes de réalisme</p>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {data.alertes.map((alerte: string, idx: number) => (
                <li key={idx} className="text-xs text-red-800">{alerte}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-sm font-bold text-zinc-800 mb-4 border-b pb-2">Données analytiques du Stade (Vue Professionnelle)</h3>
      {numStade === 3 && calculs.stade_3 && renderStade3(calculs.stade_3)}
    </div>
  )
}
