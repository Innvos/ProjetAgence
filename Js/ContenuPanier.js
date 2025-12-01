const params = new URLSearchParams(window.location.search);

// On récupère chaque paramètre
const tripStart = params.get("trip-start");
const tripEnd = params.get("trip-end");
const nbAdultes = params.get("NbAdultes");
const nbEnfant = params.get("NbEnfant");
const ouiNon = params.get("oui/non");

console.log(tripStart, tripEnd, nbAdultes, nbEnfant, ouiNon);