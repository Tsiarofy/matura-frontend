import { type ReactNode, useState } from 'react'
import {type  StadeDetail } from '@matura/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FileText, Upload, LineChart, UserCheck } from 'lucide-react'

interface StadeTemplateProps {
  stade: StadeDetail
  ongletsContent: {
    saisie: ReactNode
    preuves: ReactNode
    metriques: ReactNode
    evaluation?: ReactNode // Optionnel — visible uniquement si stade SOUMIS/VALIDE/EN_REVISION
  }
  className?: string
}

const TABS_CONFIG = [
  { value: 'saisie', label: 'Saisie', icon: FileText },
  { value: 'preuves', label: 'Preuves', icon: Upload },
  { value: 'metriques', label: 'Métriques', icon: LineChart },
  { value: 'evaluation', label: 'Évaluation', icon: UserCheck },
]

export function StadeTemplate({ stade, ongletsContent, className }: StadeTemplateProps) {
  const [activeTab, setActiveTab] = useState('saisie')
  
  // L'onglet Évaluation n'est visible que si le stade a été soumis
  const showEvaluation = ['SOUMIS', 'VALIDE', 'EN_REVISION'].includes(stade.statut)

  return (
    <div className={cn('w-full', className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Barre d'onglets */}
        <TabsList className="bg-zinc-100 p-1 rounded-lg inline-flex gap-1 mb-6">
          {TABS_CONFIG.map((tab) => {
            // Skip l'onglet évaluation si pas encore soumis
            if (tab.value === 'evaluation' && !showEvaluation) return null

            const Icon = tab.icon
            
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[12px] transition-all',
                  'data-[state=active]:bg-white data-[state=active]:text-zinc-800 data-[state=active]:font-medium',
                  'data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-200'
                )}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Contenu des onglets */}
        <TabsContent value="saisie" className="mt-0">
          <Card className="bg-white border-zinc-200 rounded-xl p-6">
            {ongletsContent.saisie}
          </Card>
        </TabsContent>

        <TabsContent value="preuves" className="mt-0">
          <Card className="bg-white border-zinc-200 rounded-xl p-6">
            {ongletsContent.preuves}
          </Card>
        </TabsContent>

        <TabsContent value="metriques" className="mt-0">
          <Card className="bg-white border-zinc-200 rounded-xl p-6">
            {ongletsContent.metriques}
          </Card>
        </TabsContent>

        {showEvaluation && (
          <TabsContent value="evaluation" className="mt-0">
            <Card className="bg-white border-zinc-200 rounded-xl p-6">
              {ongletsContent.evaluation || (
                <div className="text-center py-12 text-zinc-500 text-[12px]">
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
