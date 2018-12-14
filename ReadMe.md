# jFetch

 😀 封装[whatwg-fetch](https://github.com/whatwg/fetch),这是一个解决低版本浏览器不支持fetch的垫片。
 
 ## 使用方法
 
 #### 安装
 ```
yarn add @jerry521/j-fetch

```
#### 示例
```javascript
import jFetch from '@jerry521/j-fetch';

 const fetchInstace  = new jFetch('https://api.url',{
  // 非必配置项,默认 'Content-Type':'application/json;charset=UTF-8'，可覆盖
  headers:{
    'Custoum-x':'token'
  },
  // 非必配置项 
  beforeSend:(data)=>{
    // 回调统一处理组装参数，它是JSON字符串
    const obj =JSON.parse(data);
    Object.defineProperty(obj,'version',{ value:'1.0.0'})
    return JSON.stringify(obj);
    
  },
  // 非必配置项，默认 200-300 或者 400 是网络成功，其余按网络异常处理，可覆盖
  checkStatus:(response)=>{
    // TODO HTTP STATUS
  },
  // 非必配置项
  handleData:(data)=>{
    // TODO 处理data，得到result，例如解密报文、根据返回业务编码抛出异常
    
    return result
  },
  // 非必配置项
  success:(data)=>{
    // TODO 请求成功后数据统一处理方案，例如 提示请求成功提示
    Toast.info('成功')
    
  },    
  failed:(err)=>{
    // TODO 请求失败处理逻辑
    Toast.failed(err.message);
  },
  
})

// 请求示例
fetchInstace.get('/users').then(()=>{},()=>{})
.catch(()=>{})
fetchInstace.post('/user',{ name:'jerry', gender:'0'})
.then(()=>{},()=>{}).catch(()=>{})

// 卸载网络请求

fetchInstace.abort();
 

// 高级配置，详情参见 whatwg/fetch 规范



```
#### File upload
```javascript
var input = document.querySelector('input[type="file"]')

var data = new FormData()
data.append('file', input.files[0])
data.append('user', 'hubot')

fetchInstace('/avatars', {
  method: 'POST',
  body: data
})
```



 ## 网络请求库探究
 
 fetch需要浏览器支持，由于低版本浏览器是通过垫片形式抹平浏览器差异，在这个过程中使用promise
 帮助我们处理异步问题。但是部分浏览器不支持promise ，因此需要有诉求兼容低版本浏览器使用过程中
 提前添加 promise垫片。
 
 + [fetch 详解](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
 + [Promise 详解](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 
 ## 为什么使用 fetch
 
 + Fetch是获取资源的API（不限于 网络资源） ***后续补充其它功能***
 + Fetch是面向Javascript平台的统一API，适用场景广阔
 + Fetch是一个功能强大、灵活的功能集合（与XMLHttpRequest相比较而言）
 + Fetch对HTTP接口抽象出了 Request，Response，Headers，Body
 
 
 