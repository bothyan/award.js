import { resolve, relative } from 'path'

module.exports = function (content, sourceMap) {
  this.cacheable()
 
  const route = getRoute(this)
  
  this.callback(null, `${content}
    (function (Component, route) {
      
      module.hot.accept()
      swrn.routeLoader.update({Component:Component,route:route})
   
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports),'${route}')
  `, sourceMap)
}

const nextPagesDir = resolve(__dirname, '..', '..', '..', 'pages')

function getRoute (loaderContext) {
  const pagesDir = resolve(loaderContext.options.context, 'pages')
  const { resourcePath } = loaderContext
  const dir = [pagesDir, nextPagesDir]
  .find((d) => resourcePath.indexOf(d) === 0)
  const path = relative(dir, resourcePath)
  return '/' + path.replace(/((^|\/)index)?\.js$/, '')
}