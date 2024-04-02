
//source pour creer un bouton en javascript : https://jsfiddle.net/740xwaec/

var buttonContainer = document.createElement("div"); // Création du conteneur pour les boutons
var buttonWidth = "15vw"; // Largeur fixe pour chaque bouton en vw pour le responsive
var buttonHeight = "15vw";

// Ajout de styles CSS pour le conteneur (Flexbox)
buttonContainer.style.display = "flex";
buttonContainer.style.justifyContent = "center"; // Centrer les éléments horizontalement
buttonContainer.style.alignItems = "center"; // Centrer les éléments verticalement
buttonContainer.style.gap = "200px"; // Espacement entre les boutons
buttonContainer.style.position = "absolute";

//centrer les cases au milieu horizontalement
buttonContainer.style.top = "60%"; // Mettre le conteneur au milieu de la page verticalement
buttonContainer.style.left = "50%"; // Mettre le conteneur au milieu de la page horizontalement
buttonContainer.style.transform = "translate(-50%, -50%)"; // Pour centrer précisément le conteneur

// Liste des noms des boutons
var buttonNames = ["Tournament", "2 players", "IA"];

// Boucle pour créer et styliser les boutons et eviter de copier 3x
// le meme code pour les 3 boutons
buttonNames.forEach(function(buttonName) 
{
    // Création du bouton
    var button = document.createElement("button");
    button.textContent = buttonName;

    // Ajout de styles CSS pour le bouton
    button.style.fontFamily = "VT323";
    button.style.border = "solid white";
    button.style.borderWidth = "2px";
    button.style.borderRadius = "15px";
    button.style.fontSize = "3vw";
    button.style.padding = "70px";
    button.style.background = "transparent";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.transition = "1s";
    button.style.boxShadow = "10px 10px 70px white";
    button.style.width = buttonWidth;// Définition de la largeur fixe pour chaque bouton
    button.style.height = buttonHeight;

    // centre le texte au milieu du conteneur flexbox
    button.style.display = "flex"; //Utilisation de Flexbox pour permettre le centrage des éléments enfants
    button.style.flexDirection = "column"; // Définition de la direction des éléments enfants comme étant verticale
    button.style.alignItems = "center"; // Centrage horizontal des éléments enfants à l'intérieur du bouton
    button.style.justifyContent = "center"; // Centrage vertical des éléments enfants à l'intérieur du bouton

    // Gestion de l'événement hover sur le bouton
    button.addEventListener("mouseenter", function() 
    {
        button.style.background = "yellow";
        button.style.color = "black";
        button.style.boxShadow = "10px 10px 10px yellow";
    });

    // Gestion de l'événement mouseleave sur le bouton
    button.addEventListener("mouseleave", function() 
    {
        button.style.background = "transparent";
        button.style.color = "yellow";
        button.style.boxShadow = "10px 10px 70px white";
    });

        // Redirection vers index.html lors du clic sur le bouton "Tournament"
        if (buttonName === "Tournament") //=== utilisé pour la comparaison entre deux variables quel que soit le type de la variable
        {
            button.addEventListener("click", function() 
            {
                window.location.href = "tournoi_index.html";
            });
        }

        if (buttonName === "2 players")
        {
            button.addEventListener("click", function() 
            {
                window.location.href = "jeu_index.html";
            });
        }

        if (buttonName === "IA")
        {
            button.addEventListener("click", function() 
            {
                window.location.href = "computer_index.html";
            });
        }


    // Ajout du bouton au conteneur
    buttonContainer.appendChild(button);
});

// Ajout du conteneur au document
document.body.appendChild(buttonContainer);
