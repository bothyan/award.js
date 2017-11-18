import { createElement } from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import send from 'send'

export default function Render(Component, props) {

    const render = process.env.NODE_ENV !== 'production' ? renderToStaticMarkup : renderToString

    return render(createElement(Component, props))
}

export function serveStatic (req, res, path) {
    return new Promise((resolve, reject) => {
      send(req, path)
      .on('directory', () => {
        // We don't allow directories to be read.
        const err = new Error('No directory access')
        err.code = 'ENOENT'
        reject(err)
      })
      .on('error', reject)
      .pipe(res)
      .on('finish', resolve)
    })
  }