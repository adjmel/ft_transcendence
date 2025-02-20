// import { setLanguage } from "./multi-language.js";
import { fetchNavbar } from "./index.js";

// async function sendDataVerify() 
// {
//   // Associate the FormData object with the form element
//   var form = document.getElementById("verify-form");
//   var formData = new FormData(form);
   
//   try 
//   {
//      var response = await fetch("https://localhost:1050/2fa/verify_2fa/", 
//      {
//       method: "POST",
//       // Set the FormData instance as the request body
//       body: formData,
//       headers: {
//         'X-CSRFToken': getCookie('csrftoken') // Assurez-vous d'inclure le jeton CSRF
//     }
//     });
//     document.querySelector('#content').innerHTML = await response.text();
//   } 
//   catch (e) 
//   {
//     console.error(e);
//   }
// }

// async function sendDataEnable() 
// {
//   // Associate the FormData object with the form element
//   var form = document.getElementById("enable-form");
//   var formData = new FormData(form);
   
//   try 
//   {
//      var response = await fetch("https://localhost:1050/2fa/enable_2fa/", 
//      {
//       method: "POST",
//       // Set the FormData instance as the request body
//       body: formData,
//       headers: {
//         'X-CSRFToken': getCookie('csrftoken') // Assurez-vous d'inclure le jeton CSRF
//     }
//     });
//     document.querySelector('#content').innerHTML = await response.text();
//   } 
//   catch (e) 
//   {
//     console.error(e);
//   }
// }


async function sendDataSignup() 
{
  // Associate the FormData object with the form element
  var form = document.getElementById("signup-form");
  var formData = new FormData(form);
   
  try 
  {
     var response = await fetch("/2fa/signup/", 
     {
      method: "POST",
      // Set the FormData instance as the request body
      body: formData,
      headers: {
        'X-CSRFToken': getCookie('csrftoken') // Assurez-vous d'inclure le jeton CSRF
    }
    });
    var resp = await response.text();
    let content = document.querySelector('#content')
    if(content)
      content.innerHTML = resp;
    if (resp.includes("Welcome to the world of Pong"))
      getJWTToken(formData.get("username"), formData.get("password1"));
    else if (resp.includes('<form method="post" id="signup-form">'))
      setupSignup();
  } 
  catch (e) 
  {
    console.error(e);
  }
}

async function sendDataLogin() 
{
  // Associate the FormData object with the form element
  var form = document.getElementById("login-form");
  var formData = new FormData(form);
   
  try 
  {
     var response = await fetch("/2fa/login/", 
     {
      method: "POST",
      // Set the FormData instance as the request body
      body: formData,
      headers: {
        'X-CSRFToken': getCookie('csrftoken') // Assurez-vous d'inclure le jeton CSRF
    }
    });
    var resp = await response.text();
    let content = document.querySelector('#content')
    if (content)
      content.innerHTML = resp;
    if (resp.includes("Welcome to the world of Pong"))
      getJWTToken(formData.get("username"), formData.get("password"));
    else if (resp.includes('<form method="post" id="login-form">'))
      setupConnection();
  } 
  catch (e) 
  {
    console.error(e);
  }
}

export function setupConnection() {
  // setLanguageLogin(getCookie('lang'));
  document.getElementById("signup")?.addEventListener("click", function (event) {
    event.preventDefault();
    history.pushState({ page: '2fa/signup' }, "", "");
    fetchSignup();
  });
  document.getElementById("btn_signup")?.addEventListener("click", function (event) {
    event.preventDefault();
    history.pushState({ page: '2fa/login' }, "", "");
    sendDataLogin();
  });
}

function setupSignup() {
  // setLanguageSignup(getCookie('lang'));
  document.getElementById("btn_signup")?.addEventListener("click", function (event) {
    event.preventDefault();
    history.pushState({ page: '2fa/login' }, "", "");
    sendDataSignup();
  });
}

export function fetchConnection() {
  fetch('/2fa/login/')
    .then(response => response.text())
    .then(text => {
      let content = document.querySelector('#content')
      if(content)
        content.innerHTML = text;
      setupConnection();
    });
}

function fetchSignup() {
  fetch('/2fa/signup/')
    .then(response => response.text())
    .then(text => {
      let content = document.querySelector('#content')
      if (content)
        content.innerHTML = text;
      setupSignup();
    });
}

export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setCookie(cname, cvalue, exmin) {
  const d = new Date();
  d.setTime(d.getTime() + (exmin*60*1000));
  let expires = "expires="+ d.toUTCString();
  // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
}

async function getJWTToken(username, password) {
  try 
  {
    var response = await fetch("/2fa/token/obtain/", {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'), // Assurez-vous d'inclure le jeton CSRF
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    var result = await response.json();
    if (result.refresh && result.access) {
      setCookie("jwttoken_access", result.access, 60);
      setCookie("jwttoken_refresh", result.refresh, 60*24);
    }
    fetchNavbar();
  } 
  catch (e) 
  {
    console.error(e);
  }
}


// function setLanguageNav(language){
//   let loginElement = document.getElementById("login");
//   let logoutElement = document.getElementById("logout-link");
//   let brandElement = document.getElementById("brand");
//   let matchLink = document.getElementById("match-link");
//   let langFr = document.getElementById("lang-fr");
//   let langEn = document.getElementById("lang-en");
//   let langEs = document.getElementById("lang-es");
//   if(!loginElement || !logoutElement || !brandElement || !matchLink || !langFr || !langEn || !langEs)
//     return
//   let trslt = translations.fr;
//   if(language == "fr")
//       trslt = translations.fr;
//   else if (language == "en")
//       trslt = translations.en;
//   else if (language == "es")
//       trslt = translations.es;
//   loginElement.innerText = trslt.login;
//   logoutElement.innerText = trslt.logout;
//   brandElement.innerText = trslt.brand;
//   matchLink.innerText = trslt.match;
//   langFr.innerText = trslt.lang_fr;
//   langEn.innerText = trslt.lang_en;
//   langEs.innerText = trslt.lang_es;
// }

// function setLanguageLogin (language) {
//   let btnLogin = document.getElementById("btn_signup")
//   let btnSignup = document.getElementById("signup")
//   let si = document.getElementById("btn_signup")
//   if(!btnSignup || !btnLogin)
//     return
//   setLanguageNav(language)
//   let trslt = translations.fr;
//   if(language == "fr")
//       trslt = translations.fr;
//   else if (language == "en")
//       trslt = translations.en;
//   else if (language == "es")
//       trslt = translations.es;
//   document.getElementsByTagName("label")[0].innerHTML = trslt.username;
//   document.getElementsByTagName("label")[1].innerHTML = trslt.password;
//   btnLogin.innerHTML = trslt.button_login;
//   document.getElementsByTagName("p")[2].innerHTML = trslt.no_account
//   btnSignup.innerHTML = trslt.signup
// }


// function setLanguageSignup (language){
//   setLanguageNav(language)
//   let trslt = translations.fr;
//   if(language == "fr")
//       trslt = translations.fr;
//   else if (language == "en")
//       trslt = translations.en;
//   else if (language == "es")
//       trslt = translations.es;
//   document.getElementsByTagName("label")[0].innerHTML = trslt.username;
//   document.getElementsByTagName("label")[1].innerHTML = trslt.password;
//   document.getElementsByTagName("label")[2].innerHTML = trslt.password_conf;
//   document.getElementsByTagName("label")[3].innerHTML = trslt.enable_2fa;
//   document.getElementsByClassName("helptext")[0].innerHTML = trslt.help_text;
//   document.getElementsByClassName("helptext")[1].innerHTML = trslt.help_text2;
//   let btnSignup = document.getElementById("btn_signup")
//   if(btnSignup)
//     btnSignup.innerHTML = trslt.signup;
// }

// const translations = {
//   fr: {
//       home: "Accueil",
//       match:"Match",
//       ia_match: "Match contre IA",
//       tournament: "Tournoi",
//       title: "Bienvenue dans le monde de Pong",
//       parag: "Ici, vous pouvez jouer au pong contre une IA raisonnable, \
//       jouez contre un ami ou défiez un groupe de vos amis pour déterminer \
//       qui est le meilleur joueur de pong dans un tournoi épique.",
//       brand: "Monde de Pong",
//       start: "Démarrer",
//       stop:"Arrêter",
//       french: "Français",
//       english: "Anglais",
//       spanish: "Espagnol",
//       save: "Enregistrer",
//       joueur1: "Joueur 1 :",
//       joueur2: "Joueur 2 :",
//       ord_title: "ORDINATEUR",
//       title_tournoi: "Tournoi",
//       // title_part: "Participants au tournoi:",
//       loginPlayer: "Login du joueur:",
//       btn_part: "Participer",
//       btn_launch: "Lancer le tournoi",
//       join_game: "rejoindre",
//       game_id_text: "ID du match pour rejoindre",
//       create_game: "Créer un jeu",
//       login: "Connexion/Inscription",
//       logout: "Déconnexion",
//       lang_fr: "Français",
//       lang_en: "Anglais",
//       lang_es: "Espagnol",
//       choose_title: "Choisis ton jeu",
//       choose_dual: "Duel",
//       choose_tour: "Tournoi",
//       player_title: "Nom du joueur 1",
//       remote_game: "Match à distance",
//       local_game: "Match local",
//       player2_title: "Nom du joueur 2",
//       start_game: "Commencer",
//       text_1: "Le gagnant est",
//       text_2: "🎉 Félicitations ! 🎉",
//       next_btn: "Suivant",
//       result_text: "Resultat: ",
//       first_match: "Premier match: ",
//       second_match: "Deuxieme match: ",
//       btn_begin_match: "Commencer le match",
//       end_btn: "Terminer",
//       username: "nom d'utilisateur",
//       password: "mot de passe",
//       button_login: "Se connecter",
//       no_account: "Vous n'avez pas de compte ?",
//       signup: "S'inscrire",
//       help_text: "Requis. 15 caractères ou moins. Lettres, chiffres et @/./+/-/_ uniquement.",
//       help_text2: "Activez l'authentification à deux facteurs pour plus de sécurité.",
//       password_conf: "Confirmation mot de passe",
//       enable_2fa: "Activer 2FA",
//   },
//   en: {
//       home: "Home",
//       match:"Match",
//       ia_match: "AI Match",
//       tournament: "Tournament",
//       title: "Welcome to the world of Pong",
//       parag: "Here you can play pong against a reasonable AI, play against a friend, \
//       or challenge a bunch of your friends to determine who is the best pong player in \
//       an epic tournament.",
//       brand: "World of Pong",
//       start: "Start",
//       stop:"Stop",
//       french: "French",
//       english: "English",
//       spanish: "Spanish",
//       save: "Save",
//       joueur1: "Player 1 :",
//       joueur2: "Player 2 :",
//       ord_title: "COMPUTER",
//       title_tournoi: "Tournament",
//       // title_part: "Tournament participants:",
//       loginPlayer: "Player Login:",
//       btn_part: "Participate",
//       btn_launch: "Start the tournament",
//       join_game: "join",
//       game_id_text: "Game ID to join",
//       create_game: "Create Game",
//       login: "Login/Sign up",
//       logout: "Logout",
//       lang_fr: "French",
//       lang_en: "English",
//       lang_es: "Spanish",
//       choose_title: "Choose your game",
//       choose_dual: "Dual",
//       choose_tour: "Tournament",
//       player_title: "Player name 1",
//       player2_title: "Player name 2",
//       remote_game: "Remote match",
//       local_game: "Local match",
//       start_game: "Start",
//       text_1: "The winner is",
//       text_2: "🎉 Congratulations ! 🎉",
//       next_btn: "Next",
//       result_text: "Result: ",
//       first_match: "First match: ",
//       second_match: "Second match: ",
//       btn_begin_match: "Start the match",
//       end_btn: "Finish",
//       username: "username",
//       password: "password",
//       button_login: "Login",
//       no_account: "Don't have an account?",
//       signup: "Sign up",
//       help_text: "Required. 15 characters or fewer. Letters, digits and @/./+/-/_ only.",
//       help_text2: "Enable Two-Factor Authentication for added security.",
//       password_conf: "Password confirmation",
//       enable_2fa: "Enable 2FA",
//   },
//   es: {
//       home: "Bienvenida",
//       match: "Fósforo",
//       ia_match: "Partido contra IA",
//       tournament: "Torneo",
//       title: "Bienvenido al mundo de Pong",
//       parag: "Aquí puedes jugar al pong contra una IA razonable, juega contra un amigo \
//       o desafía a un grupo de amigos para determinar quién es el mejor jugador de pong \
//       en un torneo épico.",
//       brand: "Mundo de Pong",
//       start: "Comenzar",
//       stop: "Detener",
//       french: "Francés",
//       english: "Inglés",
//       spanish: "Español",
//       save: "Ahorrar",
//       joueur1: "Jugador 1 :",
//       joueur2: "Jugador 2 :",
//       ord_title: "COMPUTADORA",
//       title_tournoi: "Torneo",
//       // title_part: "Participantes del torneo:",
//       loginPlayer: "Inicio de sesión del jugador:",
//       btn_part: "Participar",
//       btn_launch: "Comenzar el torneo",
//       join_game: "unirse",
//       game_id_text: "ID del juego para unirse",
//       create_game: "Crear juego",
//       login: "Acceso/Inscribirse",
//       logout: "Cerrar sesión",
//       lang_fr: "Francés",
//       lang_en: "Inglés",
//       lang_es: "Español",
//       choose_title: "Elige tu juego",
//       choose_dual: "Doble",
//       choose_tour: "Torneo",
//       player_title: "Nombre del jugador 1",
//       player2_title: "Nombre del jugador 2",
//       remote_game: "Partido remoto",
//       local_game: "Partido local",
//       start_game: "Comenzar",
//       text_1: "El ganador es",
//       text_2: "🎉 Felicitaciones ! 🎉",
//       next_btn: "Próximo",
//       result_text: "Resultado",
//       first_match: "Primer partido",
//       second_match: "segundo partido",
//       btn_begin_match: "Comenzar el partido",
//       end_btn: "Terminar",
//       username: "nombre de usuario",
//       password: "contraseña",
//       button_login: "Acceso",
//       no_account: "¿No tienes una cuenta?",
//       signup: "Inscribirse",
//       help_text: "Requerido. 15 caracteres o menos. Letras, dígitos y @/./+/-/_ únicamente.",
//       help_text2: "Habilite la autenticación de dos factores para mayor seguridad.",
//       password_conf: "Confirmación de contraseña",
//       enable_2fa: "Habilitar 2fa",
//   }
// }
