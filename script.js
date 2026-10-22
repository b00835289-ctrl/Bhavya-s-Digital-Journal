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

  // Animated me: long flowy brown hair, square clear glasses, a 70s striped top
  // with bell sleeves, flared jeans and platform boots. Colours live in styles.css.
  const AVATAR = `
<svg class="bhavya" viewBox="0 0 64 96" aria-hidden="true">
  <g class="hair-back">
    <path d="M22 10 C30 3 44 4 47 14 C48 19 46 23 44 25 L33 34 C31 42 30 50 28 57 C26 61 22 57 20 60 C17 62 15 58 15 55 C11 52 13 47 11 43 C9 37 11 31 10 26 C9 18 15 12 22 10 Z" fill="var(--hair)"/>
    <path d="M14 24 C12 32 15 40 13 48 M19 27 C17 36 20 45 18 55 M24 32 C23 40 25 48 23 56" stroke="var(--hair-light)" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  </g>
  <g class="limb leg back">
    <rect x="27" y="81" width="13" height="5.5" rx="1.5" fill="var(--boot-dark)"/><rect x="26.5" y="86" width="14" height="3" rx="1" fill="var(--boot-sole)"/>
    <path d="M29 59 H36 L39 83 H27 Z" fill="var(--denim-dark)"/>
  </g>
  <g class="limb arm back"><path d="M29.5 37 H36 L38.5 55 H27 Z" fill="var(--top-shade)"/><circle cx="32.7" cy="56.5" r="2.4" fill="var(--skin-dark)"/></g>
  <rect x="31" y="30" width="6" height="8" fill="var(--skin-dark)"/>
  <rect x="22" y="35" width="21" height="22" rx="7" fill="var(--top)"/>
  <rect x="22.4" y="44" width="20.2" height="3" fill="var(--top-stripe-1)"/>
  <rect x="22.4" y="48.5" width="20.2" height="2" fill="var(--top-stripe-2)"/>
  <path d="M28 35 L32.5 42 L37 35 Z" fill="var(--skin)"/>
  <path d="M27.5 35 L24 40 L30 38.5 Z M37.5 35 L41 40 L35 38.5 Z" fill="var(--top-collar)"/>
  <rect x="22.5" y="55" width="20" height="7" rx="3" fill="var(--denim)"/>
  <rect x="22.5" y="55" width="20" height="2.4" fill="var(--belt)"/><rect x="31" y="54.6" width="3.4" height="3.2" rx=".6" fill="none" stroke="#e8c46a" stroke-width=".9"/>
  <g class="limb leg front">
    <rect x="27" y="81" width="13" height="5.5" rx="1.5" fill="var(--boot)"/><rect x="26.5" y="86" width="14" height="3" rx="1" fill="var(--boot-sole)"/>
    <path d="M29 59 H36 L39 83 H27 Z" fill="var(--denim)"/>
    <path d="M32.5 66 V82" stroke="var(--denim-dark)" stroke-width=".7" stroke-dasharray="1.4 1.2"/>
  </g>
  <g class="limb arm front"><path d="M29.5 37 H36 L38.5 55 H27 Z" fill="var(--top)"/><path d="M27.6 51 H38" stroke="var(--top-stripe-1)" stroke-width="1.6"/><circle cx="32.7" cy="56.5" r="2.4" fill="var(--skin)"/></g>
  <circle cx="35" cy="22" r="12" fill="var(--skin)"/>
  <path d="M22.5 17 C20 24 21 32 23.5 38 C25 31 25 24 26 19 Z" fill="var(--hair)"/>
  <path d="M22 19 C21 9 34 5 42 8.5 C46.5 10.5 48 15 47 20 C43 14 37 12.5 31 15 C28 16.5 25 18 22 19 Z" fill="var(--hair)"/>
  <path d="M30 10 C34 9 39 10 43 13" stroke="var(--hair-light)" stroke-width="1" fill="none" stroke-linecap="round"/>
  <g class="flower">
    <ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(72 24 14)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(144 24 14)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(216 24 14)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(288 24 14)"/>
    <circle cx="24" cy="14" r="1.3" fill="#ffc93c"/>
  </g>
  <path d="M29.8 17.4 Q32 16.4 34.2 17.4 M38.3 17.4 Q40.5 16.4 42.7 17.4" stroke="var(--hair)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <g class="eyes"><ellipse cx="32" cy="22.5" rx="1.6" ry="2.1" fill="#2a1a12"/><ellipse cx="40.5" cy="22.5" rx="1.6" ry="2.1" fill="#2a1a12"/><circle cx="32.5" cy="21.7" r=".55" fill="#fff"/><circle cx="41" cy="21.7" r=".55" fill="#fff"/></g>
  <g fill="var(--lens)" stroke="var(--frames)" stroke-width="1.1"><rect x="28" y="19" width="8" height="7" rx="1.4"/><rect x="36.6" y="19" width="8" height="7" rx="1.4"/></g>
  <path d="M36 21.6 H36.6 M28 21.4 L24.5 20.6" stroke="var(--frames)" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  <path d="M43.6 25.6 q1.2 1 0 2" stroke="var(--skin-dark)" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="28.3" r="1.8" fill="#ff7f8f" opacity=".45"/>
  <path d="M34 28.6 Q38 33.4 42 28.6 Z" fill="#fff" stroke="#6a2626" stroke-width="1.2" stroke-linejoin="round"/>
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
        o.style.bottom = `calc(${LANES[i]}% + 26px)`;
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
