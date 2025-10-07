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

L'extension utilise un **système de configuration centralisé** basé sur des tableaux d'objets :

#### **`config.js` - Configuration centralisée**
```javascript
// Options de masquage
window.OPTIONS_CONFIG = [
  {
    key: 'hideTJM',
    title: 'Masquer le TJM',
    selector: 'ul.profile-indicators li.profile-indicators-item:has([data-testid*="profile-price"])',
    defaultValue: false
  },
  // ... autres options
];

// Options d'expansion
window.EXPANSION_CONFIG = [
  {
    key: 'expandOtherSkills',
    title: 'Étendre les compétences',
    selector: 'section[data-testid*="profile-main-skill-set-section"] .profile-show-more-or-less button',
    dependsOn: 'hideOtherSkills',
    defaultValue: true
  },
  // ... autres options
];
```

### Fonctionnalités

- ✅ **Interface dynamique** : Générée automatiquement depuis `config.js`
- ✅ **Options centralisées** : Un seul endroit pour tout modifier
- ✅ **Dépendances automatiques** : Les options d'expansion se grisent si la section est masquée
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

**1. Ajouter dans `config.js` :**
```javascript
// Dans OPTIONS_CONFIG
{
  key: 'hideNewOption',
  title: 'Masquer nouvelle option',
  selector: 'nouveau-selector-css',
  defaultValue: false  // Valeur par défaut
}

// Dans EXPANSION_CONFIG (si applicable)
{
  key: 'expandNewOption',
  title: 'Étendre nouvelle option',
  selector: 'nouveau-selector-button',
  dependsOn: 'hideNewOption',
  defaultValue: true  // Valeur par défaut
}
```

**2. C'est tout !** 🎉
- ✅ L'interface se génère automatiquement
- ✅ Les gestionnaires d'événements s'attachent automatiquement
- ✅ Les dépendances sont gérées automatiquement
- ✅ Les options par défaut sont mises à jour automatiquement

### Avantages de l'architecture

- **DRY (Don't Repeat Yourself)** : Plus de code dupliqué
- **Évolutif** : Ajouter des options en 2 lignes
- **Maintenable** : Un seul endroit pour tout modifier
- **Cohérent** : Toutes les options suivent le même pattern
- **Logs automatiques** : Suivi des actions en temps réel

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
- **Architecture évolutive** : Facile d'ajouter de nouvelles fonctionnalités
- **Configuration centralisée** : Tout se gère depuis `config.js`
