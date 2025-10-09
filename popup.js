// Gestion des options de personnalisation
const options = { ...getDefaultOptions() };

// Générer l'interface dynamiquement
function generateInterface() {
  const optionsContainer = document.getElementById('optionsContainer');
  
  SECTIONS_CONFIG.forEach(section => {
    // Filtrer les options visibles (non cachées)
    const visibleOptions = section.options.filter(opt => !opt.hidden);
    
    // Si la section n'a aucune option visible, ne pas l'afficher
    if (visibleOptions.length === 0) {
      return;
    }
    
    // Créer une section
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'option-group';
    
    // Créer le titre de la section
    const sectionTitle = document.createElement('label');
    sectionTitle.textContent = section.title;
    sectionDiv.appendChild(sectionTitle);
    
    // Créer le conteneur des checkboxes
    const checkboxGroup = document.createElement('div');
    checkboxGroup.className = 'checkbox-group';
    
    // Ajouter les options visibles de la section
    visibleOptions.forEach(config => {
      const checkboxItem = document.createElement('div');
      checkboxItem.className = 'checkbox-item';
      checkboxItem.innerHTML = `
        <input type="checkbox" id="${config.key}">
        <label for="${config.key}">${config.title}</label>
      `;
      checkboxGroup.appendChild(checkboxItem);
    });
    
    sectionDiv.appendChild(checkboxGroup);
    optionsContainer.appendChild(sectionDiv);
  });
}

// Charger les options sauvegardées
document.addEventListener('DOMContentLoaded', async () => {
  // Vérifier qu'on est sur un profil Malt avec ?overview AVANT de générer l'interface
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url.includes('malt.fr/profile/')) {
    showStatus('❌ Veuillez ouvrir un profil Malt d\'abord', 'error');
    document.getElementById('optionsContainer').style.display = 'none';
    document.getElementById('generateBtn').style.display = 'none';
    
    // Afficher le bouton pour aller au profil
    const actionBtn = document.createElement('button');
    actionBtn.className = 'action-btn';
    actionBtn.textContent = '👤 Aller à mon profil';
    actionBtn.addEventListener('click', () => {
      chrome.tabs.update(tab.id, { url: 'https://www.malt.fr/profile' });
      window.close();
    });
    document.getElementById('actionBtnContainer').appendChild(actionBtn);
    return;
  }
  
  if (!tab.url.endsWith('?overview')) {
    showStatus('❌ Veuillez cliquer sur "Voir mon profil en tant que client"', 'error');
    document.getElementById('optionsContainer').style.display = 'none';
    document.getElementById('generateBtn').style.display = 'none';
    
    // Afficher le bouton pour voir en tant que client
    const actionBtn = document.createElement('button');
    actionBtn.className = 'action-btn';
    actionBtn.textContent = '👁️ Voir en tant que client';
    actionBtn.addEventListener('click', () => {
      const newUrl = tab.url + '?overview';
      chrome.tabs.update(tab.id, { url: newUrl });
      window.close();
    });
    document.getElementById('actionBtnContainer').appendChild(actionBtn);
    return;
  }
  
  // Tout est bon, on peut générer l'interface
  generateInterface();
  
  // Attacher les gestionnaires d'événements
  attachEventListeners();
  
  const savedOptions = await chrome.storage.local.get('maltToCvOptions');
  if (savedOptions.maltToCvOptions) {
    Object.assign(options, savedOptions.maltToCvOptions);
    updateUI();
  }
  
  // Appliquer la surbrillance dès l'ouverture
  updateHighlighting();
});

// Mettre à jour l'interface selon les options
function updateUI() {
  // Mettre à jour toutes les options de toutes les sections
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      const element = document.getElementById(config.key);
      if (element) {
        element.checked = options[config.key];
      }
    });
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
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      // Ne traiter que les options d'expansion qui ont une dépendance
      if (config.type === 'expand' && config.dependsOn) {
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
      }
    });
  });
}

// Fonction pour attacher les gestionnaires d'événements
function attachEventListeners() {
  // Gestionnaires pour toutes les options de toutes les sections
  SECTIONS_CONFIG.forEach(section => {
    section.options.forEach(config => {
      const element = document.getElementById(config.key);
      if (element) {
        element.addEventListener('change', (e) => {
          options[config.key] = e.target.checked;
          
          // Mettre à jour les options d'expansion si c'est une option de masquage
          if (config.type === 'hide') {
            updateExpandOptions();
          }
          
          saveOptions();
          // Mettre à jour la surbrillance
          updateHighlighting();
        });
      }
    });
  });
}

// Fonction pour surligner les éléments sur la page
async function highlightElements(selector) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes('malt.fr/profile/')) {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'highlightElements',
        selector: selector
      });
    }
  } catch (error) {
    // Erreur silencieuse
  }
}

// Fonction pour retirer la surbrillance
async function removeHighlighting() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes('malt.fr/profile/')) {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'removeHighlighting'
      });
    }
  } catch (error) {
    // Erreur silencieuse
  }
}

// Fonction pour mettre à jour la surbrillance selon les options cochées
async function updateHighlighting() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes('malt.fr/profile/')) {
      await chrome.tabs.sendMessage(tab.id, {
        action: 'updateHighlighting',
        options: options
      });
    }
  } catch (error) {
    // Erreur silencieuse
  }
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
    
    // Récupérer l'onglet actif
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
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
