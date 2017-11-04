'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();
var argv = (0, _minimist2.default)(process.argv.slice(2), {
    alias: {
        h: 'help',
        H: 'hostname',
        p: 'port'
    },
    boolean: ['h'],
    string: ['H'],
    default: { p: 3000 }
});
var dir = (0, _path.resolve)(argv._[0] || '.');

var routes = require((0, _path.join)(dir, './routes'));

/**
 * 注册express路由
 * 包括静态资源、react-router、mock数据(api地址)
 */
//server.use('/static', express.static('./client/dist'))
require((0, _path.join)(dir, './mock'))(server);
var HotReloader = require('./hot-reloader');

if (process.env.NODE_ENV !== 'production') {
    var hot = new HotReloader(server);
    hot.start();
}

routes.map(function (item) {
    server.get(item.path, function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
            var _Component, _Document, Component, Document, props, html, sourcePath, _html;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _Component = void 0, _Document = void 0;

                            if (process.env.NODE_ENV !== 'production') {
                                //这里需要删除require的缓存
                                delete require.cache[require.resolve('../.server/page/' + item.page + '.js')];
                                delete require.cache[require.resolve('../.server/page/document.js')];

                                _Document = require('../.server/page/document.js');
                                _Component = require('../.server/page/' + item.page + '.js');
                            } else {

                                _Document = require('./dist/page/document.js');
                                _Component = require('./dist/page/' + item.page + '.js');
                            }

                            Component = _Component.default || _Component;
                            Document = _Document.default || _Document;
                            _context.next = 6;
                            return Component.getInitialProps({ req: req, res: res });

                        case 6:
                            props = _context.sent;
                            html = (0, _render2.default)(Component, props);

                            //资源路径

                            sourcePath = process.env.NODE_ENV !== 'production' ? '/_client/webpack/' : '/static/';
                            _html = (0, _render2.default)(Document, {
                                sourcePath: sourcePath,
                                comProps: props,
                                html: html
                            });


                            res.send('<!DOCTYPE html>' + _html);

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
});

server.listen(4000, function () {
    console.log('http://localhost:4000');
});