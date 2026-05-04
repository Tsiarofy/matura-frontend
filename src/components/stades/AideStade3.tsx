import { Users, TrendingUp, AlertTriangle, DollarSign, BarChart3, Target, Globe } from 'lucide-react'

export function AideStade3() {
  return (
    <div className="space-y-4">
      {/* Type de projet */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Type de projet</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          Le type de projet (B2B, B2C ou B2B2C) a été défini lors de la création de votre projet. Il détermine la manière dont vous analyserez votre marché.
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
      <div className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Zone géographique ciblée</h3>
        </div>
        <p className="text-indigo-800 mb-3 text-sm">
          La zone sélectionnée au Stade 1 est affichée ici. Vous pouvez la redéfinir si vos études de marché ont révélé une zone plus pertinente.
        </p>
        <div className="bg-white border border-indigo-200 p-3 rounded">
          <p className="text-sm text-indigo-700 italic">
            💡 La population affichée est basée sur les données INSTAT 2018.
          </p>
        </div>
      </div>

      {/* Estimation utilisateurs */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Pourcentage d'utilisateurs</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          Estimez le pourcentage de la population totale qui utilisera réellement votre produit. Soyez réaliste : 100% est rarement atteint.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded">
          <p className="text-sm text-purple-700 italic font-medium">Exemples :</p>
          <ul className="text-sm text-purple-700 mt-2 space-y-1">
            <li>• Produit de masse : 10-30%</li>
            <li>• Produit niche : 1-5%</li>
            <li>• Produit indispensable : 30-50%</li>
          </ul>
        </div>
      </div>

      {/* Enquêtes terrain */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Enquêtes terrain</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Les enquêtes terrain valident vos hypothèses. Un taux de réponse positif élevé indique un besoin réel.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic font-medium">Bonnes pratiques :</p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• Échantillon minimum : 50 personnes</li>
            <li>• Méthode mixte (en face + téléphone) pour plus de fiabilité</li>
            <li>• Taux de réponse positif {'<'} 20% = signal fort</li>
          </ul>
        </div>
      </div>

      {/* Concurrents */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
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
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">TAM / SAM / SOM</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Ces trois métriques structurent votre analyse de marché et sont essentielles pour les investisseurs.
        </p>
        <div className="bg-white border border-red-200 p-3 rounded space-y-3">
          <div>
            <p className="text-sm text-red-700 font-semibold">TAM (Total Addressable Market)</p>
            <p className="text-sm text-red-600 italic">Marché total théorique si tout le monde utilisait votre produit. Ex: tous les consommateurs mondiaux.</p>
          </div>
          <div>
            <p className="text-sm text-red-700 font-semibold">SAM (Serviceable Available Market)</p>
            <p className="text-sm text-red-600 italic">Marché que vous pouvez réellement servir avec votre modèle actuel. Ex: consommateurs dans votre zone géographique.</p>
          </div>
          <div>
            <p className="text-sm text-red-700 font-semibold">SOM (Serviceable Obtainable Market)</p>
            <p className="text-sm text-red-600 italic">Marché réaliste que vous pouvez conquérir la première année. Early-stage: généralement 2-5% du SAM.</p>
          </div>
        </div>
      </div>

      {/* Positionnement prix */}
      <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-900">Positionnement prix & IRP</h3>
        </div>
        <p className="text-yellow-800 mb-3 text-sm">
          Le prix doit être aligné avec le pouvoir d'achat de votre zone cible. L'IRP (Indice de Réalisme Prix) valide cette cohérence.
        </p>
        <div className="bg-white border border-yellow-200 p-3 rounded">
          <p className="text-sm text-yellow-700 italic">
            💡 Si votre prix {'>'} 30% du revenu moyen mensuel, l'IRP sera faible et vous devrez justifier.
          </p>
        </div>
      </div>

      {/* Alertes automatiques */}
      <div className="border-l-4 border-rose-500 bg-rose-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="font-semibold text-rose-900">Alertes automatiques</h3>
        </div>
        <p className="text-rose-800 mb-3 text-sm">
          Le système vous alerte si vos objectifs de marché semblent irréalistes par rapport aux benchmarks startup.
        </p>
        <div className="bg-white border border-rose-200 p-3 rounded">
          <p className="text-sm text-rose-700 font-medium">Seuils d'alerte :</p>
          <ul className="text-sm text-rose-700 mt-2 space-y-1">
            <li>• <span className="text-green-600 font-semibold">Vert</span> : SOM ≤ 10% des utilisateurs calculés (réaliste)</li>
            <li>• <span className="text-orange-600 font-semibold">Orange</span> : SOM 10-30% des utilisateurs calculés (ambitieux)</li>
            <li>• <span className="text-red-600 font-semibold">Rouge</span> : SOM {'>'} 30% des utilisateurs calculés (irréaliste)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
