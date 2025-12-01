const params = new URLSearchParams(window.location.search);

// On récupère chaque paramètre
const voyage= params.get("name");

console.log(voyage)

lstvoyage={'Algerie':'179',
    'Copenhagen':'56',
    'Londres':'143' ,
    'Malte':'89' ,
    'NewYork':'27' ,
    'Pyongyang':'160' ,
    'quebec':'103' ,
    'Seoul':'147' ,
    'Shangai':'63' ,
    'Tokyo':'198' ,
    'Varsovie':'121' ,
    'WashintonDC':'74' ,
    'NewZeland':'32' }
PRIX=lstvoyage[voyage]

// --VERIF + CALCUL PRIX-- //
document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const dateDepart = document.getElementById('start');
    const dateRetour = document.getElementById('retour');
    const nbAdultes = document.getElementById('NbAdultes');
    const nbEnfants = document.getElementById('NbEnfant');
    const radios = document.querySelectorAll('input[name="oui/non"]');
    const priceContainer = document.getElementById('prix');

    // --- VERIFICATION ---
    form.addEventListener('submit', function (e) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const depart = new Date(dateDepart.value);
        const retour = new Date(dateRetour.value);

        if (parseInt(nbAdultes.value) < 1) {
            alert('Il doit y avoir au moins 1 adulte.');
            e.preventDefault();
            return;
        }

        if (depart <= today) {
            alert('La date de départ doit être après la date actuelle.');
            e.preventDefault();
            return;
        }

        if (retour <= depart) {
            alert('La date de retour doit être après la date de départ.');
            e.preventDefault();
            return;
        }
    });

    // --- CALCUL PRIX ---
    function calculPrix() {
        const depart = new Date(dateDepart.value);
        const retour = new Date(dateRetour.value);
        const jours = (retour - depart) / (1000 * 60 * 60 * 24);

        if (jours <= 0 || isNaN(jours)) {
            priceContainer.textContent = "Prix : --";
            return;
        }

        const adultes = parseInt(nbAdultes.value);
        const enfants = parseInt(nbEnfants.value);
        const petitDej = [...radios].find(r => r.checked).value === "oui";

        const prixAdulte = PRIX * adultes * jours;
        const prixEnfant = PRIX * 0.4 * enfants * jours;
        const prixPetitDej = petitDej ? 15 * (adultes + enfants) * jours : 0;

        const total = prixAdulte + prixEnfant + prixPetitDej;

        priceContainer.textContent = `Prix total : ${total.toFixed(2)} €`;
    }

    // Mise à jour auto
    dateDepart.addEventListener('change', calculPrix);
    dateRetour.addEventListener('change', calculPrix);
    nbAdultes.addEventListener('input', calculPrix);
    nbEnfants.addEventListener('input', calculPrix);
    radios.forEach(r => r.addEventListener('change', calculPrix));

    calculPrix();
});
