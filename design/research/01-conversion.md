# 01 - What makes a small-studio visitor actually get in touch

Research for the mediawave.co.il redesign, compiled 2026-10-16. Every link was accessed on 2026-10-16 ("acc." = accessed).
UNVERIFIED marks a claim seen only in secondary coverage or not traceable to its primary source.
Constraints respected: no invented proof, no prices that do not exist, WhatsApp is the main channel.

## Executive summary

1. Visitors decide in about 10 seconds whether to stay, so the first phone screen must say what, for whom and the outcome ([NN/g](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/)).
2. Pages written at a 5th-7th grade reading level convert at 11.1%, against 5.3% for professional-level copy ([Unbounce](https://unbounce.com/conversion-benchmark-report/)).
3. In professional services, 81% of visits are mobile, and mobile converts about 40% worse than desktop ([Unbounce](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/)).
4. 99% of Israelis use WhatsApp ([ISOC-IL via ice.co.il](https://www.ice.co.il/research/news/article/1088428)), so WhatsApp-first is right, but phone and email must stay visible ([NN/g](https://www.nngroup.com/articles/contact-us-pages/)).
5. With no testimonials, the honest proof is a real face and name, a visible process and real work, because users skip stock photos ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)).
6. Hidden prices send users to competitors ([NN/g](https://www.nngroup.com/articles/show-price/)). Until Nati has real figures, the honest substitute is to explain what drives the price.
7. The FAQ is the objection handler. It should use real questions and admit limits ([NN/g](https://www.nngroup.com/articles/faqs-deliver-value/)).
8. One primary action (WhatsApp), repeated at decision points, with a label that says what happens. Evidence for sticky bars is mixed, so measure them.
9. Scrolljacking disorients most users ([NN/g](https://www.nngroup.com/articles/scrolljacking-101/)). A 0.1 s speed gain went with 21.6% more users reaching lead forms ([web.dev](https://web.dev/case-studies/milliseconds-make-millions)).
10. One page sells one service. Professional-services pages convert best at about 275-745 words ([Unbounce](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/)).

## 1. Offer clarity in the first seconds

**Findings**
- "The first 10 seconds of the page visit are critical", so "communicate your value proposition within 10 seconds" ([NN/g, Nielsen 2011](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/), acc. 2026-10-16).
- A homepage should state its purpose with a concise tagline. The value proposition answers "Why should I choose this site/company over others?" ([NN/g, Wang 2024](https://www.nngroup.com/articles/homepage-design-principles/), acc. 2026-10-16).
- About 57% of viewing time is spent above the fold and 74% in the first two screenfuls ([NN/g, Fessenden 2018](https://www.nngroup.com/articles/scrolling-and-attention/), acc. 2026-10-16).
- Users read about 20% of the words on a page ([NN/g, Nielsen 2008](https://www.nngroup.com/articles/how-little-do-users-read/), acc. 2026-10-16).
- Visual-appeal judgements made after 50 ms matched those made after longer viewing ([Lindgaard et al. 2006](https://doi.org/10.1080/01449290500330448); [Nature news](https://www.nature.com/news/2006/060109/full/news060109-13.html), acc. 2026-10-16). I read the coverage, not the paper.
- In a 5-second test, five seconds is "too short for reading copy". It captures the impression of visual style ([NN/g, Chan 2024](https://www.nngroup.com/articles/testing-visual-design/), acc. 2026-10-16).
- The number of difficult words correlates at -24.3% with conversion rate, and word count at -18.6% ([Unbounce 2024](https://unbounce.com/conversion-benchmark-report/), acc. 2026-10-16).

**Implications for MediaWave**
- **Home:** the first phone screen holds one plain Hebrew sentence naming what (websites, landing pages, video), for whom (small businesses in Israel) and the outcome (customers who get in touch). Nati's name and the WhatsApp button sit in the same screen. The headline never waits for an animation.
- **Service page:** the H1 is the service and its outcome, not a slogan.
- **Test:** with 5 target users, run a 5-second test for the impression (professional? trustworthy?). Then show the hero for 10 seconds and ask "what does this business do, and for whom?" Rewrite until 4 of 5 answer correctly.

## 2. Proof when you have little

**Findings**
- NN/g names 4 credibility factors: design quality, upfront disclosure, comprehensive and current content, and connection to the rest of the web ([NN/g, Harley 2016](https://www.nngroup.com/articles/trustworthy-design/), acc. 2026-10-16).
  - Service sites should show every stage of the work, including the people doing it.
  - Users doubted a company whose portfolio showed only one kind of job.
  - Users are skeptical of on-site testimonials and trust external reviews more.
- Users ignore stock photos but look at real staff. One user spent 10% more time on staff portraits than on bios that took 316% more space ([NN/g, Nielsen 2010](https://www.nngroup.com/articles/photos-as-web-content/), acc. 2026-10-16).
- Seeing the "humans behind the product or service" bolsters trust. Plain language is "perceived as honest and transparent" ([NN/g, Fessenden 2019](https://www.nngroup.com/articles/b2b-trust-from-b2c/), acc. 2026-10-16).
- Showing the effort behind a result (operational transparency) raises perceived value. People even preferred slower services that showed their work ([Buell & Norton 2011](https://ideas.repec.org/a/inm/ormnsc/v57y2011i9p1564-1579.html), acc. 2026-10-16).
- Money-back guarantees raised purchase intention and willingness to pay. For experience goods, the authors advise stricter, clearly defined conditions ([Suwelack et al. 2011](https://ideas.repec.org/a/eee/jouret/v87y2011i4p462-478.html), acc. 2026-10-16).
- 42% of US consumers trust reviews as much as personal recommendations (79% in 2020). 46% find AI-written content suspicious in reviews ([BrightLocal 2025](https://www.brightlocal.com/research/local-consumer-review-survey-2025/), acc. 2026-10-16).

**Implications for MediaWave**
- **Home:** a "who builds this" block with Nati's real photo, name and Kvutzat Yavne, plus one sentence on how he works. No stock people.
- **The site as proof:** state only measured facts about the site itself, such as mobile Core Web Vitals or load time on a phone. Show the date each was measured, re-measure on every release, and remove any number that gets worse.
- **Process as proof:** use real artifacts, such as a sketch, a screen recording of a build, or the tape-conversion desk.
- **Honest risk reversal** means promises Nati can keep:
  - a free first conversation
  - a fixed written quote before work starts
  - the client owns the domain and code
  - staged payments
  - a preview before launch
  - a defined round of changes

  Offer "money back" only with written conditions, and never guarantee business results.
- **Portfolio:** present the memory video fully. Label any concept work as a concept.

## 3. Price signals

**Findings**
- Pricing is the information business users need most. Participants "go to competitors' sites when websites do not show prices". NN/g recommends ranges, scenarios or starting figures ([NN/g, Loranger 2013](https://www.nngroup.com/articles/show-price/), acc. 2026-10-16).
- Hiding prices "Makes the organization seem dubious" ([NN/g, Fessenden 2019](https://www.nngroup.com/articles/b2b-trust-from-b2c/), acc. 2026-10-16). A user left a cleaning site saying "they don't state the rate here" ([NN/g, Harley 2016](https://www.nngroup.com/articles/trustworthy-design/), acc. 2026-10-16).
- A low "starting at" price lifted lead-form conversion by 15% (95.26% confidence, about 22,000 visitors). A high starting price underperformed in some categories. This is a single vendor case study ([Convert / iProspect](https://www.convert.com/case-studies/iprospect/), acc. 2026-10-16).
- Only 45.5% of 200 UK small-business sites publish any price. The study argues, without measuring it, that prices filter out poorly matched leads ([Whito, Aug 2026](https://whito.co.uk/research/uk-price-transparency-study/), acc. 2026-10-16).
- Anchoring: the first number a person sees shapes their estimate, and suggested amounts lifted form completions by 23% ([NN/g, Fessenden 2018](https://www.nngroup.com/articles/anchoring-principle/), acc. 2026-10-16). But anchors "only make a substantial, significant difference in the case of hypothetical data" ([Brzozowicz & Krawczyk 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC8730394/), acc. 2026-10-16).
- UNVERIFIED: I found no controlled study showing that published prices improve lead quality for small studios.

**Implications for MediaWave**
- **Now:** each service page gets a "what affects the price" block covering scope, number of pages, content, integrations and deadline. It also explains how pricing works (a fixed quote before work starts, no hourly surprises). The FAQ answer says the same thing instead of a bare "depends".
- **Later, after 3 or more real jobs:** add real "from" figures or one worked example per service.
- **Never** use crossed-out prices or fake anchors.
- **WhatsApp prefill on service pages:** invite the visitor to ask for a price, so price is the easy first message.

## 4. Process sections and FAQ as objection handling

**Findings**
- FAQs work when they use real questions in visitors' vocabulary and admit "the problems or limitations that everyone knows about". Invented questions are a known bad practice ([NN/g, Farrell 2014](https://www.nngroup.com/articles/faqs-deliver-value/), acc. 2026-10-16).
- Explain what can be customized upfront, and address switching costs on the FAQ or pricing pages ([NN/g, Fessenden 2019](https://www.nngroup.com/articles/b2b-trust-from-b2c/), acc. 2026-10-16).
- In the US, 83% of small businesses have a site. 41% were built with DIY builders and 45% by outsourced partners ([Clutch, Aug 2025](https://clutch.co/press-releases/smb-websites-2025), acc. 2026-10-16). Cost as the main reason for having no site (16%) is UNVERIFIED at source.
- In a sponsored Israeli survey (n=130), 86% expected a WhatsApp reply within an hour ([Calcalist / Zendesk 2021](https://www.calcalist.co.il/article/skkbllzyy), acc. 2026-10-16).
- UNVERIFIED: no primary research ranks objections such as ownership, lock-in or maintenance. Confirm them against Nati's real WhatsApp conversations.

**Implications for MediaWave**
- **Process section (home and service pages):** 4-5 steps. Each says what happens, roughly how long it takes and what the client provides, with real artifacts.
- **FAQ, from real conversations and in Nati's voice:**
  - What drives the price?
  - How long does it take?
  - Who owns the domain, the code and the content?
  - What if Nati is unavailable?
  - Can I edit texts myself?
  - What does maintenance cost?
  - Will it bring customers? Answer honestly: a site helps only together with search, ads and fast replies.
  - Why not Wix?
  - What do I need to prepare?
  - How fast do you reply? State this only if Nati can keep it.

## 5. CTA placement, frequency, sticky mobile CTAs

**Findings**
- Keep primary calls to action at the top ([NN/g, Fessenden 2018](https://www.nngroup.com/articles/scrolling-and-attention/), acc. 2026-10-16). One test of a complex offer that moved the CTA below the fold reported +304%. This is UNVERIFIED, from secondary coverage only ([CXL](https://cxl.com/blog/conversion-optimization-best-practices-fail/), acc. 2026-10-16).
- Generic labels such as "Get Started" mislead. A label should state "precisely what users should expect" ([NN/g, Harley & Flaherty 2017](https://www.nngroup.com/articles/get-started/), acc. 2026-10-16).
- Removing navigation from a focused landing page moved conversion from 3% to 6%. It is a vendor case with an undisclosed sample ([Wingify / VWO](https://wingify.com/blog/a-b-testing-case-study-navigation-menu/), acc. 2026-10-16).
- Sticky headers should use "the smallest amount of space" that keeps targets tappable. They must be opaque and earn their place "only if they truly serve a purpose" ([NN/g, Laubheimer 2021](https://www.nngroup.com/articles/sticky-headers/), acc. 2026-10-16).
- Evidence on sticky CTAs is mixed. GoodUI lists 29 tests, but its results are paywalled ([GoodUI](https://goodui.org/patterns/41), acc. 2026-10-16). In one vendor test, a floating WhatsApp button drew more clicks but fewer qualified leads than an inline hero CTA (UNVERIFIED rigor, [Kolonell](https://kolonell.com/en/blog/whatsapp-button-website-conversion-tracking-2026), acc. 2026-10-16).

**Implications for MediaWave**
- **One primary action:** WhatsApp, with a label saying it opens a chat with Nati. Phone and email are secondary text links.
- **Placement:** put the CTA in the hero, after services, after process, after FAQ and in the footer. These are decision points, so it does not go in every section.
- **Mobile:** a slim, opaque sticky bar that appears after the hero CTA scrolls away. It never covers content and is never doubled by a floating bubble. Track clicks per position.
- **Service pages:** a light header and no outbound links near the CTA.

## 6. Mobile conversion and WhatsApp-first contact

**Findings**
- 83% of landing-page visits are mobile, and desktop converts about 8% better overall ([Unbounce 2024](https://unbounce.com/conversion-benchmark-report/), acc. 2026-10-16). In professional services, mobile converts at 8.3% against 11.6% on desktop ([Unbounce](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/), acc. 2026-10-16).
- Touch targets should be at least 1 cm x 1 cm and well spaced ([NN/g](https://www.nngroup.com/articles/touch-target-size/), acc. 2026-10-16). In one field study, 49% of people touching their screens used one hand, and about 75% of interactions were by thumb. The author calls it not scientific ([Hoober 2013](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php), acc. 2026-10-16).
- "If your site has 4 or fewer top-level navigation links, display them as visible links" ([NN/g, Pernice & Budiu 2016](https://www.nngroup.com/articles/hamburger-menus/), acc. 2026-10-16).
- Forms:
  - NN/g cut one of its own forms from 6 fields to 2. Forms that follow usability guidelines got 78% error-free first submissions against 42% ([NN/g, Whitenton 2016](https://www.nngroup.com/articles/web-form-design/), acc. 2026-10-16).
  - Contact forms should have 3-5 fields and work "in addition to telephone numbers, not as a replacement" ([NN/g, Kaley 2019](https://www.nngroup.com/articles/contact-us-pages/), acc. 2026-10-16).
  - Textareas and dropdowns hurt conversion more than single-line fields (observational) ([HubSpot, Zarrella](https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx), acc. 2026-10-16).
- 75% of large mobile e-commerce sites rate only "mediocre" for UX ([Baymard 2026](https://baymard.com/blog/mobile-ux-ecommerce), acc. 2026-10-16).
- WhatsApp is used by 99% of Israelis (ISOC-IL 2025, [ice.co.il](https://www.ice.co.il/research/news/article/1088428), acc. 2026-10-16). The 2024 figures were 98%, with 95% using it daily ([Globes](https://en.globes.co.il/en/article-globes-ranks-whatsapp-as-israels-top-2024-brand-1001484162), acc. 2026-10-16). Internet penetration is 91.3% ([DataReportal 2026](https://datareportal.com/reports/digital-2026-israel), acc. 2026-10-16).
- In a Meta-commissioned study across 22 markets (Israel not included), 73.3% prefer messaging to communicate with a business, and 74.6% trust a business more when they can message it ([WhatsApp Business / Kantar 2025](https://whatsappbusiness.com/resources/resource-library/state-of-business-messaging/), acc. 2026-10-16).
- Click-to-chat format: `https://wa.me/<number>?text=<URL-encoded message>`, international number with no zeros or dashes ([WhatsApp FAQ](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat), acc. 2026-10-16).
- UNVERIFIED: I found no Israel-specific survey on preferring WhatsApp for contacting businesses.

**Implications for MediaWave**
- Use `wa.me/972...` links with a per-page Hebrew prefill naming the page or service. Nati gets the context, and each source can be counted.
- Add a `tel:` link and a visible email address.
- The form has at most 3 fields (name, need, optional phone) with correct input types. It hands off to WhatsApp and says so.
- Design and test on a mid-range Android phone first, with every CTA at least 1 cm and within thumb reach.

## 7. Service detail pages ("one page sells one service")

**Findings**
- Professional-services pages convert best at 275-745 words (aim for about 500) and at a 7th-grade reading level or below. Pages implying urgency (repair) converted almost 3x better than renovation pages ([Unbounce](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/), acc. 2026-10-16).
- Content must cover "the full range of services", with process photos and the range of customers served ([NN/g, Harley 2016](https://www.nngroup.com/articles/trustworthy-design/), acc. 2026-10-16).
- Case studies from varied clients help buyers judge fit, though on-site cases get the same skepticism as testimonials ([NN/g, Fessenden 2019](https://www.nngroup.com/articles/b2b-trust-from-b2c/), acc. 2026-10-16).

**Implications for MediaWave**
- **Structure:**
  1. Service and outcome (the H1)
  2. Who it is for
  3. The problem in the client's words
  4. What is included
  5. How it works, with times
  6. What affects the price
  7. One real example
  8. 4-6 FAQs
  9. WhatsApp CTA with a service-specific prefill

  Keep it to about 500 Hebrew words.
- **Urgency:** it is real for tape conversion, since tapes degrade with age. Say it once, plainly, without fear tactics.
- **Portfolio page:** one honest case (the memory video) covering what the client had, what was done (with process stages) and what was delivered. Use client words only if they are real and permitted. The site itself can be the second case: the problem, the decisions, the measured speed.

## 8. 404 page as a sales chance

**Findings**
- A good 404 explains what happened plainly, apologizes mildly, and offers search and links. Spelling suggestions reportedly cut 404 errors by at least 40% ([NN/g, Nielsen 1998](https://www.nngroup.com/articles/improving-dreaded-404-error-message/), acc. 2026-10-16).

**Implications for MediaWave:** one plain Hebrew line, then links to the 3-4 services and home, plus the WhatsApp CTA. Keep a real 404 HTTP status.

## 9. What hurts conversion on award-style creative sites

**Findings**
- "The majority of our study participants were at least mildly disoriented by scrolljacking." Task-oriented users had much less patience. NN/g advises avoiding it on mobile or keeping it below the fold ([NN/g, Paul 2023](https://www.nngroup.com/articles/scrolljacking-101/), acc. 2026-10-16).
- Text that fades in on scroll felt like a slow site. Animate only secondary content, and play each animation once ([NN/g, Harley 2017](https://www.nngroup.com/articles/scroll-animations/), acc. 2026-10-16).
- With splash screens, users go "straight for the 'skip intro' button" ([NN/g, Nielsen 2011](https://www.nngroup.com/articles/making-hated-design-elements-work/), acc. 2026-10-16).
- Hiding navigation reduced discoverability and lengthened tasks ([NN/g, Pernice & Budiu 2016](https://www.nngroup.com/articles/hamburger-menus/), acc. 2026-10-16).
- Meeting the Core Web Vitals thresholds makes "users are 24% less likely to abandon page loads" ([Chromium 2020, via Tim Kadlec](https://timkadlec.com/saved/2020/05/chromium-blog-the-science-behind-web-vitals/); [original](https://blog.chromium.org/2020/05/the-science-behind-web-vitals.html), acc. 2026-10-16).
- On lead-gen sites, a 0.1 s mobile speed gain went with 21.6% more users reaching the form page. This is correlational data from 37 brands ([web.dev, Deloitte/Google](https://web.dev/case-studies/milliseconds-make-millions), acc. 2026-10-16). Vodafone's 31% LCP gain brought 8% more sales ([web.dev](https://web.dev/case-studies/vitals-business-impact), acc. 2026-10-16).
- The "+32% bounce from 1 s to 3 s" figure is UNVERIFIED today, because its Think with Google page now redirects ([link](https://www.thinkwithgoogle.com/data/page-load-time-statistics/), acc. 2026-10-16).

**Implications for MediaWave:**
- Motion is garnish: no scrolljacking on phones, no text gated by scroll, no preloader or intro, and no animation that gates the WhatsApp button.
- The hero video must not block LCP.
- Keep navigation visible when it has 4 or fewer links.
- Pass mobile Core Web Vitals on every route.

## Top 15 things this site must do to convert

1. Say what, for whom and the outcome in one plain Hebrew sentence in the first phone screen, with no intro ([NN/g](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/)).
2. Make WhatsApp the single primary action, with a specific label and a per-page `wa.me` prefill ([WhatsApp FAQ](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat); [ISOC-IL](https://www.ice.co.il/research/news/article/1088428)).
3. Design for the phone first, since that is where professional-services leads are lost ([Unbounce](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/)).
4. Write at a 7th-grade level, with short words ([Unbounce](https://unbounce.com/conversion-benchmark-report/)).
5. Show Nati: a real photo, his name and place, never stock people ([NN/g](https://www.nngroup.com/articles/photos-as-web-content/)).
6. Show the process with real artifacts and times ([Buell & Norton](https://ideas.repec.org/a/inm/ormnsc/v57y2011i9p1564-1579.html); [NN/g](https://www.nngroup.com/articles/trustworthy-design/)).
7. Build the FAQ from real objections: price drivers, time, ownership, maintenance and results ([NN/g](https://www.nngroup.com/articles/faqs-deliver-value/)).
8. Give honest price signals: cost drivers now, real "from" figures once they exist ([NN/g](https://www.nngroup.com/articles/show-price/); [Convert](https://www.convert.com/case-studies/iprospect/)).
9. Offer honest risk reversal (fixed quote, ownership, staged payments) and no result guarantees ([Suwelack et al.](https://ideas.repec.org/a/eee/jouret/v87y2011i4p462-478.html)).
10. Repeat the CTA at decision points, add a slim mobile sticky bar, and measure each position ([NN/g](https://www.nngroup.com/articles/scrolling-and-attention/); [NN/g](https://www.nngroup.com/articles/sticky-headers/)).
11. Keep the form to 3 fields or fewer, as a supplement, with phone and email visible ([NN/g](https://www.nngroup.com/articles/contact-us-pages/)).
12. Give each service its own page of about 500 words with the standard structure ([Unbounce](https://unbounce.com/conversion-benchmark-report/professional-services-conversion-rate/)).
13. Pass mobile Core Web Vitals, and never let video or motion delay content or the CTA ([web.dev](https://web.dev/case-studies/milliseconds-make-millions)).
14. Avoid scrolljacking on mobile, scroll-gated text and hidden navigation ([NN/g](https://www.nngroup.com/articles/scrolljacking-101/); [NN/g](https://www.nngroup.com/articles/hamburger-menus/)).
15. Present real work honestly, link Google reviews as real ones arrive, and route the 404 page to services and WhatsApp ([NN/g](https://www.nngroup.com/articles/trustworthy-design/); [NN/g](https://www.nngroup.com/articles/improving-dreaded-404-error-message/)).
