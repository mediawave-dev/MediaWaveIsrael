// shot · /terms: the legal text unchanged (TermsBody), in the shot's plain sheet (D90).
import ShotLegal from './ShotLegal'
import { TermsBody } from '../../../components/pages/Terms'

export default function ShotTerms() {
  return (
    <ShotLegal name="תקנון שימוש" path="/terms" updated="ינואר 2026"
      description="תקנון השימוש של MediaWave Israel: תנאי שימוש באתר ושירותי פיתוח אתרים.">
      <TermsBody />
    </ShotLegal>
  )
}
