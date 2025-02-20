// import { setLanguage, setLanguageNav } from "./multi-language.js";
import { getCookie, setupConnection } from "./load_html.js";

// import { setLanguage } from "./multi-language.js";
let nb_games = 0;
let NB_PLAYERS = 0;
let username = document.getElementById("usernamePlayer");

let participantsArray;
export let matchArray;

///1. recueillir les username et les afficher en HTML

export function joinTournament(e) {
  // Gérer les attaques xss et les erreurs d'username
  if (xss_check() || checkInput(username)) return;
  else if (NB_PLAYERS > 3) {
    // Checker le nombre de players
    var msg = "This tournament allows 4 players maximum";
    //if (document.getElementsByTagName("select")[0].value == "fr")
    //  msg = "Ce tournoi autorise 4 joueurs maximum";
    //else if (document.getElementsByTagName("select")[0].value == "es")
    //  msg = "Este torneo permite 4 jugadores como máximo.";
    alert(msg);
  } //Ajouter les participants à la waitlist
  else {
    if (username && username.value != "") {
      addPlayerList(username.value);
      NB_PLAYERS++;
      if (NB_PLAYERS == 4) {
        document.getElementById("btn-launch-game").setAttribute("style", "display:block");
        document.getElementById("join-btn").setAttribute("style", "display:none");
        document.getElementById("login-player").setAttribute("style", "display:none");
      }
      username.value = "";
      return;
    }
  }
}

function xss_check() {
  var username_xss = document.getElementById("usernamePlayer").value;
  var regex = /^[a-zA-Z0-9_\-]+$/;
  if (!regex.test(username_xss) && username.value != "") {
    // Vérifie si le nom d'utilisateur correspond à l'expression régulière
    var msg2 = "The username is invalid. Please do not use special characters.";
    //if (document.getElementsByTagName("select")[0].value == "fr")
    //  msg2 =
    //    "Le nom d'utilisateur n'est pas valide. Veuillez ne pas utiliser de caractères spéciaux.";
    //else if (document.getElementsByTagName("select")[0].value == "es")
    //  msg2 =
    //    "El nombre de usuario no es válido. Por favor no utilice caracteres especiales.";
    alert(msg2);
    return 1;
  }
  return 0;
}

function checkInput(username) {
  var myLists = document.getElementsByTagName("li");
  if (username.value != "") {
    for (var i = 0; i < myLists.length; i++) {
      if (myLists[i].innerHTML == username.value) {
        var msg3 = "username already used!";
        //if (document.getElementsByTagName("select")[0].value == "fr")
        //  msg3 = "nom d'utilisateur déjà utilisé!";
        //else if (document.getElementsByTagName("select")[0].value == "es")
        //  msg3 = "nombre de usuario ya utilizado!";
        alert(msg3);
        return 1;
      }
    }
  }
  return 0;
}

function addPlayerList(login) {
  const newUser = document.createElement("li");
  const newContent = document.createTextNode(login);
  newUser.appendChild(newContent);

  const username = document.getElementById("player-list");

  username.appendChild(newUser);

  newUser.setAttribute("id", "joueur_" + NB_PLAYERS);
  newUser.setAttribute("class", "list-group-item flex-fill");
  newUser.setAttribute("className", login);
}

///2 Faire le matchmaking

//Au click du bouton "lancer le tournoi", on execute la fonction launchTournament

export function launchTournament(e) {
  e.preventDefault();
  //Checker le nombre de joueurs
  if (NB_PLAYERS < 4) {
    var msg4 = "We have to wait for another player to join the tournament";
    //if (document.getElementsByTagName("select")[0].value == "fr")
    //  msg4 = "Nous devons attendre qu'un autre joueur rejoigne le tournoi";
    //else if (document.getElementsByTagName("select")[0].value == "es")
    //  msg4 = "Hay que esperar a que se una otro jugador al torneo.";
    alert(msg4);
    return;
  }
  matchMaking();
  begin_tournaments();
}

function matchMaking() {
  participantsArray = [0, 1, 2, 3]; //Ce tableau représente les ID de chaque participants
  matchArray = new Map();
  let id_match = 0;
  var _max = NB_PLAYERS;
  var player1;
  var player2;
  while (id_match < 2) {
    //On va déterminer au hasard 2 ID de joueurs grâce à la fonction generatePlayer,
    if (id_match) {
      player1 = participantsArray.shift();
      player2 = participantsArray.shift();
    } else {
      player1 = generatePlayer(participantsArray, _max);
      participantsArray.splice(participantsArray.indexOf(player1), 1);
      player2 = generatePlayer(participantsArray, _max);
      participantsArray.splice(participantsArray.indexOf(player2), 1);
    }
    _max -= 2;

    //puis les enlever de notre tableau de participants

    //On ajoute dans un deuxieme tableau (matchArray) les deux joueurs correspondant aux deux ID qu'on vient de déterminer au hasard
    //La fonction set nous permet d'avoir pour chaque case de notre tableau:
    /////un identifiant de match      et l'username du joueur
    matchArray.set(
      "player_" + id_match + "_0",
      document.getElementById("joueur_" + player1).innerHTML
    );
    matchArray.set(
      "player_" + id_match + "_1",
      document.getElementById("joueur_" + player2).innerHTML
    );
    nb_games++;
    id_match++;
  }
  NB_PLAYERS = 0;
}

function generatePlayer(arr, NB_PLAYERS) {
  //Générer un chiffre aléatoire entre 0 et 3
  var num = Math.floor(Math.random() * NB_PLAYERS);
  while (isInArr(arr, num) == 0) num = Math.floor(Math.random() * NB_PLAYERS);
  return num;
}

function isInArr(arr, num) {
  var i = 0;
  while (arr[i] != null) {
    if (arr[i] == num) return 1;
    i++;
  }
  return 0;
}

async function begin_tournaments() {
  const element = document.getElementById("div-tournoi");
  if (element)
    element.remove();
  history.pushState({ page: "matchmaking" }, "", "");
  loadPageAndScript("/matchmaking/", "matchmaking.js");
}

function loadPageAndScript(url, script) {
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getCookie("jwttoken_access"),
    },
  })
    .then((response) => response.text())
    .then((text) => {
      document.querySelector("#tournament").innerHTML = text;
      if (text.includes('<form method="post" id="login-form">'))
        setupConnection();
      else
        fetchScript(script);
      // setLanguageNav(getCookie("lang")); //appliquer le langage à la navbar fonction du cookie "langue"
      var page = url.slice(1, -1);
      // setLanguage(getCookie("lang"), page);
    });
}

function fetchScript(value) {
  var script = document.getElementById("extra_script_js");
  if (script) {
    script.parentNode.removeChild(script); //script.src = "/static/" + value;
  }
  script = document.createElement("script");
  const cacheBustingParam = `v=${new Date().getTime()}`;
  script.src = `/static/${value}?${cacheBustingParam}`;
  script.id = "extra_script_js";
  script.type = "module";
  var index_script = document.getElementById("script_js");
  index_script.parentNode.insertBefore(script, index_script.nextSibling);
}
///3 Lancer les matchs
