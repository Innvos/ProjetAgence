$(document).ready(function(){
  var formInputs = $('input[type="email"],input[type="password"]');
  formInputs.focus(function() {
       $(this).parent().children('p.formLabel').addClass('formTop');
       $('div#formWrapper').addClass('darken-bg');
       $('div.logo').addClass('logo-active');
  });
  formInputs.focusout(function() {
    if ($.trim($(this).val()).length == 0){
    $(this).parent().children('p.formLabel').removeClass('formTop');
    }
    $('div#formWrapper').removeClass('darken-bg');
    $('div.logo').removeClass('logo-active');
  });
  $('p.formLabel').click(function(){
     $(this).parent().children('.form-style').focus();
  });
  
    $('#go-to-register').click(function(e){
        e.preventDefault();
        $('#login-form').fadeOut(300, function(){
            $('#register-form').fadeIn(300);
        });
    });

    $('#go-to-login').click(function(e){
        e.preventDefault();
        $('#register-form').fadeOut(300, function(){
            $('#login-form').fadeIn(300);
        });
    });

    // Inscription
    $('#register-form').submit(function(e){
        e.preventDefault();
        const email = $('#reg-email').val();
        const pass = $('#reg-pass').val();

        // Récupérer la liste des utilisateurs existants
        let users = JSON.parse(localStorage.getItem('usersDB')) || [];

        // Vérifier si l'email existe déjà
        if(users.find(u => u.email === email)) {
            alert("Cet email est déjà utilisé !");
            return;
        }

        // Créer le nouvel utilisateur
        users.push({ email: email, password: pass });
        localStorage.setItem('usersDB', JSON.stringify(users));

        alert("Compte créé avec succès ! Connectez-vous maintenant.");
        $('#go-to-login').click();
    });

    // Connexion
    $('#login-form').submit(function(e){
        e.preventDefault();
        const email = $('#login-email').val();
        const pass = $('#login-pass').val();

        let users = JSON.parse(localStorage.getItem('usersDB')) || [];
        
        // Vérification des identifiants
        const user = users.find(u => u.email === email && u.password === pass);

        if(user) {
            // Sauvegarder qui est connecté
            localStorage.setItem('currentUser', email);

            // Fusion des paniers
            // On récupère l'historique "invité" actuel
            let guestHistory = JSON.parse(localStorage.getItem('historiqueCommandes')) || [];
            
            // On récupère l'historique personnel de l'utilisateur
            let userHistoryKey = 'historique_' + email;
            let userHistory = JSON.parse(localStorage.getItem(userHistoryKey)) || [];

            // Si on a des commandes en "invité", on les ajoute au compte
            if(guestHistory.length > 0) {
                userHistory = userHistory.concat(guestHistory);
                localStorage.setItem(userHistoryKey, JSON.stringify(userHistory));
                
                // On vide le panier "invité" car il est maintenant sauvegardé sur le compte
                localStorage.removeItem('historiqueCommandes');
                alert("Vos commandes précédentes ont été transférées sur votre compte !");
            } else {
                alert("Connexion réussie !");
            }

            // Redirection vers le menu
            window.location.href = "PageP.html";
        } else {
            alert("Email ou mot de passe incorrect.");
        }
    });
});