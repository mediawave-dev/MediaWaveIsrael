// Dev: every family is loaded and ?look= picks one at boot. Builds alias @look/button to
// button.<look>.ts instead, so production ships one family.
import { LOOK } from './look'
import { ProductButton } from './buttons/ProductButton'
import { LensButton } from './buttons/LensButton'
import { IrisButton } from './buttons/IrisButton'

export const LookButton = LOOK === 'k' ? ProductButton : LOOK === 'm' ? LensButton : IrisButton
