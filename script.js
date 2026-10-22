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

  // Animated me: an original character mixing Mirabel (Encanto) and Moana —
  // big curly hair, round green glasses, embroidered blouse, a flower behind the
  // ear, shell necklace and a tapa-pattern skirt. Colours live in styles.css.
  const AVATAR = `
<svg class="bhavya" viewBox="0 0 64 96" aria-hidden="true">
  <g class="hair-back" fill="var(--hair)">
    <circle cx="27" cy="11" r="9"/><circle cx="38" cy="8" r="8.5"/><circle cx="46" cy="14" r="6.5"/>
    <circle cx="20" cy="19" r="9"/><circle cx="16" cy="29" r="8.5"/><circle cx="17" cy="39" r="7.5"/>
    <circle cx="20" cy="47" r="6.5"/><circle cx="25" cy="52" r="5"/><circle cx="25" cy="31" r="8"/><circle cx="26" cy="42" r="6"/>
    <path d="M13 26 q-2 4 1 7 M14 37 q-2 4 1 7 M19 46 q-1 4 2 6 M22 15 q-3 3 -1 7 M30 6 q4 -2 7 0" stroke="var(--hair-light)" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  </g>
  <g class="limb leg back"><rect x="29" y="60" width="7" height="25" rx="3.5" fill="var(--skin-dark)"/><rect x="28" y="84" width="12" height="4" rx="2" fill="var(--sandal)"/><path d="M30 84 L33 81 L36 84" stroke="var(--sandal)" stroke-width="1.4" fill="none"/></g>
  <g class="limb arm back"><rect x="29.5" y="38" width="6.5" height="19" rx="3.2" fill="var(--skin-dark)"/><circle cx="32.5" cy="40" r="4.5" fill="var(--blouse-shade)"/></g>
  <rect x="31" y="30" width="6" height="8" fill="var(--skin-dark)"/>
  <rect x="22" y="35" width="21" height="17" rx="7" fill="var(--blouse)"/>
  <path d="M26 36 Q32.5 41 39 36" stroke="var(--embroidery-1)" stroke-width="1.4" fill="none" stroke-dasharray="1.6 1.4"/>
  <g class="embroidery"><circle cx="26.5" cy="43" r="1.3" fill="var(--embroidery-1)"/><circle cx="31" cy="45" r="1.3" fill="var(--embroidery-2)"/><circle cx="35.5" cy="43" r="1.3" fill="var(--embroidery-3)"/><circle cx="39.5" cy="46" r="1.3" fill="var(--embroidery-4)"/><circle cx="28" cy="48.5" r="1" fill="var(--embroidery-3)"/><circle cx="37" cy="49" r="1" fill="var(--embroidery-1)"/></g>
  <path d="M28.5 37.5 Q34 43 39.5 37.5" stroke="#3a2a1a" stroke-width=".8" fill="none"/>
  <path d="M34 41 l-1.8 1.6 l1.8 2.4 l1.8 -2.4 Z" fill="var(--shell)"/>
  <g class="limb leg front"><rect x="29" y="60" width="7" height="25" rx="3.5" fill="var(--skin)"/><rect x="28" y="84" width="12" height="4" rx="2" fill="var(--sandal)"/><path d="M30 84 L33 81 L36 84" stroke="var(--sandal)" stroke-width="1.4" fill="none"/></g>
  <g class="skirt">
    <path d="M22 50 L43 50 L48.5 67 Q33 71.5 17.5 67 Z" fill="var(--skirt)"/>
    <path d="M19 63.5 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5 l3 -2.5 l3 2.5 l3 -2.5 l2 2" stroke="var(--skirt-band)" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
    <path d="M23 53 L42 53" stroke="var(--skirt-band)" stroke-width="1" stroke-dasharray="2 1.5"/>
    <circle cx="27" cy="58" r="1.1" fill="var(--embroidery-2)"/><circle cx="38" cy="57" r="1.1" fill="var(--embroidery-1)"/>
  </g>
  <g class="limb arm front"><rect x="29.5" y="38" width="6.5" height="19" rx="3.2" fill="var(--skin)"/><circle cx="32.5" cy="40" r="4.8" fill="var(--blouse)"/><circle cx="32.5" cy="41" r="1.1" fill="var(--embroidery-2)"/></g>
  <circle cx="35" cy="22" r="12" fill="var(--skin)"/>
  <g fill="var(--hair)">
    <circle cx="27" cy="12.5" r="5.5"/><circle cx="33" cy="9.5" r="5.5"/><circle cx="39.5" cy="10" r="5"/><circle cx="44.5" cy="13.5" r="4"/>
    <circle cx="24" cy="19" r="4.5"/><circle cx="23.5" cy="26" r="3.8"/>
  </g>
  <g class="flower">
    <ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(72 24 14)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(144 24 14)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(216 24 14)"/><ellipse cx="24" cy="12" rx="2.4" ry="1.4" fill="var(--flower)" transform="rotate(288 24 14)"/>
    <circle cx="24" cy="14" r="1.3" fill="#ffc93c"/>
  </g>
  <path d="M30 17.2 Q32 16 34 17.2 M38.5 17.2 Q40.5 16 42.5 17.2" stroke="var(--hair)" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <g class="eyes"><ellipse cx="32" cy="22.5" rx="1.7" ry="2.3" fill="#2a1a12"/><ellipse cx="40.5" cy="22.5" rx="1.7" ry="2.3" fill="#2a1a12"/><circle cx="32.6" cy="21.6" r=".6" fill="#fff"/><circle cx="41.1" cy="21.6" r=".6" fill="#fff"/></g>
  <g fill="rgba(255,255,255,.2)" stroke="var(--frames)" stroke-width="1.6"><circle cx="32" cy="22.5" r="4.2"/><circle cx="40.5" cy="22.5" r="4.2"/></g>
  <path d="M36.2 22 Q36.25 21.2 36.3 22 M27.8 22 L24.5 21" stroke="var(--frames)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M43.5 25.5 q1.2 1 0 2" stroke="var(--skin-dark)" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="28" r="1.8" fill="#ff7f8f" opacity=".45"/>
  <path d="M34 28.5 Q38 33.5 42 28.5 Z" fill="#fff" stroke="#6a2626" stroke-width="1.2" stroke-linejoin="round"/>
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
