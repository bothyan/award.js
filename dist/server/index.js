'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path2 = require('path');

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _hotReloader = require('./hot-reloader');

var _hotReloader2 = _interopRequireDefault(_hotReloader);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-register')({
    presets: ['react', 'es2015']
});

/**
 * 注册express路由
 * 包括静态资源、react-router、mock数据(api地址)
 */
//server.use('/static', express.static('./client/dist'))

var Server = function () {
    function Server(_ref) {
        var dir = _ref.dir;
        (0, _classCallCheck3.default)(this, Server);

        this.dir = (0, _path2.resolve)(dir);
        this.routes = [];
        this.server = (0, _express2.default)();
    }

    (0, _createClass3.default)(Server, [{
        key: 'getRoutes',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var routes, mocks, pages;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _globPromise2.default)('routes.js', { cwd: this.dir });

                            case 2:
                                routes = _context.sent;
                                _context.next = 5;
                                return (0, _globPromise2.default)('mock/**/*.js', { cwd: this.dir });

                            case 5:
                                mocks = _context.sent;
                                _context.next = 8;
                                return (0, _globPromise2.default)('page/**/*.js', { cwd: this.dir });

                            case 8:
                                pages = _context.sent;


                                if (mocks.length) {
                                    require((0, _path2.join)(this.dir, './mock'))(this.server);
                                }

                                if (routes.length) {
                                    routes = require((0, _path2.join)(this.dir, './routes'));
                                } else {
                                    routes = [];
                                    pages.map(function (item) {
                                        var _path = item.substr(0, item.length - 3).substr(4);
                                        _path = _path.split("/");
                                        _path.shift();

                                        var path = void 0,
                                            page = void 0,
                                            pop = false;

                                        if (_path[_path.length - 1] == 'index') {
                                            _path.pop();
                                            pop = true;
                                        }

                                        if (_path.length) {
                                            var _join = _path.join('/');
                                            path = '/' + _join;
                                            page = _join + (pop ? "/index" : '');
                                        } else {
                                            path = '/';
                                            page = 'index';
                                        }

                                        routes.push({
                                            page: page,
                                            path: path,
                                            exact: true
                                        });
                                    });
                                }

                                return _context.abrupt('return', routes);

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getRoutes() {
                return _ref2.apply(this, arguments);
            }

            return getRoutes;
        }()
    }, {
        key: 'initRouter',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var _this = this;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                this.routes.map(function (item) {
                                    _this.server.get(item.path, function () {
                                        var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
                                            var _Component, _Document, pageSourcePath, documentPath, pagePath, documentFile, Component, Document, props, html, sourcePath, _html;

                                            return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                while (1) {
                                                    switch (_context2.prev = _context2.next) {
                                                        case 0:
                                                            _Component = void 0, _Document = void 0, pageSourcePath = 'bundles/page/' + item.page + '.js';

                                                            if (!(process.env.NODE_ENV !== 'production')) {
                                                                _context2.next = 13;
                                                                break;
                                                            }

                                                            documentPath = (0, _path2.join)(_this.dir, './.server/dist/page/document.js');
                                                            pagePath = (0, _path2.join)(_this.dir, './.server/dist/page/' + item.page + '.js');
                                                            _context2.next = 6;
                                                            return (0, _globPromise2.default)(documentPath);

                                                        case 6:
                                                            documentFile = _context2.sent;


                                                            if (documentFile.length) {
                                                                delete require.cache[require.resolve(documentPath)];
                                                            }

                                                            //这里需要删除require的缓存
                                                            delete require.cache[require.resolve(pagePath)];

                                                            _Document = documentFile.length ? require(documentPath) : require('./document');
                                                            _Component = require(pagePath);

                                                            _context2.next = 15;
                                                            break;

                                                        case 13:

                                                            _Document = require('./dist/page/document.js');
                                                            _Component = require('./dist/page/' + item.page + '.js');

                                                        case 15:
                                                            Component = _Component.default || _Component;
                                                            Document = _Document.default || _Document;

                                                            if (Component.getInitialProps) {
                                                                _context2.next = 21;
                                                                break;
                                                            }

                                                            _context2.t0 = {};
                                                            _context2.next = 24;
                                                            break;

                                                        case 21:
                                                            _context2.next = 23;
                                                            return Component.getInitialProps({ req: req, res: res });

                                                        case 23:
                                                            _context2.t0 = _context2.sent;

                                                        case 24:
                                                            props = _context2.t0;
                                                            html = (0, _render2.default)(Component, props);

                                                            //资源路径

                                                            sourcePath = process.env.NODE_ENV !== 'production' ? '/_client/webpack/' : '/static/';
                                                            _html = (0, _render2.default)(Document, {
                                                                sourcePath: sourcePath,
                                                                page: pageSourcePath,
                                                                comProps: props,
                                                                html: html
                                                            });


                                                            res.send('<!DOCTYPE html>' + _html);

                                                        case 29:
                                                        case 'end':
                                                            return _context2.stop();
                                                    }
                                                }
                                            }, _callee2, _this);
                                        }));

                                        return function (_x, _x2) {
                                            return _ref4.apply(this, arguments);
                                        };
                                    }());
                                });

                                this.server.get('/_client/webpack/main.js', function () {
                                    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
                                        var path;
                                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        path = (0, _path2.join)(_this.dir, '.server', 'main.js');
                                                        _context3.next = 3;
                                                        return (0, _render.serveStatic)(req, res, path);

                                                    case 3:
                                                        return _context3.abrupt('return', _context3.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this);
                                    }));

                                    return function (_x3, _x4) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());

                                this.server.get('/_client/webpack/bundles/page/index.js', function () {
                                    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res) {
                                        var path;
                                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        path = (0, _path2.join)(_this.dir, '.server', 'bundles/page/index.js');
                                                        _context4.next = 3;
                                                        return (0, _render.serveStatic)(req, res, path);

                                                    case 3:
                                                        return _context4.abrupt('return', _context4.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this);
                                    }));

                                    return function (_x5, _x6) {
                                        return _ref6.apply(this, arguments);
                                    };
                                }());

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function initRouter() {
                return _ref3.apply(this, arguments);
            }

            return initRouter;
        }()
    }, {
        key: 'prepare',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                _context6.next = 2;
                                return this.getRoutes();

                            case 2:
                                this.routes = _context6.sent;
                                _context6.next = 5;
                                return this.initRouter();

                            case 5:
                                _context6.next = 7;
                                return new _hotReloader2.default(this.server, this.dir, this.routes).start();

                            case 7:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function prepare() {
                return _ref7.apply(this, arguments);
            }

            return prepare;
        }()
    }, {
        key: 'start',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(prot, hostname) {
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!(process.env.NODE_ENV !== 'production')) {
                                    _context7.next = 3;
                                    break;
                                }

                                _context7.next = 3;
                                return this.prepare();

                            case 3:
                                this.server.listen(4000, function () {
                                    console.log('http://localhost:4000');
                                });

                            case 4:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function start(_x7, _x8) {
                return _ref8.apply(this, arguments);
            }

            return start;
        }()
    }]);
    return Server;
}();

exports.default = Server;