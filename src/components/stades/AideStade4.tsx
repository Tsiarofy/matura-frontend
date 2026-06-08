import { ArrowRight, Target, Users, Cpu, Wrench, Handshake, DollarSign, TrendingUp } from 'lucide-react'

export function AideStade4() {
  return (
    <div className="space-y-4">
      {/* Évolution depuis Lean Canvas */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Évolution depuis Lean Canvas</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          Le Business Model Canvas (BMC) est une version plus détaillée du Lean Canvas. Il ajoute des dimensions opérationnelles et structurelles.
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic">
            Lean Canvas = Focus validation (problème/solution)<br />
            BMC = Focus exécution (ressources/activités/partenaires)
          </p>
        </div>
      </div>

      {/* Propositions de valeur */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Propositions de valeur</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          Développez votre proposition de valeur en plusieurs dimensions : fonctionnelle, émotionnelle, sociale, économique.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded">
          <p className="text-sm text-purple-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-purple-700 mt-2">
            • Fonctionnelle : Stockage 3x plus efficace<br />
            • Émotionnelle : Tranquillité d'esprit pour l'agriculteur<br />
            • Économique : Réduction des pertes = revenus +30%
          </p>
        </div>
      </div>

      {/* Segments clients */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Segments clients</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Détaillez vos personas : besoins, comportements, points de douleur, motivations d'achat.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic">
            💡 Plus vos personas sont précis, plus votre BMC sera pertinent.
          </p>
        </div>
      </div>

      {/* Ressources clés */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Ressources clés</h3>
        </div>
        <p className="text-orange-800 mb-3 text-sm">
          Les ressources indispensables pour créer et délivrer votre proposition de valeur.
        </p>
        <div className="bg-white border border-orange-200 p-3 rounded">
          <p className="text-sm text-orange-700 italic font-medium">Types de ressources :</p>
          <ul className="text-sm text-orange-700 mt-2 space-y-1">
            <li>• Physiques : Entrepôts, équipements, véhicules</li>
            <li>• Intellectuelles : Brevets, savoir-faire, données</li>
            <li>• Humaines : Expertise technique, équipe terrain</li>
            <li>• Financières : Cash, lignes de crédit</li>
          </ul>
        </div>
      </div>

      {/* Activités clés */}
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Activités clés</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Les actions indispensables pour faire fonctionner votre modèle d'affaires.
        </p>
        <div className="bg-white border border-red-200 p-3 rounded">
          <p className="text-sm text-red-700 italic font-medium">Exemples :</p>
          <ul className="text-sm text-red-700 mt-2 space-y-1">
            <li>• Production : Fabrication, assemblage</li>
            <li>• Résolution de problèmes : R&D, support client</li>
            <li>• Plateforme : Maintenance IT, développement</li>
            <li>• Réseau : Logistique, distribution</li>
          </ul>
        </div>
      </div>

      {/* Partenaires clés */}
      <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Handshake className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-pink-900">Partenaires clés</h3>
        </div>
        <p className="text-pink-800 mb-3 text-sm">
          Les fournisseurs et partenaires qui vous permettent de fonctionner efficacement.
        </p>
        <div className="bg-white border border-pink-200 p-3 rounded">
          <p className="text-sm text-pink-700 italic font-medium">Types de partenariats :</p>
          <ul className="text-sm text-pink-700 mt-2 space-y-1">
            <li>• Stratégiques : Alliances, co-développement</li>
            <li>• Non-stratégiques : Fournisseurs, sous-traitants</li>
            <li>• Coopétition : Concurrents sur certains projets</li>
          </ul>
        </div>
      </div>

      {/* Sources de revenus */}
      <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Sources de revenus</h3>
        </div>
        <p className="text-emerald-800 mb-3 text-sm">
          Comment vous générez de la valeur monétaire à partir de chaque segment client.
        </p>
        <div className="bg-white border border-emerald-200 p-3 rounded">
          <p className="text-sm text-emerald-700 italic">
            💡 Diversifiez vos revenus pour réduire la dépendance à un seul flux.
          </p>
        </div>
      </div>

      {/* Structure de coûts */}
      <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-cyan-600" />
          <h3 className="font-semibold text-cyan-900">Structure de coûts</h3>
        </div>
        <p className="text-cyan-800 mb-3 text-sm">
          Tous les coûts pour faire fonctionner votre modèle d'affaires.
        </p>
        <div className="bg-white border border-cyan-200 p-3 rounded">
          <p className="text-sm text-cyan-700 italic font-medium">Modèles de coûts :</p>
          <ul className="text-sm text-cyan-700 mt-2 space-y-1">
            <li>• Coûts fixes : Salaires, loyers, amortissements</li>
            <li>• Coûts variables : Matières premières, commissions</li>
            <li>• Économies d'échelle : Coût unitaire ↓ avec volume ↑</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
