'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

var _writeFileWebpackPlugin = require('write-file-webpack-plugin');

var _writeFileWebpackPlugin2 = _interopRequireDefault(_writeFileWebpackPlugin);

var _babelCore = require('babel-core');

var babelCore = _interopRequireWildcard(_babelCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(dir, routes) {
        var document, entry, webpackConfig;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _globPromise2.default)('document.js', { cwd: dir });

                    case 2:
                        document = _context.sent;
                        entry = {};


                        if (document.length) {
                            entry.push({
                                'page/document.js': (0, _path.join)(dir, './document.js')
                            });
                        }

                        routes.map(function (item) {
                            entry['page/' + item.page + '.js'] = (0, _path.join)(dir, './page/' + item.page + '.js');
                        });

                        webpackConfig = {
                            entry: entry,
                            output: {
                                path: (0, _path.resolve)(dir, './.server'),
                                filename: "[name]",
                                libraryTarget: 'commonjs2',
                                publicPath: '/_client/webpack/',
                                strictModuleExceptionHandling: true,
                                chunkFilename: '[name]'
                            },
                            module: {
                                loaders: [{
                                    test: /\.(js|jsx)$/,
                                    exclude: /node_modules/,
                                    loader: 'babel-loader',
                                    options: {
                                        presets: []
                                    }
                                }, {
                                    test: /\.scss$/,
                                    exclude: /node_modules/,
                                    loader: _extractTextWebpackPlugin2.default.extract({
                                        fallback: 'style-loader',
                                        use: 'css-loader!sass-loader'
                                    })
                                }]
                            },
                            target: 'node',
                            resolve: {
                                extensions: ['.js', '.jsx']
                            },
                            plugins: [new _extractTextWebpackPlugin2.default('style/[name].css'),

                            // 输出webpack编译的文件
                            new _writeFileWebpackPlugin2.default({
                                exitOnErrors: false,
                                log: false,
                                // required not to cache removed files
                                useHashIndex: false
                            })]
                        };
                        return _context.abrupt('return', (0, _webpack2.default)(webpackConfig));

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function createCompiler(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return createCompiler;
}();