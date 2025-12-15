document.addEventListener("DOMContentLoaded", () => {
    const historyContainer = document.getElementById("historique-container");
    const h1Title = document.querySelector(".panier-wrapper h1");

    // Vérifier qui est connecté
    const currentUser = localStorage.getItem('currentUser');
    let historique = [];

    if (currentUser) {
        // Si connecté, on charge l'historique
        historique = JSON.parse(localStorage.getItem('historique_' + currentUser)) || [];
        h1Title.textContent = `Historique de ${currentUser}`;
        
        // Ajouter un bouton de déconnexion
        const logoutBtn = document.createElement("button");
        logoutBtn.innerText = "Se déconnecter";
        logoutBtn.onclick = function() {
            localStorage.removeItem('currentUser');
            window.location.reload();
        };
        h1Title.appendChild(document.createElement("br"));
        h1Title.appendChild(logoutBtn);

    } else {
        // Sinon, on charge l'historique invité
        historique = JSON.parse(localStorage.getItem('historiqueCommandes')) || [];
    }

    if (historique.length === 0) {
        historyContainer.innerHTML = "<p class='empty-msg'>Vous n'avez pas encore effectué de réservation.</p>";
        return;
    }

    // Afficher les commandes
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