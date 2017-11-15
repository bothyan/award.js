import { resolve, relative } from 'path'

module.exports = function (content, sourceMap) {
  this.cacheable()

    this.callback(null, `${content}
    (function (Component, route) {
      
      module.hot.accept()
      window.route.update(Component)
   
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports),'/')
  `, sourceMap)
}