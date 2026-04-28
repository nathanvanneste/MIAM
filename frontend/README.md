# MIAM — Frontend Mobile

Application mobile développée avec **Expo**, **React Native** et **TypeScript**.

## Prérequis

- [Node.js](https://nodejs.org/) (v20.20 ou supérieur)
- npm
- [Expo Go](https://expo.dev/client) installé sur votre téléphone (iOS ou Android)
- Backend lancé en local (voir le README du backend)

## Variables d'environnement

Créez un fichier `.env` à la racine du projet à partir du template :

```bash
cp .env.example .env
```

Remplissez ensuite vos valeurs dans `.env` :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
### API backend

- En local sans tunnel :
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

- Avec tunnel Cloudflare (recommandé) :
    1. Suivre les instructions du backend pour lancer le tunnel :
    cf. `backend/README.md`

    2. Copier l’URL générée (ex : `https://xxxx.trycloudflare.com`)
    3. Mettre à jour :
    ```bash
    EXPO_PUBLIC_API_URL=https://xxxx.trycloudflare.com # Attention à ne pas mettre le / à la fin
    ```
| ⚠️ Cette URL change à chaque lancement du tunnel.

### Supabase

> Les clés Supabase sont disponibles sur [supabase.com](https://supabase.com) → votre projet → **Settings → API**. La `SERVICE_ROLE_KEY` ne doit jamais être partagée publiquement ni envoyée au frontend.

## Installation

```bash
npm install
```

## Lancer l'application

```bash
# Si pas sur WSL 
npx expo start
# Si WSL
npm run start:tunnel
```

Scannez ensuite le QR code avec :
- **iOS** — l'application Appareil photo
- **Android** — l'application Expo Go

## Architecture

```
src/
├── components/
│   ├── ui/              # Composants génériques réutilisables (Button, Input, Card...)
│   └── features/        # Composants métier (RecipeCard, ShoppingItem, TeamBadge...)
├── screens/             # Écrans de l'application (un fichier par écran)
├── navigation/          # Configuration React Navigation (routes, tabs, stacks)
├── services/            # Appels API et logique d'accès aux données
├── hooks/               # Custom hooks React (useRecipes, useAuth, useTeam...)
├── store/               # Gestion d'état global (Zustand ou Redux)
├── types/               # Types et interfaces TypeScript partagés
├── utils/               # Fonctions utilitaires pures
├── constants/           # Constantes de l'application (couleurs, tailles, textes...)
├── config/              # Configuration externe (API URL, clés Supabase...)
└── assets/              # Images, icônes, fonts
```

### A supprimer plus tard : explication golémique de ce qu'on fait dans chaque dossier
components/ contient les petits blocs réutilsables d'interface.
screens/ contient les pages complètes de l'application.
navigation/ Contient la configuration de navigation (pas sur qu'il soit utile si on utilise expo router)
services/ contient les appels vers le backend NestJS (ou Supabase ?)
hooks/ Contient des fonctions React réutilisables. Un hook sert à regrouper de la logique utilisée par un écran ou un composant
store/ Contient l'état global de l'application (pour les données partagées partout : utilisateur connecté, token d'authentification, préférences, liste de course courrante,...) : c'est bien quand plusieurs écrans ont besoin de la même info
types/ Contient les types TypeScript partagés (recette...)
utils/ fonctions utiliatires générales
constants/ Contient les constantes globales (units, colors, ...)
config/
assets/ Contient les images, icônes, polices, etc...

### Conventions

- Un écran = un fichier dans `screens/`
- Les composants génériques (sans logique métier) vont dans `components/ui/`
- Les composants liés aux fonctionnalités de l'app vont dans `components/features/`
- Toute communication avec le backend passe par `services/`, jamais directement depuis un composant

## Stack technique

| Outil | Rôle |
|---|---|
| Expo | Surcouche React Native, build et déploiement simplifié |
| React Native | Framework mobile cross-platform (iOS + Android) |
| TypeScript | Typage statique |
| React Navigation ou expo navigation ? | Navigation entre les écrans |


#### A partir de là c'est du claude ducoup je sais pas encore si c'est utile
## Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Les variables Expo doivent être préfixées par `EXPO_PUBLIC_` pour être accessibles côté client.

## Tester sur émulateur

- **iOS** — Xcode requis (Mac uniquement) : `npx expo run:ios`
- **Android** — Android Studio requis : `npx expo run:android`
