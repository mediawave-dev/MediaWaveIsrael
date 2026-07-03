/**
 * GrainOverlay — global film-grain layer (DESIGN-UPGRADE §3.3).
 * A static, pre-baked 128px noise tile (public/images/grain.png) on a fixed
 * compositor layer. NOT live feTurbulence — that kills paint on mobile.
 * Zero animation, zero JS after mount.
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />
}
