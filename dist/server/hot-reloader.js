'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpack = require('./build/webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _clean = require('./build/clean');

var _clean2 = _interopRequireDefault(_clean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HotReloader = function () {
    function HotReloader(server, dir, routes) {
        (0, _classCallCheck3.default)(this, HotReloader);

        this.server = server;
        this.dir = dir;
        this.routes = routes;
    }

    (0, _createClass3.default)(HotReloader, [{
        key: 'start',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _ref2, _ref3, compiler;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _promise2.default.all([(0, _webpack2.default)(this.dir, this.routes), (0, _clean2.default)(this.dir)]);

                            case 2:
                                _ref2 = _context.sent;
                                _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
                                compiler = _ref3[0];


                                this.server.use((0, _webpackDevMiddleware2.default)(compiler, {
                                    publicPath: '/_client/webpack/',
                                    noInfo: true,
                                    quiet: true,
                                    clientLogLevel: 'warning'
                                }));

                                this.server.use((0, _webpackHotMiddleware2.default)(compiler, {
                                    path: '/_client/webpack-hmr',
                                    log: false,
                                    heartbeat: 2500
                                }));

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function start() {
                return _ref.apply(this, arguments);
            }

            return start;
        }()
    }]);
    return HotReloader;
}();

exports.default = HotReloader;