// Behaviour of the journal: tabs, blog pages and the Checkpoint Run game.
// Content lives in sessions.js — you normally don't need to touch this file.
(() => {
  const SESSIONS = window.SESSIONS || [];
  const JOURNAL = window.JOURNAL || {};
  const app = document.getElementById("app");
  const nav = document.getElementById("tabs");
  let activeGame = null;

  // localStorage can be blocked (private windows), so never let it crash the page.
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const checkpointsOf = (s) => (s.sections || []).filter((x) => x.checkpoint).map((x) => x.checkpoint);

  const STATUS = { upcoming: "Coming up", draft: "Writing…", complete: "Complete" };

  // Animated me, flat 2D and front-facing: dark wavy bob, thick brows, big eyes,
  // gold hoops and glasses; pink puffer jacket, white tee, ripped jeans and white
  // boots. Colours live in styles.css.
  const AVATAR = `
<svg class="bhavya" viewBox="0 0 60 120" aria-hidden="true">
  <g class="hair-back">
    <path d="M30 6.5 C18.5 6.5 14.5 15 15.5 23 C15.8 27 13.5 29.5 12.8 33 C14.5 32.5 15.5 33.5 15.2 35.5 C17.5 34 19 35.5 20 37.5 C21.5 35 23.5 34.5 24 32 L24 28 L36 28 L36 32 C36.5 34.5 38.5 35 40 37.5 C41 35.5 42.5 34 44.8 35.5 C44.5 33.5 45.5 32.5 47.2 33 C46.5 29.5 44.2 27 44.5 23 C45.5 15 41.5 6.5 30 6.5 Z" fill="var(--hair)"/>
    <path d="M18 18 C16.5 24 17 29 15.5 33 M42 18 C43.5 24 43 29 44.5 33 M21 26 C20.5 30 21 33 20 36 M39 26 C39.5 30 39 33 40 36" stroke="var(--hair-dark)" stroke-width=".7" fill="none" stroke-linecap="round"/>
  </g>
  <g class="limb leg back">
    <path d="M22.5 59 H29.6 L29.2 100 H23 Z" fill="var(--jeans)"/>
    <path d="M27.5 60 L27.2 100" stroke="var(--jeans-dark)" stroke-width=".6"/>
    <ellipse cx="26" cy="81" rx="2" ry="1.3" fill="var(--skin)"/>
    <path d="M23.8 80.4 l.7 -.6 l.6 .5 l.7 -.6 l.6 .5 l.7 -.6 l.6 .5 l.7 -.5 M23.8 81.8 l.7 .5 l.6 -.4 l.7 .5 l.6 -.4 l.7 .5 l.6 -.4 l.7 .4" stroke="var(--fray)" stroke-width=".55" fill="none"/>
    <rect x="22.4" y="98" width="7.4" height="8" rx="1.5" fill="var(--boot)"/>
    <path d="M21.6 104.5 H30.6 Q31.8 104.5 31.8 106 V107.5 H21.6 Z" fill="var(--boot)"/>
    <rect x="21.4" y="107.2" width="10.6" height="2.2" rx=".8" fill="var(--boot-sole)"/>
    <path d="M24.3 100 h3.6 M24.3 102 h3.6 M24.3 104 h3.6" stroke="var(--boot-shade)" stroke-width=".5"/>
  </g>
  <g class="limb leg front">
    <path d="M30.4 59 H37.5 L37 100 H30.8 Z" fill="var(--jeans)"/>
    <path d="M32.5 60 L32.8 100" stroke="var(--jeans-dark)" stroke-width=".6"/>
    <ellipse cx="34" cy="69" rx="1.8" ry="1.1" fill="var(--skin)"/>
    <path d="M32 68.5 l.7 -.5 l.6 .4 l.7 -.5 l.6 .4 l.7 -.5 M32 69.6 l.7 .4 l.6 -.4 l.7 .4 l.6 -.4 l.7 .4" stroke="var(--fray)" stroke-width=".55" fill="none"/>
    <ellipse cx="34" cy="83" rx="2" ry="1.3" fill="var(--skin)"/>
    <path d="M31.8 82.4 l.7 -.6 l.6 .5 l.7 -.6 l.6 .5 l.7 -.6 l.6 .5 l.7 -.5 M31.8 83.8 l.7 .5 l.6 -.4 l.7 .5 l.6 -.4 l.7 .5 l.6 -.4 l.7 .4" stroke="var(--fray)" stroke-width=".55" fill="none"/>
    <rect x="30.2" y="98" width="7.4" height="8" rx="1.5" fill="var(--boot)"/>
    <path d="M29.4 104.5 H38.4 Q39.6 104.5 39.6 106 V107.5 H29.4 Z" fill="var(--boot)"/>
    <rect x="29.2" y="107.2" width="10.6" height="2.2" rx=".8" fill="var(--boot-sole)"/>
    <path d="M32.1 100 h3.6 M32.1 102 h3.6 M32.1 104 h3.6" stroke="var(--boot-shade)" stroke-width=".5"/>
  </g>
  <rect x="22.3" y="55" width="15.4" height="7" rx="2" fill="var(--jeans)"/>
  <path d="M30 55.5 V62" stroke="var(--jeans-dark)" stroke-width=".6"/>
  <rect x="27.5" y="27" width="5" height="7" fill="var(--skin-shade)"/>
  <rect x="22.5" y="33" width="15" height="23" rx="3" fill="var(--tee)"/>
  <path d="M27 33.2 Q30 36 33 33.2" stroke="var(--skin-shade)" stroke-width="1.6" fill="none"/>
  <g class="limb arm back">
    <path d="M20 34.5 C15.5 36 14.3 43 14 49.5 L13.4 56.5 L18.8 57.5 L19.8 50 L22.5 39 Z" fill="var(--jacket)"/>
    <path d="M14.6 43.5 Q17.3 44.5 20.6 43.5 M14 50 Q16.7 51 19.6 50" stroke="var(--jacket-shade)" stroke-width=".7" fill="none"/>
    <rect x="13" y="55.5" width="6.2" height="3" rx="1.2" fill="var(--jacket-shade)"/>
    <ellipse cx="15.8" cy="60.6" rx="1.9" ry="2.3" fill="var(--skin)"/>
  </g>
  <g class="limb arm front">
    <path d="M40 34.5 C44.5 36 45.7 43 46 49.5 L46.6 56.5 L41.2 57.5 L40.2 50 L37.5 39 Z" fill="var(--jacket)"/>
    <path d="M45.4 43.5 Q42.7 44.5 39.4 43.5 M46 50 Q43.3 51 40.4 50" stroke="var(--jacket-shade)" stroke-width=".7" fill="none"/>
    <rect x="40.8" y="55.5" width="6.2" height="3" rx="1.2" fill="var(--jacket-shade)"/>
    <ellipse cx="44.2" cy="60.6" rx="1.9" ry="2.3" fill="var(--skin)"/>
  </g>
  <path d="M25.5 33 L21 34 C18.8 35 18 38 18.2 42 L18.8 57.5 L27 57.5 L27 41 Z" fill="var(--jacket)"/>
  <path d="M34.5 33 L39 34 C41.2 35 42 38 41.8 42 L41.2 57.5 L33 57.5 L33 41 Z" fill="var(--jacket)"/>
  <path d="M18.4 45 Q22.5 46.3 27 45 M18.6 51 Q22.7 52.3 27 51 M41.6 45 Q37.5 46.3 33 45 M41.4 51 Q37.3 52.3 33 51" stroke="var(--jacket-shade)" stroke-width=".7" fill="none"/>
  <path d="M27 41 V57.5 M33 41 V57.5" stroke="var(--jacket-light)" stroke-width=".8"/>
  <path d="M18.7 55 H27 V57.6 H18.8 Z M33 55 H41.3 L41.2 57.6 H33 Z" fill="var(--jacket-shade)"/>
  <path d="M25.6 33.2 L22 27.5 L23.5 33 L27 41 Z M34.4 33.2 L38 27.5 L36.5 33 L33 41 Z" fill="var(--jacket-shade)"/>
  <path d="M25.6 33.2 L22.6 28 L27.3 31.2 Z M34.4 33.2 L37.4 28 L32.7 31.2 Z" fill="var(--jacket)"/>
  <ellipse cx="21.6" cy="21.5" rx="1.6" ry="2.2" fill="var(--skin-shade)"/>
  <ellipse cx="38.4" cy="21.5" rx="1.6" ry="2.2" fill="var(--skin-shade)"/>
  <circle cx="21.4" cy="25.6" r="1.9" fill="none" stroke="var(--gold)" stroke-width=".7"/>
  <circle cx="38.6" cy="25.6" r="1.9" fill="none" stroke="var(--gold)" stroke-width=".7"/>
  <ellipse cx="30" cy="19.8" rx="8.2" ry="9.6" fill="var(--skin)"/>
  <path d="M30 7.6 C23.5 8.4 20.6 13.8 21.3 21.5 C23.6 17.6 26.8 13.4 30 11.2 C33.2 13.4 36.4 17.6 38.7 21.5 C39.4 13.8 36.5 8.4 30 7.6 Z" fill="var(--hair)"/>
  <path d="M32.6 11.4 C36 14.6 38.4 18.6 37.6 24.5" stroke="var(--hair)" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M24.6 16.6 Q26.7 15.2 28.6 16.3 M31.4 16.3 Q33.3 15.2 35.4 16.6" stroke="var(--hair-dark)" stroke-width="1.05" fill="none" stroke-linecap="round"/>
  <g class="eyes">
    <ellipse cx="26.6" cy="19.6" rx="1.95" ry="1.65" fill="#fff"/><ellipse cx="33.4" cy="19.6" rx="1.95" ry="1.65" fill="#fff"/>
    <circle cx="26.8" cy="19.7" r="1.3" fill="#2a1a14"/><circle cx="33.2" cy="19.7" r="1.3" fill="#2a1a14"/>
    <circle cx="27.2" cy="19.2" r=".42" fill="#fff"/><circle cx="33.6" cy="19.2" r=".42" fill="#fff"/>
    <path d="M24.5 18.6 L24 18 M35.5 18.6 L36 18" stroke="#2a1a14" stroke-width=".5" stroke-linecap="round"/>
  </g>
  <g fill="var(--lens)" stroke="var(--frames)" stroke-width=".6"><rect x="23.7" y="17.3" width="5.8" height="4.6" rx="1.2"/><rect x="30.5" y="17.3" width="5.8" height="4.6" rx="1.2"/></g>
  <path d="M29.5 19.2 H30.5 M23.7 19 L22.2 18.6 M36.3 19 L37.8 18.6" stroke="var(--frames)" stroke-width=".6" stroke-linecap="round"/>
  <ellipse cx="30" cy="23" rx="1.1" ry=".8" fill="var(--skin-shade)"/>
  <ellipse cx="25.3" cy="24.2" rx="1.7" ry="1" fill="var(--blush)" opacity=".6"/><ellipse cx="34.7" cy="24.2" rx="1.7" ry="1" fill="var(--blush)" opacity=".6"/>
  <path d="M27.4 25.6 Q30 27.8 32.6 25.6 Q30 26.5 27.4 25.6 Z" fill="var(--lips)"/>
</svg>`;

  // Hand-drawn sparkle, like the doodles on my Instagram posts.
  const DOODLE = `<svg viewBox="0 0 24 24"><path d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

  // ── Tabs & routing ────────────────────────────────────────────────────────
  function renderTabs(current) {
    const items = [{ id: "home", label: "Home" }, ...SESSIONS.map((s, i) => ({ id: s.id, label: s.tab || `Session ${i + 1}`, status: s.status }))];
    nav.innerHTML = items
      .map(
        (t) =>
          `<a href="#${esc(t.id)}" class="tab${t.id === current ? " active" : ""}${t.status === "upcoming" ? " dim" : ""}"${
            t.id === current ? ' aria-current="page"' : ""
          }>${esc(t.label)}</a>`
      )
      .join("");
    const active = nav.querySelector(".active");
    if (active) active.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function route() {
    if (activeGame) { activeGame.destroy(); activeGame = null; }
    const id = decodeURIComponent(location.hash.slice(1)) || "home";
    const s = SESSIONS.find((x) => x.id === id);
    renderTabs(s ? s.id : "home");
    if (s) renderSession(s);
    else renderHome();
    window.scrollTo(0, 0);
  }

  // ── Home ──────────────────────────────────────────────────────────────────
  function card(s, i) {
    const cps = checkpointsOf(s).length;
    const best = store.get("bdpj:best:" + s.id);
    const foot =
      s.status === "complete"
        ? best != null ? `⭐ Best run: ${best} / ${cps}` : `🎮 Game unlocked: ${cps} checkpoints`
        : s.status === "draft" ? `✍️ ${cps} checkpoint${cps === 1 ? "" : "s"} written` : "🔒 Game locked";
    return `
      <a class="card card-${esc(s.status)}" href="#${esc(s.id)}">
        <div class="card-top"><span class="card-num">${String(i + 1).padStart(2, "0")}</span><span class="chip chip-${esc(s.status)}">${STATUS[s.status] || ""}</span></div>
        <h3>${esc(s.title)}</h3>
        <p class="meta">${esc(s.speaker)} · ${esc(s.date)}</p>
        <p class="card-foot">${foot}</p>
      </a>`;
  }

  function renderHome() {
    const done = SESSIONS.filter((s) => s.status === "complete").length;
    const stars = SESSIONS.reduce((n, s) => n + (store.get("bdpj:best:" + s.id) || 0), 0);
    app.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <p class="eyebrow">${esc(JOURNAL.school)} · ${esc(JOURNAL.course)} · ${esc(JOURNAL.term)}</p>
          <h1>Bhavya's Digital Platform <em>Journal</em></h1>
          <p class="lede">One tab for every guest speaker this semester. After each session I write a blog, and every key idea becomes a <strong>checkpoint</strong>. When a blog is complete, its game unlocks: help animated me run the track and collect the right answer at every checkpoint.</p>
          <div class="stats">
            <div><b>${SESSIONS.length}</b><span>sessions</span></div>
            <div><b>${done}</b><span>blogs complete</span></div>
            <div><b>${stars}</b><span>answers collected</span></div>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <div class="hero-track"></div>
          <div class="avatar idle">${AVATAR}</div>
          <span class="hero-label l1">Musician / singer</span><span class="hero-label l2">Marketer ↗</span><span class="hero-label l3">MSc @ ESSEC</span>
          <span class="doodle d1">${DOODLE}</span><span class="doodle d2">${DOODLE}</span><span class="doodle d3">${DOODLE}</span>
          <span class="note n1">♪</span><span class="note n2">♫</span>
        </div>
      </section>

      <h2 class="section-title">Sessions</h2>
      <div class="cards">${SESSIONS.map(card).join("")}</div>

      <section class="how">
        <div><span>1</span><h3>Read the blog</h3><p>My notes from each guest speaker, updated as the semester goes on.</p></div>
        <div><span>2</span><h3>Spot the checkpoints</h3><p>Every ✦ checkpoint marks an idea worth remembering. Each one becomes a question.</p></div>
        <div><span>3</span><h3>Run &amp; collect</h3><p>Switch lanes and grab the right answer before it zooms past.</p></div>
      </section>`;
  }

  // ── Session page ──────────────────────────────────────────────────────────
  function renderSession(s) {
    const cps = checkpointsOf(s);
    let n = 0;
    const sections = (s.sections || [])
      .map((sec) => {
        const cp = sec.checkpoint
          ? `<div class="cp-marker"><span class="cp-flag">${DOODLE}</span><span><b>Checkpoint ${++n}</b>: remember this one, I'll need it in the game.</span></div>`
          : "";
        return `<section class="post-section"><h2>${esc(sec.heading)}</h2><div class="post-body">${sec.body || ""}</div>${cp}</section>`;
      })
      .join("");

    const unlocked = s.status === "complete" && cps.length > 0;
    app.innerHTML = `
      <article class="post">
        <header class="post-head">
          <span class="chip chip-${esc(s.status)}">${STATUS[s.status] || ""}</span>
          <h1>${esc(s.title)}</h1>
          <p class="meta">${esc(s.speaker)} · ${esc(s.date)}</p>
          ${s.summary ? `<p class="lede">${esc(s.summary)}</p>` : ""}
          ${unlocked ? `<a class="btn" href="#game" data-jump>Skip to the game ▶</a>` : ""}
        </header>
        ${sections || `<div class="empty">✍️ This blog hasn't been written yet. Check back after the session!</div>`}
      </article>

      <section class="game-card" id="game">
        <div class="game-head">
          <h2>Checkpoint Run</h2>
          <p>${unlocked ? `${cps.length} checkpoints · collect the right answer at each one` : "Unlocks when this blog is complete"}</p>
        </div>
        ${
          unlocked
            ? `<div class="game-mount"></div>`
            : `<div class="locked"><div class="avatar idle small">${AVATAR}</div><p>🔒 ${
                cps.length ? `${cps.length} checkpoint${cps.length === 1 ? "" : "s"} written so far. ` : ""
              }I'm still writing this blog. The run opens once it's marked <b>complete</b>.</p></div>`
        }
      </section>`;

    const jump = app.querySelector("[data-jump]");
    if (jump) jump.addEventListener("click", (e) => { e.preventDefault(); document.getElementById("game").scrollIntoView({ behavior: "smooth" }); });

    const mount = app.querySelector(".game-mount");
    if (mount) activeGame = createGame(mount, s, cps);
  }

  // ── The game ──────────────────────────────────────────────────────────────
  function createGame(mount, session, checkpoints) {
    const total = checkpoints.length;
    mount.innerHTML = `
      <div class="quest" aria-live="polite"><span class="quest-step">Get ready</span><span class="quest-q">Help me collect the right answer at every checkpoint!</span></div>
      <div class="stage" tabindex="0" aria-label="Game area. Use the up and down arrow keys to switch lanes.">
        <div class="sky"><div class="stars"></div><div class="moon"></div><span class="doodle d1">${DOODLE}</span><span class="doodle d2">${DOODLE}</span><div class="hills"></div></div>
        <div class="track"><i></i><i></i><i></i></div>
        <div class="gate"><div class="gate-flag">CHECKPOINT</div></div>
        <div class="orb"></div><div class="orb"></div><div class="orb"></div>
        <div class="runner"><div class="bubble"></div><div class="avatar">${AVATAR}</div></div>
        <div class="overlay"><div class="overlay-box"></div></div>
      </div>
      <div class="controls">
        <button class="btn ghost" data-move="-1" aria-label="Move up a lane">▲ Up</button>
        <span class="score">⭐ 0 / ${total}</span>
        <button class="btn ghost" data-move="1" aria-label="Move down a lane">▼ Down</button>
      </div>`;

    const stage = mount.querySelector(".stage");
    const runner = mount.querySelector(".runner");
    const bubble = mount.querySelector(".bubble");
    const orbs = [...mount.querySelectorAll(".orb")];
    const gate = mount.querySelector(".gate");
    const overlay = mount.querySelector(".overlay");
    const overlayBox = mount.querySelector(".overlay-box");
    const stepEl = mount.querySelector(".quest-step");
    const qEl = mount.querySelector(".quest-q");
    const scoreEl = mount.querySelector(".score");

    const LANES = [46, 25, 4]; // feet position of each lane, % from the bottom
    let lane = 1, idx = 0, score = 0, phase = "idle", x = 0, raf = 0, last = 0, order = [], results = [];
    let timers = [];

    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const runnerX = () => Math.max(36, stage.clientWidth * 0.1);
    const speed = () => Math.max(90, stage.clientWidth / 5.5);

    function setLane(l) {
      lane = Math.max(0, Math.min(2, l));
      runner.style.bottom = LANES[lane] + "%";
      runner.style.zIndex = 20 + lane * 2;
    }

    function say(text, kind) {
      bubble.textContent = text;
      bubble.className = "bubble show " + (kind || "");
    }

    function place() {
      orbs.forEach((o) => (o.style.left = x + "px"));
      gate.style.left = x - 34 + "px";
    }

    function showOverlay(html, btnLabel) {
      overlayBox.innerHTML = html + `<button class="btn start">${btnLabel}</button>`;
      overlay.hidden = false;
      overlayBox.querySelector(".start").addEventListener("click", start);
    }

    function start() {
      idx = 0; score = 0; results = [];
      overlay.hidden = true;
      bubble.className = "bubble";
      setLane(1);
      stage.classList.add("moving");
      stage.focus({ preventScroll: true });
      updateScore();
      nextQuestion();
    }

    function nextQuestion() {
      const cp = checkpoints[idx];
      phase = "ask";
      stepEl.textContent = `Checkpoint ${idx + 1} / ${total}`;
      qEl.textContent = cp.q;
      order = shuffle(cp.options.slice(0, 3).map((_, i) => i));
      orbs.forEach((o, i) => {
        const opt = order[i];
        o.className = "orb";
        o.hidden = opt === undefined;
        o.textContent = opt === undefined ? "" : cp.options[opt];
        o.style.bottom = `calc(${LANES[i]}% + var(--orb-lift))`;
        o.style.zIndex = 20 + i * 2 + 1;
      });
      x = stage.clientWidth + 60;
      place();
      later(() => (phase = "run"), 1600); // time to read the question
    }

    function collect() {
      phase = "resolve";
      const cp = checkpoints[idx];
      const picked = order[lane];
      const ok = picked === cp.answer;
      if (ok) score++;
      results.push({ q: cp.q, picked: picked === undefined ? "(empty lane)" : cp.options[picked], correct: cp.options[cp.answer], ok });
      orbs.forEach((o, i) => o.classList.add(i === lane ? (ok ? "got" : "miss") : "pass"));
      runner.classList.add(ok ? "cheer" : "oops");
      say(ok ? pick(["Got it! ✨", "Yes! ⭐", "Nailed it!", "Collected!"]) : `Oops! It was “${cp.options[cp.answer]}”`, ok ? "good" : "bad");
      updateScore();
      later(() => {
        runner.classList.remove("cheer", "oops");
        bubble.className = "bubble";
        idx++;
        idx < total ? nextQuestion() : finish();
      }, ok ? 1300 : 2400);
    }

    function finish() {
      phase = "done";
      stage.classList.remove("moving");
      const best = Math.max(score, store.get("bdpj:best:" + session.id) || 0);
      store.set("bdpj:best:" + session.id, best);
      stepEl.textContent = "Finish line";
      qEl.textContent = `I collected ${score} of ${total} answers!`;
      const title = score === total ? "Perfect run! 🏆" : score >= total / 2 ? "Great run! 🎉" : "Run complete!";
      showOverlay(
        `<h3>${title}</h3>
         <p class="big">⭐ ${score} / ${total} <small>· best ${best}</small></p>
         <ol class="review">${results
           .map((r) => `<li class="${r.ok ? "ok" : "no"}"><span>${esc(r.q)}</span><b>${r.ok ? "✓ " + esc(r.correct) : "✗ " + esc(r.picked) + " → " + esc(r.correct)}</b></li>`)
           .join("")}</ol>`,
        "Run again ↻"
      );
    }

    function updateScore() {
      scoreEl.textContent = `⭐ ${score} / ${total}`;
    }

    function tick(t) {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (phase === "run" || phase === "resolve") {
        x -= speed() * dt;
        place();
        if (phase === "run" && x <= runnerX() + 44) collect();
      }
      raf = requestAnimationFrame(tick);
    }

    const playing = () => phase === "ask" || phase === "run" || phase === "resolve";
    const onKey = (e) => {
      if (!playing()) return;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") { setLane(lane - 1); e.preventDefault(); }
      else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") { setLane(lane + 1); e.preventDefault(); }
    };
    document.addEventListener("keydown", onKey);

    // Tap a lane to jump to it.
    stage.addEventListener("pointerdown", (e) => {
      if (!playing()) return;
      const r = stage.getBoundingClientRect();
      const fromBottom = ((r.bottom - e.clientY) / r.height) * 100;
      setLane(fromBottom > 42 ? 0 : fromBottom > 21 ? 1 : 2);
    });
    mount.querySelectorAll("[data-move]").forEach((b) =>
      b.addEventListener("click", () => playing() && setLane(lane + Number(b.dataset.move)))
    );

    setLane(1);
    showOverlay(
      `<h3>Ready, ${esc(JOURNAL.owner || "Bhavya")}?</h3>
       <p>${total} checkpoints ahead. Read the question, then switch lanes with <kbd>↑</kbd> <kbd>↓</kbd> (or tap a lane) to run into the right answer.</p>`,
      "Start running ▶"
    );
    last = performance.now();
    raf = requestAnimationFrame(tick);

    return {
      destroy() {
        cancelAnimationFrame(raf);
        timers.forEach(clearTimeout);
        timers = [];
        document.removeEventListener("keydown", onKey);
      },
    };
  }

  window.addEventListener("hashchange", () => {
    // "#game" is an in-page anchor, not a tab.
    if (location.hash === "#game") return;
    route();
  });
  route();
})();
