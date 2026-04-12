# Feature: Articles & Activités Principales (Featured Items)

## 📋 Résumé

Cette fonctionnalité permet de marquer les **activités** et **articles** comme "**principaux**" pour les afficher en première page avec différents styles. L'ordre est automatique (plus récent d'abord) et l'image utilisée est celle de l'article/activité lui-même.

---

## 🎯 Utilisation Simple

### Pour les Activités
1. Allez dans **Admin → Gestion du contenu → Activités**
2. Créez ou modifiez une activité
3. Cochez **"⭐ Afficher en première page (principal)"**
4. Choisissez un style d'affichage (optionnel):
   - **card** = Carte standard
   - **hero** = Grand format
   - **grid** = Grille minimaliste
   - **carousel** = Défilement horizontal
5. Sauvegardez ✅

### Pour les Articles
1. Allez dans **Admin → Gestion du contenu → Articles**
2. Créez ou modifiez un article
3. Cochez **"⭐ Afficher en première page (principal)"**
4. Choisissez un style
5. Sauvegardez ✅

---

## 🖼️ Images

L'image utilisée est **automatiquement** celle de l'article/activité. Pas besoin d'en ajouter une autre !

---

## 📊 Fonctionnement

- **Tri automatique** : Plus récent d'abord (créé en dernier)
- **Aucun ordre manuel** : Supprimé pour simplifier
- **Images automatiques** : Utilise l'image existante de l'objet
- **Responsive** : Adapté mobile, tablette, desktop

---

## 🎨 Styles d'Affichage

| Style | Taille | Usage |
|-------|--------|-------|
| **card** | Moyen | Par défaut, carte simple |
| **hero** | Très grand (16:9) | Items champions |
| **carousel** | Moyen | Défilement horizontal |
| **grid** | Petit (carré) | Grille compacte |

---

## 📍 Affichage sur la Page

La section s'affiche **entre "Notre Collection Globale" et "Journal Exclusif"** avec :
- ✅ Hero items s'ils existent
- ✅ Carrousel (horizontal)
- ✅ Grille (3 colonnes sur desktop)
- ✅ Cartes (avec "Charger plus")

Si aucun item n'est marqué comme principal = la section ne s'affiche pas.

---

## ✨ Exemple

**Créez une activité:**
- Titre: "Bivouac VIP désert"
- Cochez ☑️ "Afficher en première page"
- Style: "hero"
- Sauvegardez

**Résultat:** L'activité apparaît en grand en première page automatiquement !

---

## 📝 Notes

- Les items non-marked ne sont pas affectés
- Pas limite de nombre d'items principaux
- Pas besoin de gérer l'ordre (automatique)
- Pas besoin d'ajouter d'images supplémentaires

---

**Statut:** ✅ Production Ready  
**Simplifié:** Ordre auto, images auto  
**Créé:** Avril 12, 2026

