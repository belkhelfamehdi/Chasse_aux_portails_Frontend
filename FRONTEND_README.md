# Chasse aux Portails - Frontend

Interface d'administration pour la gestion du système de chasse aux portails en réalité augmentée.

## 🚀 Technologies utilisées

- **React 19** - Framework frontend
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Heroicons** - Icônes
- **Vite** - Build tool

## 📋 Fonctionnalités

### Authentification
- [x] Connexion avec email/mot de passe
- [x] Gestion des tokens JWT
- [x] Persistance de session
- [x] Déconnexion sécurisée

### Gestion des rôles
- [x] **Super Admin** : Accès total à toutes les fonctionnalités
- [x] **Admin** : Accès limité aux villes assignées

### Gestion des villes
- [x] Liste des villes avec pagination
- [x] Création de nouvelles villes
- [x] Modification des villes existantes
- [x] Suppression de villes
- [x] Affichage des coordonnées GPS et rayon
- [x] Gestion des permissions par utilisateur

### Dashboard
- [x] Statistiques générales (villes, POIs, utilisateurs)
- [x] Actions rapides
- [x] Interface adaptée au rôle de l'utilisateur

### Fonctionnalités à venir
- [ ] Gestion des POIs (Points d'Intérêt)
- [ ] Upload de fichiers 3D et icônes
- [ ] Gestion des utilisateurs (Super Admin)
- [ ] Système de notifications
- [ ] Historique des modifications
- [ ] Export de données

## 🛠️ Installation et démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [URL_DU_REPO]

# Naviguer dans le dossier frontend
cd Chasse_aux_portails_Frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Scripts disponibles
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualisation du build
npm run lint     # Vérification du code
```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── inputs/         # Composants d'entrée
│   ├── AddCityModal.tsx
│   ├── Button.tsx
│   ├── CitiesContent.tsx
│   ├── DashboardContent.tsx
│   └── Layout.tsx
├── contexts/           # Contextes React
│   └── AuthContext.tsx
├── pages/              # Pages principales
│   ├── Home/
│   │   ├── CitiesPage.tsx
│   │   └── DashboardPage.tsx
│   └── LoginPage.tsx
├── services/           # Services API
│   └── apiService.ts
├── types/              # Types TypeScript
│   └── index.ts
├── assets/             # Assets statiques
└── App.tsx             # Composant principal
```

## 🔗 API Backend

Le frontend communique avec l'API backend via les endpoints suivants :

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchissement du token

### Villes
- `GET /api/villes` - Liste des villes
- `POST /api/villes` - Créer une ville
- `PUT /api/villes/:id` - Modifier une ville
- `DELETE /api/villes/:id` - Supprimer une ville

### POIs
- `GET /api/pois` - Liste des POIs
- `POST /api/pois` - Créer un POI
- `PUT /api/pois/:id` - Modifier un POI
- `DELETE /api/pois/:id` - Supprimer un POI

## 🎨 Design System

### Couleurs principales
- **Primary** : Teal (#14B8A6)
- **Texte** : Gray-900 (#111827)
- **Arrière-plan** : Gray-100 (#F3F4F6)

### Composants
- Boutons avec états disabled/loading
- Modales avec overlay
- Formulaires avec validation
- Tables responsives
- Cards avec shadow

## 🔒 Sécurité

- Authentification JWT avec refresh token
- Validation côté client et serveur
- Protection des routes par rôle
- Nettoyage automatique des tokens expirés
- Headers de sécurité avec Helmet.js

## 📱 Responsive Design

L'interface est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚧 Statut du développement

- ✅ **Phase 1** : Authentification et structure de base
- ✅ **Phase 2** : Gestion des villes
- 🚧 **Phase 3** : Gestion des POIs (en cours)
- ⏳ **Phase 4** : Gestion des utilisateurs
- ⏳ **Phase 5** : Fonctionnalités avancées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les modifications (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Notes de développement

- Le projet utilise ESLint avec des règles strictes
- Les types TypeScript sont obligatoires
- Les composants doivent être documentés
- Tests unitaires à ajouter prochainement
