
    // Ajoute un gestionnaire d'événement pour le soumission du formulaire
    document.getElementById('loginForm').addEventListener('submit', function(event) 
    {
        // Récupère la valeur du champ de nom d'utilisateur
        var username = document.getElementById('username').value;
        
        // Valide le nom d'utilisateur
        if (!isValidUsername(username)) 
        {
            // Empêche l'envoi du formulaire si la validation échoue
            event.preventDefault();
            // Affiche un message d'erreur à l'utilisateur
            alert("The username is invalid. Please do not use special characters.");
        }
    });

    // Fonction pour valider le nom d'utilisateur côté client
    function isValidUsername(nom) 
    {
        // Expression régulière pour autoriser seulement les lettres, les chiffres, les tirets et les underscores
        var regex = /^[a-zA-Z0-9_\-]+$/;
        // Vérifie si le nom d'utilisateur correspond à l'expression régulière
        return regex.test(nom);
    }