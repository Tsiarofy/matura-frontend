// maturproj-frontend/src/components/stades/AideStade1.tsx
// Composant d'aide pour le Stade 1 - Émergence
// Fournit des explications contextuelles pour chaque champ du formulaire

import { Card } from '@/components/ui/card'
import { HelpCircle, Lightbulb } from 'lucide-react'

interface AideItem {
  champ: string
  question: string
  explication: string
  exemple: string
}

const AIDES_STADE1: AideItem[] = [
  {
    champ: 'enonce_probleme',
    question: 'Quelle problème observez-vous sur le terrain ?',
    explication: 'Décrivez clairement le problème que vous avez identifié. Soyez spécifique et factuel. Évitez les généralités et concentrez-vous sur un problème bien défini.',
    exemple: 'Les agriculteurs de la région perdent 30% de leur récolte à cause des inondations pendant la saison des pluies.',
  },
  {
    champ: 'profil_affecte.description',
    question: 'Qui sont les personnes touchées par ce problème ?',
    explication: 'Décrivez le profil des personnes qui souffrent de ce problème (âge, profession, situation, etc.). Plus votre profil est précis, mieux vous pourrez adapter votre solution.',
    exemple: 'Petits agriculteurs de riz, âgés de 25-55 ans, cultivant moins de 2 hectares dans les zones rurales d\'Antananarivo.',
  },
  {
    champ: 'profil_affecte.urbanite',
    question: 'Zone d\'habitation',
    explication: 'Indiquez si les personnes touchées vivent en zone urbaine, péri-urbaine ou rurale. Cela influence la façon dont vous pourrez leur proposer votre solution.',
    exemple: 'Rural - Les agriculteurs vivent dans des villages éloignés des centres urbains.',
  },
  {
    champ: 'profil_affecte.frequence',
    question: 'À quelle fréquence ce problème survient-il ?',
    explication: 'Indiquez la fréquence à laquelle le problème se manifeste pour les personnes touchées. Cela aide à évaluer l\'urgence et l\'impact du problème.',
    exemple: 'Mensuel - Les inondations se produisent chaque mois pendant la saison des pluies.',
  },
  {
    champ: 'profil_affecte.nombre_estime',
    question: 'Combien de personnes sont touchées ?',
    explication: 'Estimez le nombre de personnes concernées par ce problème. Cette estimation vous aidera à évaluer la taille de votre marché potentiel.',
    exemple: 'Environ 500 agriculteurs dans la région d\'Antananarivo Avaradrano.',
  },
  {
    champ: 'intensite_probleme.cout_actuel_ar',
    question: 'Coût actuel (Ar)',
    explication: 'Combien ce problème coûte-t-il actuellement aux personnes touchées ? Incluez tous les coûts directs et indirects (perte de revenus, dépenses supplémentaires, etc.).',
    exemple: 'Chaque agriculteur perd en moyenne 200 000 Ar par récolte à cause des inondations.',
  },
  {
    champ: 'intensite_probleme.severite',
    question: 'Gravité du problème (1-5)',
    explication: 'Évaluez la gravité du problème pour les personnes touchées. 1 = Peu grave, 5 = Très grave. Considérez l\'impact sur leur vie quotidienne, leur santé, leurs revenus, etc.',
    exemple: '4 - Très grave car cela menace la sécurité alimentaire des familles.',
  },
  {
    champ: 'observations_terrain.nb_personnes_interrogees',
    question: 'Combien de personnes avez-vous interrogées ?',
    explication: 'Indiquez le nombre de personnes que vous avez interrogées pour valider votre problème. Minimum 3 personnes requises pour une validation crédible.',
    exemple: 'J\'ai interrogé 15 agriculteurs dans 3 villages différents.',
  },
  {
    champ: 'observations_terrain.methode',
    question: 'Comment avez-vous collecté ces informations ?',
    explication: 'Indiquez la méthode utilisée pour collecter les informations. La méthode "en face à face" est généralement la plus fiable.',
    exemple: 'En face à face - J\'ai visité les agriculteurs sur leurs exploitations.',
  },
  {
    champ: 'observations_terrain.verbatims',
    question: 'Citations des personnes interrogées',
    explication: 'Relevez les citations exactes des personnes interrogées. Ces verbatims sont des preuves concrètes de l\'existence du problème.',
    exemple: '"Depuis 3 ans, je perds la moitié de ma récolte à cause des inondations. Je ne sais plus quoi faire." - Rabe, agriculteur.',
  },
  {
    champ: 'solutions_existantes',
    question: 'Quelles solutions existent déjà ?',
    explication: 'Listez les solutions que les personnes utilisent actuellement pour résoudre ce problème. Comprendre les solutions existantes vous aidera à identifier ce qui manque et comment vous pouvez vous différencier.',
    exemple: 'Les agriculteurs utilisent des sacs de sable pour protéger leurs rizières, mais c\'est inefficace et coûteux en main-d\'œuvre.',
  },
  {
    champ: 'contexte_geographique',
    question: 'Où se situe le problème géographiquement ?',
    explication: 'Sélectionnez la zone géographique où le problème se manifeste. Le système calculera automatiquement la population de cette zone pour vous aider à évaluer la taille de votre marché.',
    exemple: 'Région Analamanga, districts Antananarivo Avaradrano et Ambohidratrimo.',
  },
]

export function AideStade1() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        <h2 className="text-[14px] font-semibold text-zinc-800">Guide du Stade 1 - Émergence</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-[12px] text-blue-800">
          Ce stade vise à identifier et valider un problème réel sur le terrain. Les informations que vous collectez ici serviront de base pour développer votre solution.
        </p>
      </div>

      {AIDES_STADE1.map((aide) => (
        <Card key={aide.champ} className="p-4 border-zinc-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <h3 className="text-[13px] font-medium text-zinc-800">{aide.question}</h3>
              <p className="text-[12px] text-zinc-600 leading-relaxed">{aide.explication}</p>
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
                <p className="text-[10px] text-zinc-500 font-medium mb-1">Exemple :</p>
                <p className="text-[11px] text-zinc-700 italic">"{aide.exemple}"</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
