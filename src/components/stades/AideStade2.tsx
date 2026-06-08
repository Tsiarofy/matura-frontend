import { AlertCircle, Lightbulb, Users, Target, Share2, DollarSign, TrendingUp, Zap, BarChart3 } from 'lucide-react'

export function AideStade2() {
  return (
    <div className="space-y-4">
      {/* Problème */}
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Problème</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Le problème est hérité du Stade 1. C'est le point de départ de votre Lean Canvas et doit être clair et spécifique.
        </p>
        <div className="bg-white border border-red-200 p-3 rounded">
          <p className="text-sm text-red-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-red-700 mt-2">
            "Les agriculteurs de Madagascar perdent 40% de leur récolte faute de stockage adéquat."
          </p>
        </div>
      </div>

      {/* Segments clients */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Segments clients</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          Définissez vos clients principaux et les segments secondaires. Soyez précis : "mères actives urbaines" est mieux que "femmes".
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-blue-700 mt-2">
            • Principal : Petits agriculteurs (1-5 ha) dans les régions de Vakinankaratra<br />
            • Secondaire : Coopératives agricoles (10-50 membres)
          </p>
        </div>
      </div>

      {/* Solution */}
      <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-900">Solution</h3>
        </div>
        <p className="text-yellow-800 mb-3 text-sm">
          Votre solution doit résoudre directement le problème identifié. Décrivez votre produit/service de manière concise.
        </p>
        <div className="bg-white border border-yellow-200 p-3 rounded">
          <p className="text-sm text-yellow-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-yellow-700 mt-2">
            "Entrepôts de stockage réfrigéré modulables avec système de gestion IoT pour optimiser la conservation."
          </p>
        </div>
      </div>

      {/* Proposition de valeur */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Proposition de valeur</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          Ce qui vous rend unique et pourquoi les clients vous choisiraient. C'est votre avantage concurrentiel.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded">
          <p className="text-sm text-purple-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-purple-700 mt-2">
            "Stockage 3x moins cher que les solutions existantes, avec suivi en temps réel et paiement à l'utilisation."
          </p>
        </div>
      </div>

      {/* Canaux */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Canaux</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Comment vous atteignez vos clients. Combinez canaux directs et indirects pour maximiser votre portée.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-green-700 mt-2">
            • Direct : Vente terrain, application mobile<br />
            • Indirect : Coopératives agricoles, revendeurs locaux
          </p>
        </div>
      </div>

      {/* Sources de revenus */}
      <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Sources de revenus</h3>
        </div>
        <p className="text-emerald-800 mb-3 text-sm">
          Comment vous gagnez de l'argent. Diversifiez vos sources pour réduire les risques.
        </p>
        <div className="bg-white border border-emerald-200 p-3 rounded">
          <p className="text-sm text-emerald-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-emerald-700 mt-2">
            • Abonnement mensuel par m² de stockage<br />
            • Commission sur transactions via la plateforme<br />
            • Services premium (analyse de données, assurance)
          </p>
        </div>
      </div>

      {/* Structure de coûts */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Structure de coûts</h3>
        </div>
        <p className="text-orange-800 mb-3 text-sm">
          Vos coûts fixes et variables. Identifiez les coûts les plus importants pour optimiser votre modèle.
        </p>
        <div className="bg-white border border-orange-200 p-3 rounded">
          <p className="text-sm text-orange-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-orange-700 mt-2">
            • Fixes : Location entrepôts, salaires, maintenance<br />
            • Variables : Électricité, personnel saisonnier, transport
          </p>
        </div>
      </div>

      {/* Avantage unique */}
      <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-pink-900">Avantage unique</h3>
        </div>
        <p className="text-pink-800 mb-3 text-sm">
          Ce qui vous rend difficile à copier. C'est souvent votre technologie, votre réseau ou votre expertise.
        </p>
        <div className="bg-white border border-pink-200 p-3 rounded">
          <p className="text-sm text-pink-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-pink-700 mt-2">
            "Brevet sur le système de réfrigération solaire modulaire + partenariats exclusifs avec 15 coopératives."
          </p>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-cyan-600" />
          <h3 className="font-semibold text-cyan-900">Indicateurs clés</h3>
        </div>
        <p className="text-cyan-800 mb-3 text-sm">
          Les métriques qui mesurent votre succès. Choisissez 3-5 indicateurs pertinents et actionnables.
        </p>
        <div className="bg-white border border-cyan-200 p-3 rounded">
          <p className="text-sm text-cyan-700 italic font-medium">Exemple :</p>
          <p className="text-sm text-cyan-700 mt-2">
            • Taux d'occupation des entrepôts (cible: 80%)<br />
            • Nombre d'agriculteurs actifs (cible: 500/an)<br />
            • Réduction des pertes récolte (cible: 30%)
          </p>
        </div>
      </div>
    </div>
  )
}
