# 04 Hebrew copy: research, voice rules and a line-by-line audit

Prepared 2026-10-16 for the MediaWave redesign (mediawave.co.il). Research is from the web, accessed 2026-10-16.
Every Hebrew rewrite below is a draft and counts as [קופי: נתי] until Nati approves it.
Rewrites use only facts that already appear in the audited files. Where a strong line needs a fact we do not have, the slot reads [לבירור: נתי].

## Executive summary

1. The home page copy is already close to Nati's voice. The service pages (`src/data/services.ts`) are not: they still read like a 2023 agency template, with stack names, conversion jargon and a triad in almost every paragraph.
2. Three honesty conflicts come before any polish. The SEO page promises page one in its subtitle and CTA, while its own FAQ says nobody can promise that. WhyUs promises that the site will appear in AI answers. Visitors are told the reply time in three different ways: 24 hours on business days, "today" and "בהקדם".
3. The H1 "העסק שלכם / המומחיות שלנו" is a word-for-word calque of the English agency slogan "Your business. Our expertise." Any competitor could put the same line on their site.
4. The Hebrew sources agree on the AI tells: long dashes and maqaf, "לא רק... אלא גם", stock openers like "בעידן שבו", a closing "לסיכום", triads, and calques like "משנה את כללי המשחק" (Walla 2025, Aizenman 2025, The Grinder 2026, Wikipedia).
5. For address, the accepted gender-fair defaults are plural אתם, plural imperatives, first person and action nouns (Open University guide, Kinneret Yifrah). Slash forms like "מאשר/ת" and "מתעניין/ת" read as dated and should go.
6. WhatsApp is used by 99% of Israelis (Israel Internet Association, May 2026), so it is the main action. Buttons should name WhatsApp, and the prefilled message should be short, first person and gender-neutral.
7. CTA sprawl: "דברו איתנו" and "בואו נדבר" appear about ten times on the site, for three different destinations. One verb per destination fixes this.
8. Part B audits 214 visible strings across 17 files plus adjacent template strings. About 150 of them get a rewrite.
9. Gender leaks to fix: the nav item "צור קשר", the FAQ wording "אני צריך", the aria labels "פתח/סגור תפריט", and "/ת" in the consent label and the WhatsApp prefills.
10. Part C offers three H1 and sub pairs. The recommended pair anchors the hero on the WhatsApp outcome and the 2 to 3 week timeline, and keeps "בלי מתווכים" only in WhyUs.

---

## Part A: research findings

### A1. What Israeli small-business owners respond to

- **Dugri is a cultural code.** Tamar Katriel's study of dugri ("straight talk") shows that Israelis read directness as sincerity, while outsiders often hear it as rudeness. For copy, this means plain statements, facts and no flattery read as honest. Hedging and praise words read as a sales pitch. [S1]
- **Promotional language costs credibility. This is measured, not just a matter of taste.** In the Morkes and Nielsen study (1997) of web writing, the objective version of a page scored 27% better in usability than the promotional ("marketese") version, with higher satisfaction. The concise version scored 58% better. The version that was concise, scannable and objective at once scored 124% better. The study is English and old, but the mechanism carries over: readers distrust self-praise. [S2]
- **Generic praise words do not separate one business from another.** Israeli copywriting guides make the same point. Words like מקצועי, איכותי, מתקדם and "שירות ללא פשרות" appear on thousands of sites. Vague lines like "שירות איכותי במחירים אטרקטיביים" are white noise and should give way to numbers, times and concrete results. [S3, S4] Another guide uses "פתרונות מתקדמים" as its example of inflated wording and suggests naming the benefit to the reader instead. [S5] A fourth guide recommends simple, eye-level language over talking down. [S6]
- **What small-business owners value in a service provider.** In a Bank of Israel supervision survey of business owners, satisfied respondents most often cited good service, personal attention (יחס אישי) and phone availability. Lack of personal attention and of availability were among the top complaints. [S7] The survey is about banks, from 2020, so this is an inference: "one developer you can reach directly" is the right differentiator, and Nati's benchmark line "מדברים ישירות עם המפתח, בלי מתווכים" hits exactly that need.
- **Gap.** I found no Israeli survey on what small-business owners want from a web studio. Any claim about that remains UNVERIFIED.

### A2. Addressing the reader without gender trouble

- **The Open University guide (Shlomit Uziel) lists 12 methods.** It calls the slash form (סטודנט/ית) uncomfortable to read and outdated. It recommends the infinitive ("נא לציין"), verbal nouns, first person plural in past or future, and words spelled the same for both genders (רוצה, עליך). [S8]
- **Kinneret Yifrah (microcopy.co.il), Israel's best-known microcopy writer, recommends three forms.** First person ("תחזרו אליי", "אני רוצה להירשם"), action nouns for buttons (שמירה, הרשמה) and infinitives. She lists slash and dot forms as one option among many. [S9] Note: the site's lead button "תחזרו אליי" is her own example, so it can stay.
- **Buttons.** An Alef Alef Alef microcopy piece says "שליחה" is gender-free and "שלח" is masculine. It also says microcopy should be short. [S10]
- **When to use plural.** A copywriting guide argues that one-to-one channels such as SMS can match the reader's gender, while general pages should use plural. [S11] UNVERIFIED: this comes from a search summary. I could not read the full article.
- **What this means for MediaWave.**
  - Body copy uses plural אתם/לכם.
  - CTAs use plural imperatives (כתבו, שלחו) or action nouns (שליחה).
  - Consent lines use first person past ("קראתי והסכמתי"), which has no gender in Hebrew.
  - The WhatsApp prefill uses first person ("אשמח לשמוע"), which also has no gender.
  - FAQ questions are impersonal ("צריך לדעת תכנות?"), never "אני צריך".
  - Remove every "/ת".

### A3. The clichés of Israeli web-agency sites

No Hebrew source I found lists these exact phrases as clichés. The classification below is editorial, supported by the guides in A1 [S3, S4, S5] and by Nati's own slop scan, which already removed "גישה אישית" and "ליווי צמוד" from the hero (see the comment in `src/look/data.ts`).

| Phrase | Why it fails |
|---|---|
| פתרונות דיגיטליים / פתרון מקיף | Names no product and no result. Readers skip it. |
| מקצועי / מקצועית / מקצועיים | Everyone claims it, so it proves nothing. [S3] |
| איכותי / ברמה הגבוהה ביותר | Self-praise, the "marketese" that cost 27% in usability. [S2] |
| חדשני / מתקדם / טכנולוגיה מתקדמת | An unverifiable claim, and it pulls tech into the copy. |
| מוביל / מובילים בתחום | An unverifiable ranking. It crosses Nati's "no invented proof" line. |
| מותאם אישית | Calque of "tailor-made", and it is on every competitor's site. |
| ליווי צמוד / ליווי אישי לאורך כל הדרך | Vague. Nati's slop scan flagged it. Say what the support is: "תמיכה בחודש הראשון". |
| חווית משתמש / UX | Jargon. Say what the visitor feels: "נוח לגלוש", "נפתח מהר". |
| תוצאות / שמביא תוצאות | Which results? Name the outcome: פניות, הודעות בוואטסאפ. |
| שעובד בשבילכם | A filler ending. |
| הופך גולשים ללקוחות | Calque of "turn visitors into customers", and an implied promise. |

### A4. What makes Hebrew sound machine-translated

- **Hebrew Wikipedia's list of common translation errors** flags four things: calqued idioms, overuse of the passive (forms like הותחל, הופעל, "התמונה נלקחה"), English word and tense order, and "עם" used for "with" where Hebrew uses ב. [S12]
- **Angora Media (Dafna Ben Yehoshua)** lists calques that sound bad in Hebrew. Examples: "עושה את ההבדל" (makes a difference), "זה מרגיש" (it feels), "לקחת החלטה" (take a decision), "עושה שכל" (makes sense), "על אותו עמוד" (on the same page). [S13]
- **Nurit Shai** argues that translationese starts to sound natural through repetition and is everywhere in ads. Her example is "לקחת בחשבון" where Hebrew says "להביא בחשבון". [S14]
- **Tal Aizenman** gives AI calques: "משנה את כללי המשחק" (game changer), "כאן נכנס לתמונה" (this is where X comes in), "בהיר כקריסטל" (crystal clear). [S15]
- **Editorial findings, UNVERIFIED (no source names them):**
  - "לקחת את העסק לשלב הבא" (take your business to the next level). It does appear in sponsored Israeli business content as "להקפיץ את העסק שלכם לשלב הבא". [S16]
  - "העסק שלכם, המומחיות שלנו" (Your business, our expertise).
  - "ידידותי למובייל" (mobile-friendly).
  - "תארו לעצמכם" as an opener (Imagine...).
  - "התוצאה היא" (The result is).
  - "צריך אחד" (needs one).
  - Stacked possessives (שלכם ... שלנו ... שלו).
  - Over-definite nouns with ה.

### A5. What reads as AI-written Hebrew in 2025 and 2026

- **Walla Tech (Inon Ben Shoshan, 3.7.2025):** Four signs:
  - The em dash is rare in Hebrew journalism.
  - The maqaf is rare in everyday Hebrew.
  - Every paragraph opens the same way.
  - Closers like "לסיכום" and "בסופו של דבר" appear even when there is nothing to sum up. [S17]
- **Tal Aizenman (30.12.2025):** Long dashes and curly quotes, the "לא רק... אלא גם" construction, and the calques in A4. [S15]
- **The Grinder (Gil Slovik, 09.08.2026):**
  - Openers like "בעידן שבו" followed by a long dash.
  - A "hybrid Hebrew" that reads as translated English.
  - Leftover Markdown and too many emoji.
  - Balanced "מצד אחד / ומצד שני" pieces that never take a side.
  - A final "לסיכום".
  - Long dashes, which Israeli readers see as a typo. [S18]
- **Wikipedia, "Signs of AI writing":**
  - The rule of three (triads).
  - Negative parallelisms ("Not just X, but also Y", "Not X, but Y").
  - Promotional language.
  - Clusters of "AI vocabulary".
  - Em dash overuse, now filed under "historical indicators". [S19]
- **Israel Hayom (2026):** A newer tell is explaining every professional term in parentheses. [S20] UNVERIFIED: the site returned 403, so this comes from the search snippet only. It matters here because `services.ts` does exactly this: "מפת אתר (sitemap)", "(Mobile-First)", "(SEO)".
- **Stock connectors** like "חשוב לציין כי", "ראוי להדגיש כי", "בנוסף לכך" and "במילים אחרות" are listed by Israeli editing and teaching sites. [S21] UNVERIFIED: from search summaries.
- **Detectors are unreliable in Hebrew.** [S22] The goal is not to beat a detector. The goal is a page that reads as a person talking.

### A6. Microcopy for WhatsApp CTAs in Israel

- **Reach.** WhatsApp is used by 99% of Israelis, the highest of any platform. Source: the Israel Internet Association survey, May 2026, 1,040 respondents, fieldwork by Geocartography. [S23]
- **How the link works.** A wa.me click-to-chat link can carry a prefilled message, which the visitor can edit before sending. [S24, S25] UNVERIFIED: a third-party guide quotes a 140-character limit for prefills, citing Meta.
- **Practitioner advice.** Israeli guides say three things about the prefill: keep it short, use it to open a conversation rather than close a sale, and say what the visitor came about so the reply can be focused. [S26]
- **What MediaWave does today.** Every WhatsApp link opens with "היי, אני מתעניין/ת בבניית אתר ואשמח לשמוע פרטים נוספים 😊". This has three problems:
  - The visitor has to delete a slash before sending a message in their own name.
  - Someone who wants tape conversion is made to say they want a website.
  - "פרטים נוספים" is filler.
- **Recommendation.**
  - The button names the channel: "כתבו לנו בוואטסאפ".
  - The prefill is first person and gender-free: "היי, אשמח לשמוע על אתר לעסק שלי."
  - Each service gets its own prefill (see Part B, `src/utils/whatsapp.ts`).
  - Status lines say what just happened: "ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח."

### Voice rules (testable)

1. No stack or tech names in visible copy: React, Next.js, Tailwind, Framer Motion, WordPress, SEO, SSL, Structured Data, sitemap, Mobile-First, 24/7. Test: grep the copy files.
2. No tech words in Hebrew either: רספונסיבי, אופטימיזציה, חווית משתמש, המרה/ממיר, לידים, תנועה (traffic), פלטפורמה, ממשק ניהול, מערכת ניהול תוכן, אפיון. Test: grep.
3. No em dash, en dash or maqaf (U+2014, U+2013, U+05BE). Test: grep for the three code points.
4. No hyphen after a Hebrew prefix letter before Latin text or digits ("ב-AI", "ל-24"). Rephrase so the prefix is not needed. Test: grep for a prefix letter followed by "-".
5. Ranges are written "2 עד 3", never "2-3". Test: grep for digit-hyphen-digit in Hebrew strings.
6. No rhythmic triads. A sentence lists at most two items, or four or more items when it is a factual list. Test: read each "X, Y ו Z" by hand.
7. No "לא X אלא Y", no "לא רק... אלא גם", no "X, לא Y". Test: grep for "אלא" and "לא רק".
8. No masculine singular address and no slash forms: never צור, שלח, פתח, סגור, אתה, אני צריך, /ת, /ה. Use plural, action nouns or first person. Test: grep.
9. A button says where the click goes. A button that opens WhatsApp contains the word וואטסאפ. Test: list every button whose href points to wa.me.
10. Every claim maps to a fact in the files: a timeline, what is included, one developer, WhatsApp, the services. Test: each claim must point to its source line.
11. No superlatives that were not measured: הכי, מקסימלי, מושלם, ראשון, משמעותית. Test: grep.
12. No promise of a Google position or of AI-answer placement anywhere. Every SEO line has to agree with the FAQ "אף אחד לא יכול להבטיח מקום ראשון". Test: grep for "ראשון" and "יופיע".
13. Outcome first: the subject of a sentence is the customer or the customer's customer. At most one sentence per section starts with "אנחנו". Test: count.
14. No filler adjectives: מקצועי, איכותי, חכם, חדשני, מוביל, מתקדם, מרגש, מלוטש, חלק, מדויק. Test: grep.
15. No exclamation marks and no emoji in headings, body copy or status lines. Test: grep for "!" and for emoji code points.
16. Active voice. Avoid מבוצע, מסופק, נעשה שימוש, הונפשו. Test: by hand.
17. FAQ questions are worded the way people ask them out loud. No opening "האם". Test: grep for questions that start with "האם".
18. One line appears only once per page: no sentence repeats on the same route. Test: a script that removes duplicates from the strings rendered per route.
19. One spelling per term: וואטסאפ in Hebrew letters, never "WhatsApp" in body copy. One spelling of צ'אטבוט (the files mix ' and ׳). Choose עמוד or דף and stick to it. Test: grep.
20. Gender and number agree: איזו איכות, אותן קלטות, מה כוללת החבילה. Test: a proofread pass.
21. Every sentence passes a read-aloud test: one breath per sentence. About 15 words at most on the home page, about 20 on service pages. Test: count words.
22. Meta titles may use the words people type into Google (בניית אתרים, קידום בגוגל, המרת קלטות לדיגיטל), never jargon (אופטימיזציה, ממירים, SEO on its own). Test: by hand.
23. Each chapter heading gets a present-plural verb kicker: מכירים, בוחרים, בונים, שואלים, מתחילים. Test: check the five chapter heads.
24. Slot rule: where a line needs a fact we do not have, write [לבירור: נתי], never a guess. Test: grep for the slot before release.

### Banned phrases (Hebrew)

פתרונות דיגיטליים, פתרון מקיף, פתרונות מתקדמים, מקצועי, מקצועית, מקצועיים, איכותי, איכותיות, ברמה הגבוהה ביותר, חדשני, מוביל, מובילים בתחום, טכנולוגיה מתקדמת, מותאם אישית, מותאמים לעסקים, ליווי צמוד, גישה אישית, חווית משתמש, רספונסיבי, רספונסיביות, אופטימיזציה, ממיר, ממירים, ממוקד המרה, אחוזי המרה, לידים, טפסים חכמים, בוטים חכמים, צ'אטבוטים חכמים, שעובד בשבילכם, שעובדים בשבילכם, הופך גולשים ללקוחות, תוכן שגוגל אוהב, דירוג מקסימלי, תנועה לאתר, מבוסס בינה מלאכותית, מערכת ניהול תוכן, ממשק ניהול, ידידותי למובייל, לקחת את העסק לשלב הבא, להקפיץ את העסק, בעולם של היום, בעידן הדיגיטלי, בעידן שבו, לא רק ... אלא גם, משלים לא מחליף (the "X, לא Y" pattern), חשוב לציין, ראוי להדגיש, בנוסף לכך, לסיכום, בסופו של דבר, בסופו של יום, משנה את כללי המשחק, כאן נכנס לתמונה, עושה את ההבדל, זה מרגיש, לקחת החלטה, לקחת בחשבון, התוצאה היא, תארו לעצמכם, מתנה מושלמת, חוזרות לחיים, מרגש ומלא חיים, שבאמת, בדיוק לפי מה שצריך, נשמח לשמוע, בהקדם, שיחת ייעוץ ללא עלות, כל מה שרציתם לדעת, נחזיר אתכם למסלול, מתעניין/ת, מאשר/ת, צור קשר.

### Sources (all accessed 2026-10-16)

- S1. Tamar Katriel, *Talking Straight: Dugri Speech in Israeli Sabra Culture*, Cambridge University Press, 1986. Catalogue record: https://cris.haifa.ac.il/en/publications/talking-straight-dugri-speech-in-israeli-sabra-culture/ (summary read via the record and reviews, not the full text).
- S2. Nielsen Norman Group, "Concise, SCANNABLE, and Objective: How to Write for the Web" (Morkes and Nielsen, 1997): https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/
- S3. Kiryatech, "איך לכתוב כותרת שיווקית שמניעה לפעולה?": https://kiryatech.com/how-to-write-a-marketing-title/ (UNVERIFIED: the page returned HTTP 520, so the content comes from the search summary).
- S4. Blaze, "קופירייטינג: המדריך המלא לכתיבה שיווקית שמוכרת": https://blaze.co.il/%D7%A7%D7%95%D7%A4%D7%99%D7%A8%D7%99%D7%99%D7%98%D7%99%D7%A0%D7%92-%D7%9E%D7%93%D7%A8%D7%99%D7%9A/ (from the search summary).
- S5. Topeak Media, "טיפים לכתיבה שיווקית": https://www.topeak.co.il/%D7%A7%D7%99%D7%93%D7%95%D7%9D-%D7%90%D7%AA%D7%A8%D7%99%D7%9D/%D7%98%D7%99%D7%A4%D7%99%D7%9D-%D7%9C%D7%9B%D7%AA%D7%99%D7%91%D7%94-%D7%A9%D7%99%D7%95%D7%95%D7%A7%D7%99%D7%AA/ (from the search summary).
- S6. Shakoof, "כתיבה שיווקית, קופירייטינג, איך עושים את זה נכון": https://shakoof.org.il/%D7%9B%D7%AA%D7%99%D7%91%D7%94-%D7%A9%D7%99%D7%95%D7%95%D7%A7%D7%99%D7%AA-%D7%A7%D7%95%D7%A4%D7%99%D7%A8%D7%99%D7%99%D7%98%D7%99%D7%A0%D7%92 (from the search summary).
- S7. Gad Lior, Ynet, 26.01.2020, Bank of Israel supervision survey of business owners: https://www.ynet.co.il/articles/0,7340,L-5666543,00.html
- S8. Shlomit Uziel, Open University of Israel, "לכתוב לכולם, לכתוב לכולן: 12 דרכים לפנייה שוויונית-מגדרית": https://www.openu.ac.il/about/gender/article/pages/article_shlomit_ouziel.aspx
- S9. Kinneret Yifrah, "כתיבה שוויונית: מדריכים, פתרונות ומקורות": https://www.microcopy.co.il/how-to-write-for-all-genders (interview context: https://www.pixelperfect.co.il/posts/micro-copy-kinneret-yifrah/, UNVERIFIED, from the search summary).
- S10. Or Segal, Alef Alef Alef, "6 טיפים לכתיבת מיקרו קופי מנצח", 13.05.2021: https://alefalefalef.co.il/microcopy/
- S11. Hamila, "כתיבה שיווקית, המדריך השלם לטעויות נפוצות: טעות מספר שש": https://hamila.biz/6-2/ (UNVERIFIED, from the search summary).
- S12. Hebrew Wikipedia, "ויקיפדיה:שגיאות תרגום נפוצות": https://he.wikipedia.org/wiki/%D7%95%D7%99%D7%A7%D7%99%D7%A4%D7%93%D7%99%D7%94:%D7%A9%D7%92%D7%99%D7%90%D7%95%D7%AA_%D7%AA%D7%A8%D7%92%D7%95%D7%9D_%D7%A0%D7%A4%D7%95%D7%A6%D7%95%D7%AA
- S13. Dafna Ben Yehoshua, Angora Media, "11 ביטויים באנגלית שנשמעים גרוע בעברית": https://www.angoramedia.com/he/blog/english-expressions-wrong-use-in-hebrew
- S14. Nurit Shai, "תרגומית, השפעת האנגלית, תרגום מילולי": https://www.nurit-shai.com/2022/11/10/%D7%A9%D7%A4%D7%94-%D7%97%D7%93%D7%A9%D7%94-%D7%93%D7%9E%D7%95%D7%99%D7%AA-%D7%A2%D7%91%D7%A8%D7%99%D7%AA-%D7%AA%D7%A8%D7%92%D7%95%D7%9E%D7%99%D7%AA/
- S15. Tal Aizenman, "איך לזהות אם טקסט נכתב ב AI? שלושת הסימנים הכי מסגירים", 30.12.2025: https://aiz.co.il/2025/12/30/three-ai-writing-telltales/
- S16. Maariv, sponsored content, "להקפיץ את העסק שלכם לשלב הבא": https://www.maariv.co.il/business/carrier/article-964780 (seen in search results only).
- S17. Inon Ben Shoshan, Walla Tech, "המקף העברי, הקו הארוך ומה שביניהם", 3.7.2025: https://tech.walla.co.il/item/3762196
- S18. Gil Slovik, The Grinder, "כותבים עם בינה מלאכותית? אל תעשו את הטעויות האלה", 09.08.2026: https://thegrinder.co.il/writing-with-ai/
- S19. Wikipedia, "Signs of AI writing": https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- S20. Israel Hayom, "תשכחו מהמקפים: הסימן החדש והמפתיע שמסגיר טקסט שנכתב ב AI": https://www.israelhayom.co.il/tech/tech-news/article/19919285 (UNVERIFIED, HTTP 403, from the search snippet).
- S21. The Shark Lady, "איך מזהים עבודה שנכתבה על ידי בינה מלאכותית?": https://shark-lady.com/ai_assignment_teachers/ (UNVERIFIED, from the search summary).
- S22. Tel Aviv University Libraries blog, "מי כתב את זה?": https://libraries-blog.tau.ac.il/?p=15779 (from the search summary).
- S23. ice.co.il, Israel Internet Association survey 2026, 27.5.2026: https://www.ice.co.il/social/news/article/1114495 (Maariv on the same survey, 27.5.2026: https://www.maariv.co.il/economy/tech/article-1326023).
- S24. WhatsApp Help Center, "How to use the click to chat feature": https://faq.whatsapp.com/5913398998672934 (the title is verified, the body was not retrievable).
- S25. Bird, "What is a WhatsApp click to chat link": https://bird.com/explained/whatsapp/what-is-a-whatsapp-click-to-chat-link (third party; source of the UNVERIFIED 140-character note).
- S26. Captain Digital, "מדריך ליצירת קישור לוואטסאפ עם הודעה": https://captaindigital.co.il/%D7%A7%D7%99%D7%A9%D7%95%D7%A8-%D7%9C%D7%95%D7%95%D7%90%D7%98%D7%A1%D7%90%D7%A4-%D7%A2%D7%9D-%D7%94%D7%95%D7%93%D7%A2%D7%94/ (from the search summary).

---

## Part B: line-by-line audit

Problem tags: jargon, AI tell, cliché, translationese, hyphen, dash, gendered, vague, duplicate, says nothing, honesty, grammar. "Keep" means the line already meets the voice.

### `src/look/data.ts` (hero, service lines, process steps)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 1 | L7-8 H1: העסק שלכם / המומחיות שלנו | translationese ("Your business. Our expertise."), cliché, says nothing, self-praise | See Part C. Recommended: אתר שמביא / פניות לוואטסאפ |
| 2 | L10 sub: בונים לכם אתר שמביא פניות. מדברים ישירות עם המפתח, בלי מתווכים. | duplicate (the second sentence repeats the WhyUs card word for word) | נבנה מאפס בשביל העסק שלכם. אתר בסיסי עולה תוך 2 עד 3 שבועות. |
| 3 | L11 cta: בואו נדבר על הפרויקט שלכם | vague ("פרויקט" is agency talk), long, duplicate of "בואו נדבר" in the header | ספרו לנו על העסק |
| 4 | L12 secondary: לשירותים שלנו | OK, but stacked possessives | מה אנחנו עושים |
| 5 | L17 websites: אתר שנבנה בקוד, נטען מהר ושייך לכם. | AI tell (triad), mild jargon (בקוד) | אתר שנבנה מאפס בשבילכם, ונשאר שלכם. |
| 6 | L18 landing: דף אחד שהופך גולש לפנייה בוואטסאפ. | keep | Keep |
| 7 | L19 seo: שימצאו אתכם בגוגל כשמחפשים את מה שאתם עושים. | duplicate opener ("שימצאו אתכם" is also the WhyUs title) | מי שמחפש בגוגל את מה שאתם עושים, יגיע אליכם. Needs Nati's OK, because it is close to a promise. Softer: עבודה חודשית כדי שמי שמחפש בגוגל את מה שאתם עושים, יגיע אליכם. |
| 8 | L20 chatbots: עונה ללקוחות גם כשאתם בפגישה. | keep | Keep |
| 9 | L21 video: מחומר גלם לסרטון שרואים עד הסוף, וקלטות ישנות לקובץ. | vague ("שרואים עד הסוף" is a claim), mild jargon ("חומר גלם"), two services squeezed into one line | מהצילומים שלכם לסרטון גמור. ומקלטות ישנות לקובץ שנפתח בטלפון. |
| 10 | L22 memory: תמונות מהאלבום שחוזרות לזוז. | keep (the best line on the page after the benchmark) | Keep |
| 11 | L44 hrefLabel: לפרטים על ${title} | keep (aria label) | Keep |
| 12 | L53 step: שיחת היכרות | keep | Keep |
| 13 | L53: מבינים את העסק, היעדים והקהל שלכם | AI tell (triad), cliché ("היעדים והקהל") | מספרים לנו על העסק, ומבינים יחד מה האתר צריך לעשות. |
| 14 | L54 step: תכנון ועיצוב | keep | עיצוב |
| 15 | L54: מתכננים איך האתר ייראה ואיך יהיה נוח לגלוש בו | vague, UX in disguise | מקבלים עיצוב לאישור לפני שמתחילים לבנות. (fact: faqs.ts faq-13 "מעצבים לאישור") |
| 16 | L55 step: פיתוח ובנייה | redundant pair (two synonyms) | בנייה |
| 17 | L55: בונים אתר מהיר ובטוח, מוכן לעבודה | filler pair, vague ("מוכן לעבודה") | בונים, ובודקים יחד אתכם בטלפון ובמחשב. (fact: faq-13 "בודקים יחד") |
| 18 | L56 step: השקה וליווי | vague ("ליווי") | השקה |
| 19 | L56: משיקים, עוקבים אחרי ביצועים ומלווים לאורך זמן | AI tell (triad), jargon ("ביצועים"), honesty (the support is the first month, after that it is a paid package) | האתר עולה לאוויר. בחודש הראשון התמיכה עלינו, ואחר כך יש חבילת תחזוקה למי שרוצה. (fact: faq-5) |

### `src/look/shot/copy.ts`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 20 | L13 speedLine: האתר הזה בטלפון: ציון מהירות ${score}. נמדד בתאריך ${date} | keep. A measured, dated receipt is the best kind of proof. Show it only after the re-measure, as the file already says. | Keep. Optional: ציון המהירות של האתר הזה בטלפון: ${score}. נמדד בתאריך ${date}. |
| 21 | L23 BOT_HINT: נסו את הבוט | keep (it says what happens) | Keep |
| 22 | L26 PHONE_URL: mediawave.co.il | not copy | Keep |

### `src/look/shot/ShotHero.tsx`

Renders `HERO` from data.ts (rows 1 to 4). No other visible Hebrew.

### `src/look/shot/ShotMeet.tsx` (chapter "meet")

| # | Current | Problem | Proposed |
|---|---|---|---|
| 23 | L129 h2: למה לעבוד איתנו? | cliché (every agency site uses it), but people do scan for it. Duplicate source: it is also hard-coded in WhyUs.tsx L40. | Kicker מכירים, then h2: למה לעבוד איתנו? Import the string from one source. |
| 24 | L130: שלושה דברים שמבדילים אותנו | AI tell (announces a triad), cliché, says nothing, duplicate of WhyUs.tsx L41 | Delete the line. If the slot must stay: מה תקבלו, בלי אותיות קטנות. [לבירור: נתי] |

### `src/look/sections/WhyUs.tsx` (copy for the meet chapter)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 25 | L13 title: אתר מהיר שלא נתקע | keep | Keep |
| 26 | L13 line: נטען כמעט מיד ועובד חלק בכל טלפון ומחשב. | vague hedge ("כמעט מיד"), filler ("חלק"). The receipt (SPEED_PROOF) is what makes the claim stand. | נפתח מהר גם בטלפון, גם כשהקליטה חלשה. [לבירור: נתי, only if the 4G measurement backs it]. Otherwise: נפתח מהר בטלפון ובמחשב, בלי לחכות. |
| 27 | L14 title: שימצאו אתכם, גם בחיפושי AI | keep. The hyphen-free form follows Nati's own rule. | Keep |
| 28 | L14 line: היום מחפשים לא רק בגוגל, גם אצל צ'אטבוטים. בונים אתר שיופיע בשני המקומות. | AI tell ("לא רק ... גם"), honesty ("שיופיע" is a guarantee nobody can make, and it contradicts the SEO FAQ) | יש מי שמחפש בגוגל ויש מי ששואל צ'אטבוט. בונים את האתר כך ששניהם יבינו מה אתם עושים. |
| 29 | L15 title: ליווי אישי | keep (Nati's benchmark) | Keep |
| 30 | L15 line: מדברים ישירות עם המפתח, בלי מתווכים. | keep. It is the benchmark, so it stays here and leaves the hero. | Keep (remove it from HERO.sub) |
| 31 | L40-41 h2 and lead | same as rows 23 and 24 | same |

### `src/look/shot/ShotChoose.tsx` (chapter "choose")

| # | Current | Problem | Proposed |
|---|---|---|---|
| 32 | L157 h2: מה אנחנו עושים | keep, but no kicker | Kicker בוחרים, h2: מה אנחנו עושים |
| 33 | L54 link: לפרטים | keep | Keep |
| 34 | L56 link: ראו דוגמה, aria: ראו דוגמה לפרויקט: ${title} | keep. "לפרויקט" in the aria label is fine. | Keep |
| 35 | L163 CTA: מתחילים פרויקט | vague ("פרויקט"). It also clashes with BigWord "מתחילים?" further down. | ספרו לנו מה צריך |
| 36 | Card titles come from services.ts `title`. "קידום אורגני SEO" shows on the home page. | jargon on the home page | See services.ts row 104: קידום בגוגל |
| 37 | Card titles: "צ׳אטבוטים חכמים" | filler ("חכמים"), spelling differs from WhyUs (צ'אטבוטים) | צ'אטבוט לעסק |

### `src/look/shot/ShotBuild.tsx` and `src/look/shot/ShotProcess.tsx` (chapter "build")

| # | Current | Problem | Proposed |
|---|---|---|---|
| 38 | ShotBuild: no visible text (the stage is art, aria-hidden) | OK | No change |
| 39 | ShotProcess L63 h2: איך אנחנו עובדים | keep, but no kicker | Kicker בונים, h2: איך אנחנו עובדים |
| 40 | L64: ארבעה צעדים / מהשיחה ועד ההשקה | keep. It is concrete and true. | Keep. Optional: ארבעה צעדים / מהשיחה הראשונה ועד שהאתר באוויר |
| 41 | L78 kicker: 1 / 4 | not copy | Keep |
| 42 | L87 CTA: דברו איתנו | duplicate (the same label appears five times), and it does not say where the click goes | כתבו לנו (it goes to #contact). Or point it at WhatsApp: כתבו לנו בוואטסאפ |

### `src/look/shot/ShotStart.tsx` with `Faq.tsx`, `BigWord.tsx`, `Contact.tsx` (chapter "start")

| # | Current | Problem | Proposed |
|---|---|---|---|
| 43 | Faq L39 h2: שאלות נפוצות | keep, but no kicker | Kicker שואלים, h2: שאלות נפוצות |
| 44 | Faq L40: כל מה שרציתם לדעת על תהליך בניית האתר | cliché ("כל מה שרציתם לדעת"), inaccurate (the FAQ also covers price, maintenance and logo) | כמה זמן זה לוקח, מה כלול, ומה קורה אחרי ההשקה. That is a triad, so prefer: כמה זמן זה לוקח ומה קורה אחרי ההשקה. |
| 45 | Faq L75: עדיין יש שאלות? | OK | לא מצאתם תשובה? |
| 46 | Faq L76 button: צרו קשר | vague, and one of the many contact labels | שאלו אותנו בוואטסאפ (href: WhatsApp) |
| 47 | BigWord L21: מתחילים? | keep (approved #54) | Keep |
| 48 | Contact L136 h2: דברו איתנו | OK as the heading of the contact chapter, but duplicate | Keep here only. Rename the other "דברו איתנו" labels. |
| 49 | Contact L137: מעוניינים באתר חדש? נשמח לשמוע על הפרויקט שלכם | filler ("נשמח לשמוע"), formal ("מעוניינים"), narrow (only websites, though there are six services) | כתבו כמה מילים על העסק ומה חסר לו. המפתח עצמו קורא ועונה. |
| 50 | Contact L145/150/155/160: טלפון / אימייל / וואטסאפ / אינסטגרם | keep | Keep |
| 51 | Contact L155 WhatsApp row value: דברו איתנו | duplicate, vague | כתבו לנו |
| 52 | Contact L165 (site.ts): אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים | bureaucratic ("מגיבים לפניות"). It also conflicts with "נחזור אליכם היום" in StateButton and "בהקדם" elsewhere. | עונים תוך 24 שעות בימי עסקים. Use this one promise everywhere [לבירור: נתי, which promise is true] |
| 53 | Contact L170-172 labels: שם מלא / אימייל / הודעה | keep | Keep. Optional: מה תרצו לספר לנו? for הודעה |
| 54 | Contact L180 button: שליחת הודעה | keep (an action noun, so gender-free) | Keep |
| 55 | Contact L86 status: פתחנו לכם וואטסאפ עם ההודעה מוכנה, רק ללחוץ על שלח 😊 | emoji, wordy | ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח. |
| 56 | Contact L107 status: ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם | exclamation mark, vague ("בהקדם"), "בהצלחה" is filler | קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים. |
| 57 | Contact L112: משהו השתבש בשליחה. נסו שוב, או דברו איתנו ישירות בוואטסאפ. | OK, slightly long | ההודעה לא נשלחה. נסו שוב, או כתבו לנו ישר בוואטסאפ: |
| 58 | Contact L177 link: לוואטסאפ | keep | Keep |
| 59 | Contact L83 WhatsApp prefill: היי, אני ${name}.\n${message}\n(אימייל לחזרה: ${email}) | keep. It is first person and gender-free. | Keep |

### `src/look/shot/ShotDeliver.tsx` and `Mini.tsx` (chapter "deliver", the finale)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 60 | No text. The section is aria-hidden art; the phone shows only "mediawave.co.il". | says nothing. The page ends on art with no sentence and no action. | Add one line and one CTA under the phone. Kicker: מוסרים. Line: את האתר הזה בנינו כאן, ואת שלכם נבנה באותה דרך. CTA: כתבו לנו בוואטסאפ. The line is true (the site is the studio's own work) and it carries the meta message from CLAUDE.md that the site is the portfolio. |
| 61 | Mini.tsx: no text | OK | No change |

### `src/look/shot/ShotDock.tsx` (the sticky dock)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 62 | L105 visible: דברו איתנו (aria: דברו איתנו בוואטסאפ) | vague (the visible label does not name WhatsApp), duplicate | וואטסאפ, with aria כתבו לנו בוואטסאפ. Or the full label: כתבו לנו בוואטסאפ |

### `src/data/services.ts`: websites (`/services/building-websites`)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 63 | title: בניית אתרים | keep | Keep |
| 64 | shortDescription: כל אתר נבנה במיוחד בשבילכם. מהיר, בטוח, ולגמרי שלכם. | AI tell (triad) | כל אתר נבנה מאפס בשביל העסק שלכם, ונשאר שלכם. |
| 65 | metaTitle: בניית אתרים מקצועית לעסקים | cliché (מקצועית) | בניית אתרים לעסקים קטנים, מאפס ובלי תבנית |
| 66 | metaDescription: בניית אתרים מקצועיים לעסקים קטנים ובינוניים. אתרי תדמית ואתרים מותאמים אישית, בנויים עם React ועם Next.js. עיצוב מודרני, מהירות טעינה גבוהה וקידום SEO מובנה. | jargon (React, Next.js, SEO), cliché (מקצועיים, מותאמים אישית, מודרני), triad | אתר לעסק שנבנה מאפס, בלי תבנית ובלי תלות בפלטפורמה. נפתח מהר בטלפון, גוגל מוצא אותו, ואתר בסיסי מוכן תוך 2 עד 3 שבועות. |
| 67 | heroSubtitle: אתרים שנבנים מאפס בקוד, מהירים, מאובטחים ובלי תלות בפלטפורמה | AI tell (triad), mild jargon | אתר שנבנה מאפס בשבילכם, בלי תבנית ובלי תלות בשום פלטפורמה. |
| 68 | tags (visible): React, Next.js, Tailwind CSS | jargon (it names the stack) | Remove, or use: נבנה מאפס, נפתח מהר |
| 69 | h: למה לבנות אתר בקוד ולא בוורדפרס? | jargon (it names a platform), a "לא X" frame | מה ההבדל בין אתר מתבנית לאתר שנבנה מאפס? |
| 70 | p: אתר שנבנה בקוד מותאם אישית הוא מהיר יותר, מאובטח יותר ונותן חווית משתמש טובה יותר מאתר וורדפרס. אין תוספים שמאטים, אין עדכוני אבטחה שצריך לרדוף אחריהם ואין מגבלות של תבנית. הכל מעוצב בדיוק לפי מה שהעסק שלכם צריך. | AI tell (two triads), jargon (חווית משתמש, וורדפרס), cliché (מותאם אישית, בדיוק לפי מה ש), unverified comparative claims | אתר מתבנית נשען על תוספים שצריך לעדכן, וכל תוסף מוסיף לו משקל. אתר שנבנה מאפס כולל רק את מה שהעסק שלכם צריך. לכן הוא נפתח מהר, ואין בו תוספים לרדוף אחריהם. |
| 71 | h: מה כולל תהליך בניית האתר? | OK | איך זה עובד? |
| 72 | p: מתחילים באפיון של הצרכים שלכם, מי קהל היעד, מה המטרות ומה המסרים. משם ממשיכים לעיצוב, פיתוח, בדיקות ואופטימיזציה. כל אתר מגיע מוכן עם SEO מובנה, תעודת אבטחה SSL, רספונסיביות מלאה וחיבור לגוגל אנליטיקס. | jargon (אפיון, אופטימיזציה, SEO, SSL, רספונסיביות, גוגל אנליטיקס), AI tell (lists, triad) | מתחילים בשיחה על העסק ועל מי שאתם רוצים שיפנה אליכם. אחר כך מקבלים עיצוב לאישור, ואנחנו בונים ובודקים יחד אתכם. כשהאתר עולה, הוא כבר נראה טוב בטלפון וגוגל יודע למצוא אותו. אפשר גם לראות כמה אנשים נכנסו ומאיפה. |
| 73 | h: טכנולוגיות שאנחנו עובדים איתן | jargon (the whole section is the stack) | Replace the section. h: אחרי שהאתר עולה |
| 74 | p: אנחנו עובדים עם React ועם Next.js לביצועים מעולים, עם Tailwind CSS לעיצוב מדויק ועם Framer Motion לאנימציות חלקות. התוצאה היא אתר שנטען מהר, נראה מקצועי ומדורג גבוה בגוגל. | jargon (four stack names), AI tell ("התוצאה היא", triad), cliché (מקצועי), honesty ("מדורג גבוה" is a promise) | מלמדים אתכם לעדכן טקסטים ותמונות לבד. בחודש הראשון התמיכה עלינו, ואחר כך יש חבילות תחזוקה למי שרוצה. (facts: faqs.ts faq-5, faq-6) |
| 75 | f: עיצוב מותאם אישית, לא תבניות | cliché, the "X, לא Y" pattern | עיצוב מאפס, בלי תבנית |
| 76 | f: מהירות טעינה גבוהה | jargon (מהירות טעינה) | נפתח מהר, גם בטלפון |
| 77 | f: רספונסיביות מלאה למובייל, טאבלט ודסקטופ | jargon, triad | נראה טוב בטלפון ובמחשב |
| 78 | f: SEO מובנה מהיום הראשון | jargon | גוגל מוצא אותו מהיום הראשון |
| 79 | f: תעודת אבטחה SSL | jargon | חיבור מאובטח (המנעול שליד הכתובת). That explains a term in parentheses, which is an AI tell, so prefer: חיבור מאובטח לאתר |
| 80 | f: חיבור לגוגל אנליטיקס ולגוגל סרץ' קונסול | jargon | רואים כמה אנשים נכנסו ומאיפה הגיעו |
| 81 | f: תמיכה טכנית לאחר ההשקה | vague, formal (לאחר) | תמיכה בחודש הראשון אחרי ההשקה |
| 82 | q: כמה עולה לבנות אתר? | keep | Keep |
| 83 | a: המחיר תלוי בסוג האתר ובמורכבות שלו. צרו קשר ונתאים הצעת מחיר לפי הצרכים שלכם. | vague, cliché ("לפי הצרכים שלכם") | תלוי בכמה עמודים צריך ומה יש בהם. כתבו לנו מה אתם צריכים, ותקבלו הצעת מחיר. [לבירור: נתי, a "starting from" price would be the strongest line here; never invent one] |
| 84 | q: כמה זמן לוקח לבנות אתר? | keep | Keep |
| 85 | a: אתר בסיסי מוכן תוך 2 עד 3 שבועות. אתרים מורכבים יותר תוך 4 עד 6 שבועות. אם כל החומרים מוכנים אצלכם, אפשר גם מהר יותר. | keep (concrete) | Keep. Optional: אתר גדול יותר instead of אתרים מורכבים יותר |
| 86 | q: האם אני צריך לדעת תכנות כדי לנהל את האתר? | gendered (אני צריך), formal (האם) | צריך לדעת תכנות כדי לעדכן את האתר? |
| 87 | a: ממש לא. אנחנו בונים מערכת ניהול תוכן פשוטה שמאפשרת לכם לעדכן תוכן, תמונות וטקסטים בקלות בלי לגעת בקוד. | jargon (מערכת ניהול תוכן), triad with a redundancy (תוכן and טקסטים), honesty (confirm every client gets an editing screen) | לא. מקבלים מסך עריכה פשוט, ומשנים בו טקסטים ותמונות לבד. [לבירור: נתי, is an editing screen included in every site] |
| 88 | cta: רוצים אתר שעושה רושם? דברו איתנו | vague, duplicate CTA verb | רוצים אתר לעסק? ספרו לנו מה הוא צריך לעשות. |

### `src/data/services.ts`: landing pages (`/services/landing-pages`)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 89 | shortDescription: דף שמביא תוצאות. עיצוב ממוקד המרה, חיבור ישיר לוואטסאפ וטפסים חכמים שעובדים בשבילכם. | vague (תוצאות), jargon (ממוקד המרה), cliché (חכמים, שעובדים בשבילכם), triad | דף אחד שכל מה שיש בו מוביל לכפתור הוואטסאפ. |
| 90 | metaTitle: דפי נחיתה ממירים לעסקים | jargon (ממירים) | דפי נחיתה לעסקים, עם וואטסאפ בלחיצה |
| 91 | metaDescription: עיצוב ופיתוח דפי נחיתה ממירים לעסקים. דף ממוקד המרה עם חיבור לוואטסאפ, טפסי לידים חכמים ועיצוב Mobile-First. יותר פניות, יותר לקוחות. | jargon (ממירים, לידים, Mobile-First), cliché, a hype ending | דף נחיתה לקמפיין או למבצע, שנבנה קודם כל לטלפון ומוביל לפנייה בוואטסאפ. מוכן תוך 5 עד 7 ימי עבודה. |
| 92 | heroSubtitle: דף אחד ממוקד שהופך גולשים ללקוחות, עם טפסים חכמים וחיבור ישיר לוואטסאפ | translationese ("turn visitors into customers"), cliché | דף אחד שמוביל את מי שנכנס ישר לשיחה איתכם בוואטסאפ. |
| 93 | tags (visible): עיצוב ממיר, Mobile-First | jargon | קודם כל לטלפון, וואטסאפ בלחיצה |
| 94 | h: מה זה דף נחיתה ולמה העסק שלכם צריך אחד? | translationese ("why your business needs one") | מה זה דף נחיתה, ומתי הוא שווה? |
| 95 | p: דף נחיתה הוא דף אינטרנט ממוקד עם מטרה אחת ברורה: לגרום לגולש לבצע פעולה. להשאיר פרטים, להתקשר, או לשלוח הודעת וואטסאפ. בניגוד לאתר רגיל, דף נחיתה מסיר הסחות דעת ומוביל את הגולש ישירות לפעולה. | bureaucratic ("לבצע פעולה"), triad, translationese ("מסיר הסחות דעת") | דף נחיתה הוא עמוד אחד עם מטרה אחת: שמי שנכנס יפנה אליכם, בטלפון או בוואטסאפ. אין בו שום דבר שמסיח את הדעת מהפנייה. |
| 96 | h: מה הופך דף נחיתה לממיר? | jargon | מה יש בדף נחיתה טוב? |
| 97 | p: דף נחיתה טוב משלב כותרת חזקה שתופסת את העין, תיאור ברור של היתרונות, ביקורות מלקוחות וכפתור פעולה בולט. אנחנו בונים כל דף כך שכל אלמנט בו עובד לטובת ההמרה, מהצבעים ועד המיקום של כל כפתור. | cliché ("תופסת את העין"), jargon (אלמנט, ההמרה) | כותרת שאומרת מה אתם מציעים, הסבר קצר, מה הלקוחות שלכם אמרו, וכפתור אחד בולט. כל השאר יורד מהדף. |
| 98 | h: דפי נחיתה לקמפיינים | keep | Keep |
| 99 | p: מריצים קמפיינים בגוגל או בפייסבוק? דף נחיתה ייעודי יכול לשפר משמעותית את אחוזי ההמרה. אנחנו בונים דפים שמותאמים בדיוק למסר של הקמפיין, עם מעקב המרות מובנה כדי שתדעו בדיוק מה עובד. | jargon (אחוזי ההמרה, מעקב המרות), an unmeasured claim (משמעותית), cliché (מותאמים בדיוק) | מפרסמים בגוגל או בפייסבוק? כשהמודעה מובילה לדף שמדבר בדיוק על מה שהיא הבטיחה, קל יותר לפנות. ובדף יש מעקב, כך שרואים כמה פניות הגיעו מכל מודעה. |
| 100 | f: עיצוב ממוקד המרה / חיבור ישיר לוואטסאפ בלחיצה אחת / טפסי לידים חכמים / מותאם למובייל (Mobile-First) / מהירות טעינה מקסימלית / מעקב המרות מובנה | jargon (המרה, לידים, Mobile-First, explained in parentheses), unmeasured superlative (מקסימלית) | כל הדף מוביל לפנייה / וואטסאפ בלחיצה אחת / טופס קצר להשארת פרטים / נבנה קודם כל לטלפון / נפתח מהר / רואים כמה פניות הגיעו מכל מודעה |
| 101 | q: מה ההבדל בין דף נחיתה לאתר? a: אתר כולל מספר דפים ומידע מגוון. דף נחיתה הוא דף בודד עם מטרה אחת ברורה, בדרך כלל לקמפיינים, השקות ומבצעים. | formal (מספר דפים, מידע מגוון), triad | a: באתר יש כמה עמודים על כל העסק. דף נחיתה הוא עמוד אחד עם מטרה אחת, בדרך כלל לקמפיין או למבצע. |
| 102 | q: כמה זמן לוקח לבנות דף נחיתה? a: דף נחיתה סטנדרטי מוכן תוך 5 עד 7 ימי עבודה. דפים מורכבים עם אנימציות מיוחדות עד שבועיים. | mild jargon (אנימציות) | a: דף רגיל מוכן תוך 5 עד 7 ימי עבודה. דף עם תנועה מיוחדת, עד שבועיים. |
| 103 | q: האם אפשר לשנות את התוכן בעצמי? a: כן. אנחנו מספקים מערכת ניהול פשוטה שבה אתם יכולים לעדכן טקסטים, תמונות ופרטי קשר בקלות. | formal (האם, מספקים), jargon (מערכת ניהול), triad, honesty slot | q: אפשר לשנות את הטקסטים לבד? a: כן. מקבלים מסך עריכה פשוט לטקסטים ולתמונות. [לבירור: נתי] |
| 103a | cta: רוצים דף נחיתה שממיר? בואו נדבר | jargon, duplicate CTA verb | יש לכם קמפיין בדרך? ספרו לנו עליו. |

### `src/data/services.ts`: SEO (`/services/seo-promotion`)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 104 | title: קידום אורגני SEO | jargon twice over. It shows on the home page card. | קידום בגוגל |
| 105 | shortDescription: קידום שבאמת מביא אנשים. תוכן שגוגל אוהב ואתר בנוי נכון שמטפס בתוצאות. | filler (שבאמת), cliché ("תוכן שגוגל אוהב") | עבודה חודשית כדי שמי שמחפש בגוגל את מה שאתם עושים, ימצא אתכם. |
| 106 | metaTitle: קידום אורגני SEO לעסקים | jargon | קידום אתרים בגוגל לעסקים קטנים |
| 107 | metaDescription: קידום אורגני (SEO) לעסקים. מחקר מילות מפתח, אופטימיזציה טכנית, בניית תוכן ממוקד וקידום בגוגל. תוצאות מדידות ודיווחים שקופים. | jargon (explained in parentheses), list, cliché (שקופים) | בודקים מה הלקוחות שלכם מחפשים בגוגל, כותבים תוכן שעונה על זה ומסדרים את האתר מבפנים. דוח כל חודש, בלי הבטחות למקום ראשון. |
| 108 | heroSubtitle: מחקר מילות מפתח, תוכן ממוקד ומבנה טכני שמביאים אתכם לעמוד הראשון בגוגל | honesty (promises page one, contradicting the FAQ), triad, jargon | בודקים מה הלקוחות שלכם מחפשים בגוגל, ובונים את האתר כך שיענה להם. |
| 109 | tags (visible): Google, תוכן ממוקד | Latin "Google" next to Hebrew, vague | גוגל, דוח חודשי |
| 110 | h: למה קידום אורגני חשוב לעסק שלכם? | jargon | קידום שממשיך לעבוד |
| 111 | p: קידום אורגני הוא ההשקעה הכי משתלמת בשיווק דיגיטלי. בניגוד לפרסום ממומן שעוצר ברגע שמפסיקים לשלם, קידום אורגני ממשיך להביא תנועה לאתר חודשים ושנים קדימה. מי שמופיע בעמוד הראשון של גוגל מקבל את רוב הלקוחות. | unmeasured superlative (הכי משתלמת), jargon (שיווק דיגיטלי, תנועה), unverified claim (רוב הלקוחות) | מודעה עובדת כל עוד משלמים עליה. עמוד שמופיע בגוגל בזכות התוכן שלו ממשיך להביא אנשים גם חודשים אחרי שנכתב. |
| 112 | h: מה כולל שירות הקידום שלנו? | OK | מה עושים בפועל? |
| 113 | p: מתחילים במחקר מילות מפתח כדי להבין מה הלקוחות שלכם מחפשים. אחר כך בונים אסטרטגיית תוכן, מבצעים אופטימיזציה טכנית לאתר ויוצרים תוכן איכותי שגוגל אוהב ושאנשים רוצים לקרוא. | jargon (מחקר מילות מפתח, אסטרטגיית תוכן, אופטימיזציה טכנית), cliché (איכותי, שגוגל אוהב), triad | קודם בודקים אילו מילים הלקוחות שלכם מקלידים בגוגל. אחר כך מסדרים את האתר כך שגוגל יבין אותו, וכותבים עמודים שעונים בדיוק על מה שמחפשים. |
| 114 | h: SEO טכני, הבסיס לקידום מוצלח | jargon, cliché | מה שגוגל רואה והגולש לא |
| 115 | p: מבנה אתר נכון, מהירות טעינה, Structured Data, כותרות מותאמות ומפת אתר (sitemap). כל אלו מרכיבים טכניים שגוגל נותן להם משקל. אנחנו מוודאים שהאתר שלכם עומד בכל הסטנדרטים כדי לקבל דירוג מקסימלי. | jargon (Structured Data, sitemap explained in parentheses), unmeasured superlative (דירוג מקסימלי), honesty | יש דברים שהגולש לא רואה וגוגל כן, כמו כמה מהר העמוד נפתח ואיך הוא בנוי. מסדרים אותם כדי שגוגל יבין מה אתם עושים ואיפה. |
| 116 | f: מחקר מילות מפתח מעמיק | jargon, filler (מעמיק) | בודקים מה מחפשים בתחום שלכם |
| 117 | f: אופטימיזציה טכנית לאתר | jargon | מסדרים את האתר מבפנים |
| 118 | f: כתיבת תוכן ממוקד מילות מפתח | jargon | כותבים עמודים שעונים על מה שמחפשים |
| 119 | f: בניית Structured Data | jargon | מסמנים לגוגל את פרטי העסק |
| 120 | f: שיפור מהירות טעינה | jargon | האתר נפתח מהר יותר |
| 121 | f: דיווחים חודשיים עם נתונים מדידים | redundant (מדידים) | דוח כל חודש: כמה נכנסו ומאיפה |
| 122 | f: קידום בפרופיל העסק בגוגל | OK, slightly technical | הכרטיס של העסק בגוגל ובמפות |
| 123 | q: כמה זמן לוקח לראות תוצאות? a: קידום אורגני הוא תהליך ארוך טווח. בדרך כלל רואים תוצאות ראשוניות תוך 2 עד 3 חודשים, ותוצאות משמעותיות תוך 4 עד 6 חודשים. | jargon (קידום אורגני), formal | a: זה לוקח זמן. שינוי ראשון רואים בדרך כלל אחרי 2 עד 3 חודשים, ושינוי גדול אחרי 4 עד 6. |
| 124 | q: האם אתם מבטיחים מקום ראשון בגוגל? | formal (האם) | מבטיחים מקום ראשון בגוגל? |
| 125 | a: אף אחד לא יכול להבטיח מקום ראשון. מה שאנחנו כן מבטיחים זה עבודה מקצועית, שקיפות מלאה ושיפור מדיד בדירוגים. | AI tell (triad), cliché (מקצועית, שקיפות מלאה), honesty ("שיפור מדיד" is itself a promise) | לא. מי שמבטיח מקום ראשון לא אומר לכם את האמת. מה שכן: עבודה כל חודש, ודוח שמראה מה השתנה. |
| 126 | q: מה ההבדל בין SEO לפרסום ממומן? a: פרסום ממומן נותן תוצאות מיידיות אבל עוצר ברגע שמפסיקים לשלם. SEO לוקח יותר זמן אבל נותן תנועה חינמית ומתמשכת. הכי טוב לשלב את שניהם. | jargon (SEO, תנועה) | q: מה ההבדל בין קידום למודעות ממומנות? a: מודעה מביאה אנשים מהיום הראשון, ונעצרת כשמפסיקים לשלם. קידום לוקח זמן, אבל ממשיך לעבוד. הכי טוב לשלב. |
| 127 | cta: רוצים להופיע ראשונים בגוגל? דברו איתנו | honesty (contradicts the FAQ in row 125) | רוצים שימצאו אתכם בגוגל? ספרו לנו מה העסק עושה ואיפה. [לבירור: נתי, if a free first check is offered, say so here] |

### `src/data/services.ts`: chatbots (`/services/chatbots`)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 128 | title: צ׳אטבוטים חכמים | filler (חכמים), spelling (׳ here, ' in WhyUs) | צ'אטבוט לעסק |
| 129 | shortDescription: בוטים שמדברים עם הלקוחות שלכם 24 שעות ביממה. שירות לקוחות, איסוף פניות ותמיכה בלי להוסיף כוח אדם. | triad | בוט שעונה ללקוחות שלכם גם בלילה, ומעביר אליכם את מה שצריך אדם. |
| 130 | metaTitle: צ׳אטבוטים חכמים לעסקים | filler | צ'אטבוט לעסק שעונה ללקוחות גם בלילה |
| 131 | metaDescription: פיתוח צ׳אטבוטים חכמים מבוססי בינה מלאכותית לעסקים. שירות לקוחות אוטומטי 24/7, איסוף לידים ומענה על שאלות נפוצות. | jargon (24/7, לידים, מבוססי), triad | בוט שעונה ללקוחות באתר ובוואטסאפ בכל שעה, ואוסף פרטים של מי שמתעניין. בוט בסיסי מוכן תוך שבוע. |
| 132 | heroSubtitle: בוטים חכמים שעובדים 24/7 בשבילכם, שירות לקוחות, לידים ותמיכה בלי הפסקה | jargon (24/7, לידים), cliché, triad | בוט שעונה ללקוחות גם כשאתם בפגישה, וגם באחת עשרה בלילה. |
| 133 | h: למה העסק שלכם צריך צ׳אטבוט? | OK, slightly pushy | מה הבוט עושה? |
| 134 | p: לקוחות מצפים לתשובות מיידיות, גם בשעה 11 בלילה. צ׳אטבוט חכם נותן מענה אוטומטי על שאלות נפוצות, אוסף פרטים מלקוחות מתעניינים ומפנה פניות מורכבות אליכם ישירות. הכל בלי לגייס עובדים נוספים. | triad, bureaucratic (נותן מענה) | לקוח שואל באחת עשרה בלילה שאלה שכבר ענית עליה עשרות פעמים, ומקבל תשובה מיד. מי שמתעניין משאיר פרטים, ושאלה מסובכת מגיעה אליכם בבוקר. ("ענית" is spelled the same for both genders) |
| 135 | h: צ׳אטבוט מבוסס בינה מלאכותית | jargon label | מבין שאלות במילים של הלקוח |
| 136 | p: הבוטים שלנו לא מוגבלים לתפריטים קבועים. הם מבינים שפה טבעית, מזהים כוונות ונותנים תשובות מותאמות. ככל שעובר זמן הם משתפרים והשירות נהיה יותר מדויק. | jargon (שפה טבעית, מזהים כוונות), triad, honesty (does it improve by itself?) | אין תפריט של "הקישו 1". הלקוח כותב כמו שהוא מדבר, והבוט מבין. [לבירור: נתי, does the bot improve by itself, or because answers get updated? Write only what is true.] |
| 137 | h: איפה אפשר לשלב צ׳אטבוט? | OK | איפה הבוט עונה? |
| 138 | p: באתר שלכם, בוואטסאפ, בפייסבוק מסנג׳ר ובאינסטגרם. אנחנו מתאימים את הבוט לפלטפורמה שהלקוחות שלכם הכי משתמשים בה. | jargon (פלטפורמה) | באתר, בוואטסאפ, במסנג'ר ובאינסטגרם. שמים אותו איפה שהלקוחות שלכם כבר כותבים לכם. |
| 139 | f: מענה אוטומטי 24/7 / הבנת שפה טבעית / איסוף לידים אוטומטי / חיבור לוואטסאפ ופייסבוק / ממשק ניהול פשוט / דוחות ביצועים / התאמה אישית למותג שלכם | jargon (24/7, לידים, ממשק ניהול, דוחות ביצועים), cliché (התאמה אישית) | עונה בכל שעה / מבין שאלות במילים רגילות / אוסף פרטים של מי שמתעניין / חיבור לוואטסאפ ולפייסבוק / מסך פשוט לעדכון התשובות / רואים על מה שואלים הכי הרבה / מדבר בשפה של העסק שלכם |
| 140 | q: האם הבוט יחליף את שירות הלקוחות? a: הבוט משלים, לא מחליף. הוא מטפל ברוב הפניות הפשוטות ומפנה את המורכבות אליכם. ככה אתם מתפנים לטפל במה שבאמת דורש מגע אנושי. | AI tell ("X, לא Y"), filler (שבאמת), cliché (מגע אנושי) | q: הבוט יחליף את מי שעונה ללקוחות? a: לא. הוא עונה על השאלות הפשוטות ומעביר אליכם את המסובכות, כך שנשאר לכם זמן ללקוחות שצריכים אתכם. |
| 141 | q: כמה זמן לוקח להקים צ׳אטבוט? a: בוט בסיסי מוכן תוך שבוע. בוט מתקדם עם חיבורים למערכות תוך 2 עד 3 שבועות. | vague (חיבורים למערכות) | a: בוט בסיסי מוכן תוך שבוע. בוט שמתחבר גם למערכות שאתם כבר עובדים איתן, תוך 2 עד 3 שבועות. |
| 142 | q: אפשר לעדכן את התשובות של הבוט? a: כן. יש ממשק ניהול פשוט שבו אתם יכולים לעדכן תשובות, להוסיף שאלות חדשות ולראות סטטיסטיקות. | jargon (ממשק ניהול, סטטיסטיקות), triad | a: כן, במסך פשוט. שם גם רואים על מה הלקוחות שואלים הכי הרבה. |
| 143 | cta: רוצים בוט שעובד בשבילכם? בואו נדבר | cliché, duplicate CTA verb | נסו את הבוט באתר הזה, ואז נדבר על שלכם. (fact: the site has a working bot, BOT_HINT) |

### `src/data/services.ts`: video editing and tape conversion (`/services/video-editing`)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 144 | title: עריכת וידאו | hides half the service (tape conversion) | עריכת וידאו והמרת קלטות [לבירור: נתי, the card width at 390] |
| 145 | shortDescription: עריכה מקצועית של סרטונים והמרת קלטות וידאו ומדיה ישנה לפורמט דיגיטלי. | cliché (מקצועית), jargon (מדיה, פורמט דיגיטלי) | עורכים את הצילומים שלכם לסרטון גמור, וממירים קלטות ישנות לקבצים שנפתחים בטלפון. |
| 146 | metaTitle: עריכת וידאו מקצועית \| המרת קלטות לדיגיטל | cliché (מקצועית). "המרת קלטות לדיגיטל" stays because people search for exactly that. | עריכת וידאו \| המרת קלטות VHS לדיגיטל |
| 147 | metaDescription: עריכת וידאו מקצועית והמרת קלטות VHS ומדיה ישנה לפורמט דיגיטלי. שימור זיכרונות ועריכת חומרי גלם לסרטונים מוכנים. | cliché, jargon | המרת קלטות VHS או MiniDV לקבצים שרואים בכל מכשיר, ועריכת הצילומים שלכם לסרטון גמור עם כתוביות. |
| 148 | heroSubtitle: עריכה מקצועית של סרטונים והמרת קלטות ומדיה ישנה לפורמט דיגיטלי | duplicate of shortDescription, cliché, jargon | מהצילומים שלכם לסרטון גמור, ומהקלטות בארון לקובץ בטלפון. |
| 149 | h: עריכת וידאו מקצועית | cliché | עריכה |
| 150 | p: יש לכם חומרי גלם ואתם צריכים סרטון מוכן? אנחנו לוקחים את החומר שלכם ועורכים אותו לסרטון מלוטש עם מעברים, אפקטים וכתוביות. מתאים לסרטונים אישיים, אירועים וכל פרויקט שדורש עריכה מקצועית. | two triads, cliché (מלוטש, מקצועית), jargon (חומרי גלם) | שולחים לנו את מה שצילמתם, בטלפון או במצלמה, ומקבלים סרטון גמור עם מעברים וכתוביות. מתאים לאירוע או לסרטון משפחתי. |
| 151 | h: המרת קלטות ומדיה ישנה | jargon (מדיה) | המרת קלטות |
| 152 | p: יש לכם קלטות VHS, קלטות MiniDV או מדיה ישנה? אנחנו ממירים אותם לפורמט דיגיטלי באיכות גבוהה כדי שהזיכרונות שלכם ישמרו לנצח ותוכלו לצפות בהם בכל מכשיר. | grammar (קלטות is feminine, so אותן, not אותם), overclaim (לנצח), jargon, filler (באיכות גבוהה) | קלטות VHS או MiniDV שוכבות בארון? ממירים אותן לקובץ וידאו שנפתח בכל מכשיר. |
| 153 | f: עריכה מקצועית עם אפקטים ומעברים / המרת קלטות VHS לדיגיטל / הוספת כתוביות / פורמט מותאם לכל מכשיר | cliché, jargon (פורמט) | עריכה עם מעברים ואפקטים / המרת קלטות VHS לקובץ / כתוביות / קובץ שנפתח בכל מכשיר |
| 154 | q: באיזה פורמט אקבל את הסרטון? a: אנחנו מספקים את הסרטון בפורמט MP4 שמתאים לכל מכשיר. אם צריך פורמט אחר, אין בעיה. | jargon (פורמט), bureaucratic (מספקים) | q: באיזה קובץ אקבל את הסרטון? a: בקובץ MP4, שנפתח בכל טלפון ומחשב. צריך משהו אחר? אין בעיה. |
| 155 | q: כמה סבבי תיקונים כלולים? a: כל פרויקט כולל 2 עד 3 סבבי תיקונים. אנחנו עובדים בשיתוף פעולה מלא עד שאתם מרוצים מהתוצאה. | cliché (בשיתוף פעולה מלא), internal contradiction (limited rounds versus "until you are happy") | a: 2 עד 3 סבבי תיקונים כלולים. [לבירור: נתי, what happens after the last round] |
| 156 | cta: צריכים עריכת וידאו? דברו איתנו | duplicate CTA verb, and it leaves out tapes | יש לכם צילומים או קלטות שמחכים? ספרו לנו מה יש. |

### `src/data/services.ts`: memory videos (`/services/memory-videos`)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 157 | shortDescription: לוקחים תמונות ישנות מהאלבום המשפחתי ומנפישים אותן לסרטון מרגש עם מעברים חלקים בין התמונות. מתנה מושלמת לימי הולדת ואירועים. | cliché (מרגש, חלקים, מתנה מושלמת) | תמונות מהאלבום המשפחתי זזות שוב, עם מוזיקה, בסרטון אחד. מתנה ליום הולדת או לאירוע משפחתי. |
| 158 | metaTitle: סרטוני זיכרונות מתמונות \| הנפשת תמונות AI | OK ("הנפשת תמונות" is what people search for) | סרטוני זיכרונות מתמונות \| הנפשת תמונות ישנות |
| 159 | metaDescription: הנפשת תמונות ישנות לסרטוני וידאו מרגשים באמצעות בינה מלאכותית. מתנה מושלמת לימי הולדת, חתונות ואירועים משפחתיים. | cliché (מרגשים, מושלמת), triad | שולחים 15 עד 30 תמונות מהאלבום, ומקבלים סרטון של 2 עד 3 דקות שבו הן זזות שוב, עם מוזיקה. מוכן תוך 5 עד 7 ימי עבודה. |
| 160 | heroSubtitle: תמונות ישנות שחוזרות לחיים, סרטוני זיכרונות מרגשים לכל אירוע | cliché (חוזרות לחיים, מרגשים) | תמונות מהאלבום שחוזרות לזוז, בסרטון אחד עם מוזיקה. |
| 161 | h: איך זה עובד? | keep | Keep |
| 162 | p: אתם שולחים לנו תמונות מהאלבום המשפחתי, ישנות או חדשות, ואנחנו מנפישים אותן באמצעות בינה מלאכותית. התוצאה היא סרטון מרגש שבו התמונות חוזרות לחיים עם תנועה טבעית, מוזיקה מותאמת ומעברים חלקים. | AI tell ("התוצאה היא", triad), cliché | שולחים לנו תמונות, גם סרוקות מאלבום ישן. כל תמונה מקבלת תנועה, ואנחנו מחברים את כולן לסרטון אחד עם מוזיקה. |
| 163 | h: מתנה שלא שוכחים | mild cliché | Keep, or: מתנה לאירוע |
| 164 | p: סרטון זיכרונות הוא המתנה המושלמת לימי הולדת עגולים, חתונות, אירועי פרישה או כל אירוע מיוחד. תארו לעצמכם את ההפתעה כשהמשפחה רואה תמונות ישנות חוזרות לחיים על המסך. | cliché (המתנה המושלמת), translationese ("תארו לעצמכם" for "Imagine") | ליום הולדת עגול, לחתונה או לפרישה. בסרטון שהכנו ליום הולדת 60, התמונות עברו מהילדות ועד היום, והסרטון הוקרן בערב האירוע. (fact: portfolio-examples.ts) |
| 165 | h: הנפשה בבינה מלאכותית | OK | Keep |
| 166 | p: אנחנו משתמשים בבינה מלאכותית שיודעת להנפיש פנים, להוסיף תנועות טבעיות ולשפר תמונות ישנות. גם תמונה ישנה מלפני שנים יכולה להפוך לקטע וידאו מרגש ומלא חיים. | triad, redundancy (ישנה מלפני שנים), filler pair (מרגש ומלא חיים) | הבינה המלאכותית מוסיפה תנועה לפנים ומשפרת תמונות ישנות. גם תמונה סרוקה ודהויה יכולה לזוז. |
| 167 | f: הנפשת תמונות בבינה מלאכותית / שיפור איכות תמונות ישנות / מוזיקה מותאמת אישית / מעברים חלקים וסינמטיים / פורמט מותאם להקרנה באירועים / אפשרות להוספת טקסט וכתוביות | cliché (מותאמת אישית, סינמטיים), jargon (פורמט) | Keep the first two / מוזיקה שמתאימה לסרטון / מעברים רכים בין התמונות / קובץ שמוכן להקרנה באירוע / אפשר להוסיף כיתוב לכל תקופה |
| 168 | q: כמה תמונות צריך לסרטון? a: מומלץ 15 עד 30 ... | keep | Keep |
| 169 | q: באיזה איכות צריך לשלוח את התמונות? | grammar (איכות is feminine, so באיזו) | באיזו איכות צריך לשלוח את התמונות? |
| 170 | a: כל איכות מתאימה. גם תמונות סרוקות מאלבום ישן. אנחנו משפרים את האיכות בתהליך ההנפשה. | OK, a little formal | כל איכות מתאימה, גם תמונות סרוקות מאלבום ישן. את האיכות משפרים תוך כדי. |
| 171 | q: כמה זמן לוקח להכין סרטון? a: סרטון רגיל מוכן תוך 5 עד 7 ימי עבודה... | keep | Keep |
| 172 | cta: רוצים להנפיש זיכרונות? שלחו לנו תמונות | odd metaphor (animating memories) | יש לכם אלבום? שלחו לנו כמה תמונות בוואטסאפ. |

### `src/data/faqs.ts` (home FAQ and its JSON-LD)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 173 | q1: מה כולל חבילת הפיתוח הבסיסית? | jargon (חבילת הפיתוח), grammar (חבילה is feminine, so כוללת) | מה כולל אתר בסיסי? |
| 174 | a1: עד 5 עמודים, אתר שנראה מצוין בטלפון ובמחשב, כפתור וואטסאפ וטופס יצירת קשר. מוכן תוך 2 עד 3 שבועות. | OK, but "אתר שנראה מצוין" sits oddly inside the list | עד 5 עמודים שנראים טוב בטלפון ובמחשב, כפתור וואטסאפ וטופס פנייה. מוכן תוך 2 עד 3 שבועות. |
| 175 | q2: האם תומכים בתחזוקה שוטפת? | formal (האם), odd collocation | יש תחזוקה אחרי ההשקה? |
| 176 | a2: כן. יש חבילות חודשיות עם עדכונים, גיבויים ותמיכה, ואפשר להתאים חבילה בדיוק לפי מה שצריך. | triad, cliché (בדיוק לפי מה שצריך) | כן. יש חבילה חודשית עם עדכונים וגיבויים, ומישהו לפנות אליו כשמשהו צריך תיקון. |
| 177 | q3/a3: כמה זמן לוקח לבנות אתר? / אתר בסיסי בערך 2 עד 3 שבועות... | keep. It duplicates the websites FAQ on another route, which is fine. | Keep |
| 178 | q4: האם האתר יהיה ידידותי למובייל? | translationese ("mobile-friendly"), jargon (מובייל), formal | האתר ייראה טוב בטלפון? |
| 179 | a4: בטוח. כל אתר שאנחנו בונים נראה ועובד מצוין בטלפון, בטאבלט ובמחשב. | triad | כן. כל אתר נבדק בטלפון ובמחשב לפני שהוא עולה. |
| 180 | q5: מה קורה אחרי השקת האתר? | OK | מה קורה אחרי שהאתר עולה? |
| 181 | a5: מלמדים אתכם לנהל את האתר, נותנים תמיכה בחודש הראשון, ואם בא לכם המשך ליווי יש חבילות תחזוקה. | keep ("בא לכם" is good dugri). A light triad, acceptable here. | Keep |
| 182 | q6: האם אוכל לעדכן תכנים בעצמי? | formal (האם) | אפשר לעדכן את האתר לבד? |
| 183 | a6: כן. מקבלים מערכת פשוטה שבה אפשר לעדכן טקסטים ותמונות לבד, בלי שום ידע טכני. | keep (honesty slot as in row 87) | Keep [לבירור: נתי] |
| 184 | q7: האם אפשר לשלב חנות מקוונת? | formal (האם, מקוונת) | אפשר להוסיף חנות לאתר? |
| 185 | a7: בהחלט. אפשר לחבר חנות מלאה עם תשלום מאובטח, כחלק מהאתר. | keep | Keep |
| 186 | q8/a8: מה כלול במחיר? / עיצוב, בנייה, שנה של אחסון ודומיין, אבטחה, הופעה בגוגל והדרכה. הכל בפנים. | keep ("הכל בפנים" is good). A factual list of six items is fine. | Keep |
| 187 | q9: האם אני צריך לספק תכנים ותמונות? | gendered (אני צריך), formal (לספק, האם) | צריך להביא טקסטים ותמונות? |
| 188 | a9: אפשר לעבוד עם החומרים שלכם, ואם אין, נעזור בכתיבת התוכן ובבחירת תמונות איכותיות. | filler (איכותיות) | אם יש לכם, עובדים איתם. אם אין, עוזרים לכתוב ולבחור תמונות. |
| 189 | q10/a10: האם האתר יופיע בגוגל? / כן. כל אתר נבנה כך שגוגל מוצא אותו ומציג אותו... | formal (האם). The answer is good. | האתר יופיע בגוגל? (keep the answer) |
| 190 | q11: מה ההבדל בין תבנית מוכנה לעיצוב מותאם אישית? | cliché (מותאם אישית) | תבנית מוכנה או עיצוב מאפס? |
| 191 | a11: תבנית מוכנה זולה ומהירה. עיצוב מותאם נבנה במיוחד בשבילכם ונראה כמו העסק שלכם ולא כמו כולם. שתי הדרכים נראות מצוין בכל מסך. | "X ולא כמו Y" pattern, filler | תבנית זולה ומהירה יותר. עיצוב מאפס נבנה סביב העסק שלכם, ואף אתר אחר לא ייראה כמוהו. שתי הדרכים עובדות טוב בטלפון. |
| 192 | q12: האם אתם מציעים שירותי לוגו ומיתוג? | formal, bureaucratic (שירותי) | עושים גם לוגו? |
| 193 | a12: כן. חוץ מאתרים אנחנו מעצבים לוגו, צבעים וזהות מותג שלמה, ואפשר לשלב הכל יחד עם האתר. | jargon (זהות מותג), triad, honesty (logo is not one of the six services) | כן. לוגו וצבעים לעסק, ואפשר יחד עם האתר. [לבירור: נתי, is logo work still offered?] |
| 194 | q13: מה התהליך מהפגישה הראשונה ועד השקת האתר? | inconsistent ("פגישה" here, "שיחת היכרות" in the steps) | איך זה עובד, מהשיחה הראשונה ועד שהאתר באוויר? |
| 195 | a13: נפגשים ומבינים מה צריך, שולחים הצעת מחיר, מעצבים לאישור, בונים, בודקים יחד ומשיקים. לאורך כל הדרך אתם בקשר איתנו. | filler (לאורך כל הדרך) | מדברים ומבינים מה צריך, שולחים הצעת מחיר, מעצבים לאישור, בונים, בודקים יחד ומשיקים. כל הדרך מדברים עם אותו אדם. |

### `src/data/portfolio-examples.ts`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 196 | subtitle: חלק מסרטון שהפקנו לכבוד יום הולדת 60 הכולל זיכרונות מהילדות עד היום | bureaucratic (הכולל, לכבוד) | קטע מסרטון שהכנו ליום הולדת 60: מהילדות ועד היום. |
| 197 | description: לקחנו תמונות ישנות מאלבומים מגוונים ומיינו אותן לפי תקופות שונות בחיים [em dash] ילדות, נעורים, חתונה ואימהות. כל תמונה עברה הנפשה בבינה מלאכותית, הוספנו מוזיקה מתאימה וכיתובים קצרים לכל שלב. בערב האירוע הוקרן הסרטון ויצר רגע שכולם יזכרו. | dash (an em dash in the live copy), cliché ("רגע שכולם יזכרו", which is also unverifiable), passive (עברה הנפשה, הוקרן) | אספנו תמונות מכמה אלבומים וסידרנו אותן לפי תקופות: ילדות, נעורים, חתונה ואימהות. הנפשנו כל תמונה, הוספנו מוזיקה וכיתוב קצר לכל תקופה. בערב האירוע הסרטון הוקרן לכל המשפחה. |
| 198 | tags: הנפשת AI / מוזיקה מותאמת / כתוביות אישיות / אירוע משפחתי | OK | Keep |
| 199 | metaTitle / metaDescription | OK | Keep. Optional: drop "שהונפשו" (passive) |

### `src/data/site.ts`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 200 | responseTime: אנחנו מגיבים לפניות תוך 24 שעות בימי עסקים | bureaucratic, and it conflicts with other promises (see row 52) | עונים תוך 24 שעות בימי עסקים. |

### `src/components/layout/Footer.tsx`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 201 | L59: עיצוב ופיתוח אתרים מקצועיים לעסקים | cliché (מקצועיים), jargon (פיתוח), narrow (websites only) | אתרים וסרטונים לעסקים קטנים, ישר מהמפתח. |
| 202 | L64 h2: קישורים מהירים | generic but standard | Keep, or: באתר |
| 203 | L77 h2: יצירת קשר | keep (an action noun) | Keep |
| 204 | L86 / L96: וואטסאפ / אינסטגרם | keep | Keep |
| 205 | L109-111: תקנון שימוש / מדיניות פרטיות / הצהרת נגישות | legal labels, keep | Keep |
| 206 | aria: MediaWave, חזרה לדף הבית / ניווט בתחתית העמוד / מסמכים | keep | Keep |

### `src/components/layout/Header.tsx`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 207 | L157 / L248 button: בואו נדבר | duplicate CTA phrase, does not say where the click goes | כתבו לנו (if it scrolls to #contact). If it opens WhatsApp: וואטסאפ |
| 208 | L165 aria: פתח תפריט נגישות | gendered (masculine singular imperative) | תפריט נגישות |
| 209 | L183 aria: פתח תפריט | gendered | פתיחת התפריט |
| 210 | L214 aria: סגור תפריט | gendered | סגירת התפריט (matches the LeadModal "סגירת החלון") |
| 211 | L257 menu: וואטסאפ | keep | Keep |
| 212 | aria: ניווט ראשי / תפריט ניווט / תפריט נייד | keep | Keep |

### `src/config/navigation.ts`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 213 | צור קשר | gendered (masculine singular imperative) | יצירת קשר (the same as the footer heading) |
| 214 | דף הבית / למה לעבוד איתנו / שירותים / איך אנחנו עובדים / שאלות נפוצות | keep (they mirror the chapter heads) | Keep |

### `src/components/pages/NotFound.tsx`

| # | Current | Problem | Proposed |
|---|---|---|---|
| 215 | SEO title: העמוד לא נמצא (404) | keep | Keep |
| 216 | SEO description: העמוד שחיפשתם לא קיים או שהוסר. חזרו לדף הבית של MediaWave Israel. | passive (הוסר) | העמוד שחיפשתם לא קיים, או שהכתובת השתנתה. מכאן חוזרים לדף הבית. |
| 217 | h2: הדף הזה נסחף עם הגל | keep. A brand pun, and short. "דף" here but "עמוד" in the line below: pick one. | העמוד הזה נסחף עם הגל |
| 218 | p: העמוד שחיפשתם לא קיים, או שהכתובת השתנתה. בואו נחזיר אתכם למסלול. | translationese ("back on track") | העמוד שחיפשתם לא קיים, או שהכתובת השתנתה. |
| 219 | CTA: חזרה לדף הבית | keep | Keep |
| 220 | links: השירותים שלנו / יצירת קשר | OK | מה אנחנו עושים / יצירת קשר |
| 221 | צריכים עזרה? התקשרו אלינו: | keep (it says what to do) | Keep |

### `src/components/LeadModal.tsx` (the popup)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 222 | L250 title: השאירו פרטים ונחזור אליכם לשיחת ייעוץ ללא עלות! | cliché ("שיחת ייעוץ ללא עלות" is the stock agency popup line), exclamation mark | רוצים שנחזור אליכם? השאירו שם וטלפון. השיחה לא עולה כסף. |
| 223 | L260-261 labels: שם מלא / טלפון | keep | Keep |
| 224 | L276 consent: אני מאשר/ת שקראתי ואישרתי את תנאי מדיניות הפרטיות של האתר. | gendered (slash), redundant (מאשר plus אישרתי) | קראתי את מדיניות הפרטיות והסכמתי לה. [לבירור: נתי, if a lawyer requires specific consent wording, keep its substance] |
| 225 | L296 button: תחזרו אליי | keep (first person, gender-free, Yifrah's own example) | Keep |
| 226 | L234 aria: סגירת החלון | keep | Keep |
| 227 | L241 done title: תודה! | exclamation mark (minor) | תודה. |
| 228 | L244 status: פתחנו לכם וואטסאפ עם ההודעה מוכנה, רק ללחוץ על שלח 😊 | emoji, wordy | ההודעה מחכה לכם בוואטסאפ. נשאר רק לשלוח. |
| 229 | L245 status: הפרטים התקבלו, נחזור אליכם בהקדם. | vague (בהקדם), passive | קיבלנו. נחזור אליכם תוך 24 שעות בימי עסקים. |
| 230 | L181 error: משהו השתבש בשליחה. נסו שוב, או דברו איתנו ישירות בוואטסאפ. | OK | הפרטים לא נשלחו. נסו שוב, או כתבו לנו ישר בוואטסאפ: |
| 231 | L142 WhatsApp prefill: היי, אני ${name} ואשמח לשיחת ייעוץ ללא עלות.\nטלפון: ${phone} | cliché inside the visitor's own words | היי, אני ${name}. אשמח שתחזרו אליי לשיחה.\nטלפון: ${phone} |

### `src/App.tsx` (HOME_SEO)

| # | Current | Problem | Proposed |
|---|---|---|---|
| 232 | title: פיתוח אתרים ודפי נחיתה מותאמים לעסקים | cliché (מותאמים), "פיתוח" where people search "בניית" | בניית אתרים ודפי נחיתה לעסקים קטנים |
| 233 | description: שירותי פיתוח ועיצוב אתרים מקצועיים לעסקים. אתרי תדמית, דפי נחיתה ממירים, אופטימיזציה למובייל וקידום בגוגל. יותר פניות, יותר מכירות, יותר הצלחה. | jargon (ממירים, אופטימיזציה), cliché (מקצועיים), a hype triad at the end | בונים לעסקים קטנים אתרים ודפי נחיתה שנפתחים מהר בטלפון ומביאים פניות לוואטסאפ. מדברים ישירות עם המפתח. |
| 234 | Suspense fallback: טוען Studio... | internal route only | Keep |

### Adjacent strings found during the audit (not in the file list, but visible)

| # | File | Current | Problem | Proposed |
|---|---|---|---|---|
| 235 | `src/utils/whatsapp.ts` general/contact | היי, אני מתעניין/ת בבניית אתר ואשמח לשמוע פרטים נוספים 😊 | gendered (slash in the visitor's own words), vague, website-only | היי, אשמח לשמוע על אתר לעסק שלי. |
| 236 | `src/utils/whatsapp.ts` footer | היי, אני מתעניין/ת בבניית אתר | gendered | היי, יש לי שאלה על אתר לעסק. |
| 237 | `src/utils/whatsapp.ts` (new, per service) | none | Every service sends the website message | Landing: היי, אשמח לשמוע על דף נחיתה. / Video: היי, יש לי קלטות ישנות ואשמח לשמוע על המרה. / Memory: היי, אשמח לשמוע על סרטון מתמונות מהאלבום. / Bot: היי, אשמח לשמוע על בוט לעסק. |
| 238 | `src/utils/whatsapp.ts` ROI | ...חישבתי במחשבון שלכם שאני מפסיד ₪X בשנה... אשמח לשמוע איך אפשר לשפר את האתר שלי! | gendered (מפסיד), exclamation mark. Is the calculator still live? | היי, המחשבון אצלכם יצא ₪X בשנה. אשמח לשמוע מה אפשר לשפר באתר שלי. |
| 239 | `src/utils/validation.ts` | ההודעה חייבת להיות באורך של 10 עד 2000 תווים | robotic | כתבו לפחות משפט אחד (10 תווים ומעלה). |
| 240 | `src/look/buttons/StateButton.tsx` | נשלח. נחזור אליכם היום | honesty: conflicts with "24 שעות בימי עסקים" | נשלח. נחזור אליכם תוך 24 שעות בימי עסקים. [לבירור: נתי] |
| 241 | `src/components/pages/ServicePage.tsx` L345 | שלחו הודעת WhatsApp | Latin spelling, inconsistent with "וואטסאפ" everywhere else | כתבו לנו בוואטסאפ |
| 242 | `src/components/pages/ServicePage.tsx` L332 | צרו קשר | a third contact label | כתבו לנו |
| 243 | `src/components/pages/ServicePage.tsx` L275 | ראו דוגמה לפרויקט | OK | ראו דוגמה |

### Cross-file findings

- **One CTA verb per destination.** Today "דברו איתנו" and "בואו נדבר" label the header, the hero, the process CTA, the dock, the contact heading, the contact WhatsApp row and four service CTAs, for three different destinations. Proposed system:
  - WhatsApp: "כתבו לנו בוואטסאפ" (or "וואטסאפ" where space is tight).
  - #contact: "כתבו לנו" or "ספרו לנו על העסק".
  - Form submit: "שליחת הודעה".
  - Phone: "התקשרו".
  - "דברו איתנו" stays only as the contact chapter heading.
- **Verb kickers on chapters** (the critic's point): מכירים (meet, WhyUs), בוחרים (choose, services), בונים (build, process), שואלים (start, FAQ), and the existing "מתחילים?" for the contact word. The finale gets "מוסרים" (row 60). All are present plural, so they work as "we" and as "you", with no gender.
- **One response promise.** Today the site says "24 שעות בימי עסקים" (site.ts), "היום" (StateButton) and "בהקדם" (Contact, LeadModal). Pick the one that is true and use it everywhere.
- **SEO honesty.** The heroSubtitle and CTA of the SEO page, and the WhyUs AI card, promise placement. The SEO FAQ says nobody can promise placement. Align everything with the FAQ.
- **Duplicated sources.** "למה לעבוד איתנו?" and "שלושה דברים שמבדילים אותנו" are typed into both ShotMeet.tsx and WhyUs.tsx. Single-source them before editing, or the two will drift apart.

---

## Part C: three H1 and sub pairs for the home hero

The current lines are "העסק שלכם" (9 characters) and "המומחיות שלנו" (13). Each option keeps two short lines of a similar length, so the H1 stays a single LCP block with a `<br>`. Every fact is taken from the files: faqs.ts (2 to 3 weeks, up to 5 pages, WhatsApp button), services.ts (built from scratch, yours, no platform dependency), WhyUs (direct with the developer).

### Option 1 (recommended): the outcome

- H1: **אתר שמביא / פניות לוואטסאפ**
- Sub: **נבנה מאפס בשביל העסק שלכם. אתר בסיסי עולה תוך 2 עד 3 שבועות.**
- CTA: **ספרו לנו על העסק** · secondary: **מה אנחנו עושים**

Why this one:
- It names the result owners actually want: a customer message in the app that 99% of Israelis use.
- The verb "מביא פניות" is already Nati's approved register (the current sub says "אתר שמביא פניות").
- The sub adds the two strongest facts on the site, built from scratch and a 2 to 3 week timeline, with no triad and no repeat of the WhyUs benchmark.

Risk: "מביא" describes what the site is built to do, not a guarantee. If Nati wants it softer: "אתר שהלקוחות / כותבים לכם ממנו".

### Option 2: the person

- H1: **מי שבונה את האתר / הוא מי שעונה לכם**
- Sub: **סטודיו של מפתח אחד: אתרים, דפי נחיתה, בוט ללקוחות וסרטונים. אתר בסיסי מוכן תוך 2 עד 3 שבועות.**

Why:
- It leads with the one thing no agency can copy: one developer, reached directly.
- The bank survey in A1 suggests small-business owners reward exactly this.
- The sub is a factual list of four services, so it is not a triad.

Risks:
- The second line has 15 characters, a little longer than today. Check it at 320px.
- It repeats the WhyUs benchmark idea, so the "ליווי אישי" card would need another fact. One candidate is ownership: "האתר שלכם / נבנה מאפס ונשאר שלכם, בלי תלות בשום פלטפורמה."

### Option 3: ownership

- H1: **אתר שנבנה מאפס / ונשאר שלכם**
- Sub: **בלי תבנית ובלי תלות בשום פלטפורמה. מי שנכנס כותב לכם בוואטסאפ בלחיצה אחת.**

Why:
- It answers the fear owners have of template sites and lock-in, without naming WordPress or any stack.
- Both facts are on the websites page ("ולגמרי שלכם", "בלי תלות בפלטפורמה").

Risks:
- It is about the product, not the outcome, so it is weaker as a hook for owners who never thought about lock-in.
- It also speaks only to websites, while the studio sells six services.

**Recommendation: Option 1.** It is outcome-only, which is Nati's first rule. It needs no fact we do not have. It frees "מדברים ישירות עם המפתח, בלי מתווכים" to stay once, where it belongs, in WhyUs. Its sub carries a number the visitor can hold us to.
