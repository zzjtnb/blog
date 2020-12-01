import axios from 'axios'
import store from '../store/index'
import router from '../router/index'//引入路由
import { Message } from 'element-ui'// 这里我是使用elementUI的组件来给提示
import 'element-ui/lib/theme-chalk/index.css';

// 创建一个axios的自定义的实例service，并且可以自定义其配置
const service = axios.create({
  //接口请求地址
  // baseURL: "https://api.github.com",
  //`timeout`选项定义了请求发出的延迟毫秒数。如果请求花费的时间超过延迟的时间，那么请求会被终止
  timeout: 15000,
  // 设置post请求头
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8',
  //   // "Authorization": "token 7f0d015cce46adcf728386abcf3603ecc23934bf"
  // }
})
/**
 * 一些常见的http状态码信息
 */
let httpCode = {
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时'
}

/**
 * 给自定义的axios实例service添加一个请求拦截器
 */
service.interceptors.request.use(config => {
  // 在发送请求之前做些什么，比如传token
  let token = store.state.token.token
  // if (!token) {
  //   config.url = config.url + "?client_id=6cc41e2646130e2f8a0a&client_secret=3bca6288d4d0b1d8c0f996d2933a66606c7eab0d"

  // } else {
  //   config.url = config.url + "?client_id=6cc41e2646130e2f8a0a&client_secret=3bca6288d4d0b1d8c0f996d2933a66606c7eab0d&access_token=" + token
  // }
  if (token) {
    let sp = '?'
    if (config.url.indexOf('?') >= 0) {
      sp = '&'
    }
    config.url = config.url + sp + 'access_token=' + token
  }

  return config
}, error => {
  // 对请求错误做些什么
  console.log(error) // for debug
  return Promise.reject(error);
})
/**
 * 给自定义的axios实例service添加一个响应拦截器
 */
service.interceptors.response.use(response => {
  /*  
  //在这里对返回的数据进行处理
   let responseJson = response.data
  */
  return Promise.resolve(response)
}, error => {
  // 处理断网的情况
  // eg:请求超时或断网时，更新state的network状态
  // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
  // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
  // console.log(window.navigator.onLine)
  if (!window.navigator.onLine) {
    store.commit('NOT_NETWORK', false);
    router.replace({
      path: '/notnetwork',
      // query: { redirect: router.currentRoute.fullPath }//登录成功后跳入浏览的当前页面
    })
  }
  if (error.response) {
    // 根据请求失败的http状态码去给用户相应的提示
    let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
    Message({
      message: tips,
      type: 'error'
    })
    // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
    if (error.response.status === 401) {
      loadingInstance.close()
      router.replace({
        path: '/login',
      })
    }
    return Promise.reject(error)
  } else {
    Message({
      message: '请求超时, 请刷新重试',
      type: 'error'
    })
    return Promise.reject(new Error('请求超时, 请刷新重试'))
  }
})
/**
 * 统一封装get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求时配置]
 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params,
      ...config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 统一封装post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求时配置]
 */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data,
      ...config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 统一封装put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求时配置]
 */
export const put = (url, data, config) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'put',
      url,
      data,
      config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 统一封装PATCH请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求时配置]
 */
export const patch = (url, data, config) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'PATCH',
      url,
      data,
      config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 统一封装DELETE请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求时配置]
 */
export const DELETE = (url, data, config) => {
  return new Promise((resolve, reject) => {
    service({
      method: 'DELETE',
      url,
      data,
      config
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
export default service
