import { resolve } from 'path'
import del from 'del'

export default async function clean({ dir, dist }) {
  return del(resolve(dir, `./${dist}`), { force: true })
}
