// The five styles as plain data (names, credits, colours), with no code attached: the home page's style
// studio chapter imports this list without pulling any style's chunk. [קופי: נתי] the names and the lines.
export type StyleId = 'flight' | 'buzz' | 'blueprint' | 'clay' | 'depth'

export interface StyleMeta {
  id: StyleId
  /** the style's Hebrew name in the picker */
  name: string
  /** one line on what it feels like */
  feel: string
  /** the award winner it follows (the credit line) */
  credit: string
  creditUrl: string
  /** the picker chip: the style's ground and ink, split like the Horizon disc */
  swatch: [string, string]
  /** the browser's theme colour while the style is on */
  theme: string
  /** the wave between styles: the style's ground, its ink, and the face its name is shown in */
  ground: string
  ink: string
  face: string
  /** the guide's colour when the ink would vanish in its little white world (a light ink on a dark ground) */
  guide?: string
}

export const STYLE_META: StyleMeta[] = [
  { id: 'flight', name: 'מעוף', feel: 'סיפור שנפתח בגלילה', credit: 'The Power of Storytelling', creditUrl: 'https://storytelling.noomoagency.com/', swatch: ['#dcd3f7', '#3a3270'], theme: '#e5def9', ground: '#ddd5f8', ink: '#2e2670', face: '400 1em Bellefair, serif' },
  { id: 'buzz', name: 'זמזום', feel: 'קליל, שיקי ומלא חיים', credit: 'Buzz', creditUrl: 'https://buzz.xyz/', swatch: ['#d7d72e', '#231e1e'], theme: '#d7d72e', ground: '#d7d72e', ink: '#231e1e', face: '700 1em Heebo, sans-serif' },
  { id: 'blueprint', name: 'שרטוט', feel: 'מדויק כמו תוכנית עבודה', credit: 'Heron AI', creditUrl: 'https://heronaiapp.com/', swatch: ['#f5f5ee', '#fa3600'], theme: '#f5f5ee', ground: '#f5f5ee', ink: '#fa3600', face: '700 1em "IBM Plex Sans Hebrew", sans-serif' },
  { id: 'clay', name: 'בוקר', feel: 'חדר רך, אור ראשון וקלטת ישנה', credit: 'Léo Parpeix', creditUrl: 'https://www.leoparpeix.com/', swatch: ['#efe4d4', '#083d2a'], theme: '#efe4d4', ground: '#efe6d8', ink: '#083d2a', face: '700 1em Karantina, sans-serif' },
  // D215: the fifth world, a cloud of points that is scanned as you read (Nati picked it from the SOTD proposals)
  { id: 'depth', name: 'עומק', feel: 'ענן נקודות שנסרק מול העיניים', credit: 'Lidar Drone Scanning', creditUrl: 'https://drone.riotters.com/', swatch: ['#2a3550', '#79a0c5'], theme: '#06080e', ground: '#06080e', ink: '#dce8ff', face: '800 1em Assistant, sans-serif', guide: '#79a0c5' },
]
