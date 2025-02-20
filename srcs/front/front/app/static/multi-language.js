// import { translations } from "./dictionnary.js";

// let match_elt = document.getElementById("match_link");
// let brand = document.getElementById("brand");
// let languageSelect = document.querySelector("select");

// export const setLanguage = (language, path) => {
//     if(languageSelect)
//         document.cookie = "lang=" + languageSelect.value + ";SameSite=None; Secure";
//     setLanguageNav(language)
//     switch (path) {
//         case "home":
//             setLanguageHome(language);
//             break;
//         case "jeu":
//             setLanguageJeuAll(language);
//             break;
//         case "tournoi":
//             setLanguageTour(language);
//             break;
//         case "choose_type":
//             setLanguageChoose(language);
//             break;
//         case "matchmaking":
//             setLanguageMatchmaking(language);
//             break;
//         case "login":
//             setLanguageLogin(language);
//             break;
//         case "signup":
//             setLanguageSignup(language);
//             break;
//         default:
//             break;
//     }
// }


// export const setLanguageNav = (language) => {
//     let trslt = translations.fr;
    
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     brand.innerText = trslt.brand;
//     match_elt.innerText = trslt.match;
//     var element = document.getElementById("login");
//     if (element)
//         element.innerText = trslt.login;
//     element = document.getElementById("logout-link");
//     if (element)
//         element.innerText = trslt.logout;
//     document.getElementById("lang-fr").innerText = trslt.lang_fr;
//     document.getElementById("lang-en").innerText = trslt.lang_en;
//     document.getElementById("lang-es").innerText = trslt.lang_es;
// }



// const setLanguageHome = (language) => {
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     brand.innerText = trslt.brand;
//     document.getElementById("title-pong").innerText = trslt.title;
//     document.getElementById("parag").innerText = trslt.parag;
// }



// const setLanguageTour = (language) => {
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     var element = document.getElementById("title-tournoi")
//     if (element)
//         element.innerText = trslt.title_tournoi;
//     // document.getElementById("title-part").innerText = trslt.title_part;
//     element = document.getElementById("login-player")
//     if (element)
//         element.innerText = trslt.loginPlayer;
//     element = document.getElementById("join-btn")
//     if (element)
//         element.innerText = trslt.btn_part;
//     element = document.getElementById("btn-launch-game")
//     if (element)
//         element.innerText = trslt.btn_launch;
//   }

// const setLanguageChoose = (language) => {
//     let chooseTitle = document.getElementById("choose_title");
//     let dualMatch = document.getElementById("dual-match");
//     let tournamentMatch = document.getElementById("tournament-match");
//     if(!chooseTitle || !dualMatch || !tournamentMatch)
//         return;
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     chooseTitle.innerText = trslt.choose_title;
//     dualMatch.innerText = trslt.choose_dual;
//     tournamentMatch.innerText = trslt.choose_tour;
//   }

// const setLanguageMatchmaking = (language) => {
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     document.getElementById("title-tournoi").innerHTML = trslt.title_tournoi
//     document.getElementById("result_text").innerText = trslt.result_text;
//     document.getElementById("second-match").innerText = trslt.second_match;
//     document.getElementById("first-match").innerText = trslt.first_match;
//     document.getElementById("start-next-match").innerText = trslt.btn_begin_match
//   }

// export const setLanguageJeuAll = (language) => {
//     setLanguageNav(language)
//     if(document.getElementById("game") && (document.getElementById("game").style.display == "block"))
//         setLanguageGame(language)
//     else if(document.getElementById("game_result_pannel") && (document.getElementById("game_result_pannel").style.display == "block"))
//         setLanguageWinner(language)
//     else 
//         setLanguageJeu(language)
// }


// const setLanguageJeu = (language) => {
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     var element = document.getElementById("player_title");
//     if (element)
//         element.innerText = trslt.player_title;
//     element = document.getElementById("remote-game");
//     if (element)
//         element.innerText = trslt.remote_game;
//     element = document.getElementById("local-game");
//     if (element)
//         element.innerText = trslt.local_game;
//     element = document.getElementById("player2_title");
//     if (element)
//         element.innerText = trslt.player2_title;
//     element = document.getElementById("Start-game");
//     if (element)
//         element.innerText = trslt.start_game;
//     element = document.getElementById("text_1");
//     if (element)
//         element.innerText = trslt.text_1;
//     element = document.getElementById("text_2");
//     if (element)
//         element.innerText = trslt.text_2;
//     element = document.getElementById("next-btn");
//     if (element)
//         element.innerText = trslt.next_btn;
//     element = document.getElementById("end-btn");
//     if (element)
//         element.innerText = trslt.end_btn;
// }

// const setLanguageWinner = (language) => {
//     setLanguageJeu(language)
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     document.getElementById("title-tournoi").innerHTML = trslt.title_tournoi
//   }

// export const setLanguageGame = (language) => {
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     document.getElementById("title-tournoi").innerHTML = trslt.title_tournoi
//   }

// const setLanguageLogin = (language) => {
//     setLanguageNav(language)
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     document.getElementsByTagName("label")[0].innerHTML = trslt.username;
//     document.getElementsByTagName("label")[1].innerHTML = trslt.password;
//     document.getElementById("btn_signup").innerHTML = trslt.button_login;
//     document.getElementsByTagName("p")[2].innerHTML = trslt.no_account
//     document.getElementById("signup").innerHTML = trslt.signup
// }

// const setLanguageSignup = (language) => {
//     setLanguageNav(language)
//     let trslt = translations.fr;
//     if(language == "fr")
//         trslt = translations.fr;
//     else if (language == "en")
//         trslt = translations.en;
//     else if (language == "es")
//         trslt = translations.es;
//     document.getElementsByTagName("label")[0].innerHTML = trslt.username;
//     document.getElementsByTagName("label")[1].innerHTML = trslt.password;
//     document.getElementsByTagName("label")[2].innerHTML = trslt.password_conf;
//     document.getElementsByTagName("label")[3].innerHTML = trslt.enable_2fa;
//     document.getElementsByClassName("helptext")[0].innerHTML = trslt.help_text;
//     document.getElementsByClassName("helptext")[1].innerHTML = trslt.help_text2;
//     document.getElementById("btn_signup").innerHTML = trslt.signup;
//   }