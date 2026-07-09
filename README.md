# Plan de charge (back)
Une application web pour gérer le plan de charge de l'équipe QA

## Fonctionnalités
- Ajout/Suppression/Modification des chantiers QA
- Ajout/Suppression/Modification des utilisateurs
- Ajout/Suppression/Modification des absences des QA
- Calcule des KPIS chantiers: delta, capacitaire QA, charge (globale, consommée, RAF), nb jours ouvrés.
- Export du plan de charge en EXCEL
- Import des titres de chantiers depuis un EXCEL (ex: référentiel projet)

## Stack techniques
- Front : React / MUI
- Back : Node / Express
- DB : PostgreSQL
- Auth : Keycloak


## Installation du front

### 1️. Cloner le projet
```bash
git clone '<lien du projet récuperable sur github/gitlab>'
```

### 2. Installation des dépendances

Pour le frontend : 

```bash
cd '<nom du dossier clonné partie front>'
```
```bash
npm install
```

Pour le backend :

```bash
cd '<nom du dossier clonné partie back>'
```
```bash
npm install
```

### 3. Lancement du front

Pour le frontend : 
```bash
npm start
```

Pour le backend : 
```bash
npm run dev
```
