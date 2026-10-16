# CONCEPT · C · Link To Live · 2026-10-15

> The contract the storyboard, tokens and copy answer to. Amend only with Nati's agreement, and log the amendment at the bottom. Where this file and the decision log disagree, the decision log wins.

## The idea
On his site you shrink the page into a phone with your own finger, then watch a real client's site get built inside that phone, step by step, until it turns green and goes live, and the last link on the page is the one you send him.

- Lane: transformation
- Subject world: materials: the staging link sent over WhatsApp, a client's first-version screenshot, the production address, a VHS cassette with a handwritten label, raw clips; tools: Chrome DevTools device mode (drag handle, rulers, the 390 x 844 readout), the address bar and its thin load bar, the Lighthouse gauge, an editing timeline with a playhead; rituals: send the link, the client opens it on his phone, he circles what bothers him and sends it back, fix, measure, deploy; insider words: סטייג'ינג, לעלות לאוויר, דיפלוי, רספונסיבי, 'תבדוק בטלפון', קאט, טיימקוד
- Dossier items: W02: the hero interaction and the instrument face: a width handle, px rulers and a live dimension readout around the column; W19: the grid unit is the 390 column; on desktop it stays centred and the copy sits in the ground beside it, aligned to ruler ticks; W03: the motif: an address line heads each chapter with that chapter's path; its load bar doubles as the progress track; W04: the persistent object: on desktop a 390 column, on a phone the visitor's own screen (no mockup), holding one client site through its states; W07: the address line's load bar is the playhead track; the video service shows a real timeline with a playhead; W08: chapters are stamped with timecode, taken from the visitor's own elapsed time on the page, not invented numbers; W09: every state change inside the phone is a hard cut on a scroll frame, never a crossfade; W17: the fix chapter: a finger-drawn circle on a first-version screenshot, then a cut to the corrected version; W05/W06: colour exists only as a verdict: red and orange only inside the gauge and the circle, green only for live; W12/W20: the main peak: the staging host is replaced by the real address and a green dot lights; W21: after live, a hard cut swaps a second, different real client site into the same phone; W14: the tape service enters the phone as a labelled cassette and comes out as a file playing
- Pinned by the brief: The column/phone never leaves the screen from the hero to the contact chapter and carries one real client site through link sent > first version > circled fix > measured > live (green dot), in that order; the hero is device mode, with the visitor narrowing the page to 390.
- Tradition borrowed: The instrument UI of browser developer tools (device toolbar, rulers, dimension readout) and the non-linear editor (timecode, playhead, hard cut), borrowed only as chrome and marking, never as decoration.
- Transformation (first viewport → last): First viewport: a wide desktop page on a staging address with a width readout of 1440. Last viewport: the same column at 390, live on its real address with a green dot, holding a prefilled message to Nati; the link the visitor received at the top becomes the link the visitor sends at the bottom.

## Visual system
| Token | Value | Role / reason |
|---|---|---|
| ground | #ECEEF1 | one ground for the whole page: the device-mode backdrop (W02); no theme flips (D67) |
| ink | #1B1D21 | text, rulers, buttons, readouts |
| screen | #FFFFFF | the phone screen: the client's own page surface |
| live | #00CC66 | accent: Lighthouse pass green, means passed / live; only the live dot and the gauge arc past 90; never text (D66) |
| live text | #008800 | the readable pass green for the one "עבר" label |
| mark | #E0322B | the client's circled correction, only in the fix chapter |
| Display face | Noto Sans Hebrew 800, width 75% (wdth axis) | The Hebrew face of the client's Android phone (W04); its width axis narrows with the device-mode drag (W02). |
| Text / instrument face | Noto Sans Hebrew 400/600, tabular figures | picked by Nati from rendered specimens |

## Motif
- What: The address line (W03): host + chapter path, a status chip (grey 'staging' until the deploy, then the green dot), and a 2px load bar that is also the playhead.
- Jobs: preloader: the staging link types in while the Horizon ident plays in its favicon slot, section marker: each chapter's path plus a timecode stamp of when the visitor reached it, progress: the load bar fills along the whole story (W07), state: the staging chip becomes the green live dot at the deploy, call to action: in the last chapter the line shows the WhatsApp link the button opens

## Motion grammar
- Verbs: narrow, cut, pass
- Easing character: Instrument-true: linear scrub for widths and the gauge so the values read honestly, zero-duration cuts on frame boundaries, and only the circle stroke is eased, at hand speed.
- Scroll model: Lenis 1.3 on gsap.ticker + ScrollTrigger reading two CSS-sticky stages on desktop (no transform pin, for CLS); native scroll with CSS sticky on phones
- Intensity: orchestrated

## Signature moments
| # | Where | Sentence it performs | What the visitor sees | Why only this client | Cost class | Touch version |
|---|---|---|---|---|---|---|
| 1 | hero (#top), held stage 1; the Horizon ident is folded in here as the load-in | H1 (approved copy) + [קופי: נתי] a single line saying every site starts at the width of a phone | The visitor drags the page edge (scroll and a keyboard slider drive it too) from desktop width to 390; the H1 rewraps and condenses on its width axis, the hero film reframes from 16:9 to portrait along its subject, and the readout counts down to 390 x 844. On a phone the readout shows the visitor's own measured screen size. | Narrowing to a phone is Nati's literal first act on every project (W02/W19); only here does the visitor do the studio's work with their own hand. | see storyboard | see storyboard |
| 2 | #process, the fix chapter | [קופי: נתי] the client circles what bothers him on his phone, and it gets fixed | A real first-version screenshot sits in the phone; a red finger stroke circles one element at hand speed; on the next scroll frame a hard cut swaps in the corrected version with the circle gone. | The circled screenshot is the real artefact clients send back (W17); it proves 'he listens' without a testimonial. | see storyboard | see storyboard |
| 3 | #process end, held stage 2 (measure > live), the page's main peak (W20) | approved copy: it goes live only when it is fast on a phone | The Lighthouse gauge sweeps through red and orange to the real measured mobile score; on the frame it crosses 90, a hard cut replaces the staging host with the real address and lights the green dot, the only green on the page. | Going live is the state every client waits for, and the measured score is the one claim the site can prove about itself (W05/W12). | see storyboard | see storyboard |

## Reflex check
| Reflex | Present? | Reason, or the change made |
|---|---|---|
| Layer 0: the system font as the brand voice (Noto Sans Hebrew is Android's Hebrew system face) | yes | Brief-specific: the claim is 'your site on your phone', so the page speaks in the face the client's phone uses, and its wdth axis performs the W02 reflow. |
| 2026-10 note: a variable-width display that swells as you scroll | yes | The width axis moves only during the hero's device-mode drag, tied to the real column width, never scrubbed by scroll elsewhere. |
| Layer 2: rough-notation circles (scrapbook kit) | yes | One recorded finger stroke on a real screenshot, the literal W17 artefact, used once; no handwriting font, no tape, no polaroids. |
| Probes 1 and 2: phone mockups with portfolio screenshots | yes | The phone is pinned by the brief; here it holds a site changing state over time, and on phones there is no mockup, because the visitor's screen is the phone. |
| Probes: WhatsApp green #25D366 as accent; pill buttons | yes | Remove: green is Lighthouse 'pass' and appears only at live; buttons are 4px rectangles like device-toolbar inputs. |
| Layer 2: the stat-hero (a big number with a small label) | yes | The number appears once, inside its own gauge, and is the real measured mobile score injected at build time, never a round stat. |
| Ambition probe: timecode counter and playhead | yes | These are dossier items W07/W08 from Nati's answers; here they stamp chapters with the visitor's real time and track progress, with no restoration scrub. |
| Cluster 5: '01 / 02 / 03' and a mono face for small labels | yes | Remove: timecode replaces numerals, and readouts use the text face's tabular figures. |
| Layer 2: the dev-tool dark kit (near-black, masked grid) | yes | Avoided: a light ground with no grid or dot field; rulers only flank the column on desktop. |
| KM palette (Klein night / paper / Klein blue) and EFT Betaamango | yes | Remove: recent portfolio line; nothing reused. |

## Why this concept won
- vs A Glass and Tape: survives a font and colour swap into C, so it is the same concept; its tape ribbon touches the ambition probe's "restored tape" rut. Kept idea: the Lotties as screens in the phone.
- vs B Made to Measure: the most original, but a metaphor from another trade that can read as a sewing business at a glance on a phone.
- Safe card rejected: the dark agency kit (WhatsApp green, Rubik/Heebo, cards, fade-up): shows a capable agency and hides the one thing only MediaWave does.

## Risks (from the lane, to watch in the prototype)
- Animating the real layout width per frame in the hero is expensive (reflow, INP and CLS); it needs a fixed-height sticky stage with container queries, and no width animation on phones
- The H1 must be the LCP and fully readable at first paint, before any narrowing
- The drag handle may go unnoticed; scroll must drive it too, and reduced motion opens at 390 with the readout already set
- The fixed address line on phones is floating chrome that can sit over headings; the overlap audit must stay at 0 at 320/390
- A cool grey ground can read clinical; the warmth depends entirely on real client material that is not yet confirmed
- Without client consent the phone would hold a demo site, which must then be labelled as a demo (no invented proof)
- 'Under construction' states could make MediaWave itself look unfinished, so the MediaWave chrome must always look complete
- Lighthouse green #0CCE6B fails contrast as text; the word 'live' stays in ink and the dot carries the colour
- 13 Lotties inside a 390 column risk crowding and TBT; mount lazily and pause them offscreen
- The Horizon ident folded into the address-line load-in may undersell a sacred asset; giving it its own moment would make a fourth signature moment and needs a decision row
- A displayed Lighthouse score that drops after a deploy turns the proof into a lie; hide the gauge if the injected run is under 90
- The visitor-time timecode stamps can feel watched; compute them locally and never send them to analytics
- Moving #services after #process changes the current section order (the anchors themselves remain)

## Amendments
- 2026-10-15: Accent hex corrected from #0CCE6B (an older PageSpeed value) to #00CC66, the pass colour in the current Lighthouse source (report/assets/styles.css: --color-green #0c6); text uses #008800 (--color-green-700). Agreed: Nati chose C with the green as its accent.
- 2026-10-15: Fonts: Nati picked pair A (Noto Sans Hebrew, one family) from the rendered specimens.
- 2026-10-15: Hero: Nati picked idea 1 (narrow the page to 390) from the 10-idea board.
- 2026-10-15: The 13 Lotties are the screens inside the phone in the "build" chapter (D77); the hero film plays in the 1440 frame and continues inside the phone (D78).
