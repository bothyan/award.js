'use strict';

var _path = require('path');

module.exports = function (content, sourceMap) {
  this.cacheable();

  this.callback(null, content + '\n    (function (Component, route) {\n      \n      module.hot.accept()\n      window.route.update(Component)\n   \n    })(module.exports.default,\'/\')\n  ', sourceMap);
};