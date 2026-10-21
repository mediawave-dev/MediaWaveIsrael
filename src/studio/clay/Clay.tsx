// placeholder until the style is built: the shared content, plain
import Plain from '../Plain'
import type { StyleProps } from '../registry'

export default function Clay(props: StyleProps) {
  return <Plain {...props} />
}
