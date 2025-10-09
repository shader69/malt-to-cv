# 🎯 Malt to CV - Extension Chrome

Transforme ton profil Malt en CV PDF personnalisé !

## 🚀 Installation

1. Télécharge ou clone ce repository
2. Ouvre Chrome et va dans `chrome://extensions/`
3. Active le "Mode développeur" (en haut à droite)
4. Clique sur "Charger l'extension non empaquetée"
5. Sélectionne le dossier de l'extension

## 📋 Utilisation

1. Va sur un profil Malt (ex: https://www.malt.fr/profile/axelschapmann)
2. Clique sur l'icône de l'extension dans la barre d'outils
3. Configure tes options de personnalisation :
   - ✅ Masquer le TJM
   - ✅ Masquer la localisation
   - ✅ Masquer la disponibilité
   - ✅ Masquer les autres compétences
   - ✅ Masquer les avis clients Malt
   - ✅ Masquer les recommandations
4. Clique sur "Générer le CV PDF"
5. Le PDF se télécharge automatiquement !

## 🛠️ Développement

### Structure du projet

```
├── manifest.json          # Configuration de l'extension
├── config.js              # Configuration centralisée
├── popup.html             # Interface de l'extension (dynamique)
├── popup.js               # Logique du popup (génération automatique)
├── content.js             # Script qui s'exécute sur les pages Malt
├── content.css            # Styles pour l'export
├── background.js          # Service Worker
└── README.md              # Ce fichier
```

### Architecture dynamique

L'extension utilise un **système de configuration centralisé** basé sur des sections thématiques :

#### **`config.js` - Configuration centralisée**
```javascript
// Configuration organisée par sections
window.SECTIONS_CONFIG = [
  {
    title: "📋 En tête de page",
    options: [
      {
        key: 'hideTJM',
        type: 'hide',
        title: 'Masquer le TJM',
        selector: 'ul.profile-indicators li.profile-indicators-item:has([data-testid*="profile-price"])',
        defaultValue: false
      },
      // ... autres options
    ]
  },
  {
    title: "🎯 Compétences",
    options: [
      {
        key: 'hideOtherSkills',
        type: 'hide',
        title: 'Masquer les autres compétences',
        selector: '[data-testid="profile-main-skill-set"]',
        defaultValue: false
      },
      {
        key: 'expandOtherSkills',
        type: 'expand',
        title: 'Étendre les compétences',
        selector: 'section[data-testid*="profile-main-skill-set-section"] .profile-show-more-or-less',
        dependsOn: 'hideOtherSkills',
        defaultValue: true
      }
    ]
  },
  // ... autres sections
];
```

### Fonctionnalités

- ✅ **Interface par sections** : Options organisées en sections thématiques
- ✅ **Interface dynamique** : Générée automatiquement depuis `config.js`
- ✅ **Options centralisées** : Un seul endroit pour tout modifier
- ✅ **Options masquables** : Paramètre `hidden` pour les options automatiques
- ✅ **Dépendances automatiques** : Les options d'expansion se grisent si la section est masquée
- ✅ **Masquage automatique** : Les conteneurs d'expansion sont masqués lors de la génération PDF
- ✅ **Détection automatique** des profils Malt
- ✅ **Génération PDF** avec l'API d'impression Chrome
- ✅ **Sauvegarde des préférences** avec Chrome Storage API
- ✅ **Logs détaillés** pour le débogage

### Technologies utilisées

- **Manifest V3** : Dernière version des extensions Chrome
- **API d'impression Chrome** : Génération PDF native (plus fiable que html2pdf.js)
- **Chrome Storage API** : Sauvegarde des options
- **Chrome Tabs API** : Communication entre popup et content script
- **Variables globales** : Configuration partagée entre tous les scripts

## 🔧 Personnalisation

### Ajouter une nouvelle option

**1. Choisir ou créer une section dans `config.js` :**
```javascript
{
  title: "🎯 Ma nouvelle section",
  options: [
    // Option de masquage
    {
      key: 'hideNewElement',
      type: 'hide',
      title: 'Masquer nouvel élément',
      selector: '.mon-selector-css',
      defaultValue: false
    },
    // Option d'expansion (si applicable)
    {
      key: 'expandNewElement',
      type: 'expand',
      title: 'Étendre nouvel élément',
      selector: '.mon-conteneur-bouton',  // Pointer vers le conteneur, pas le bouton
      dependsOn: 'hideNewElement',  // Optionnel : dépendance
      defaultValue: true
    },
    // Option cachée (non visible dans le popup)
    {
      key: 'autoHideElement',
      type: 'hide',
      title: 'Masquer automatiquement',
      selector: '.element-a-masquer',
      defaultValue: true,
      hidden: true  // Ne s'affiche pas dans le popup
    }
  ]
}
```

**2. C'est tout !** 🎉
- ✅ L'interface se génère automatiquement par section
- ✅ Les gestionnaires d'événements s'attachent automatiquement
- ✅ Les dépendances sont gérées automatiquement
- ✅ Les options par défaut sont mises à jour automatiquement
- ✅ Les sections vides (toutes les options `hidden`) ne s'affichent pas

### Avantages de l'architecture

- **Unique source de vérité** : `SECTIONS_CONFIG` contrôle tout (UI, logique, masquage)
- **Organisation par sections** : Options regroupées par thème dans le popup
- **Évolutif** : Ajouter des options en quelques lignes
- **Flexible** : Options masquables avec le paramètre `hidden`
- **Automatique** : Masquage des conteneurs d'expansion géré par la config

## 🐛 Dépannage

- **L'extension ne se charge pas** : Vérifie que tu es sur un profil Malt
- **Le PDF ne se génère pas** : Vérifie la console pour les erreurs
- **Les options ne se sauvegardent pas** : Vérifie les permissions de l'extension
- **Interface vide** : Vérifie que `config.js` est bien chargé
- **Options ne se grisent pas** : Vérifie les `dependsOn` dans `config.js`

## 📝 Notes

- L'extension fonctionne uniquement sur les profils Malt
- Les options sont sauvegardées localement
- Le PDF est généré côté client (pas d'envoi de données)
