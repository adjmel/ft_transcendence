// cachebust.js
export var cacheBust = 0;
// Fonction pour obtenir la valeur actuelle du cache busting
export function getCacheBustValue() {
    if (!cacheBust) {
        cacheBust = '1'; // Valeur initiale si aucune valeur n'existe
    }
    return cacheBust;
}

// Fonction pour incrémenter la valeur du cache busting
export function incrementCacheBust() {
    cacheBust += 1;
}
