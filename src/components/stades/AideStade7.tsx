import { FileText, DollarSign, TrendingUp, Target, Globe, Presentation, Rocket } from 'lucide-react'

export function AideStade7() {
  return (
    <div className="space-y-4">
      {/* Résumé exécutif */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Résumé exécutif</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          Un résumé concis (1-2 pages) de votre projet qui capte l'attention des investisseurs.
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic font-medium">Éléments clés :</p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• Problème et solution</li>
            <li>• Taille du marché</li>
            <li>• Avantage concurrentiel</li>
            <li>• Équipe et traction</li>
            <li>• Demande de financement</li>
          </ul>
        </div>
      </div>

      {/* Demande de financement */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Demande de financement</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Le montant que vous cherchez à lever et l'utilisation prévue des fonds.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic font-medium">Utilisation typique des fonds :</p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• 40-50% : Développement produit</li>
            <li>• 20-30% : Marketing et acquisition</li>
            <li>• 15-20% : Opérations et équipe</li>
            <li>• 10-15% : Réserve de trésorerie</li>
          </ul>
        </div>
      </div>

      {/* Montant demandé */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Montant de la levée</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          Soyez réaliste sur le montant demandé en fonction de votre stade de développement.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded">
          <p className="text-sm text-purple-700 italic font-medium">Montants typiques par stade :</p>
          <ul className="text-sm text-purple-700 mt-2 space-y-1">
            <li>• Pre-seed : 50K - 200K €</li>
            <li>• Seed : 200K - 1M €</li>
            <li>• Series A : 1M - 5M €</li>
          </ul>
        </div>
      </div>

      {/* Contexte investisseur */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Contexte pour investisseurs</h3>
        </div>
        <p className="text-orange-800 mb-3 text-sm">
          Pourquoi investir dans votre projet maintenant ? Quelle est l'opportunité ?
        </p>
        <div className="bg-white border border-orange-200 p-3 rounded">
          <p className="text-sm text-orange-700 italic font-medium">Points à couvrir :</p>
          <ul className="text-sm text-orange-700 mt-2 space-y-1">
            <li>• Potentiel de marché (TAM/SAM/SOM)</li>
            <li>• Traction actuelle (utilisateurs, revenus)</li>
            <li>• Timing du marché (pourquoi maintenant ?)</li>
            <li>• Avantage compétitif durable</li>
          </ul>
        </div>
      </div>

      {/* Potentiel du marché */}
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Potentiel du marché</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Démontrez la taille et la croissance de votre marché avec des données concrètes.
        </p>
        <div className="bg-white border border-red-200 p-3 rounded">
          <p className="text-sm text-red-700 italic">
            💡 Utilisez des sources crédibles (INSTAT, rapports sectoriels, études de marché).
          </p>
        </div>
      </div>

      {/* Avantage compétitif */}
      <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-pink-900">Avantage compétitif</h3>
        </div>
        <p className="text-pink-800 mb-3 text-sm">
          Ce qui vous rend difficile à copier et pourquoi vous gagnerez contre les concurrents.
        </p>
        <div className="bg-white border border-pink-200 p-3 rounded">
          <p className="text-sm text-pink-700 italic font-medium">Types d'avantages :</p>
          <ul className="text-sm text-pink-700 mt-2 space-y-1">
            <li>• Technologique : Brevets, IP propriétaire</li>
            <li>• Réseau : Effet de réseau, partenariats exclusifs</li>
            <li>• Opérationnel : Processus uniques, coûts inférieurs</li>
            <li>• Marque : Notoriété, fidélité client</li>
          </ul>
        </div>
      </div>

      {/* Pitch Deck */}
      <div className="border-l-4 border-emerald-500 bg-emerald-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Presentation className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Pitch Deck</h3>
        </div>
        <p className="text-emerald-800 mb-3 text-sm">
          Votre présentation visuelle pour convaincre les investisseurs en 10-15 slides.
        </p>
        <div className="bg-white border border-emerald-200 p-3 rounded">
          <p className="text-sm text-emerald-700 italic font-medium">Structure recommandée :</p>
          <ul className="text-sm text-emerald-700 mt-2 space-y-1">
            <li>1. Introduction / Hook</li>
            <li>2. Problème</li>
            <li>3. Solution</li>
            <li>4. Marché</li>
            <li>5. Business Model</li>
            <li>6. Traction</li>
            <li>7. Compétition</li>
            <li>8. Équipe</li>
            <li>9. Projections</li>
            <li>10. Ask (demande)</li>
          </ul>
        </div>
      </div>

      {/* Lancement */}
      <div className="border-l-4 border-cyan-500 bg-cyan-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Rocket className="w-5 h-5 text-cyan-600" />
          <h3 className="font-semibold text-cyan-900">Stratégie de lancement</h3>
        </div>
        <p className="text-cyan-800 mb-3 text-sm">
          Comment vous allez acquérir vos premiers clients et scaler votre activité.
        </p>
        <div className="bg-white border border-cyan-200 p-3 rounded">
          <p className="text-sm text-cyan-700 italic">
            💡 Une stratégie de lancement claire démontre votre capacité d'exécution.
          </p>
        </div>
      </div>
    </div>
  )
}
