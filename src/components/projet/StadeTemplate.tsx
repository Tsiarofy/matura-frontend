import { type ReactNode, useState, useEffect, useRef } from 'react'
import {type  StadeDetail } from '@matura/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FileText, LineChart, UserCheck, HelpCircle, Target, AlertCircle } from 'lucide-react'
import { authStore } from '@/stores/authStore'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface StadeTemplateProps {
  stade: StadeDetail
  ongletsContent: {
    missions?: ReactNode
    saisie: ReactNode
    metriques: ReactNode
    aide?: ReactNode // Optionnel — contenu d'aide pour le stade
    evaluation?: ReactNode // Optionnel — visible uniquement si stade SOUMIS/VALIDE/EN_REVISION
  }
  className?: string
}

const TABS_CONFIG = [
  { value: 'missions', label: 'Missions', icon: Target },
  { value: 'saisie', label: 'Saisie', icon: FileText },
  { value: 'aide', label: 'Aide', icon: HelpCircle },
  { value: 'metriques', label: 'Métriques', icon: LineChart },
  { value: 'evaluation', label: 'Évaluation', icon: UserCheck },
]

export function StadeTemplate({ stade, ongletsContent, className }: StadeTemplateProps) {
  const user = authStore((state) => state.utilisateur)
  const isMentor = user?.role === 'MENTOR'
  
  // L'onglet Évaluation n'est visible que si le stade a été soumis, ou si c'est le mentor
  const showEvaluation = isMentor || ['SOUMIS', 'VALIDE', 'EN_REVISION'].includes(stade.statut)

  const [activeTab, setActiveTab] = useState('saisie')
  const [showMissionWarning, setShowMissionWarning] = useState(false)
  const hasAutoSelected = useRef(false)

  // Auto-sélectionner l'onglet Évaluation pour le Mentor si le stade est soumis
  useEffect(() => {
    if (hasAutoSelected.current) return

    if (isMentor && stade.statut === 'SOUMIS') {
      setActiveTab('evaluation')
      hasAutoSelected.current = true
      return
    }
    if (
      !isMentor &&
      ongletsContent.missions &&
      (stade as any).missions_completees === false &&
      ['DEBLOQUE', 'BROUILLON', 'EN_REVISION'].includes(stade.statut)
    ) {
      setActiveTab('missions')
      hasAutoSelected.current = true
    }
  }, [isMentor, stade.statut, (stade as any).missions_completees, ongletsContent.missions])

  return (
    <div className={cn('w-full min-h-[calc(100vh-140px)] flex flex-col', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        {/* Barre d'onglets */}
        <div className="flex w-full justify-center">
          <TabsList className="inline-flex gap-2 rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-md p-1.5 mb-8 shadow-sm">
            {TABS_CONFIG.map((tab) => {
              // Skip l'onglet évaluation si pas encore soumis
              if (tab.value === 'evaluation' && !showEvaluation) return null

              // Masquer l'onglet aide pour le mentor
              if (tab.value === 'aide' && isMentor) return null

              if (tab.value === 'missions' && !ongletsContent.missions) return null

              const Icon = tab.icon
              
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={
                    tab.value === 'saisie' && !isMentor && (stade as any).missions_completees === false
                      ? (e) => {
                          e.preventDefault()
                          setShowMissionWarning(true)
                        }
                      : undefined
                  }
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-[13px] transition-all duration-200 ease-in-out shadow-none',
                    'data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-md data-[state=active]:shadow-green-600/20',
                    'data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-100/80 data-[state=inactive]:hover:text-zinc-800',
                    tab.value === 'saisie' && !isMentor && (stade as any).missions_completees === false
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" strokeWidth={2} />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        {ongletsContent.missions && (
          <TabsContent value="missions" className="mt-0">
            <Card className="mx-auto w-full max-w-3xl min-h-[60vh] p-5 lg:p-8 shadow-sm">
              {ongletsContent.missions}
            </Card>
          </TabsContent>
        )}

        <TabsContent value="saisie" className="mt-0">
          <Card className="mx-auto w-full max-w-3xl min-h-[60vh] p-5 lg:p-8 shadow-sm">
            {ongletsContent.saisie}
          </Card>
        </TabsContent>

        {ongletsContent.aide && !isMentor && (
          <TabsContent value="aide" className="mt-0">
            <Card className="mx-auto w-full max-w-3xl min-h-[60vh] p-5 lg:p-8 shadow-sm">
              {ongletsContent.aide}
            </Card>
          </TabsContent>
        )}

        <TabsContent value="metriques" className="mt-0">
          <Card className="mx-auto w-full max-w-3xl min-h-[60vh] p-5 lg:p-8 shadow-sm">
            {ongletsContent.metriques}
          </Card>
        </TabsContent>

        {showEvaluation && (
          <TabsContent value="evaluation" className="mt-0">
            <Card className="mx-auto w-full max-w-3xl min-h-[60vh] p-5 lg:p-8 shadow-sm flex flex-col">
              {ongletsContent.evaluation || (
                <div className="flex-1 flex items-center justify-center text-center text-[var(--color-text-muted)] text-[13px] italic">
                  En attente d'évaluation par votre mentor
                </div>
              )}
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Modale d'avertissement missions non complétées */}
      <Dialog open={showMissionWarning} onOpenChange={setShowMissionWarning}>
        <DialogContent className="sm:max-w-[420px] p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-zinc-800 mb-1">
                Saisie non disponible
              </h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                Vous devez compléter et faire valider <strong>toutes vos missions</strong> avant 
                de pouvoir accéder au formulaire de saisie de ce stade.
              </p>
            </div>
            <button
              onClick={() => {
                setShowMissionWarning(false)
                setActiveTab('missions')
              }}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              Voir mes missions
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
