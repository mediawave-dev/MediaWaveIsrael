# 03 · The Israeli market: competitors, prices, norms

Research for the MediaWave redesign, written 2026-10-16.
Every source in the list at the end was accessed on 2026-10-16; claims cite it as [S#], and repo facts as [repo: file].
Prices are what each page showed that day. Vendor price guides are marketing, not independent data.
Mobile notes: first screen only, built-in browser emulating 375x812, 2026-10-16.

## Executive summary

1. The real threat is not the template shops but solo code developers: ITAYOST (solo, Next.js, "basic site 2-3 weeks") matches MediaWave almost line for line and has the most distinctive design in the sample [S10].
2. "Talk directly to the developer" is not unique: YM Digital offers "קשר ישיר עם המפתח" and Waller says there is no bot, "just me" [S2][S5].
3. Code shops (Red Ghost, W-Creators, ITAYOST) publish no prices; template shops do: landing page 1,390-1,499 ₪, Wix site 1,900 ₪ + VAT, brochure site from 4,200 ₪, or 390 ₪ a month [S1-S4].
4. Freelancer bands: landing page about 750-4,500 ₪, small brochure site 3,500-8,500 ₪ (senior up to 15,000), extra hours 150-450 ₪ [S19-S21].
5. Proof is self-asserted everywhere: undated "PageSpeed 98%", desktop-only Lighthouse, unsourced "3-5x faster than WordPress", 5.0 Google ratings from 19-70 reviews [S2][S9][S10][S7].
6. No page in the sample shows a dated mobile score the visitor can re-test, a live build link, or a code-built offer with a VAT-inclusive price and a full list of inclusions.
7. MediaWave's rare, real assets sit in its own Terms and FAQ: prices include VAT, year one of hosting and domain is included, and the IP passes to the client [repo: Terms.tsx, faqs.ts].
8. Memory videos compete with AI services at 199-799 ₪ that deliver in minutes to 5 business days [S16][S17]; tape conversion runs 23-79 ₪ a cassette [S11-S15].
9. Legal: consumer prices must be the total incl. VAT, and a consumer remote-deal cancellation fee is capped at 5% or 100 ₪, which MediaWave's 10% fee may exceed for memory videos and tapes [S27][S28].
10. MediaWave's own copy still uses the category clichés ("מקצועית", "מותאם אישית", "חכמים", "24/7") and the same "it depends" price answer as everyone else [repo: services.ts].

## 1. Competitors

| # | Who | Type, stack | Headline promise | Proof shown | Published price | Main CTA | Mobile first screen |
|---|---|---|---|---|---|---|---|
| 1 | HighSite [S1] | Solo or small, Ashkelon; WordPress + Elementor | "דף נחיתה מקצועי מתקדם מעוצב חדשני מאובטח" | Google 5.0 (badge says 29, widget 32), 4 projects, 6-month warranty | Landing page 1,499 ₪ incl. domain + hosting year 1; renewal 820 ₪/yr; VAT not stated | Phone "חייגו עכשיו", WhatsApp, form, chat | Headline below a laptop video and founder photo; cookie bar, a11y, chat and review badges compete |
| 2 | YM Digital [S2] | Small (Yossi Mizrahi), Harish; WordPress, "AI sites" | "אתר באוויר ב-7 ימי עסקים" | ~14 live projects, 7 logos, Google 5.0/20, "PageSpeed 98%" undated | From: landing 1,390, brochure 4,200, store 5,450, complex 14,500 ₪; domain and hosting extra; VAT not stated | "לשיחת ייעוץ" form, phone, WhatsApp | Clean, CTA above fold; floating WhatsApp and phone pill cover text |
| 3 | ATARIO [S3] | Managed subscription | "תמשיך לעשות את מה שאתה אוהב, אנחנו נדאג לדיגיטל" | None (examples heading is empty) | 390 ₪/month, no setup, first month free, cancel anytime; VAT not stated | WhatsApp, 2-field form | Best in sample: price, WhatsApp and form above the fold |
| 4 | LIN [S4] | Wix agency | "מהיום לא צריך לשלם הון על אתר" | ~20 client sites, repeated testimonials, "2,000 customers", conflicting savings figures | 1,900 ₪ + VAT, domain and hosting excluded, 7 business days, up to 3 rounds | "הזמינו עכשיו אונליין"; no phone visible | Price in hero, stock photo, sticky "מבצע אוקטובר" bar |
| 5 | Waller, Ido Levi [S5][S6] | Solo; WordPress/Elementor (inferred from markup) | "הכל מתחיל באתר אינטרנט אבל לא נגמר שם" | ~10 projects, ~30 logos, 6 named testimonials | None on site; his blog guide: landing 3,500-5,500, small brochure 5,000-7,000 ₪ | "לשיחת ייעוץ", form, WhatsApp | Dark, founder photo, two CTAs above fold |
| 6 | Ori Mintz Media [S7] | Small studio; WordPress | "אתר תדמית לעסק יזניק לך את הכנסות פי 5" | Google 5.0/70, ~21 projects, no numbers | None ("משתנה"); 1-2 months | Form "אורי תחזור אלי!", phone, WhatsApp | Stock illustration, service list, chat bubble over content |
| 7 | Red Ghost [S8] | Software house, Rishon LeZion; React/Next.js + WordPress | "...לפתרונות דיגיטליים חכמים" | App and site portfolio; no testimonials, no scores | None; brochure site 3-5 weeks | "שיחת ייעוץ ללא עלות", phone, WhatsApp, form | Dark, big mascot, cliché headline |
| 8 | W-Creators [S9] | Boutique, north; "clean code" + WordPress | "כל אתר מתוכנן להביא פניות" | 4 projects with dated Lighthouse and Search Console numbers (desktop only), Google 5.0/19 | None on page (links to a calculator) | "בואו נדבר", quote form, reply "within an hour" | Cookie banner covers half the screen; a11y button overlaps |
| 9 | ITAYOST [S10] | Solo dev; Next.js on Vercel | "אתר מהיר שמביא לקוחות, לא סתם כרטיס ביקור דיגיטלי" | 3 projects; unsourced "90+ PageSpeed" | None | "בואו נדבר, אחזור אליכם תוך שעה", form, WhatsApp | Distinctive: work order "No. 0147", handwritten to-do pad |
| 10 | Studio HanaBi [S11] | Video lab, Rishon LeZion, since 2006 | "משחזרים את העבר בטכנולוגיה החדישה" | 6 named testimonials, undefined "lifetime" warranty | 75 ₪/tape up to 10; 63 (VHS, Hi8) or 55 (MiniDV) from 10; incl. VAT | "קבלת הצעה ב-WhatsApp", calculator | Dated; small centred text over a photo, no CTA |
| 11 | Photo Linof [S12] | Lab, Tel Aviv, 4 pickup points | "הזיכרונות שלכם דוהים בארון" | None on page | VHS 79, MiniDV 59 ₪ (a "regular 65 ₪" line conflicts); VAT not stated | Quote form, 1-800 number | Not checked (navigation blocked) |
| 12 | Regaim [S16] | Self-serve AI app | "מהתמונה הראשונה… עד היום. תוך דקות." | 9 testimonials; sample video did not load | Free / 199 / 499 / 799 ₪ by photo count | App sign-up, WhatsApp | Not captured |
| 13 | Masa Bazman [S17] | Managed AI service, Rishon LeZion | "רואים אותם גדלים, מול העיניים" | Named YouTube samples, screenshot reviews | Classic 279 launch / 349 ₪; cinematic 499 / 799 ₪; 4K +120 / +200 | WhatsApp: free restore of one photo in 24h | Not captured |

**HighSite.** Hands over a training video and a zip of the site. Weak: typos, "EMAIL" and "FACEBOOK" buttons that open WhatsApp, two review counts.

**YM Digital.** Six steps; the 7-day clock starts after discovery and content. Weak: "נכס דיגיטלי מניב", "מספר אחד בתחומו", "120+ projects" here and "עשרות" there, undefined warranty.

**ATARIO.** Call, questionnaire, live usually the same day; AI drafts the copy (disclosed only in the FAQ). Weak: stop paying and the site goes offline, zero proof.

**LIN.** Online order, up to 20 pages. Weak: the headline price excludes VAT, domain and hosting; "largest Wix agency" with no evidence.

**Waller.** Sells coaching bundles more than sites. Weak: no process, buzzwords, typos.

**Ori Mintz.** Discovery, custom WordPress design, training, on-page SEO. Weak: a baseless 5x revenue promise, superlatives, fixed packages despite "לא מוצר מדף".

**Red Ghost.** Five stages from discovery to monitored hosting; claims IS 5568 AA work. Weak: no price, no testimonials, no performance numbers.

**W-Creators.** Closest to MediaWave's proof idea: real numbers with dates. Weak: desktop-only scores, a "0+" counter bug in the hero, "no WordPress" next to WordPress in its stack.

**ITAYOST.** Six phases with durations, 6-month warranty. Weak: phases add up to 4-5 weeks against "2-3 weeks", three different load-time claims, no testimonials. Its homepage now leads with CRM ("נהלו את העסק בלי בלאגן"), drifting away from small sites.

**Tape labs.** HanaBi: calculator, WhatsApp quote, courier pickup, MP4, pay after approval, up to 21 business days. Linof: inspection, "incubation", AVI or MP4, no turnaround. Both confuse with conflicting prices and jargon.

**Memory videos.** Regaim is self-serve, 10-30 minutes. Masa Bazman is managed: Google Drive upload, 3 revisions, up to 5 business days, launch prices with no end date. Pic2Life publishes no price and gives three different timelines [S18].

## 2. Price landscape (for Nati's decision only)

| Item | Market band (₪) | Published anchors (₪) | Sources |
|---|---|---|---|
| Landing page | Template build 750-1,500; design + build 1,500-4,500 (junior to senior); Midrag 1,000-3,500; agency custom 6,000-15,000 | HighSite 1,499 incl. domain + hosting year 1; YM from 1,390; SGO from 2,500 | S20, S19, S21, S22, S1, S2 |
| Brochure site (about 5 pages) | Basic 3,500-6,000 junior, 6,000-8,000 senior; unique design 5,000-15,000; Midrag 3,500-5,000; small brochure 5,000-7,000 | YM from 4,200; LIN (Wix) 1,900 + VAT; ATARIO 390/month | S20, S19, S6, S2-S4 |
| Code vs WordPress/Wix | No code shop in the sample publishes a price. One agency guide: Wix pro 5,000-15,000, custom code 35,000-100,000 (agency scale) | RealMedia: from-scratch design about 10,000, on WordPress | S23, S21, S8-S10 |
| Running costs | Wix hosting + domain 63-133/month; WordPress 14-160/month; Wix basic plan about 45/month | HighSite renewal 820/yr; MediaWave Terms 500-800/yr | S19, S21, S1, repo: Terms.tsx 7.2 |
| Hourly rate | 150-250 junior, 200-450 senior; extra revision about 150/h | MediaWave Terms 200-300/h | S20, S19, repo: Terms.tsx 4.1 |
| SEO retainer | Small business basic 2,000-3,500 + VAT a month; guide range 2,000-12,000 | Avinu from 2,000/month | S24, S23 |
| Chatbot | Template bot 0-2,500 setup + 150-300/month; AI bot with knowledge base 3,500-12,000 one-time (ex VAT) + 100-2,500/month upkeep; custom AI 10,000-20,000+ + 600-1,500/month | none fixed | S25, S26 |
| Tape conversion, per cassette | Midrag 30-50 without shipping, 40-60 with | Flash Recovery 40 (1-3) / 27 / 23 (50+); Joni Barzvi 45 incl. VAT; HanaBi 75 / 63 / 55 incl. VAT; Linof 79 VHS, 59 MiniDV | S15, S14, S13, S11, S12 |
| Memory video | 199-799 by photo count and length | Regaim 199 / 499 / 799; Masa Bazman 279-349 classic, 499-799 cinematic; Pic2Life no price | S16-S18 |

Two cautions. Regaim's prices in a search summary the same day were 99 / 199 / 299, so these move. Most guides do not say whether VAT is included; only Mobius and Teleco state "ex VAT".

## 3. Clichés to avoid

Seen on competitor pages (source in brackets); the starred ones also appear in MediaWave's own copy [repo: services.ts].

- "מקצועי / מקצועית" (W-Creators, HighSite) *
- "חדשני", "מתקדם", "מאובטח" stacked together (HighSite)
- "פתרונות דיגיטליים חכמים" (Red Ghost); "חכם" in general * ("צ׳אטבוטים חכמים", "טפסים חכמים")
- "נכס דיגיטלי מניב" (YM)
- "מותאם אישית", "נוכחות דיגיטלית חזקה", "יוקרתיים" (Waller) *
- "מכונת לידים", "שותפים להצלחה" (Ori Mintz); "מכונת משיכת לקוחות" (W-Creators)
- "עובד בשבילך 24/7" (W-Creators) * (chatbots)
- "תוצאות אמיתיות" (Waller, Ori Mintz)
- "לא מתפשר", "אל תתפשרו על בינוניות" (Waller, Red Ghost)
- "מספר 1", "הכי טוב", "הסוכנות הגדולה" (Ori Mintz, YM, LIN)
- Unsourced multipliers: "פי 5" (Ori Mintz), "3-5x faster than WordPress" (ITAYOST)
- "שירות אישי", "ליווי צמוד" (YM; MediaWave already dropped "ליווי צמוד" [repo: look/data.ts])
- "קוד נקי" with nothing shown (W-Creators)
- Fear and urgency: "הזיכרונות שלכם דוהים" (Linof), "אל תחכו לרגע האחרון" (Pic2Life), launch prices with no end date (Masa Bazman), "מבצע אוקטובר" (LIN)

## 4. What nobody in the sample offers

1. A mobile score with a measurement date and a link the visitor can use to re-test. W-Creators shows desktop only, YM's 98 is undated and ITAYOST's 90+ is unsourced [S9][S2][S10].
2. A code-built offer with a published price that includes VAT and lists every inclusion.
3. A live link to the site while it is being built.
4. Plain exit terms: what happens to the site, domain and code if you leave. Only W-Creators states the client owns them; ATARIO takes the site offline [S9][S3].
5. One person for both the business site and the family video or tape. No web studio sells tape conversion, and no lab sells websites.
6. A before and after clip on a tape conversion page (HanaBi and Linof show none).

## 5. What MediaWave can honestly own

| Claim | Repo fact | Against the market |
|---|---|---|
| Mobile speed, measured and dated | Lighthouse mobile 96, LCP 2.39s, CLS 0.006, measured 13.10.2026 [repo: world-dossier.rtl.md W23] | Nobody shows a dated mobile score; add a PageSpeed Insights re-test link |
| Prices include VAT | "כל המחירים כוללים מע"מ" [repo: Terms.tsx 3.4] | LIN shows "+ מע"מ", Teleco quotes ex VAT |
| What the price covers, incl. year one of hosting and domain | faq-8; Terms 7.1 (server, domain, SSL, backups) [repo: faqs.ts, Terms.tsx] | YM and LIN exclude domain and hosting |
| You own it | IP passes to the client after full payment [repo: Terms.tsx 5.1] | ATARIO keeps it; most say nothing |
| Written timelines | Basic site 2-3 weeks, larger 4-6; landing page 5-7 working days [repo: faqs.ts, services.ts] | Honest, but YM and LIN promise 7 business days and ITAYOST also says 2-3 weeks: do not sell delivery speed |
| You deal with the builder, on WhatsApp | HERO.sub [repo: look/data.ts]; dossier W16 | Shared by YM, Waller, ITAYOST: own it only with a name, a face and real messages |
| Built in code, no plugins | Websites section [repo: services.ts] | Differs from template shops only |
| Site and family video from the same hands | Video, tape and memory-video services [repo: services.ts] | Unique in sample; a second door, not the headline |
| A link to the phone while it is built | Dossier W03, W20 (Nati's own answer) | No competitor mentions it |

Fix before claiming anything: revision rounds read "עד שני סבבי תיקונים" in Terms 4.2 but "2 עד 3" in the video FAQ [repo: Terms.tsx, services.ts]. The 30-day bug warranty (Terms 8.1) is shorter than the 6 months at HighSite and ITAYOST [S1][S10]. There are no testimonials, client counts or published prices yet, and the only known portfolio item is the yaelevy screenshot [repo: world-dossier.rtl.md].

## 6. Legal notes (general reading, not legal advice)

**Who is a consumer.** Section 1 of the Consumer Protection Law covers purchases "לשימוש שעיקרו אישי, ביתי או משפחתי" [S27]. A business owner buying a site for the business is likely outside it; a family ordering a memory video or tape conversion is inside.

**Price display.** The "total price" includes VAT (s.17א), and a quoted or advertised price must be the total price only, in shekels (s.17ד) [S27]. Supreme Court case ע"א 6930/19 reportedly held that an ex-VAT price breaches s.17ב even with a note [S29, UNVERIFIED: search summary only]. VAT is 18% since 1 January 2025 [S28]. If Nati is an עוסק פטור there is no VAT to add [לבירור].

**Remote deals (WhatsApp, phone, site).** A consumer may cancel a service within 14 days (s.14ג(ג)(2)); without a defect the fee is the lower of 5% or 100 ₪ (s.14ה(ב)(1)); goods made specially for the consumer are excluded (s.14ג(ד)(4)) [S27]. Before the deal the seller must disclose identity, business ID, address, total price, timing and the cancellation right [S28]. Terms 9.1 charges "10% דמי ביטול" before work starts, which may exceed the cap for consumer orders. Whether a memory video counts as specially made goods is UNVERIFIED; a lawyer should check.

**Accessibility.** Reg. 35א requires IS 5568 at level AA. Reg. 35ה requires an accessibility statement "במקום בולט", listing the adjustments made and how to report a problem. Reg. 35ו(ז) exempts an עוסק פטור or a business with average annual turnover up to 100,000 ₪ [S30]. Commercial guides say an exempt business must still publish a statement and offer alternative access [S31, UNVERIFIED against the official text]. MediaWave already has /accessibility; selling AA plus a statement to clients is a fair offer, if every client site really ships with one [לבירור].

**Spam (Communications Law s.30א).** Ads by email, SMS, fax or auto-dial need "הסכמה מפורשת מראש", must be marked "פרסומת" and include sender details and a clear way to opt out; a court may award up to 1,000 ₪ a message without proof of damage; a narrow exception covers existing customers offered a chance to refuse, for similar products [S32]. WhatsApp is not named in the sources read: treat it as covered (UNVERIFIED either way). A visitor opening WhatsApp to Nati is not advertising. A future newsletter needs its own unticked checkbox (common practice, not statutory text).

**Privacy.** Amendment 13 to the Privacy Protection Law took effect on 14 August 2025 and widened the duty to inform [S33, UNVERIFIED: search summary]. Put a one-line notice and a privacy-policy link beside every form.

## 7. Implications for the site, per page

**Home**
- First screen on a phone: the person's name and face, one dated mobile score with a re-test link, and the WhatsApp button. ATARIO shows that price, WhatsApp and a short form fit calmly on 375px [S3].
- No stacked floating widgets. HighSite, W-Creators and Ori Mintz all cover their own content with chat, cookie and a11y bubbles [S1][S9][S7].
- "מדברים ישירות עם המפתח" is shared by YM [S2]; keep it only next to something that proves it.

**Service pages**
- Each page states what is included, what is not, the timeline, what the client sends, revision rounds and the price policy. If prices go up, write "החל מ-X ₪ כולל מע"מ" (Nati's numbers only).
- Replace "מקצועית" (websites metaTitle), "מותאם אישית", "חכמים" and "24/7" [repo: services.ts].
- Memory videos: the anchor is 199-799 ₪ AI apps, so sell a human edit with music and restoration, shown through a real sample (portfolioLink exists). A free single-photo test like Masa Bazman's is worth Nati's consideration [S17].
- Tapes: formats, turnaround, MP4 delivery, pickup or shipping, and a before and after clip [S11][S12].
- The landing-page copy lists "ביקורות מלקוחות" as part of a good page [repo: services.ts]; MediaWave's own pages must not imply it has reviews.

**Portfolio**
- Live client sites, each with a date, its mobile score and what the client got. Terms 5.3 allows portfolio use unless the client objects.
- Two real sites that look nothing alike answer the "it will look like a template" fear [repo: world-dossier.rtl.md W21].

**FAQ**
- Replace "המחיר תלוי..." with how pricing works: what moves it, what is always included, VAT included, 50% deposit [repo: Terms.tsx 3.2].
- Add: who owns the site and code; what happens if hosting is not renewed (500-800 ₪/yr from year two, close to HighSite's 820 ₪ [S1]); revision rounds (one number); cancellation that matches consumer law.

**Contact**
- WhatsApp with a prefilled message stays primary; every competitor uses it. Promise a reply window only if Nati can keep it (W-Creators and ITAYOST promise "within an hour" [S9][S10]).
- Show the business identity (name, עוסק number) for remote deals [S28], a privacy note beside the form, and no marketing checkbox unless there will be marketing.

## Sources (all accessed 2026-10-16)

- [S1] https://highsite.co.il/ and https://highsite.co.il/%D7%91%D7%A0%D7%99%D7%99%D7%AA-%D7%93%D7%A3-%D7%A0%D7%97%D7%99%D7%AA%D7%94/
- [S2] https://www.ymdigital.co.il/
- [S3] https://atario.net/
- [S4] https://www.lin.co.il/ and https://www.lin.co.il/%D7%91%D7%A0%D7%99%D7%99%D7%AA-%D7%90%D7%AA%D7%A8%D7%99%D7%9D-%D7%91%D7%95%D7%95%D7%99%D7%A7%D7%A1
- [S5] https://waller.co.il/
- [S6] https://waller.co.il/blog/website-pricing-2025 (dated 6 Dec 2024)
- [S7] https://www.orimintzmedia.co.il/ and https://www.orimintzmedia.co.il/%D7%91%D7%A0%D7%99%D7%99%D7%AA-%D7%90%D7%AA%D7%A8%D7%99%D7%9D-%D7%9C%D7%A2%D7%A1%D7%A7%D7%99%D7%9D/
- [S8] https://red-ghost.co.il/ and https://red-ghost.co.il/services/web-dev
- [S9] https://w-creators.co.il/ and https://w-creators.co.il/services/web-development.html
- [S10] https://www.itayost.com/ and https://www.itayost.com/services/web-development
- [S11] https://studiohanabi.com/ and https://studiohanabi.com/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%9C%D7%94%D7%9E%D7%A8%D7%AA-%D7%A7%D7%9C%D7%98%D7%95%D7%AA
- [S12] https://www.linof.com/digitization/video-transfer-service/
- [S13] https://jonibarzvi.com/shop/services/video-digitaize/
- [S14] https://www.flash-recovery.co.il/recovering-data-2/digitization.html
- [S15] https://www.midrag.co.il/Content/Price/22458
- [S16] https://regaim.ai/
- [S17] https://masa-bazman-ai.com/
- [S18] https://pic2life.co.il/services/birthday/
- [S19] https://www.midrag.co.il/Content/Price/23030 (undated)
- [S20] https://www.thelist.co.il/post/%D7%94%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%9C-%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%D7%A0%D7%99-%D7%94%D7%9C%D7%99%D7%A1%D7%98-%D7%91%D7%A0%D7%99%D7%99%D7%AA-%D7%90%D7%AA%D7%A8%D7%99%D7%9D (20 Feb 2025)
- [S21] https://realmedia.co.il/blog/website-prices/ (updated 7 Jan 2025)
- [S22] https://sgo.co.il/%D7%9B%D7%9E%D7%94-%D7%A2%D7%95%D7%9C%D7%94-%D7%93%D7%A3-%D7%A0%D7%97%D7%99%D7%AA%D7%94/ (7 Sep 2026)
- [S23] https://avinu.co.il/website-price/ (data "May 2026")
- [S24] https://mobius-digital.co.il/seo-pricing-guide/
- [S25] https://bizrunner.co.il/chatbot-price (18 Jul 2026)
- [S26] https://www.teleco.co.il/%D7%A6%D7%90%D7%98-%D7%91%D7%95%D7%98-%D7%9C%D7%A2%D7%A1%D7%A7%D7%99%D7%9D-chatbot/ (updated 8 Oct 2026)
- [S27] https://www.nevo.co.il/law_html/law00/70305.htm (Consumer Protection Law, 1981)
- [S28] https://www.ziko.co.il/blog/hganat-hatzarchan-mischar-2026 (20 Aug 2026)
- [S29] https://herzoglaw.co.il/he/news-and-insights/%D7%94%D7%A6%D7%92%D7%AA-%D7%9E%D7%97%D7%99%D7%A8%D7%99%D7%9D/ (seen in a search summary, not opened)
- [S30] https://he.wikisource.org/wiki/%D7%AA%D7%A7%D7%A0%D7%95%D7%AA_%D7%A9%D7%95%D7%95%D7%99%D7%95%D7%9F_%D7%96%D7%9B%D7%95%D7%99%D7%95%D7%AA_%D7%9C%D7%90%D7%A0%D7%A9%D7%99%D7%9D_%D7%A2%D7%9D_%D7%9E%D7%95%D7%92%D7%91%D7%9C%D7%95%D7%AA_(%D7%94%D7%AA%D7%90%D7%9E%D7%95%D7%AA_%D7%A0%D7%92%D7%99%D7%A9%D7%95%D7%AA_%D7%9C%D7%A9%D7%99%D7%A8%D7%95%D7%AA)
- [S31] https://tabnav.com/he/info-center/accessibility-standard-5568-israel-law and https://sgo.co.il/website-accessibility/ (search summary, not opened)
- [S32] https://he.wikipedia.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%A1%D7%A4%D7%90%D7%9D
- [S33] https://www.chamber.org.il/serviceslobby/legal/74023/164240/ (search summary, not opened)
