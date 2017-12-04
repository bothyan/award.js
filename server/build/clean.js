import { resolve } from 'path'
import del from 'del'

export default async function clean({ dir, dist }) {
  return del(resolve(dir, `./${dist}`), { force: true })
}

export async function cleanBundles({ dir, dist }) {
  return del(resolve(dir, `./${dist}/bundles`), { force: true })
}

export async function cleanFile({ dir, dist, fileName }) { 
  return del(resolve(dir, `./${dist}/${fileName}`), { force: true })  
}