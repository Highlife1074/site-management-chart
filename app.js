// ==========================================
// RIVIERA TOWER SUPERVISION - app.js
// ==========================================

// --- 1. CONFIGURATION ET VARIABLES GLOBALES ---
// Utilisation de var pour éviter l'erreur de redéclaration (SyntaxError Ligne 2987)
var PASSWORDS = {
    viewer: "1234",
    timekeeper: "time5678",
    cfo: "cfo9012",
    admin: "admin0000"
};

window.currentRole = 'viewer'; // Rôle par défaut (lecture seule)[cite: 1]
window.cardsData = []; // Structure principale contenant les équipes/superviseurs[cite: 1]
window.unassignedWorkers = []; // Ouvriers non assignés[cite: 1]
window.siteCompanies = []; // Liste des sous-traitants[cite: 1]
window.selectedTimesheets = []; // CORRECTION BUG 1 : Initialisation du tableau des sélections


// --- 2. GESTION DES CHECKBOXES (CORRECTION BUG 1) ---
// Déclaration dans window pour éviter "Uncaught ReferenceError: handleCheck is not defined"
window.handleCheck = function(checkboxElement, cardId) {
    // Récupération de l'ID via le paramètre ou l'attribut HTML
    const id = cardId || checkboxElement.value || (checkboxElement.dataset ? checkboxElement.dataset.id : null);
    if (!id) return;

    if (checkboxElement.checked) {
        if (!window.selectedTimesheets.includes(id)) {
            window.selectedTimesheets.push(id);
        }
    } else {
        window.selectedTimesheets = window.selectedTimesheets.filter(item => item !== id);
    }
};


// --- 3. FILTRES ET MULTI-SÉLECTION ---
window.getMultiSelectValues = function(selectElementId) {
    const select = document.getElementById(selectElementId);
    if (!select) return [];
    return Array.from(select.selectedOptions).map(opt => opt.value);
};

window.applyFilters = function() {
    const selectedManagers = window.getMultiSelectValues('managerSelect');
    const selectedSupervisors = window.getMultiSelectValues('supervisorSelect');
    
    // Application des filtres combinés[cite: 1]
    const filteredCards = window.cardsData.filter(card => {
        const matchManager = selectedManagers.length === 0 || selectedManagers.includes(card.manager);
        const matchSupervisor = selectedSupervisors.length === 0 || selectedSupervisors.includes(card.name);
        return matchManager && matchSupervisor;
    });

    if (typeof window.renderCards === 'function') {
        window.renderCards(filteredCards);
    }
};


// --- 4. IMPRESSION (CORRECTION BUG 2) ---

// Fonction 4.A : Impression de masse (Vignettes cochées)
window.printDisplayedTimesheets = function() {
    // Vérification : seuls le timekeeper et l'admin peuvent imprimer[cite: 1]
    if (window.currentRole !== 'timekeeper' && window.currentRole !== 'admin') {
        alert("Action refusée : Seuls le Timekeeper et l'Admin peuvent imprimer les fiches.");
        return;
    }
    
    let cardsToPrint = window.cardsData;
    
    // On filtre sur les vignettes sélectionnées si l'utilisateur en a coché
    if (window.selectedTimesheets.length > 0) {
        cardsToPrint = window.cardsData.filter(card => window.selectedTimesheets.includes(card.name) || window.selectedTimesheets.includes(card.timesheetName));
    }

    if (cardsToPrint.length === 0) {
        alert("Aucune fiche trouvée pour l'impression.");
        return;
    }

    // Envoi à l'algorithme d'impression paginé par 15 lignes[cite: 1]
    if (typeof window.generateAndPrintTimesheets === 'function') {
        window.generateAndPrintTimesheets(cardsToPrint);
    }
};

// Fonction 4.B : NOUVELLE FONCTION pour imprimer une fiche unique
window.printSingleTimesheet = function(timesheetName) {
    // Permissions : l'impression est bloquée pour les rôles viewer et cfo[cite: 1]
    if (window.currentRole !== 'timekeeper' && window.currentRole !== 'admin') {
        alert("Action refusée : Seuls le Timekeeper et l'Admin ont le droit d'imprimer.");
        return;
    }

    // Extraction de la sous-équipe depuis les données[cite: 1]
    const singleCard = window.cardsData.find(card => card.name === timesheetName || card.timesheetName === timesheetName);
    
    if (!singleCard) {
        console.error("Erreur : Impossible de trouver la timesheet pour", timesheetName);
        return;
    }

    // On passe uniquement cet objet dans un tableau à la fonction d'impression[cite: 1]
    if (typeof window.generateAndPrintTimesheets === 'function') {
        window.generateAndPrintTimesheets([singleCard]);
    }
};

// --- 5. RESTE DE TON CODE (NE PAS SUPPRIMER) ---
// ... [Ton code existant pour Firebase Firestore]
// ... [Ton code existant pour window.renderCards]
// ... [Ton code existant pour SortableJS MultiDrag]
// ... [Ton code existant pour window.generateAndPrintTimesheets]
