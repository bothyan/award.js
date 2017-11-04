'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _hot_client = require('./webpack/hot_client');

var _hot_client2 = _interopRequireDefault(_hot_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var compiler = webpack(_hot_client2.default);

module.exports = function () {
    function HotReloader(server) {
        (0, _classCallCheck3.default)(this, HotReloader);

        this.server = server;
    }

    (0, _createClass3.default)(HotReloader, [{
        key: 'start',
        value: function start() {
            this.server.use(webpackDevMiddleware(compiler, {
                publicPath: _hot_client2.default.output.publicPath,
                noInfo: true,
                stats: {
                    colors: true
                }
            }));

            this.server.use(webpackHotMiddleware(compiler));
        }
    }]);
    return HotReloader;
}();