// K · services: the launch hold, one announcement per service.
import LaunchHold from '../scenes/LaunchHold'
import { SERVICES } from '../data'

export default function ServicesLaunch() {
  return (
    <LaunchHold
      sectionId="services"
      holdId="services"
      headingId="services-title"
      heading="מה אנחנו עושים"
      intro="שש הכרזות קטנות." /* [קופי: נתי] */
      items={SERVICES}
      opening={{ kicker: 'הכירו את', line: 'האתר שלכם' }} /* [קופי: נתי] */
      cta={{ label: 'מתחילים פרויקט', placement: 'services' }} /* [קופי: נתי] was "התחל פרויקט" */
      length={['640svh', '580svh']}
    />
  )
}
