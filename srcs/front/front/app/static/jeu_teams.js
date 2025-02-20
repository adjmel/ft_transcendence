"use strict";
// let languageSelect = document.querySelector("select");
import { incrementCacheBust } from "./cacheBust.js";
import { fetchConnection } from "./load_html.js";
// import { setLanguage } from "./multi-language.js";
let nextBtn = document.querySelector("#next-btn");

let remoteGame = document.querySelector("#remote-game");
var canvas;
var loop = 0;
var curTime = Date.now();
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
const MOVE_SPEED = 300;
const BALLR = 5;
const FPS = 30;
const digitwidth = 20;
const digitheight = 40;
const digitspacing = 10;

var data = {
  request: "",
  mod: "",
  player1_id: "",
  player2_id: "",
  player3_id: "",
  player4_id: "",
  ball1_x: 0.0,
  ball1_y: 0.0,
  ball1_vel_x: 0.0,
  ball1_vel_y: 0.0,
  ball2_x: 0.0,
  ball2_y: 0.0,
  ball2_vel_x: 0.0,
  ball2_vel_y: 0.0,
  player1_x: 0.0,
  player1_y: 0.0,
  player2_x: 0.0,
  player2_y: 0.0,
  player3_x: 0.0,
  player3_y: 0.0,
  player4_x: 0.0,
  player4_y: 0.0,
  player1_dir: 0,
  player2_dir: 0,
  player3_dir: 0,
  player4_dir: 0,
  player1_score: 0,
  player2_score: 0,
  playing: false,
  lastMove: Date.now(),
  lastUpdate: Date.now(),
  updateTime: Date.now(),
}

if (document.getElementById("btn_signup")) fetchConnection();

if (remoteGame) {
  remoteGame.addEventListener("click", function (event) {
    event.preventDefault();
    joinGame("Blue", "Green");
  });
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

async function joinGame(player1, player2) {
  var gameElement = document.getElementById("game")
  if (gameSocket) {
    gameSocket.close();
    gameSocket = null;
  }
  if (gameElement)
    gameElement.style.display = "block";
  data["player1_id"] = player1;
  data["player3_id"] = player2;
  data.mod = "remote";
  fetch('/pong_teams/jeu/', {
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
        '/wss/pong_teams/' +
        gameID +
        '/'
      );
      //if (!gameSocket)
      //  console.log("no web socket");
      //else
      //  console.log(gameSocket);
    });
  await new Promise(r => setTimeout(r, 1000));
  if (!isHost) {
    //console.log(isHost);
    data.player2_id = "Red";
    data.player4_id = "Yellow";
    //console.log("sending join");
    gameSocket.send(JSON.stringify({
      'request': "join",
      'playerID2': data["player2_id"],
      'playerID4': data["player4_id"],
    }));
    // gameSocket.addEventListener("open", pendingJoin);
    connectionTimeout = setTimeout(() => {
      gameSocket.close();
      gameSocket = null;
      if (document.getElementById("announce"))
        document.getElementById("announce").innerHTML = "connection timedout.";
    }, 3000);
  }
  gameSocket.addEventListener("message", (event) => {
    recieveData(event.data);
  });
  await initGame();
  let announceMessage = document.getElementById("announce")
  if (announceMessage)
    announceMessage.innerHTML = "Waiting for other player...";
}


if (nextBtn)
  nextBtn.addEventListener("click", function () {
    loadPageAndScript("/home/", "index.js");
  });


function loadPageAndScript(url, script) {
  fetch(url)
    .then((response) => response.text())
    .then((text) => {
      let content = document.querySelector("#content")
      if (content)
        content.innerHTML = text;
      // setLanguageNav(getCookie("lang")); //appliquer le langage à la navbar fonction du cookie "langue"
      var page = url.slice(1, -1);
      // setLanguage(getCookie("lang"), page);
      fetchScript(script);
    });
}

function fetchScript(value) {
  incrementCacheBust();
  var script = document.getElementById("extra_script_js");
  if (script && script.parentNode) {
    script.parentNode.removeChild(script); //script.src = "/static/" + value;
  }
  script = document.createElement("script");
  const cacheBustingParam = `v=${new Date().getTime()}`;
  script.src = `/static/${value}?${cacheBustingParam}`;
  script.id = "extra_script_js";
  script.type = "module";
  var index_script = document.getElementById("script_js");
  if (index_script && index_script.parentNode)
    index_script.parentNode.insertBefore(script, index_script.nextSibling);
}
async function initGame() {
  data["request"] = "gameInit";
  try {
    const response = await fetch('/pong_teams/jeu/', {
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
    // response.text().then(text => {throw new Error(text);});
    //throw new Error(response.status + " " + response.statusText + "\n" + response.body); 
  }
  catch ({ name, message }) {
    gameStop()
    //document.querySelector('#jeu-div').innerHTa5937ML = message
    console.error(message);
  }
}

function checkConnection() {
  let announceMessage = document.getElementById("announce")
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
      if (announceMessage)
        announceMessage.innerHTML = "Please wait, connection to second player unstable.";
      connection_stat = 2;
    }
  if (curTime - serverPing > 250) {
    //console.log("Server Lag = " + (curTime - serverPing));
    if (announceMessage)
      announceMessage.innerHTML = "Please wait, server connection issue...";
    connection_stat = 1;
  }
  if (connection_stat != 0)
    connectionTimeout = setTimeout(() => {
      //console.log("connection" + connection_stat);
      if (connection_stat != 0) {
        gameStop();
        if (announceMessage)
          announceMessage.innerHTML = "connection timedout.";
      }
      else {
        if (announceMessage)
          announceMessage.innerHTML = "               ";
      }
    }, 3000);
}

async function gameLoop() {
  let announceMessage = document.getElementById("announce")
  playerMove();
  if (connection_stat == 0 && announceMessage)
    announceMessage.innerHTML = "                   ";
  if (isHost && (ready || connection_stat != 0)) {
    ready = false;
    data["request"] = "update";
    data["lastUpdate"] = data["updateTime"];
    data["updateTime"] = Date.now();
    if (connection_stat != 0)
      data["lastUpdate"] = data["updateTime"];
    if (gameSocket && gameSocket.readyState === WebSocket.OPEN)
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
  preventQuit()
  window.onkeyup = function (e) {
    pressedKeys[e.keyCode] = false;
    //console.log(e.keyCode);
  }
  window.onkeydown = function (e) {
    pressedKeys[e.keyCode] = true;
    //console.log(e.keyCode);
  }
  if (connectionTimeout != null) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }
  if (!loop) {
    data["playing"] = true;
    data["updateTime"] = Date.now();
    data["lastUpdate"] = data["updateTime"];
    loop = setInterval(gameLoop, (1 / FPS) * 1000);
    connection = setInterval(checkConnection, 5000 / FPS);
  }
}

async function gameStop() {
  if (gameSocket)
    gameSocket.close();
  if (loop) {
    clearInterval(connection);
    clearInterval(loop);
    loop = null;
    connection = null;
  }
}

async function gameClear() {
  gameStop();
  initGame();
}

async function playerMove() {
  var dir = 0;
  if (isHost) {
    if (pressedKeys[80] == true)
      dir = -1;
    else if (pressedKeys[76] == true)
      dir = 1;
    data.player3_dir = dir;
    dir = 0;
    if (pressedKeys[87] == true)
      dir = -1;
    else if (pressedKeys[83] == true)
      dir = 1;
    data.player1_dir = dir;
    return;
  }
  else {
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
    data.player4_dir = dir;
    gameSocket.send(JSON.stringify({
      'request': "move",
      'dir1': data.player2_dir,
      'dir2': data.player4_dir,
    }));
  }
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
      gameSocket.close();
      if (announceMessage)
        announceMessage.innerHTML = "game is already full";
      break;
    case 'win':
      var winner;
      let gameWinner = document.getElementById("game_winner")
      let gameResultPannel = document.getElementById("game_result_pannel")
      let gameElement = document.getElementById("game")
      gameStop();
      if (gameData["player1_score"] >= 5)
        winner = gameData["player1_id"] + " " + gameData["player3_id"];
      else
        winner = gameData["player2_id"] + " " + gameData["player4_id"];
      if (gameWinner)
        gameWinner.innerHTML = winner;
      const event = new Event("win", { detail: winner });
      window.dispatchEvent(event);
      if (gameResultPannel && gameElement) {
        gameResultPannel.style.display = "block";
        gameElement.style.display = "none";
      }
      break;
    case 'start':
      gameStart();
      let player1 = document.querySelector("#player1")
      let player2 = document.querySelector("#player2")
      let player3 = document.querySelector("#player3")
      let player4 = document.querySelector("#player4")
      data.player1_id = gameData.playerID1;
      data.player3_id = gameData.playerID3;
      if (player1 && player2 && player3 && player4) {
        if (isHost) {
          player1.setAttribute("style", "display:block");
          player3.setAttribute("style", "display:block");
        }
        else {
          player2.setAttribute("style", "display:block");
          player4.setAttribute("style", "display:block");
        }
      }

      break;
    case 'move':
      if (isHost) {
        if (connection_stat == 2)
          connection_stat = 0;
        data.lastMove = Date.now();
        data["player2_dir"] = gameData["dir1"];
        data["player4_dir"] = gameData["dir2"];
      }
      if (!isHost && connection_stat == 1)
        connection_stat = 0;
      break;
  }
  if (!isHost)
    return;
  switch (gameData["request"]) {
    case 'join':
      if (data["player1_id"] != gameData["playerID2"]) {
        data["player2_id"] = gameData["playerID2"];
        data["player4_id"] = gameData["playerID4"];
        gameSocket.send(JSON.stringify({ 'request': "ready", 'playerID1': data["player1_id"], 'playerID3': data["player3_id"] }));
      }
      else {
        gameSocket.send(JSON.stringify({ 'request': "reject", 'player': gameData["playerID2"] }));
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
  context.fillRect(data["player1_x"], data["player1_y"], PLAYER_WIDTH, PLAYER_HEIGHT);
  context.fillStyle = 'red';
  context.fillRect(data["player2_x"], data["player2_y"], PLAYER_WIDTH, PLAYER_HEIGHT);
  context.fillStyle = 'green';
  context.fillRect(data["player3_x"], data["player3_y"], PLAYER_WIDTH, PLAYER_HEIGHT);
  context.fillStyle = 'yellow';
  context.fillRect(data["player4_x"], data["player4_y"], PLAYER_WIDTH, PLAYER_HEIGHT);

  // Draw ball
  context.beginPath();
  context.fillStyle = 'white';
  context.arc(data["ball1_x"], data["ball1_y"], BALLR, 0, Math.PI * 2, false);
  context.arc(data["ball2_x"], data["ball2_y"], BALLR, 0, Math.PI * 2, false);
  context.fill();

  //Update score
  //document.getElementById("player1-score").textContent = data["player1_score"];
  //document.getElementById("player2-score").textContent = data["player2_score"];

  drawNumber(canvas.width / 2 - (digitwidth * 3 + 10), 50, data["player1_score"]);
  drawNumber(canvas.width / 2 + (digitwidth), 50, data["player2_score"]);

  curTime = Date.now();
  //document.getElementById("gameid-value").textContent = game_id;
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
    case 6:
      context.fillStyle = 'white';
      context.fillRect(x, y, digitwidth, digitheight);
      context.fillStyle = 'black';
      context.fillRect(x + digitwidth / 3, y + digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
      context.fillRect(x + digitwidth / 3, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth / 3, digitheight / 4);
      break;
    case 7:
      context.fillStyle = 'white';
      context.fillRect(x, y, digitwidth, digitheight);
      context.fillStyle = 'black';
      context.fillRect(x, y + digitwidth / 3, digitwidth * 2 / 3, digitheight * 2 / 3 + digitwidth / 3);
      break;
    case 8:
      context.fillStyle = 'white';
      context.fillRect(x, y, digitwidth, digitheight);
      context.fillStyle = 'black';
      context.fillRect(x + digitwidth / 3, y + digitwidth / 3, digitwidth / 3, digitheight / 4);
      context.fillRect(x + digitwidth / 3, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth / 3, digitheight / 4);
      break;
    case 9:
      context.fillStyle = 'white';
      context.fillRect(x, y, digitwidth, digitheight);
      context.fillStyle = 'black';
      context.fillRect(x + digitwidth / 3, y + digitwidth / 3, digitwidth / 3, digitheight / 4);
      context.fillRect(x, y + digitheight - digitheight / 4 - digitwidth / 3, digitwidth * 2 / 3, digitheight / 4);
      break;
    default:
      break;
  }
}
