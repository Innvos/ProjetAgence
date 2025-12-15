// CLÉ API Météo
const API_KEY = "0445540b9aced96d07a25148ae4b506d"; 

// CLASSE DESTINATION
class Destination {
    constructor(id, nom, prix, image, enfantsOk, petitDejOk, villeMeteo) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.image = image;
        this.enfantsOk = enfantsOk;
        this.petitDejOk = petitDejOk;
        this.villeMeteo = villeMeteo;
    }
}

// DONNÉES
const destinations = [
    new Destination(1, "Alger", 179, "Images/Alger.avif", true, true, "Algiers"),
    new Destination(2, "Copenhagen", 56, "Images/Copenhagen.avif", true, true, "Copenhagen"),
    new Destination(3, "Londres", 143, "Images/Londres.avif", true, false, "London"),
    new Destination(4, "Malte", 89, "Images/Malte.avif", false, true, "Valletta"),
    new Destination(5, "NewYork", 27, "Images/NewYork.avif", true, false, "New York"),
    new Destination(6, "Pyongyang", 160, "Images/Pyongyang.avif", false, false, "Pyongyang"),
    new Destination(7, "quebec", 103, "Images/quebec.avif", true, true, "Quebec"), 
    new Destination(8, "Seoul", 147, "Images/Seoul.avif", true, true, "Seoul"),
    new Destination(9, "Shangai", 63, "Images/Shangai.avif", true, false, "Shanghai"),
    new Destination(10, "Tokyo", 198, "Images/Tokyo.avif", true, true, "Tokyo"),
    new Destination(11, "Varsovie", 121, "Images/Varsovie.avif", true, true, "Warsaw"),
    new Destination(12, "WashintonDC", 74, "Images/WashintonDC.avif", true, false, "Washington"), 
    new Destination(13, "NewZeland", 32, "Images/NewZeland.avif", true, true, "Wellington") 
];

// Fonction Méteo
async function getMeteo(ville) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${API_KEY}&units=metric&lang=fr`;
        const reponse = await fetch(url);
        const data = await reponse.json();
        return Math.round(data.main.temp) + "°C";
    } catch (erreur) {
        console.error("Erreur météo:", erreur);
        return "--°C";
    }
}

// Templates
const carouselContainer = document.getElementById("carousel-container");
const thumbnailsContainer = document.getElementById("thumbnails-container");

async function initCarousel() {
    carouselContainer.innerHTML = "";
    thumbnailsContainer.innerHTML = "";

    // On utilise une boucle for...of avec index pour gérer les numéros
    let index = 1;
    for (const dest of destinations) {
        
        // Appel API Météo (asynchrone)
        const temperature = await getMeteo(dest.villeMeteo);

        // Remarque les balises <div class="overlay-info"> pour le survol
        const slideHTML = `
            <div class="mySlides fade">
                <div class="numbertext">${index} / ${destinations.length}</div>
                
                <div class="image-wrapper">
                    <a href="Réservation.html?name=${dest.nom}">
                        <img class="image" src="${dest.image}" alt="${dest.nom}">
                    </a>
                    
                    <div class="overlay-info">
                        <h3>${dest.nom}</h3>
                        <p class="meteo">Météo actuelle : <span>${temperature}</span></p>
                        <hr>
                        <p>Enfants : ${dest.enfantsOk ? "✅ Autorisés" : "❌ Interdits"}</p>
                        <p>Petit-déj : ${dest.petitDejOk ? "✅ Inclus" : "❌ Non inclus"}</p>
                        <p class="price-tag">${dest.prix}€ / jour</p>
                    </div>
                </div>
            </div>
        `;
        carouselContainer.innerHTML += slideHTML;

        // Image miniature
        const thumbHTML = `
            <div class="column">
                <img class="imgPetit" src="${dest.image}" onclick="currentSlide(${index})" alt="${dest.nom}">
            </div>
        `;
        thumbnailsContainer.innerHTML += thumbHTML;

        index++;
    }

    // Lancement du Carrousel
    showSlides(slideIndex);
    // Code pour la grille en bas de page
    const gridDestinations = document.getElementById("grid-destinations");
    
    // On vide la grille avant de remplir
    if (gridDestinations) {
        gridDestinations.innerHTML = "";
        
        for (const dest of destinations) {
            const carteHTML = `
                <div class="grid-item" onclick="window.location.href='Réservation.html?name=${dest.nom}'">
                    <img src="${dest.image}" alt="${dest.nom}">
                    <div class="grid-info">
                        <h3>${dest.nom}</h3>
                        <p>Dès ${dest.prix}€ / jour</p>
                    </div>
                </div>
            `;
            gridDestinations.innerHTML += carteHTML;
        }
    }
}

// CARROUSEL
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("imgPetit");
    let titleElement = document.querySelector(".container h2");
    
    // Sécurité si le DOM n'est pas encore prêt
    if (slides.length === 0) return;

    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    
    // Mise à jour du titre sous le carrousel
    if(titleElement && dots[slideIndex - 1]) {
        // On récupère le nom depuis le alt de la miniature ou l'objet direct
        document.getElementById("caption").innerText = dots[slideIndex - 1].alt;
    }
}

// Lancer l'initialisation au chargement
document.addEventListener('DOMContentLoaded', initCarousel);

// Fonction pour afficher la grille
function afficherGrille(listeVoyages) {
    const gridDestinations = document.getElementById("grid-destinations");
    if (!gridDestinations) return;

    // On vide la grille
    gridDestinations.innerHTML = "";

    // On recrée les cartes pour la liste donnée
    let contenuHTML = "";
    for (const dest of listeVoyages) {
        contenuHTML += `
            <div class="grid-item" onclick="window.location.href='Réservation.html?name=${dest.nom}'">
                <img src="${dest.image}" alt="${dest.nom}">
                <div class="grid-info">
                    <h3>${dest.nom}</h3>
                    <p>Dès ${dest.prix}€ / jour</p>
                    <div style="font-size:0.8rem; color:#aaa; margin-top:5px;">
                        ${dest.enfantsOk ? "👶 Enfants OK" : ""} 
                        ${dest.petitDejOk ? "☕ P-Déj OK" : ""}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Si la liste est vide (aucun résultat)
    if (contenuHTML === "") {
        contenuHTML = "<p style='color:white; width:100%; text-align:center;'>Aucune destination ne correspond à vos critères.</p>";
    }

    gridDestinations.innerHTML = contenuHTML;
}

// Fonction de filtrage
function filtrer() {
    const veutEnfants = document.getElementById("check-enfants").checked;
    const veutPetitDej = document.getElementById("check-petitdej").checked;

    // On filtre le tableau original 'destinations'
    const resultats = destinations.filter(dest => {
        // Si on a coché "Enfants" et que la destination ne les veut pas -> on masque
        if (veutEnfants && !dest.enfantsOk) return false;
        
        // Si on a coché "Petit Déj" et que la destination n'en a pas -> on masque
        if (veutPetitDej && !dest.petitDejOk) return false;

        // Sinon on garde
        return true;
    });

    // On rafraichit l'affichage avec les résultats
    afficherGrille(resultats);
}

// 3. Initialisation des écouteurs
document.addEventListener('DOMContentLoaded', () => {
    // Affiche tout au chargement
    afficherGrille(destinations);

    // Écoute les clics sur les cases
    const checkEnfants = document.getElementById("check-enfants");
    const checkPetitDej = document.getElementById("check-petitdej");

    if(checkEnfants) checkEnfants.addEventListener("change", filtrer);
    if(checkPetitDej) checkPetitDej.addEventListener("change", filtrer);
});