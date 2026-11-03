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
        selector: 'section.profile-header-section .profile-header-section__indicators > div.price-indicator',
        defaultValue: false
      },
      {
        key: 'hideProfileActions',
        type: 'hide',
        title: 'Masquer les actions du profil',
        // selector: 'section.profile-header-section div.profile-header-section-read-only__actions',
        selector: '.profile-cta button[data-testid="contact-button-project-proposal"],.profile-cta button[data-testid="profile-instant-conversation-start-button"],section.profile-header-section button#share-profile-button',
        defaultValue: true,
        hidden: true
      },
      {
        key: 'hideAnswerRate',
        type: 'hide',
        title: 'Masquer le délai de réponse',
        selector: 'section.profile-header-section div.profile-header-section-read-only__actions .profile-cta > p.answer-time-indicator',
        defaultValue: true,
      },
      {
        key: 'hideAvailability',
        type: 'hide',
        title: 'Masquer la disponibilité',
        selector: 'section.profile-header-section div[data-testid="profile-availability-tooltip"]',
        defaultValue: true
      },
      {
        key: 'hideLocation',
        type: 'hide',
        title: 'Masquer la localisation',
        selector: 'section.profile-header-section .profile-header-section__indicators > div[data-testid="profile-location-preference-address"]',
        defaultValue: false
      }
    ]
  },
  {
    title: "👤 A propos de ...",
    options: [
      {
        key: 'expandDescription',
        type: 'expand',
        title: 'Étendre la description',
        selector: 'section#about-section div[data-testid="profile-description"] button.see-more__button',
        defaultValue: true,
        hidden: true
      },
      {
        key: 'hideLanguages',
        type: 'hide',
        title: 'Masquer les langues',
        selector: 'section#about-section div[data-testid="profile-about-section__languages"]',
        defaultValue: false
      }
    ]
  },
  {
    title: "📱 Portfolio",
    options: [
      {
        key: 'expandPortfolio',
        type: 'expand',
        title: 'Étendre le portfolio',
        selector: 'section#portfolio-section div.show-more',
        defaultValue: true,
        // hidden: true
      }
    ]
  },
  {
    title: "💼 Expériences & formations",
    options: [
       {
         key: 'expandExperiences',
         type: 'expand',
         title: 'Étendre les expériences',
         selector: 'section#experiences-section button.see-more__button, section#experiences-section div.show-more',
         defaultValue: true,
         // hidden: true
       },
       {
         key: 'expandFormations',
         type: 'expand',
         title: 'Étendre les formations',
         selector: 'section#education-section div.show-more',
         defaultValue: true,
         // hidden: true
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
        selector: 'section#appraisals-section, #navigation-section li:has(a[href="#appraisals-section"])',
        defaultValue: false
      },
      {
        key: 'expandMaltReviews',
        type: 'expand',
        title: 'Étendre les avis Malt',
        selector: 'section#appraisals-section .appraisal-section__list button.see-more__button, section#appraisals-section div.show-more-by-item-count div.show-more',
        dependsOn: 'hideMaltReviews',
        defaultValue: true
      },
      {
        key: 'hideRecommendations',
        type: 'hide',
        title: 'Masquer les recommandations externes',
        selector: 'section#recommendations-section, #navigation-section li:has(a[href="#recommendations-section"])',
        defaultValue: false
      },
      {
        key: 'expandRecommendations',
        type: 'expand',
        title: 'Étendre les recommandations externes',
        selector: 'section#recommendations-section button.see-more__button, section#recommendations-section div.show-more',
        dependsOn: 'hideRecommendations',
        defaultValue: true
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
        selector: 'section#skill-set-section',
        defaultValue: false
      },
      {
        key: 'expandOtherSkills',
        type: 'expand',
        title: 'Étendre les compétences',
        selector: 'section#skill-set-section .show-more__link > div.show-more',
        dependsOn: 'hideOtherSkills',
        defaultValue: true
      }
    ]
  },
  {
    title: "🧩 Divers",
    options: [
      {
        key: 'hideNavigation',
        type: 'hide',
        title: 'Masquer la barre de navigation',
        selector: 'div#navigation-section',
        defaultValue: false
      },
      {
        key: 'hideInfluence',
        type: 'hide',
        title: 'Masquer l\'influence',
        selector: '.profile-wrapper__content section.joy-panel[data-testid="profile-reputation"]',
        defaultValue: false
      },
      {
        key: 'hideCategories',
        type: 'hide',
        title: 'Masquer les catégories',
        selector: '.profile-wrapper__content section.joy-panel[data-testid="categories-section"]',
        defaultValue: false
      },
      {
        key: 'hideSimilarProfiles',
        type: 'hide',
        title: 'Masquer les profils similaires',
        selector: '.profile-wrapper__content section.joy-panel[data-testid="similar-profiles"]',
        defaultValue: true,
        hidden: true
      }
    ]
  }
];

// Préréglages proposés en haut du popup.
// "selected" liste les clés des options à cocher (masquage ou expansion) : toutes les autres
// options sont décochées. Les options "hidden" ne sont jamais touchées.
window.PRESETS = [
  {
    title: '💼 Version recruteur',
    selected: [
      'hideTJM', 'hideAnswerRate', 'hideAvailability', 'hideInfluence', 'hideCategories',
      'expandPortfolio', 'expandExperiences', 'expandFormations', 'expandMaltReviews',
      'expandRecommendations', 'expandOtherSkills'
    ]
  },
  {
    title: '👁️ Tout afficher',
    selected: [
      'expandPortfolio', 'expandExperiences', 'expandFormations', 'expandMaltReviews',
      'expandRecommendations', 'expandOtherSkills'
    ]
  }
];

// Taille du texte dans le PDF (zoom appliqué à la page pendant l'impression, plus petit = moins de pages)
window.PDF_ZOOM = { default: 0.77, min: 0.5, max: 1, step: 0.01 };

// Fonction utilitaire pour obtenir les options par défaut
window.getDefaultOptions = function() {
  const defaults = {};
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(option => {
      defaults[option.key] = option.defaultValue;
    });
  });
  defaults.pdfZoom = PDF_ZOOM.default;
  return defaults;
};
