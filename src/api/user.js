import axios from '@/libs/api.request'
import { getNoAuthRequest, getRequest, postNoAuthBodyRequest } from '@/libs/axios'
import { postRequest } from '../libs/axios'
// postRequest
// 验证码渲染图片接口
export const drawCodeImage = '/zmang/v1/pub/captcha?id='

export const login = ({ userName, password, captchaId, captchaCode }) => {
  const data = {
    user_name: userName,
    password: password,
    captcha_code: captchaCode,
    captcha_id: captchaId
  }
  return postNoAuthBodyRequest('/pub/login', data)
}

// 初始化验证码
export const initCaptcha = (params) => {
  return getNoAuthRequest('/pub/captchaid', params)
}

export const getUserInfo = (token) => {
  return getRequest('/pub/current/userinfo')
}

export const logout = (token) => {
  return postRequest('/pub/logout')
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
