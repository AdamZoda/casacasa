# Système de Carte Interactive - Points d'Intérêt

## Vue d'ensemble

Ce système permet d'ajouter et gérer des points d'intérêt (POIs) sur une carte interactive Leaflet affichée dans la page "À Propos" (About Us).

## Caractéristiques

✅ **Carte Interactive** - Leaflet avec OpenStreetMap
✅ **Filtrage** - Filtrer par type (Toilettes, Parking, Restaurant, Boutique, Autre)
✅ **Gestion Admin** - Interface intuitive pour ajouter/modifier/supprimer des POIs
✅ **Coordonnées Automatiques** - Extraction auto de lat/lng au format `33.5731, -7.5898`
✅ **Visibilité Toggleable** - Montrer/masquer les POIs directement
✅ **Google Maps Integration** - Lien direct sur Google Maps pour chaque POI

## Installation

### 1. Créer la table Supabase

Exécutez le script SQL dans le dashboard Supabase:

```sql
-- File: database/points_of_interest.sql
```

Ou via: Supabase → SQL Editor → Copier/Coller le contenu

### 2. Les dépendances sont déjà installées

```bash
npm install leaflet react-leaflet
```

## Utilisation

### Pour les Administrateurs

1. Allez à **Admin Console** → **Carte & Localités**

2. **Ajouter un POI:**
   - Remplissez le nom
   - Sélectionnez le type
   - Ajoutez une description
   - Collez les coordonnées: `33.56995217174566, -7.570014388565041`
   - Les coordonnées sont extraites automatiquement
   - Cliquez "Ajouter le point"

3. **Modifier un POI:**
   - Cliquez l'icône ✏️
   - Modifiez les champs
   - Cliquez "Mettre à jour"

4. **Supprimer un POI:**
   - Cliquez l'icône 🗑️
   - Confirmez la suppression

5. **Toggler la Visibilité:**
   - Cliquez l'icône 👁️ pour masquer
   - Cliquez l'icône 👁️‍🗨️ pour afficher

### Pour les Utilisateurs

1. Allez à la page **À Propos**
2. Scrollez jusqu'à la section "Découvrez les points d'intérêt"
3. Utilisez les filtres pour lire les POIs par type
4. Cliquez un POI pour le voir sur la carte
5. Cliquez "Ouvrir sur Google Maps" pour les directions

## Format des Coordonnées

Le système accepte les formats suivants:

```
33.5731, -7.5898           ✅ Recommandé
33.5731,-7.5898            ✅ Sans espace
Latitude: 33.5731
Longitude: -7.5898
```

Les valeurs sont automatiquement extraites et arrondies à 4 décimales.

## Types de POI

Chaque POI a un type et une icône associée:

| Type | Emoji | Description |
|------|-------|-------------|
| `toilettes` | 🚻 | Toilettes publiques |
| `parking` | 🅿️ | Parking / Stationnement |
| `restaurant` | 🍽️ | Restaurant / Café |
| `shop` | 🛍️ | Boutique / Commerce |
| `other` | 📍 | Autre point d'intérêt |

## Structure de Données

### Table: `points_of_interest`

```sql
{
  id: UUID (primary key)
  name: TEXT (required)
  description: TEXT
  latitude: DECIMAL(10, 8)
  longitude: DECIMAL(11, 8)
  type: TEXT ['toilettes', 'parking', 'restaurant', 'shop', 'other']
  visible: BOOLEAN (default: true)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

## Fichiers du Projet

```
src/
├── lib/
│   └── poiDb.ts                          # CRUD Supabase
├── components/
│   ├── Map.tsx                           # Composant Leaflet
│   └── MapSection.tsx                    # Section avec filtres
├── pages/
│   ├── AboutPage.tsx                     # Modified - imports MapSection
│   └── admin/
│       └── PointsOfInterestManager.tsx   # Admin interface
└── index.css                             # Styles Leaflet

database/
└── points_of_interest.sql               # Migration
```

## Sécurité

1. **Lecture Publique** - Les POIs visibles sont publics (RLS Policy)
2. **Écriture Admin** - Seuls les admins peuvent modifier
3. **Validation** - Le système valide les coordonnées

## Troubleshooting

### La carte n'apparaît pas

1. Vérifiez que Leaflet CSS est chargé (dans index.css)
2. Vérifiez la table Supabase existe
3. Ouvrez la console pour les erreurs

### Les coordonnées ne s'extraient pas

1. Utilisez: `33.5731, -7.5898`
2. Pas de texte supplémentaire
3. Utilisez `.` comme séparateur décimal

### Les POIs n'apparaissent pas sur la carte

1. Vérifiez `visible: true` dans la BD
2. Rafraîchissez la page
3. Vérifiez les droits RLS

## API

### `poiDb.ts`

```typescript
// Récupérer les POIs visibles
const pois = await getPOIs();

// Récupérer TOUS les POIs (admin)
const allPois = await getAllPOIs();

// Créer
await createPOI({
  name: "Toilettes",
  description: "Toilettes propres",
  latitude: 33.5731,
  longitude: -7.5898,
  type: "toilettes",
  visible: true
});

// Modifier
await updatePOI(id, { visible: false });

// Supprimer
await deletePOI(id);

// Toggler visibilité
await togglePOIVisibility(id, true);
```

## Performance

- **Index BD**: Latitude, Longitude, Type, Visible
- **Chargement**: Données cachées côté client
- **Rendu**: Optimisé avec React.memo (si nécessaire)

## Futures Améliorations

- [ ] Géolocalisation automatique
- [ ] Recherche par nom
- [ ] Rayon de recherche
- [ ] Favoris utilisateur
- [ ] Horaires d'ouverture
- [ ] Images pour chaque POI
- [ ] Critères (accessibilité, gratuit, etc.)

## Support

Pour toute question, consultez les fichiers source ou contactez l'équipe de développement.
