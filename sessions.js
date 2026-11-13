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
    id: "ai-marketing-team",
    tab: "AI Marketing Team",
    title: "Building an AI Marketing Team: a lite agentic workflow with Claude",
    speaker: "Nick Goh — CEO, INSPIRO Consulting · CMO, Yellow Pages Singapore",
    date: "30 October",
    status: "complete",
    summary:
      "How one marketer can run a whole campaign team of AI agents, from brief to key visual, while keeping a human in charge of the decisions.",
    sections: [
      {
        heading: "Why this matters now",
        body: `<p>Nick opened with headlines: companies cutting jobs as their investment shifts to AI, and big agency groups merging famous creative networks into one. The message for us as future marketers: the work is changing, so <strong>learn to direct AI instead of competing with it</strong>.</p>`,
        checkpoint: {
          q: "What was the big message behind the opening headlines?",
          options: [
            "Learn to direct AI, not compete with it",
            "Agencies will never use AI",
            "Marketing jobs are unaffected by AI",
          ],
          answer: 0,
        },
      },
      {
        heading: "The planning team",
        body: `<p>Instead of one giant prompt, Nick split the work into <strong>roles</strong>, each an AI agent with one job:</p>
<ul>
  <li><strong>Brief Writer</strong>: drafts the brief from the project context (goal, audience, budget, timing)</li>
  <li><strong>Brief Validator</strong>: critiques the brief <em>in a fresh chat</em>, checking objective, audience, message and metric, then gives a verdict and top fixes</li>
  <li><strong>Strategist</strong>: digests the validated brief and develops the Big Idea one-pager</li>
</ul>`,
        checkpoint: {
          q: "Why does the Brief Validator work in a fresh chat?",
          options: [
            "Fresh eyes, no bias from the draft",
            "Because it's cheaper to run",
            "So it can rewrite the brief from scratch",
          ],
          answer: 0,
        },
      },
      {
        heading: "The production team & the handoff chain",
        body: `<p>Then the <strong>production team</strong>: a <strong>Designer / Art Director</strong> making key visuals through connectors like Higgsfield, a <strong>Copywriter</strong> building the messaging hierarchy and adapting it per channel, and a <strong>Reviewer</strong> checking everything against the brand voice.</p>
<p>The six-step <strong>handoff chain</strong>: Brief Writer → Brief Validator → Strategist → <strong>You</strong> (approve and save to the knowledge base) → Designer + Copywriter → Reviewer. The human sits right in the middle.</p>`,
        checkpoint: {
          q: "In the handoff chain, what is YOUR job?",
          options: [
            "Approve and save to the knowledge base",
            "Write every brief by hand",
            "Nothing, the agents do it all",
          ],
          answer: 0,
        },
      },
      {
        heading: "Setting it up in Claude",
        body: `<p>Everything lives in one Claude <strong>Project</strong> with instructions, context files, memory and scheduled tasks. Each role is a reusable <strong>Skill</strong> (Marketing Brief Builder, Brief Validator, Research Strategist, Messaging Hierarchy Builder, KV Concept Builder, Creative Review Scorer, Governance Compliance Check).</p>
<p>The clever part was the <strong>email trigger</strong>: a scheduled task runs daily, reads a “Marketing Brief” email and automatically starts the Brief Builder skill.</p>`,
        checkpoint: {
          q: "What started the workflow automatically?",
          options: [
            "A scheduled task reading a brief email",
            "A post going viral on Instagram",
            "The client calling the agency",
          ],
          answer: 0,
        },
      },
      {
        heading: "The demo: a (fictional) Louis Vuitton launch",
        body: `<p>Nick ran a fictional launch of a Louis Vuitton bag called <strong>Terra</strong> in Singapore. Research found a gap, and the Strategist landed on the Big Idea <strong>“Nothing to explain.”</strong> The Copywriter turned it into a messaging hierarchy and adapted it for Instagram, TikTok, LinkedIn and YouTube, while unverified facts were flagged <em>[to confirm]</em> instead of being made up.</p>
<p>I liked that Claude <strong>refused to put a real person’s face</strong> on the campaign image: the AI team still has guardrails.</p>`,
        checkpoint: {
          q: "What was the Big Idea for the Terra launch?",
          options: ["“Nothing to explain.”", "“Bigger is better.”", "“Buy now, think later.”"],
          answer: 0,
        },
      },
      {
        heading: "Creative Score: the AI judges the work",
        body: `<p>A <strong>Creative Review</strong> skill scored the ads through the lenses of famous agencies (BBH, Ogilvy, McCann). The pretty desert Instagram story only scored about <strong>5.7/10</strong> and the feed post <strong>4.2/10</strong>, because they looked like generic luxury ads.</p>
<p>A tight crop of a <strong>hand on the clasp</strong>, showing craft and anticipation, scored higher (<strong>6.7/10</strong>). Specific, crafted details beat generic beauty.</p>`,
        checkpoint: {
          q: "Which visual scored higher on the Creative Score?",
          options: [
            "A close-up of a hand on the clasp",
            "The wide desert sunset shot",
            "A plain product photo on white",
          ],
          answer: 0,
        },
      },
      {
        heading: "My takeaway",
        body: `<p>AI can act like a whole marketing team, but it works best as a <strong>chain of specialists with a human approving the key steps</strong>. My job as a marketer is to set the brief, judge the ideas and protect the brand, and to keep asking “what does this tell you?” about the output. (Also: always be polite to your AI 😄)</p>`,
        checkpoint: {
          q: "What makes an AI marketing team work best?",
          options: [
            "Specialist agents + a human approving",
            "One giant prompt that does everything",
            "Letting the AI publish without review",
          ],
          answer: 0,
        },
      },
    ],
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
