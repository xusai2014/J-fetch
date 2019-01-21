"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _whatwgFetch = require("whatwg-fetch");

require("abortcontroller-polyfill/dist/abortcontroller-polyfill-only");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// use native browser implementation if it supports aborting
var abortableFetch = 'signal' in new Request('') ? window.fetch : _whatwgFetch.fetch;

var jFetch =
/*#__PURE__*/
function () {
  function jFetch(baseUrl, options) {
    _classCallCheck(this, jFetch);

    _defineProperty(this, "mode", 'cors');

    _defineProperty(this, "baseUrl", '/');

    _defineProperty(this, "headers", {
      'Content-Type': 'application/json;charset=UTF-8'
    });

    _defineProperty(this, "beforeSendFunc",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(data, headers) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", {
                  data: data,
                  headers: headers
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "requestQuene", []);

    _defineProperty(this, "checkStatus", function (response) {
      if (!!response && (response.status >= 200 && response.status < 300 || response.status === 400)) {
        return response;
      }

      throw new Error(response.statusText);
    });

    _defineProperty(this, "transferBody", function (response) {
      var contentType = response.headers.get('content-type');

      if (contentType.includes('application/json')) {
        return response.json();
      } else if (contentType.includes('text/html')) {
        return response.text();
      } else {
        try {
          return response.json();
        } catch (e) {
          throw new Error("[J-fetch]-transferBody");
        }
      }
    });

    _defineProperty(this, "handleBody", function (body) {
      return body;
    });

    _defineProperty(this, "successFunc", function (data) {
      return data;
    });

    _defineProperty(this, "failedFunc", function (err) {
      return err;
    });

    var _options$headers = options.headers,
        _headers = _options$headers === void 0 ? {} : _options$headers,
        beforeSend = options.beforeSend,
        checkStatus = options.checkStatus,
        handleData = options.handleData,
        success = options.success,
        failed = options.failed,
        mode = options.mode;

    this.headers = _objectSpread({}, this.headers, _headers);
    this.mode = mode;
    this.baseUrl = baseUrl;
    if (checkStatus) this.checkStatus = checkStatus;
    if (handleData) this.handleBody = handleData;
    if (success) this.successFunc = success;
    if (failed) this.failedFunc = failed;
    if (beforeSend) this.beforeSendFunc = beforeSend;
  }

  _createClass(jFetch, [{
    key: "get",
    value: function get(path) {
      return this.common(path, '', 'GET');
    }
  }, {
    key: "post",
    value: function post(path, data) {
      return this.common(path, data, 'POST');
    }
  }, {
    key: "put",
    value: function put(path, data) {
      return this.common(path, data, 'PUT');
    }
  }, {
    key: "delete",
    value: function _delete(path, data) {
      return this.common(path, data, 'DELETE');
    }
  }, {
    key: "abort",
    value: function abort() {
      this.requestQuene.map(function (v, k) {
        return v.abort();
      });
    }
  }, {
    key: "common",
    value: function () {
      var _common = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(path, data, method) {
        var _this = this;

        var controller, options, _ref2, _data, _ref2$headers, headers, _ref2$mode, mode;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                controller = new AbortController();
                options = {
                  method: method,
                  headers: this.headers,
                  signal: controller.signal
                };

                if (!data) {
                  _context2.next = 14;
                  break;
                }

                _context2.next = 5;
                return this.beforeSendFunc(JSON.stringify(_data));

              case 5:
                _ref2 = _context2.sent;
                _data = _ref2.data;
                _ref2$headers = _ref2.headers;
                headers = _ref2$headers === void 0 ? {} : _ref2$headers;
                _ref2$mode = _ref2.mode;
                mode = _ref2$mode === void 0 ? 'cors' : _ref2$mode;
                options.body = _data;
                options.headers = _objectSpread({}, options.headers, headers);
                options.mode = this.mode;

              case 14:
                this.requestQuene.push(controller);
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  abortableFetch("".concat(_this.baseUrl).concat(path), options).then(function (response) {
                    return _this.checkStatus(response);
                  }).then(function (response) {
                    return _this.transferBody(response);
                  }).then(function (body) {
                    return _this.handleBody(body);
                  }).then(function (data) {
                    _this.successFunc(data);

                    resolve(data);
                  }).catch(function (err) {
                    // 请求终止异常 错误静默
                    if (err.name === 'AbortError') {
                      console.log('request aborted');
                      return;
                    } // 框架健壮性 错误静默


                    if (!err.message.includes('J-fetch')) {
                      console.log('J-fetch Exception');
                      return;
                    }

                    _this.failedFunc(err);

                    reject(err);
                  });
                }));

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function common(_x3, _x4, _x5) {
        return _common.apply(this, arguments);
      }

      return common;
    }()
  }]);

  return jFetch;
}();

exports.default = jFetch;