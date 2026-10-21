// The lead form every style shares (each styles it its own way): name, phone, a few words, and the style
// the visitor chose, which opens the WhatsApp message. No endpoint yet: the site's honest fallback.
import { useId, useState, type FormEvent } from 'react'
import { sendLead, styleLine } from './lead'
import type { StyleDef } from './registry'

export default function LeadForm({ def, className = '', send = 'שליחה בוואטסאפ' }: { def: StyleDef; className?: string; send?: string }) {
  const id = useId().replace(/:/g, '')
  const [f, setF] = useState({ name: '', phone: '', message: '' })
  const [err, setErr] = useState('')
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((o) => ({ ...o, [k]: e.target.value }))
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.name.trim() && !f.message.trim()) { setErr('כתבו שם או כמה מילים, ונמשיך משם.'); return }
    setErr('')
    sendLead(def, f)
  }
  return (
    <form className={`st-form ${className}`.trim()} onSubmit={submit} noValidate>
      <p className="st-form__style">( {styleLine(def)} )</p>
      <div className="st-form__row">
        <label htmlFor={`${id}-n`}>שם</label>
        <input id={`${id}-n`} name="name" autoComplete="name" value={f.name} onChange={set('name')} />
      </div>
      <div className="st-form__row">
        <label htmlFor={`${id}-p`}>טלפון</label>
        <input id={`${id}-p`} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={f.phone} onChange={set('phone')} />
      </div>
      <div className="st-form__row">
        <label htmlFor={`${id}-m`}>כמה מילים על העסק</label>
        <textarea id={`${id}-m`} name="message" rows={3} value={f.message} onChange={set('message')} />
      </div>
      {err && <p className="st-form__err" role="alert">{err}</p>}
      <button type="submit" className="st-form__send">{send}</button>
    </form>
  )
}
