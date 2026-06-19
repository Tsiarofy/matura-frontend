import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreationProjetSchema, type CreationProjetDto, DomainProjetEnum, TypeCibleEnum } from '@matura/shared'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { DOMAINE_LABELS, TYPE_CIBLE_LABELS, REGIONS_MADAGASCAR } from '@/lib/constants'

interface NouveauProjetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreationProjetDto) => Promise<void>
}

export function NouveauProjetForm({ open, onOpenChange, onSubmit }: NouveauProjetFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreationProjetDto>({
    resolver: zodResolver(CreationProjetSchema),
  })

  const handleFormSubmit = async (data: CreationProjetDto) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
      reset()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Erreur création projet:', error)
      toast.error("Erreur", { description: error.response?.data?.message || 'Erreur lors de la création du projet' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-[15px] font-medium">Nouveau projet</DialogTitle>
          <DialogDescription className="text-[12px]">
            Décrivez votre idée en quelques mots. Vous pourrez compléter les détails dans les stades suivants.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Titre */}
          <div className="space-y-1.5">
            <Label htmlFor="titre" className="text-[11px] text-zinc-500">
              Titre du projet *
            </Label>
            <Input
              id="titre"
              {...register('titre')}
              placeholder="Ex: AgriConnect — Plateforme de mise en relation"
              className={cn(errors.titre && 'border-red-500')}
            />
            {errors.titre && (
              <p className="text-[11px] text-red-600">{errors.titre.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[11px] text-zinc-500">
              Description courte *
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Décrivez votre idée en 2-3 phrases..."
              rows={3}
              className={cn(errors.description && 'border-red-500')}
            />
            {errors.description && (
              <p className="text-[11px] text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Grid 2 colonnes */}
          <div className="grid grid-cols-2 gap-4">
            {/* Domaine */}
            <div className="space-y-1.5">
              <Label htmlFor="domaine" className="text-[11px] text-zinc-500">
                Domaine *
              </Label>
              <Select onValueChange={(value) => setValue('domaine', value as any)}>
                <SelectTrigger className={cn(errors.domaine && 'border-red-500')}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {DomainProjetEnum.options.map((domaine) => (
                    <SelectItem key={domaine} value={domaine}>
                      {DOMAINE_LABELS[domaine]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.domaine && (
                <p className="text-[11px] text-red-600">{errors.domaine.message}</p>
              )}
            </div>

            {/* Secteur */}
            <div className="space-y-1.5">
              <Label htmlFor="secteur" className="text-[11px] text-zinc-500">
                Secteur *
              </Label>
              <Input
                id="secteur"
                {...register('secteur')}
                placeholder="Ex: Agriculture"
                className={cn(errors.secteur && 'border-red-500')}
              />
              {errors.secteur && (
                <p className="text-[11px] text-red-600">{errors.secteur.message}</p>
              )}
            </div>
          </div>

          {/* Grid 2 colonnes */}
          <div className="grid grid-cols-2 gap-4">
            {/* Région */}
            <div className="space-y-1.5">
              <Label htmlFor="region" className="text-[11px] text-zinc-500">
                Région *
              </Label>
              <Select onValueChange={(value) => setValue('region', value)}>
                <SelectTrigger className={cn(errors.region && 'border-red-500')}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS_MADAGASCAR.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-[11px] text-red-600">{errors.region.message}</p>
              )}
            </div>

            {/* Type cible */}
            <div className="space-y-1.5">
              <Label htmlFor="type_cible" className="text-[11px] text-zinc-500">
                Type de client *
              </Label>
              <Select onValueChange={(value) => setValue('type_cible', value as any)}>
                <SelectTrigger className={cn(errors.type_cible && 'border-red-500')}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {TypeCibleEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_CIBLE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type_cible && (
                <p className="text-[11px] text-red-600">{errors.type_cible.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer le projet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
