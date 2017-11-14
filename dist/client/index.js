'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = require('../src/store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//获取服务器数据
var AppDOM = document.getElementById('wrap');
var Obj = document.getElementById('data');
var DataState = JSON.parse(Obj.getAttribute("data-state"));
Obj.remove();

//存储store
_react2.default.load = false;
var store = (0, _store2.default)(DataState);

_reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(_app2.default, null)
), AppDOM);