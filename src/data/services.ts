// The services: one source for the service pages, their JSON-LD and the routes (the prerender and the sitemap
// read every `slug` in this file, so the word is used for a service's own address only).
// Copy rewritten 2026-10-17 (SOTD round, design/copy/CHANGELOG.rtl.md): outcome first, plain Hebrew,
// no stack names, every fact traceable to the Terms (src/components/pages/Terms.tsx), the home FAQ
// (src/data/faqs.ts) or the portfolio sample. No invented numbers, clients or prices.

export interface ServiceStep {
  title: string
  line: string
}

/** One of the customer's questions and its answer (sun, D253). */
export interface ServiceAsk {
  /** the question a business owner asks, in the two weights of every heading: "light|heavy" */
  q: string
  /** the answer, one paragraph per entry; it starts in the first words */
  a: string[]
  /** a closing pair set large, a light sentence then the heavy point (the home page's .about__close); one per page at most */
  close?: [string, string]
  /** the answer is the service's own sample film (portfolio-examples.ts): it stands right under the question, the text after it */
  sample?: boolean
  /** a still of what the question is about, in the film's frame and in the film's place (right under the
      question, the text after it). `name` is the file in public/media without its "-poster" endings
      (licences in design/media-ledger.rtl.md); `alt` says what is seen in it. One per page. */
  still?: { name: string; alt: string }
}

/** The written quote every job starts with (Terms 3.1), as the page draws it (sun, D253). */
export interface ServiceQuote {
  /** what the quote is for, in two weights: "light|heavy" */
  name: string
  /** what the price includes; the slip says "כלול במחיר" once, over these rows */
  rows: string[]
  /** what it does not include: the row, and the note at its end (a real figure or "בתשלום נוסף") */
  extra?: [string, string][]
  /** the first line is how the price is set: it stands right under the slip's name, set heavy, because the
      heading over the slip asks what it costs. The rest stand under the rows: how long it takes and how it
      is paid. *Stars* mark the one number worth a highlight. The page adds the VAT line itself (PRICE_COMMON). */
  lines: string[]
}

export interface ServicePageData {
  id: string
  slug: string
  title: string
  shortDescription: string
  metaTitle: string
  metaDescription: string
  /** the hero's outcome line (one sentence, the visitor's result) */
  heroSubtitle: string
  lottieAnimation?: string
  lottieSize?: number
  /** Lottie renderer override: 'canvas' for vector-heavy animations whose SVG
      renderer thrashes style/layout every frame (measured: 25-54s TBT) */
  lottieRenderer?: 'svg' | 'canvas'
  /** Static SVG/PNG icon (takes precedence over lottieAnimation when set) */
  imageIcon?: string
  /** three short facts the visitor can hold us to (the hero's receipt strip) */
  tags?: string[]
  portfolioLink?: string
  sections: {
    heading: string
    content: string
  }[]
  /** what you get: outcomes, never stack names */
  features: string[]
  /** how it goes, in order (shot service page: the ink line) */
  steps?: ServiceStep[]
  /** how long it takes, from the FAQ and the service's own answers */
  time?: string
  /** how the price is set: honest lines only, no numbers that do not exist */
  price?: string[]
  faq: { question: string; answer: string }[]
  /** the closing question above the final action */
  cta: string
  /** the WhatsApp prefill for this service (first person, gender-free) */
  waText?: string

  // ---- sun (D253): the page as the customer's questions, in the order they ask them. Every service carries
  // these four; the older fields above are read only by the earlier looks and the SEO scripts.
  /** the page's name in two weights, chosen with search in mind: "light|heavy" (no bar: all of it heavy) */
  h1: string
  /** the answer under the H1: what it is, and one number where the service has one */
  lede: string
  /** the questions before the price, one or two */
  asks: ServiceAsk[]
  /** the quote slip, the answer to "what does it cost" */
  quote: ServiceQuote
  /** two phone cards of our work for the hero, file names in public/work without ".webp". Only cards of the
      kind of site the page is about: a page with no such work of ours shows none */
  shots?: string[]
  /** the page's name on the line that says where one stands, when the title is not what the site calls
      the page (default: title) */
  crumb?: string
  /** a side service: about half a main page. The promise, two questions, the slip, the form. What its steps
      and its faq say is told in the answers and in the slip's notes, so the page draws neither block
      (both fields stay as they are for the older looks). */
  brief?: boolean
}

/** Lines every price sheet ends with (Terms 3.1, 3.2, 3.4). */
export const PRICE_COMMON = [
  'לפני שמתחילים מקבלים הצעת מחיר בכתב, עם מה שעושים, כמה זמן זה לוקח וכמה זה עולה.',
  'המחיר כולל מע״מ.',
] as const

export const servicesData: ServicePageData[] = [
  {
    id: 'websites',
    slug: 'building-websites',
    title: 'בניית אתרים',
    shortDescription: 'אתר שנבנה מאפס בשבילכם, ונשאר שלכם.',
    metaTitle: 'בניית אתרים לעסקים',
    metaDescription:
      'בניית אתר תדמית לעסק, מאפס ובלי תבנית. כל פנייה מגיעה ישר לוואטסאפ. אתר בסיסי עולה לאוויר תוך 2 עד 3 שבועות, והוא שלכם אחרי התשלום.',
    heroSubtitle: 'אתר שנבנה מאפס בשביל העסק שלכם, וכל פנייה ממנו מגיעה ישר לוואטסאפ.',
    lottieAnimation: '/animations/1/web-design.json',
    tags: ['אתר בסיסי תוך 2 עד 3 שבועות', 'שנה של אחסון ודומיין כלולה', 'האתר שלכם אחרי התשלום'],
    sections: [
      {
        heading: 'למה לא תבנית?',
        content:
          'תבנית נבנתה בשביל כולם, ולכן היא נראית כמו כולם. אתר שנבנה מאפס נראה כמו העסק שלכם, ונפתח מהר כי אין בו שום דבר מיותר.',
      },
      {
        heading: 'מה יש ביום ההשקה',
        content:
          'אתר שנראה טוב בטלפון ובמחשב, עם כפתור וואטסאפ וטופס פנייה, וגוגל יכול למצוא אותו.',
      },
      {
        heading: 'מדברים עם מי שבונה',
        content:
          'אין מנהל פרויקט באמצע. את השאלות, התיקונים והקישור לגרסה הבאה מקבלים ישר מהמפתח, בוואטסאפ.',
      },
    ],
    features: [
      'עיצוב שנבנה בשביל העסק שלכם, בלי תבנית',
      'נפתח מהר, גם בטלפון',
      'נראה טוב בטלפון, בטאבלט ובמחשב',
      'כפתור וואטסאפ וטופס פנייה',
      'בנוי כך שגוגל יכול למצוא אותו',
      'שנה ראשונה של אחסון, דומיין וגיבויים',
      'חודש ראשון של תמיכה אחרי ההשקה',
      'העיצוב והקוד שלכם אחרי תשלום מלא',
    ],
    steps: [
      { title: 'שיחה', line: 'מספרים על העסק, ומבינים יחד מה האתר צריך לעשות.' },
      { title: 'הצעת מחיר', line: 'מקבלים בכתב מה נבנה וכמה זה עולה.' },
      { title: 'עיצוב לאישור', line: 'רואים את העיצוב לפני שבונים. עד שני סבבי תיקונים כלולים.' },
      { title: 'בנייה', line: 'מקבלים קישור לטלפון, ורואים את האתר נבנה.' },
      // the month of support is the slip's to say (its last row)
      { title: 'השקה', line: 'האתר עולה לאוויר.' },
    ],
    time: 'אתר בסיסי לוקח 2 עד 3 שבועות. אתר גדול יותר לוקח 4 עד 6. טקסטים ותמונות מוכנים מקצרים את הזמן.',
    price: [
      'המחיר נקבע לפי מספר העמודים, מה האתר צריך לעשות, והאם יש בו חנות.',
      'המחיר כולל עיצוב, בנייה, הדרכה ושנה ראשונה של אחסון ודומיין.',
      'משלמים חצי כשמתחילים, ואת השאר לפני שהאתר עולה לאוויר.',
      'מהשנה השנייה האחסון עולה 500 עד 800 ₪ לשנה.',
    ],
    // only what the page has not answered above (the price is the slip's, D253)
    faq: [
      {
        question: 'האתר יופיע בגוגל?',
        answer:
          'כן. כל אתר נבנה כך שגוגל יכול למצוא אותו ולהבין מה יש בו. מי שרוצה לטפס גבוה יותר מוסיף קידום חודשי, בתשלום נפרד.',
      },
      {
        question: 'אצטרך לדעת תכנות כדי לעדכן את האתר?',
        answer:
          'לא. מקבלים מערכת פשוטה לעדכון טקסטים ותמונות, והדרכה איך להשתמש בה.',
      },
      {
        question: 'מה יכול לעכב?',
        answer:
          'בעיקר חומרים ואישורים. כשהטקסטים והתמונות מוכנים, ועל כל גרסה עונים תוך 7 ימי עסקים, לוח הזמנים נשמר.',
      },
      {
        question: 'ומה אם ארצה שינויים שלא היו בהצעה?',
        answer:
          'עד שני סבבי תיקונים כלולים במחיר. עבודה מעבר להצעה מתומחרת לפי שעה, 200 עד 300 ₪.',
      },
      {
        question: 'של מי האתר בסוף?',
        answer:
          'שלכם. אחרי תשלום מלא האתר עובר אליכם, עם העיצוב והקוד.',
      },
    ],
    cta: 'רוצים אתר תדמית לעסק שלכם?',
    waText: 'היי, אשמח לשמוע על בניית אתר לעסק שלי.',
    // "בניית אתר" is what people search, "אתר תדמית" is what the home page calls it: the H1 holds both
    h1: 'בניית |אתר\u00A0תדמית',
    lede: 'אתר שנבנה מאפס בשביל העסק שלכם, וכל פנייה ממנו מגיעה ישר לוואטסאפ. אתר בסיסי עולה לאוויר תוך 2\u00A0עד\u00A03\u00A0שבועות.',
    // the footer and the home page call this page "אתרי תדמית"
    crumb: 'אתרי תדמית',
    // two image sites; the landing page of ours stands on the landing page's own page
    shots: ['ben-david-card-top', 'yael-levy-card-top'],
    asks: [
      {
        q: 'דף נחיתה או |אתר תדמית?',
        a: [
          'אתר תדמית מתאים כשמחפשים אתכם בגוגל, ורוצים לראות מי אתם לפני שמתקשרים. יש בו כמה עמודים ומידע על כל העסק.',
          'דף נחיתה הוא עמוד אחד עם מטרה אחת, בדרך כלל לקמפיין.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לאתר תדמית',
      rows: [
        'עיצוב מאפס לעסק שלכם',
        'בנייה לטלפון ולמחשב',
        'כפתור וואטסאפ וטופס פנייה',
        'מערכת לעדכון טקסטים ותמונות, עם הדרכה',
        'אחסון ודומיין לשנה הראשונה, עם גיבויים',
        'חודש ראשון של תמיכה אחרי ההשקה',
      ],
      extra: [
        ['אחסון מהשנה השנייה', '500 עד 800 ₪ לשנה'],
        ['כתיבת תוכן', 'בתשלום נפרד'],
      ],
      lines: [
        'המחיר נקבע לפי מספר העמודים ולפי מה שהאתר צריך לעשות, למשל חנות.',
        'אתר בסיסי לוקח *2 עד 3 שבועות*. אתר גדול יותר לוקח 4 עד 6 שבועות.',
        'משלמים חצי כשמתחילים, ואת השאר לפני שהאתר עולה לאוויר.',
      ],
    },
  },
  {
    id: 'landing',
    slug: 'landing-pages',
    title: 'דפי נחיתה',
    shortDescription: 'דף אחד עם הצעה אחת, שמוביל ישר לוואטסאפ.',
    metaTitle: 'בניית דף נחיתה לעסק ולקמפיין',
    metaDescription:
      'דף נחיתה לעסק או לקמפיין. דף אחד עם מטרה אחת, שמוביל את מי שנכנס לכתוב לכם בוואטסאפ. נבנה מאפס ומוכן תוך 5 עד 7 ימי עבודה.',
    heroSubtitle: 'דף אחד עם מטרה אחת, שמי שנכנס יכתוב לכם בוואטסאפ.',
    lottieAnimation: '/animations/3%20landing%20page/Contact%20us.json',
    tags: ['מוכן תוך 5 עד 7 ימי עבודה', 'כפתור וואטסאפ עם הודעה מוכנה', 'כותבים את הטקסט יחד'],
    sections: [
      {
        heading: 'מתי צריך דף נחיתה?',
        content:
          'כשיש לכם הצעה אחת ברורה. למשל קמפיין בגוגל או בפייסבוק, השקה, מבצע או שירות חדש. באתר שלם יש הרבה דרכים להתפזר. בדף נחיתה יש דרך אחת.',
      },
      {
        heading: 'מה יש בדף',
        content:
          'כותרת שאומרת מה מקבלים ולמי זה מתאים. תשובות לשאלות שעולות לפני שכותבים לכם. וכפתור וואטסאפ שאפשר ללחוץ עליו בכל שלב.',
      },
      {
        heading: 'דף לקמפיין',
        content:
          'מריצים מודעות? הדף נבנה סביב המסר של המודעה, עם מדידה שמראה כמה פניות הגיעו ממנה.',
      },
    ],
    features: [
      'דף שנבנה סביב הצעה אחת',
      'כפתור וואטסאפ עם הודעה מוכנה',
      'טופס קצר למי שמעדיף להשאיר פרטים',
      'נבנה קודם לטלפון, ואחר כך למחשב',
      'נפתח מהר בטלפון',
      'מדידה של כמה פניות הגיעו מכל מודעה',
    ],
    // the four steps carry the names the home page gives them (content.ts PROCESS); the lines say what the
    // page has not said yet (what is included and what costs extra is the slip's to say)
    steps: [
      { title: 'אפיון', line: 'מתחילים בשיחה. מבינים מה ההצעה שלכם, ומה עוצר היום את הלקוחות מלפנות.' },
      { title: 'כתיבה שיווקית', line: 'עובדים עם הטקסט שלכם, או כותבים אותו יחד.' },
      { title: 'עיצוב', line: 'רואים את הדף מעוצב לפני שבונים אותו, ומבקשים שינויים.' },
      { title: 'פיתוח', line: 'בונים את הדף ובודקים אותו יחד בטלפון ובמחשב. כשהוא עולה, מחברים אותו למודעות ולמדידה.' },
    ],
    time: 'דף רגיל מוכן תוך 5 עד 7 ימי עבודה. דף עם אנימציות מיוחדות לוקח עד שבועיים.',
    price: [
      'המחיר נקבע לפי אורך הדף, ולפי כמה אנימציות ותוכן מיוחד יש בו.',
      'משלמים חצי כשמתחילים, ואת השאר לפני שהדף עולה לאוויר.',
    ],
    // only what the page has not answered above (landing page or site is the first question, D253)
    faq: [
      {
        question: 'מה יכול לעכב את הדף?',
        answer:
          'בעיקר חומרים ואישורים. כשהטקסט והתמונות מוכנים, ועל כל גרסה עונים תוך 7 ימי עסקים, לוח הזמנים נשמר.',
      },
      {
        question: 'ומה אם ארצה שינויים אחרי שני הסבבים?',
        answer:
          'עבודה מעבר להצעה מתומחרת לפי שעה, 200 עד 300 ₪.',
      },
      {
        question: 'אפשר לשנות את הטקסט אחרי שהדף עלה?',
        answer:
          'כן. מקבלים מערכת פשוטה שבה מעדכנים טקסטים ותמונות לבד.',
      },
      {
        question: 'של מי הדף בסוף?',
        answer:
          'שלכם. אחרי תשלום מלא הדף עובר אליכם, עם העיצוב והקוד.',
      },
    ],
    cta: 'יש לכם הצעה שצריכה דף?',
    waText: 'היי, אשמח לשמוע על דף נחיתה לעסק שלי.',
    h1: 'בניית |דף\u00A0נחיתה',
    lede: 'דף אחד עם מטרה אחת. מי שנכנס אליו כותב לכם בוואטסאפ או משאיר פרטים. דף רגיל באוויר תוך 5\u00A0עד\u00A07 ימי\u00A0עבודה.',
    shots: ['switchon-card-top', 'hila-card-top'],
    asks: [
      {
        q: 'מתי צריך |דף נחיתה?',
        a: [
          'כשיש לכם הצעה אחת ברורה, ואנשים מגיעים אליה ממודעה בגוגל או בפייסבוק. גם להשקה של שירות חדש ולמבצע בונים דף כזה.',
        ],
        close: ['באתר שלם יש הרבה דרכים להתפזר.', 'בדף נחיתה יש דרך אחת.'],
      },
      {
        q: 'מה יהיה |בדף שלכם?',
        a: [
          'בראש הדף עומדת כותרת שאומרת מה מקבלים ולמי זה מתאים. אחריה באות התשובות לשאלות שעולות לפני שפונים אליכם.',
          'כפתור הוואטסאפ נמצא לאורך כל הדף. דף שמגיעים אליו ממודעה נבנה סביב מה שהמודעה אמרה.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לדף נחיתה',
      rows: [
        'עיצוב מלא לאישור, לפני שבונים',
        'בנייה קודם לטלפון, ואחר כך למחשב',
        'כפתור וואטסאפ עם הודעה מוכנה',
        'טופס קצר למי שמעדיף להשאיר פרטים',
        'מדידה של כמה פניות הגיעו מכל מודעה',
        'עד שני סבבי תיקונים',
      ],
      // the home page says the same (content.ts PROCESS, step two; faqs.ts faq-9)
      extra: [['כתיבת הטקסט יחד איתכם', 'בתשלום נוסף']],
      lines: [
        'המחיר נקבע לפי אורך הדף, ולפי כמה אנימציות ותוכן מיוחד יש בו.',
        'דף רגיל מוכן תוך *5 עד 7 ימי עבודה*. דף עם אנימציות מיוחדות לוקח עד שבועיים.',
        'משלמים חצי כשמתחילים, ואת השאר לפני שהדף עולה לאוויר.',
      ],
    },
  },
  // The third kind the home page promises (content.ts OFFER). Written 13.11.2026 from what such a site has to
  // answer for someone who hesitates, and from the studio's own process and terms; the times and the price
  // lines are the ones every site of ours carries (faqs.ts, Terms 3.2, 4.2, 7.1 to 7.3).
  {
    id: 'programs',
    slug: 'program-sites',
    title: 'אתר לקורס ולתוכנית ליווי',
    shortDescription: 'אתר שעונה למי שמתלבט לפני שהוא נרשם.',
    metaTitle: 'בניית אתר לקורס ולתוכנית ליווי',
    metaDescription:
      'בניית אתר לקורס או לתוכנית ליווי. מי שמתלבט מוצא בו למי התוכנית מתאימה ומה יש בה, עם מחיר ותאריכים. אתר בסיסי עולה לאוויר תוך 2 עד 3 שבועות.',
    heroSubtitle: 'מי שמתעניין בקורס או בליווי מתלבט לפני שהוא נרשם. האתר עונה לו על השאלות שעוצרות אותו.',
    lottieAnimation: '/animations/1/web-design.json',
    sections: [
      {
        heading: 'מה צריך להיות באתר של תוכנית?',
        content:
          'האתר פותח בשתי תשובות, למי התוכנית מתאימה ומה יש בה. אחר כך באים המחיר והתאריכים.',
      },
      {
        heading: 'איך נרשמים דרך האתר?',
        content:
          'באתר יש כפתור וואטסאפ וטופס קצר להשארת פרטים. כשרוצים שישלמו באתר עצמו, מחברים אליו תשלום מאובטח.',
      },
    ],
    features: [
      'עיצוב מאפס לתוכנית שלכם',
      'בנייה לטלפון ולמחשב',
      'כפתור וואטסאפ וטופס להשארת פרטים',
      'מערכת לעדכון טקסטים ותמונות, עם הדרכה',
      'אחסון ודומיין לשנה הראשונה, עם גיבויים',
      'חודש ראשון של תמיכה אחרי ההשקה',
    ],
    // no steps of its own: they would be the image site's five with one word changed
    time: 'אתר בסיסי לוקח 2 עד 3 שבועות. אתר גדול יותר לוקח 4 עד 6.',
    price: [
      'המחיר נקבע לפי מספר העמודים ולפי מה שהאתר צריך לעשות, למשל תשלום באתר.',
      'משלמים חצי כשמתחילים, ואת השאר לפני שהאתר עולה לאוויר.',
      'מהשנה השנייה האחסון עולה 500 עד 800 ₪ לשנה.',
    ],
    faq: [
      {
        question: 'המחזור נפתח בקרוב. מה יכול לעכב?',
        answer:
          'בעיקר חומרים ואישורים. כשהטקסטים והתמונות מוכנים, ועל כל גרסה עונים תוך 7 ימי עסקים, לוח הזמנים נשמר.',
      },
      {
        question: 'אפשר לעדכן לבד מחיר ותאריכים?',
        answer:
          'כן. מקבלים מערכת פשוטה שבה מעדכנים טקסטים ותמונות לבד, והדרכה איך להשתמש בה.',
      },
      {
        question: 'מה ההבדל בין אתר כזה לדף נחיתה?',
        answer:
          'דף נחיתה הוא עמוד אחד להצעה אחת. אתר לתוכנית עונה על יותר שאלות, כי מי ששוקל קורס או ליווי מתלבט יותר לפני שהוא מחליט.',
      },
      {
        question: 'של מי האתר בסוף?',
        answer:
          'שלכם. אחרי תשלום מלא האתר עובר אליכם, עם העיצוב והקוד.',
      },
    ],
    cta: 'יש לכם קורס או תוכנית ליווי?',
    waText: 'היי, אשמח לשמוע על אתר לקורס או לתוכנית ליווי.',
    h1: 'בניית |אתר לקורס ולתוכנית\u00A0ליווי',
    lede: 'מי שמתעניין בקורס או בליווי מתלבט לפני שהוא נרשם. האתר עונה לו על השאלות שעוצרות אותו, ומשאיר לו דרך קצרה להירשם.',
    // no cards in the hero: none of the sites we have built is a course or a programme (src/data/work.json)
    asks: [
      {
        q: 'מה צריך להיות |באתר של תוכנית?',
        a: [
          'האתר פותח בשתי תשובות, למי התוכנית מתאימה ומה יש בה. אחר כך באים המחיר והתאריכים.',
        ],
      },
      {
        q: 'איך נרשמים |דרך האתר?',
        a: [
          'באתר יש כפתור וואטסאפ וטופס קצר להשארת פרטים. כשרוצים שישלמו באתר עצמו, מחברים אליו תשלום מאובטח.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לאתר של תוכנית',
      rows: [
        'עיצוב מאפס לתוכנית שלכם',
        'בנייה לטלפון ולמחשב',
        'כפתור וואטסאפ וטופס להשארת פרטים',
        'מערכת לעדכון טקסטים ותמונות, עם הדרכה',
        'אחסון ודומיין לשנה הראשונה, עם גיבויים',
        'חודש ראשון של תמיכה אחרי ההשקה',
      ],
      extra: [
        ['אחסון מהשנה השנייה', '500 עד 800 ₪ לשנה'],
        ['כתיבת תוכן', 'בתשלום נפרד'],
      ],
      lines: [
        'המחיר נקבע לפי מספר העמודים ולפי מה שהאתר צריך לעשות, למשל תשלום באתר.',
        'אתר בסיסי לוקח *2 עד 3 שבועות*. אתר גדול יותר לוקח 4 עד 6 שבועות.',
        'משלמים חצי כשמתחילים, ואת השאר לפני שהאתר עולה לאוויר.',
      ],
    },
  },
  {
    id: 'seo',
    slug: 'seo-promotion',
    title: 'קידום בגוגל',
    shortDescription: 'עבודה חודשית כדי שמי שמחפש את מה שאתם עושים יגיע אליכם.',
    metaTitle: 'קידום אורגני בגוגל לעסקים',
    metaDescription:
      'קידום אורגני בגוגל לעסקים. עבודה חודשית על האתר ועל הפרופיל העסקי בגוגל מפות, עם דוח נתונים כל חודש. תוצאות ראשונות נראות בדרך כלל אחרי 2 עד 3 חודשים.',
    heroSubtitle: 'עבודה חודשית, כדי שמי שמחפש בגוגל את מה שאתם עושים יגיע אליכם.',
    lottieAnimation: '/animations/4%20SEO/Website%20SEO%20Audit.json',
    tags: ['דוח כל חודש', 'בלי הבטחות למקום ראשון', 'גם הפרופיל שלכם בגוגל מפות'],
    sections: [
      {
        heading: 'למה זה שווה את הזמן',
        content:
          'מודעה בגוגל מביאה אנשים רק כל עוד משלמים עליה. עמוד שגוגל כבר מציג ממשיך להביא אנשים גם חודשים אחרי שנכתב.',
      },
      {
        heading: 'מה עושים כל חודש',
        content:
          'בודקים מה הלקוחות שלכם מקלידים בגוגל, מסדרים את האתר כך שגוגל יבין אותו, כותבים עמודים שעונים על החיפושים האלה, ומסדרים את הפרופיל העסקי בגוגל מפות.',
      },
      {
        heading: 'מה לא נבטיח',
        content:
          'אף אחד לא יכול להבטיח מקום ראשון בגוגל, וגם אנחנו לא מבטיחים.',
      },
    ],
    features: [
      'בדיקה של מה הלקוחות שלכם מחפשים',
      'סידור האתר כך שגוגל יבין אותו',
      'כתיבת עמודים שעונים על החיפושים',
      'שיפור המהירות של האתר',
      'סידור הפרופיל העסקי בגוגל מפות',
      'דוח חודשי עם נתונים',
    ],
    steps: [
      { title: 'בדיקה', line: 'איפה האתר עומד היום, ומה מחפשים בתחום שלכם.' },
      { title: 'תוכנית', line: 'מקבלים בכתב על מה עובדים ובאיזה סדר.' },
      { title: 'עבודה חודשית', line: 'תיקונים באתר ועמודים חדשים, כל חודש.' },
      { title: 'דוח', line: 'כל חודש מקבלים דוח על מה שהשתנה ועל מה שעושים בחודש הבא.' },
    ],
    price: [
      'קידום הוא עבודה חודשית. המחיר נקבע לפי כמה תחרות יש בתחום שלכם, וכמה עמודים צריך לכתוב.',
    ],
    faq: [
      {
        question: 'מתי רואים תוצאות?',
        answer:
          'קידום לוקח זמן. בדרך כלל רואים תוצאות ראשונות אחרי 2 עד 3 חודשים, ותוצאות של ממש אחרי 4 עד 6.',
      },
      {
        question: 'אפשר להבטיח מקום ראשון?',
        answer:
          'לא, ואף אחד לא יכול. מה שכן, כל חודש מקבלים דוח על מה עבדנו ומה השתנה.',
      },
      {
        question: 'מה ההבדל בין קידום למודעות בגוגל?',
        answer:
          'מודעות מביאות אנשים מיד, ונעצרות כשמפסיקים לשלם. קידום לוקח יותר זמן, וממשיך להביא אנשים בלי לשלם על כל כניסה. כדאי לשלב את שניהם.',
      },
    ],
    cta: 'רוצים לדעת איפה אתם עומדים בגוגל?',
    waText: 'היי, אשמח לשמוע על קידום בגוגל לעסק שלי.',
    // sun (D254), and the same in the three side services below: the fields above stay as they were for the
    // older looks; the page is the promise, two questions and the slip (see `brief` in ServicePageData).
    brief: true,
    h1: 'קידום |בגוגל',
    lede: 'קידום הוא עבודה חודשית, כדי שמי שמחפש בגוגל את מה שאתם עושים יגיע אליכם. כל חודש מקבלים דוח על מה שהשתנה.',
    asks: [
      {
        q: 'מודעות או |קידום בגוגל?',
        a: [
          'מודעות מביאות אנשים מיד, ונעצרות כשמפסיקים לשלם. קידום לוקח יותר זמן, וממשיך להביא אנשים בלי לשלם על כל כניסה. כדאי לשלב את שניהם.',
        ],
      },
      {
        q: 'מתי רואים |תוצאות?',
        a: [
          'אחרי 2 עד 3 חודשים רואים בדרך כלל תוצאות ראשונות. תוצאות של ממש מגיעות אחרי 4 עד 6 חודשים.',
          'אף אחד לא יכול להבטיח מקום ראשון בגוגל, וגם אנחנו לא מבטיחים.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לקידום בגוגל',
      rows: [
        'בדיקה של מה שהלקוחות שלכם מחפשים',
        'סידור האתר כך שגוגל יבין אותו',
        'כתיבת עמודים שעונים על החיפושים',
        'שיפור המהירות של האתר',
        'סידור הפרופיל העסקי בגוגל מפות',
        'דוח חודשי על מה שהשתנה',
      ],
      // the first two steps, as the slip's note
      lines: [
        'המחיר הוא חודשי. הוא נקבע לפי התחרות בתחום שלכם, ולפי מספר העמודים שצריך לכתוב.',
        'לפני שמתחילים בודקים איפה האתר שלכם עומד היום. אחר כך מקבלים בכתב על מה עובדים ובאיזה סדר.',
      ],
    },
  },
  {
    id: 'chatbots',
    slug: 'chatbots',
    title: 'צ׳אטבוט לעסק',
    shortDescription: 'עונה ללקוחות גם כשאתם בפגישה.',
    metaTitle: 'צ׳אטבוט לעסק, מענה ללקוחות באתר ובוואטסאפ',
    metaDescription:
      'צ׳אטבוט לעסק קטן. הבוט עונה על השאלות שחוזרות כל יום, ומעביר אליכם את מי שצריך אתכם, עם שם וטלפון. הוא עובד באתר ובוואטסאפ. בוט בסיסי מוכן תוך שבוע.',
    heroSubtitle: 'עונה על השאלות שחוזרות כל יום, גם בלילה, ומעביר אליכם את מי שצריך אתכם.',
    lottieAnimation: '/animations/14%20chatbot/Live%20chatbot.json',
    lottieSize: 200,
    tags: ['בוט בסיסי תוך שבוע', 'עונה גם בלילה', 'באתר, בוואטסאפ, בפייסבוק ובאינסטגרם'],
    sections: [
      {
        heading: 'מה הבוט עושה',
        content:
          'לקוחות שואלים את אותן שאלות על שעות, על מחירים ועל הדרך אליכם. הבוט עונה עליהן מיד. מה שרק אתם יכולים לענות עליו, הוא מעביר אליכם עם שם וטלפון.',
      },
      {
        heading: 'מבין מה כותבים לו',
        content:
          'אין תפריט של כפתורים. הבוט מבין שאלות שנכתבות במילים רגילות, ואתם מחליטים מה הוא יודע ומה הוא עונה.',
      },
      {
        heading: 'איפה הוא עובד',
        content:
          'באתר שלכם, בוואטסאפ, בפייסבוק מסנג׳ר ובאינסטגרם. בוחרים לפי המקום שבו הלקוחות שלכם כבר כותבים.',
      },
    ],
    features: [
      'עונה מיד, בכל שעה',
      'מבין שאלות במילים רגילות',
      'אוסף שם וטלפון ממי שמתעניין',
      'עובד באתר, בוואטסאפ, בפייסבוק ובאינסטגרם',
      'אתם מעדכנים לבד מה הוא עונה',
      'רואים מה שאלו אותו',
    ],
    steps: [
      { title: 'שיחה', line: 'אילו שאלות חוזרות אצלכם, ומה הבוט צריך לעשות.' },
      { title: 'התשובות', line: 'כותבים יחד את מה שהבוט יודע ואיך הוא מדבר.' },
      { title: 'בדיקה', line: 'מנסים אותו יחד לפני שהוא פוגש לקוחות.' },
      { title: 'באוויר', line: 'מחברים לאתר או לוואטסאפ, ומעדכנים לפי מה ששואלים.' },
    ],
    time: 'בוט בסיסי מוכן תוך שבוע. בוט שמתחבר למערכות שכבר יש לכם לוקח 2 עד 3 שבועות.',
    price: [
      'המחיר נקבע לפי מספר המקומות שבהם הבוט עונה, ולפי החיבורים למערכות שכבר יש לכם.',
      'משלמים חצי כשמתחילים, ואת השאר לפני שהבוט עולה לאוויר.',
    ],
    faq: [
      {
        question: 'הבוט יחליף את מי שעונה היום?',
        answer:
          'הוא עונה על השאלות הפשוטות ומעביר אליכם את השאר. ככה הזמן שלכם הולך למה שצריך אתכם.',
      },
      {
        question: 'אפשר לשנות מה הוא עונה?',
        answer:
          'כן. יש מסך פשוט שבו מעדכנים תשובות, מוסיפים שאלות ורואים מה שאלו.',
      },
    ],
    cta: 'רוצים בוט שעונה ללקוחות שלכם?',
    waText: 'היי, אשמח לשמוע על צ׳אטבוט לעסק שלי.',
    brief: true,
    h1: 'בניית |צ׳אטבוט\u00A0לעסק',
    lede: 'הבוט עונה ללקוחות גם כשאתם בפגישה, וגם בלילה. את מי שצריך אתכם הוא מעביר אליכם. בוט בסיסי מוכן תוך שבוע.',
    asks: [
      {
        q: 'על מה |הבוט עונה?',
        a: [
          'הבוט עונה על השאלות שחוזרות אצלכם כל יום, כמו שעות ומחירים. הוא מבין שאלות שנכתבות במילים רגילות, ואין בו תפריט של כפתורים.',
          'שאלה שרק אתם יכולים לענות עליה הוא מעביר אליכם, עם השם והטלפון של מי ששאל.',
        ],
      },
      {
        q: 'איפה |הבוט עובד?',
        a: [
          'הבוט עובד באתר שלכם ובוואטסאפ, וגם בפייסבוק מסנג׳ר ובאינסטגרם. בוחרים לפי המקום שבו הלקוחות שלכם כבר כותבים.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לצ׳אטבוט',
      rows: [
        'כתיבת התשובות יחד איתכם',
        'בדיקה משותפת לפני שהבוט פוגש לקוחות',
        'חיבור לאתר או לוואטסאפ',
        'מסך שבו מעדכנים את התשובות לבד',
        'רשימה של מה ששאלו את הבוט',
      ],
      lines: [
        'המחיר נקבע לפי מספר המקומות שבהם הבוט עונה, ולפי החיבורים למערכות שכבר יש לכם.',
        'בוט שמתחבר למערכות שכבר יש לכם לוקח 2 עד 3 שבועות.',
        'משלמים חצי כשמתחילים, ואת השאר לפני שהבוט עולה לאוויר.',
      ],
    },
  },
  {
    id: 'video-editing',
    slug: 'video-editing',
    title: 'עריכת וידאו',
    shortDescription: 'מהצילומים שלכם לסרטון גמור, ומקלטות ישנות לקובץ שנפתח בטלפון.',
    metaTitle: 'עריכת וידאו והמרת קלטות לדיגיטל',
    metaDescription:
      'עריכת וידאו מהצילומים שלכם לסרטון גמור עם מוזיקה וכתוביות, והמרת קלטות וידאו ישנות (VHS, MiniDV) לקובץ שנפתח בכל טלפון ומחשב.',
    heroSubtitle: 'מהצילומים שלכם לסרטון גמור. ומהקלטות שבמגירה לקובץ שנפתח בטלפון.',
    lottieAnimation: '/animations/10%20design/Web%20Design%20Illustration.json',
    // This animation has 356 vector shape paths across 12 precomps at 60fps:
    // the SVG renderer spent 32s in Style&Layout on this page (TBT 25-54s,
    // Lighthouse perf 37-41). Canvas draws the same artwork with zero DOM cost.
    lottieRenderer: 'canvas',
    lottieSize: 180,
    tags: ['קובץ MP4 לכל מכשיר', 'עד שני סבבי תיקונים', 'המרת קלטות VHS לקובץ'],
    sections: [
      {
        heading: 'עריכה',
        content:
          'שולחים את מה שצילמתם, בטלפון או במצלמה, ומקבלים סרטון גמור עם חיתוכים, מוזיקה, כתוביות ומעברים, לאירוע משפחתי או לעסק.',
      },
      {
        heading: 'המרת קלטות',
        content:
          'יש לכם קלטות VHS, קלטות MiniDV או מדיה ישנה אחרת? ממירים אותן לקובץ דיגיטלי שנפתח בכל טלפון ומחשב, כדי שאפשר יהיה לראות אותן ולשמור עליהן.',
      },
    ],
    features: [
      'חיתוך ועריכה של הצילומים שלכם',
      'מוזיקה וכתוביות',
      'המרת קלטות וידאו ישנות לקובץ',
      'קובץ MP4 שנפתח בכל מכשיר',
    ],
    steps: [
      { title: 'שולחים חומר', line: 'צילומים בקישור, או את הקלטות עצמן.' },
      { title: 'עריכה או המרה', line: 'חותכים, מוסיפים מוזיקה וכתוביות, או ממירים את הקלטות.' },
      { title: 'צפייה ותיקונים', line: 'רואים את הסרטון ומבקשים שינויים. עד שני סבבים כלולים.' },
      { title: 'קובץ סופי', line: 'MP4 שנפתח בכל מכשיר, ובפורמט אחר אם צריך.' },
    ],
    price: [
      'בעריכה, המחיר נקבע לפי אורך הסרטון וכמות החומר.',
      'בהמרת קלטות, המחיר נקבע לפי מספר הקלטות.',
    ],
    faq: [
      {
        question: 'באיזה פורמט אקבל את הסרטון?',
        answer:
          'MP4, שנפתח בכל טלפון ומחשב. צריכים פורמט אחר? אין בעיה.',
      },
      {
        question: 'כמה סבבי תיקונים יש?',
        answer:
          'עד שני סבבי תיקונים כלולים במחיר. שינויים גדולים מעבר לזה מתומחרים מראש.',
      },
    ],
    cta: 'יש לכם צילומים או קלטות שמחכים?',
    waText: 'היי, יש לי צילומים או קלטות ואשמח לשמוע על עריכה או המרה.',
    brief: true,
    // two services of equal weight, so the name has no light part
    h1: 'עריכת וידאו והמרת\u00A0קלטות',
    lede: 'מהצילומים שלכם יוצא סרטון גמור, עם מוזיקה וכתוביות. מהקלטות שבמגירה יוצא קובץ שנפתח בכל טלפון.',
    asks: [
      {
        q: 'מה שולחים |לעריכה?',
        a: [
          'שולחים בקישור את מה שצילמתם, בטלפון או במצלמה. עורכים ממנו סרטון לאירוע משפחתי או לעסק.',
          'את הסרטון רואים לפני שהוא נסגר, ומבקשים שינויים.',
        ],
      },
      {
        q: 'אילו קלטות |אפשר להמיר?',
        // the tapes stand where the tapes are asked about (the wall of VHS tapes the earlier site carried)
        still: { name: 'svc-memories-2', alt: 'קלטות וידאו ישנות' },
        a: [
          'ממירים קלטות VHS וקלטות MiniDV. קלטות מסוג אחר ממירים גם כן.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לעריכת וידאו',
      rows: [
        'חיתוך ועריכה של הצילומים שלכם',
        'מוזיקה וכתוביות',
        'עד שני סבבי תיקונים',
        'קובץ שנפתח בכל טלפון ומחשב',
      ],
      extra: [['שינויים גדולים אחרי שני הסבבים', 'מתומחרים מראש']],
      // one line for both services: it is the answer to the heading over the slip
      lines: [
        'בעריכה המחיר נקבע לפי אורך הסרטון וכמות החומר. בהמרת\u00A0קלטות הוא נקבע לפי מספר הקלטות.',
      ],
    },
  },
  {
    id: 'memory-videos',
    slug: 'memory-videos',
    title: 'סרטוני זיכרונות',
    shortDescription: 'תמונות מהאלבום שחוזרות לזוז.',
    metaTitle: 'סרטון זיכרונות מתמונות ישנות',
    metaDescription:
      'סרטון זיכרונות מתמונות ישנות מהאלבום. כל תמונה זזה, עם מוזיקה וכיתובים, להקרנה ביום הולדת או בחתונה. סרטון רגיל מוכן תוך 5 עד 7 ימי עבודה.',
    heroSubtitle: 'שולחים תמונות מהאלבום, ומקבלים סרטון שבו הן זזות, עם מוזיקה וכיתובים.',
    portfolioLink: '/portfolio/memory-videos/',
    imageIcon: '/animations/photo%20edit.svg',
    lottieSize: 180,
    tags: ['מוכן תוך 5 עד 7 ימי עבודה', '15 עד 30 תמונות לסרטון', 'דוגמה אמיתית מיום הולדת 60'],
    sections: [
      {
        heading: 'מה קורה לתמונות',
        content:
          'שולחים תמונות, ישנות או חדשות, גם סרוקות מאלבום. מסדרים אותן לפי תקופות, מנפישים כל תמונה בעזרת בינה מלאכותית, ומוסיפים מוזיקה וכיתוב קצר לכל תקופה.',
      },
      {
        heading: 'את הסיפור בוחרים אנחנו',
        content:
          'הבינה המלאכותית מזיזה את התמונות. איזו תמונה באה אחרי איזו, ועל איזה שיר, את זה בוחרים בעצמנו, תמונה אחרי תמונה.',
      },
      {
        heading: 'לאירוע',
        content:
          'יום הולדת עגול, חתונה, פרישה או ערב משפחתי. הסרטון לדוגמה הוקרן בערב יום הולדת 60.',
      },
    ],
    features: [
      'הנפשה של כל תמונה',
      'שיפור של תמונות ישנות וסרוקות',
      'מוזיקה שנבחרת לסרטון',
      'כיתוב קצר לכל תקופה',
      'קובץ שמתאים להקרנה באולם ובבית',
    ],
    steps: [
      { title: 'שולחים תמונות', line: 'תמונות מהאלבום או מהטלפון, בקישור או בוואטסאפ.' },
      { title: 'הסיפור', line: 'ממיינים לפי תקופות, ובוחרים את הסדר ואת השיר.' },
      { title: 'הנפשה', line: 'כל תמונה זזה, ומקבלת כיתוב קצר.' },
      { title: 'צפייה ותיקונים', line: 'רואים את הסרטון לפני האירוע, ומבקשים שינויים.' },
    ],
    time: 'סרטון רגיל מוכן תוך 5 עד 7 ימי עבודה. לאירוע קרוב אפשר לזרז, ואז הוא מוכן תוך יומיים או שלושה.',
    price: [
      'המחיר נקבע לפי אורך הסרטון וכמות התמונות.',
      'האירוע קרוב? אומרים מראש, ובודקים יחד אם אפשר לזרז.',
    ],
    faq: [
      {
        question: 'כמה תמונות צריך?',
        answer:
          '15 עד 30 תמונות לסרטון של 2 עד 3 דקות. אפשר גם יותר או פחות, והקצב משתנה בהתאם.',
      },
      {
        question: 'באיזו איכות לשלוח את התמונות?',
        answer:
          'כל איכות. גם תמונה סרוקה מאלבום ישן. משפרים אותה בדרך.',
      },
      {
        question: 'כמה זמן זה לוקח?',
        answer:
          'סרטון רגיל מוכן תוך 5 עד 7 ימי עבודה. לאירוע קרוב אפשר לזרז, ואז הוא מוכן תוך יומיים או שלושה.',
      },
    ],
    cta: 'יש לכם אירוע בקרוב?',
    waText: 'היי, אשמח לשמוע על סרטון זיכרונות מתמונות.',
    brief: true,
    h1: 'סרטון |זיכרונות',
    lede: 'שולחים תמונות מהאלבום, ומקבלים סרטון שבו הן זזות, עם מוזיקה וכיתובים. סרטון רגיל מוכן תוך 5\u00A0עד\u00A07 ימי\u00A0עבודה.',
    asks: [
      {
        q: 'כמה |תמונות צריך?',
        a: [
          '15 עד 30 תמונות מספיקות לסרטון של 2 עד 3 דקות. אפשר לשלוח יותר או פחות, והקצב משתנה בהתאם.',
          'כל איכות מתאימה, גם תמונה סרוקה מאלבום ישן. משפרים אותה בדרך.',
        ],
      },
      {
        // the answer is the film itself; the text under it says only what the film cannot
        q: 'איך נראה |סרטון כזה?',
        sample: true,
        a: [
          'הקטע הזה לקוח מסרטון שהוקרן בערב יום\u00A0הולדת\u00A060. הבינה המלאכותית מזיזה את התמונות. את הסדר שלהן ואת השיר בחרנו בעצמנו, תמונה אחרי תמונה.',
        ],
      },
    ],
    quote: {
      name: 'הצעת מחיר |לסרטון זיכרונות',
      rows: [
        'הנפשה של כל תמונה',
        'שיפור של תמונות ישנות וסרוקות',
        'מוזיקה שנבחרת לסרטון',
        'כיתוב קצר לכל תקופה',
        'קובץ להקרנה באולם ובבית',
      ],
      lines: [
        'המחיר נקבע לפי אורך הסרטון ולפי מספר התמונות.',
        'לאירוע קרוב אפשר לזרז, ואז הסרטון מוכן תוך יומיים או שלושה.',
        'את הסרטון רואים לפני האירוע, ומבקשים שינויים.',
      ],
    },
  },
]

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return servicesData.find((s) => s.slug === slug)
}
