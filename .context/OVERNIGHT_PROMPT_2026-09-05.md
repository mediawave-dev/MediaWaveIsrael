# Overnight run prompt — MediaWave design fixes (2026-09-05)

**How to start it (new session, project root):**

```powershell
cd G:\Web-Dev\MediaWaveIsrael
claude --model fable --dangerously-skip-permissions
```

Then paste everything between the markers.

---
--- BEGIN PROMPT ---

You are running unattended overnight on the MediaWave Israel site. I am asleep. I will
review your work in the morning and decide whether to push it to production myself.

**You must never push. No `git push`, no deploy, no PR.** Pushing to `main` triggers a
Cloudflare Pages production deploy. Committing to a local branch is your last step.

## Ground rules for an unattended run

1. **Never ask me a question.** I am not there. If a decision is genuinely ambiguous,
   pick the most conservative option, do it, and write the choice and your reasoning
   into the morning report. A blocked run that waited for input is a wasted night.
2. **Never claim something works that you did not measure.** Every "fixed" claim in your
   report must name the artifact file that proves it.
3. **If you cannot fix something, stop on that item, leave the code as it was, and
   report it honestly as BLOCKED with what you tried.** An honest BLOCKED is a good
   outcome. A silent revert or a cosmetic edit that hides the problem is not.
4. **Do not touch anything outside the task list.** The working tree already has ~48
   modified and untracked files from other work. Leave them alone. Commit only files
   you personally changed for the tasks below, named explicitly with `git add <path>`.
   Never `git add .` or `git add -A`.
5. Windows. Use PowerShell. Paths with forward slashes. If you use Git Bash for any
   script that takes an argument starting with `/`, prefix the command with
   `MSYS_NO_PATHCONV=1` or the argument gets rewritten into a Windows path.

## Use the design-loop-router skill

Invoke the `design-loop-router` skill and follow it. It is installed at
`C:/Users/User/.claude/skills/design-loop-router`. It gives you the taste layer, the
bridge to the `impeccable` skill, the Puppeteer measurement harness, and the named-rule
gate that decides pass/fail.

Two constraints on how you use it tonight:

- **Never route to an interactive impeccable verb.** `shape`, `craft`, `init`,
  `critique` and `live` block waiting for input and will hang the run. Use the
  non-interactive verbs only: `colorize`, `layout`, `typeset`, `harden`, `polish`,
  `clarify`, `adapt`, `distill`, `animate`, `optimize`, `audit`.
- **The gate is the arbiter, not your judgement.** `scripts/gate.mjs` decides whether a
  fix landed. If it still fails, the fix did not land, however good the code looks.

## Setup

```powershell
git checkout -b fix/design-gate-20260906
npm run dev          # leave running in the background; it binds [::1]:5173, IPv6 only
```

Then, from the project root:

```powershell
node "C:/Users/User/.claude/skills/design-loop-router/scripts/preflight.mjs"
node "C:/Users/User/.claude/skills/design-loop-router/scripts/ledger.mjs" init --run night-20260906 --intent DEFECT
node "C:/Users/User/.claude/skills/design-loop-router/scripts/verify.mjs" --run night-20260906 --label before --routes "/,/blog,/terms,/privacy,/accessibility"
node "C:/Users/User/.claude/skills/design-loop-router/scripts/gate.mjs" --run night-20260906
```

That `before` capture is what I will compare against in the morning. Do not skip it,
and do not start editing before it exists.

## The task list

These are real, verified findings from a measured run on this codebase. Fix them in
this order. Re-run `verify.mjs` with a new `--label` and then `gate.mjs` after each
task, so each fix is independently proven.

### Task 1 — SKY_INK: sky used as text colour (highest value, do this first)

`.text-orange` resolves to `#7DD3FC`. That variable name is legacy — the Legacy-Name
Rule in `DESIGN.md` says the warm names carry cool sky values now, and that is correct
and must stay. The defect is that this sky value is being used as a **text** colour on
light surfaces. The Sky-Ink Rule states sky is a fill colour; ink carries text.

Confirmed locations:
- `src/components/layout/Header.tsx:163` — nav links, class
  `nav-link ... text-orange hover:text-orange-dark` on the light header. Measured 4.4:1.
  axe-core independently flags this as a `color-contrast` violation. AA needs 4.5:1.
- `src/components/sections/Hero.tsx:211` — `<span className="text-orange font-bold">`,
  the rotating accent word, on the cream background.

Strong hint for the fix: `src/styles/index.css` already defines `--color-orange: #0369A1`
inside the high-contrast blocks (lines ~945 and ~1042). That darker sky is already a
blessed brand value in this codebase. Using it for sky-as-text is a smaller, more
on-brand change than inventing a new colour.

Constraints:
- **Do not change the base palette.** `--color-orange: #7DD3FC` at
  `src/styles/index.css:39` stays exactly as it is. Sky remains the fill colour
  everywhere it is currently a fill. You are changing text colour only.
- Keep sky in the hover/active state if that still passes contrast; the rest state is
  what fails.
- Verify with the gate, not by eye. `SKY_INK` and `AXE_CONTRAST` must both go green.

### Task 2 — EASE_SOURCE: inline easing literals

`DESIGN.md` requires easing to come only from `src/config/motion.ts`, which exports
`EASE_BRAND = [0.16, 1, 0.3, 1]`. These five files inline the literal instead:

- `src/components/layout/Header.tsx:199`
- `src/components/layout/Header.tsx:218`
- `src/components/pages/NotFound.tsx:24`
- `src/components/ui/ChatWidget.tsx:61`
- `src/components/ui/CookieConsent.tsx:55`

Replace each with an import of `EASE_BRAND`. Mechanical change, no visual difference —
the values are identical, so the `before`/`after` screenshots must match. If they do
not, you changed something you should not have.

**Do not touch these CSS lines.** They are token *definitions*, which is exactly where
a literal belongs:
- `src/styles/index.css:147` `--ease-out-expo`
- `src/styles/index.css:148` `--ease-brand`

`src/styles/index.css:799`, `:821` and `:1190` use different curves. Leave them; changing
a curve is a design decision, not a lint fix. Note them in the report instead.

### Task 3 — LEGACY_NAME: the old warm orange

`src/components/sections/Testimonials.tsx:97` has a hardcoded `fill="#F5A623"` — the
pre-remap warm orange. Replace it with the sky fill from the token
(`var(--color-orange)` or the Tailwind equivalent used elsewhere in that file).

Context so you judge the risk correctly: `Testimonials` is rendered from `src/App.tsx:86`
but `src/data/testimonials.ts` is deliberately empty, so this section does not currently
appear on the live site. The fix is still correct — it is a landmine for whenever real
testimonials get added — but it is not user-visible today. Do not spend long on it and
do not redesign the section.

### Task 4 — CONSOLE_ERROR: React prop warning

Every route logs: `Warning: React does not recognize the fetchPriority prop on a DOM
element`. Source is `src/components/sections/Hero.tsx:137`, `fetchPriority="low"`.

Read the comment at `src/components/sections/Hero.tsx:128` first — it explains the
deliberate intent (the LCP is the headline text, so this image is intentionally
deprioritised). **Preserve that intent.** Fix the warning without losing the behaviour;
the lowercase DOM attribute form is the usual answer. Confirm the attribute still
reaches the rendered HTML — if the fix silently drops the hint, that is a regression,
not a fix, and you should report it as BLOCKED rather than ship it.

## Rules you must not break while fixing

- Import `m` from framer-motion, never `motion`. The project runs `LazyMotion strict`.
- Do not edit any Hebrew copy. Not a word, not a punctuation mark.
- Do not add dependencies. Do not run any install command.
- Do not change `DESIGN.md`, `PRODUCT.md` or `CLAUDE.md`.
- Do not disable, weaken or add exceptions to any gate rule to make it pass. If a rule
  is wrong, say so in the report and leave it failing.

## Finishing

1. `npm run lint` — must pass.
2. `npm run build` — must succeed. This is the real gate on shipping; it runs tsc plus
   the prerender step.
3. Final measured run:
   ```powershell
   node "C:/Users/User/.claude/skills/design-loop-router/scripts/verify.mjs" --run night-20260906 --label after-final --routes "/,/blog,/terms,/privacy,/accessibility"
   node "C:/Users/User/.claude/skills/design-loop-router/scripts/gate.mjs" --run night-20260906
   node "C:/Users/User/.claude/skills/design-loop-router/scripts/ledger.mjs" require-done --run night-20260906
   ```
4. **Look at the `after-final` screenshots.** Actually open the PNG files. A passing
   report with a broken-looking page is the single most common way an automated design
   loop lies to its user. If anything looks wrong, say so even if every check is green.
5. Commit, naming each file explicitly. Conventional commit style, one commit per task
   is fine, or one combined commit if the tasks interleaved. Do not push.
6. Stop the dev server you started.

## The morning report

Write it to `.context/OVERNIGHT_RESULT_2026-09-06.md`, **in Hebrew**, and also print it
as your final message. I want to read it in two minutes and decide whether to push.

Structure:

- **שורה תחתונה** — one line: ready to push, or not, and why.
- **טבלת משימות** — the four tasks, each PASS / BLOCKED / SKIPPED, with the gate rule
  that proves it and the files you changed.
- **לפני ואחרי** — gate output before vs after, side by side, so I can see what moved.
  Name the screenshot paths for the home route at 390 and 1440.
- **החלטות שקיבלתי לבד** — every judgement call you made without me, and why. Be
  complete here; this is the section I will read most carefully.
- **מה נשאר פתוח** — anything BLOCKED, anything you noticed but did not touch, anything
  you think is wrong with the gate itself.
- **בדיקה ידנית לפני דחיפה** — the specific things I should click or look at myself
  before pushing, given what you changed.

If the run ends with anything still failing, say so in the first line. Do not bury it.

--- END PROMPT ---
