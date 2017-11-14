"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Main = function (_React$Component) {
    (0, _inherits3.default)(Main, _React$Component);

    function Main() {
        (0, _classCallCheck3.default)(this, Main);
        return (0, _possibleConstructorReturn3.default)(this, (Main.__proto__ || (0, _getPrototypeOf2.default)(Main)).apply(this, arguments));
    }

    (0, _createClass3.default)(Main, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                html = _props.html,
                comProps = _props.comProps,
                sourcePath = _props.sourcePath,
                page = _props.page;

            return _react2.default.createElement(
                "html",
                null,
                _react2.default.createElement(
                    "head",
                    null,
                    _react2.default.createElement("meta", { charSet: "UTF-8" }),
                    _react2.default.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" }),
                    _react2.default.createElement(
                        "title",
                        null,
                        "React\u540C\u6784\u5F00\u53D1Demo"
                    ),
                    _react2.default.createElement("link", { rel: "stylesheet", href: "//at.alicdn.com/t/font_62vouh9aajug14i.css" }),
                    _react2.default.createElement("link", { rel: "stylesheet", type: "text/css", href: sourcePath + "style/app.css" })
                ),
                _react2.default.createElement("div", { id: "wrap", dangerouslySetInnerHTML: { __html: html } }),
                _react2.default.createElement("div", { id: "data", "data-state": (0, _stringify2.default)(comProps) }),
                _react2.default.createElement("script", { dangerouslySetInnerHTML: {
                        __html: "\n                    module={}\n                    __NEXT_PAGE = []\n                    window.__NEXT_REGISTER_PAGE = function (route,fn) {\n                        __NEXT_PAGE.push(fn())\n                    }\n                " } }),
                _react2.default.createElement("script", { src: sourcePath + "main.js" }),
                _react2.default.createElement("script", { src: "" + sourcePath + page })
            );
        }
    }]);
    return Main;
}(_react2.default.Component);

exports.default = Main;