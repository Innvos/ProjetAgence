document.addEventListener("DOMContentLoaded", () => {
    const headerHTML = `
    <div class="background"></div>
  <header>
    <div class="header-inner">
      <div class="logo">
        <h1>Paf All'Air</h1>
      </div>

      <nav class="main-nav" aria-label="Main navigation">
        <ul>
          <li><a href="PageP.html">Menu</a></li>
          <li><a href="ContenuPanier.html" class="panier"><img class="icone1" src="Images/panier.png" alt="Panier"> Panier</a></li>
          <li><a href="Contact.html" class="contact">A propos &amp; Contact</a></li>
          <li><a href="login.html" class="login">Login</a></li>
        </ul>
      </nav>
    </div>
  </header>
    `;

    // Ajoute le header tout en haut de la page
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
});