'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _document = require('../document');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_routes2.default.map(function (item) {
    var Component = require('../src/page/' + item.page);
    item.Component = Component.default || Component;
});

var InitiAlProps = function InitiAlProps(Component) {
    var Initi = function (_React$Component) {
        (0, _inherits3.default)(Initi, _React$Component);

        function Initi() {
            (0, _classCallCheck3.default)(this, Initi);

            var _this = (0, _possibleConstructorReturn3.default)(this, (Initi.__proto__ || (0, _getPrototypeOf2.default)(Initi)).call(this));

            _this.state = {
                initDone: false
            };
            return _this;
        }

        (0, _createClass3.default)(Initi, [{
            key: 'render',
            value: function render() {
                if (!this.state.initDone) {
                    return _react2.default.createElement(_document.Loading, null);
                }
                return _react2.default.createElement(Component, (0, _extends3.default)({}, this.state, this.props));
            }
        }, {
            key: 'componentDidMount',
            value: function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    if (!_react2.default.load) {
                                        _context.next = 11;
                                        break;
                                    }

                                    _context.t0 = this;
                                    _context.t1 = _extends3.default;
                                    _context.t2 = {};
                                    _context.next = 6;
                                    return Component.getInitialProps();

                                case 6:
                                    _context.t3 = _context.sent;
                                    _context.t4 = (0, _context.t1)(_context.t2, _context.t3);

                                    _context.t0.setState.call(_context.t0, _context.t4);

                                    _context.next = 12;
                                    break;

                                case 11:
                                    _react2.default.load = true;

                                case 12:
                                    this.setState({
                                        initDone: true
                                    });

                                case 13:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function componentDidMount() {
                    return _ref.apply(this, arguments);
                }

                return componentDidMount;
            }()
        }]);
        return Initi;
    }(_react2.default.Component);

    return Initi;
};

var AppContainer = function (_React$Component2) {
    (0, _inherits3.default)(AppContainer, _React$Component2);

    function AppContainer() {
        (0, _classCallCheck3.default)(this, AppContainer);
        return (0, _possibleConstructorReturn3.default)(this, (AppContainer.__proto__ || (0, _getPrototypeOf2.default)(AppContainer)).apply(this, arguments));
    }

    (0, _createClass3.default)(AppContainer, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                _reactRouterDom.BrowserRouter,
                null,
                _react2.default.createElement(
                    _reactRouterDom.Switch,
                    null,
                    _routes2.default.map(function (router, index) {
                        return _react2.default.createElement(_reactRouterDom.Route, { key: index,
                            exact: router.exact,
                            path: router.path,
                            component: function component(props) {
                                return _react2.default.createElement(
                                    'div',
                                    null,
                                    _react2.default.createElement(InitiAlProps(router.Component), (0, _extends3.default)({}, _this3.props, props))
                                );
                            } });
                    })
                )
            );
        }
    }]);
    return AppContainer;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return state || {};
})(AppContainer);