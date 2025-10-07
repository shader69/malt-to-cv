// Configuration centralisée de l'extension Malt to CV

// Configuration des options de masquage
window.OPTIONS_CONFIG = [
  {
    key: 'hideTJM',
    title: 'Masquer le TJM',
    selector: 'ul.profile-indicators li.profile-indicators-item:has([data-testid*="profile-price"])',
    defaultValue: false
  },
  {
    key: 'hideLocation',
    title: 'Masquer la localisation',
    selector: '.profile-wrapper__profile-sidemenu section:has(.profile__location-and-workplace-preferences__wrapper)',
    defaultValue: false
  },
  {
    key: 'hideAvailability',
    title: 'Masquer la disponibilité',
    selector: '.joy-wrapper .joy-availability',
    defaultValue: true
  },
  {
    key: 'hideOtherSkills',
    title: 'Masquer les autres compétences',
    selector: '[data-testid="profile-main-skill-set"] > div:has([data-testid="profile-main-skill-set-selected-skills-list"])',
    defaultValue: false
  },
  {
    key: 'hideMaltReviews',
    title: 'Masquer les avis clients Malt',
    selector: 'section#appraisalSection [data-testid="read-more-component-content"]',
    defaultValue: false
  },
  {
    key: 'hideRecommendations',
    title: 'Masquer les recommandations',
    selector: 'section#recommendationSection ul.recommendations-list',
    defaultValue: false
  }
];

// Configuration des options d'expansion
window.EXPANSION_CONFIG = [
  {
    key: 'expandOtherSkills',
    title: 'Étendre les compétences',
    selector: 'section[data-testid*="profile-main-skill-set-section"] .profile-show-more-or-less button',
    dependsOn: 'hideOtherSkills',
    defaultValue: true
  },
  {
    key: 'expandMaltReviews',
    title: 'Étendre les avis Malt',
    selector: 'section#appraisalSection .read-more__link button',
    dependsOn: 'hideMaltReviews',
    defaultValue: true
  },
  {
    key: 'expandRecommendations',
    title: 'Étendre les recommandations',
    selector: 'section[data-testid*="recommendation-sections"] .profile-show-more-or-less button',
    dependsOn: 'hideRecommendations',
    defaultValue: true
  }
];

// Configuration des sections toujours déployées
window.ALWAYS_EXPAND_SELECTORS = [
  {
    title: 'Description',
    selector: 'section[data-testid*="profile-description"] .read-more__link button'
  },
  {
    title: 'Expériences',
    selector: 'section[data-testid*="profile-experience-section"] .profile-show-more-or-less button'
  },
  {
    title: 'Formations',
    selector: 'section .read-more__link:has(#education-section) button'
  }
];

// Génération automatique des options par défaut à partir de la config
window.DEFAULT_OPTIONS = {};
[...window.OPTIONS_CONFIG, ...window.EXPANSION_CONFIG].forEach(option => {
  window.DEFAULT_OPTIONS[option.key] = option.defaultValue;
});
