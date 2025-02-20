import { getCacheBustValue, incrementCacheBust } from "./cacheBust.js";
import { getCookie, setupConnection } from "./load_html.js";
// import { setLanguage } from "./multi-language.js";
let tournamentFunc = await import("./tournoi.js?cacheBust=" + getCacheBustValue());

export let playerList = [];
let playerTurn = 0;

displayMatchMaking();

export async function displayMatchMaking() {
    var matchArray = tournamentFunc.matchArray

    var player1 = document.getElementById("1st-player");
    var player2 = document.getElementById("2nd-player");
    var player3 = document.getElementById("3rd-player");
    var player4 = document.getElementById("4th-player");
    var matchPlayer1 = document.getElementById("matchPlayer1");
    var matchPlayer2 = document.getElementById("matchPlayer2");
    if (!player1 || !player2 || !player3 || !player4 || !matchPlayer1 || !matchPlayer2)
        return

    player1.innerHTML = matchArray.get("player_0_0");
    player2.innerHTML = matchArray.get("player_0_1");
    player3.innerHTML = matchArray.get("player_1_0");
    player4.innerHTML = matchArray.get("player_1_1");

    playerList[0] = player1.innerHTML;
    playerList[1] = player2.innerHTML;
    playerList[2] = player3.innerHTML;
    playerList[3] = player4.innerHTML;
    matchPlayer1.innerHTML = playerList[0];
    matchPlayer2.innerHTML = playerList[1];
    startNextMatch();
    returnHomePage();
}

export function startNextMatch() {
    document.querySelector("#start-next-match")?.addEventListener("click", async function () {
        document.getElementById("matchMaking").setAttribute("style", "display:none");
        const jeuModule = await import("./jeu.js?cacheBust=" + getCacheBustValue());
        // Importer le module dynamiquement
        await loadGame("/jeu/");
        // Appeler la fonction joinGame après le chargement de la page
        jeuModule.joinGame(playerList[playerTurn], playerList[playerTurn + 1])
        playerTurn += 2;
        if (playerTurn == 2)
            secondMatch();
        if (playerTurn == 4)
            finalMatch();
        if (playerTurn == 6)
            endingTournament();
    });
}

function secondMatch() {
    document.querySelector("#next-btn")?.addEventListener("click", async function () {
        let gameWinner = document.getElementById("game_winner")
        if (gameWinner)
            playerList[4] = gameWinner.innerHTML;
        // Reafficher le matchmaking updaté
        document.getElementById("matchPlayer1").innerHTML = playerList[2];
        document.getElementById("matchPlayer2").innerHTML = playerList[3];
        document.getElementById("matchMaking").setAttribute("style", "display:block");
        let winner1 = document.getElementById("winner1");
        if (winner1)
            winner1.innerHTML = playerList[4];
        document.querySelector('#div-jeu').innerHTML = "";
    })
}

function finalMatch() {
    document.querySelector("#next-btn")?.addEventListener("click", async function () {
        let gameWinner = document.getElementById("game_winner")
        if (gameWinner)
            playerList[5] = gameWinner.innerHTML;
        document.getElementById("matchPlayer1").innerHTML = playerList[4];
        document.getElementById("matchPlayer2").innerHTML = playerList[5];
        document.getElementById("matchMaking").setAttribute("style", "display:block");
        let winner2 = document.getElementById("winner2")
        if (winner2)
            winner2.innerHTML = playerList[5];
        document.querySelector('#div-jeu').innerHTML = "";
    })
}

function endingTournament() {
    document.querySelector("#next-btn")?.addEventListener("click", async function () {
        document.getElementById("matchPlayer1").innerHTML = "";
        document.getElementById("matchPlayer2").innerHTML = "";
        document.getElementById("matchMaking").setAttribute("style", "display:block");
        let gameWinner = document.getElementById("game_winner")
        if (gameWinner)
            playerList[6] = gameWinner.innerHTML;

        let button = document.querySelector("#start-next-match")
        let winner = document.getElementById("winner")
        if (!button || !winner)
            return
        winner.innerHTML = "🎉" + playerList[6] + "🎉";
        document.getElementById("start-next-match").setAttribute("style", "display:none");
        document.getElementById("end-btn").setAttribute("style", "display:block");
        document.querySelector('#div-jeu').innerHTML = "";
    })
}

function returnHomePage() {
    document.querySelector("#end-btn")?.addEventListener("click", function () {
        loadPageAndScript("/home/", "index.js")
        history.pushState({ page: 'home' }, "", "");
    })
}

function loadPageAndScript(url, script) {
    fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + getCookie("jwttoken_access"),
        },
    })
        .then(response => response.text())
        .then(text => {
            let content = document.querySelector('#content')
            if (content && text.includes('<form method="post" id="login-form">')) {
                content.innerHTML = text;
                setupConnection();
            } else if (content) {
                content.innerHTML = text;
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
    script.src = "/static/" + value;
    script.id = 'extra_script_js';
    script.type = "module";
    var index_script = document.getElementById('script_js');
    if (index_script && index_script.parentNode)
        index_script.parentNode.insertBefore(script, index_script.nextSibling);
}

async function loadGame(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + getCookie("jwttoken_access"),
            },
        });
        const text = await response.text();

        // Mise à jour du DOM
        if (text.includes('<form method="post" id="login-form">')) {
            document.querySelector('#content').innerHTML = text;
            setupConnection();
        } else {
            let tournamentText = document.querySelector('#div-jeu')
            if (tournamentText)
                tournamentText.innerHTML = text;
            var page = url.slice(1, -1)
            // history.pushState({ page: page }, "", "");
            await new Promise(resolve => requestAnimationFrame(resolve));
        }

    } catch (error) {
        console.error('Erreur lors du chargement de la page:', error);
    }
}
