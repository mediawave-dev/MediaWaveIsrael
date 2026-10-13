// M and KM · services: the flight through the floating tools.
import FlightHold from '../scenes/FlightHold'
import { SERVICES } from '../data'

export default function ServicesFlight() {
  return (
    <FlightHold
      sectionId="services"
      holdId="services"
      headingId="services-title"
      heading="מה אנחנו עושים"
      intro="שישה כלים מרחפים. גוללים, וטסים לתוך כל אחד." /* [קופי: נתי] */
      items={SERVICES}
      cta={{ label: 'מתחילים פרויקט', placement: 'services' }} /* [קופי: נתי] was "התחל פרויקט" */
      length={['600svh', '540svh']}
    />
  )
}
