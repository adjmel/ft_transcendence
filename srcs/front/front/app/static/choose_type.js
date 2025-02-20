import { getCacheBustValue } from "./cacheBust.js";
import { fetchConnection, getCookie, setupConnection } from "./load_html.js";
// import { setLanguage } from "./multi-language.js";

if (document.getElementById("btn_signup")) fetchConnection()

var match_link = document.getElementById("match_link");
if (match_link) {
    match_link.addEventListener("click", function (event) {
    event.preventDefault();
    loadPageAndScript("/jeu/", "jeuDOM.js");
    history.pushState({ page: "jeu" }, "", "");
    });
}

var teams_link = document.getElementById("teams_link");
if (teams_link)
    teams_link.addEventListener("click", function (event) {
    event.preventDefault();
    loadPageAndScript("/jeu_teams/", "jeu_teams.js");
    history.pushState({ page: "jeu_teams" }, "", "");
});

var tournamentLink = document.getElementById("tournoi_link");
if (tournamentLink) {
    tournamentLink.addEventListener("click", function (event) {
    event.preventDefault();
    loadPageAndScript("/tournoi/", "tournoiDOM.js");
    history.pushState({ page: "tournoi" }, "", "");
    });
}

let dualMatch = document.querySelector("#dual-match")
if(dualMatch){
    dualMatch.addEventListener("click", function (event) {
        event.preventDefault();
        loadPageAndScript('/jeu/', 'jeuDOM.js');
        history.pushState({ page: 'jeu' }, "", "");
    })
}

let tournamentMatch = document.querySelector("#tournament-match")
if(tournamentMatch){
    tournamentMatch.addEventListener("click", function (event) {
        event.preventDefault();
        loadPageAndScript('/tournoi/', 'tournoiDOM.js');
        history.pushState({ page: 'tournoi' }, "", "");
    })
}

export function loadPageAndScript(url, script) {
    fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getCookie("jwttoken_access"),
        },
    })
    .then(response => response.text())
    .then(text => {
        let textContent = document.querySelector('#content')
        if (textContent && text.includes('<form method="post" id="login-form">')) {
            textContent.innerHTML = text;
            setupConnection();
        } else if(textContent){
            textContent.innerHTML = text;
            fetchScript(script);
        }
        var page = url.slice(1, -1)
        // setLanguage(getCookie('lang'), page) 
    });
}

function fetchScript(value) {
    var script = document.getElementById('extra_script_js');
    if (script && script.parentNode) {
        script.parentNode.removeChild(script); //script.src = "/static/" + value;
    }
        script = document.createElement('script');
        const cacheBustingParam = `cacheBust=${getCacheBustValue()}`;
        script.src = `/static/${value}?${cacheBustingParam}`;
        script.id = 'extra_script_js';
        script.type = "module";
        var index_script = document.getElementById('script_js');
        if(index_script && index_script.parentNode)
            index_script.parentNode.insertBefore(script, index_script.nextSibling);
}