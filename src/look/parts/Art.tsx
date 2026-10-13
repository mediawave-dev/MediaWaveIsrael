// An item's real artwork: its Lottie (unchanged, REDESIGN-PROMPT §2) or its static image.
// `active` is for held scenes: only the Lottie on stage plays.

import { LottieIcon } from '../../components/ui/LottieIcon'
import type { ShowItem } from '../data'

export function Art({ item, size, active }: { item: ShowItem; size: number; active?: boolean }) {
  if (item.image) return <img src={item.image} alt="" aria-hidden="true" width={size} height={size} loading="lazy" decoding="async" />
  if (!item.lottie) return null
  return <LottieIcon animationPath={item.lottie} size={size} renderer={item.renderer} playOnHover={false} loop active={active} />
}
