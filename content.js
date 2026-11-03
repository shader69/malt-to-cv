// Écouter les messages du popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ping') {
    // Répondre au ping pour confirmer que le content script est chargé
    sendResponse({ status: 'ready' });
    return true;
  }
  
  if (message.action === 'generatePDF') {
    generatePDF(message.options);
  }
  
  if (message.action === 'highlightElements') {
    highlightElementsOnPage(message.selector);
  }
  
  if (message.action === 'removeHighlighting') {
    removeHighlightingFromPage();
  }
  
  if (message.action === 'updateHighlighting') {
    updateHighlightingOnPage(message.options);
  }
});

// Fonction pour détecter si le profil est accessible
function isProfileAccessible() {
  // Vérifier s'il y a des éléments de restriction
  const restrictedElements = document.querySelectorAll('[data-testid*="restricted"], .restricted, [class*="restricted"]');
  const errorMessages = document.querySelectorAll('[data-testid*="error"], .error, [class*="error"]');
  
  return restrictedElements.length === 0 && errorMessages.length === 0;
}

// Fonction principale pour générer le PDF
async function generatePDF(options) {
  try {
    console.log('📄 Début de la génération PDF avec options:', options);
    
    // Vérifier l'accessibilité du profil
    if (!isProfileAccessible()) {
      throw new Error('Profil non accessible ou restreint');
    }
    
    // Déployer les sections selon les options
    expandSections(options);
    
    // Appliquer les options de masquage
    applyHidingOptions(options);
    
    // Masquer tous les conteneurs d'expansion
    hideExpansionContainers();
    
    // Appliquer le style CV
    applyCVStyle();
    
    // Attendre un peu pour que les styles s'appliquent
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Générer le PDF avec l'API d'impression de Chrome
    await generatePDFWithChromePrint();
    
    // Notifier le popup
    chrome.runtime.sendMessage({ action: 'pdfGenerated' });
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération PDF:', error);
    chrome.runtime.sendMessage({ action: 'pdfError', error: error.message });
  }
}

// Fonction générique pour déployer les sections selon les options
function expandSections(options) {
  console.log('📖 Déploiement des sections selon les options:', options);
  
  // Déployer toutes les sections d'expansion selon les options
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      // Ne traiter que les options d'expansion
      if (config.type === 'expand') {
        const shouldExpand = options[config.key];
        const isNotHidden = !config.dependsOn || !options[config.dependsOn];
        
        if (shouldExpand && isNotHidden) {
          const containers = document.querySelectorAll(config.selector);
          containers.forEach(container => {
            // Chercher un bouton ou un lien d'expansion
            let button;
            if (['a', 'button'].includes(container.tagName.toLowerCase())) {
              button = container;
            } else {
              button = container.querySelector('a, button');
            }
            if (button) {
              button.click();
            }
          });
        }
      }
    });
  });
}

// Fonction générique pour appliquer les options de masquage
function applyHidingOptions(options) {
  console.log('🔧 Application des options de masquage:', options);
  
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      // Ne traiter que les options de masquage
      if (config.type === 'hide' && options[config.key]) {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach(el => {
          el.style.display = 'none';
        });
      }
    });
  });
}

// Fonction pour masquer tous les conteneurs d'expansion
function hideExpansionContainers() {
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      // Ne traiter que les options d'expansion
      if (config.type === 'expand') {
        const containers = document.querySelectorAll(config.selector);
        containers.forEach(container => {
          container.style.display = 'none';
        });
      }
    });
  });
}

// Fonction pour appliquer le style CV
function applyCVStyle() {
  // Ajouter la classe à la page pour activer les styles CSS
  document.body.classList.add('malt-to-cv-export');
}

// Fonction pour générer le PDF avec l'API d'impression de Chrome
async function generatePDFWithChromePrint() {
  try {
    // Attendre un peu pour que les styles CSS s'appliquent
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Utiliser l'API d'impression de Chrome
    window.print();
    
    console.log('✅ Impression lancée avec succès');
    
    // Nettoyer après impression (avec un délai pour laisser le temps à l'impression)
    setTimeout(() => {
      cleanup();
    }, 500);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'impression:', error);
    throw error;
  }
}

// Fonction pour nettoyer après l'export
function cleanup() {
  console.log('🧹 Nettoyage après export');
  
  // Retirer la classe d'export
  document.body.classList.remove('malt-to-cv-export');
  
  // Restaurer tous les éléments masqués via les options
  restoreHiddenElements();
  
  // Retirer toute la surbrillance
  removeHighlightingFromPage();
}

// Fonction générique pour restaurer les éléments masqués
function restoreHiddenElements() {
  console.log('🔄 Restauration des éléments masqués');
  
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      const elements = document.querySelectorAll(config.selector);
      elements.forEach(el => {
        el.style.display = '';
      });
    });
  });
}

// Fonction pour surligner les éléments sur la page
function highlightElementsOnPage(selector) {
  // Retirer d'abord toute surbrillance existante
  removeHighlightingFromPage();
  
  try {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add('highlight-to-hide');
    });
  } catch (error) {
    // Erreur silencieuse
  }
}

// Fonction pour retirer la surbrillance de la page
function removeHighlightingFromPage() {
  const highlightedElements = document.querySelectorAll('.highlight-to-hide, .highlight-to-expand');
  highlightedElements.forEach(el => {
    el.classList.remove('highlight-to-hide');
    el.classList.remove('highlight-to-expand');
  });
}

// Fonction pour mettre à jour la surbrillance selon les options
function updateHighlightingOnPage(options) {
  // Retirer toute surbrillance existante
  removeHighlightingFromPage();
  
  // Appliquer la surbrillance rouge pour les options cochées (masquage)
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      // Ne traiter que les options de masquage
      if (config.type === 'hide' && options[config.key]) {
        try {
          const elements = document.querySelectorAll(config.selector);
          elements.forEach(el => {
            el.classList.add('highlight-to-hide');
          });
        } catch (error) {
          // Erreur silencieuse
        }
      }
    });
  });
  
  // Appliquer la surbrillance verte pour les sections qui seront étendues
  highlightExpandableSections(options);
}

// Fonction pour surligner les sections qui vont être étendues
function highlightExpandableSections(options) {
  // Surligner toutes les sections d'expansion selon les options
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      // Ne traiter que les options d'expansion
      if (config.type === 'expand') {
        const shouldExpand = options[config.key];
        const isNotHidden = !config.dependsOn || !options[config.dependsOn];
        
        if (shouldExpand && isNotHidden) {
          try {
            const containers = document.querySelectorAll(config.selector);
            containers.forEach(container => {
              container.classList.add('highlight-to-expand');
            });
          } catch (error) {
            // Erreur silencieuse
          }
        }
      }
    });
  });
}
