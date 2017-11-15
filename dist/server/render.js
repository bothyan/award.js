'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = Render;
exports.serveStatic = serveStatic;

var _react = require('react');

var _server = require('react-dom/server');

var _reactRouterDom = require('react-router-dom');

var _send = require('send');

var _send2 = _interopRequireDefault(_send);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Render(Component, props) {

  var _Component = (0, _react.createElement)(Component, props);

  var render = process.env.NODE_ENV !== 'production' ? _server.renderToStaticMarkup : _server.renderToString;

  return render((0, _react.createElement)(_reactRouterDom.StaticRouter, { context: {} }, _Component));
}

function serveStatic(req, res, path) {
  return new _promise2.default(function (resolve, reject) {
    (0, _send2.default)(req, path).on('directory', function () {
      // We don't allow directories to be read.
      var err = new Error('No directory access');
      err.code = 'ENOENT';
      reject(err);
    }).on('error', reject).pipe(res).on('finish', resolve);
  });
}