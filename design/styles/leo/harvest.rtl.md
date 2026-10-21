# קציר סגנון: Léo Parpeix (leoparpeix.com)

נקרא ב-21.10.2026 לצורך שחזור **הסגנון** (לא הנכסים) באתר סטודיו בעברית.
הקוד נקרא כטקסט בלבד: `G:/tmp/harvest/leo/index.html`, `main.js` (1.4MB, Vue 3 + Vite + GSAP + three.js + Lenis + Howler + Yuka), `main.css` (308KB, הורד ב-curl כטקסט).
שום JS שלהם לא הורץ מחוץ לביקור בדפדפן, ושום מודל, טקסטורה, צליל או תמונה שלהם לא נשמרו.
סטטוס: **מאומת** = נראה בקוד או בפריים; **הוסק** = שוחזר מקוד מכווץ או משמות; **מדידה** = נמדד בצילום.
מקור "main.js @N" = היסט התו בקובץ (חיפוש מחרוזת), כדי שאפשר יהיה לחזור לאותה נקודה.

הערת סביבה: המחשב היה עמוס מאוד בזמן הצילום (צילום מסך לקח 2-5 שניות).
לכן תזמונים מתוך הסטילס לא אמינים, ותזמונים בטבלאות למטה לקוחים מהקוד.

---

## 1. טבלת DNA

| ציר | ערך | מקור | סטטוס |
|---|---|---|---|
| קרקע | שני עולמות: (1) חדר תלת-ממד שטוף שמש, קרם וחום-עץ, חלונות קשתיים ושמיים; (2) נייר בהיר `#F7F7F7` עם דיו ירוק-שחור `#022016` | פריימים `leo/desktop/04-intro.jpg`, `14-y1780.jpg`; `main.css` (ספירת צבעים: `#022016` x45, `#f7f7f7` x25) | מאומת |
| חומר | חימר רך, מט, אור אפייה (baked) עם גרעין פילם עדין על כל הרינדור; בעמוד הנייר אין חומר, רק טיפוגרפיה ותמונות | טקסטורות `TexFleur, TexProps, TexMobilier, TexDecor, TexTableaux, TexBibli, TexFloor, TexWalls` (KTX2, sRGB, 2048 או 4096) ב-`main.js @607810`; גרעין נראה ב-`leo/closeup/04-pill-pop-650ms.png`; טקסטורת `noise.jpeg` ברשימה הגלובלית | מאומת (טקסטורות), הוסק (שזו אפייה של אור, לפי שמות "Tex" לכל קבוצת רהיטים) |
| פלטה | דיו `#022016`, ירוק מותג `#083D2A` (theme-color), צהוב `#F6E016`, נייר `#F7F7F7`, בז' `#EED6C8`, אפור כפתור `#ECECEC`, נקודה ירוקה `#008841` | `index.html` (theme-color), `main.css` | מאומת |
| טיפוגרפיה | טקסט: `text` = Monument Grotesk Regular 400 בלבד. כותרות: `title` = Avantt variable, `font-variation-settings:"wght" 622`, אותיות גדולות, `line-height:.9` (‏.845 בבלוק הדבורה, ‏.8 בטקסט על WebGL), בלי letter-spacing | `@font-face` ב-`main.css`; כללי `.title` | מאומת |
| סקאלת גודל | `html{font-size:clamp(12px,.9722vw,28px)}` = ‏14px ב-1440, ‏12px ב-390; כל המידות ב-rem של 14 | `main.css`; פונקציה `N_` (‏px/14) ב-`main.js @770096` | מאומת |
| מבנה | גריד 12 עמודות בדסקטופ, 8 מתחת ל-1025px; שוליים 1.4286rem = ‏20px; כותרת עליונה קבועה: שם משמאל, תפקיד, קישורים ופס סאונד מימין | `.gridWrapper`, `.navbarBlock*` ב-`main.css` | מאומת |
| צפיפות | אוורירית מאוד: פסקאות קצרות 14-18px, כותרות ענק מבודדות, הרבה נייר ריק; פרויקט = תמונה ענקית 72.6vw x 41.9vw + שורת מידע 14px | `.projectBlock__slider .media__image`, פריימים `17-y3124.jpg` | מאומת |
| דימויים | לפטופים בסביבות אמיתיות (צילומי מוקאפ), גרפיקה של הפרויקטים, אותיות ענק בחיתוך בצדדים; וידאו שואוריל קצר עם אותיות נופלות | פריימים `17-y3124.jpg`, `leo/mobile/15-y1692.png` | מאומת |
| חתימת תנועה | עקומת `reveal` = cubic-bezier(.4,0,0,1) לחשיפות; `hide` = (.86,0,.07,1); הובר UI ב-cubic-bezier(.16,1,.1,1) ‏.75-1s; בועות קופצות ב-`elastic.out(0.75)` ‏.65s ונעלמות ב-`expo.out` ‏.3s; שורות כותרת עולות מ-y 100% עם x ±5% לסירוגין | `$n.create("reveal",".4,0,0,1")` ב-`main.js @864027`, `@988600`; `main.css` | מאומת |
| גלילה | Lenis עם `lerp:.085` בדסקטופ, `lerp:1` (טבעי) מתחת ל-1025px, `syncTouch:true` | `_createLenis` ב-`main.js @1389800` | מאומת |
| פתיחה | טוען בהיר "Léo Parpeix / Art director, Interactive designer" + טבעת התקדמות 8px + "World building"; אחרי טעינה החדר נכנס בתנועת מצלמה צידית של 5 יחידות ב-2s ‏expo.out | `LoaderBlock` ב-`main.js @988600`; `class XX` @1254955 | מאומת |
| סאונד | Howler 2.2.4 + פלאגין מרחבי; אמביינט בלופ, 2 אפקטי פרי, צליל מעבר עמוד; נפתח בקליק הראשון בכל מקום; פס EQ של 4 קווים שהוא גם מד הווליום | `class J8` ב-`main.js @1100760`; `SoundButton` @803000 | מאומת |
| סמן | גלולה צהובה קטנה "CLICK [קו] TO ENABLE SOUND" שצמודה לסמן מלמעלה-ימין, נגררת בעדינות, נוטה ומתנפחת לפי מהירות, ונעלמת אחרי הקליק הראשון; אותה גלולה הופכת ל-"DRAG", ‏"WATCH REEL", ‏"Copy to clipboard" | `CursorIndication` ב-`main.js @770096`; `.cursorIndication*` ב-`main.css` | מאומת |

---

## 2. גלולת הסמן (הרגע שבעל הפרויקט אהב)

**מבנה:** `div.cursorIndication` (fixed, ‏z-index 2000, ‏pointer-events none) ובתוכו `div.cursorIndication__text--array` עם שני span ופס מפריד.
**טקסט:** מערך `["Click","to enable sound"]` מ-`PQ.cursorIndication` (`main.js @845165`), מוצג באותיות גדולות.
**מפריד:** קו אופקי `width:.818em` (‏9px) על `height:.0714rem` (‏1px), צבע `#083D2A`, ‏gap ‏.714rem (‏10px).

| מאפיין | ערך | מקור |
|---|---|---|
| גודל טקסט | `.7639vw`, מוגבל ל-11px עד 1440 (22px מעל 2880) | `main.css` |
| ריפוד ועיגול | `padding:.4286rem 1rem` = ‏6px 14px; `border-radius:3.57rem` (גלולה מלאה) | `main.css` |
| צבעים | רקע `#F6E016`, טקסט `#022016` | `main.css` |
| מידה נמדדת | כ-185x26px ב-1440 | מדידה ב-`leo/closeup/04-pill-pop-650ms.png` |
| עיגון | `transformOrigin:"0% 100%"`, ‏`xPercent:0, yPercent:-100`: הפינה השמאלית-תחתונה של הגלולה יושבת על חוד הסמן, הגלולה מעליו ומימינו. ל-"Drag" ההיסט הוא x ‏10%, ‏y ‏-112% | `n`, `s`, `B()` ב-`main.js @770096` |
| מעקב | החלקה אקספוננציאלית בלתי תלויה בקצב פריימים: `M.x = lerp(M.x, target, 1-exp(-12*dt))` (קצב 12/s) | `Xe` ב-`main.js` (‏`Tt=12`) |
| הטיה לפי מהירות | בכל pointermove: `z = clamp(signedDist*0.02, -1, 1)` (הסימן לפי הציר הדומיננטי); `z` מוחלק בקצב 6/s; חוזר ל-0 אם אין תנועה 50ms; ‏transform: ‏`translate(x,y) scale(1+|z|) rotate(z*40deg)` | `Be`, `Xe`, ‏`fG=50` |
| כניסה | בתנועת העכבר הראשונה: `scale 0 -> 1`, ‏.65s, ‏`elastic.out(0.75)` מהפינה התחתונה-שמאלית | `$()` ו-`qe()` |
| יציאה | `scale -> 0`, ‏.3s, ‏`expo.out` | `$()` |
| מתי נעלמת | (1) הקליק הראשון בכל מקום בעמוד (מאזין capture על window) פולט `CURSOR_SOUND_INDICATION_SUPPRESS` ומחליף את הסמן ל-null; (2) גם בלי קליק, ברגע שהסמן עובר מתחת לראש בלוק הטיפוגרפיה (`.webglBg__content.heroBlock`) בגלילה; (3) ריחוף על קישורי הניווט מדכא אותה | `_setupFirstClick` @1393583; `_t()`; `NavbarComponent` |
| גוף הדף בזמן ההמתנה | `body.awaiting-sound-click` נותן `cursor:pointer` לכל הדף (כל הדף הוא כפתור) | `main.css`, ‏`_setupFirstClick` |
| טלפון וטאבלט | אין סמן; הגלולה מופיעה **סטטית** בתחתית הטוען, מתחת ל-"World building", ונחשפת `opacity 0->1` ב-1s ‏`reveal` | `LoaderBlock` (`revealStaticSoundIndication`); פריים `leo/mobile/03-t6.0s.png` |
| וריאציות | "DRAG" על סליידרי הפרויקטים; "WATCH REEL" על השואוריל; "Copy to clipboard" על המייל בפוטר: התווית יוצאת למעלה (`yPercent -100`) ו-"Copied" נכנסת מלמטה, והרוחב מתכווץ, ‏.25s ‏`power2.out`, צבעים `#EED6C8`/`#083D2A`; בשואוריל: בועת play/pause עגולה 38px (קליק: ‏scale 1.12 ב-.08s ואז 1 ב-.85s ‏`elastic.out(1.6,.35)`) ובועת ציר זמן 44x18 עם חצים שמתרחקים ב-`elastic.out(1,.55)` ‏1.75s | `main.js @770096`, ‏`main.css` |

**למה זה עובד:** הגלולה מדברת בגוף שני, יושבת בדיוק איפה שהעין נמצאת, ומבקשת פעולה אחת.
הקליק שהיא מבקשת הוא גם הקליק שפותח את ה-AudioContext, ולכן אין שום כפתור "אפשר סאונד" נפרד.
ההטיה וההתנפחות לפי המהירות נותנות לה משקל של חפץ, לא של טקסט.

---

## 3. מערכת הסאונד

| חלק | ערך | מקור |
|---|---|---|
| מנוע | Howler 2.2.4 + Spatial Plugin; ‏`Howler.volume(.7)` | `class J8` ב-`main.js @1100760` |
| קבצים | `assets/sounds/compressed/{id}.aac`: ‏`ambient` (לופ, ‏volume .375, ‏fadeDuration 500ms, ‏128k), ‏`fruit1` ו-`fruit2` (‏.25, ‏replay, ‏96k), ‏`pageTransition` (‏.36, מתחיל ב-15% מאורך הקובץ, fade-in 700ms ‏`power2.out`, ‏128k) | `qF` ב-`main.js @612148` |
| פתיחה | קליק ראשון בכל מקום -> `TOGGLE_SOUND`. ה-SoundButton מריץ tween יחיד `amount 0->1`, ‏.5s ‏`power4.out`, שב-onUpdate קובע `setAmbientVolume(amount)` | `_setupFirstClick`; `SoundButton` @803000 |
| ויזואל הכפתור | 4 קווים `1.5x12px` (`.107rem x .857rem`) שחורים, ‏gap 3px; בכל טיק `scaleY = ((sin(t*.005 + i)+1)/2) * amount + .1`. כבוי = 4 נקודות, דולק = גל. בטלפון: ריבוע 40x40 ‏radius 8 רקע `#ECECEC`, קווים 2px מעוגלים | `SoundButton`; `main.css`; קרופים `leo/closeup/pill-crop/soundbars-*.png` |
| מרחב | בכל טיק `Howler.pos` ו-`Howler.orientation` = מיקום וסיבוב המצלמה, כלומר צלילים עם `pos` ממוקמים בחלל התלת-ממד | `Gp` ב-`class J8` |
| מעבר עמוד | בכל ניווט נפלט `PAGE_TRANSITION_SOUND` (רק אם הסאונד דלוק) | `ro.beforeEach` @979200 |
| שואוריל | כשהווידאו מתנגן האמביינט דועך ב-600ms, וחוזר ב-2800ms כשנסגר | `a8`, `l8` ב-`main.js @994800` |
| לשונית מוסתרת | `Howler.mute(document.visibilityState!=="visible")` | `Up` |
| פרי | `fruit1/fruit2` כ-SFX כשהדבורה מקבלת פרי | `playSfx` @1317331 |

---

## 4. החדר התלת-ממדי

| נושא | ערך | מקור | סטטוס |
|---|---|---|---|
| מודל ומצלמה | `scene_v9.glb` (בית), `scene_v15.glb` (אודות); המצלמה נלקחת מאובייקט `camera` בתוך ה-GLB (מצלמת Blender), FOV ‏22.9 (טלה, מראה "צילום מוצר") | `class XX`, `class jY` ב-`main.js @1254955` | מאומת |
| תאורה | אפייה: טקסטורת צבע אחת לכל קבוצה (`TexFleur`, `TexMobilier` ...) ב-KTX2; אין אורות בזמן ריצה בחדר | `Mc` @607810 | הוסק |
| כניסה | `modelCamera.position.x` מ-+5 ל-מיקום האפוי ב-2s ‏`expo.out` (במעבר עמוד: מ-+7, ‏2.5s ‏`expo.inOut`); יציאה: ‏+6 ב-.5s ‏`sine.out` | `class XX` | מאומת |
| עכבר | מצלמת ביניים `mouseMoveCamera`: סיבוב יעד `x = deg(y*0.2)`, `y = deg(-x*0.75)` (x,y ב-NDC ‏-1..1), כלומר עד 0.2 מעלות למעלה-למטה ו-0.75 מעלות לצדדים; החלקה `1-exp(-2*dt)` (איטית מאוד); כבוי במגע | `class qX` @1256187 | מאומת |
| נוזל מאחורי הסמן | סימולציית stable-fluids ברזולוציה .2 של המסך: ‏`mouse_force 80`, ‏`cursor_size 40`, ‏`dt .015`, ‏`dissipation .98`, ‏120Hz substeps עד 8; בפוסט: עיוות ‏`fluidDistortionStrength .003` וטשטוש מהירות ‏`fluidVelocityBlurScale 15`; כבוי במגע+טאבלט | `class Iq` @1376774; `Bq.postProcess` | מאומת |
| גלילה בחדר | לאורך גובה ה-header: ‏`camera.y -= clamp(p*2.4)`, ‏`camera.z -= clamp(p*4)` (בית: ‏`scrollRangePosition {x:0,y:2.4,z:4}`); המצלמה יורדת ונדחפת פנימה | `Da.header.cameraParams` @895800; `setScrollHeaderPositions` | מאומת |
| טקסט ה-header | "Driven by detail. Obsessed with seamless motion." + "Scroll down": נע `translateY(p*800%)` ודועך בין p=.2 ל-p=.45; מאחוריו הילה רדיאלית לבנה 50% ברוחב 24.17vw | `HeaderBlock` @882800; `.headerBlock__content:before` | מאומת |
| מעבר לעמוד הטיפוגרפיה | אין "חיתוך" אמיתי: עמוד הנייר הבהיר פשוט עולה מעל הקנבס בגלילה (רואים חפיפה בפריים `leo/desktop/13-y1340.jpg`), והקבוצות התלת-ממדיות מפסיקות להתרנדר מחוץ ל-header ולמקטע ה-WebGL (חיסכון) | `_updateHomeAboutGroupsScrollActive` @1379800 | מאומת |
| מקטע WebGL שני | "FOCUS ON INNOVATION AND USER-CENTERED DESIGN." לבן על מדף הספרים; מצלמה זזה y ‏2.75 לאורך המקטע; כל אות מתחילה ב-opacity ‏.15 ונדלקת לפי גלילה: חלון לאות = 8/N, פיזור על 72% מהטווח | `WebglSectionBlock` @882800 (`xS=.15`, ‏`LV=.72`, ‏`OV=8`) | מאומת |
| שתי בדים | `#canvas-app` (החדר + פוסט) ו-`#canvas-top-app` (דבורים ופירות מעל ה-DOM) | `index.html`; `Bq` | מאומת |

---

## 5. הדבורה ופריטים קטנים

| פריט | ערך | מקור |
|---|---|---|
| דבורה | מודל `bee_v4.glb` בקנבס העליון, מונעת בהיגוי Yuka (ספריית AI למשחקים: velocity, ‏maxSpeed, ‏lookAt) | `main.js @1281011` |
| "(Click to feed the bee)" | ריחוף מעל אזור הכותרת: הסמן נהיה `grab` ופרי תלת-ממד (תפוז או ענב) נצמד אליו; קליק מפיל את הפרי, הדבורה עפה לאכול, ‏SFX פרי, והכותרת מתהפכת מ-"French / Interactive / Designer" ל-"Creative / Passionnate / Art Director" | `BeeBlock` @864027; `Da.hero` @895800 |
| היפוך הכותרת | שורות ישנות יוצאות `y 100%`, ‏x ±5%, ‏1.5s ‏`power4.inOut`, ‏stagger ‏.115; חדשות נכנסות 2s ‏`reveal`, ‏stagger ‏.1, היסט .63s; איפוס אחרי 2600ms | `BeeBlock` (`Fl=2`, ‏`vS=2600`) |
| בועת דיבור של הדבורה | גלולה ליד הדבורה: רקע `#F7F7F7` (או בז', צהוב, או "שיחה" כהה `#022016`), טקסט 16px כפול סקייל הדבורה; נפתחת דרך משתנה `--reveal` ‏0->1 ב-.65s ‏`elastic.out(0.75)`; החלפת טקסט: יציאה .22s ‏`expo.in`, כניסה .65s | `BeeTextIndication` ב-`main.js`; `.beeTextIndication*` |
| "+6 years exp." | נקודה ירוקה `#008841` 8px לפני הטקסט, בכרטיס ניסיון לבן `radius 1rem` | `.cardBlock*` |
| תג "Current" | גלולה צהובה `#F6E016` עם נקודה `#083D2A` ‏6px ב-opacity ‏.8 | `.job__current` |
| כוכביות | "*" בגודל 34px כמפריד בין פסקאות | `.introBlock__star` |
| ארכיון | שורות 14px: מספר, שם, סוג ב-opacity ‏.3; פתיחה בגובה ‏1.4s ‏cubic-bezier(.16,1,.1,1); צבע בריחוף .35s | `.archivesBlock*` |
| פוטר | 3 גרסאות רקע: לבן, ירוק `#083D2A` עם טקסט בז', צהוב; "Credits", ‏"Instagram • מייל • LinkedIn" (נקודות 5px), "© 2026" ב-18px; פופאפ קרדיטים עם פינה מעוגלת אחת | `.footerBlock*` |
| ניווט | 14px; קו תחתון בריחוף `scaleX 0->1` מ-left, יציאה ל-right, ‏.75s; ‏navbar מופיע `opacity 1s` עם השהיה 3.75s | `.mainButton`, ‏`.navbarBlock` |
| מדיה | פרלקסה בתוך מסכה ±20%, ‏scale ‏1.1 | `MediaComponent` @847600 |
| סליידרי פרויקט | מישורי WebGL, גרירה אינסופית: `dragMultiplier 3` (‏4 בטלפון), ‏`snapLerp .055` (‏.14), ‏`dragFollowLerp .068`, ‏`deltaDecay .9`, ‏`parallaxXMultiplier 1.25` (‏2.75), רווח 20px (‏10) | `O4`, `F4` ב-`main.js` |

**אזהרה לשחזור אצלנו:** הניווט, "Project link" וכפתורי החץ משתמשים בקו מתחת לתווית (קבוע או בריחוף).
זה מתנגש בכלל הנעול שלנו "בלי קווים מתחת לתוויות כפתורים", לכן לא מעתיקים את זה.

---

## 6. טיפוגרפיה במספרים (1440 ו-390)

| אלמנט | 1440 | 390 | משקל, גובה שורה, צבע | מקור |
|---|---|---|---|---|
| כותרת הטיפוגרפיה "FRENCH INTERACTIVE DESIGNER" ופוטר "LET'S CREATE..." | `11.25vw` = ‏162px | ‏48px (כלל `max-width:427px`), נמדד 48px | Avantt ‏622, ‏`.9` (‏`.845` בעמוד), אותיות גדולות, `#022016` | `.beeBlock .title`; `leo/mobile/meta.json` |
| "FOCUS ON INNOVATION..." וקווי הפרחים | `8.194vw` = ‏118px | ‏40px (פרחים, `max-width:488px`) | Avantt ‏622, ‏`.8`, `#F7F7F7` על WebGL | `.webglSectionBlock__text`, ‏`.flowersBlock__line .line__title` |
| כותרות אודות וכותרת התוכן | `3.611vw` = ‏52px | ‏32px | Avantt ‏622, ‏`.9` | `.contentBlock__left .left__title` |
| "Driven by detail..." | `1.667vw` = ‏24px | ‏24px | Monument 400, ‏1.2 | `.content__description` |
| "Bonjour, I cherish simplicity..." | `2.361vw` = ‏34px | ‏22px | Monument 400, ‏1.175, רוחב 440px | `.introBlock__top .top__baseline` |
| "Selected projects", "Archives" | ‏34px | ‏20px | Monument 400, ‏1.1 | `.projectBlock__title .title__text`; meta |
| טקסט גוף קצר | ‏18px | ‏18px | Monument 400, ‏1.2 | `.introBlock__bottom .bottom__text` |
| מידע, ניווט, תוויות | ‏14px | ‏14px | Monument 400, ‏1 | ‏`.9722vw` עם רצפה 14px |
| גלולת הסמן | ‏11px אותיות גדולות | ‏11px, סטטית בטוען (ריפוד גדול יותר: 17x33px) | Monument 400 | `.cursorIndication__text` |

ריווח אותיות: לא מוגדר בשום מקום (0).
המשמעות: כל הדרמה באה מגודל ומשקל 622 של Avantt מול Monument רגיל, לא מריווח.

---

## 7. מלאי רגעים לפי הסדר

| # | רגע | מה זז | מה מניע | משך, עקומה, קבועים |
|---|---|---|---|---|
| 1 | טוען | שם, תפקיד וטבעת "World building" עולים מ-y ומסיבוב | GSAP timeline, השהיה 1.5s | ‏1s ‏`reveal`, ‏stagger ‏.15; טבעת `progressCircleAnimation` ‏1s linear |
| 2 | גלולת סאונד בטוען (טלפון בלבד) | גלולה צהובה סטטית | אותה timeline | ‏`opacity 0->1` ‏1s ‏`reveal` |
| 3 | יציאת הטוען | השורות יוצאות למעלה, הטוען דועך | `APP_LOADED` + ‏3.75s | ‏.45s ‏`power2.out`; ‏opacity ‏.35s |
| 4 | החדר נכנס | המצלמה מחליקה 5 יחידות בציר x | `ModelCamera.show` | ‏2s ‏`expo.out` |
| 5 | טקסט ה-header | תיאור ואז "Scroll down" | השהיה .01+.9s | ‏stagger ‏.25 |
| 6 | ניווט | כל השורה העליונה | CSS | ‏`opacity 1s` השהיה 3.75s |
| 7 | גלולת הסמן | נכנסת, עוקבת, נוטה | pointermove | ‏.65s ‏`elastic.out(.75)`; מעקב 12/s; הטיה ‏`z*40deg` |
| 8 | עכבר על החדר | מצלמה מסתובבת מעט + עיוות נוזל | pointer | עד ‏.2°/‏.75°, קצב 2/s; נוזל ‏.003 |
| 9 | קליק ראשון | הגלולה נעלמת, פס ה-EQ מתעורר, אמביינט עולה | click capture | ‏.3s ‏`expo.out`; ‏tween ‏.5s ‏`power4.out` |
| 10 | גלילה בחדר | מצלמה יורדת 2.4 ונכנסת 4; הטקסט עף ודועך | Lenis ‏`lerp .085` | דעיכה בין p ‏.2 ל-.45 |
| 11 | עמוד הנייר עולה | "FRENCH / INTERACTIVE / DESIGNER" | גלילה, חשיפה על כניסה | שורות `y 100%->0`, ‏x ±5%, ‏1s ‏`reveal`, ‏stagger ‏.115 |
| 12 | האכלת הדבורה | פרי בסמן, דבורה עפה, הכותרת מתהפכת | hover + click | ‏1.5s ‏`power4.inOut` / ‏2s ‏`reveal`; איפוס 2.6s |
| 13 | Bonjour ושואוריל | טקסט, וידאו קטן עם "WATCH REEL" | גלילה | פוסטר נעלם .45s |
| 14 | פרויקטים | סליידר WebGL נגרר עם "DRAG" | drag | ‏snap ‏.055, פרלקסה פנימית ×1.25 |
| 15 | מקטע WebGL | אותיות נדלקות על מדף הספרים | גלילה | ‏.15->1 לכל אות, חלון 8/N |
| 16 | ארכיון | שורות נפתחות | click/hover | ‏1.4s ‏cubic-bezier(.16,1,.1,1) |
| 17 | פוטר | "LET'S CREATE A REMARKABLE JOURNEY" + דבורה תלת-ממד; מייל -> "Copied" | גלילה, קליק | ‏.25s ‏`power2.out` |

---

## 8. פריימים שכדאי לראות

**390 (טלפון, DPR 2, ‏PNG):** `G:/tmp/harvest/leo/mobile/`
- `03-t6.0s.png` - הטוען עם גלולת הסאונד הסטטית (הרגע שבעל הפרויקט אהב, בגרסת טלפון).
- `09-tap3500.png` - החדר אחרי הנגיעה, פס הסאונד דולק.
- `12-y846.png` - "FRENCH INTERACTIVE DESIGNER" ב-48px.
- `22-y3666.png` - "FOCUS ON INNOVATION..." על מדף הספרים.
- `35-y7332.png` - הפוטר עם הדבורה.

**1440:**
- `G:/tmp/harvest/leo/closeup/04-pill-pop-650ms.png` - החדר עם הגלולה ליד הסמן.
- `G:/tmp/harvest/leo/desktop/13-y1340.jpg` - המעבר: הנייר עולה מעל החדר.
- `G:/tmp/harvest/leo/desktop/14-y1780.jpg` - כותרת הטיפוגרפיה עם הדבורה.
- `G:/tmp/harvest/leo/desktop/17-y3124.jpg` - כרטיס פרויקט: לפטופ בסביבה אמיתית.
- `G:/tmp/harvest/leo/desktop/25-y6698.jpg` - מקטע ה-WebGL השני.
- `G:/tmp/harvest/leo/closeup/18-hover-slider.png` - גלולת "DRAG".

**קרופים של הגלולה (ffmpeg, x2):** `G:/tmp/harvest/leo/closeup/pill-crop/` (‏`01-...` עד `16-...`), ופס הסאונד לפני ואחרי: `soundbars-10-pill-rest.png`, `soundbars-16-after-click-2200ms.png`.

**גיליונות:** `G:/tmp/harvest/sheets/leo-1.jpg`, `leo-2.jpg` (דסקטופ), `leo-mobile.jpg` (+`.txt` עם סדר הקבצים), `leo-closeup-desktop.jpg`, `leo-pill-closeup.jpg`.

**וידאו:** `G:/tmp/harvest/leo/desktop/visit.webm`, `leo/mobile/visit.webm`, `leo/closeup/leo-closeup.webm`.
הערה: בזמן הצילום רץ במקביל סרט טלפון ישן לאותה תיקייה (סטילס `*.jpg` בחצאי מסך), כך שה-webm של הטלפון עלול להיות פגום; הסטילס `*.png` הם שלי ותקינים.
