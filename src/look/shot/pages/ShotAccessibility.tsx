// shot · /accessibility: the statement unchanged (AccessibilityBody), in the shot's plain sheet (D90).
import ShotLegal from './ShotLegal'
import { AccessibilityBody } from '../../../components/pages/Accessibility'

export default function ShotAccessibility() {
  return (
    <ShotLegal name="הצהרת נגישות" path="/accessibility" updated="יולי 2026"
      description="הצהרת הנגישות של MediaWave Israel: התאמות הנגישות באתר, רמת התאימות ודרכי פנייה בנושאי נגישות.">
      <AccessibilityBody />
    </ShotLegal>
  )
}
