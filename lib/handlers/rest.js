'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.middleware = middleware;
exports.Rest = Rest;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _express = require('express');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'use'];

var routers = [];

exports.routers = routers;
var MIDDLEWARE = Symbol('MIDDLEWARE');

var ResponseWrapper = (function () {
    function ResponseWrapper(res) {
        _classCallCheck(this, ResponseWrapper);

        this.res = res;
    }

    _createClass(ResponseWrapper, [{
        key: 'status',
        value: function status() {
            this.res.status.apply(this.res, arguments);
            return this;
        }
    }, {
        key: 'render',
        value: function render() {
            return Promise.resolve(this.res.render.apply(this.res, arguments));
        }
    }, {
        key: 'json',
        value: function json() {
            return Promise.resolve(this.res.json.apply(this.res, arguments));
        }
    }, {
        key: 'send',
        value: function send() {
            return Promise.resolve(this.res.send.apply(this.res, arguments));
        }
    }]);

    return ResponseWrapper;
})();

var Handler = (function () {
    function Handler(Class) {
        _classCallCheck(this, Handler);

        this.resource = new Class();
    }

    _createClass(Handler, [{
        key: 'handle',
        value: function handle(req, res, next, action) {
            var _this = this;

            var response = new ResponseWrapper(res);
            Object.defineProperties(this.resource, {
                headers: { value: req.headers, configurable: true },
                query: { value: req.query, configurable: true },
                params: { value: req.params, configurable: true },
                path: { value: req.path, configurable: true },
                body: { value: req.body, configurable: true },
                response: { value: res, configurable: true },
                request: { value: req, configurable: true },
                next: { value: next, configurable: true },
                json: { value: response.json.bind(response), configurable: true },
                send: { value: response.send.bind(response), configurable: true },
                status: { value: response.status.bind(response), configurable: true },
                render: { value: response.render.bind(response), configurable: true }
            });
            var args = Object.keys(this.resource.params).map(function (k) {
                return _this.resource.params[k];
            });
            args.push(req);
            args.push(res);
            args.push(next);
            var resource = this.resource;
            var promise = new Promise(function (resolve, reject) {
                try {
                    resolve(resource[action].apply(resource, args));
                } catch (e) {
                    reject(e);
                }
            });
            promise.then(function (result) {
                if (result instanceof _http2['default'].ServerResponse) {
                    return;
                }
                if (result instanceof Error) {
                    res.status(result.code || 500).json(result);
                } else if (typeof result != 'undefined' && result != null) {
                    res.json(result);
                } else if (result == null && typeof result == 'object') {
                    res.status(404).json({
                        code: 404,
                        message: 'resource not found'
                    });
                }
            })['catch'](function (err) {
                console.info(err);
                try {
                    if (err instanceof Error) {
                        return res.status(err.code || 500).json({
                            error: err.message,
                            errors: err.errors,
                            code: err.code || 500,
                            stack: err.stack.split("\n")
                        });
                    }
                    res.status(500).send(err);
                } catch (e) {
                    console.error(e);
                    res.status(500).send(e);
                }
            });
        }
    }, {
        key: 'getClass',
        value: function getClass() {
            return this.resource.constructor;
        }
    }]);

    return Handler;
})();

function middleware(method) {
    if (!method || !(method instanceof Function)) {
        throw new Error('middleware must be Function');
    }
    return function (self, key, descriptor) {
        if (typeof self.constructor != 'function') {
            throw new Error('middleware must defined on method not on class');
        }
        if (!self.constructor[MIDDLEWARE]) {
            self.constructor[MIDDLEWARE] = [];
        }
        self.constructor[MIDDLEWARE].push(method);
    };
}

function Rest(url) {
    return function (Class, key, descriptor) {
        if (typeof Class != 'function') {
            throw new Error('must be class not a prop..');
        }
        var router = (0, _express.Router)();
        var handler = new Handler(Class);
        methods.forEach(function (action) {
            if (handler.resource[action] instanceof Function) {
                var filters = handler.getClass()[MIDDLEWARE] || [];
                router[action](url, filters, function (req, res, next) {
                    handler.handle(req, res, next, action);
                });
            }
        });
        routers.push(router);
    };
}