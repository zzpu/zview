import axios from 'axios'
import { getStore, setStore } from './storage'
import store from '@/store'
import { Message } from 'view-design'
import Cookies from 'js-cookie'

// 统一请求路径前缀
let base = '/zmang/v1'
// 超时设定
axios.defaults.timeout = 15000

axios.interceptors.request.use(config => {
  return config
}, err => {
  Message.error('请求超时')
  return Promise.resolve(err)
})

// http response 拦截器
axios.interceptors.response.use(response => {
  const data = response.data
  return data
}, (err) => {
  console.log(err.response.data)

  const data = err.response.data
  // 根据返回的code值来做不同的处理(和后端约定)
  switch (data.error.code) {
    case 401:
      // 未登录 清除已登录状态
      Cookies.set('userInfo', '')
      setStore('accessToken', '')
      if (router.history.current.name !== 'login') {
        if (data.error.message !== null) {
          Message.error(data.error.message)
        } else {
          Message.error('未知错误，请重新登录')
        }
        reject(err)
        router.push('/login')
      }
      break
    case 403:
      Message.error(data.error.message)
      // 没有权限
      if (data.error.message !== null) {
        Message.error(data.error.message)
      } else {
        Message.error('未知错误')
      }
      break
    case 400:
      // 没有权限
      if (data.error.message !== null) {
        Message.error(data.error.message)
      } else {
        Message.error('未知错误')
      }
      break
    case 500:
      // 错误
      if (data.error.message !== null) {
        Message.error(data.error.message)
      } else {
        Message.error('未知错误')
      }
      break
    default:
      return data
  }
  return Promise.resolve(err)
})

export const getRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': accessToken
    }
  })
}

export const postRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substring(0, ret.length - 1)
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  })
}

export const putRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substring(0, ret.length - 1)
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  })
}

export const deleteRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substring(0, ret.length - 1)
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  })
}
export const patchRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'patch',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substring(0, ret.length - 1)
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  })
}
export const putBodyRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    headers: {
      'accessToken': accessToken
    }
  })
}
export const deleteBodyRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params,
    headers: {
      'accessToken': accessToken
    }
  })
}
export const patchBodyRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'patch',
    url: `${base}${url}`,
    data: params,
    headers: {
      'accessToken': accessToken
    }
  })
}
export const postBodyRequest = (url, params) => {
  let accessToken = getStore('accessToken')
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'accessToken': accessToken
    }
  })
}

/**
 * 无需token验证的GET请求 避免旧token过期导致请求失败
 * @param {*} url
 * @param {*} params
 */
export const getNoAuthRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params
  })
}
export const postNoAuthRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      ret = ret.substring(0, ret.length - 1)
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const postNoAuthBodyRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }

  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }

  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }

  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      return { data, status }
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }

  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

export default HttpRequest
