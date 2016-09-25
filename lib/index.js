'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _handlersRest = require('./handlers/rest');

var Restful = (function () {
    function Restful() {
        _classCallCheck(this, Restful);
    }

    _createClass(Restful, [{
        key: 'configure',
        value: function configure(app, options) {
            app.use((0, _cookieParser2['default'])());
            app.use(_bodyParser2['default'].urlencoded({ extended: false }));
            app.use(_bodyParser2['default'].json());
            (0, _requireAll2['default'])({
                dirname: options.dirname,
                filter: /(.*)\.js$/,
                excludeDirs: /^\.(git|svn)$/,
                recursive: true
            });

            _handlersRest.routers.forEach(function (router) {
                app.use(router);
            });
        }
    }]);

    return Restful;
})();

exports.Rest = _handlersRest.Rest;
exports['default'] = new Restful();