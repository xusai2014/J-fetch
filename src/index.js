import 'whatwg-fetch'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import { fetch } from 'whatwg-fetch'

// use native browser implementation if it supports aborting
const abortableFetch = ('signal' in new Request('')) ? window.fetch : fetch;

export default class jFetch {
  constructor(baseUrl, options) {
    const {
      headers = {},
      beforeSend,
      checkStatus,
      handleData,
      success,  //priority 最高
      failed,
      mode
    } = options;

    this.headers = {
      ...this.headers,
      ...headers
    };

    this.mode = mode;

    this.baseUrl = baseUrl;
    if (checkStatus) this.checkStatus = checkStatus;
    if (handleData) this.handleBody = handleData;
    if (success) this.successFunc = success;
    if (failed) this.failedFunc = failed;
    if (beforeSend) this.beforeSendFunc = beforeSend;
  }

  mode = 'cors';

  baseUrl = '/'
  headers = {
    'Content-Type':'application/json;charset=UTF-8'
  }

  beforeSendFunc = async (data,headers) => ({data,headers})

  requestQuene = []

  checkStatus = (response) => {
    if (!!response && ((response.status >= 200 && response.status < 300) || response.status === 400)) {
      return response;
    }
    throw new Error(response.statusText);
  }

  transferBody = (response) => {
    const contentType = response.headers.get('content-type');
    if(contentType.includes('application/json')){
      return response.json();
    } else if(contentType.includes('text/html')){
      return response.text();
    } else {
      try {
        return response.json();
      } catch (e) {
        throw new Error(`[J-fetch]-transferBody`);
      }
    }
  }


  handleBody = (body) => body
  successFunc = (data) => data
  failedFunc = (err) => {
    return err;
  }

  get(path) {
    return this.common(path, '', 'GET');
  }

  post(path, data) {
    return this.common(path, data, 'POST');
  }

  put(path, data) {
    return this.common(path, data, 'PUT');
  }

  delete(path, data) {
    return this.common(path, data, 'DELETE')
  }

  abort() {
    this.requestQuene.map((v, k) => v.abort());
  }

  async common(path, data, method) {
    const controller = new AbortController()
    let options = {
      method: method,
      headers: this.headers,
      signal: controller.signal
    }
    if (data) {
      const { data:bodyData, headers = {},mode = 'cors'}= await this.beforeSendFunc(JSON.stringify(data));
      options.body = bodyData;
      options.headers = {
        ...options.headers,
        ...headers,
      }
      options.mode = this.mode;
    }
    this.requestQuene.push(controller);
    return new Promise((resolve, reject) => {
      abortableFetch(`${this.baseUrl}${path}`, options)
        .then((response) => {
          return this.checkStatus(response)
        }).then((response) => this.transferBody(response))
        .then((body) => this.handleBody(body))
        .then((data) => {
          this.successFunc(data);
          resolve(data);
        })
        .catch((err) => {
          // 请求终止异常 错误静默
          if (err.name === 'AbortError' ) {
            console.log('request aborted')
            return;
          }
          // 框架健壮性 错误静默
          if (!err.message.includes('J-fetch')) {
            console.log('J-fetch Exception')
            return;
          }
          this.failedFunc(err)
          reject(err)
        });
    })
  }
}