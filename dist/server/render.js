'use strict';

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