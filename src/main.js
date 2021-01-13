import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fetch from './api/api'
import { i18n } from './i18n/config'
import * as customFiter from './filter'
import globalMixin from './mixin'
import VueClipboard from 'vue-clipboard2'
import loading from '@/components/loading'
import loadMore from '@/components/loadMore'
import payDialog from '@/components/payDialog'
import captcha from '@/components/captcha'
import './plugins/element.js'

Vue.use(VueClipboard)
Vue.component('loading', loading)
Vue.component('loadMore', loadMore)
Vue.component('payDialog', payDialog)
Vue.component('captcha', captcha)

// 公共属性
Vue.prototype.$fetch = fetch
Vue.prototype.$api = process.env.VUE_APP_BASE_PATH
Vue.prototype.$baseCurrency = 'USDT'

Vue.config.productionTip = false;

// 公共方法混入
Vue.mixin(globalMixin)

//配置全局过滤器
Object.keys(customFiter).forEach(key => {
  Vue.filter(key, customFiter[key])
})

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
