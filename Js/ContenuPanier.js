const params = new URLSearchParams(window.location.search);

// On récupère chaque paramètres
const tripStart = params.get("trip-start");
const tripEnd = params.get("trip-end");
const nbAdultes = params.get("NbAdultes");
const nbEnfant = params.get("NbEnfant");
const petitDej = params.get("petitDej");

console.log(tripStart, tripEnd, nbAdultes, nbEnfant, ouiNon);