document.addEventListener("DOMContentLoaded", () => {
    const historyContainer = document.getElementById("historique-container");
    // Lecture du stockage local
    const historique = JSON.parse(localStorage.getItem('historiqueCommandes')) || [];

    if (historique.length === 0) {
        historyContainer.innerHTML = "<p class='empty-msg'>Vous n'avez pas encore effectué de réservation.</p>";
        return;
    }

    // Afficher les commandes (de la plus récente à la plus ancienne)
    historique.reverse().forEach((cmd) => {
        const carteHTML = `
            <div class="commande-card">
                <img src="${cmd.image}" alt="${cmd.destination}">
                <div class="details">
                    <h3>${cmd.destination}</h3>
                    <p>📅 ${cmd.dateDepart} ➔ ${cmd.dateRetour}</p>
                    <p>👥 ${cmd.adultes} Adultes / ${cmd.enfants} Enfants</p>
                    <p class="achat-date">Commandé le ${cmd.dateAchat}</p>
                </div>
                <div class="price">
                    ${cmd.prixTotal} €
                </div>
            </div>
        `;
        historyContainer.innerHTML += carteHTML;
    });
});