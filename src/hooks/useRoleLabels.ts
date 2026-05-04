import { authStore } from '@/stores/authStore'

export function useRoleLabels() {
  const utilisateur = authStore((state) => state.utilisateur)
  const role = utilisateur?.role // 'ENTREPRENEUR' | 'MENTOR' | 'INVESTISSEUR'
  
  const isEntrepreneur = role === 'ENTREPRENEUR'
  const isMentor = role === 'MENTOR'
  const isInvestisseur = role === 'INVESTISSEUR'
  const isMentorOrInvestisseur = role === 'MENTOR' || role === 'INVESTISSEUR'
  
  return { 
    isEntrepreneur, 
    isMentor, 
    isInvestisseur,
    isMentorOrInvestisseur, 
    role 
  }
}
