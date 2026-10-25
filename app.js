/* Questionnaire de satisfaction — prototype testable.
   Tout ce qui identifie l’établissement vit dans identite.js (vraie version ou version d’évaluation fictive).
   Tout fonctionne dans le navigateur, sans serveur : les réponses ne quittent l'appareil
   que lorsque la personne envoie elle-même le PDF depuis sa messagerie. */
(() => {
"use strict";

/* ---------- état ---------- */
const S = {
  dest: "", service: "", type: "accueil", sound: false, who: null,
  idx: 0, answers: {}, tutoDone: false
};
const $ = (s, r = document) => r.querySelector(s);
const app = $("#screen");
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const T = (tu, vous) => (S.who === "parent" || S.who === "tiers" || S.who === "assfam" ? vous : tu);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- icônes ---------- */
const I = {
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  spk: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  spkOff: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 21L21 3" fill="none" stroke="#e0483e" stroke-width="2.2" stroke-linecap="round"/></svg>',
  spkBig: '<svg width="58" height="58" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  spkBigOff: '<svg width="84" height="84" viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 21L21 3" fill="none" stroke="#e0483e" stroke-width="2.2" stroke-linecap="round"/></svg>',
  skip: '<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M6 8h22v14H14l-6 5v-5H6z" stroke="#4a525e" stroke-width="2.2" stroke-linejoin="round"/><path d="M5 28L29 5" stroke="#e0483e" stroke-width="2.6" stroke-linecap="round"/></svg>',
  arrow: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mic: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  micOff: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/><path d="M3 21L21 3" fill="none" stroke="#e0483e" stroke-width="2.2" stroke-linecap="round"/></svg>',
  check: '<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5 10-11"/></svg>',
  cross: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  lock: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f9e57" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  eye: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2C5A97" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M4 4l16 16" stroke="#e0483e"/></svg>',
  xcirc: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7b5bb8" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  send: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2C5A97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>'
};

/* bonhomme du curseur : v de 0 (rouge, triste) à 1 (vert, content) */
function faceColor(v) {
  const stops = [[0, [224, 72, 62]], [0.3, [240, 138, 60]], [0.55, [246, 196, 69]], [1, [47, 158, 87]]];
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const [a, ca] = stops[i - 1], [b, cb] = stops[i], t = (v - a) / (b - a);
      return `rgb(${ca.map((c, k) => Math.round(c + (cb[k] - c) * t)).join(",")})`;
    }
  }
  return "rgb(47,158,87)";
}
function faceSVG(v, size = 76) {
  const curve = (v - 0.5) * 20; // >0 sourire
  return `<svg width="${size}" height="${size}" viewBox="0 0 76 76"><circle cx="38" cy="38" r="36" fill="${faceColor(v)}"/>
  <circle cx="27" cy="31" r="4.2" fill="#1d2430"/><circle cx="49" cy="31" r="4.2" fill="#1d2430"/>
  <path d="M24 ${50 - curve / 4} Q38 ${50 + curve} 52 ${50 - curve / 4}" fill="none" stroke="#1d2430" stroke-width="4.2" stroke-linecap="round"/></svg>`;
}

/* ---------- voix ---------- */
let voiceFr = null;
function pickVoice() {
  if (!("speechSynthesis" in window)) return;
  const vs = speechSynthesis.getVoices();
  voiceFr = vs.find(v => /^fr(-|_)FR/i.test(v.lang)) || vs.find(v => /^fr/i.test(v.lang)) || null;
}
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text, force) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  if (!S.sound && !force) return;
  const u = new SpeechSynthesisUtterance(text.replace(/[«»]/g, ""));
  u.lang = "fr-FR"; u.rate = 0.95; if (voiceFr) u.voice = voiceFr;
  speechSynthesis.speak(u);
}
function voiceOK() { return "speechSynthesis" in window && speechSynthesis.getVoices().length > 0; }
const voicesReady = new Promise(res => {
  if (!("speechSynthesis" in window) || speechSynthesis.getVoices().length) return res();
  const t = setTimeout(res, 1500);
  speechSynthesis.addEventListener("voiceschanged", () => { clearTimeout(t); res(); });
});
function stopVoice() { if ("speechSynthesis" in window) speechSynthesis.cancel(); }

/* ---------- dictée ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;

/* ---------- en-tête ---------- */
function header(show) {
  $("#top").classList.toggle("hidden", !show);
  $("#progress").classList.toggle("hidden", !show);
  const b = $("#soundBtn");
  b.innerHTML = S.sound ? I.spk : I.spkOff;
  b.classList.toggle("off", !S.sound);
  b.setAttribute("aria-label", S.sound ? "Couper la voix" : "Activer la voix");
}
function progress(p) { $("#progress > div").style.width = Math.round(p * 100) + "%"; }

/* ---------- écran 0 : réglage de la version de test ---------- */
function screenTest() {
  header(false); $("#testBanner").classList.remove("hidden");
  $("#testBanner").textContent = ID.evaluation
    ? "Version d’évaluation — établissement et services fictifs. Les réponses passent par un service d’envoi extérieur, sans chiffrement : n’utilisez que des réponses fictives."
    : "Version de test du prototype — les réponses ne sont pas chiffrées.";
  const qs = new URLSearchParams(location.search);
  const dest = qs.get("dest") || store.get("q_dest") || "";
  const serv = qs.get("service") || store.get("q_service") || "";
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <img src="${LOGO_PNG}" alt="${esc(ID.nomCourt)}" style="width:190px;margin:4px auto 6px;display:block">
    <h1 class="big" style="font-size:24px">${ID.evaluation ? "Version d’évaluation" : "Version de test"}</h1>
    <p class="lead" style="font-size:16px">Dans la version réelle, ces deux réglages sont contenus dans le lien envoyé : la personne ne les voit jamais, et le résultat part toujours vers la même adresse de l’établissement.</p>
    <label class="f" for="dest">Votre adresse électronique : le résultat vous y sera envoyé</label>
    <input class="f" id="dest" type="email" inputmode="email" autocomplete="email" placeholder="${esc(ID.exempleMail)}" value="${esc(dest)}">
    <label class="f" for="serv">Service</label>
    <select class="f" id="serv"><option value="">Choisir…</option>${ID.services.map(s => `<option ${s === serv ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>
    <label class="f" for="typ">Accompagnement</label>
    <select class="f" id="typ">${Object.entries(ACCOMPAGNEMENTS).map(([k, v]) => `<option value="${k}" ${k === (store.get("q_type") || "accueil") ? "selected" : ""}>${esc(v)}</option>`).join("")}</select>
    <div class="err" id="err"></div>
    <div class="activate">
      <p>Première fois avec cette adresse ? Le service d’envoi doit d’abord la confirmer : appuyez ci-dessous, puis ouvrez le mail reçu et cliquez sur <b>« Activate Form »</b>. Sans cela, le premier résultat est perdu.</p>
      <button class="btn ghost" id="act">Recevoir le mail de confirmation</button>
      <p class="hint" id="actmsg"></p>
    </div>
    <div class="grow"></div>
    <button class="next" id="go">Commencer ${I.arrow}</button>
  </div></section>`;
  $("#act").onclick = async () => {
    const d = $("#dest").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d)) { $("#err").textContent = "Adresse électronique à vérifier."; return; }
    $("#err").textContent = ""; $("#act").disabled = true; $("#actmsg").textContent = "Envoi en cours…";
    const ok = await relay(d, { _subject: `Questionnaire ${ID.nomCourt} – confirmation de l’adresse`, message: "Confirmation de l’adresse pour recevoir les résultats du questionnaire (version d’évaluation)." });
    $("#act").disabled = false;
    $("#actmsg").textContent = ok ? "Demande partie. Regardez votre boîte (et les indésirables), cliquez sur « Activate Form », puis revenez ici." : "Le service d’envoi n’a pas pu être joint depuis ce réseau. Le résultat passera alors par votre messagerie, à la fin.";
  };
  $("#go").onclick = () => {
    const d = $("#dest").value.trim(), s = $("#serv").value;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d)) { $("#err").textContent = "Adresse électronique à vérifier."; return; }
    if (!s) { $("#err").textContent = "Choisir un service."; return; }
    S.dest = d; S.service = s; S.type = $("#typ").value; store.set("q_dest", d); store.set("q_service", s); store.set("q_type", S.type);
    $("#testBanner").classList.add("hidden");
    screenSplash();
  };
}

/* ---------- écran 1 : logo ---------- */
function screenSplash() {
  header(false);
  app.innerHTML = `<div class="splash"><img src="${LOGO_PNG}" alt="${esc(ID.nomLong)}"></div>`;
  let gone = false;
  const go = () => { if (gone) return; gone = true; app.onclick = null; voicesReady.then(screenHello); };
  const t = setTimeout(go, 2800);
  app.onclick = () => { clearTimeout(t); go(); };
}

/* ---------- écran 2 : bonjour / son ---------- */
function screenHello() {
  app.onclick = null; header(true); progress(0);
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big">Bonjour</h1>
    <p class="lead">Ce questionnaire sert à améliorer l’accompagnement ${ID.duNom}.</p>
    ${voiceOK()
      ? `<div class="listen"><button id="listen" aria-label="Écouter">${I.spkBig}<span>Écouter</span></button></div>
    <div class="grow"></div>
    <button class="btn ghost" id="read" style="display:flex;align-items:center;justify-content:center;gap:10px">${I.spkOff} Je préfère lire</button>`
      : `<div class="listen off"><span class="novoice">${I.spkBigOff}</span></div>
    <p class="novoice-note">Sur cet appareil, la voix ne fonctionne pas.<br>Sur un téléphone, elle fonctionnera.</p>
    <div class="grow"></div>
    <button class="btn primary" id="read">Commencer</button>`}
  </div></section>`;
  if ($("#listen")) $("#listen").onclick = () => {
    if (!voiceOK()) {
      if (!$(".mic-note")) $(".listen").insertAdjacentHTML("afterend", `<div class="mic-note">Sur cet appareil, la voix ne fonctionne pas : son navigateur n’en propose aucune. Sur un téléphone ou un autre ordinateur, elle fonctionnera. Ici, vous pouvez lire.</div>`);
      return;
    }
    S.sound = true; header(true); say(whoList().length > 1 ? "Bonjour. Qui répond ?" : "Bonjour."); goWho();
  };
  $("#read").onclick = () => { S.sound = false; stopVoice(); goWho(); };
}

/* ---------- écran 3 : qui répond ---------- */
const DOTS = { enfant: ["#f6c445", "#f08a3c", 14], ado: ["#8cc63f", "#2f9e57", 16], parent: ["#7ea6dc", "#2C5A97", 18], assfam: ["#9fd6cf", "#2b8c80", 18], tiers: ["#c9a7e8", "#7b5bb8", 18] };
function whoList() { return Object.keys(REPONDANTS).filter(w => QUESTIONS[w] && QUESTIONS[w][S.type]); }
function goWho() {
  const l = whoList();
  if (l.length === 1) { S.who = l[0]; S.answers = {}; S.idx = 0; screenConsent(); }
  else screenWho();
}
function screenWho() {
  header(true); progress(0.02);
  const p = (c1, c2, s) => `<span class="dot2"><i style="width:${s}px;height:${s}px;background:${c1}"></i><i style="width:${s * 1.5}px;height:${s * 1.3}px;background:${c2};border-radius:${s}px ${s}px 6px 6px"></i></span>`;
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big" style="text-align:left;font-size:27px;margin-top:6px">Qui répond ?</h1>
    <div class="who">
      ${whoList().map(w => `<button data-w="${w}">${p(...DOTS[w])} ${esc(REPONDANTS[w])}</button>`).join("")}
    </div></div></section>`;
  app.querySelectorAll(".who button").forEach(b => b.onclick = () => {
    S.who = b.dataset.w; S.answers = {}; S.idx = 0; screenConsent();
  });
}

/* ---------- écran 4 : avant de commencer ---------- */
function screenConsent() {
  header(true); progress(0.04);
  const items = [
    [I.eye, T("<b>Aucun des professionnels</b> qui t’ont accompagné n’aura accès à tes réponses. Elles sont <b>regroupées</b> avec celles des autres.",
              "<b>Aucun des professionnels</b> qui vous ont accompagné n’aura accès à vos réponses. Elles sont <b>regroupées</b> avec celles des autres personnes.")],
    [I.xcirc, T("Tu peux <b>ne pas répondre</b> à une question, et <b>arrêter</b> quand tu veux.",
                "Vous pouvez <b>ne pas répondre</b> à une question, arrêter à tout moment, et demander le retrait de vos réponses.")],
    [I.send, T("À la fin, c’est <b>toi qui décides</b> d’envoyer tes réponses ou non.",
               `À la fin, c’est <b>vous qui décidez</b> d’envoyer vos réponses ou non. ${ID.leNom} en est responsable et les protège.`)]
  ];
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big" style="text-align:left;font-size:26px;margin-top:6px">Avant de commencer</h1>
    <div class="cons">${items.map(([i, t]) => `<div>${i}<span>${t}</span></div>`).join("")}</div>
    <div class="grow"></div>
    <div class="row2"><button class="btn ghost" id="no">Non merci</button><button class="btn primary" id="yes">${T("D’accord", "J’accepte")}</button></div>
  </div></section>`;
  say(T("Avant de commencer. ", "Avant de commencer. ") + items.map(x => x[1].replace(/<[^>]+>/g, "")).join(" "));
  $("#no").onclick = () => screenEnd("refus");
  $("#yes").onclick = () => { stopVoice(); S.tutoDone ? screenQuestion() : screenTuto(); };
}

/* ---------- curseur ---------- */
function mountSlider(host, initial, labels, onSet) {
  /* échelle continue : le bonhomme reste où on le pose, bouts compris ; valeur 0-100 ;
     le mot de la zone s'affiche dessous comme repère, sans attirer le bonhomme */
  host.innerHTML = `<div class="slider ${initial == null ? "untouched" : ""}" role="slider" aria-valuemin="0" aria-valuemax="100">
      <div class="track"></div>
      <div class="thumb" tabindex="0"></div></div>
    <div class="scale-labels"><span>${esc(labels[0])}</span><span>${esc(labels[labels.length - 1])}</span></div>
    <div class="scale-value"></div>`;
  const sl = host.querySelector(".slider"), th = host.querySelector(".thumb"), val = host.querySelector(".scale-value");
  const R = 48; // demi-largeur du bonhomme : son centre va de R à (largeur - R)
  const zone = vv => labels[Math.min(labels.length - 1, Math.floor(vv * labels.length))];
  let v = initial == null ? 0.5 : Math.min(1, Math.max(0, initial / 100));
  const draw = (vv, showLabel) => {
    th.style.left = `calc(${vv * 100}% + ${R - vv * 2 * R}px)`; th.innerHTML = faceSVG(vv);
    sl.setAttribute("aria-valuenow", Math.round(vv * 100));
    val.textContent = showLabel ? zone(vv) : "";
  };
  const commit = vv => { v = vv; sl.classList.remove("untouched"); draw(v, true); onSet(Math.round(v * 100), zone(v)); };
  draw(v, initial != null);
  const fromX = x => { const r = sl.getBoundingClientRect(); return Math.min(1, Math.max(0, (x - r.left - R) / (r.width - 2 * R))); };
  sl.addEventListener("pointerdown", e => {
    sl.setPointerCapture(e.pointerId); sl.classList.remove("untouched"); sl.classList.add("drag"); draw(fromX(e.clientX), true);
    const move = ev => draw(fromX(ev.clientX), true);
    const up = ev => { sl.classList.remove("drag"); commit(fromX(ev.clientX)); sl.removeEventListener("pointermove", move); sl.removeEventListener("pointerup", up); sl.removeEventListener("pointercancel", up); };
    sl.addEventListener("pointermove", move); sl.addEventListener("pointerup", up); sl.addEventListener("pointercancel", up);
  });
  th.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { commit(Math.max(0, v - 0.05)); e.preventDefault(); }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { commit(Math.min(1, v + 0.05)); e.preventDefault(); }
  });
  return sl;
}

/* ---------- tutoriel vocal ---------- */
function screenTuto() {
  header(true); progress(0.06);
  const labels = ["Pas du tout", "Plutôt non", "Moyennement", "Plutôt oui", "Tout à fait"];
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="q">${T("Exemple : tu aimes les vacances ?", "Exemple : aimez-vous les vacances ?")}</h1>
    <div id="sl"></div><div class="grow"></div>
    <div class="bottom"><button class="skip" id="tskip">${I.skip}</button><button class="mic ${SR ? "" : "off"}" id="tmic">${SR ? I.mic : I.micOff}</button><button class="next" disabled>Suivant ${I.arrow}</button></div>
  </div></section>`;
  mountSlider($("#sl"), null, labels, () => {});
  const steps = [
    { el: () => $(".slider .thumb"), pad: 8, text: T("Fais glisser le rond. <b>Vers la gauche</b> : pas du tout d’accord. <b>Vers la droite</b> : tout à fait d’accord.", "Faites glisser le rond. <b>Vers la gauche</b> : pas du tout d’accord. <b>Vers la droite</b> : tout à fait d’accord.") },
    { el: () => $("#tskip"), pad: 6, text: T("Si tu ne veux pas répondre à une question, appuie sur <b>ce bouton</b>. C’est ton droit.", "Si vous ne souhaitez pas répondre à une question, appuyez sur <b>ce bouton</b>. C’est votre droit.") }
  ];
  if (SR) steps.push({ el: () => $("#tmic"), pad: 6, text: T("Parfois, tu pourras répondre avec tes mots : en écrivant, ou en appuyant sur <b>le micro</b> pour parler.", "Parfois, vous pourrez répondre avec vos mots : en écrivant, ou en appuyant sur <b>le micro</b> pour parler.") });
  else steps.push({ el: () => $("#tmic"), pad: 6, text: T("Parfois, tu pourras répondre avec tes mots, en écrivant. <b>Le micro est barré</b> : sur cet appareil, il ne marche pas. Sur un téléphone, tu pourras parler.", "Parfois, vous pourrez répondre avec vos mots, en écrivant. <b>Le micro est barré</b> : sur cet appareil, il ne fonctionne pas. Sur un téléphone, vous pourrez parler.") });
  runTuto(steps, () => { S.tutoDone = true; screenQuestion(); });
}
function runTuto(steps, done) {
  const bg = document.createElement("div"); bg.className = "tuto-bg";
  const spot = document.createElement("div"); spot.className = "spot";
  const bub = document.createElement("div"); bub.className = "bubble";
  const arr = document.createElement("div"); arr.className = "tarrow";
  arr.innerHTML = '<svg width="44" height="54" viewBox="0 0 44 54"><path d="M22 4v34M8 26l14 16 14-16" fill="none" stroke="#f6c445" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.append(bg, spot, bub, arr);
  let i = 0;
  const show = () => {
    const st = steps[i], el = st.el(), r = el.getBoundingClientRect(), p = st.pad;
    if (st.noSpot) { spot.style.cssText = `left:50%;top:50%;width:0;height:0;border-width:0`; }
    else spot.style.cssText = `left:${r.left - p}px;top:${r.top - p}px;width:${r.width + 2 * p}px;height:${r.height + 2 * p}px`;
    bub.innerHTML = `<div class="brow">${S.sound ? `<span class="spk">${I.spk.replace('width="22" height="22"', 'width="14" height="14"')}</span>` : ""}<div class="btxt">${st.text}</div></div>
      <div class="dots">${steps.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>
      <button class="ok">${i < steps.length - 1 ? "Compris" : "C’est parti !"}</button>`;
    const below = r.top < window.innerHeight / 2;
    const gap = st.noSpot ? 18 : 66; // place pour la flèche
    bub.style.top = below ? `${Math.min(r.bottom + p + gap, window.innerHeight - 220)}px` : "";
    bub.style.bottom = below ? "" : `${window.innerHeight - r.top + p + gap}px`;
    // flèche entre la bulle et l'élément montré, pointée vers lui
    if (st.noSpot) arr.style.display = "none";
    else {
      arr.style.display = "";
      const cx = r.left + r.width / 2 - 22;
      if (below) { arr.style.cssText = `left:${cx}px;top:${r.bottom + p + 4}px;transform:rotate(180deg)`; }
      else { arr.style.cssText = `left:${cx}px;top:${r.top - p - 58}px`; }
    }
    say(st.text.replace(/<[^>]+>/g, ""));
    bub.querySelector(".ok").onclick = () => {
      i++;
      if (i < steps.length) show(); else { stopVoice(); bg.remove(); spot.remove(); bub.remove(); arr.remove(); window.removeEventListener("resize", show); done(); }
    };
  };
  window.addEventListener("resize", show);
  setTimeout(show, 80);
}

/* ---------- questions ---------- */
function list() { return QUESTIONS[S.who][S.type]; }
function screenQuestion() {
  const qs = list(), q = qs[S.idx], a = S.answers[q.id];
  header(true); progress(0.08 + 0.9 * (S.idx / qs.length));
  let body = "";
  if (q.type === "scale") body = `<div id="sl"></div>`;
  if (q.type === "yesno") body = `<div class="yn ${a && !a.skip ? "chosen" : ""}"><button class="yes ${a && a.v === "oui" ? "sel" : ""}" data-v="oui">${I.check}Oui</button><button class="no ${a && a.v === "non" ? "sel" : ""}" data-v="non">${I.cross}Non</button></div>`;
  if (q.type === "choice3") body = `<div class="c3">${q.choices.map((c, k) => `<button data-k="${k}" class="${a && a.v === k + 1 ? "sel" : ""}">${faceSVG(q.choices.length === 3 && /trop/i.test(q.choices[2]) ? [0.15, 1, 0.35][k] : k / 2, 40)}${esc(c)}</button>`).join("")}</div>`;
  if (q.type === "text") body = `<textarea id="txt" maxlength="${MAXTXT}" placeholder="${T("Écris ici…", "Écrivez ici…")}">${a && !a.skip ? esc(a.v) : ""}</textarea><div class="txt-count" id="cnt"></div>`;
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <div class="subnav"><button class="linkbtn" id="back">‹ Retour</button><button class="linkbtn" id="stop">Arrêter</button></div>
    <h1 class="q">${esc(q.t)}</h1>
    ${body}
    <div class="skipped-note ${a && a.skip ? "" : "hidden"}" id="skn">${T("Tu as choisi de ne pas répondre.", "Vous avez choisi de ne pas répondre.")}</div>
    <div class="grow"></div>
    <div class="bottom">
      <button class="skip ${a && a.skip ? "on" : ""}" id="skip" aria-label="${T("Je ne réponds pas", "Je ne réponds pas")}">${I.skip}</button>
      ${q.type === "text" ? `<button class="mic ${SR ? "" : "off"}" id="mic" aria-label="${SR ? "Dicter" : "Micro indisponible sur cet appareil"}">${SR ? I.mic : I.micOff}</button>` : ""}
      <button class="next" id="next" ${a || q.type === "text" ? "" : "disabled"}>${S.idx === qs.length - 1 ? "Terminer" : "Suivant"} ${I.arrow}</button>
    </div></div></section>`;
  const setA = (v, label) => { S.answers[q.id] = { v, label }; $("#next").disabled = false; $("#skip").classList.remove("on"); $("#skn").classList.add("hidden"); };
  if (q.type === "scale") mountSlider($("#sl"), a && !a.skip ? a.v : null, q.labels, (n, l) => setA(n, l));
  if (q.type === "yesno") app.querySelectorAll(".yn button").forEach(b => b.onclick = () => {
    app.querySelectorAll(".yn button").forEach(x => x.classList.remove("sel")); b.classList.add("sel"); $(".yn").classList.add("chosen");
    setA(b.dataset.v, b.dataset.v === "oui" ? "Oui" : "Non"); say(b.dataset.v);
  });
  if (q.type === "choice3") app.querySelectorAll(".c3 button").forEach(b => b.onclick = () => {
    app.querySelectorAll(".c3 button").forEach(x => x.classList.remove("sel")); b.classList.add("sel");
    const k = +b.dataset.k; setA(k + 1, q.choices[k]);
  });
  if (q.type === "text") {
    $("#txt").oninput = () => { $("#skip").classList.remove("on"); $("#skn").classList.add("hidden"); countTxt(); };
    countTxt();
    if (SR) $("#mic").onclick = () => dictate($("#txt"), $("#mic"));
    else $("#mic").onclick = () => {
      const m = T("Sur cet appareil, le micro ne marche pas. Tu peux écrire ta réponse. Sur un téléphone, tu pourras parler.",
                  "Sur cet appareil, le micro ne fonctionne pas. Vous pouvez écrire votre réponse. Sur un téléphone, vous pourrez parler.");
      if (!$(".mic-note")) $("#txt").insertAdjacentHTML("afterend", `<div class="mic-note">${m}</div>`);
      say(m);
    };
  }
  $("#skip").onclick = () => {
    S.answers[q.id] = { skip: true }; $("#skip").classList.add("on"); $("#skn").classList.remove("hidden"); $("#next").disabled = false;
    app.querySelectorAll(".sel").forEach(x => x.classList.remove("sel")); const yn = $(".yn"); if (yn) yn.classList.remove("chosen");
    if (q.type === "text") $("#txt").value = "";
    setTimeout(goNext, 450);
  };
  $("#next").onclick = goNext;
  $("#back").onclick = () => { stopDictation(); stopVoice(); if (S.idx > 0) { S.idx--; screenQuestion(); } else screenConsent(); };
  $("#stop").onclick = stopSheet;
  let spoken = q.t;
  if (q.type === "yesno") spoken += " Oui, ou non ?";
  if (q.type === "choice3") spoken += " " + q.choices.join(", ou, ") + " ?";
  say(spoken);

  function goNext() {
    stopDictation();
    if (q.type === "text" && !(S.answers[q.id] && S.answers[q.id].skip)) {
      const t = $("#txt").value.trim().slice(0, MAXTXT);
      S.answers[q.id] = t ? { v: t, label: t } : { skip: true, empty: true };
    }
    if (S.idx < qs.length - 1) { S.idx++; screenQuestion(); } else screenFinish();
  }
}

/* réponses libres : 2 500 caractères au plus ; le compteur n'apparaît qu'à l'approche de la limite */
const MAXTXT = 2500;
function countTxt() {
  const a = $("#txt"), c = $("#cnt"); if (!a || !c) return;
  const reste = MAXTXT - a.value.length;
  c.textContent = reste <= 0 ? "Limite atteinte : 2 500 caractères" : reste <= 200 ? `Encore ${reste} caractère${reste > 1 ? "s" : ""}` : "";
  c.classList.toggle("max", reste <= 0);
}
function dictate(area, btn) {
  if (rec) { stopDictation(); return; }
  stopVoice();
  rec = new SR(); rec.lang = "fr-FR"; rec.interimResults = false; rec.continuous = true;
  btn.classList.add("rec");
  rec.onresult = e => {
    let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) t += e.results[i][0].transcript;
    if (t) { area.value = ((area.value ? area.value.trim() + " " : "") + t.trim()).slice(0, MAXTXT); countTxt(); }
  };
  rec.onend = () => { btn.classList.remove("rec"); rec = null; };
  rec.onerror = () => { btn.classList.remove("rec"); rec = null; };
  rec.start();
}
function stopDictation() { if (rec) { try { rec.stop(); } catch (e) {} rec = null; } document.querySelectorAll(".mic.rec").forEach(b => b.classList.remove("rec")); }

/* ---------- arrêter ---------- */
function stopSheet() {
  stopVoice();
  const n = Object.values(S.answers).filter(a => !a.skip).length;
  const bg = document.createElement("div"); bg.className = "sheet-bg";
  bg.innerHTML = `<div class="sheet"><div class="grab"></div><h2>${T("Tu veux arrêter ?", "Vous souhaitez arrêter ?")}</h2>
    <p class="sm">${n ? T(`Tu as déjà répondu à ${n} question${n > 1 ? "s" : ""}.`, `Vous avez déjà répondu à ${n} question${n > 1 ? "s" : ""}.`) : T("Tu n’as encore répondu à aucune question.", "Vous n’avez encore répondu à aucune question.")}</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px">
      ${n ? `<button class="btn primary" id="sendPart">${T("Envoyer ce que j’ai répondu", "Envoyer ce que j’ai répondu")}</button>` : ""}
      <button class="btn ghost" id="nothing">Ne rien envoyer</button>
      <button class="btn ghost" id="cont">Continuer le questionnaire</button></div></div>`;
  document.body.append(bg);
  const close = () => bg.remove();
  bg.onclick = e => { if (e.target === bg) close(); };
  $("#cont", bg).onclick = close;
  $("#nothing", bg).onclick = () => { close(); screenEnd("rien"); };
  const sp = $("#sendPart", bg); if (sp) sp.onclick = () => { close(); ID.evaluation ? showDoc(true) : sendAnswers(true); };
}

/* ---------- fin ---------- */
function screenFinish() {
  header(true); progress(1);
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big" style="text-align:left;font-size:27px;margin-top:6px">C’est terminé</h1>
    <p class="lead" style="text-align:left;margin:0 0 16px">${ID.evaluation
      ? T("Merci ! Dans la vraie version, tes réponses partiraient à l’établissement, si tu es d’accord. Ici, rien n’est envoyé : tu peux voir ce que l’établissement recevrait.",
          "Merci. Dans la vraie version, vos réponses partiraient à l’établissement, si vous êtes d’accord. Ici, rien n’est envoyé : vous pouvez voir ce que l’établissement recevrait.")
      : T("Merci ! Si tu es d’accord, tes réponses vont être rangées dans un fichier, puis ta messagerie va s’ouvrir pour que tu l’envoies.",
          "Merci. Si vous êtes d’accord, vos réponses vont être rangées dans un fichier, puis votre messagerie va s’ouvrir pour que vous l’envoyiez.")}</p>
    <div class="cons"><div>${I.eye}<span>${T("Aucun des professionnels qui t’ont accompagné n’aura accès à tes réponses.", "Aucun des professionnels qui vous ont accompagné n’aura accès à vos réponses.")}</span></div></div>
    <div class="grow"></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="btn green" id="send">${ID.evaluation ? "Voir ce que l’établissement recevrait" : "Envoyer mes réponses"}</button>
      <button class="btn ghost" id="nothing">Ne rien envoyer</button></div>
  </div></section>`;
  say(T("C’est terminé. Merci ! Tu veux envoyer tes réponses ?", "C’est terminé. Merci. Souhaitez-vous envoyer vos réponses ?"));
  $("#send").onclick = () => ID.evaluation ? showDoc(false) : sendAnswers(false);
  $("#nothing").onclick = () => screenEnd("rien");
}

function screenEnd(kind) {
  stopVoice(); header(true);
  const msg = kind === "refus"
    ? T("D’accord. Rien n’a été enregistré. Merci d’avoir pris le temps de regarder.", "Entendu. Rien n’a été enregistré. Merci d’avoir pris le temps de regarder.")
    : T("D’accord, rien n’a été envoyé. Merci !", "Entendu, rien n’a été envoyé. Merci.");
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big">Merci</h1><p class="lead">${msg}</p>${helpBlock()}<div class="grow"></div>
    <button class="btn ghost" id="again">Recommencer</button></div></section>`;
  say(msg + " " + helpSpoken());
  $("#again").onclick = restart;
}
function restart() { stopVoice(); S.who = null; S.answers = {}; S.idx = 0; screenStart(); }
function screenStart() { ID.evaluation ? screenIntroEval() : screenTest(); }

/* ---------- version d'évaluation : accueil sans réglage ---------- */
function screenIntroEval() {
  header(false); $("#testBanner").classList.remove("hidden");
  $("#testBanner").textContent = "Version d’évaluation — établissement et services fictifs. Aucune réponse n’est envoyée.";
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <img src="${LOGO_PNG}" alt="${esc(ID.nomCourt)}" style="width:190px;margin:4px auto 6px;display:block">
    <h1 class="big" style="font-size:24px">Version d’évaluation</h1>
    <p class="lead" style="font-size:16px">Ce questionnaire est une démonstration : l’établissement et ses services sont fictifs.</p>
    <p class="lead" style="font-size:16px">Répondez comme le ferait un enfant, un adolescent ou un parent. À la fin, <b>rien n’est envoyé</b> : vous verrez le document que l’établissement recevrait.</p>
    <p class="f" style="margin-top:6px">Quel accompagnement voulez-vous essayer ?</p>
    <div class="who acc">${Object.entries(ACCOMPAGNEMENTS).map(([k, v]) => `<button data-t="${k}">${esc(v)}</button>`).join("")}</div>
    <p class="hint">Dans la version réelle, l’accompagnement est contenu dans le lien envoyé : la personne n’a pas à le choisir.</p>
  </div></section>`;
  app.querySelectorAll(".acc button").forEach(b => b.onclick = () => {
    S.type = b.dataset.t; S.service = (ID.serviceParType && ID.serviceParType[S.type]) || ID.services[0]; S.dest = "";
    $("#testBanner").classList.add("hidden"); screenSplash();
  });
}

/* ---------- version d'évaluation : le document que l'établissement recevrait ---------- */
async function showDoc(partial) {
  stopVoice();
  app.innerHTML = `<section class="screen"><div class="inner" style="justify-content:center"><p class="lead">${T("Je prépare le document…", "Préparation du document…")}</p></div></section>`;
  let bytes;
  try { bytes = await buildPdf(partial); }
  catch (e) { console.error(e); app.innerHTML = `<section class="screen"><div class="inner"><p class="lead">Le document n’a pas pu être créé.</p><p class="hint">${esc(e.message || e)}</p></div></section>`; return; }
  lastFile = new File([bytes], fileName(), { type: "application/pdf" });
  const J = S.lastJson, pub = PUBLIC_DOC[S.who];
  const d = J.date_envoi.split("-").reverse().join("/");
  const rows = J.reponses.map(r => {
    const ok = r.statut === "repondu";
    const note = r.type === "scale" && ok ? `<span class="doc-score"><span class="doc-line"><i style="left:${r.valeur}%"></i></span><b>${r.valeur}/100</b></span>` : "";
    return `<li><p class="doc-q">${r.n}. ${esc(r.question)}</p><p class="doc-a ${ok ? "" : "muted"}"><span class="doc-lib">${esc(r.libelle)}</span>${note}</p></li>`;
  }).join("");
  header(true); progress(1);
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big" style="text-align:left;font-size:25px;margin-top:6px">${T("Ce que l’établissement recevrait", "Ce que l’établissement recevrait")}</h1>
    <p class="hint">Dans la vraie version, ce document partirait vers l’adresse de l’établissement. Ici, il n’est envoyé nulle part.</p>
    <div class="doc">
      <div class="doc-head"><img src="${LOGO_PNG}" alt=""><span>Questionnaire : réponses</span></div>
      <dl class="doc-meta"><dt>Service</dt><dd>${esc(J.service)}</dd><dt>Accompagnement</dt><dd>${esc(ACCOMPAGNEMENTS[J.accompagnement])}</dd><dt>Qui a répondu</dt><dd>${pub}</dd><dt>Date</dt><dd>${d}</dd>
        <dt>Code de la réponse</dt><dd>${J.code}</dd><dt>Questions</dt><dd>${partial ? "questionnaire arrêté avant la fin" : "questionnaire complet"}</dd></dl>
      <ol class="doc-list">${rows}</ol>
      <p class="doc-foot">Le document contient aussi les réponses sous forme de données, que le logiciel d’analyse lit sans ressaisie.</p>
    </div>
    <button class="btn ghost" id="dl" style="margin-top:14px">Télécharger ce document (PDF)</button>
    ${helpBlock()}
    <div class="grow"></div>
    <button class="linkbtn" id="again" style="margin-top:16px">Recommencer</button>
  </div></section>`;
  say(T("Voici le document que l’établissement recevrait.", "Voici le document que l’établissement recevrait.") + " " + helpSpoken());
  $("#dl").onclick = download;
  $("#again").onclick = restart;
}

/* ---------- envoi : PDF + messagerie ---------- */
let lastFile = null;
async function sendAnswers(partial) {
  app.innerHTML = `<section class="screen"><div class="inner" style="justify-content:center"><p class="lead">${T("Je prépare ton fichier…", "Préparation du fichier…")}</p></div></section>`;
  let bytes;
  try { bytes = await buildPdf(partial); }
  catch (e) { console.error(e); app.innerHTML = `<section class="screen"><div class="inner"><p class="lead">Le fichier n’a pas pu être créé.</p><p class="hint">${esc(e.message || e)}</p></div></section>`; return; }
  const name = fileName();
  lastFile = new File([bytes], name, { type: "application/pdf" });
  // 1) envoi automatique par le service d'envoi ; 2) à défaut, la messagerie de la personne
  const J = S.lastJson;
  const resume = J.reponses.map(r => `${r.n}. ${r.question}\n   → ${r.libelle}`).join("\n");
  const sent = await relay(S.dest, {
    _subject: `Questionnaire ${ID.nomCourt} – résultat ${J.code}`,
    "Service": S.service, "Accompagnement": ACCOMPAGNEMENTS[S.type], "Qui a répondu": PUBLIC_DOC[S.who],
    "Code de la réponse": J.code, "Questionnaire": partial ? "arrêté avant la fin" : "complet",
    "Réponses": resume,
    "Données pour le logiciel (à ne pas modifier)": JSON.stringify(J)
  }, lastFile);
  if (sent) { screenRelayed(); return; }
  let shared = false;
  if (navigator.canShare && navigator.canShare({ files: [lastFile] }) && matchMedia("(pointer: coarse)").matches) {
    try { await navigator.share({ files: [lastFile], title: "Mes réponses au questionnaire", text: `À envoyer à : ${S.dest}` }); shared = true; }
    catch (e) { /* la personne a fermé le menu de partage : on propose l'autre voie */ }
  }
  screenSent(shared);
  if (!shared) { download(); setTimeout(openMail, 700); }
}
/* Service d'envoi FormSubmit : la page envoie le formulaire, le service le transforme en mail.
   Réponse illisible depuis la page (mode no-cors) : on sait seulement si le réseau a laissé passer. */
async function relay(dest, fields, file) {
  const fd = new FormData();
  fd.append("_captcha", "false"); fd.append("_template", "box");
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  if (file) fd.append("attachment", file, file.name);
  try {
    await fetch("https://formsubmit.co/" + dest, { method: "POST", body: fd, mode: "no-cors" });
    return true;
  } catch (e) { return false; }
}
function screenRelayed() {
  header(true); progress(1);
  const msg = T("C’est envoyé. Merci d’avoir répondu !", "C’est envoyé. Merci d’avoir répondu.");
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big" style="text-align:left;font-size:27px;margin-top:6px">Merci !</h1>
    <p class="lead" style="text-align:left">${msg}</p>
    <p class="hint">Version d’évaluation : le résultat arrive dans quelques minutes à l’adresse ci-dessous. Pensez à regarder les indésirables.</p>
    <div class="addr">${esc(S.dest)}</div>
    <button class="btn ghost" id="fallback">Le mail n’est pas arrivé ? Envoyer par ma messagerie</button>
    ${helpBlock()}
    <div class="grow"></div>
    <button class="linkbtn" id="again" style="margin-top:16px">Recommencer (version de test)</button>
  </div></section>`;
  say(msg + " " + helpSpoken());
  $("#fallback").onclick = () => { screenSent(false); download(); setTimeout(openMail, 700); };
  $("#again").onclick = restart;
}
function fileName() {
  const d = new Date(), z = n => String(n).padStart(2, "0");
  const clean = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-");
  return `questionnaire-${ID.fichier}_${clean(S.service)}_${S.who}_${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}.pdf`;
}
function download() {
  const url = URL.createObjectURL(lastFile), a = document.createElement("a");
  a.href = url; a.download = lastFile.name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function openMail() {
  const body = `Bonjour,\n\nVoici mes réponses au questionnaire ${ID.duNom}, dans le fichier joint :\n${lastFile.name}\n\nSi le fichier n’est pas encore joint à ce message, il se trouve dans le dossier « Téléchargements » : il suffit de l’ajouter avec le trombone.\n`;
  location.href = `mailto:${encodeURIComponent(S.dest)}?subject=${encodeURIComponent(`Questionnaire ${ID.nomCourt} – mes réponses`)}&body=${encodeURIComponent(body)}`;
}
function screenSent(shared) {
  header(true); progress(1);
  app.innerHTML = `<section class="screen card-desktop"><div class="inner">
    <h1 class="big" style="text-align:left;font-size:26px;margin-top:6px">${shared ? "Merci !" : T("Dernière étape", "Dernière étape")}</h1>
    ${shared ? `<p class="lead" style="text-align:left">${T("Ton fichier a été transmis à ta messagerie. Vérifie que l’adresse ci-dessous est bien celle du destinataire, puis envoie le message.", "Le fichier a été transmis à votre messagerie. Vérifiez que l’adresse ci-dessous est bien celle du destinataire, puis envoyez le message.")}</p>`
    : `<div class="steps-done">${T("Ta messagerie va s’ouvrir.", "Votre messagerie va s’ouvrir.")}<ol>
        <li>${T("Le fichier de tes réponses est dans le dossier <b>Téléchargements</b>.", "Le fichier de vos réponses est dans le dossier <b>Téléchargements</b>.")}</li>
        <li>${T("Ajoute-le au message avec le <b>trombone</b>.", "Ajoutez-le au message avec le <b>trombone</b>.")}</li>
        <li>${T("Appuie sur <b>Envoyer</b>.", "Appuyez sur <b>Envoyer</b>.")}</li></ol></div>`}
    <p class="hint" style="margin-top:14px">Adresse du destinataire :</p>
    <div class="addr" id="addr">${esc(S.dest)}</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="btn ghost" id="copy">Copier l’adresse</button>
      <button class="btn ghost" id="dl">Télécharger à nouveau le fichier</button>
      <button class="btn ghost" id="mail">Ouvrir ma messagerie</button>
    </div>
    ${helpBlock()}
    <div class="grow"></div>
    <button class="linkbtn" id="again" style="margin-top:16px">Recommencer (version de test)</button>
  </div></section>`;
  say(shared ? T("Merci ! Il ne reste plus qu’à envoyer le message.", "Merci. Il ne reste plus qu’à envoyer le message.")
             : T("Dernière étape. Ta messagerie va s’ouvrir. Ajoute le fichier avec le trombone, puis appuie sur envoyer.", "Dernière étape. Votre messagerie va s’ouvrir. Ajoutez le fichier avec le trombone, puis appuyez sur envoyer."));
  $("#copy").onclick = async () => { try { await navigator.clipboard.writeText(S.dest); $("#copy").textContent = "Adresse copiée"; } catch (e) { $("#copy").textContent = "Copie impossible : sélectionnez l’adresse"; } };
  $("#dl").onclick = download;
  $("#mail").onclick = openMail;
  $("#again").onclick = restart;
}

/* ---------- construction du PDF ---------- */
function b64ToBytes(dataUrl) {
  const b = atob(dataUrl.split(",")[1]), u = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
  return u;
}
async function buildPdf(partial) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const doc = await PDFDocument.create();
  const F = await doc.embedFont(StandardFonts.Helvetica), FB = await doc.embedFont(StandardFonts.HelveticaBold);
  const logo = await doc.embedPng(b64ToBytes(LOGO_PNG));
  const NAVY = rgb(0.12, 0.23, 0.39), INK = rgb(0.11, 0.14, 0.19), MUT = rgb(0.42, 0.45, 0.5), GREEN = rgb(0.18, 0.55, 0.32), LINE = rgb(0.87, 0.89, 0.92);
  const W = 595.28, H = 841.89, M = 50;
  // caractères que la police du PDF ne sait pas écrire (emoji, etc.) remplacés
  const safe = (s, font) => { let out = ""; for (const ch of String(s).replace(/ /g, " ")) { try { font.widthOfTextAtSize(ch, 10); out += ch; } catch (e) { out += "?"; } } return out; };
  const wrap = (s, font, size, width) => {
    const words = safe(s, font).split(/\s+/), lines = []; let cur = "";
    const pieces = [];
    for (const w of words) {
      if (font.widthOfTextAtSize(w, size) <= width) { pieces.push(w); continue; }
      let part = ""; for (const ch of w) { if (font.widthOfTextAtSize(part + ch, size) > width) { pieces.push(part); part = ch; } else part += ch; } if (part) pieces.push(part);
    }
    for (const w of pieces) { const t = cur ? cur + " " + w : w; if (font.widthOfTextAtSize(t, size) > width && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  };
  const now = new Date(), z = n => String(n).padStart(2, "0");
  const dateTxt = `${z(now.getDate())}/${z(now.getMonth() + 1)}/${now.getFullYear()}`;
  const code = Array.from(crypto.getRandomValues(new Uint8Array(4)), b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  const pubTxt = PUBLIC_DOC[S.who];
  const qs = list();

  let page = doc.addPage([W, H]), y = H - M;
  const pages = [page];
  const newPage = () => { page = doc.addPage([W, H]); pages.push(page); y = H - M; };
  // en-tête
  const lw = 150, lh = lw * logo.height / logo.width;
  page.drawImage(logo, { x: M, y: y - lh, width: lw, height: lh });
  page.drawText("Questionnaire : réponses", { x: W - M - FB.widthOfTextAtSize("Questionnaire : réponses", 16), y: y - 26, size: 16, font: FB, color: NAVY });
  y -= lh + 20;
  const meta = [["Service", S.service], ["Accompagnement", ACCOMPAGNEMENTS[S.type]], ["Qui a répondu", pubTxt], ["Date d'envoi", dateTxt], ["Code de la réponse", code], ["Questions", partial ? "questionnaire arrêté avant la fin" : "questionnaire complet"]];
  page.drawRectangle({ x: M, y: y - meta.length * 17 - 10, width: W - 2 * M, height: meta.length * 17 + 14, color: rgb(0.95, 0.96, 0.98) });
  y -= 14;
  for (const [k, v] of meta) { page.drawText(safe(k, F), { x: M + 12, y, size: 9.5, font: F, color: MUT }); page.drawText(safe(v, FB), { x: M + 150, y, size: 9.5, font: FB, color: INK }); y -= 17; }
  y -= 18;

  const data = [];
  qs.forEach((q, i) => {
    const a = S.answers[q.id];
    let status = "non_posee", valeur = null, libelle = "Question non posée (questionnaire arrêté)";
    if (a && a.skip) { status = "refus"; libelle = a.empty ? "Pas de réponse écrite" : "Ne souhaite pas répondre"; }
    else if (a) { status = "repondu"; valeur = a.v; libelle = a.label; }
    data.push({ n: i + 1, id: q.id, type: q.type, question: q.t, statut: status, valeur, libelle });
    const qLines = wrap(`${i + 1}. ${q.t}`, FB, 10.5, W - 2 * M);
    const isScale = q.type === "scale" && status === "repondu";
    const aLines = wrap(libelle, F, 10.5, isScale ? W - 2 * M - 170 : W - 2 * M);
    const need = qLines.length * 14 + aLines.length * 14 + 22;
    if (y - need < M + 30) newPage();
    qLines.forEach(l => { page.drawText(l, { x: M, y, size: 10.5, font: FB, color: INK }); y -= 14; });
    y -= 2;
    const col = status === "repondu" ? GREEN : MUT;
    if (isScale) {
      const lx = W - M - 150, lw2 = 100, sc = `${valeur}/100`;
      page.drawLine({ start: { x: lx, y: y + 3 }, end: { x: lx + lw2, y: y + 3 }, thickness: 3, color: LINE });
      page.drawCircle({ x: lx + lw2 * valeur / 100, y: y + 3, size: 4.5, color: GREEN });
      page.drawText(sc, { x: W - M - FB.widthOfTextAtSize(sc, 10.5), y, size: 10.5, font: FB, color: INK });
    }
    aLines.forEach(l => { page.drawText(l, { x: M, y, size: 10.5, font: F, color: status === "repondu" ? INK : col }); y -= 14; });
    y -= 6;
    page.drawLine({ start: { x: M, y: y + 2 }, end: { x: W - M, y: y + 2 }, thickness: 0.5, color: LINE });
    y -= 10;
  });
  if (y < M + 60) newPage();
  y -= 6;
  wrap(`Ce fichier contient aussi les réponses sous forme de données (pièce jointe « reponses.json »), destinées au logiciel d'analyse. ${ID.evaluation ? "Version d'évaluation : établissement fictif, réponses non chiffrées." : "Version de test : réponses non chiffrées."}`, F, 8.5, W - 2 * M)
    .forEach(l => { page.drawText(l, { x: M, y, size: 8.5, font: F, color: MUT }); y -= 11; });
  pages.forEach((p, k) => {
    const t = `Questionnaire ${ID.nomCourt} · ${code} · page ${k + 1}/${pages.length}`;
    p.drawText(t, { x: W - M - F.widthOfTextAtSize(t, 8), y: 28, size: 8, font: F, color: MUT });
  });

  const json = S.lastJson = { format: "questionnaire-satisfaction", version: 2, code, service: S.service, accompagnement: S.type, public: S.who,
    date_envoi: `${now.getFullYear()}-${z(now.getMonth() + 1)}-${z(now.getDate())}`, voix: S.sound, complet: !partial,
    nb_questions: qs.length, reponses: data };
  await doc.attach(new TextEncoder().encode(JSON.stringify(json, null, 2)), "reponses.json", {
    mimeType: "application/json", description: "Réponses au questionnaire, pour le logiciel d'analyse", creationDate: now, modificationDate: now });
  doc.setTitle(`Questionnaire ${ID.nomCourt} – réponses`); doc.setSubject("questionnaire-satisfaction v1"); doc.setKeywords(["questionnaire-satisfaction", "v1", code]);
  doc.setCreator("Prototype de questionnaire de satisfaction"); doc.setProducer("Prototype de questionnaire de satisfaction");
  return await doc.save();
}

/* ---------- numéros d'urgence ---------- */
/* Le message s'adresse à la personne ET à ses proches : ce n'est pas une aide pour remplir
   le questionnaire, d'où le libellé « Numéros d'urgence » du bouton du haut. */
function helpMsg() {
  return T("Si tu as besoin d’aide, ou si l’un de tes proches en a besoin, tu peux appeler. C’est gratuit.",
           "Si vous ou l’un de vos proches avez besoin d’aide, vous pouvez appeler. C’est gratuit.");
}
function helpNums() {
  return AIDE.map(([n, d]) => `<a class="num" href="tel:${n.split("·")[0].replace(/\s/g, "")}"><b>${n}</b><span>${d}</span></a>`).join("");
}
function helpSpoken() { return helpMsg() + " " + AIDE.map(([n, d]) => d + " : " + n.replace(/·/g, ",")).join(". "); }
function helpSheet() {
  stopVoice();
  const bg = document.createElement("div"); bg.className = "sheet-bg";
  bg.innerHTML = `<div class="sheet" role="dialog" aria-label="Numéros d’urgence"><div class="grab"></div><h2>Numéros d’urgence</h2><p class="sm">${helpMsg()}</p>
    ${helpNums()}
    <button class="btn ghost" style="width:100%;margin-top:14px" id="hclose">Fermer</button></div>`;
  document.body.append(bg);
  bg.onclick = e => { if (e.target === bg) bg.remove(); };
  $("#hclose", bg).onclick = () => bg.remove();
  say(helpSpoken());
}
/* bloc repris sur les écrans de fin, quand la personne quitte le questionnaire */
function helpBlock() {
  return `<div class="help-end"><p>${helpMsg()}</p>${helpNums()}</div>`;
}

/* ---------- démarrage ---------- */
$("#helpBtn").innerHTML = I.phone + " Numéros d’urgence";
$("#helpBtn").onclick = helpSheet;
$("#soundBtn").onclick = () => { if (!voiceOK()) { S.sound = false; header(true); return; } S.sound = !S.sound; header(true); if (!S.sound) stopVoice(); else say("La voix est activée.", true); };
$("#topLogo").src = LOGO_PNG; $("#topLogo").alt = ID.nomCourt; document.title = ID.titre;
screenStart();
})();
