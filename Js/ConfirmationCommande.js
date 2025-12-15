document.addEventListener("DOMContentLoaded", () => {
    const recapDiv = document.getElementById('recap-commande');
    const btnPayer = document.getElementById('btn-payer');
    
    const panier = JSON.parse(localStorage.getItem('monPanier')) || [];
    
    if (panier.length === 0) {
        recapDiv.innerHTML = "<p>Votre panier est vide.</p>";
        btnPayer.style.display = 'none';
        return;
    }

    let html = "<h2>Récapitulatif de la commande</h2>";
    let totalGlobal = 0;

    panier.forEach(item => {
        totalGlobal += parseFloat(item.prixTotal);
        html += `
            <div style="border-bottom:1px solid #555; padding:10px 0; margin-bottom:10px;">
                <h3 style="margin:0; color:#58bff6;">${item.destination}</h3>
                <p style="margin:5px 0;">${item.dateDepart} au ${item.dateRetour}</p>
                <div style="text-align:right; font-weight:bold;">${item.prixTotal} €</div>
            </div>
        `;
    });

    html += `<h2 style="text-align:right; color:#ffddaa; margin-top:20px;">Total : ${totalGlobal.toFixed(2)} €</h2>`;
    recapDiv.innerHTML = html;

    btnPayer.addEventListener('click', () => {
        const user = localStorage.getItem('currentUser');
        const historyKey = user ? 'historique_' + user : 'historiqueCommandes';
        
        let historique = JSON.parse(localStorage.getItem(historyKey)) || [];
        const dateJour = new Date().toLocaleDateString();

        panier.forEach(item => {
            item.dateAchat = dateJour;
            historique.push(item);
        });

        localStorage.setItem(historyKey, JSON.stringify(historique));
        localStorage.removeItem('monPanier');

        alert("Paiement accepté ! Merci pour votre commande.");
        window.location.href = 'ContenuPanier.html';
    });
});