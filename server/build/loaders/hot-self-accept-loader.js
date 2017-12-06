
module.exports = function (content, sourceMap) {
  this.cacheable()
  
  this.callback(null, `${content}
    (function (Component) {
      
      module.hot.accept()
      award.routeLoader.update({Component:Component})
   
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports))
  `, sourceMap)
}