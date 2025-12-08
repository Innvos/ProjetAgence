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

    // applique l'image en background du bloc - vérifie chemin image
    const imgPath = `Images/${selected}.avif`;
    bgEl.style.backgroundImage = `url('${imgPath}')`;
  } else {
    titleEl.textContent = `Réservation`;
    voyageInput.value = "";
    // pas d'image si pas de param
  }

  // Validation + calcul
  function validateDates() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const depart = new Date(dateDepart.value);
    const retour = new Date(dateRetour.value);

    if (!dateDepart.value || !dateRetour.value) return { ok: false, msg: 'Sélectionnez des dates.' };
    if (depart <= today) return { ok: false, msg: 'La date de départ doit être après aujourd\'hui.' };
    if (retour <= depart) return { ok: false, msg: 'La date de retour doit être après la date de départ.' };
    return { ok: true, jours: Math.round((retour - depart) / (1000*60*60*24)) };
  }

  function calculPrix() {
    const res = validateDates();
    if (!res.ok) {
      priceContainer.textContent = "Prix : --";
      return;
    }
    const jours = res.jours;
    const adultes = Math.max(1, parseInt(nbAdultes.value) || 1);
    const enfants = Math.max(0, parseInt(nbEnfants.value) || 0);
    const petitDej = document.querySelector('input[name="petitDej"]:checked')?.value === "oui";

    const prixAdulte = basePrice * adultes * jours;
    const prixEnfant = basePrice * 0.4 * enfants * jours;
    const prixPetitDej = petitDej ? 15 * (adultes + enfants) * jours : 0;

    const total = prixAdulte + prixEnfant + prixPetitDej;
    priceContainer.textContent = `Prix total : ${total.toFixed(2)} €`;
  }

  // événements pour recalculer
  [dateDepart, dateRetour, nbAdultes, nbEnfants].forEach(el => {
    el.addEventListener('input', calculPrix);
  });
  document.querySelectorAll('input[name="petitDej"]').forEach(r => r.addEventListener('change', calculPrix));

  // calcul initial
  calculPrix();

  // soumission : validation finale
  form.addEventListener('submit', (e) => {
    const depart = new Date(dateDepart.value);
    const retour = new Date(dateRetour.value);
    const today = new Date(); today.setHours(0,0,0,0);

    if (parseInt(nbAdultes.value) < 1) {
      alert('Il doit y avoir au moins 1 adulte.');
      e.preventDefault();
      return;
    }
    if (depart <= today) {
      alert('La date de départ doit être après aujourd\'hui.');
      e.preventDefault();
      return;
    }
    if (retour <= depart) {
      alert('La date de retour doit être après la date de départ.');
      e.preventDefault();
      return;
    }

    // ajoute le param name dans l'URL si nécessaire (pour compatibilité)
    if (selected && !voyageInput.value) {
      voyageInput.value = selected;
    }

    // le formulaire peut soumettre normalement vers ContenuPanier.html
    // si tu veux, on peut sérialiser et rediriger via JS à la place
  });

});
