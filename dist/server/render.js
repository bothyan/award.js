'use strict';

<<<<<<< HEAD
var _require = require('react'),
    createElement = _require.createElement;

var _require2 = require('react-dom/server'),
    renderToString = _require2.renderToString,
    renderToStaticMarkup = _require2.renderToStaticMarkup;

var _require3 = require('react-router-dom'),
    StaticRouter = _require3.StaticRouter;

module.exports = function Render(Component, props) {

    var _Component = createElement(Component, props);

    var render = process.env.NODE_ENV !== 'production' ? renderToStaticMarkup : renderToString;

    return render(createElement(StaticRouter, { context: {} }, _Component));
};
=======
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Render;

var _react = require('react');

var _server = require('react-dom/server');

var _reactRouterDom = require('react-router-dom');

function Render(Component, props) {

    var _Component = (0, _react.createElement)(Component, props);

    var render = process.env.NODE_ENV !== 'production' ? _server.renderToStaticMarkup : _server.renderToString;

    return render((0, _react.createElement)(_reactRouterDom.StaticRouter, { context: {} }, _Component));
}
>>>>>>> swrn
