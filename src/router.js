import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      redirect: '/quote'
    },
    {
      path: '/login', // 登录
      component: require('./views/common/login').default
    },
    {
      path: '/register', // 注册
      component: require('./views/common/register').default
    },
    {
      path: '/forgetPassword', // 忘记密码
      component: require('./views/common/forgetPassword').default
    },
    {
      path: '/quote', // 行情
      component: require('./views/exchange/quote').default
    },
    {
      path: '/exchange', // 交易所
      component: require('./views/exchange/index').default
    },
    {
      path: '/exchangeOrder', // 订单
      component: require('./views/order/exchangeOrder').default
    },
	  {
		  path: '/noticeCenter', //公告中心
		  component: require('./views/notice/noticeCenter').default
	  },
    {
      path: '/user',
      component: require('./views/tableBar').default,
      redirect: '/user/money',
      children: [
        {
          path: 'money', // 资产管理
          component: require('./views/money/money/index').default,
        },
	      {
		      path: 'exchangeRecord', // 交易记录
		      component: require('./views/money/exchangeRecord/exchangeRecord').default,
	      },
        {
          path: 'depositAddress', // 提现地址管理
          component: require('./views/money/depositAddress/index').default,
        },
        {
          path: 'accountInfo', // 账号信息
          component: require('./views/account/accountInfo/index').default,
        },
        {
          path: 'accountInfo/google', // 账号信息---绑定谷歌验证
          component: require('./views/account/accountInfo/google').default,
        },
      ]
    },
  ]
});

router.afterEach(() => {
  window.scrollTo(0, 0)
});

export default router
