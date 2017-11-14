"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestPlugin = function () {
    function TestPlugin() {
        (0, _classCallCheck3.default)(this, TestPlugin);
    }

    (0, _createClass3.default)(TestPlugin, [{
        key: "apply",
        value: function apply(compiler) {

            // compiler.plugin('compile', function () { 
            //     console.log('开始编译')
            // })

            // compiler.plugin('after-compile', function () { 
            //     console.log('TestPlugin执行编译后的代码')
            // })
        }
    }]);
    return TestPlugin;
}();

exports.default = TestPlugin;