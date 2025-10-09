// Service Worker pour l'extension Malt to CV
console.log('🎯 Malt to CV - Service Worker démarré');

// Charger la configuration
importScripts('config.js');

// Écouter les messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message reçu:', message);
  
  if (message.action === 'pdfGenerated') {
    console.log('✅ PDF généré avec succès');
  } else if (message.action === 'pdfError') {
    console.error('❌ Erreur PDF:', message.error);
  }
});

// Gérer l'installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installée:', details);
  
  // Initialiser les options par défaut
  chrome.storage.local.set({
    maltToCvOptions: window.getDefaultOptions()
  });
});
