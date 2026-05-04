import { Cpu, BarChart3, MessageSquare, Smile, RefreshCw, CheckCircle } from 'lucide-react'

export function AideStade6() {
  return (
    <div className="space-y-4">
      {/* MVP */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">MVP (Minimum Viable Product)</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          La version minimale de votre produit qui permet de valider vos hypothèses avec un minimum d'effort.
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic font-medium">Principes du MVP :</p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• Fonctionnalités essentielles uniquement</li>
            <li>• Temps de développement minimal</li>
            <li>• Feedback client maximal</li>
            <li>• Itérations rapides basées sur l'apprentissage</li>
          </ul>
        </div>
      </div>

      {/* Fonctionnalités clés */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Fonctionnalités clés du MVP</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          Sélectionnez 3-5 fonctionnalités qui résolvent le problème principal de manière satisfaisante.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded">
          <p className="text-sm text-purple-700 italic">
            💡 Moins de fonctionnalités = développement plus rapide = feedback plus tôt.
          </p>
        </div>
      </div>

      {/* Métriques d'usage */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Métriques d'usage</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Suivez comment les utilisateurs interagissent avec votre MVP pour mesurer l'adoption.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic font-medium">Métriques clés :</p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• Utilisateurs actifs quotidiens/mensuels (DAU/MAU)</li>
            <li>• Taux d'activation (utilisateurs qui effectuent l'action clé)</li>
            <li>• Temps passé sur l'application</li>
            <li>• Fréquence d'utilisation</li>
          </ul>
        </div>
      </div>

      {/* Utilisateurs actifs */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Utilisateurs actifs</h3>
        </div>
        <p className="text-orange-800 mb-3 text-sm">
          Le nombre d'utilisateurs qui utilisent réellement votre produit de manière régulière.
        </p>
        <div className="bg-white border border-orange-200 p-3 rounded">
          <p className="text-sm text-orange-700 italic">
            💡 100 utilisateurs actifs valent mieux que 1000 téléchargements inutilisés.
          </p>
        </div>
      </div>

      {/* Taux de rétention */}
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Taux de rétention</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Le pourcentage d'utilisateurs qui continuent à utiliser votre produit après une période donnée.
        </p>
        <div className="bg-white border border-red-200 p-3 rounded">
          <p className="text-sm text-red-700 italic font-medium">Benchmarks :</p>
          <ul className="text-sm text-red-700 mt-2 space-y-1">
            <li>• Excellent : {'>'}40% après 30 jours</li>
            <li>• Bon : {'>'}20%-40% après 30 jours</li>
            <li>• À améliorer : {'<'}20% après 30 jours</li>
          </ul>
        </div>
      </div>

      {/* Retours clients */}
      <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-pink-900">Retours clients</h3>
        </div>
        <p className="text-pink-800 mb-3 text-sm">
          Collectez systématiquement les feedbacks pour identifier les points d'amélioration.
        </p>
        <div className="bg-white border border-pink-200 p-3 rounded">
          <p className="text-sm text-pink-700 italic font-medium">Méthodes de collecte :</p>
          <ul className="text-sm text-pink-700 mt-2 space-y-1">
            <li>• Enquêtes in-app</li>
            <li>• Entretiens utilisateurs</li>
            <li>• Analyse des tickets support</li>
            <li>• Reviews sur les stores</li>
          </ul>
        </div>
      </div>

      {/* Satisfaction client */}
      <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Smile className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Satisfaction client</h3>
        </div>
        <p className="text-emerald-800 mb-3 text-sm">
          Mesurez la satisfaction avec des métriques comme NPS (Net Promoter Score) ou CSAT.
        </p>
        <div className="bg-white border border-emerald-200 p-3 rounded">
          <p className="text-sm text-emerald-700 italic">
            💡 NPS {'>'} 50 est considéré excellent pour un early-stage product.
          </p>
        </div>
      </div>

      {/* Itérations */}
      <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-5 h-5 text-cyan-600" />
          <h3 className="font-semibold text-cyan-900">Itérations du produit</h3>
        </div>
        <p className="text-cyan-800 mb-3 text-sm">
          Documentez les changements apportés en réponse aux retours clients.
        </p>
        <div className="bg-white border border-cyan-200 p-3 rounded">
          <p className="text-sm text-cyan-700 italic font-medium">Cycle d'itération :</p>
          <ul className="text-sm text-cyan-700 mt-2 space-y-1">
            <li>1. Collecter feedback</li>
            <li>2. Prioriser les améliorations</li>
            <li>3. Développer la solution</li>
            <li>4. Déployer et mesurer l'impact</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
