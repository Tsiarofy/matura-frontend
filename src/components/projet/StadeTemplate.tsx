import { type ReactNode, useState, useEffect, useRef } from 'react'
import {type  StadeDetail } from '@matura/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FileText, Upload, LineChart, UserCheck, HelpCircle, Target } from 'lucide-react'
import { authStore } from '@/stores/authStore'

interface StadeTemplateProps {
  stade: StadeDetail
  ongletsContent: {
    missions?: ReactNode
    saisie: ReactNode
    preuves: ReactNode
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
  { value: 'preuves', label: 'Preuves', icon: Upload },
  { value: 'metriques', label: 'Métriques', icon: LineChart },
  { value: 'evaluation', label: 'Évaluation', icon: UserCheck },
]

export function StadeTemplate({ stade, ongletsContent, className }: StadeTemplateProps) {
  const user = authStore((state) => state.utilisateur)
  const isMentor = user?.role === 'MENTOR'
  
  // L'onglet Évaluation n'est visible que si le stade a été soumis, ou si c'est le mentor
  const showEvaluation = isMentor || ['SOUMIS', 'VALIDE', 'EN_REVISION'].includes(stade.statut)

  const [activeTab, setActiveTab] = useState('saisie')
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
      stade.missions_completees === false &&
      ['DEBLOQUE', 'BROUILLON', 'EN_REVISION'].includes(stade.statut)
    ) {
      setActiveTab('missions')
      hasAutoSelected.current = true
    }
  }, [isMentor, stade.statut, stade.missions_completees, ongletsContent.missions])

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Barre d'onglets */}
        <div className="flex w-full justify-center">
          <TabsList className="inline-flex gap-1 rounded-[16px] border border-[var(--color-border)] bg-white p-1 mb-5 shadow-none">
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
                    tab.value === 'saisie' && !isMentor && stade.missions_completees === false
                      ? (e) => {
                          e.preventDefault()
                          setActiveTab('missions')
                        }
                      : undefined
                  }
                  className={cn(
                    'px-2.5 py-1.5 rounded-[12px] text-[11px] transition-colors shadow-none',
                    'data-[state=active]:bg-[var(--color-surface-soft)] data-[state=active]:text-[var(--color-text-primary)] data-[state=active]:font-semibold',
                    'data-[state=inactive]:text-[var(--color-text-muted)] data-[state=inactive]:hover:bg-[var(--color-surface-soft)] data-[state=inactive]:hover:text-[var(--color-text-primary)]',
                    tab.value === 'saisie' && !isMentor && stade.missions_completees === false
                      ? 'opacity-50 cursor-not-allowed'
                      : '',
                  )}
                >
                  <Icon className="w-3.5 h-3.5 mr-1" strokeWidth={1.9} />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Contenu des onglets */}
        {ongletsContent.missions && (
          <TabsContent value="missions" className="mt-0">
            <Card className="mx-auto w-full max-w-3xl p-5">
              {ongletsContent.missions}
            </Card>
          </TabsContent>
        )}

        <TabsContent value="saisie" className="mt-0">
          <Card className="mx-auto w-full max-w-3xl p-5">
            {ongletsContent.saisie}
          </Card>
        </TabsContent>

        {ongletsContent.aide && !isMentor && (
          <TabsContent value="aide" className="mt-0">
            <Card className="mx-auto w-full max-w-3xl p-5">
              {ongletsContent.aide}
            </Card>
          </TabsContent>
        )}

        <TabsContent value="preuves" className="mt-0">
          <Card className="mx-auto w-full max-w-3xl p-5">
            {ongletsContent.preuves}
          </Card>
        </TabsContent>

        <TabsContent value="metriques" className="mt-0">
          <Card className="mx-auto w-full max-w-3xl p-5">
            {ongletsContent.metriques}
          </Card>
        </TabsContent>

        {showEvaluation && (
          <TabsContent value="evaluation" className="mt-0">
            <Card className="mx-auto w-full max-w-3xl p-5">
              {ongletsContent.evaluation || (
                <div className="text-center py-12 text-[var(--color-text-muted)] text-[12px]">
                  En attente d'évaluation par votre mentor
                </div>
              )}
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
