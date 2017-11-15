'use strict';

var _path = require('path');

module.exports = function (content, sourceMap) {
  this.cacheable();

  this.callback(null, content + '\n    (function (Component, route) {\n      \n      module.hot.accept()\n      window.route.update(Component)\n   \n    })(typeof __webpack_exports__ !== \'undefined\' ? __webpack_exports__.default : (module.exports.default || module.exports),\'/\')\n  ', sourceMap);
};