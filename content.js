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
    
    showLoader();
    
    // Vérifier l'accessibilité du profil
    if (!isProfileAccessible()) {
      throw new Error('Profil non accessible ou restreint');
    }
    
    // Déployer les sections selon les options
    await expandSections(options);

    // Charger les images lazy (ex: logo Github de l'influence, tout en bas de la page)
    await loadLazyImages();

    // Appliquer les options de masquage
    applyHidingOptions(options);
    
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
    hideLoader();
    chrome.runtime.sendMessage({ action: 'pdfError', error: error.message });
  }
}

// Libellé des boutons déjà déployés : Malt n'expose aucun attribut (aria-expanded...),
// seul le texte change ("Voir plus" / "Afficher les 6 expériences" -> "Voir moins")
const COLLAPSE_LABEL_REGEX = /voir moins|réduire/i;

// Un bouton déjà déployé (ex: 2e génération sur la même page) ne doit pas être recliqué :
// ça replierait la section
function isAlreadyExpanded(button) {
  return COLLAPSE_LABEL_REGEX.test(button.textContent);
}

// Fonction générique pour déployer les sections selon les options
// Se fait en plusieurs passes : déployer une liste ("Afficher les 6 expériences")
// fait apparaître de nouveaux éléments, qui ont chacun leur propre bouton
// "Voir plus" à cliquer à la passe suivante.
async function expandSections(options) {
  console.log('📖 Déploiement des sections selon les options:', options);
  
  const MAX_PASSES = 5;
  const PASS_DELAY_MS = 400;
  // Boutons déjà cliqués : après un clic, "Voir plus" devient "Voir moins"
  // sur le même élément, il ne faut surtout pas le re-cliquer
  const alreadyClicked = new WeakSet();
  
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let clickCount = 0;
    
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
              if (button && !alreadyClicked.has(button) && !isAlreadyExpanded(button)) {
                alreadyClicked.add(button);
                button.click();
                clickCount++;
              }
            });
          }
        }
      });
    });
    
    // Plus rien de nouveau à déployer
    if (clickCount === 0) {
      break;
    }
    
    // Laisser le temps à la page d'afficher les nouveaux éléments
    await new Promise(resolve => setTimeout(resolve, PASS_DELAY_MS));
  }
}

// Les images en loading="lazy" ne se chargent que quand on scrolle jusqu'à elles :
// celles du bas de page sont absentes du PDF si on n'a pas scrollé jusque-là
async function loadLazyImages() {
  const LOAD_TIMEOUT_MS = 3000;
  const images = Array.from(document.querySelectorAll('img[loading="lazy"]'));

  const loadings = images.map(img => {
    img.loading = 'eager';
    if (img.complete) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });

  await Promise.race([
    Promise.all(loadings),
    new Promise(resolve => setTimeout(resolve, LOAD_TIMEOUT_MS))
  ]);
}

// Les règles sont injectées dans une feuille de style plutôt que posées en
// style inline / classes : Malt utilise des règles !important et re-rend ses
// composants (Vue) de façon asynchrone, ce qui écrasait les modifications
// faites directement sur les éléments.
const DYNAMIC_STYLE_ID = 'malt-to-cv-dynamic-style';
const dynamicState = { highlightOptions: null, exportOptions: null };

// Rouge / vert du design system de Malt, comme les cases à cocher du popup
const HIGHLIGHT_HIDE_CSS = 'background-color: rgba(224, 45, 45, 0.15) !important; border: 2px solid rgba(224, 45, 45, 0.6) !important; border-radius: 4px !important; box-shadow: 0 0 10px rgba(224, 45, 45, 0.3) !important;';
const HIGHLIGHT_EXPAND_CSS = 'background-color: rgba(129, 185, 40, 0.15) !important; border: 2px solid rgba(129, 185, 40, 0.6) !important; border-radius: 4px !important; box-shadow: 0 0 10px rgba(129, 185, 40, 0.3) !important;';

function renderDynamicStyle() {
  let styleEl = document.getElementById(DYNAMIC_STYLE_ID);
  const rules = [];

  const exportOptions = dynamicState.exportOptions;
  const highlightOptions = dynamicState.highlightOptions;

  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      if (exportOptions) {
        const hide = config.type === 'hide' && exportOptions[config.key];
        // Les conteneurs d'expansion sont toujours masqués dans le PDF
        if (hide || config.type === 'expand') {
          rules.push(`html body.malt-to-cv-export :is(${config.selector}) { display: none !important; }`);
        }
      } else if (highlightOptions) {
        const checked = highlightOptions[config.key];
        if (config.type === 'hide' && checked) {
          rules.push(`html body :is(${config.selector}) { ${HIGHLIGHT_HIDE_CSS} }`);
        } else if (config.type === 'expand' && checked && (!config.dependsOn || !highlightOptions[config.dependsOn])) {
          rules.push(`html body :is(${config.selector}) { ${HIGHLIGHT_EXPAND_CSS} }`);
        }
      }
    });
  });

  if (!rules.length) {
    if (styleEl) styleEl.remove();
    return;
  }
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = DYNAMIC_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = rules.join(' ');
}

// Fonction générique pour appliquer les options de masquage
function applyHidingOptions(options) {
  console.log('🔧 Application des options de masquage:', options);
  dynamicState.exportOptions = options;
  renderDynamicStyle();
}

const LOADER_ID = 'malt-to-cv-loader';

// Loader central avec flou d'arrière-plan pendant la préparation de la page
// (les styles sont dans content.css)
function showLoader() {
  if (document.getElementById(LOADER_ID)) {
    return;
  }
  
  const loader = document.createElement('div');
  loader.id = LOADER_ID;
  loader.className = 'malt-to-cv-loader';
  loader.setAttribute('role', 'status');
  loader.innerHTML = `
    <div class="malt-to-cv-loader__spinner"></div>
    <div>Génération du PDF…</div>
  `;
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById(LOADER_ID);
  if (loader) {
    loader.remove();
  }
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
    
    // Retirer le loader pour qu'il n'apparaisse pas dans le PDF
    hideLoader();
    
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
  
  // Retirer les règles de masquage et la surbrillance
  dynamicState.exportOptions = null;
  dynamicState.highlightOptions = null;
  renderDynamicStyle();
}

// Fonction pour retirer la surbrillance de la page
function removeHighlightingFromPage() {
  dynamicState.highlightOptions = null;
  renderDynamicStyle();
}

// Fonction pour mettre à jour la surbrillance selon les options
// (rouge : masquage, vert : expansion)
function updateHighlightingOnPage(options) {
  dynamicState.highlightOptions = options;
  renderDynamicStyle();
}
