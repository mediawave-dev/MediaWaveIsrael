// shot · /privacy: the legal text unchanged (PrivacyBody), in the shot's plain sheet (D90).
import ShotLegal from './ShotLegal'
import { PrivacyBody } from '../../../components/pages/Privacy'

export default function ShotPrivacy() {
  return (
    <ShotLegal name="מדיניות פרטיות" path="/privacy" updated="ינואר 2026"
      description="מדיניות הפרטיות של MediaWave Israel: כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם.">
      <PrivacyBody />
    </ShotLegal>
  )
}
