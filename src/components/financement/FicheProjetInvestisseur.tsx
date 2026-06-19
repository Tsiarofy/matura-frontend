import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatAr, formatDecimal } from '@/lib/utils'

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
  const [selectedCardNumero, setSelectedCardNumero] = useState<number | null>(null)
  const cards = [
    {
      numero: 1,
      titre: 'Émergence',
      sousTitre: 'Identification du problème',
      description:
        "Cette phase présente le besoin prioritaire identifié, le profil de cible et l'opportunité de départ qui justifient l'existence du projet.",
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
      description:
        "Cette phase résume la solution envisagée, son avantage distinctif et les premiers choix de mise sur le marché.",
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
      description:
        "Cette phase synthétise le potentiel de marché, la taille de l'opportunité et les premiers repères de concurrence observables.",
      items: [
        { label: 'TAM', valeur: formatAr(fiche.marche?.tam) },
        { label: 'SAM', valeur: formatAr(fiche.marche?.sam) },
        { label: 'SOM', valeur: formatAr(fiche.marche?.som) },
        { label: 'Nombre de concurrents', valeur: fiche.marche?.concurrents?.length },
        { label: 'Score marché', valeur: fiche.score ? `${formatDecimal(fiche.score.score_marche)}/100` : '-' },
      ]
    },
    {
      numero: 4,
      titre: 'Business Model Canvas',
      sousTitre: 'Modèle économique',
      description:
        "Cette phase expose la logique de création et de captation de valeur du projet, sans détailler les éléments confidentiels internes.",
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
        { label: "Score d'innovation", valeur: fiche.score ? `${formatDecimal(fiche.score.score_innovation)}/100` : '-' },
      ]
    },
    {
      numero: 5,
      titre: 'Faisabilité',
      sousTitre: 'Finances & Équipe',
      description:
        "Cette phase présente les signaux de faisabilité opérationnelle, financière et humaine nécessaires à la montée en exécution.",
      items: [
        { label: 'Équipe', valeur: `${fiche.equipe?.membres?.length ?? 0} membres` },
        {
          label: 'Point mort',
          valeur: fiche.projections?.point_mort_unites !== undefined && fiche.projections?.point_mort_unites !== null
            ? `${fiche.projections.point_mort_unites} unités`
            : null
        },
        { label: 'BFR', valeur: formatAr(fiche.projections?.bfr) },
        { label: 'ROI estimé', valeur: fiche.projections?.roi ? `${formatDecimal(fiche.projections.roi)}%` : '-' },
      ]
    },
    {
      numero: 6,
      titre: 'Prototype & Lancement',
      sousTitre: 'Produit & Traction',
      description:
        "Cette phase montre l'état d'avancement du produit, les premiers signaux d'usage et quelques indicateurs de traction utiles à l'investisseur.",
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
      description:
        "Cette phase résume le besoin de financement, la forme recherchée et les premiers résultats économiques visibles.",
      items: [
        { label: 'Montant recherché', valeur: formatAr(fiche.besoins_financement?.montant_recherche) },
        { label: 'Type financement', valeur: fiche.besoins_financement?.type_financement },
        { label: 'Revenus générés (AR)', valeur: formatAr(fiche.traction?.revenus_generes_ar) },
      ]
    }
  ]
  const selectedCard = cards.find((card) => card.numero === selectedCardNumero) ?? null

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <button
              key={card.numero}
              type="button"
              onClick={() => setSelectedCardNumero(card.numero)}
              className="bg-white border border-zinc-100 rounded-[22px] overflow-hidden flex flex-col h-full transition-all hover:border-zinc-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] text-left"
            >
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
            </button>
          ))}
        </div>
      </div>
      <Dialog open={selectedCard !== null} onOpenChange={(open) => !open && setSelectedCardNumero(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Phase {selectedCard.numero} - {selectedCard.titre}
                </DialogTitle>
                <DialogDescription>{selectedCard.sousTitre}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                  <p className="text-[13px] leading-relaxed text-zinc-700">
                    {selectedCard.description}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedCard.items.map((item) => (
                    <div key={item.label} className="rounded-xl border border-zinc-100 bg-white p-4">
                      <p className="text-[10px] text-zinc-400 mb-1 uppercase tracking-[0.06em] font-medium">
                        {item.label}
                      </p>
                      <p className="text-[12px] font-medium text-zinc-800 leading-snug break-words">
                        {item.valeur !== undefined && item.valeur !== null && item.valeur !== ''
                          ? String(item.valeur)
                          : <span className="text-zinc-300 font-normal italic">Non renseigné</span>}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-[12px] text-amber-800">
                    Certains détails sensibles de l'entrepreneur sont volontairement masqués dans cette vue pour préserver la confidentialité du dossier.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setSelectedCardNumero(null)}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Fermer
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
