import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { fetch } from 'whatwg-fetch'

// use native browser implementation if it supports aborting
const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch

const controller = new AbortController()

abortableFetch('/avatars', {
  signal: controller.signal
}).catch(function (ex) {
  if (ex.name === 'AbortError') {
    console.log('request aborted')
  }
})

// some time later...
controller.abort()