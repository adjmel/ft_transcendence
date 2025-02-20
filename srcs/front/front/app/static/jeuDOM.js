import { joinGame } from "./jeu.js";
import { incrementCacheBust } from "./cacheBust.js";
// import { setLanguage, setLanguageNav } from "./multi-language.js";
import { fetchConnection, getCookie } from "./load_html.js";
let localGame = document.querySelector("#local-game");
let remoteGame = document.querySelector("#remote-game");
let nextBtn = document.querySelector("#next-btn");

if (localGame)
  localGame.addEventListener("click", function (event) {
    event.preventDefault();
    joinGame("Blue", "Red");
  });

if (remoteGame)
  remoteGame.addEventListener("click", function (event) {
    event.preventDefault();
    joinGame("Blue", "");
  });

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

if (document.getElementById("btn_signup")) fetchConnection();
