"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _whatwgFetch = require("whatwg-fetch");

require("abortcontroller-polyfill/dist/abortcontroller-polyfill-only");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

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

    _defineProperty(this, "headers", {
      'Content-Type': 'application/json;charset=UTF-8'
    });

    _defineProperty(this, "beforeSendFunc", function (data) {
      return data;
    });

    _defineProperty(this, "requestQuene", []);

    _defineProperty(this, "checkStatus", function (response) {
      if (!!response && (response.status >= 200 && response.status < 300 || response.status === 400)) {
        return response;
      }

      throw new Error("[J-fetch]".concat(response.statusText));
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
          throw new Error("[J-fetch]");
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
      if (!err.message.includes('J-fetch')) {
        return err;
      }
    });

    var _options$headers = options.headers,
        headers = _options$headers === void 0 ? {} : _options$headers,
        beforeSend = options.beforeSend,
        checkStatus = options.checkStatus,
        handleBody = options.handleBody,
        success = options.success,
        failed = options.failed;
    this.headers = _objectSpread({}, this.headers, headers);
    this.baseUrl = baseUrl;
    if (checkStatus) this.checkStatus = checkStatus;
    if (handleBody) this.handleBody = handleBody;
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
    value: function common(path, data, method) {
      var _this = this;

      var controller = new AbortController();
      var options = {
        method: method,
        headers: this.headers,
        signal: controller.signal
      };

      if (data) {
        options.body = this.beforeSendFunc(JSON.stringify(data));
      }

      this.requestQuene.push(controller);
      return new Promise(function (resolve, reject) {
        abortableFetch("".concat(_this.baseUrl).concat(path), options).then(function (response) {
          return _this.checkStatus(response);
        }).then(function (response) {
          return _this.transferBody(response);
        }).then(function (body) {
          return _this.handleBody(body);
        }).then(function (data) {
          resolve(data);
        }).catch(function (err) {
          if (err.name === 'AbortError') {
            console.log('request aborted');
          }

          _this.failedFunc(err);

          reject(err);
        });
      });
    }
  }]);

  return jFetch;
}();

exports.default = jFetch;