import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Save, Loader2, MapPin } from 'lucide-react'
import type { StadeData } from '@/hooks/useStades'
import { useRoleLabels } from '@/hooks/useRoleLabels'
import { LABELS_STADE3 } from '@/lib/labelsStades'
import { StepperProgressif, type Etape } from '@/components/ui/StepperProgressif'
import { AffichageCalculMarche } from '@/components/marche/AffichageCalculMarche'
import { useCalculMarche } from '@/hooks/useCalculMarche'
import { useState, useEffect } from 'react'

interface Props { 
  stade: StadeData; 
  onSave: (d: Record<string, unknown>) => void; 
  saving: boolean;
  typeProjet: 'B2C' | 'B2B' | 'B2B2C';
  contexteGeographiqueStade1?: {
    niveau_principal: string;
    zone_principale: { code: string; nom: string };
    sous_zones?: { tout_selectionner: boolean; items: Array<{ code: string; nom: string }> };
  };
  onUpdateZone?: (zone: any) => void;
}

export function Stade3Form({ stade, onSave, saving, typeProjet, contexteGeographiqueStade1, onUpdateZone }: Props) {
  const { isEntrepreneur } = useRoleLabels()
  const d = stade.donnees as Record<string, unknown>
  const g = <T,>(k: string, def: T): T => (d[k] as T) ?? def

  // État pour le stepper
  const [etapeActive, setEtapeActive] = useState('zone_geographique')
  const [etapesCompletees, setEtapesCompletees] = useState<Set<string>>(new Set())

  // États pour conserver les données B2B2C lors du basculement d'onglet
  const [formulaireActifB2B2C, setFormulaireActifB2B2C] = useState<'B2C' | 'B2B'>('B2C')
  const [showGeoSelector, setShowGeoSelector] = useState(false)
  const [donneesB2C, setDonneesB2C] = useState<any>(g('donnees_b2c', undefined))
  const [donneesB2B, setDonneesB2B] = useState<any>(g('donnees_b2b', undefined))

  // Définition des étapes pour B2C
  const etapesB2C: Etape[] = [
    { id: 'zone_geographique', titre: 'Zone ciblée', description: 'Cible géographique', dependances: [] },
    { id: 'estimation_utilisateurs', titre: 'Adoption', description: '% utilisateurs', dependances: ['zone_geographique'] },
    { id: 'enquetes', titre: 'Enquêtes', description: 'Validation terrain', dependances: ['estimation_utilisateurs'] },
    { id: 'concurrents', titre: 'Concurrents', description: 'Analyse marché', dependances: ['enquetes'] },
    { id: 'taille_marche', titre: 'Taille marché', description: 'TAM, SAM, SOM', dependances: ['concurrents'] },
    { id: 'prix_sources', titre: 'Prix & Sources', description: 'Positionnement', dependances: ['taille_marche'] },
  ]

  const markStepComplete = (stepId: string, nextStepId?: string) => {
    setEtapesCompletees(prev => new Set(prev).add(stepId))
    if (nextStepId) setEtapeActive(nextStepId)
  }

  const isStepAccessible = (stepId: string) => {
    const currentIndex = etapesB2C.findIndex(s => s.id === etapeActive)
    const stepIndex = etapesB2C.findIndex(s => s.id === stepId)
    return stepIndex <= currentIndex || etapesCompletees.has(stepId)
  }

  const renderOverlay = (stepId: string) => {
    if (isStepAccessible(stepId)) return null
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-lg">
        <span className="text-xs font-medium text-zinc-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-zinc-200">À remplir progressivement</span>
      </div>
    )
  }

  const { register, control, handleSubmit, setValue, watch, getValues, reset } = useForm({
    defaultValues: {
      type_client: typeProjet,
      // B2C fields
      pct_utilisateurs: g<number>('pct_utilisateurs', 0),
      zone_modifiee: g<boolean>('zone_modifiee', false),
      contexte_geographique: contexteGeographiqueStade1,
      enquete: {
        taille_echantillon: 0,
        methode: 'EN_FACE',
        taux_reponse_positive: 0,
        wtp_moyen_ar: 0,
        ...g<Record<string,unknown>>('enquete', {}),
      },
      concurrents: g<{ nom: string; type: string; part_globale_pct: number; part_zone_pct: number; prix_estime_ar: number; votre_differentiation: string }[]>('concurrents', [
        { nom: '', type: 'DIRECT', part_globale_pct: 0, part_zone_pct: 0, prix_estime_ar: 0, votre_differentiation: '' },
      ]),
      taille_marche: {
        tam_valeur: g<number>('taille_marche.tam_valeur', 0),
        sam_valeur: g<number>('taille_marche.sam_valeur', 0),
        som_valeur: g<number>('taille_marche.som_valeur', 0),
        ...g<Record<string,unknown>>('taille_marche', {}),
      },
      positionnement_prix: {
        prix_min_acceptable_ar: 0,
        prix_max_acceptable_ar: 0,
        prix_recommande_ar: 0,
        modele_prix: 'UNITE',
        irp: { revenu_moyen_zone_ar: 0, frequence_achat: 'MENSUEL' },
        ...g<Record<string,unknown>>('positionnement_prix', {}),
      },
      sources_marche: g<{ type: string; titre: string; annee: number; url: string; donnee_utilisee: string }[]>('sources_marche', [
        { type: 'INSTAT', titre: '', annee: 2024, url: '', donnee_utilisee: '' },
      ]),
    },
  })

  const { fields: concFields, append: addConc, remove: remConc } = useFieldArray({ control, name: 'concurrents' })
  const { fields: srcFields, append: addSrc, remove: remSrc } = useFieldArray({ control, name: 'sources_marche' })

  // Watch values for real-time calculations
  const pctUtilisateurs = watch('pct_utilisateurs')
  const concurrents = watch('concurrents')
  const tamValeur = watch('taille_marche.tam_valeur')
  const samValeur = watch('taille_marche.sam_valeur')
  const somValeur = watch('taille_marche.som_valeur')
  const contexteGeo = watch('contexte_geographique')

  // Real-time market calculation for B2C
  const calculMarcheQuery = useCalculMarche({
    typeClient: 'B2C',
    codeZone: contexteGeo?.zone_principale?.code || '',
    niveauZone: contexteGeo?.niveau_principal || '',
    pctUtilisateurs: pctUtilisateurs || 0,
    partsConcurrents: concurrents || [],
    tam_valeur: tamValeur || 0,
    sam_valeur: samValeur || 0,
    som_valeur: somValeur || 0,
  })

  const inp = 'w-full border border-zinc-200 rounded-lg px-3 py-2 text-[13px] text-zinc-800 focus:outline-none focus:border-green-400 bg-white'
  const sel = cn(inp, 'appearance-none')
  const sec = 'space-y-3 pb-5 border-b border-zinc-100 last:border-0'

  const getLabel = (key: keyof typeof LABELS_STADE3) => {
    return isEntrepreneur ? LABELS_STADE3[key].entrepreneur : LABELS_STADE3[key].professionnel
  }

  // Handler pour mise à jour zone géographique
  const handleZoneUpdate = (newZone: any) => {
    setValue('contexte_geographique', newZone)
    setValue('zone_modifiee', true)
    if (onUpdateZone) {
      onUpdateZone(newZone) // Met à jour le Stade 1 globalement
    }
    setShowGeoSelector(false)
  }

  // Handler pour la soumission
  const onSubmitHandler = (data: any) => {
    let finalData = data;
    let calculs_informatifs: any = undefined;

    if (typeProjet === 'B2C' || (typeProjet === 'B2B2C' && formulaireActifB2B2C === 'B2C')) {
      if (calculMarcheQuery.data) {
        calculs_informatifs = {
          stade_3: {
            type_client: 'B2C',
            ...calculMarcheQuery.data,
            tam_saisi: data.taille_marche?.tam_valeur || 0,
            sam_saisi: data.taille_marche?.sam_valeur || 0,
            som_saisi: data.taille_marche?.som_valeur || 0,
          }
        };
      }
    } else {
      calculs_informatifs = {
        stade_3: {
          type_client: 'B2B',
          tam_saisi: data.taille_marche?.tam_valeur || 0,
          sam_saisi: data.taille_marche?.sam_valeur || 0,
          som_saisi: data.taille_marche?.som_valeur || 0,
          alertes: []
        }
      };
    }

    if (typeProjet === 'B2B2C') {
      const b2cData = formulaireActifB2B2C === 'B2C' ? data : donneesB2C;
      const b2bData = formulaireActifB2B2C === 'B2B' ? data : donneesB2B;
      finalData = {
        ...data,
        donnees_b2c: b2cData,
        donnees_b2b: b2bData
      };
    }

    onSave({
      ...finalData,
      calculs_informatifs,
    });
  };

  const handleTabChange = (nouveauFormulaire: 'B2C' | 'B2B') => {
    if (formulaireActifB2B2C === nouveauFormulaire) return;
    
    // Sauvegarder les données du formulaire actuel
    const currentData = getValues();
    if (formulaireActifB2B2C === 'B2C') {
      setDonneesB2C(currentData);
    } else {
      setDonneesB2B(currentData);
    }

    // Charger les données du nouveau formulaire si elles existent
    const nextData = nouveauFormulaire === 'B2C' ? donneesB2C : donneesB2B;
    if (nextData) {
      reset(nextData);
    }
    
    setFormulaireActifB2B2C(nouveauFormulaire);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-5">
      
      {/* B2B2C: Sélecteur de formulaire */}
      {typeProjet === 'B2B2C' && (
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleTabChange('B2C')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
              formulaireActifB2B2C === 'B2C' ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600'
            )}
          >
            Formulaire B2C
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('B2B')}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
              formulaireActifB2B2C === 'B2B' ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-600'
            )}
          >
            Formulaire B2B
          </button>
        </div>
      )}

      {/* Afficher formulaire B2C ou B2B selon le type */}
      {(typeProjet === 'B2C' || (typeProjet === 'B2B2C' && formulaireActifB2B2C === 'B2C')) && (
        <>
          {/* Stepper progressif pour B2C */}
          <StepperProgressif
            etapes={etapesB2C}
            etapeActive={etapeActive}
            etapesCompletees={etapesCompletees}
            onEtapeChange={setEtapeActive}
          />

          {/* Étape 1: Zone géographique */}
          <div className={cn(sec, "relative", !isStepAccessible('zone_geographique') && 'opacity-50 pointer-events-none')}>
            {renderOverlay('zone_geographique')}
            <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('zone_geographique')}</p>
            <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <p className="text-sm text-zinc-800">
                  {contexteGeo?.zone_principale?.nom || 'Non défini'} ({contexteGeo?.niveau_principal})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGeoSelector(true)}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Redéfinir la zone ciblée
              </button>
              <div className="mt-3">
                {etapeActive === 'zone_geographique' && (
                  <button type="button" onClick={() => markStepComplete('zone_geographique', 'estimation_utilisateurs')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Valider et continuer</button>
                )}
              </div>
            </div>
          </div>

          {/* Étape 2: Estimation utilisateurs */}
          <div className={cn(sec, "relative", !isStepAccessible('estimation_utilisateurs') && 'opacity-50 pointer-events-none')}>
            {renderOverlay('estimation_utilisateurs')}
            <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('estimation_utilisateurs')}</p>
            <div className="space-y-2">
              <input
                type="number"
                {...register('pct_utilisateurs', { valueAsNumber: true, min: 0, max: 100 })}
                className={inp}
                placeholder="Pourcentage (0-100)"
              />
              {calculMarcheQuery.data && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-sm text-indigo-700">
                    Population concernée = {new Intl.NumberFormat('fr-FR').format(calculMarcheQuery.data.population_concernee)} personnes
                  </p>
                </div>
              )}
              <div className="mt-3">
                {etapeActive === 'estimation_utilisateurs' && (
                  <button type="button" onClick={() => markStepComplete('estimation_utilisateurs', 'enquetes')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Valider et continuer</button>
                )}
              </div>
            </div>
          </div>

          {/* Étape 3: Enquêtes terrain */}
          <div className={cn(sec, "relative", !isStepAccessible('enquetes') && 'opacity-50 pointer-events-none')}>
            {renderOverlay('enquetes')}
            <p className="text-[12px] font-medium text-zinc-700 mb-2">Enquêtes terrain</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('enquete_taille')}</label>
                <input type="number" {...register('enquete.taille_echantillon', { valueAsNumber: true })} className={inp} />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('enquete_methode')}</label>
                <select {...register('enquete.methode')} className={sel}>
                  <option value="EN_FACE">En face</option><option value="TELEPHONE">Téléphone</option>
                  <option value="EN_LIGNE">En ligne</option><option value="MIXTE">Mixte</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('enquete_taux_reponse')}</label>
                <input type="number" {...register('enquete.taux_reponse_positive', { valueAsNumber: true })} className={inp} min={0} max={100} />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">{getLabel('enquete_prix')}</label>
                <input type="number" {...register('enquete.wtp_moyen_ar', { valueAsNumber: true })} className={inp} />
              </div>
            </div>
            <div className="mt-3">
              {etapeActive === 'enquetes' && (
                <button type="button" onClick={() => markStepComplete('enquetes', 'concurrents')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Valider et continuer</button>
              )}
            </div>
          </div>

          {/* Étape 4: Concurrents */}
          <div className={cn(sec, "relative", !isStepAccessible('concurrents') && 'opacity-50 pointer-events-none')}>
            {renderOverlay('concurrents')}
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-zinc-700">{getLabel('concurrents')}</p>
              <button type="button" onClick={() => addConc({ nom: '', type: 'DIRECT', part_globale_pct: 0, part_zone_pct: 0, prix_estime_ar: 0, votre_differentiation: '' })}
                className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
            </div>
            {concFields.map((f, i) => (
              <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Concurrent {i + 1}</span>
                  {concFields.length > 1 && <button type="button" onClick={() => remConc(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input {...register(`concurrents.${i}.nom`)} className={inp} placeholder={getLabel('concurrent_nom')} />
                  <select {...register(`concurrents.${i}.type`)} className={sel}>
                    <option value="DIRECT">Direct</option><option value="INDIRECT">Indirect</option><option value="SUBSTITUT">Substitut</option>
                  </select>
                </div>
                <input {...register(`concurrents.${i}.votre_differentiation`)} className={inp} placeholder={getLabel('concurrent_differentiation')} />
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" {...register(`concurrents.${i}.part_globale_pct`, { valueAsNumber: true })} className={inp} placeholder={getLabel('concurrent_part_globale')} />
                  <input type="number" {...register(`concurrents.${i}.part_zone_pct`, { valueAsNumber: true })} className={inp} placeholder={getLabel('concurrent_part_zone')} />
                  <input type="number" {...register(`concurrents.${i}.prix_estime_ar`, { valueAsNumber: true })} className={inp} placeholder={getLabel('concurrent_prix')} />
                </div>
              </div>
            ))}
            {calculMarcheQuery.data && calculMarcheQuery.data.parts_concurrents_zone_pct > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  {calculMarcheQuery.data.parts_concurrents_zone_pct.toFixed(1)}% du marché dans votre zone est occupé par vos concurrents
                </p>
              </div>
            )}
            <div className="mt-3">
              {etapeActive === 'concurrents' && (
                <button type="button" onClick={() => markStepComplete('concurrents', 'taille_marche')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Valider et continuer</button>
              )}
            </div>
          </div>

          {/* Étape 5: Taille du marché (TAM/SAM/SOM) */}
          <div className={cn(sec, "relative", !isStepAccessible('taille_marche') && 'opacity-50 pointer-events-none')}>
            {renderOverlay('taille_marche')}
            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('tam')}</p>
                <input type="number" {...register('taille_marche.tam_valeur', { valueAsNumber: true })} className={inp} placeholder="Nombre de personnes" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('sam')}</p>
                <input type="number" {...register('taille_marche.sam_valeur', { valueAsNumber: true })} className={inp} placeholder="Nombre de personnes" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('som')}</p>
                <input type="number" {...register('taille_marche.som_valeur', { valueAsNumber: true })} className={inp} placeholder="Nombre de personnes" />
              </div>
            </div>

            {/* Affichage calculs marché en temps réel */}
            {calculMarcheQuery.data && (
              <div className="mt-6">
                <AffichageCalculMarche
                  calculs={calculMarcheQuery.data}
                  typeClient="B2C"
                  samSaisi={samValeur || 0}
                  somSaisi={somValeur || 0}
                />
              </div>
            )}
            <div className="mt-4">
              {etapeActive === 'taille_marche' && (
                <button type="button" onClick={() => markStepComplete('taille_marche', 'prix_sources')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Valider le marché</button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Formulaire B2B simplifié */}
      {(typeProjet === 'B2B' || (typeProjet === 'B2B2C' && formulaireActifB2B2C === 'B2B')) && (
        <>
          <div className={sec}>
            <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('tam')}</p>
            <input type="number" {...register('taille_marche.tam_valeur', { valueAsNumber: true })} className={inp} placeholder="Nombre d'entreprises" />
          </div>
          <div className={sec}>
            <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('sam')}</p>
            <input type="number" {...register('taille_marche.sam_valeur', { valueAsNumber: true })} className={inp} placeholder="Nombre d'entreprises" />
          </div>
          <div className={sec}>
            <p className="text-[12px] font-medium text-zinc-700 mb-2">{getLabel('som')}</p>
            <input type="number" {...register('taille_marche.som_valeur', { valueAsNumber: true })} className={inp} placeholder="Nombre d'entreprises" />
          </div>
          <div className={sec}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-medium text-zinc-700">{getLabel('concurrents')}</p>
              <button type="button" onClick={() => addConc({ nom: '', type: 'DIRECT', part_globale_pct: 0, part_zone_pct: 0, prix_estime_ar: 0, votre_differentiation: '' })}
                className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
            </div>
            {concFields.map((f, i) => (
              <div key={f.id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Concurrent {i + 1}</span>
                  {concFields.length > 1 && <button type="button" onClick={() => remConc(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input {...register(`concurrents.${i}.nom`)} className={inp} placeholder={getLabel('concurrent_nom')} />
                  <select {...register(`concurrents.${i}.type`)} className={sel}>
                    <option value="DIRECT">Direct</option><option value="INDIRECT">Indirect</option><option value="SUBSTITUT">Substitut</option>
                  </select>
                </div>
                <input {...register(`concurrents.${i}.votre_differentiation`)} className={inp} placeholder={getLabel('concurrent_differentiation')} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" {...register(`concurrents.${i}.part_globale_pct`, { valueAsNumber: true })} className={inp} placeholder={getLabel('concurrent_part_globale')} />
                  <input type="number" {...register(`concurrents.${i}.prix_estime_ar`, { valueAsNumber: true })} className={inp} placeholder={getLabel('concurrent_prix')} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Positionnement prix + IRP et Sources */}
      <div className={cn(
        typeProjet === 'B2B' || formulaireActifB2B2C === 'B2B' ? 'space-y-5' : 'space-y-5 relative',
        (typeProjet === 'B2C' || (typeProjet === 'B2B2C' && formulaireActifB2B2C === 'B2C')) && !isStepAccessible('prix_sources') && 'opacity-50 pointer-events-none'
      )}>
        {(typeProjet === 'B2C' || (typeProjet === 'B2B2C' && formulaireActifB2B2C === 'B2C')) && renderOverlay('prix_sources')}
        <div className={sec}>
        <p className="text-[12px] font-medium text-zinc-700 mb-2">Positionnement prix & IRP</p>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" {...register('positionnement_prix.prix_min_acceptable_ar', { valueAsNumber: true })} className={inp} placeholder="Prix min (Ar)" />
          <input type="number" {...register('positionnement_prix.prix_recommande_ar', { valueAsNumber: true })} className={inp} placeholder="Prix recommandé (Ar)" />
          <input type="number" {...register('positionnement_prix.prix_max_acceptable_ar', { valueAsNumber: true })} className={inp} placeholder="Prix max (Ar)" />
        </div>
        <select {...register('positionnement_prix.modele_prix')} className={sel}>
          {['UNITE','ABONNEMENT_MENSUEL','ABONNEMENT_ANNUEL','COMMISSION_PCT','PALIERS'].map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
        </select>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
          <p className="text-[11px] text-blue-700 font-medium">IRP — Indice de Réalisme Prix</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" {...register('positionnement_prix.irp.revenu_moyen_zone_ar', { valueAsNumber: true })} className={inp} placeholder="Revenu moyen zone (Ar)" />
            <select {...register('positionnement_prix.irp.frequence_achat')} className={sel}>
              <option value="UNIQUE">Unique</option><option value="MENSUEL">Mensuel</option>
              <option value="HEBDOMADAIRE">Hebdomadaire</option><option value="QUOTIDIEN">Quotidien</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sources (commun à tous les types) */}
      <div className={sec}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-700">Sources de données (min. 1)</p>
          <button type="button" onClick={() => addSrc({ type: 'INSTAT', titre: '', annee: 2024, url: '', donnee_utilisee: '' })}
            className="flex items-center gap-1 text-[11px] text-green-600"><Plus className="w-3.5 h-3.5" /> Ajouter</button>
        </div>
        {srcFields.map((f, i) => (
          <div key={f.id} className="flex gap-2 items-center">
            <select {...register(`sources_marche.${i}.type`)} className={cn(sel, 'w-28')}>
              {['INSTAT','EDBM','GEM','HABAKA','BANQUE_MONDIALE','UPLOAD','EXTERNE'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input {...register(`sources_marche.${i}.titre`)} className={cn(inp, 'flex-1')} placeholder="Titre de la source" />
            <input type="number" {...register(`sources_marche.${i}.annee`, { valueAsNumber: true })} className={cn(inp, 'w-20')} placeholder="Année" />
            {srcFields.length > 1 && <button type="button" onClick={() => remSrc(i)} className="text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>}
          </div>
        ))}
      </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-[13px] font-medium transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer le Stade 3
        </button>
      </div>
    </form>
  )
}
