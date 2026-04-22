import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CarteProjet } from '@/components/projet/CarteProjet'
import { NouveauProjetForm } from '@/components/projet/NouveauProjetForm'
import { EmptyState } from '@/components/shared/EmptyState'
import { useProjets } from '@/hooks/useProjets'
import { useCreateProjet } from '@/hooks/useCreateProjet'
import { Plus, FolderOpen, Loader2 } from 'lucide-react'
import {type  CreationProjetDto } from '@matura/shared'
// console.log("logs lors du chargement du fichies")
export default function ProjetsIndexPage() {
// console.log("log lors de l'appelle fonction");

  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Récupération des projets
  // console.log("log avant l'appelle du hoooks")
  const { data, isLoading, isError, error } = useProjets()

  // console.log("log apres appelle du hooks");
  console.log(data,isLoading,isError,error)
  
  // Mutation création
  const createProjet = useCreateProjet()

  const handleCreateProjet = async (dto: CreationProjetDto) => {
    await createProjet.mutateAsync(dto)
    setDialogOpen(false)
  }

  // États de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-[13px] text-red-600 mb-2">
            Erreur de chargement
          </p>
          <p className="text-[12px] text-zinc-500">
            {error?.message || 'Une erreur est survenue'}
          </p>
        </div>
      </div>
    )
  }

  const projets = data?.projets || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-medium text-zinc-900">Mes projets</h1>
          <p className="text-[12px] text-zinc-500 mt-1">
            {projets.length} projet{projets.length > 1 ? 's' : ''} au total
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
          Nouveau projet
        </Button>
      </div>

      {/* Contenu */}
      {projets.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Aucun projet pour le moment"
          description="Créez votre premier projet pour commencer votre parcours de maturation."
          action={{
            label: 'Créer un projet',
            onClick: () => setDialogOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projets.map((projet) => (
            <CarteProjet key={projet.id} projet={projet} />
          ))}
        </div>
      )}

      {/* Dialog création */}
      <NouveauProjetForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateProjet}
      />
    </div>
  )
}
