# Spécification Technique Exhaustive : Refonte Dynamique des Stades 2-7 (Framework BRL & IEME)

Ce document est la spécification absolue et finale pour l'implémentation de la refonte des formulaires des Stades 2 à 7. **Toutes les instructions, composants, règles de conception et métriques mentionnés dans ce document doivent être implémentés sans exception ni raccourci.**

## 1. Contexte Fondamental et Objectif

La plateforme a pour mission de réduire le taux d'échec des jeunes entrepreneurs en leur fournissant un cadre structurant (BRL), un suivi via des mentors (IEME), et une transparence basée sur des données INSTAT réelles pour rassurer les investisseurs.
Ce document détaille comment transformer des formulaires statiques basiques en un véritable moteur de maturation et d'audit.

---

## 2. Le Workflow de la Donnée (De la Création à l'Investisseur)

La donnée générée par cette refonte transitera entre trois acteurs selon un cycle de vie strict :

1. **L'Entrepreneur (Saisie & Guidage Stade 3)** : Le système acquiert la taille du marché soit par GeoService (INSTAT) pour le B2C, soit manuellement (Déclaratif) pour le B2B. L'entrepreneur remplit ses objectifs, et le système calcule instantanément (latence 0ms) des métriques de réalisme, affichant des alertes si les chiffres sont irréalistes.
2. **Le Mentor (Évaluation IEME)** : L'IEME (Input, Evidence, Métriques, Evaluation, Aide) exploite ces calculs. L'interface affiche directement les métriques calculées (ex: _"Le SOM représente Y% de la population libre"_) , numérisant et facilitant l'analyse de cohérence.
3. **L'Investisseur (Framework BRL)** : Lors de la consultation d'un projet ou suite à une soumission à un appel d'offres, l'investisseur accède à ces mêmes calculs (Transparence). Il n'a plus à faire confiance aveuglément : le système certifie la taille du marché (GeoService) et prouve mathématiquement la portée du projet.

---

## 3. Architecture et Contrats de Données (Les 9 Champs Informatifs)

### 3.1 Base de données (Backend - Prisma)

**Fichier :** `maturproj-backend/prisma/schema.prisma`

```prisma
model DonneesStades {
  // ... autres champs
  // Champ contenant les KPIs calculés (TAM, SAM, SOM, ratios) pour la transparence
  calculs_informatifs Json?
}
```

### 3.2 Typage Strict des 9 Champs (Module Shared)

Le JSON `calculs_informatifs` du Stade 3 doit impérativement contenir ces 9 champs exacts.
**Fichier :** `shared/src/schemas/calculs.schema.ts`

```typescript
import { z } from "zod";

export const CalculsStade3Schema = z.object({
  // 1. Taille absolue du marché cible (GeoService B2C ou Saisie B2B)
  base_totale: z.number(),
  // 2. Fiabilité de la donnée pour l'investisseur
  source_base: z.enum(["GEOSERVICE", "DECLARATIF"]),
  // 3. Marché capturé: base_totale * (Somme % concurrents)
  occupee_concurrents: z.number(),
  // 4. Marché réellement libre: base_totale - occupee_concurrents
  disponible: z.number(),
  // 5. Empreinte SAM (Total): (SAM / base_totale) * 100
  sam_pct_totale: z.number(),
  // 6. Saturation SAM (Libre): (SAM / disponible) * 100
  sam_pct_disponible: z.number(),
  // 7. Empreinte SOM (Total): (SOM / base_totale) * 100
  som_pct_totale: z.number(),
  // 8. Réalisme An 1 (Libre): (SOM / disponible) * 100
  som_pct_disponible: z.number(),
});

export const CalculsInformatifsSchema = z.object({
  stade_3: CalculsStade3Schema.optional(),
});
export type CalculsInformatifs = z.infer<typeof CalculsInformatifsSchema>;
```

---

## 4. Règles d'Interface et d'Expérience Utilisateur (UI/UX) - CRITIQUES

Ces règles ne sont pas des suggestions, elles sont obligatoires pour valider l'implémentation.

### 4.1 Guidage Bloquant (`StepperProgressif.tsx`)

Le composant Stepper ne doit pas être un simple indicateur visuel, il **DOIT BLOQUER** la progression.

- **Désactivation et Blocage** : Les boutons des étapes futures dont les dépendances ne sont pas remplies DOIVENT être inactifs (`disabled`, curseur `not-allowed`, opacité réduite). L'UI doit afficher la mention _"à remplir progressivement"_ sur les champs ou boutons désactivés.
- **Invalidation en Cascade** : Si l'entrepreneur modifie une étape parente (ex: modification de la zone géo), le composant doit utiliser `watch` pour réinitialiser silencieusement les champs des étapes enfants.

### 4.2 Notes et Aides Contextuelles (`AideStadeX.tsx`)

Pour CHAQUE stade, un composant d'aide dédié DOIT être créé.

- **Palette de couleurs stricte** : Bleu (Infos générales), Vert (Bonnes pratiques), Orange (Avertissements), Rouge (Erreurs), Violet (Métriques), Gris (Notes).
- **Icônes obligatoires par section (Lucide React)** : AlertCircle (Problème), Lightbulb (Solution), TrendingUp (Marché), DollarSign (Finance), Users (Équipe), Cpu (Prototype), Rocket (Lancement).
- **Structure UI requise** :

```tsx
<div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
  <div className="flex items-center gap-2 mb-2">
    <Lightbulb className="w-5 h-5 text-blue-600" />
    <h3 className="font-semibold text-blue-900">Question</h3>
  </div>
  <p className="text-blue-800 mb-3">Explication</p>
  <div className="bg-white border border-blue-200 p-3 rounded">
    <p className="text-sm text-blue-700 italic">Exemple</p>
  </div>
</div>
```

### 4.3 Labels Conditionnels (`useRoleLabels.ts`)

Adaptation du vocabulaire selon l'état `authStore` :

- **Entrepreneur** : Questions directes (ex: _"Quel problème résolvez-vous ?"_)
- **Mentor/Investisseur** : Vocabulaire technique (ex: _"Problem Statement"_)

### 4.4 Alertes de Réalisme Temps Réel (Stade 3)

Calculées dans `useCalculMarche.ts` et affichées en temps réel. Si déclenchées, elles vont dans `alertes_ignorees` :
EXEMPLE

- **Si `sam_pct_disponible` ou `som_pct_disponible` > 80%** : Alerte Rouge ("Objectif totalement irréaliste, le SAM/SOM représente >80% de la population libre. Revoyez vos hypothèses.")
- **Si `som_pct_disponible` > 20%** : Alerte Rouge ("Objectif An 1 irréaliste (>20% du marché libre).")
- **Si `som_pct_disponible` > 5%** : Alerte Orange ("Objectif An 1 très ambitieux. Risque d'exécution élevé.")

---

## 5. Architecture et Dépendances des Stades

Cette section liste de manière exhaustive les étapes et dépendances à coder dans le `StepperProgressif` pour LE STADE 3.

### Stade 3 : Marché

- Étape 1 : Zone géographique (Redéfinition vs héritage Stade 1)
- Étape 2 : Type de client (B2B = Formulaire manuel déclaratif / B2C = Auto GeoService)
- Etape 3 : pourcentage estimmées de l'utilisateurs du produits dans la zones cibles
- Étape 4 : Concurrents (Somme des parts = % marché occupé)
- Étape 5 : TAM (Taille totale du marché)
- Étape 6 : SAM (Dépendances: Concurrents, TAM)
- Étape 7 : SOM (Dépendances: SAM)

---

## 6. Plan d'Action Exhaustif pour l'Implémentation

Le développeur ou l'IA doit implémenter CES 5 PHASES DANS LEUR INTÉGRALITÉ.

**Phase 1 : Socle de Données**

1. Ajouter `calculs_informatifs` dans Prisma et exécuter la migration.(déja mis en place)
2. Créer le typage strict `CalculsInformatifsSchema` dans `@matura/shared`.((déja mis en place))

**Phase 2 : Infrastructure UI et Logique**

1. Développer `useCalculMarche` (calculs client 0ms, gestion B2B/B2C, alertes 80/20/5, retournant les 9 champs exacts).(à revoire)
2. Développer `useRoleLabels` pour la gestion du lexique.
3. Construire `StepperProgressif` AVEC le blocage visuel (boutons `disabled`, mention "à remplir progressivement") et l'invalidation d'état en cascade.

**Phase 3 : Interface Entrepreneur (Stade 3)**

1. Refondre `Stade3Form.tsx` pour utiliser le stepper bloquant.
2. Câbler le B2B (déclaratif) vs B2C (GeoService).
3. **OBLIGATOIRE** : Créer et intégrer le composant `AideStade3.tsx` avec ses codes couleurs et icônes.
4. Afficher les alertes de réalisme sous les inputs correspondants.
5. Sauvegarder le JSON des 9 champs dans la base de données.

**Phase 4 : Outils Mentors & Investisseurs (IEME & BRL)**

1. Développer `AffichageCalculsInformatifs.tsx` consommant les 9 champs.
2. L'intégrer dans le dashboard d'évaluation des Mentors (`EvaluationStade.tsx`).
3. L'intégrer dans les vues de consultation pour Investisseurs (Appels d'offres / BRL).

**Phase 5 : Déploiement Complet sur Tous les Stades**

1. **OBLIGATOIRE** : Créer les composants `AideStade2.tsx`, `AideStade4.tsx`, `AideStade5.tsx`, `AideStade6.tsx`, `AideStade7.tsx` en respectant la structure UI stricte.
2. Appliquer le `StepperProgressif` bloquant en respectant le mappage des dépendances défini dans la Section 5.
3. Appliquer `useRoleLabels` aux formulaires de tous les stades.

**Details implémentation stade3**
La logique est la suivante :
voici l'ordre:

- Étape 1 : Zone géographique (Redéfinition vs héritage Stade 1)
- Étape 2 : Type de client (B2B = Formulaire manuel déclaratif / B2C = Auto GeoService)
- Etape 3 : pourcentage estimmées de l'utilisateurs du produits dans la zones cibles
- Étape 3 : Concurrents (Somme des parts = % marché occupé)
- Étape 4 : TAM (Taille totale du marché)
- Étape 5 : SAM (Dépendances: Concurrents, TAM)
- Étape 6 : SOM (Dépendances: SAM)

on affiche le nombre de ppopulation dans la zone ciblé dans au stade1 (via stade1Form) avec une possibilité de modification(du meme manière que la selection du zone géographique au stade et change le meme données et chaps dans la base de données si l'utilisateur décide de le modifier) cette population sert de base pour notre étude.
puis on récupère le type B2B|B2C|B2B2C depuis le backend(l'utilisateur l'a déja définit lors de la création du projet)
L'utilisateur entre le pourcentage des utilisateurs.
Dans le cas de B2C
l'utilisateur entre le pourcentage du part de marché des concurents et leur part de marché estimée dans le zones cibles
l'utilisateur entre son TAM
l'utiliasteurs entre sont SAM(en nombre de personne)(puis on notifie en temps réelles comme le calculs du nombre de populations dans le stades 1, cette message : le SAM represente Y% de la population dans la zone cibles,le SAM represente Y% de la population libre (c'est à dire le nombre de population dans la zone cible excluant ceux pris par le concurents,et de meme pour les utilisateurs estimées(calculé via (nombre de population dans la zones cibles\*pourcentages des utilisateurs estimmées)/100))
),pareil pour le SOM
et on affiche une petite alertes en temps réelles aussi si les SOM et SAM atteignent une seuill,ex : le SAM represente Y% de la populations dans la zone cible recommendé inférieurs de X%.

Pour la partie conception de cette implémentatins j'ai deux idée (puise qu'on va affiche les infos:"cette message : le SAM represente Y% de la population dans la zone cibles,le SAM represente Y% de la population libre" dans les vues mentor et investisseurs )

- on calcule à la volés à partir des données enregisté(ce que je crois etre la bonne façon).
- ou on enregistre les infos (ce qui causerait une mise à jour à chaque modifications du client,puise que cette infos s'affiche en temps réelles)
