import { ProfilEntrepreneurForm } from '@/components/profil/ProfilEntrepreneurForm';
import { ProfilMentorForm } from '@/components/profil/ProfilMentorForm';
import { ProfilInvestisseurForm } from '@/components/profil/ProfilInvestisseurForm';
import { authStore } from '@/stores/authStore';

export default function ProfilePage() {
  const user = authStore((state) => state.utilisateur);

  if (!user) {
    console.warn("Aucun utilisateur connecté, redirection vers la page de connexion...");
    return <div>Chargement...</div>;
  }

  switch (user.role) {
    case 'ENTREPRENEUR':
      return <ProfilEntrepreneurForm />;
    case 'MENTOR':
      return <ProfilMentorForm />;
    case 'INVESTISSEUR':
      return <ProfilInvestisseurForm />;
    default:
      return <div>Rôle non reconnu</div>;
  }
}
