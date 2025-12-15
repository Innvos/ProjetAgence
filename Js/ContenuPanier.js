document.addEventListener("DOMContentLoaded", () => {
    afficherPanier();
    afficherHistorique();
});

// 1. PANIER
function afficherPanier() {
    const container = document.getElementById("panier-container");
    const btnValider = document.getElementById("btn-valider-panier");
    const panier = JSON.parse(localStorage.getItem('monPanier')) || [];

    if (panier.length === 0) {
        container.innerHTML = "<p style='color:white'>Votre panier est vide.</p>";
        btnValider.style.display = "none";
        return;
    }

    let html = "";
    let total = 0;

    panier.forEach((item, index) => {
        total += parseFloat(item.prixTotal);
        html += `
            <div class="commande-card">
                <img src="${item.image}" alt="${item.destination}">
                <div class="details">
                    <h3>${item.destination}</h3>
                    <p>📅 ${item.dateDepart} ➔ ${item.dateRetour}</p>
                    <p>👥 ${item.adultes} Adultes, ${item.enfants} Enfants</p>
                </div>
                <div class="price">${item.prixTotal} €</div>
                <button onclick="retirerDuPanier(${index})" style="background:#dc3545; color:white; border:none; border-radius:5px; padding:5px 10px; margin-left:15px; cursor:pointer;">X</button>
            </div>
        `;
    });

    html += `<div style="text-align:right; font-size:1.4rem; color:#ffddaa; margin-top:20px;">Total à payer : <strong>${total.toFixed(2)} €</strong></div>`;
    
    container.innerHTML = html;
    btnValider.style.display = "block";

    btnValider.onclick = () => {
        window.location.href = 'ConfirmationCommande.html';
    };
}

// Supprimer un article
window.retirerDuPanier = function(index) {
    let panier = JSON.parse(localStorage.getItem('monPanier')) || [];
    panier.splice(index, 1);
    localStorage.setItem('monPanier', JSON.stringify(panier));
    afficherPanier();
};

// 2. HISTORIQUE (Déjà payé)
function afficherHistorique() {
    const container = document.getElementById("historique-container");
    const h1Title = document.querySelector("h1:nth-of-type(2)");

    const currentUser = localStorage.getItem('currentUser');
    let historique = [];

    if (currentUser) {
        historique = JSON.parse(localStorage.getItem('historique_' + currentUser)) || [];
        if(h1Title) h1Title.textContent = `Historique de ${currentUser}`;
    } else {
        historique = JSON.parse(localStorage.getItem('historiqueCommandes')) || [];
    }

    if (historique.length === 0) {
        container.innerHTML = "<p style='color:gray'>Aucun voyage passé.</p>";
        return;
    }

    let html = "";
    historique.reverse().forEach(cmd => {
        html += `
            <div class="commande-card" style="opacity: 0.8;">
                <img src="${cmd.image}" alt="${cmd.destination}">
                <div class="details">
                    <h3>${cmd.destination} <span style="font-size:0.8rem; color:#28a745;">(Payé)</span></h3>
                    <p>Commandé le : ${cmd.dateAchat || 'Date inconnue'}</p>
                </div>
                <div class="price">${cmd.prixTotal} €</div>
            </div>
        `;
    });
    container.innerHTML = html;
}