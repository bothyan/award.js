'use strict';

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('react-hot-loader/patch');

var _webpackHmr = require('webpack-hot-middleware/client?overlay=false&reload=true&path=/_client/webpack-hmr');

var _webpackHmr2 = _interopRequireDefault(_webpackHmr);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactHotLoader = require('react-hot-loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//获取服务器数据
var AppDOM = document.getElementById('wrap');
// const Obj = document.getElementById('data')
// const DataState = JSON.parse(Obj.getAttribute("data-state"))
// Obj.remove()

// ReactDOM.render(
//     <App {...DataState}/>   
//     ,
//     AppDOM
// )

var Loading = function () {
    function Loading() {
        (0, _classCallCheck3.default)(this, Loading);

        this.subscriptions = new _set2.default();
    }

    (0, _createClass3.default)(Loading, [{
        key: 'subscribe',
        value: function subscribe(fn) {
            var _this = this;

            this.subscriptions.add(fn);
            return function () {
                return _this.subscriptions.delete(fn);
            };
        }
    }, {
        key: 'update',
        value: function update(Component) {
            this.notify(Component);
        }
    }, {
        key: 'notify',
        value: function notify(data) {
            this.subscriptions.forEach(function (fn) {
                return fn(data);
            });
        }
    }]);
    return Loading;
}();

var route = new Loading();

route.subscribe(function (Component) {
    render(Component);
});

window.route = route;

function render(Component) {
    _reactDom2.default.render(_react2.default.createElement(
        _reactHotLoader.AppContainer,
        null,
        _react2.default.createElement(Component)
    ), AppDOM);
}