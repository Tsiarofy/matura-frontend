import { AlertCircle, Lightbulb, TrendingUp, DollarSign, Users } from 'lucide-react'

export function AideStade3() {
  return (
    <div className="space-y-4">
      {/* Type de projet */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Type de client</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          Le type de client (B2B, B2C ou B2B2C) est défini lors de la création du projet. Il détermine la source de la base du marché : INSTAT (B2C) ou déclaratif (B2B).
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic font-medium">Exemples :</p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• <strong>B2C</strong> : Application mobile pour particuliers</li>
            <li>• <strong>B2B</strong> : Logiciel de gestion pour entreprises</li>
            <li>• <strong>B2B2C</strong> : Plateforme de livraison (restaurants → clients)</li>
          </ul>
        </div>
      </div>

      {/* Zone géographique */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Zone géographique ciblée</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          La zone sélectionnée au Stade 1 est votre référence. La base totale (TAM B2C) est la population INSTAT 2018 de cette zone.
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic">
            Exemple : « Base totale = population INSTAT 2018 de la zone ciblée ».
          </p>
        </div>
      </div>

      {/* Estimation utilisateurs */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Pourcentage d'utilisateurs</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Estimez le pourcentage de la population totale qui utilisera réellement votre produit. Soyez réaliste : 100% est rarement atteint.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic font-medium">Exemples :</p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• Produit de masse : 10-30%</li>
            <li>• Produit niche : 1-5%</li>
            <li>• Produit indispensable : 30-50%</li>
          </ul>
        </div>
      </div>

      {/* Concurrents */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Analyse concurrentielle</h3>
        </div>
        <p className="text-orange-800 mb-3 text-sm">
          Identifiez vos concurrents directs, indirects et substituts. Estimez leur part de marché globale et dans votre zone ciblée.
        </p>
        <div className="bg-white border border-orange-200 p-3 rounded">
          <p className="text-sm text-orange-700 italic font-medium">Types de concurrence :</p>
          <ul className="text-sm text-orange-700 mt-2 space-y-1">
            <li>• <strong>Direct</strong> : Même produit, même marché</li>
            <li>• <strong>Indirect</strong> : Produit différent, même besoin</li>
            <li>• <strong>Substitut</strong> : Solution alternative (ex: vélo vs taxi)</li>
          </ul>
        </div>
      </div>

      {/* TAM / SAM / SOM */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">TAM / SAM / SOM</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          Ces trois métriques structurent votre analyse de marché et sont essentielles pour les investisseurs.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded space-y-3">
          <div>
            <p className="text-sm text-purple-700 font-semibold">TAM</p>
            <p className="text-sm text-purple-600 italic">Taille totale du marché (B2C : base INSTAT de la zone ; B2B : déclaratif).</p>
          </div>
          <div>
            <p className="text-sm text-purple-700 font-semibold">SAM</p>
            <p className="text-sm text-purple-600 italic">Part du marché que vous pouvez réellement servir.</p>
          </div>
          <div>
            <p className="text-sm text-purple-700 font-semibold">SOM</p>
            <p className="text-sm text-purple-600 italic">Objectif réaliste de conquête An 1.</p>
          </div>
        </div>
      </div>

      {/* Positionnement prix */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Positionnement prix & IRP</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Le prix doit être aligné avec le pouvoir d'achat de votre zone cible. L'IRP (Indice de Réalisme Prix) valide cette cohérence.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic">
            💡 Si votre prix {'>'} 30% du revenu moyen mensuel, l'IRP sera faible et vous devrez justifier.
          </p>
        </div>
      </div>

      {/* Alertes automatiques */}
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Alertes automatiques</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Le système vous alerte si vos objectifs dépassent des seuils de réalisme (basés sur le marché libre).
        </p>
        <div className="bg-white border border-red-200 p-3 rounded">
          <p className="text-sm text-red-700 font-medium">Seuils (spec 80/20/5) :</p>
          <ul className="text-sm text-red-700 mt-2 space-y-1">
            <li>• <strong>Rouge</strong> si SAM (libre) &gt; 80%</li>
            <li>• <strong>Rouge</strong> si SOM (libre, An 1) &gt; 20%</li>
            <li>• <strong>Orange</strong> si SOM (libre, An 1) &gt; 5%</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
