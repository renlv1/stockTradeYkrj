import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/api'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
	  userCertification: {},
    allUserInfo: {},
    showLoading: false,
    newMessage: {},
    globalMessageList: [],
    currentRoom: '',
    online: true,
    bankList: [],
    refreshTime: '',
    messageCount: 0,
    cacheStore: {},
    currencyList: [],
	  usdBalance: '',
  },
  getters: {
    isLogin (state) {
      return !!state.user.id
    }
  },
  mutations: {
    SET_ACCOUNT (state, data) {
      state.allUserInfo = data
      state.user = data.user
	    state.userCertification = data.userCertification
	    state.usdBalance = data.userAccount.USDT
    },
    CLEAR_ACCOUNT (state) {
      state.user = {}
    },
    SET_LOADING (state, data) {
      state.showLoading = data
    },
    SET_REFRESH (state) {
      state.refreshTime = new Date().getTime()
    },
    SET_BANKLIST (state, data) {
      state.bankList = data
    },
    SET_CACHE (state, data) {
      state.cacheStore[data.key] = data.data
    },
    SET_STATE (state, data) {
      state[data.key] = data.data
    }
  },
  actions: {
    getBalance ({commit}) {
      api.post('/user/balance').then(res => {
        if (res.success) {
          commit('SET_ACCOUNT', res.data)
	        if (window.location.hash === '#/login') {
		        router.push('/')
	        }
        }
      })
    },
    getMessageList ({commit}) {
      api.post('/message/getOffLineMessage', {
        messageType: 1,
        setRead: 2
      }).then(res => {
        if (res.success) {
          commit('SET_MESSAGE_LIST', res.data.messageList)
        }
      })
    },
    getBankList ({commit}) {
      api.post('/bankinfo/queryBankInfoList', {
        pageIndex: 1,
        pageSize: 100,
      }).then(res => {
        if (res.success) {
          commit('SET_BANKLIST', res.data)
        }
      })
    },
    getCurrencyList ({commit}) {
      return new Promise(resolve => {
        api.post('/shareInfo/getShareMartet', {
          pageSize: 10000
        }).then(res => {
          commit('SET_STATE', {
            key: 'currencyList',
            data: res.data
          })
          resolve()
        })
      })
    },
  }
})
