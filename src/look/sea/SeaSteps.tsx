// The contact form in the sea, one question at a time (D208, Nati picked "C" of three: "one question, big
// type"). A screen per question in the display face, the answer typed large on a dotted line, a row of dots
// that fills as the visitor writes, "01 / 03" in mono. Enter (or [ הבא ]) checks the answer and moves on;
// the answers already given gather below as rows, and a tap on one goes back to it. The message takes
// Enter as a new line and Ctrl/Cmd+Enter to send. Contact.tsx keeps the data, the validation and the send.
// The questions and their small lines: approved by Nati (22.10, "הכל מאושר")
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { LookButton } from '@look/button'
import type { BtnState } from '../buttons/StateButton'
import { isValidEmail, isValidMessage, isValidName, validationErrors } from '../../utils/validation'
import { ok as okSound, select as selectSound } from './sound'

export type StepField = 'name' | 'email' | 'message'
const ORDER: StepField[] = ['name', 'email', 'message']
const SHORT: Record<StepField, string> = { name: 'שם', email: 'אימייל', message: 'הודעה' }
/** characters that fill a question's five dots */
const FILL: Record<StepField, number> = { name: 10, email: 18, message: 60 }

interface Props {
  data: Record<StepField, string>
  errors: Partial<Record<StepField, string>>
  setErrors: (e: Partial<Record<StepField, string>>) => void
  change: (f: StepField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  needEmail: boolean
  state: BtnState
  submitLabel: string
}

export default function SeaSteps({ data, errors, setErrors, change, needEmail, state, submitLabel }: Props) {
  const [step, setStep] = useState(0)
  const [moved, setMoved] = useState(false)
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const f = ORDER[step]
  const last = step === ORDER.length - 1

  const question: Record<StepField, { q: string; sub?: string }> = {
    name: { q: 'מה השם שלכם?' },
    email: { q: 'לאן נחזור אליכם?', sub: needEmail ? 'כתובת אימייל.' : 'כתובת אימייל. לא חובה, אפשר לדלג.' },
    message: { q: 'מה העסק צריך?', sub: 'כמה מילים על העסק ומה חסר לו.' },
  }
  const valid = (k: StepField) => {
    const v = data[k]
    if (k === 'name') return isValidName(v)
    if (k === 'email') return needEmail ? isValidEmail(v) : v.trim() === '' || isValidEmail(v)
    return isValidMessage(v)
  }

  // a failed send (Contact validates everything) brings the visitor to the first question with an error
  useEffect(() => {
    const bad = ORDER.findIndex((k) => errors[k])
    if (bad >= 0 && bad !== step) { setStep(bad); setMoved(true) }
  }, [errors]) // eslint-disable-line react-hooks/exhaustive-deps
  // after a send the data is empty again: back to the first question, without taking the focus (on a phone
  // that would open the keyboard just as the little world arrives, D209)
  useEffect(() => { if (state === 'sent') { setMoved(false); setStep(0) } }, [state])
  // the field of a question the visitor moved to takes the focus (never on arrival: no keyboard uninvited)
  useEffect(() => {
    if (!moved) return
    field.current?.focus({ preventScroll: true })
    field.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [step, moved])

  const go = (i: number) => { setStep(i); setMoved(true); selectSound() }
  const next = () => {
    if (!valid(f)) { setErrors({ [f]: validationErrors[f] }); return }
    setErrors({})
    okSound()
    go(step + 1)
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return
    const area = f === 'message'
    if (area && !(e.ctrlKey || e.metaKey)) return
    e.preventDefault()
    if (last) e.currentTarget.form?.requestSubmit()
    else next()
  }

  const id = `contact-${f}`
  const err = errors[f]
  const shared = {
    id, name: f, value: data[f], onChange: change(f), onKeyDown: onKey, ref: field, className: 'qs__field',
    required: f !== 'email' || needEmail, 'aria-invalid': err ? true : undefined, 'aria-describedby': err ? `${id}-err` : undefined,
  }
  // five dots a question: the answered ones full, the current one by what is typed so far
  const dots = ORDER.flatMap((k, i) => {
    const n = i < step && valid(k) && data[k].trim() ? 5 : i === step ? Math.min(5, Math.ceil((data[k].length / FILL[k]) * 5)) : 0
    return [0, 1, 2, 3, 4].map((d) => (d < n ? (i < step ? 'f' : 'h') : ''))
  })
  const answered = ORDER.map((k, i) => ({ k, i })).filter(({ k, i }) => i !== step && data[k].trim())

  return (
    <>
      <div className="qs__top">
        <span className="qs__n" lang="en" dir="ltr">{`0${step + 1} / 0${ORDER.length}`}</span>
        <span className="qs__dots" aria-hidden="true">{dots.map((c, i) => <i key={i} className={c || undefined} />)}</span>
      </div>
      <div className="qs__q" key={f} data-err={err ? '' : undefined}>
        <label htmlFor={id} className="qs__label">
          {question[f].q}
          {question[f].sub && <small>{question[f].sub}</small>}
        </label>
        {f === 'message'
          ? <textarea rows={3} {...shared} />
          : f === 'email'
            ? <input type="email" dir="ltr" inputMode="email" autoComplete="email" enterKeyHint={last ? 'send' : 'next'} {...shared} />
            : <input type="text" autoComplete="name" enterKeyHint="next" {...shared} />}
        {err && <p id={`${id}-err`} className="ct__err">{err}</p>}
      </div>
      <div className="qs__next">
        <span className="qs__hint" lang="en" dir="ltr" aria-hidden="true">{f === 'message' ? 'CTRL + ENTER ↵' : 'ENTER ↵'}</span>
        {last
          ? <LookButton type="submit" state={state} live zone="text">{submitLabel}</LookButton>
          : <LookButton type="button" onClick={next} zone="text">הבא</LookButton>}
      </div>
      {answered.length > 0 && (
        <ul className="qs__done">
          {answered.map(({ k, i }) => (
            <li key={k}>
              <button type="button" onClick={() => go(i)} aria-label={`${SHORT[k]}: ${data[k]}. עריכה`}>
                <span>{SHORT[k]}</span>
                <b dir="auto">{data[k]}</b>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
