// An item's real artwork: its Lottie (unchanged, REDESIGN-PROMPT §2) or its static image.
// Held scenes pass `active` (only the Lottie on stage plays) and `load` (only the item on
// stage and its neighbours are built; building is the costliest script on a phone).

import { LottieIcon } from '../../components/ui/LottieIcon'
import type { ShowItem } from '../data'

export function Art({ item, size, active, load = true, rest, poster }: { item: ShowItem; size: number; active?: boolean; load?: boolean; rest?: 'first' | 'last'; poster?: { src: string; frame: number } }) {
  if (item.image) return <img src={item.image} alt="" aria-hidden="true" width={size} height={size} loading="lazy" decoding="async" />
  if (!item.lottie) return null
  return <LottieIcon animationPath={item.lottie} size={size} renderer={item.renderer} playOnHover={false} loop active={active} load={load} rest={rest} poster={poster} />
}
