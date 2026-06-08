import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreerFormation } from '@/hooks/useFormations'
import { DOMAINE_LABELS, TYPE_CIBLE_LABELS, STADE_LABELS } from '@/lib/constants'
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis').max(150),
  description: z.string().max(1000).optional(),
  domaine: z.string().min(1, 'Le domaine est requis'),
  stade_cible: z.any().optional(),
  type_cible: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreerFormationPage() {
  const navigate = useNavigate({ from: '/mes-formations/creer' })
  const creerFormation = useCreerFormation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: '',
      description: '',
      domaine: '',
      stade_cible: '',
      type_cible: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    creerFormation.mutate(
      {
        titre: data.titre,
        description: data.description || undefined,
        domaine: data.domaine as any,
        stade_cible: typeof data.stade_cible === 'number' 
            ? data.stade_cible 
            : data.stade_cible ? Number(data.stade_cible) : undefined,
        type_cible: (data.type_cible as any) || undefined,
      },
      {
        onSuccess: (formation) => {
          toast.success('Formation créée avec succès')
          navigate({
            to: '/mes-formations/$formationId',
            params: { formationId: formation.id },
          })
        },
        onError: () => {
          toast.error('Erreur lors de la création de la formation')
        },
      }
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/mes-formations' })}
          className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <h1 className="text-[18px] text-zinc-900 font-semibold">Créer une formation</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <div>
          <label className="block text-[13px] font-medium text-zinc-700 mb-1">Titre de la formation *</label>
          <input
            {...register('titre')}
            className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            placeholder="Ex: Valider son marché en B2B"
          />
          {errors.titre && <p className="text-red-500 text-[11px] mt-1">{errors.titre.message}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            placeholder="Décrivez ce que les entrepreneurs vont apprendre..."
          />
          {errors.description && <p className="text-red-500 text-[11px] mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-zinc-700 mb-1">Domaine *</label>
          <select
            {...register('domaine')}
            className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          >
            <option value="">Sélectionner un domaine</option>
            {Object.entries(DOMAINE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          {errors.domaine && <p className="text-red-500 text-[11px] mt-1">{errors.domaine.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1">Stade cible (optionnel)</label>
            <select
              {...register('stade_cible')}
              className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            >
              <option value="">Tous les stades</option>
              {Object.entries(STADE_LABELS).map(([num, label]) => (
                <option key={num} value={num}>Stade {num} — {label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-zinc-700 mb-1">Type cible (optionnel)</label>
            <select
              {...register('type_cible')}
              className="w-full text-[13px] border border-zinc-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            >
              <option value="">Tous les types</option>
              {Object.entries(TYPE_CIBLE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-zinc-100">
          <button
            type="submit"
            disabled={creerFormation.isPending}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {creerFormation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Créer la formation
          </button>
        </div>
      </form>
    </div>
  )
}
