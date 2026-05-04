import { Users, DollarSign, Target, Briefcase, GraduationCap, Award } from 'lucide-react'

export function AideStade5() {
  return (
    <div className="space-y-4">
      {/* Équipe */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Équipe</h3>
        </div>
        <p className="text-blue-800 mb-3 text-sm">
          Une équipe équilibrée avec des compétences complémentaires est essentielle pour la réussite.
        </p>
        <div className="bg-white border border-blue-200 p-3 rounded">
          <p className="text-sm text-blue-700 italic font-medium">Profils clés :</p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• <strong>CEO/Visionnaire</strong> : Stratégie, leadership</li>
            <li>• <strong>CTO/Technique</strong> : Produit, innovation</li>
            <li>• <strong>COO/Opérations</strong> : Exécution, logistique</li>
            <li>• <strong>CFO/Finance</strong> : Gestion, levée de fonds</li>
          </ul>
        </div>
      </div>

      {/* Expérience */}
      <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Expérience des membres</h3>
        </div>
        <p className="text-purple-800 mb-3 text-sm">
          L'expérience pertinente dans le domaine ou l'industrie est un facteur clé de succès.
        </p>
        <div className="bg-white border border-purple-200 p-3 rounded">
          <p className="text-sm text-purple-700 italic">
            💡 Les investisseurs valorisent les équipes avec une expérience prouvée dans le secteur ciblé.
          </p>
        </div>
      </div>

      {/* Finances */}
      <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-green-900">Projections financières</h3>
        </div>
        <p className="text-green-800 mb-3 text-sm">
          Des projections réalistes sur 3-5 ans sont nécessaires pour évaluer la viabilité du projet.
        </p>
        <div className="bg-white border border-green-200 p-3 rounded">
          <p className="text-sm text-green-700 italic font-medium">Éléments clés :</p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• Coûts de lancement (CAPEX)</li>
            <li>• Coûts opérationnels mensuels (OPEX)</li>
            <li>• Revenus prévisionnels par mois</li>
            <li>• Point mort (break-even)</li>
          </ul>
        </div>
      </div>

      {/* Coûts de lancement */}
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Coûts de lancement</h3>
        </div>
        <p className="text-orange-800 mb-3 text-sm">
          Investissements initiaux nécessaires pour démarrer l'activité.
        </p>
        <div className="bg-white border border-orange-200 p-3 rounded">
          <p className="text-sm text-orange-700 italic font-medium">Exemples :</p>
          <ul className="text-sm text-orange-700 mt-2 space-y-1">
            <li>• Développement produit</li>
            <li>• Équipements et infrastructure</li>
            <li>• Marketing initial</li>
            <li>• Juridique et administratif</li>
          </ul>
        </div>
      </div>

      {/* Jalons */}
      <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-900">Jalons du projet</h3>
        </div>
        <p className="text-red-800 mb-3 text-sm">
          Des objectifs clairs et mesurables avec des échéances définies.
        </p>
        <div className="bg-white border border-red-200 p-3 rounded">
          <p className="text-sm text-red-700 italic font-medium">Exemples de jalons :</p>
          <ul className="text-sm text-red-700 mt-2 space-y-1">
            <li>• Mois 3 : MVP fonctionnel</li>
            <li>• Mois 6 : 100 premiers clients</li>
            <li>• Mois 12 : Break-even atteint</li>
            <li>• Mois 18 : Expansion dans 2 nouvelles régions</li>
          </ul>
        </div>
      </div>

      {/* Formation */}
      <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-pink-600" />
          <h3 className="font-semibold text-pink-900">Formation et compétences</h3>
        </div>
        <p className="text-pink-800 mb-3 text-sm">
          Identifiez les compétences manquantes et les besoins de formation de l'équipe.
        </p>
        <div className="bg-white border border-pink-200 p-3 rounded">
          <p className="text-sm text-pink-700 italic">
            💡 Un plan de formation structuré renforce la crédibilité auprès des investisseurs.
          </p>
        </div>
      </div>
    </div>
  )
}
