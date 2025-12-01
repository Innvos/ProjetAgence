
function ecrire() {
    let texte = document.getElementById("tache").value;
    if (texte.trim() === "") return;
    let p = document.createElement("p");
    p.textContent = texte;
    document.getElementById("liste").appendChild(p);
    document.getElementById("tache").value = ""; // Effacer le champ
}

function supprimer() {
    let liste = document.getElementById("liste");
    if (liste.lastChild) {
        liste.removeChild(liste.lastChild); // supprime la dernière tâche ajoutée
    }
}