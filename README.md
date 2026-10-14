# Matura — Frontend


<p align="center">
  Interface web du projet <strong>Matura</strong> — plateforme de pré-incubation entrepreneuriale conçue pour les Malagasy.
</p>

<p align="center">
  <a href="https://github.com/Tsiarofy/matura-frontend/actions/workflows/deploy.yml">
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## 🪧 À propos

**Matura** est une application web de pré-incubation de projets entrepreneuriaux, conçue spécialement pour les Malagasy. Elle met en relation directement les porteurs de projet avec des **mentors** et des **investisseurs**, tout en encadrant le porteur de projet pendant son processus de maturation.

Le projet est découpé en **3 dépôts distincts**, et ceci contient uniquement la partie **frontend** (interface utilisateur) :

| Dépôt | Description |
|-------|-------------|
| [`matura-backend`](https://github.com/Tsiarofy/matura-backend) | API NestJS + Prisma |
| [`matura-frontend`](https://github.com/Tsiarofy/matura-frontend) | **Ce dépôt** — Interface React + Vite + TailwindCSS |
| [`matura-shared`](https://github.com/Tsiarofy/matura-shared) | Package `@matura/shared` — types & schémas Zod partagés |

---

## 📦 Prérequis

Avant de démarrer, assurez-vous d'avoir installé :

| Outil | Version recommandée | Lien |
|-------|---------------------|------|
| [Node.js](https://nodejs.org/) | ≥ 20.x | https://nodejs.org/ |
| [npm](https://www.npmjs.com//) | ≥ 9.x |https://docs.npmjs.com/cli/v8/configuring-npm/install |
| [Git](https://git-scm.com/) | toute version récente | https://git-scm.com/ |

> Le backend doit être démarré séparément pour que les appels API fonctionnent. Voir le dépôt [`matura-backend`](https://github.com/Tsiarofy/matura-backend).

---

## 🚀 Installation

### 1. Cloner les 3 dépôts côte à côte

Le package `@matura/shared` est référencé via un lien local (`file:../shared`), les dépôts doivent donc être dans le **même dossier parent**.

```bash
# Créer le dossier parent
mkdir maturaproj && cd maturaproj

# Cloner les 3 dépôts
git clone https://github.com/Tsiarofy/matura-shared.git shared
git clone https://github.com/Tsiarofy/matura-backend.git matura-backend
git clone https://github.com/Tsiarofy/matura-frontend.git matura-frontend
```

### 2. Construire le package partagé

```bash
cd shared
npm install
npm run build
```

### 3. Installer les dépendances du frontend

```bash
cd ../matura-frontend
npm install
```

### 4. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du dépôt frontend :

```dotenv
# URL de base de l'API backend (lue au démarrage par Vite)
VITE_BASE_URL=http://localhost:3001
```

> En production, créer un fichier `.env.production` avec l'URL publique du serveur backend.

---

## 🛠️ Utilisation

### Mode développement

```bash
npm run dev
```

L'application sera disponible sur `https://localhost:5173`.

> **Note :** Le plugin `@vitejs/plugin-basic-ssl` active HTTPS en local. Acceptez le certificat auto-signé dans votre navigateur.

Le proxy Vite redirige automatiquement les appels `/api/*` et `/uploads/*` vers `http://localhost:3001` — le backend doit donc être lancé en parallèle.

### Build de production

```bash
npm run build
```

Les fichiers statiques générés se trouvent dans le dossier `dist/`. En production, **Nginx** les sert directement.

### Prévisualiser le build localement

```bash
npm run preview
```

### Linter

```bash
npm run lint
```

---

## 🤝 Contribution

### Branches

| Branche | Rôle |
|---------|------|
| `main` | Code stable / développement |
| `server` | Déclencheur du déploiement automatique en production |

### Flux de contribution

```bash
# 1. Créer une branche de fonctionnalité depuis main
git checkout main
git pull origin main
git checkout -b feat/nom-de-la-feature

# 2. Développer & committer
git add .
git commit -m "feat: description de la fonctionnalité"

# 3. Pousser et ouvrir une Pull Request vers main
git push origin feat/nom-de-la-feature
```

### Convention de commits

Ce projet suit la convention [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```
feat:     nouvelle fonctionnalité
fix:      correction de bug
refactor: refactorisation sans changement fonctionnel
chore:    tâches de maintenance (dépendances, config…)
docs:     mise à jour de la documentation
```

### Déclencher un déploiement

Le déploiement en production se déclenche automatiquement lors d'un push sur la branche `server` par l'utilisation de GitHub Actions :

```bash
git checkout server
git merge main
git push origin server
```

---

## 🏗️ Construit avec

### Langages & Frameworks

| Technologie | Rôle | Documentation |
|-------------|------|---------------|
| [TypeScript](https://www.typescriptlang.org/) 5 | Langage principal (typage statique) | https://www.typescriptlang.org/docs/ |
| [React](https://react.dev/) 19 | Bibliothèque UI déclarative | https://react.dev/ |
| [Vite](https://vitejs.dev/) 8 | Bundler & serveur de développement ultra-rapide | https://vitejs.dev/ |
| [TailwindCSS](https://tailwindcss.com/) 4 | Framework CSS utilitaire | https://tailwindcss.com/docs/ |
| [TanStack Router](https://tanstack.com/router) | Routage type-safe avec code splitting automatique | https://tanstack.com/router/latest/docs/ |
| [TanStack Query](https://tanstack.com/query) | Gestion du cache et des requêtes serveur | https://tanstack.com/query/latest/docs/ |
| [Zod](https://zod.dev/) | Validation des formulaires et des schémas | https://zod.dev/ |
| [React Hook Form](https://react-hook-form.com/) | Gestion des formulaires performante | https://react-hook-form.com/ |
| [Zustand](https://zustand-demo.pmnd.rs/) | Gestion d'état global légère | https://docs.pmnd.rs/zustand/ |
| [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Composants accessibles et stylisables | https://ui.shadcn.com/ |
| [LiveKit Components React](https://docs.livekit.io/components/react/) | Interface de visioconférence | https://docs.livekit.io/ |
| [Recharts](https://recharts.org/) | Graphiques et visualisations de données | https://recharts.org/ |
| [Sonner](https://sonner.emilkowal.ski/) | Notifications toast | https://sonner.emilkowal.ski/ |
| [Axios](https://axios-http.com/) | Client HTTP | https://axios-http.com/docs/ |
| [@matura/shared](https://github.com/Tsiarofy/matura-shared) | Types & schémas Zod partagés entre frontend et backend | — |

### Outils

#### CI / CD

| Outil | Rôle |
|-------|------|
| [GitHub Actions](https://docs.github.com/fr/actions) | Pipeline de déploiement automatique sur push `server` |

**Secrets GitHub requis** (à configurer dans `Settings → Secrets and variables → Actions`) :

| Secret | Description |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Clé SSH privée pour accéder au serveur GCP |
| `GCP_IP` | Adresse IP du serveur Google Cloud |
| `GCP_USER` | Nom d'utilisateur SSH du serveur |

#### Déploiement

| Outil | Rôle | Documentation |
|-------|------|---------------|
| [Google Cloud Platform (GCP)](https://cloud.google.com/) | Hébergement du serveur de production (VM) | https://cloud.google.com/docs |
| [Nginx](https://nginx.org/) | Sert les fichiers statiques du `dist/` et agit comme reverse proxy vers l'API | https://nginx.org/en/docs/ |
| [npm](https://npm.io/) / npm | Gestionnaire de paquets — build en CI et en production | https://npm.io/ |

**Flux de déploiement (`.github/workflows/deploy.yml`)** :

1. Création d'une archive `.tar.gz` des sources (`src/`, `public/`, configs Vite & TypeScript)
2. Transfert via `scp` vers le serveur GCP
3. Sur le serveur : rebuild de `@matura/shared`, extraction, `npm install`, `npm run build`
4. Nginx sert directement les fichiers statiques du dossier `dist/`

> Contrairement au backend, aucun processus Node.js ne tourne en permanence — le frontend est purement statique après le build.

---

## 📚 Documentation

- [React — Documentation officielle](https://react.dev/)
- [Vite — Documentation officielle](https://vitejs.dev/guide/)
- [TailwindCSS — Documentation officielle](https://tailwindcss.com/docs/)
- [TanStack Router](https://tanstack.com/router/latest/docs/)
- [TanStack Query](https://tanstack.com/query/latest/docs/)
- [shadcn/ui](https://ui.shadcn.com/docs/)
- [LiveKit Components React](https://docs.livekit.io/components/react/)
- [Conventional Commits](https://www.conventionalcommits.org/fr/)
- [Gestion sémantique de version (SemVer)](https://semver.org/lang/fr/)

---

## 🏷️ Gestion des versions

Afin de maintenir un cycle de publication clair et de favoriser la rétrocompatibilité, la dénomination des versions suit la spécification décrite par la [Gestion sémantique de version](https://semver.org/lang/fr/).

Les versions disponibles ainsi que les journaux décrivant les changements apportés sont disponibles depuis [la page des Releases](https://github.com/Tsiarofy/matura-frontend/releases).

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE.md) du dépôt.
