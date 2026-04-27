# SMART PLD Template Repository

![Insalogo](./images/logo-insa_0.png)

Template by [Riccardo Tommasini](riccardotommasini.com/) from [INSA Lyon](https://www.insa-lyon.fr/).

Students: **William Barran - Arnaud Malle - Ashwine Trivaroul - Élodie Duverger - Nathan Vanneste - Paul Charpentier**

### Abstract

## Description 

## Project Objectives

## Requirements

## How to Run the Project

### Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm
- [Expo Go](https://expo.dev/client) sur votre téléphone (iOS ou Android)
- Demander les fichiers `.env` à un membre de l'équipe (frontend + backend)

### 1. Cloner le repo

```bash
git clone https://github.com/nathanvanneste/MIAM.git
cd MIAM
```

### 2. Lancer le backend
Plus de détail dans le readme du backend
```bash
cd backend
npm install
cp .env.example .env   # puis remplir les vraies valeurs
npm run start:dev
```

L'API tourne sur `http://localhost:3000`.

### 3. Lancer le frontend
Plus de détail dans le readme du frontend
```bash
cd frontend
npm install
cp .env.example .env   # puis remplir les vraies valeurs
npx expo start
```

Scannez le QR code avec votre téléphone — **Appareil photo** sur iOS, **Expo Go** sur Android.

> Pour les détails complets de chaque partie, voir les README dans `/frontend` et `/backend`.

## Checklist

- [ ] Clone the created repository offline;
- [ ] Add your name and surname to the Readme file and your teammates as collaborators
- [ ] Complete the field above after the project is approved
- [ ] Make any changes to your repository according to the specific assignment;
- [ ] Ensure code reproducibility and instructions on how to replicate the results;
- [ ] Add an open-source license, e.g., Apache 2.0;
