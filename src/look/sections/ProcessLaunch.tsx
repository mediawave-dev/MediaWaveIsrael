// KM · how we work, back on the stage: the launch hold, one announcement per step.
import LaunchHold from '../scenes/LaunchHold'
import { STEPS } from '../data'

export default function ProcessLaunch() {
  return (
    <LaunchHold
      sectionId="process"
      holdId="process"
      headingId="how-we-work-title"
      heading="איך אנחנו עובדים"
      items={STEPS}
      opening={{ kicker: 'ארבעה צעדים', line: 'מהשיחה ועד ההשקה' }} /* [קופי: נתי] */
      cta={{ label: 'דברו איתנו', placement: 'process' }}
      length={['460svh', '420svh']}
    />
  )
}
