'use strict';

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