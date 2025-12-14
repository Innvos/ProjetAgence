document.addEventListener("DOMContentLoaded", () => {
    // 1. Lecture de la commande temporaire (depuis Réservation)
    const commandeData = localStorage.getItem('commandeEnCours');
    const recapDiv = document.getElementById('recap-commande');
    const btnPayer = document.getElementById('btn-payer');
    
    if (!commandeData) {
        recapDiv.innerHTML = "<p>Aucune commande en attente.</p>";
        btnPayer.style.display = 'none';
        return;
    }

    const commande = JSON.parse(commandeData);

    // 2. Affichage du résumé
    recapDiv.innerHTML = `
        <h2>${commande.destination}</h2>
        <p><strong>Dates :</strong> Du ${commande.dateDepart} au ${commande.dateRetour}</p>
        <p><strong>Voyageurs :</strong> ${commande.adultes} Adulte(s), ${commande.enfants} Enfant(s)</p>
        <p><strong>Options :</strong> Petit-déjeuner : ${commande.petitDej === 'oui' ? 'Oui' : 'Non'}</p>
        <div class="total-price">Total à régler : ${commande.prixTotal} €</div>
    `;

// Clic Paiement
    btnPayer.addEventListener('click', () => {
        // 1. Vérifier si un utilisateur est connecté
        const currentUser = localStorage.getItem('currentUser');
        
        let storageKey = 'historiqueCommandes'; // Par défaut : invité
        if (currentUser) {
            storageKey = 'historique_' + currentUser; // Si connecté : clé perso
        }

        // 2. Récupérer l'historique correspondant
        let historique = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        // 3. Ajouter la commande
        commande.dateAchat = new Date().toLocaleDateString();
        historique.push(commande);
        
        localStorage.setItem(storageKey, JSON.stringify(historique));
        
        // 4. Nettoyer et rediriger
        localStorage.removeItem('commandeEnCours');
        alert("Paiement validé !");
        window.location.href = 'ContenuPanier.html';
    });
});