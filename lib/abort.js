"use strict";

require("abortcontroller-polyfill/dist/abortcontroller-polyfill-only");

var _whatwgFetch = require("whatwg-fetch");

// use native browser implementation if it supports aborting
var abortableFetch = 'signal' in new Request('') ? window.fetch : _whatwgFetch.fetch;
var controller = new AbortController();
abortableFetch('/avatars', {
  signal: controller.signal
}).catch(function (ex) {
  if (ex.name === 'AbortError') {
    console.log('request aborted');
  }
}); // some time later...

controller.abort();