// ✏️  THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE YOUR JOURNAL.
//
// Each object in SESSIONS becomes one tab on the website.
//   status: "upcoming"  → tab shows "coming up", no blog yet
//           "draft"     → blog is visible, game is still locked
//           "complete"  → blog is finished and the Checkpoint Run game unlocks
//
// Every section can have a `checkpoint`. Each checkpoint becomes one question
// in the game: 3 options, and `answer` is the position of the right one
// (0 = first, 1 = second, 2 = third). The game shuffles the lanes for you.

window.JOURNAL = {
  owner: "Bhavya",
  course: "Digital Platforms",
  school: "ESSEC",
  term: "Semester 1",
};

window.SESSIONS = [
  {
    id: "vibe-coding",
    tab: "Vibe Coding",
    title: "Vibe Coding: Claude Design, Claude Code, GitHub & Vercel",
    speaker: "LaunchLab — Nirvan, Rishabh & Yibo",
    date: "9 October",
    status: "complete",
    summary:
      "How to go from an idea to a live website without writing code by hand: design it, build it, store it, ship it.",
    sections: [
      {
        heading: "The whole workflow in one line",
        body: `<p>The big takeaway: <strong>Design → Build → Deploy</strong>. First I use <strong>Claude Design</strong> to shape how the site looks, then I hand it off to <strong>Claude Code</strong> (Share → “Handoff to Claude Code…”) to turn it into real files, and finally I put it online.</p>`,
        checkpoint: {
          q: "Which tool do you use FIRST to design the look of your site, without code?",
          options: ["Claude Design", "Vercel", "GitHub"],
          answer: 0,
        },
      },
      {
        heading: "Prompting is a skill",
        body: `<p>“Create a website for my course” is a bad prompt. A good prompt gives the AI a <strong>role</strong>, a <strong>goal</strong>, a <strong>target audience</strong>, the <strong>pages</strong> and <strong>features</strong> I need, a <strong>design style</strong>, and the <strong>output</strong> I expect.</p>`,
        checkpoint: {
          q: "What makes a prompt strong?",
          options: [
            "Role, goal, audience & style",
            "Just say “make it modern”",
            "Keep it as short as possible",
          ],
          answer: 0,
        },
      },
      {
        heading: "Claude Code is an agent, not autocomplete",
        body: `<p>Claude Code reads the whole project, runs commands, and fixes its own errors. It can run <strong>routines</strong> (e.g. check a folder every hour), <strong>refactor</strong> code without changing what it does, and keep <strong>session context</strong>: what was run, what broke, what changed.</p>`,
        checkpoint: {
          q: "Claude Code is best described as…",
          options: [
            "An agentic coding system",
            "A website hosting service",
            "A slide-design canvas",
          ],
          answer: 0,
        },
      },
      {
        heading: "GitHub: store, share, collaborate",
        body: `<p>GitHub keeps all my files and their history in a <strong>repository</strong>. Key words:</p>
<ul>
  <li><strong>Fork</strong>: my own copy of someone else’s repo · <strong>Clone</strong>: copy a repo onto my computer</li>
  <li><strong>Commit</strong>: a saved snapshot with a note, <em>only on my computer</em></li>
  <li><strong>Push</strong>: send my commits up to GitHub</li>
  <li><strong>Pull request</strong>: propose changes for review · <strong>Merge</strong>: accept them into main</li>
</ul>
<p>Working solo? Push. Working in a team? Open a pull request.</p>`,
        checkpoint: {
          q: "When you make a commit, your snapshot is saved…",
          options: ["Only on your computer", "Straight onto GitHub", "On your live website"],
          answer: 0,
        },
      },
      {
        heading: "Vercel turns code into a website",
        body: `<p>GitHub <em>stores</em> code, but nothing there is a website yet. <strong>Vercel</strong> reads the repo, builds the site and hosts it at a public link. I connect it once, and from then on <strong>every push updates the live site automatically</strong>. Every pull request even gets its own preview link.</p>`,
        checkpoint: {
          q: "What does Vercel do every time you push to GitHub?",
          options: [
            "Rebuilds & updates the live site",
            "Deletes your old commits",
            "Emails your whole team",
          ],
          answer: 0,
        },
      },
      {
        heading: "Three files to remember",
        body: `<ul>
  <li><code>index.html</code>: the words and structure (headings, buttons, paragraphs)</li>
  <li><code>styles.css</code>: the look (colours, fonts, spacing, phone vs laptop)</li>
  <li><code>script.js</code>: the behaviour (what happens on click, type, submit)</li>
</ul>`,
        checkpoint: {
          q: "To make your main button orange, which file do you open?",
          options: ["styles.css", "index.html", "script.js"],
          answer: 0,
        },
      },
      {
        heading: "What a basic site still can’t do",
        body: `<p>A plain site <strong>forgets everyone</strong> (no users or saved games) and <strong>only knows its own files</strong> (no live data like the weather). Logging in works with a <strong>token</strong>, a temporary sticker that says “this is me”, and signing up, logging in and logging out are all just requests to another computer. <strong>Supabase</strong> gives you auth and a database for that.</p>`,
        checkpoint: {
          q: "Logging in to a website is really just…",
          options: ["An API call", "A CSS animation", "A cookie banner"],
          answer: 0,
        },
      },
    ],
  },

  // ── Copy this block for every new guest speaker ──────────────────────────
  {
    id: "session-2",
    tab: "Session 2",
    title: "Next guest speaker",
    speaker: "To be announced",
    date: "TBA",
    status: "upcoming",
    summary: "My blog for this session goes here after the talk.",
    sections: [],
  },
  {
    id: "session-3",
    tab: "Session 3",
    title: "Next guest speaker",
    speaker: "To be announced",
    date: "TBA",
    status: "upcoming",
    summary: "My blog for this session goes here after the talk.",
    sections: [],
  },
];
