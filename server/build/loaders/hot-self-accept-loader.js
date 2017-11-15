import { resolve, relative } from 'path'

module.exports = function (content, sourceMap) {
  this.cacheable()

    this.callback(null, `${content}
    (function (Component, route) {
      
      module.hot.accept()
      window.route.update(Component)
   
    })(module.exports.default,'/')
  `, sourceMap)
}