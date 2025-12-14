// Réservation.js — gérer affichage dynamique + calcul de prix + validation

document.addEventListener("DOMContentLoaded", () => {
  // Récupère param
  const params = new URLSearchParams(window.location.search);
  const voyageParam = params.get("name") || params.get("voyage") || ""; // accept both
  const voyageKey = voyageParam.trim();

  const lstvoyage = {
    'Algerie': { price: 179, label: 'Algérie' },
    'Copenhagen': { price: 56, label: 'Copenhague' },
    'Londres': { price: 143, label: 'Londres' },
    'Malte': { price: 89, label: 'Malte' },
    'NewYork': { price: 27, label: 'New York' },
    'Pyongyang': { price: 160, label: 'Pyongyang' },
    'quebec': { price: 103, label: 'Québec' },
    'Seoul': { price: 147, label: 'Séoul' },
    'Shangai': { price: 63, label: 'Shanghaï' },
    'Tokyo': { price: 198, label: 'Tokyo' },
    'Varsovie': { price: 121, label: 'Varsovie' },
    'WashintonDC': { price: 74, label: 'Washington DC' },
    'NewZeland': { price: 32, label: 'Nouvelle-Zélande' }
  };

  // éléments DOM
  const titleEl = document.getElementById("page-title");
  const bgEl = document.getElementById("reservation-bg");
  const voyageInput = document.getElementById("voyageInput");
  const form = document.getElementById("reservation-form");
  const dateDepart = document.getElementById("start");
  const dateRetour = document.getElementById("retour");
  const nbAdultes = document.getElementById("NbAdultes");
  const nbEnfants = document.getElementById("NbEnfant");
  const priceContainer = document.getElementById("prix");

  // choisir le voyage
  let selected = lstvoyage[voyageKey] ? voyageKey : null;
  let displayName = selected ? lstvoyage[selected].label : "Votre voyage";
  let basePrice = selected ? lstvoyage[selected].price : 100;
  // met à jour titre et background si un voyage connu est fourni
  if (selected) {
    titleEl.textContent = `Réservation – ${displayName}`;
    voyageInput.value = selected;

    // applique l'image en background du bloc - vérifie chemin image
    const imgPath = `Images/${selected}.avif`;
    bgEl.style.backgroundImage = `url('${imgPath}')`;
  } else {
    titleEl.textContent = `Réservation`;
    voyageInput.value = "";

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

  // Validation finale
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
  });

});
