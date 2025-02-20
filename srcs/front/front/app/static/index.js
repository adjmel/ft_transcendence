// import { setLanguage, setLanguageNav } from "./multi-language.js";
// import { getCookie } from "./load_html.js";
import { getCacheBustValue, incrementCacheBust } from "./cacheBust.js";

import { fetchConnection, setupConnection } from "./load_html.js";

/////////////////JEU ET FLECHES NAVIGATEURS///////////////

function setCookie(cname, cvalue, exmin) {
  const d = new Date();
  d.setTime(d.getTime() + exmin * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
}

export function fetchNavbar() {
  fetch("/get_navbar/", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getCookie("jwttoken_access"),
    },
  })
    .then((response) => response.text())
    .then((text) => {
      var navbarElement = document.querySelector("#navbar");
      if(navbarElement)
        navbarElement.innerHTML = text;

      var matchsLink = document.getElementById("all_matchs_link");
      if (matchsLink) {
        matchsLink.addEventListener("click", function (event) {
          event.preventDefault();
          loadPageAndScript("/choose_type/", "choose_type.js");
          history.pushState({ page: "choose_type" }, "", "");
        });
      }


      var brand = document.getElementById("brand");
      if (brand) {
        brand.addEventListener("click", function (event) {
          event.preventDefault();
          loadPageAndScript("/home/", "index.js");
          history.pushState({ page: "home" }, "", "");
        });
      }

      var login = document.getElementById("login");
      if (login) {
        login.addEventListener("click", function (event) {
          event.preventDefault();
          history.pushState({ page: "2fa/login" }, "", "");
          fetchConnection();
        });
      }

      var logout_link = document.getElementById("logout-link");
      if (logout_link) {
        logout_link.addEventListener("click", function (event) {
          event.preventDefault();
          logout();
        });
      }
      // let lang;
      // let languageSelect = document.querySelector("select");
      // if (languageSelect) {
      //   languageSelect.value = getCookie("lang");
      //   languageSelect.addEventListener("change", (event) => {
      //     if(event.target)
      //       lang = event.target.value;
      //     if(lang)
      //       setLanguage(lang, history.state.page);
      //   });
      // }
    });
}

function logout() {
  fetch("/2fa/logout/", {
    method: "GET",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  })
    .then((response) => response.text())
    .then((text) => {
      let content = document.querySelector("#content")
      if(content)
        content.innerHTML = text;
      setupConnection();
      setCookie("jwttoken_access", "", 0);
      setCookie("jwttoken_refresh", "", 0);
      fetchNavbar();
    });
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function fetchScript(value) {
  incrementCacheBust();
  var script = document.getElementById("extra_script_js");
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
  if (value == "index.js") return;
  script = document.createElement("script");
  const cacheBustingParam = `cacheBust=${getCacheBustValue()}`;
  script.src = `/static/${value}?${cacheBustingParam}`;
  script.id = "extra_script_js";
  script.type = "module";
  var index_script = document.getElementById("script_js");
  if(index_script && index_script.parentNode)
    index_script.parentNode.insertBefore(script, index_script.nextSibling);
}

// Fonction pour charger une nouvelle page et un script
function loadPageAndScript(url, script) {
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getCookie("jwttoken_access"),
    },
  })
    .then((response) => response.text())
    .then((text) => {
      let content = document.querySelector("#content")
      if (content && text.includes('<form method="post" id="login-form">')) {
        content.innerHTML = text;
        setupConnection();
      } else if(content) {
        content.innerHTML = text;
        fetchScript(script);
      }
      // setLanguageNav(getCookie("lang")); //appliquer le langage à la navbar fonction du cookie "langue"
      var page = url.slice(1, -1);
      // setLanguage(getCookie("lang"), page);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadPageAndScript("/home/", "index.js");
  history.pushState({ page: "home" }, "", "");

  // Tableau des pages et scripts associés
  const pages = [
    { path: "/jeu/", script: "jeuDOM.js" },
    { path: "/jeu_teams/", script: "jeu_teams.js" },
    { path: "/ordinateur/", script: "ordinateur.js" },
    { path: "/tournoi/", script: "tournoiDOM.js" },
    { path: "/home/", script: "index.js" },
    { path: "/choose_type/", script: "choose_type.js" },
    { path: "/2fa/login/", script: "load_html.js" },
    { path: "/2fa/signup/", script: "load_html.js" },
  ];
  // Gestion du chargement initial de la page
  const currentPage = pages.find(
    (page) => page.path === window.location.pathname
  );
  if (currentPage) {
    loadPageAndScript(currentPage.path, currentPage.script);
  }

  // Événements pour charger une nouvelle page lorsque l'utilisateur clique sur un lien
  fetchNavbar();
  // Événement pour détecter le changement d'URL dans l'historique du navigateur
  window.onpopstate = function (event) {
    if (event.state && event.state.page) {
      const currentPage = pages.find(
        (page) => page.path === "/" + event.state.page + "/"
      );
      if (currentPage) {
        loadPageAndScript(currentPage.path, currentPage.script);
      }
    }
  };
});

///////////////////////////TRANSLATION PART/////////////////////////////////////
