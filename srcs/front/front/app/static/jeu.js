'use strict';

var canvas;
var loop = 0;
var connection = 0;
var isHost;
var ready = true;
var gameID;
var gameSocket = null;
var connectionTimeout = null;
var pressedKeys = {};
var connection_stat = 0;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;
const BALLR = 5;
const FPS = 60;
const digitwidth = 20;
const digitheight = 40;
const digitspacing = 10;
// let languageSelect = document.querySelector("select");


var data = {
    request: "",
    mod: "",
    player1_id: "",
    player2_id: "",
    ball_x: 0.0,
    ball_y: 0.0,
    ball_vel_x: 0.0,
    ball_vel_y: 0.0,
    player1_x: 0.0,
    player1_y: 0.0,
    player2_x: 0.0,
    player2_y: 0.0,
    player1_dir: 0,
    player2_dir: 0,
    player1_score: 0,
    player2_score: 0,
    lastMove: Date.now(),
    lastUpdate: Date.now(),
    updateTime: Date.now(),
    announce: "",
}

// window.addEventListener('popstate', function(event) {
//     if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
//       gameSocket.close(1000, "Normal closure");  // 1000 est le code de fermeture pour une fermeture normale
//       console.log("websocket closed")
//     }
//   });
  
//   document.querySelector("#all_matchs_link")?.addEventListener("click", function () {
//     if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
//       gameSocket.close(1000, "Normal closure");  // 1000 est le code de fermeture pour une fermeture normale
//       console.log("websocket closed")
//     }
//   })

export async function joinGame(player1, player2) {
    preventQuit();
    let gameElement = document.getElementById("game")
    if (gameSocket) {
        gameSocket.close();
        gameSocket = null;
    }
    if (gameElement)
        gameElement.style.display = "block"
    let announceMessage = document.getElementById("announce")
    data["player1_id"] = player1;
    data["player2_id"] = player2;
    if (player2 == "")
        data.mod = "remote";
    else
        data.mod = "local";
    fetch('/pong/jeu/', {
        method: 'POST',
        body: JSON.stringify({ request: "join", player1_name: data["player1_id"], player2_name: data["player2_id"] })
    })
        .then((response) => response.json())
        .then((resdata) => {
            gameID = resdata.gameID;
            isHost = resdata.isHost;
            //console.log(resdata);
            document.querySelector('#lobby')?.setAttribute("style", "display: none");
            gameSocket = new WebSocket(
                'wss://' +
                window.location.host +
                '/wss/pong/' +
                gameID +
                '/'
            );
            //if (!gameSocket)
            //    console.log("no web socket");
            //else
            //    console.log(gameSocket);
        })
    await new Promise(r => setTimeout(r, 1000));
    if (!isHost) {
        //console.log(isHost);
        data.player2_id = "Red";
        data.player1_id = "Blue";
        //console.log("sending join");
        gameSocket.send(JSON.stringify({
            'request': "join",
            'playerID': data["player2_id"],
        }));
        // gameSocket.addEventListener("open", pendingJoin);
        connectionTimeout = setTimeout(() => {
            gameSocket.close();
            if (announceMessage)
                announceMessage.innerHTML = "connection timedout.";
        }, 3000);
    }
    gameSocket.addEventListener("message", (event) => {
        recieveData(event.data);
    });
    await initGame();
    if (data.mod == "local")
        gameStart();
    else {
        if (announceMessage)
            announceMessage.innerHTML = "Waiting for other player...";
    }
}

async function initGame() {
    data["request"] = "gameInit";
    try {
        const response = await fetch('/pong/jeu/', {
            method: 'POST',
            body: JSON.stringify(data)
        })

        if (response.ok) {
            return response.json()
                .then(response => {
                    data = response;
                    data["request"] = "";
                })
                .catch((error) => { throw new Error(error); });
        }
        //else
            //console.log(response.text())
    }
    catch ({ name, message }) {
        gameStop()
        console.error(message);
    }
}

async function gameLoop() {
    let announceMessage = document.getElementById("announce")
    playerMove();
    if (connection_stat == 0 && announceMessage)
        announceMessage.innerHTML = "";
    if (isHost && (ready || connection_stat != 0)) {
        ready = false;
        data["request"] = "update";
        data["lastUpdate"] = data["updateTime"];
        data["updateTime"] = Date.now();
        if (connection_stat != 0)
            data["lastUpdate"] = data["updateTime"];
        if(gameSocket && gameSocket.readyState === WebSocket.OPEN)
            gameSocket.send(JSON.stringify(data));
    }
}

function preventQuit() {
    const selectors = ["#all_matchs_link", "#brand", "#logout-link"];
    selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener("click", gameStop);
        }
    });
}


async function gameStart() {
    let player1 = document.querySelector("#player1")
    let player2 = document.querySelector("#player2")
    preventQuit()
    // await changeLanguage()
    window.onkeyup = function (e) { pressedKeys[e.keyCode] = false; } // console.log(e.keyCode);
    window.onkeydown = function (e) { pressedKeys[e.keyCode] = true; } // console.log(e.keyCode);
    if (player1 && player2) {
        if (data.mod == "local") {
            player1.setAttribute("style", "display:block");
            player2.setAttribute("style", "display:block");
        }
        else if (isHost) {
            player1.setAttribute("style", "display:block");
            document.getElementById("player1b").setAttribute("style", "display:block");
        }
        else {
            player2.setAttribute("style", "display:block");
            document.getElementById("player2b").setAttribute("style", "display:block");
        }

    }
    if (connectionTimeout != null) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
    if (!loop) {
        data["updateTime"] = Date.now();
        data["lastUpdate"] = data["updateTime"];
        loop = setInterval(gameLoop, (1 / FPS) * 1000);
        connection = setInterval(checkConnection, 5000 / FPS);
    }
}

function checkConnection() {
    let announceMessage = document.getElementById("announce")
    if (!announceMessage)
        return
    var serverPing;
    var playerPing;
    var curTime = Date.now();
    if (isHost) {
        serverPing = data.updateTime;
        playerPing = data.lastMove;
    }
    else {
        playerPing = data.updateTime;
        serverPing = data.lastMove;
    }
    if (data.mod != "local")
        if (curTime - playerPing > 250) {
            announceMessage.innerHTML = "Please wait, connection to second player unstable.";
            connection_stat = 2;
        }
    if (curTime - serverPing > 250) {
        announceMessage.innerHTML = "Please wait, server connection issue...";
        connection_stat = 1;
    }
    if (connection_stat != 0)
        connectionTimeout = setTimeout(() => {
            //console.log("connection" + connection_stat);
            if (connection_stat != 0) {
                gameStop();
                announceMessage.innerHTML = "connection timedout.";
            }
            else
                announceMessage.innerHTML = "";
        }, 3000);
}

window.addEventListener('popstate', function (event) {
    if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
      gameSocket.close(1000, "Normal closure");  // 1000 est le code de fermeture pour une fermeture normale
      //console.log("websocket closed")
      gameStop()
    }
  });
  
  document.querySelector("#all_matchs_link")?.addEventListener("click", function () {
    if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
      gameSocket.close(1000, "Normal closure");  // 1000 est le code de fermeture pour une fermeture normale
      //console.log("websocket closed")
      gameStop()

    }
  })

  document.querySelector("#logout-link")?.addEventListener("click", function () {
    if (gameSocket && gameSocket.readyState === WebSocket.OPEN) {
      gameSocket.close(1000, "Normal closure");  // 1000 est le code de fermeture pour une fermeture normale
      //console.log("websocket closed")
      gameStop()

    }
  })

async function gameStop() {
    if (gameSocket && gameSocket.readyState === WebSocket.OPEN)
        gameSocket.close();
    if (connection) {
        clearInterval(connection);
        connection = null;
    }
    if (loop) {
        clearInterval(loop);
        loop = null;
    }
}

async function playerMove() {
    var dir = 0;
    if (data.mod == "local") {
        if (pressedKeys[80] == true)
            dir = -1;
        else if (pressedKeys[76] == true)
            dir = 1;
        data.player2_dir = dir;
        dir = 0;
        if (pressedKeys[87] == true)
            dir = -1;
        else if (pressedKeys[83] == true)
            dir = 1;
        data.player1_dir = dir;
        return;
    }
    if (pressedKeys[80] == true || pressedKeys[87] == true)
        dir = -1;
    else if (pressedKeys[83] == true || pressedKeys[76] == true)
        dir = 1;
    if (!isHost) {
        if(gameSocket && gameSocket.readyState === WebSocket.OPEN){
            gameSocket.send(JSON.stringify({
                'request': "move",
                'dir': dir,
            }))};
    }
    else
        data["player1_dir"] = dir;
}

function recieveData(resdata) {
    let announceMessage = document.getElementById("announce")
    const gameData = JSON.parse(resdata);
    switch (gameData["request"]) {
        case 'update':
            if (isHost && connection_stat == 1)
                connection_stat = 0;
            if (!isHost && connection_stat == 2)
                connection_stat = 0;
            ready = true;
            data = gameData;
            data["request"] = "";
            draw();
            break;
        case 'reject':
            if (data["player"] == data.player2_id) {
                gameSocket.close();
                if (announceMessage)
                    announceMessage.innerHTML = "game is already full";
            }
            break;
        case 'win':
            var winner;
            gameStop();
            if (gameData["player1_score"] >= 5)
                winner = gameData["player1_id"];
            else
                winner = gameData["player2_id"];
            let gameWinner = document.getElementById("game_winner")
            let gameResultPannel = document.getElementById("game_result_pannel")
            let gameElement = document.getElementById("game")
            if (!gameWinner || !gameResultPannel || !gameElement)
                return
            gameWinner.innerHTML = winner;
            const event = new Event("win", { detail: winner });
            window.dispatchEvent(event);
            gameResultPannel.style.display = "block";
            gameElement.style.display = "none";
            break;
        case 'start':
            gameStart();
            break;
        case 'move':
            if (isHost) {
                if (connection_stat == 2)
                    connection_stat = 0;
                data.lastMove = Date.now();
                data["player2_dir"] = gameData["dir"];
            }
            if (!isHost && connection_stat == 1)
                connection_stat = 0;
    }
    if (!isHost)
        return;
    switch (gameData["request"]) {
        case 'join':
            if (data["player1_id"] != gameData["playerID"] && data["player2_id"] == "") {
                data["player2_id"] = gameData["playerID"];
                gameSocket.send(JSON.stringify({ 'request': "ready" }));
            }
            else {
                gameSocket.send(JSON.stringify({ 'request': "reject", 'player': gameData["playerID"] }));
            }
    }
}


function draw() {
    canvas = document.getElementById("canvas");
    if (!canvas)
        return
    var context = canvas.getContext('2d');

    // Draw field
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    context.strokeStyle = 'white';
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();

    // Draw players
    context.fillStyle = 'blue';
    context.fillRect(0, data["player1_y"], PLAYER_WIDTH, PLAYER_HEIGHT);
    context.fillStyle = 'red';
    context.fillRect(canvas.width - PLAYER_WIDTH, data["player2_y"], PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw ball
    context.beginPath();
    context.fillStyle = 'white';
    context.arc(data["ball_x"], data["ball_y"], BALLR, 0, Math.PI * 2, false);
    context.fill();

    drawNumber(canvas.width / 2 - (digitwidth * 3 + 10), 50, data["player1_score"]);
    drawNumber(canvas.width / 2 + (digitwidth), 50, data["player2_score"]);
}

function drawNumber(x, y, number) {
    if (number > 99)
        number = 99;

    if (number < 10)
        drawDigit(x, y, 0);
    else
        drawDigit(x, y, (number / 10) | 0);

    drawDigit(x + digitwidth + digitspacing, y, number % 10);
}

function drawDigit(x, y, digit) {
    canvas = document.getElementById("canvas");
    if (!canvas)
        return
    var context = canvas.getContext('2d');

    switch (digit) {
        case 0:
            context.fillStyle = 'white';
            context.fillRect(x, y, digitwidth, digitheight);
            context.fillStyle = 'black';
            context.fillRect(x + digitwidth / 3, y + digitwidth / 3, digitwidth / 3, digitwidth * 4 / 3);
            break;
        case 1:
            context.fillStyle = 'white';
            context.fillRect(x + digitwidth * 2 / 3, y, digitwidth / 3, digitheight);
            break;
        case 2:
            context.fillStyle = 'white';
            context.fillRect(x, y, digitwidth, digitheight);
            context.fillStyle = 'black';
            context.fillRect(x, y + digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
            context.fillRect(x + digitwidth / 3, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
            break;
        case 3:
            context.fillStyle = 'white';
            context.fillRect(x, y, digitwidth, digitheight);
            context.fillStyle = 'black';
            context.fillRect(x, y + digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
            context.fillRect(x, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
            break;
        case 4:
            context.fillStyle = 'white';
            context.fillRect(x, y, digitwidth, digitheight);
            context.fillStyle = 'black';
            context.fillRect(x + digitwidth / 3, y, digitwidth / 3, digitheight * 2 / 5);
            context.fillRect(x, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth * 2 / 3, digitheight / 2);
            break;
        case 5:
            context.fillStyle = 'white';
            context.fillRect(x, y, digitwidth, digitheight);
            context.fillStyle = 'black';
            context.fillRect(x + digitwidth / 3, y + digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
            context.fillRect(x, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
            break;
        default:
            break;
    }
}
