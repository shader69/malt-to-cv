// Gestion des options de personnalisation
const options = { ...DEFAULT_OPTIONS };

// Générer l'interface dynamiquement
function generateInterface() {
  // Générer les options de masquage
  const hideOptionsContainer = document.getElementById('hideOptions');
  OPTIONS_CONFIG.forEach(config => {
    const checkboxItem = document.createElement('div');
    checkboxItem.className = 'checkbox-item';
    checkboxItem.innerHTML = `
      <input type="checkbox" id="${config.key}">
      <label for="${config.key}">${config.title}</label>
    `;
    hideOptionsContainer.appendChild(checkboxItem);
  });

  // Générer les options d'expansion
  const expandOptionsContainer = document.getElementById('expandOptions');
  EXPANSION_CONFIG.forEach(config => {
    const checkboxItem = document.createElement('div');
    checkboxItem.className = 'checkbox-item';
    checkboxItem.innerHTML = `
      <input type="checkbox" id="${config.key}">
      <label for="${config.key}">${config.title}</label>
    `;
    expandOptionsContainer.appendChild(checkboxItem);
  });
}

// Charger les options sauvegardées
document.addEventListener('DOMContentLoaded', async () => {
  // Générer l'interface d'abord
  generateInterface();
  
  // Attacher les gestionnaires d'événements
  attachEventListeners();
  
  const savedOptions = await chrome.storage.local.get('maltToCvOptions');
  if (savedOptions.maltToCvOptions) {
    Object.assign(options, savedOptions.maltToCvOptions);
    updateUI();
  }
});

// Mettre à jour l'interface selon les options
function updateUI() {
  // Mettre à jour toutes les options de masquage
  OPTIONS_CONFIG.forEach(config => {
    const element = document.getElementById(config.key);
    if (element) {
      element.checked = options[config.key];
    }
  });

  // Mettre à jour toutes les options d'expansion
  EXPANSION_CONFIG.forEach(config => {
    const element = document.getElementById(config.key);
    if (element) {
      element.checked = options[config.key];
    }
  });
  
  // Désactiver les options d'expansion si les sections sont masquées
  updateExpandOptions();
}

// Sauvegarder les options
async function saveOptions() {
  await chrome.storage.local.set({ maltToCvOptions: options });
}

// Fonction pour mettre à jour les options d'expansion
function updateExpandOptions() {
  EXPANSION_CONFIG.forEach(config => {
    const expandElement = document.getElementById(config.key);
    const hideElement = document.getElementById(config.dependsOn);
    
    if (expandElement && hideElement) {
      // Désactiver l'expansion si la section est masquée
      if (options[config.dependsOn]) {
        expandElement.disabled = true;
        expandElement.checked = false;
        options[config.key] = false;
      } else {
        expandElement.disabled = false;
      }
    }
  });
}

// Fonction pour attacher les gestionnaires d'événements
function attachEventListeners() {
  // Gestionnaires pour les options de masquage
  OPTIONS_CONFIG.forEach(config => {
    const element = document.getElementById(config.key);
    if (element) {
      element.addEventListener('change', (e) => {
        options[config.key] = e.target.checked;
        updateExpandOptions();
        saveOptions();
      });
    }
  });

  // Gestionnaires pour les options d'expansion
  EXPANSION_CONFIG.forEach(config => {
    const element = document.getElementById(config.key);
    if (element) {
      element.addEventListener('change', (e) => {
        options[config.key] = e.target.checked;
        saveOptions();
      });
    }
  });
}

// Fonction pour afficher le statut
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

// Fonction pour vérifier que le content script est chargé
async function ensureContentScriptLoaded(tabId) {
  try {
    // Essayer d'envoyer un message ping
    await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch (error) {
    // Si le content script n'est pas chargé, l'injecter
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
      
      // Attendre un peu que le script se charge
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Vérifier à nouveau
      await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      return true;
    } catch (injectError) {
      console.error('Impossible d\'injecter le content script:', injectError);
      return false;
    }
  }
}

// Fonction pour générer le PDF
document.getElementById('generateBtn').addEventListener('click', async () => {
  const generateBtn = document.getElementById('generateBtn');
  const originalText = generateBtn.textContent;
  
  try {
    // Désactiver le bouton
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Génération...';
    
    // Vérifier qu'on est sur un profil Malt
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('malt.fr/profile/')) {
      showStatus('❌ Veuillez ouvrir un profil Malt d\'abord', 'error');
      return;
    }
    
    // S'assurer que le content script est chargé
    const isLoaded = await ensureContentScriptLoaded(tab.id);
    if (!isLoaded) {
      showStatus('❌ Impossible de charger le script sur cette page', 'error');
      return;
    }
    
    // Envoyer les options au content script
    await chrome.tabs.sendMessage(tab.id, {
      action: 'generatePDF',
      options: options
    });
    
    showStatus('✅ CV généré avec succès !', 'success');
    
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    showStatus('❌ Erreur lors de la génération du PDF', 'error');
  } finally {
    // Réactiver le bouton
    generateBtn.disabled = false;
    generateBtn.textContent = originalText;
  }
});

// Écouter les messages du content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'pdfGenerated') {
    showStatus('✅ CV PDF téléchargé !', 'success');
  } else if (message.action === 'pdfError') {
    showStatus('❌ Erreur lors de la génération du PDF', 'error');
  }
});
