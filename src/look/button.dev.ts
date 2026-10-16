// Dev: every family is loaded and ?look= picks one at boot. Builds alias @look/button to
// button.<look>.ts instead, so production ships one family.
import { LOOK } from './look'
import { ProductButton } from './buttons/ProductButton'
import { LensButton } from './buttons/LensButton'
import { IrisButton } from './buttons/IrisButton'
import { KeyButton } from './buttons/KeyButton'

// shot: the key, "המקש" (DECISIONS #87). km keeps the iris.
export const LookButton = LOOK === 'k' ? ProductButton : LOOK === 'm' ? LensButton : LOOK === 'shot' ? KeyButton : IrisButton
