import { getCacheBustValue } from "./cacheBust.js";
import { fetchConnection } from "./load_html.js";
const tournamentFunc = await import(
  "./tournoi.js?cacheBust=" + getCacheBustValue()
);
let launchTornament = document.getElementById("btn-launch-game");
let join_btn = document.getElementById("join-btn");

if (join_btn) {
  join_btn.addEventListener("click", function (e) {
    e.preventDefault();
    tournamentFunc.joinTournament(e);
  });
}
if (launchTornament) {
  launchTornament.addEventListener("click", function (e) {
    e.preventDefault();
    tournamentFunc.launchTournament(e);
  });
}

if (document.getElementById("btn_signup")) fetchConnection();
