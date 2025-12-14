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

    // 3. Gestion du click "Payer"
    btnPayer.addEventListener('click', () => {
        // Récupérer l'historique actuel
        let historique = JSON.parse(localStorage.getItem('historiqueCommandes')) || [];
        
        // Ajouter la date d'achat du jour
        commande.dateAchat = new Date().toLocaleDateString();
        
        // Pousser dans l'historique
        historique.push(commande);
        
        // Sauvegarder et nettoyer
        localStorage.setItem('historiqueCommandes', JSON.stringify(historique));
        localStorage.removeItem('commandeEnCours');

        alert("Paiement validé ! Redirection vers vos commandes.");
        window.location.href = 'ContenuPanier.html';
    });
});