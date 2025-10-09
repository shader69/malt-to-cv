// Configuration centralisée de l'extension Malt to CV

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
      {
        key: 'hideAvailability',
        type: 'hide',
        title: 'Masquer la disponibilité',
        selector: '.joy-wrapper .joy-availability',
        defaultValue: true
      }
    ]
  },
  {
    title: "Panneau latéral",
    options: [
      {
        key: 'hideLocation',
        type: 'hide',
        title: 'Masquer la localisation',
        selector: '.profile-wrapper__profile-sidemenu section:has(.profile__location-and-workplace-preferences__wrapper)',
        defaultValue: false
      },
      {
        key: 'hideInfluence',
        type: 'hide',
        title: 'Masquer la réputation en ligne',
        selector: '.profile-wrapper__profile-sidemenu section[data-testid="profile-reputation"]',
        defaultValue: false
      },
      {
        key: 'hideLanguages',
        type: 'hide',
        title: 'Masquer les langues',
        selector: '.profile-wrapper__profile-sidemenu section[data-testid="languages-section"]',
        defaultValue: false
      },
      {
        key: 'hideCategories',
        type: 'hide',
        title: 'Masquer les catégories',
        selector: '.profile-wrapper__profile-sidemenu section[data-testid="categories-section"]',
        defaultValue: false
      }
    ]
  },
  {
    title: "🎯 Compétences",
    options: [
      {
        key: 'hideOtherSkills',
        type: 'hide',
        title: 'Masquer les autres compétences',
        selector: '[data-testid="profile-main-skill-set"] > div:has([data-testid="profile-main-skill-set-selected-skills-list"])',
        defaultValue: false
      },
      {
        key: 'expandOtherSkills',
        type: 'expand',
        title: 'Étendre les compétences',
        selector: 'section[data-testid*="profile-main-skill-set-section"] .profile-show-more-or-less button',
        dependsOn: 'hideOtherSkills',
        defaultValue: true
      }
    ]
  },
  {
    title: "⭐ Avis & recommandations",
    options: [
      {
        key: 'hideMaltReviews',
        type: 'hide',
        title: 'Masquer les avis clients Malt',
        selector: 'section#appraisalSection [data-testid="read-more-component-content"]',
        defaultValue: false
      },
      {
        key: 'expandMaltReviews',
        type: 'expand',
        title: 'Étendre les avis Malt',
        selector: 'section#appraisalSection .read-more__link button',
        dependsOn: 'hideMaltReviews',
        defaultValue: true
      },
      {
        key: 'hideRecommendations',
        type: 'hide',
        title: 'Masquer les recommandations externes',
        selector: 'section#recommendationSection ul.recommendations-list',
        defaultValue: false
      },
      {
        key: 'expandRecommendations',
        type: 'expand',
        title: 'Étendre les recommandations externes',
        selector: 'section[data-testid*="recommendation-sections"] .profile-show-more-or-less button',
        dependsOn: 'hideRecommendations',
        defaultValue: true
      }
    ]
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

// Fonction utilitaire pour obtenir les options par défaut
window.getDefaultOptions = function() {
  const defaults = {};
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(option => {
      defaults[option.key] = option.defaultValue;
    });
  });
  return defaults;
};
