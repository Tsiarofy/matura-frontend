import { formatAr } from '@/lib/utils'

interface FicheInvestisseurData {
  identite?: any
  equipe?: any
  probleme?: any
  solution?: any
  modele_economique?: any
  marche?: any
  traction?: any
  croissance?: any
  besoins_financement?: any
  projections?: any
  impact?: any
  risques?: any
  score?: any
}

interface Props {
  fiche: FicheInvestisseurData
}

export function FicheProjetInvestisseur({ fiche }: Props) {
  const cards = [
    {
      numero: 1,
      titre: 'Émergence',
      sousTitre: 'Identification du problème',
      items: [
        { label: 'Problème identifié', valeur: fiche.probleme?.probleme_identifie },
        { label: 'Cible principale', valeur: fiche.probleme?.cible },
        { label: 'Opportunité', valeur: fiche.probleme?.opportunite },
        { label: 'Zone géographique', valeur: fiche.identite?.region },
      ]
    },
    {
      numero: 2,
      titre: 'Idéation',
      sousTitre: 'Lean Canvas & Solution',
      items: [
        { label: 'Solution proposée', valeur: fiche.solution?.description },
        { label: 'Avantage clé', valeur: fiche.solution?.avantage_cle },
        { label: 'Go-to-market', valeur: fiche.croissance?.go_to_market },
      ]
    },
    {
      numero: 3,
      titre: 'Validation Marché',
      sousTitre: 'TAM/SAM/SOM & Concurrence',
      items: [
        { label: 'TAM', valeur: formatAr(fiche.marche?.tam) },
        { label: 'SAM', valeur: formatAr(fiche.marche?.sam) },
        { label: 'SOM', valeur: formatAr(fiche.marche?.som) },
        { label: 'Nombre de concurrents', valeur: fiche.marche?.concurrents?.length },
        { label: 'Score marché', valeur: fiche.score ? `${fiche.score.score_marche}/100` : '-' },
      ]
    },
    {
      numero: 4,
      titre: 'Business Model Canvas',
      sousTitre: 'Modèle économique',
      items: [
        {
          label: 'Monétisation',
          valeur: Array.isArray(fiche.modele_economique?.monetisation)
            ? fiche.modele_economique.monetisation
                .map((v: any) => {
                  const parts = []
                  if (v.nom) parts.push(v.nom)
                  if (v.modele) parts.push(`(${v.modele})`)
                  if (v.prix_ar) parts.push(`${formatAr(v.prix_ar)}`)
                  if (v.volume_mensuel) parts.push(`x ${v.volume_mensuel}/mois`)
                  if (v.estimation_mensuelle_ar) parts.push(`~ ${formatAr(v.estimation_mensuelle_ar)}/mois`)
                  return parts.join(' ')
                })
                .join(', ')
            : fiche.modele_economique?.monetisation
        },
        {
          label: 'Canaux distribution',
          valeur: Array.isArray(fiche.modele_economique?.canaux_distribution)
            ? fiche.modele_economique.canaux_distribution
                .map((v: any) => `${v.canal || ''} (${v.phase || ''}${v.cout ? ` - ${v.cout}` : ''})`)
                .join(', ')
            : fiche.modele_economique?.canaux_distribution
        },
        { label: "Score d'innovation", valeur: fiche.score ? `${fiche.score.score_innovation}/100` : '-' },
      ]
    },
    {
      numero: 5,
      titre: 'Faisabilité',
      sousTitre: 'Finances & Équipe',
      items: [
        { label: 'Équipe', valeur: `${fiche.equipe?.membres?.length ?? 0} membres` },
        {
          label: 'Point mort',
          valeur: fiche.projections?.point_mort_unites !== undefined && fiche.projections?.point_mort_unites !== null
            ? `${fiche.projections.point_mort_unites} unités`
            : null
        },
        { label: 'BFR', valeur: formatAr(fiche.projections?.bfr) },
        { label: 'ROI estimé', valeur: fiche.projections?.roi ? `${fiche.projections.roi}%` : '-' },
      ]
    },
    {
      numero: 6,
      titre: 'Prototype & Lancement',
      sousTitre: 'Produit & Traction',
      items: [
        { label: 'Stade dev.', valeur: fiche.solution?.stade_developpement },
        { label: 'CAC', valeur: formatAr(fiche.modele_economique?.cac) },
        { label: 'LTV', valeur: formatAr(fiche.modele_economique?.ltv) },
        { label: 'Nb clients / payants', valeur: `${fiche.traction?.nb_clients || 0} / ${fiche.traction?.clients_payants || 0}` },
      ]
    },
    {
      numero: 7,
      titre: 'Besoins',
      sousTitre: 'Financement recherché',
      items: [
        { label: 'Montant recherché', valeur: formatAr(fiche.besoins_financement?.montant_recherche) },
        { label: 'Type financement', valeur: fiche.besoins_financement?.type_financement },
        { label: 'Revenus générés (AR)', valeur: formatAr(fiche.traction?.revenus_generes_ar) },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.numero} className="bg-white border border-zinc-100 rounded-[22px] overflow-hidden flex flex-col h-full transition-all hover:border-zinc-200">
            <div className="bg-white border-b border-zinc-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-[12px] bg-green-50 text-green-700 flex items-center justify-center text-[13px] font-bold">
                  {card.numero}
                </span>
                <div>
                  <h3 className="text-[14px] font-semibold text-zinc-800 leading-tight">{card.titre}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{card.sousTitre}</p>
                </div>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col gap-3.5">
              {card.items.map((item, idx) => (
                <div key={idx}>
                  <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-[0.05em] font-medium">{item.label}</p>
                  <p className="text-[12px] font-medium text-zinc-800 break-words leading-snug">
                    {item.valeur !== undefined && item.valeur !== null && item.valeur !== '' 
                      ? String(item.valeur) 
                      : <span className="text-zinc-300 font-normal italic">Non renseigné</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
