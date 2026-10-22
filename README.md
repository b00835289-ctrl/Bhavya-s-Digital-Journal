# Bhavya's Digital Platform Journal

A website with one tab per guest speaker session in ESSEC Digital Platforms.
Each tab is a blog. Every key idea in a blog is a 🚩 checkpoint. When a blog is
marked complete, its **Checkpoint Run** game unlocks: an animated me runs a
track and switches lanes to collect the right answer at every checkpoint.

Built with the tools from the LaunchLab session (9 Oct): **Claude Design →
Claude Code → GitHub → Vercel**.

## Files

| File          | What it does                                                              |
| ------------- | ------------------------------------------------------------------------- |
| `index.html`  | The page structure (header, tabs, footer)                                 |
| `styles.css`  | The look: colours, fonts, the track, and the avatar's colours             |
| `script.js`   | The behaviour: tabs, blog pages, and the game                             |
| `sessions.js` | **My content.** Every blog and every checkpoint question lives here       |

## Updating the journal after a session

Open `sessions.js`, copy the commented "Copy this block" session, and fill it in:

- `status: "draft"` while still writing (the blog shows, the game stays locked)
- `status: "complete"` when done (the game unlocks)
- each section's `checkpoint` has a question `q`, 3 `options`, and `answer`
  (0 = first option, 1 = second, 2 = third)

Or just ask Claude Code, for example:

> Add a new session to sessions.js for today's guest speaker, [name], about
> [topic]. Here are my notes: [paste notes]. Write it as 5 sections, each with a
> checkpoint question, and keep the status as draft.

Then commit and push. Vercel updates the live site automatically.

## Making the avatar look like me

The avatar is me in a 70s look: long flowy brown hair, square clear glasses, a
mustard striped top with bell sleeves, flared jeans and platform boots. To tweak
it, change the variables under "Me" at the top of `styles.css`. Fonts and colours match my portfolio (Instrument Serif,
Inter Tight, IBM Plex Mono; purple #7211af, lilac, cream, cyan doodles).

## Kept separate from my portfolio

This is its own project, not part of the portfolio:

- its own folder (never inside the portfolio folder)
- its own GitHub repo, e.g. `bhavyas-digital-platform-journal` (not `bhavya-s-portfolio`)
- its own Vercel project and link (not `hello-bhavya-portfolio.vercel.app`)
- local preview runs on port 5173 (the portfolio uses 3000)

## Run it on my computer

Double-click `index.html`, or ask Claude Code to "start a local server for this site".
