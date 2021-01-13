import axios from 'axios'
import qs from 'qs'
import store from '../store';
import { Message } from 'element-ui'
import router from '../router';

let ax = axios.create({
  withCredentials: true, // 允许cookie
  baseURL: process.env.VUE_APP_BASE_PATH, // 接口地址
})

const lang = localStorage.getItem('lang')
if (lang && lang !== 'CN') {
  axios.defaults.headers['stocktrade-language'] = lang
}

// 添加响应拦截器
ax.interceptors.response.use(res => {
  store.commit('SET_LOADING', false)
  if (res.data.errorcode === "NOT_LOGGEDIN") {
    store.commit('CLEAR_ACCOUNT')
		if (window.location.hash.indexOf('user') > -1) {
			router.push('/login')
		}
    return res
  } else if (!res.data.success) {
    if (res.data.msg) {
      Message.error(res.data.msg)
    }
    // return res
    // 如需处理错误，在catch里面捕获
	  throw res.data
  } else {
    return res
  }
}, err => {
  store.commit('SET_LOADING', false)
  throw err
})

export default {
  get: (url, params) => {
    return new Promise((resolve, reject) => {
      ax({
        url,
        method: 'get',
        params: params
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post: (url, params) => {
    if (params && params.loading === true) {
      delete params.loading
      store.commit('SET_LOADING', true)
    }
    return new Promise((resolve, reject) => {
      ax({
        method: 'post',
        url,
        data: qs.stringify(params)
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  post2: (url, params, cancelToken) => { // 可以取消的请求
    return new Promise((resolve, reject) => {
      ax({
        method: 'post',
        url,
        data: qs.stringify(params),
        cancelToken
      }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
	post3: (url, params) => {
		// 删除参数值为空的参数
		for (let i in params) {
			if(params[i] === '') {
				delete params[i]
			}
		}
		return new Promise((resolve, reject) => {
			ax({
				method: 'post',
				url,
				data: qs.stringify(params)
			}).then(res => {
				resolve(res.data)
			}).catch(err => {
				reject(err)
			})
		})
	},
  postFormdata: (url, params) => {
    return new Promise((resolve, reject) => {
      ax.post(url, params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
