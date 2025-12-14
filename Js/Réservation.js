document.addEventListener("DOMContentLoaded", () => {
  // Récupère les paramètres de l'url
  const params = new URLSearchParams(window.location.search);
  const voyageParam = params.get("name") || params.get("voyage") || ""; 
  const voyageKey = voyageParam.trim();

  // Liste des voyages avec prix et options
  const lstvoyage = {
    'Alger':      { price: 179, label: 'Alger', petitDejOk: true, enfantsOk: true },
    'Copenhagen':   { price: 56,  label: 'Copenhague', petitDejOk: true, enfantsOk: true },
    'Londres':      { price: 143, label: 'Londres', petitDejOk: false, enfantsOk: true },
    'Malte':        { price: 89,  label: 'Malte', petitDejOk: true, enfantsOk: false }, 
    'NewYork':      { price: 27,  label: 'New York', petitDejOk: false, enfantsOk: true },
    'Pyongyang':    { price: 160, label: 'Pyongyang', petitDejOk: false, enfantsOk: false },
    'quebec':       { price: 103, label: 'Québec', petitDejOk: true, enfantsOk: true },
    'Seoul':        { price: 147, label: 'Séoul', petitDejOk: true, enfantsOk: true },
    'Shangai':      { price: 63,  label: 'Shanghaï', petitDejOk: false, enfantsOk: false },
    'Tokyo':        { price: 198, label: 'Tokyo', petitDejOk: true, enfantsOk: true },
    'Varsovie':     { price: 121, label: 'Varsovie', petitDejOk: true, enfantsOk: true },
    'WashintonDC':  { price: 74,  label: 'Washington DC', petitDejOk: false, enfantsOk: true },
    'NewZeland':    { price: 32,  label: 'Nouvelle-Zélande', petitDejOk: true, enfantsOk: true }
  };

  // Éléments du dom
  const titleEl = document.getElementById("page-title");
  const bgEl = document.getElementById("reservation-bg");
  const voyageInput = document.getElementById("voyageInput");
  const form = document.getElementById("reservation-form");
  const dateDepart = document.getElementById("start");
  const dateRetour = document.getElementById("retour");
  const nbAdultes = document.getElementById("NbAdultes");
  const nbEnfants = document.getElementById("NbEnfant");
  const priceContainer = document.getElementById("prix");
  
  // Récupération des conteneurs pour les cacher si besoin
  const petitDejRadio = document.querySelector('input[name="petitDej"]');
  const petitDejContainer = petitDejRadio ? petitDejRadio.closest('li') : null;
  const enfantContainer = nbEnfants ? nbEnfants.closest('li') : null;

  // Choix du voyage
  let selected = lstvoyage[voyageKey] ? voyageKey : null;
  let displayName = selected ? lstvoyage[selected].label : "Votre voyage";
  let basePrice = selected ? lstvoyage[selected].price : 100;

  // Mise à jour de l'affichage
  if (selected) {
    titleEl.textContent = `Réservation – ${displayName}`;
    voyageInput.value = selected;

    const imgPath = `Images/${selected}.avif`;
    bgEl.style.backgroundImage = `url('${imgPath}')`;

    // Gestion de l'option petit déjeuner
    if (petitDejContainer) {
        if (lstvoyage[selected].petitDejOk === false) {
            petitDejContainer.style.display = 'none';
            document.querySelector('input[name="petitDej"][value="non"]').checked = true;
        } else {
            petitDejContainer.style.display = 'block';
        }
    }
    // Masquer Enfants si interdit
    if (enfantContainer) {
        if (lstvoyage[selected].enfantsOk === false) {
            enfantContainer.style.display = 'none';
            nbEnfants.value = 0;
        } else {
            enfantContainer.style.display = 'block';
        }
    }
  } else {
    titleEl.textContent = `Réservation`;
    voyageInput.value = "";
  }

  // Vérification des dates
  function validateDates() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const depart = new Date(dateDepart.value);
    const retour = new Date(dateRetour.value);

    if (!dateDepart.value || !dateRetour.value) return { ok: false, msg: 'Sélectionnez des dates.' };
    if (depart < today) return { ok: false, msg: 'La date de départ doit être aujourd\'hui ou plus tard.' };
    if (retour <= depart) return { ok: false, msg: 'La date de retour doit être après la date de départ.' };
    return { ok: true, jours: Math.round((retour - depart) / (1000*60*60*24)) };
  }

  // Calcul du prix
  function calculPrix() {
    const res = validateDates();
    if (!res.ok) {
      priceContainer.textContent = "Prix : --";
      return;
    }
    const jours = res.jours;
    const adultes = Math.max(1, parseInt(nbAdultes.value) || 1);
    const enfants = Math.max(0, parseInt(nbEnfants.value) || 0);
    
    // Vérification options
    const petitDejInput = document.querySelector('input[name="petitDej"]:checked');
    const isPetitDejChecked = petitDejInput?.value === "oui";
    const petitDejPossible = selected ? lstvoyage[selected].petitDejOk : true;
    const petitDej = isPetitDejChecked && petitDejPossible;

    const prixAdulte = basePrice * adultes * jours;
    const prixEnfant = basePrice * 0.4 * enfants * jours;
    const prixPetitDej = petitDej ? 15 * (adultes + enfants) * jours : 0;

    const total = prixAdulte + prixEnfant + prixPetitDej;
    priceContainer.textContent = `Prix total : ${total.toFixed(2)} €`;
    return total;
  }

  // Listeners
  [dateDepart, dateRetour, nbAdultes, nbEnfants].forEach(el => el.addEventListener('input', calculPrix));
  document.querySelectorAll('input[name="petitDej"]').forEach(r => r.addEventListener('change', calculPrix));

  calculPrix();

  // 6. SOUMISSION : Sauvegarder dans localStorage et rediriger vers Confirmation
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // On bloque l'envoi classique HTML

    const res = validateDates();
    
    if (parseInt(nbAdultes.value) < 1) {
      alert('Il doit y avoir au moins 1 adulte.');
      return;
    }
    if (!res.ok) {
        alert(res.msg);
        return;
    }

    // Création de l'objet commande
    const totalPrix = calculPrix();
    const commande = {
        destination: displayName,
        image: selected ? `Images/${selected}.avif` : '',
        dateDepart: dateDepart.value,
        dateRetour: dateRetour.value,
        adultes: nbAdultes.value,
        enfants: nbEnfants.value,
        petitDej: document.querySelector('input[name="petitDej"]:checked')?.value,
        prixTotal: totalPrix.toFixed(2)
    };

    // Sauvegarde temporaire pour la page de confirmation
    localStorage.setItem('commandeEnCours', JSON.stringify(commande));

    // Redirection vers la page de résumé/paiement
    window.location.href = 'ConfirmationCommande.html';
  });
});