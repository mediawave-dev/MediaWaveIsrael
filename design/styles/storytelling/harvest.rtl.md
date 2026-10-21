# קציר סגנון: The Power of Storytelling (Noomo)

אתר: https://storytelling.noomoagency.com/ (Nuxt 3 + three.js + GSAP 3.13 ScrollSmoother, נבדק 21.10.2026).
המטרה: לבנות מחדש את הסגנון, לא את הנכסים.
כל מספר כאן מגיע מקוד שנקרא כטקסט (`G:/tmp/harvest/story/`), ממדידה בדפדפן בזמן ביקור, או מפריים מצולם.
המקור רשום ליד כל ערך.

קבצי מקור שנקראו (טקסט בלבד):
- `G:/tmp/harvest/story/index.html` (CSS inline של הקומפוננטות)
- `G:/tmp/harvest/story/CbdjwYMp.js` (הבאנדל הראשי: three.js, הסצנה, ה-store, הסמן, הסאונד)
- `G:/tmp/harvest/story/FZFS71Nt.js` (דף הבית: Hero, AnimatedTexts, Footer)
- `G:/tmp/harvest/story/entry.css`, `G:/tmp/harvest/story/index.css`
- `G:/tmp/harvest/story/timeline-keys.json` (מספרי keyframes מתוך ה-timeline האפוי, נקראו בתוך ביקור בדפדפן ב-`G:/tmp/harvest/probe-timeline.mjs`; הקובץ עצמו לא נשמר)

צילום (GPU, ANGLE d3d11, פרופיל קבוע):
- 1440x900: `G:/tmp/harvest/story/film-desktop/` (166 סטילים, שליש מסך לכל צעד) ו-`G:/tmp/harvest/story/film-desktop/tween/` (מעבר בקצב קבוע, 240 s לכל האתר)
- 390x844 DPR 2, UA של iPhone, touch: `G:/tmp/harvest/story/film-mobile/` (145 סטילים)
- דפי מגע: `G:/tmp/harvest/sheets/story/story-1440.jpg`, `G:/tmp/harvest/sheets/story/story-390.jpg`

---

## 1. טבלת DNA

| ציר | הערך | מקור |
|---|---|---|
| קרקע (ground) | עולם אחד רציף של שמיים, בלי "סקשנים" של HTML. `Env_background` = `rgb(229,222,249)` `#E5DEF9` עד t=10, ואז lerp ל-`rgb(6,10,23)` `#060A17` בין t=10 ל-t=11 ונשאר עד הסוף. `Env_darkness` 0 ל-1 באותו קטע. הצבע הנראה בפריימים: לילך-תכלת פסטלי (`#BDB0E8` עד `#CCCBED` ממוצע), ורוד ב-p9-10 (`#E5C5E1`), כחול-לילה `#000414` עם זוהר מרכזי `#2D2EB0`, ואש חום-כתום (`#300603` עד `#AE4E1B`). | `timeline-keys.json` (dev.glb, tracks `Env_background`, `Env_darkness`); דגימה: `G:/tmp/harvest/story/colors-desktop.json` |
| חומר (material) | זכוכית אירידסנטית אחת: ציפור (phoenix) עשויה נוצות זכוכית עם שבירה, פיזור ואירידסנציה (`glassConfig`: ior 1.2, iorDelta 0.3, fringe, peaks, color curves), על רקע env map (`wooden_studio_19_1k.hdr`) + "שמש" זוהרת + טבעת קשת (halo ב-post). בחלק החשוך: נוצה בודדת זוהרת כחולה, ואז קוביות קרח עם לוגואים בפיקסלים, ואז אש. | `CbdjwYMp.js` חיפוש `glassConfig`, `Post_halo`, `Sun_sizeAmp`; פריימים `060-y12900-p6.17.png`, `102-y23700-p12.23.png`, `128-y30300-p17.32.png`, `149-y35700-p19.06.png` |
| טיפוגרפיה | שתי משפחות: TheSeasons Italic 400 (סריף קליגרפי, `fonnts.com-theseasons-it.otf`) למילים הגדולות, ו-TT Neoris Trial Regular 400 (גרוטסק עגול, קובץ Trial!) לכל השאר. root `10px`. H1 בהירו: `19.5vw` (280.8px ב-1440), במובייל `18.8vw` (73.32px נמדד), letter-spacing `-.1vw`, line-height 1, צבע `#FDEBFD` ומעליו gradient על כל `.char`: `linear-gradient(180deg,#fffcff 0 25%,#e3f0ff 65% 80%)` עם background-clip text. המילים הגדולות (narrative. / Light / Spirit / Sound): `text-serif-200` (200px) בדסקטופ, `text-serif-100/80` במובייל, gradient `#fffcff 0 15%` ל-`#e3f0ff 45% 70%`. משפטים: `text-sans-66/50/38/30/26/18/16`, צבע `#29345A` (brand-black) על בהיר, לבן על כהה. מילה אחת בכל משפט עוברת לסריף נטוי (`<i class="text-serif-50">shifting,</i>`). | `index.html` (`.home-hero h1`, `.home-hero h1 .char`); `entry.css` (`@font-face`, `--color-*`, `.gradient-text .char`, `.text-*`); מדידה ב-run.log (`TheSeasons 73.32px`, `TTNeoris 66px/50px/38px/30px`) |
| מבנה | אין גריד. כל טקסט הוא שכבה `fixed` מעל canvas מסך מלא, ממוקמת ב-className (`top-1/2 left-1/2`, `right-[10vw]`, `lg:left-1/10 w-410`). הגלילה היא ציר זמן אחד: 20 סקשנים עם `scrollLength` ב-vh (דסקטופ 100,150,300,300,200,300,500,200,80,80,170,190,280,50,50,100,140,1100,250,280 = 4820vh; מובייל חצי בסקשנים 1-10 ו-18-19 = 3125vh). progress = אינדקס סקשן + שבר (0 עד 20), והוא נשלח ישר ל-`seek(t)` של timeline אפוי מ-Blender (שנייה אחת של אנימציה = סקשן אחד). | `CbdjwYMp.js` פונקציה `aH`, `g=b=>...` בתוך `app`, `seek=e=>` במחלקת ה-timeline; גלילה נמדדת: 38070px ב-1440x900, 31355px ב-390x844 |
| צפיפות | מינימלית. בכל רגע: canvas + לכל היותר משפט אחד (או 4 עמודות קצרות בסקשן העקרונות) + כרום קבוע (לוגו, 3 קישורים, כפתור סאונד, כפתור Reimagine Phoenix). | פריימים, דף מגע `story-1440.jpg` |
| דימוי | ציפור אחת (phoenix) היא הדמות הקבועה מתחילת האתר ועד סופו, משתנה בצבע ובקנה מידה: מקרו של כנף (הירו), ציפור קטנה שעפה, חזית עם כנפיים פרושות על כל הרוחב, גלישה ורודה, ציפור כחולה זוהרת בחושך, נוצה אחת, ובסוף phoenix בוער. קייסים = קוביות קרח עם לוגו פיקסלים. אייקונים קטנים בטקסט: ציפור, פרח, נוצה בפיקסל-ארט SVG. | פריימים לאורך `story-1440.jpg`; `entry.css` (`.text-icon-bird`, `.text-icon-flower-white`, `.text-icon-feather-white`) |
| חתימת תנועה | (1) ScrollSmoother `{smooth:1.5, normalizeScroll:true, smoothTouch:true, ignoreMobileResize:true}`. (2) מצלמה וציפור אפויות ב-timeline (`cam.glb` 601 keys על 20 s = 30fps; מובייל `cam-mob.glb`), מופעלות ב-seek עם AnimationActions מושהות. (3) `fov = 25 + min(|v|,10)` כש-v = מהירות הגלילה במסכים לשנייה (`getVelocity()/viewport.y`). (4) מצלמה מסתובבת בקואורדינטות כדוריות לפי spring של הסמן (`theta += x*pi/180*pointerInfluence`). (5) טקסט: תווים או שורות נכנסים ב-scrub, opacity 0 ל-1, scale 1.3 (או 1.05 לשורות, או 0 לקווים `from-scale`) ל-1, blur 8px ל-0 (רק בדסקטופ), stagger 0.05, ease none, ויוצאים בהיפוך. | `CbdjwYMp.js` `Qc.create({smooth:1.5`, `onScroll=e=>{this.camera.fov=`, `onPointerNdc`, `setScrollSpeed=e=>`; `FZFS71Nt.js` `HomeComponentsBigTextNew`, `LinesText`, `SmallTextNew` |
| פתיחה | preloader מלא מסך, `linear-gradient(45deg,#cebdf8,#e2dbf8)` עם GIF ציפור פיקסלים 50px במרכז. כש-`sceneLoaded`: חור עגול נפתח מהמרכז (`--reveal-radius` 0 ל-200vmax, 2 s, `power3.inOut`, נוצה רכה `--reveal-feather:14vmax`), ה-GIF דוהה ל-autoAlpha 0 ו-scale 0.92 ב-2 s `power1.out`, והגלילה משתחררת אחרי 1.2 s. אחר כך הירו מחכה ל-"Click to start" (בדסקטופ על הסמן) או "Tap to explore" (כפתור זכוכית במובייל). לחיצה: סאונד נדלק ו-autoscroll של `2*innerHeight` ב-3 s `ease:none` (דסקטופ) או `1.15*innerHeight` ב-3 s (מובייל, ScrollTo). | `CbdjwYMp.js` `__name:"Preloader"`; `FZFS71Nt.js` `__name:"HomeHero"` פונקציה `E`; פריימים `000-loading.png`, `002-reveal.png` |
| סאונד | WebAudio: `BG_music_ST.mp3` בלופ, gain 0.4, נדלק בלחיצת ההתחלה (`setEnableSound(!0)`). צלילי hover `hover1..5.mp3` בווליום 0.2 עם הגבלה של 5 לשנייה לכל צליל. `ReleaseSpirit.mp3` לכפתור Reimagine Phoenix. צליל כנפיים על mousemove בהירו (throttle 200ms). כפתור הסאונד: עיגול 48px `bg-white/15` עם אייקון עמודות; בלחיצה גל עגול scale 0.2 ל-7, opacity 0.99 ל-0, 3 s `power3.out`, בצבע אקראי מתוך `#FB5959 #41B8FF #52D273 #F7C948 #B388FF`. | `CbdjwYMp.js` `__name:"AudioComponent"`, `__name:"SoundButton"`; `FZFS71Nt.js` `playWingsSound` |
| סמן | "liquid glass" בדסקטופ בלבד: עיגול 48px עם טבעת חיצונית 64px (`1px solid hsla(0,0%,100%,.64)`), כוכב פיקסלים 18px במרכז, עוקב ב-lerp 0.18 לפריים, צורה מחושבת ב-SDF עם smoothstep. מצבים: "Click to start" = גלולה 162px (טבעת 178px), טקסט 18px `brand-black`, כוכב בצבע `#2A2336`; hover על קישור = scale 0.75 ו-fade; hover על קייס = רקע `brand-blue-600/41` + חץ + שם הקייס. במובייל אין סמן. | `CbdjwYMp.js` `__name:"TestCursor"` (`followSpeed:.18`, `Y(162,2)`, `Y(48,1)`); `entry.css` `.liquid-glass-root`; פריים `008-cursor.png` |

---

## 2. התשובות לשאלות הפתוחות

**האם נפנוף הכנפיים תלוי בגלילה?**
לא.
הנפנוף תלוי בזמן בלבד: `onTick=({ds:e})=>{... this.mixer.update(e*t)}` כש-`t = glassAnimationIdToSpeed[id]` = 1 לכל הקליפים.
הגלילה קובעת רק איזה קליפ רץ (`Phoenix_animationId` הוא track ב-timeline) ואת המיקום, הסיבוב והקנה של הציפור והמצלמה (`Phoenix.translation/rotation` ב-`cam.glb`).
המהירות של הגלילה משפיעה רק על ה-fov (עד +10 מעלות), לא על הכנפיים.
אימות בפריימים: בלי שום גלילה, שני סטילים בהפרש 250ms בהירו שונים ב-10.7% מהפיקסלים, ובהפרש 750ms ב-33.2% (`G:/tmp/harvest/diff.mjs` על `tween/008-idle.png`, `009`, `011`; במובייל `004-idle` מול `007-idle` 28.7%).
מקור: `CbdjwYMp.js` חיפוש `mixer.update`.

**איזה קליפ רץ באיזה סקשן?**
מתוך ה-track `Phoenix_animationId` ב-`dev.glb` (שתמיד פעיל, גם בדסקטופ וגם במובייל):
- t=0 עד t≈0.67 (סקשן 1, הירו): id 2 = `Wing_CloseUp` (המקרו של הכנף שממלא את המסך).
- t≈0.67 עד t=17 (סקשנים 1-17, כל השמיים הבהירים והחלק החשוך): id 0 = `Idle_MainPose_flying`.
- t=17 עד t=20 (קייסים, "spark becomes a fire", האש והפוטר): id 1 = `Float_WingPulse`.
- `Idle_MainPose_gliding` (id 3) מוגדר בקוד אבל לא מופיע ב-timeline של דף הבית.
מקור: `timeline-keys.json`, track `Phoenix_animationId.translation` (481 keys, ערכים 2,0,1).

**כמה גדולה הציפור על המסך?** (מדידה בעין על הפריימים, 1440x900)
- הירו p0: מקרו, נוצות ממלאות 100% מהמסך (`004-hero.png`).
- p1.9: ציפור קטנה בפינה השמאלית העליונה, מוטת כנפיים כ-30% מהרוחב (`018-y2100-p1.89.png`).
- p2.2 עד p3.5: הציפור חולפת קרוב למצלמה, רק כנף חתוכה בחלק העליון (`020`, `025`, `034`).
- p3.7 עד p4.6: אין ציפור במסגרת, רק "narrative." (`040-y7800-p4.08.png`).
- p4.9 עד p6.5: הציפור עולה מלמטה, חזית, כנפיים פרושות 100% מהרוחב ויותר (`060-y12900-p6.17.png`).
- p6.6 עד p8: הטיה וגלישה, כנף בגודל 60-90% מהרוחב (`069`, `079`).
- p10.5: ציפור כחולה זוהרת בחושך, כ-55% מהרוחב (`093-y21300-p10.92.png`).
- p11 עד p17: רק נוצה אחת אנכית, כ-5% מהרוחב וכ-45% מהגובה (`102-y23700-p12.23.png`).
- p19: phoenix בוער במרכז, כ-75% מהרוחב (`149-y35700-p19.06.png`).
- במובייל (`cam-mob.glb`) הציפור גדולה יותר יחסית: בחזית היא רחבה בערך פי 2 מהמסך (`033-y6047-p6.17.png`).

**צבע השמיים לפי סקשן**
`Env_background` אחיד `#E5DEF9` עד t=10, וחשיכה בין t=10 ל-t=11 (סקשן 11).
הגוון הנראה נוצר בעיקר מה-env map, מהשמש ומה-halo, לכן הדגימות מהפריימים (ממוצע מסך, דסקטופ):
- טעינה `#D8CCF8`; הירו `#ACB1F0` (נוצות כחול-סגול); p1.9 `#BAAFEA`; p2.5 `#CCCBED`; p4.1 `#BDB0E8`; p5.5 `#BEC5E5`; p6.2 `#C6C7DD`; p7.6 `#DED6E8`; p9.5 `#E1CCE9`; p10.1 `#E5C5E1` (ורוד).
- p10.9 `#080E30`; p12.2 `#05092A` (שוליים `#000414`, זוהר מרכזי `#2D2EB0`); p17.3 `#171B28`.
- p19.1 `#371607`; p19.5 `#4A2008` (למעלה `#AE4E1B`); p20 `#2A1308`.
בנוסף, `Water_color` עובר מלבן ל-`rgb(255,192,64)` `#FFC040` בין t=18.5 ל-t=19 (זוהר האש).
מקור: `colors-desktop.json`, `timeline-keys.json`.

**הפונטים שדווחו - אימות**
- TheSeasons italic, H1 `19.5vw`: נכון (מובייל `18.8vw`).
- gradient `#fffcff` ל-`#e3f0ff`: נכון, על `.home-hero h1 .char` בזווית 180deg ועצירות `0 25%` ו-`65% 80%`; למילים הגדולות עצירות `0 15%` ו-`45% 70%`.
- צבע `#fdebfd`: נכון, זה ה-`color` של ה-H1 (נראה רק אם background-clip לא נתמך).
- TT Neoris הוא קובץ Trial (`TTNeorisTrialRegular.ttf`): לא להעתיק את הבחירה הזו ללקוח בלי רישיון.

---

## 3. מלאי הרגעים לפי סדר הגלילה

הסימון t = progress (אינדקס סקשן + שבר).
e(k) = סכום ה-`scrollLength` של סקשנים 0..k ב-vh, ו-`n = 2` במובייל (חלק מההיסטים מתחלקים ב-2).
כל הטקסטים הם `scrub:true` על `trigger:"body"` עם start/end בפיקסלים שמחושבים מ-vh.

| # | t | מה זז | מה מניע | משך / easing / קבועים | פריים |
|---|---|---|---|---|---|
| 0 | לפני | preloader לילך, GIF ציפור פיקסלים | זמן טעינה (נמדד 84 s דסקטופ, 38 s מובייל, על מכונה עמוסה) | gradient 45deg `#cebdf8`→`#e2dbf8` | `film-desktop/000-loading.png` |
| 1 | לפני | חור עגול נפתח מהמרכז אל הסצנה | `setSceneLoaded(true)` | `--reveal-radius` 0→200vmax, 2 s `power3.inOut`, feather 14vmax; GIF autoAlpha 0, scale .92, 2 s `power1.out`; scroll unpause אחרי 1.2 s | `002-reveal.png` |
| 2 | 0 | מקרו כנף (`Wing_CloseUp`) זז בזמן; מצלמה נוטה לפי הסמן | זמן + pointer spring | fov 25; "The power of digital" 66px, H1 280px; סמן "Click to start" | `004-hero.png`, `005..007-sweep.png` |
| 3 | 0→~2 | autoscroll אחרי קליק; תווי H1 מתפוגגים | קליק, אחר כך גלילה | `scrollTop: 2*innerHeight`, 3 s, `ease:none`; H1 chars opacity 1→0, scale 1→1.3, blur 0→8px, stagger -0.05 על 1000px ראשונים (500px במובייל) | `013..017-start.png` |
| 4 | 0.67 | מעבר לקליפ `Idle_MainPose_flying`; המצלמה מתרחקת והציפור נהיית קטנה | timeline | step של animationId | `018-y2100-p1.89.png` |
| 5 | 0..2 | "שמש" נולדת: גודל 0→3 (t0-1) ועוצמה 0→15 (t1-2) | timeline `Sun_sizeAmp` | lerp אפוי 24fps | `018`, `024` |
| 6 | ~1-2 | "In a world that's constantly *shifting,*" במרכז, אייקון ציפור מעל, קווים דקים | scrub | in: e(0)-50 → e(0)+100 vh; out: e(1) → e(1)+150; chars scale 1.3→1, blur 8→0 | `018-y2100-p1.89.png` |
| 7 | ~2-3.3 | "what guides us through *change,* reinvention, and the *unknown*" מיושר לימין, קווים | scrub | in e(1)+100→+220; out e(2)+70→+200 | `025-y3900-p2.61.png` |
| 8 | ~3.5-4.6 | "*is* narrative." 200px סריף gradient, בלי ציפור | scrub | in e(2)+150→+300; out e(3)+150→+300 | `040-y7800-p4.08.png` |
| 9 | ~4.9-5.8 | הציפור עולה מלמטה לחזית; "*Stories* emerge through" | timeline + scrub | in e(3)+250→+400; out e(5)→+100 | `051-y10500-p5.39.png`, `055` |
| 10 | ~6.0-6.5 | כנפיים פרושות על כל הרוחב, הנוצות מקבלות כתום-אירידסנט; "Light"; השמש גדלה ל-5 ב-t 6.04-6.25 | timeline | in e(5)+50→+120; out e(5)+270→+340 | `060-y12900-p6.17.png`, `062` |
| 11 | ~6.6-7 | הטיה; "Spirit" | timeline + scrub | in e(6)-190→-120; out e(6)-20→+50 | `069-y15300-p6.70.png`, `072` |
| 12 | ~7.2-8 | גלישה עם כנפיים ורודות-כתומות; "Sound" | timeline + scrub | in e(6)+30→+100; out e(6)+200→+270 | `079-y17700-p7.58.png` |
| 13 | ~8.6-10.2 | הציפור הוורודה חולפת, השמיים מוורידים | timeline | | `083`, `086`, `088` |
| 14 | 10→11 | השמיים מחשיכים מ-`#E5DEF9` ל-`#060A17`; הציפור הופכת כחולה זוהרת; ה-UI עובר ללבן | timeline `Env_darkness`, `Env_background`; `setSectionColor("dark")` ב-e(9)+80→+120 vh | lerp אפוי (smooth, 24 keys) | `090-y20700-p10.53.png`, `093-y21300-p10.92.png` |
| 15 | 10→10.5 | חומר הזכוכית חוזר לערכי ה-timeline (מבטל "Reimagine Phoenix") | `Glass_forceTimeline` 0→1 | | |
| 16 | ~10.5-11.6 | "The best *stories* don't just speak to *us.* *They* invite us *inside.*" לבן, אייקון פרח | scrub | in e(10)-100→-30; out e(10)+50→+170 | `093`, `095` |
| 17 | ~11.6-12.9 | נוצה זוהרת אנכית במרכז (מעכשיו עד t~18.5); "How can the story live at the *heart* of the experience?" | scrub | in e(10)+150→+250; out e(11)+220→+420 | `100-y23100-p11.98.png`, `102` |
| 18 | ~12.5-15.8 | 4 עקרונות בעמודות לסירוגין (שמאל/ימין): Start with *clarity*, Let the story *guide* design, *Experiment* and iterate, Make it *personal*. גוף הטקסט ב-gradient `#fff`→`#cbdcffbf` | scrub, LinesText | כל אחד in 50vh (e(11)+160, +230, +300, +370), ואז מטפס `y: -120vh` בקצב הגלילה; שורות scale 1.05→1, קווים scale 0→1 | `107`, `109`, `111`, `114` |
| 19 | ~16.4-17.1 | "Where *stories* become experiences" 66px | scrub | in e(15)+40→+130; out e(15)+225→+430 | `121-y28500-p16.83.png` |
| 20 | 17→18.04 | 7 קוביות קרח עם לוגו פיקסלים חולפות (Coinbase & Warriors, Salesforce, Intel ai.io, Vogue Business, Noomo Labs, Noomo Valentime, AMD); hover מגדיל ומסובב קובייה 15 מעלות ומציג שם + "Click to view" | `Projects_visible`, timeline; hover spring | כל שם in בטווח 100-120vh מתוך סקשן 18 (1100vh); קליפ הציפור עובר ל-`Float_WingPulse` ב-t=17 | `128-y30300-p17.32.png`, `130`, `132` |
| 21 | ~17.6-18.4 | נוצה שוב; "Storytelling is much more than words." למעלה, "It is how a spark becomes *a fire.*" למטה | scrub | in e(17)-180→-90 / -160→-70; out e(17)+40→+120 | `137`, `139-y33300-p17.91.png` |
| 22 | 18.5→19.25 | הנוצה הופכת לאש: `FireBack_opacity` 0→1 (18.5-19), `Water_opacity` 1→0, `Water_color` →`#FFC040`, `Reflector_opacity` 0→1 (18.75-19, השתקפות על רצפה), `isBurning`=1 ב-19, `Fire_opacity` 0→1 (19-19.25), הרים ברקע | timeline | lerp אפוי | `146-y35100-p18.75.png`, `149-y35700-p19.06.png` |
| 23 | ~18.6-19.6 | "Storytelling is what you see, feel, hear, *interact* with." | scrub | in e(17)+110→+210; out e(17)+300→+400 | `151`, `153` |
| 24 | 20 | פוטר: "Let us help you tell your story the way it was meant", לוגו פרח פיקסלים עם עותק blur מאחוריו, מייל 66px, רשתות | scrub ב-400px האחרונים | stagger-items y 15→0, blur 8→0, opacity 0→1, stagger 0.2 | `158-y38070-p20.00.png` |

קבועים לרוחב כל האתר:
- ScrollSmoother: `smooth 1.5`, `effects:false`, `normalizeScroll:true`, `smoothTouch:true` (במגע 0.8).
- fov: 25 + min(|velocity / innerHeight|, 10); מהירות גלילה של מסך לשנייה = +1 מעלה.
- כרום קבוע: לוגו `noomo Storytelling` משמאל למעלה, Agency / Labs / Contact בימין (18px), כפתור סאונד משמאל למטה (54px מהצד), "Reimagine Phoenix" גלולה 220x46 מימין למטה, "Scroll to explore" 18px באמצע למטה.
- blur על טקסט רק בדסקטופ (`isDesktop ? "blur(8px)" : "none"`): במובייל רק opacity ו-scale.
- canvas: דסקטופ 1440x900 ב-DPR 1; במובייל 390x844 ב-DPR 2, כלומר מרונדר בחצי רזולוציה (נראה מפוקסל ב-`033-y6047-p6.17.png`).

---

## 4. מה הופך את זה לחוויה (לבנייה מחדש)

- דמות אחת שעוברת את כל הסיפור ומשתנה איתו (קטנה, קרובה, חזיתית, כחולה, נוצה, אש): הרצף נבנה מהמצלמה, לא מחלוקה לסקשנים.
- ציר זמן אחד: progress = אינדקס + שבר, ו-timeline אפוי מכלי 3D שמקבל `seek(t)`. כל פרמטר ויזואלי (צבע רקע, חושך, שמש, אש, איזה קליפ) הוא track על אותו ציר.
- הכנפיים חיות בזמן גם כשאין גלילה: הגלילה מזיזה את העולם, לא את השרירים.
- טקסט מועט, מילה אחת בסריף נטוי בכל משפט, ומילים בודדות ענקיות (narrative. / Light / Spirit / Sound) כפסקי נשימה.
- כל טקסט נבנה ונפרק בגלילה (scale 1.3 + blur 8px + opacity), אין טקסט סטטי.
- ניגוד גדול אחד באמצע: מפסטל בהיר לחושך כחול בסקשן 11, ואז לאש בסוף.

## 5. מה לא להעתיק

- זמן טעינה ארוך מאחורי שער "Click to start" (84 s במכונה עמוסה; ארבעה מודלים, 16 טקסטורות, HDR, draco + basis).
- פונט Trial בפרודקשן.
- canvas בחצי רזולוציה במובייל.
- מוזיקה שנדלקת בקליק הראשון בלי שאלה (זה בסדר רק אם הכפתור ברור ושקט).
- כל המידע בתוך שכבות `fixed` שמוצגות ומוסתרות ב-`display` לפי ScrollTrigger: בלי JS אין תוכן.

---

## 6. פריימים שכדאי לראות

1440x900 (`G:/tmp/harvest/story/film-desktop/`):
- `000-loading.png` - ה-preloader.
- `004-hero.png` - הירו: מקרו כנף + H1 ענק.
- `008-cursor.png` - הסמן "Click to start".
- `018-y2100-p1.89.png` - ציפור קטנה, שמש, טבעת קשת, משפט ראשון.
- `040-y7800-p4.08.png` - "is narrative." על שמיים ריקים.
- `060-y12900-p6.17.png` - הציפור בחזית, כנפיים על כל הרוחב.
- `079-y17700-p7.58.png` - "Sound", גלישה ורודה.
- `093-y21300-p10.92.png` - המעבר לחושך, ציפור כחולה זוהרת.
- `102-y23700-p12.23.png` - הנוצה הבודדת.
- `130-y30900-p17.43.png` - קוביות הקרח של הקייסים.
- `149-y35700-p19.06.png` - phoenix בוער.
- `158-y38070-p20.00.png` - הפוטר.

390x844 (`G:/tmp/harvest/story/film-mobile/`):
- `003-hero.png` - הירו מובייל עם "Tap to explore".
- `033-y6047-p6.17.png` - הציפור רחבה מהמסך.
- `052-y10559-p10.86.png` - חושך, ציפור כחולה, טקסט לבן.
- `088-y19301-p17.18.png` - קוביית קרח.
- `132-y30017-p19.43.png` - phoenix בוער.

וידאו:
- `G:/tmp/harvest/story/film-desktop/tween/visit-seekable.webm` - 720x450, כל האתר בקצב גלילה קבוע (38070px ב-240 s), כולל טעינה, sweep של הסמן והתחלה. ציר הזמן של הקובץ דחוס (לא זמן אמת), לכן קצב הנפנוף בו מהיר מהמציאות.
- `G:/tmp/harvest/story/film-desktop/visit-seekable.webm` - 1440x900, 755 s ראשונים של הביקור הצעד-צעד (טעינה, הירו, sweep, התחלה, עד בערך p3).
- `G:/tmp/harvest/story/film-mobile/visit-seekable.webm` - 490x1060, כל הביקור במובייל (דחוס בערך פי 4).

דפי מגע:
- `G:/tmp/harvest/sheets/story/story-1440.jpg` (70 פריימים, כל סטיל שני)
- `G:/tmp/harvest/sheets/story/story-390.jpg` (124 פריימים)
