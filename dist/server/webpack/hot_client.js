'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = createCompiler;

var _globPromise = require('glob-promise');

var _globPromise2 = _interopRequireDefault(_globPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
function createCompiler(dir) {
    var _this = this;

    var entry = function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var entries, pages, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, p;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            entries = {
                                app: '../../client/index.js',
                                vendor: [// 这里是依赖的库文件配置，和CommonsChunkPlugin配合使用可以单独打包
                                'react', 'react-dom', 'react-redux', 'redux', 'redux-saga', 'axios']
                            };
                            _context.next = 3;
                            return (0, _globPromise2.default)('page/**/*.js', { cwd: dir });

                        case 3:
                            pages = _context.sent;
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 7;


                            for (_iterator = (0, _getIterator3.default)(pages); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                p = _step.value;

                                entries[p] = path.join(dir, './' + p);
                            }

                            _context.next = 15;
                            break;

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](7);
                            _didIteratorError = true;
                            _iteratorError = _context.t0;

                        case 15:
                            _context.prev = 15;
                            _context.prev = 16;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 18:
                            _context.prev = 18;

                            if (!_didIteratorError) {
                                _context.next = 21;
                                break;
                            }

                            throw _iteratorError;

                        case 21:
                            return _context.finish(18);

                        case 22:
                            return _context.finish(15);

                        case 23:
                            return _context.abrupt('return', entries);

                        case 24:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[7, 11, 15, 23], [16,, 18, 22]]);
        }));

        return function entry() {
            return _ref.apply(this, arguments);
        };
    }();

    var webpackConfig = {
        context: dir,
        entry: entry,
        output: {
            path: path.resolve(dir, "./_next"),
            filename: "[name]",
            chunkFilename: '[name]'
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            loaders: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["react", "es2015", "stage-0"],
                    plugins: ["transform-runtime"]
                }
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }]
        },
        plugins: [new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'main.js'
        }),

        //js代码压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //     //supresses warnings, usually from module minification
        //     warnings: false
        //     },
        //     beautify:false,
        //     comments:false
        // }),

        // // 定义为生产环境，编译 React 时压缩到最小
        new webpack.DefinePlugin({
            'process.env': {
                // 'NODE_ENV': JSON.stringify('production')
                'dir': (0, _stringify2.default)(dir)
            }
        }), new ExtractTextPlugin('[name].css'), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]
    };
    return webpack(webpackConfig);
}