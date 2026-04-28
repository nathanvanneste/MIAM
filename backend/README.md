# MIAM — Backend

API REST développée avec **NestJS** et **TypeScript**, connectée à **Supabase** (PostgreSQL).

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- npm
- Un projet Supabase créé sur [supabase.com](https://supabase.com)

## Variables d'environnement

Créez un fichier `.env` à la racine du projet à partir du template :

```bash
cp .env.example .env
```

Remplissez ensuite vos valeurs dans `.env` :

```env
PORT=3000
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

> Les clés Supabase sont disponibles sur [supabase.com](https://supabase.com) → votre projet → **Settings → API**. La `SERVICE_ROLE_KEY` ne doit jamais être partagée publiquement ni envoyée au frontend.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

L'API est disponible sur `http://localhost:3000`.

## Exposer l'API (accès depuis mobile)

Pour tester l’application depuis un téléphone (Expo Go), il est nécessaire d’exposer l’API via un tunnel.

### Installation de Cloudflare Tunnel

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb
```

### Lancement du tunnel

Après avoir démarré le backend (cf. `Compile and run the project`), lancer le tunnel :
```bash
cloudflared tunnel --url http://localhost:3000
```

Une URL publique sera générée, par exemple : `https://xxxx.trycloudflare.com`

Cette URL permet d’accéder à l’API depuis un appareil externe (téléphone, réseau différent, etc.)

- ⚠️ L’URL change à chaque lancement du tunnel
- ⚠️ Le terminal doit rester ouvert pour que le tunnel reste actif




## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Architecture

```
src/
├── recipes/                  # Gestion des recettes
│   ├── dto/                      # Validation des données entrantes
│   ├── entities/                 # Définition du modèle
│   ├── recipes.controller.ts     # Routes HTTP
│   ├── recipes.service.ts        # Logique métier + appels Supabase
│   └── recipes.module.ts
├── ingredients/              # Gestion des ingrédients
├── shopping-lists/           # Listes de courses partagées
├── groups/                    # Équipes et membres
├── users/                    # Utilisateurs
├── auth/                     # Vérification des tokens JWT Supabase
├── common/
│   ├── guards/               # AuthGuard, TeamGuard...
│   ├── decorators/           # @CurrentUser(), @Public()...
│   └── filters/              # Gestion globale des erreurs
├── config/                   # Configuration Supabase et variables d'env
├── app.module.ts
└── main.ts
```

### Conventions

- Toute communication avec Supabase passe par les `service`, jamais depuis les `controller`
- Les `dto` définissent et valident la structure des données reçues dans les requêtes
- Les `entities` définissent la structure des données retournées
- Toutes les routes sont protégées par le `AuthGuard` par défaut, sauf exceptions explicites avec `@Public()`

## Stack technique

| Outil | Rôle |
|---|---|
| NestJS | Framework backend Node.js |
| TypeScript | Typage statique |
| Supabase | Base de données PostgreSQL + Auth + Storage + Realtime |
| class-validator | Validation des DTOs |

## Deployment

A voir plus tard (cf docs description projet pour le choix de la techno)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
