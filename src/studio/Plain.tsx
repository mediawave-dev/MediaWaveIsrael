// The shared content without a style (a placeholder while a style is being built).
import { C } from './content'
import LeadForm from './LeadForm'
import type { StyleProps } from './registry'

export default function Plain({ def }: StyleProps) {
  return (
    <div style={{ padding: '96px 20px 40px', maxWidth: 760, margin: '0 auto' }}>
      <section data-ch="hero"><h1>{C.hero.line1} {C.hero.line2}</h1><p>{C.hero.sub} {C.hero.sub2}</p></section>
      <section data-ch="services"><h2>{C.services.title}</h2><ul>{C.services.items.map((s) => <li key={s.id}>{s.title}: {s.line}</li>)}</ul></section>
      <section data-ch="work"><h2>{C.work.title}</h2><p>{C.work.name}</p></section>
      <section data-ch="process"><h2>{C.process.title}</h2><ol>{C.process.steps.map((s) => <li key={s.id}>{s.title}: {s.line}</li>)}</ol></section>
      <section data-ch="faq"><h2>{C.faq.title}</h2>{C.faq.items.map((f) => <details key={f.id}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>
      <section data-ch="contact"><h2>{C.contact.title}</h2><LeadForm def={def} /></section>
    </div>
  )
}
