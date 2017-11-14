import { resolve } from 'path'
import del from 'del'

export default async function clean (dir) {
  return del(resolve(dir,'./server'), { force: true })
}
