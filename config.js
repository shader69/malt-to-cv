// Configuration centralisée de l'extension Malt to CV

// Configuration des options de masquage
window.OPTIONS_CONFIG = [
  {
    key: 'hideTJM',
    title: 'Masquer le TJM',
    selector: 'ul.profile-indicators li.profile-indicators-item:has([data-testid*="profile-price"])'
  },
  {
    key: 'hideLocation',
    title: 'Masquer la localisation',
    selector: '.profile-wrapper__profile-sidemenu section:has(.profile__location-and-workplace-preferences__wrapper)'
  },
  {
    key: 'hideAvailability',
    title: 'Masquer la disponibilité',
    selector: '[data-testid*="availability"], .availability, [class*="availability"]'
  },
  {
    key: 'hideOtherSkills',
    title: 'Masquer les autres compétences',
    selector: '[data-testid="profile-main-skill-set"] > div:has([data-testid="profile-main-skill-set-selected-skills-list"])'
  },
  {
    key: 'hideMaltReviews',
    title: 'Masquer les avis clients Malt',
    selector: 'section#appraisalSection [data-testid="read-more-component-content"]'
  },
  {
    key: 'hideRecommendations',
    title: 'Masquer les recommandations',
    selector: 'section#recommendationSection ul.recommendations-list'
  }
];

// Configuration des options d'expansion
window.EXPANSION_CONFIG = [
  {
    key: 'expandOtherSkills',
    title: 'Étendre les compétences',
    selector: 'section[data-testid*="profile-main-skill-set-section"] .profile-show-more-or-less button',
    dependsOn: 'hideOtherSkills'
  },
  {
    key: 'expandMaltReviews',
    title: 'Étendre les avis Malt',
    selector: 'section#appraisalSection .read-more__link button',
    dependsOn: 'hideMaltReviews'
  },
  {
    key: 'expandRecommendations',
    title: 'Étendre les recommandations',
    selector: 'section[data-testid*="recommendation-sections"] .profile-show-more-or-less button',
    dependsOn: 'hideRecommendations'
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

// Options par défaut
window.DEFAULT_OPTIONS = {
  hideTJM: false,
  hideLocation: false,
  hideAvailability: true,
  hideOtherSkills: false,
  hideMaltReviews: false,
  hideRecommendations: false,
  expandOtherSkills: true,
  expandMaltReviews: true,
  expandRecommendations: true
};
