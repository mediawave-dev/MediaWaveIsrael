// The privacy consent every form that collects details carries (a required checkbox, the same words as
// LeadModal's). The form owns the state and the check; this draws the box, the link and the error.
// agree.css is neutral (currentColor), so each look and studio world only tunes it where it needs to.
import type { ChangeEvent } from 'react'
import { validationErrors } from '../../utils/validation'
import './agree.css'

interface AgreeProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  /** true after a send without the box ticked */
  error?: boolean
  className?: string
}

export default function Agree({ id, checked, onChange, error = false, className = '' }: AgreeProps) {
  const errId = `${id}-err`
  return (
    <div className={`agree ${className}`.trim()} data-err={error ? '' : undefined}>
      <div className="agree__row">
        <input
          id={id}
          type="checkbox"
          className="agree__box"
          checked={checked}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="agree__label">
          קראתי את <a href="/privacy" target="_blank" rel="noopener noreferrer">מדיניות הפרטיות</a> של האתר והסכמתי לה.
        </label>
      </div>
      {error && <p id={errId} className="agree__err" role="alert">{validationErrors.privacy}</p>}
    </div>
  )
}
