'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webpackHmr = require('webpack-hot-middleware/client?overlay=false&reload=true&path=/_client/webpack-hmr');

var _webpackHmr2 = _interopRequireDefault(_webpackHmr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {

    var handlers = {};

    _webpackHmr2.default.subscribe(function () {
        console.log(1);
    });

    // webpackHotMiddlewareClient.subscribe((obj) => {
    //     console.log('222', obj)
    //     const fn = handlers[obj.action]
    //     if (fn) {
    //         const data = obj.data || []
    //         fn(...data)
    //     } else {
    //         throw new Error('Unexpected action ' + obj.action)
    //     }
    // })
};