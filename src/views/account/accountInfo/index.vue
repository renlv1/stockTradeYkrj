<template>
  <div class="account-w">
    <div class="user-box">
      <div class="wrap-user">
        <div class="username">{{$t('userCenter.text13')}},{{$store.state.user.nickName}}</div>
        <div class="balance-w">
          <div class="balance-left">
            <div class="balance-item">
              <div class="label-b">{{$t('userA.text11')}}</div>
              <div v-show="$store.state.allUserInfo.reckonAmountSum">{{$store.state.allUserInfo.reckonAmountSum | f(8)}} USDT</div>
            </div>
            <!--        <div class="balance-item">-->
            <!--          <div class="label-b">用户地址</div>-->
            <!--          <div>{{$store.state.user.userAddress}}</div>-->
            <!--        </div>-->
          </div>
          <div class="more-btn" @click="$router.push('/user/money')">{{$t('userA.text12')}} ></div>
        </div>
      </div>
    </div>

    <div class="info-box">
      <div>
        <div class="lable-t">{{$t('userCenter.text17')}}</div>
        <div class="box-a" @click="$router.push('/user/depositAddress')">
          <div class="left-a">
            <div class="img-a">
              <img src="@img/menu/addressMent.svg" alt="">
            </div>
            <div class="blt-a">
              <div>{{$t('userCenter.text18')}}</div>
              <div class="tips-a">{{$t('userCenter.text19')}}</div>
            </div>
          </div>
          <div class="view">{{$t('userCenter.text20')}}</div>
        </div>
      </div>
      <div>
        <div class="lable-t">{{$t('userCenter.text64')}}</div>
        <div class="user-box-a">
          <!--        邮箱地址-->
          <div class="item-w">
            <div class="img-a">
              <img src="@img/menu/email2.svg" alt="">
            </div>
            <div class="flex-between">
              <div class="box-b">
                <div>{{$t('userCenter.text65')}}</div>
                <div class="label-m">{{$t('userCenter.text66')}}</div>
              </div>
              <div class="right-a"  @click="emailChangeFn">
                <span>{{user.email}}</span>
                <span class="btn-a">{{$t('userCenter.text67')}}</span>
              </div>
            </div>
          </div>
          <!--        登录密码-->
          <div class="item-w">
            <div class="img-a">
              <img src="@img/menu/loginPwd2.svg" alt="">
            </div>
            <div class="flex-between">
              <div class="box-b">
                <div>{{$t('userCenter.text68')}}</div>
                <div class="label-m">{{$t('userCenter.text69')}}</div>
              </div>
              <div class="right-a" @click="loginFn">
                <span class="btn-a">{{$t('userCenter.text70')}}</span>
              </div>
            </div>
          </div>
          <!--        安全密码-->
          <div class="item-w">
            <div class="img-a">
              <img src="@img/menu/safePwd.svg" alt="">
            </div>
            <div class="flex-between">
              <div class="box-b">
                <div>{{$t('userCenter.text22')}}</div>
                <div class="label-m">{{$t('userCenter.text71')}}</div>
              </div>
              <div class="right-a">
                <span class="btn-a" v-show="user.openTradePassword === 1" @click="tradeFn">{{$t('exchange.text41')}}</span>
                <span class="btn-a" v-show="user.openTradePassword !== 1" @click="backSafeFn">{{$t('login.text4')}}</span>
                <span class="btn-a" v-show="user.openTradePassword !== 1" @click="modifyTrade">{{$t('advertising.text32')}}</span>
              </div>
            </div>
          </div>
          <!--        谷歌验证码-->
          <div class="item-w">
            <div class="img-a">
              <img src="@img/menu/google2.svg" alt="">
            </div>
            <div class="flex-between">
              <div class="box-b">
                <div>{{$t('userCenter.text72')}}</div>
                <div class="label-m">{{$t('userCenter.text73')}}</div>
              </div>
              <div class="right-a">
                <span class="btn-a" v-show="user.openGoogleCode !== 2" @click="googleToogle">{{$t('userCenter.text74')}}</span>
                <span class="btn-a" v-show="user.openGoogleCode === 2" @click="googleChange">{{$t('userCenter.text67')}}</span>
                <div class="switch-a"  @click="googleToogle" :class="{'open-switch': user.openGoogleCode === 2}" v-show="user.openGoogleCode === 2">
                  <div class="switch-m" ></div>
                </div>
              </div>
            </div>
          </div>
          <!--        用户地址-->
          <div class="item-w">
            <div class="img-a">
              <div class="el-icon-user"></div>
            </div>
            <div class="flex-between">
              <div class="box-b">
                <div>{{$t('userA.text13')}}</div>
                <div class="label-m">{{$t('userA.text14')}}</div>
              </div>
              <div class="right-a">
                <span class="">{{$store.state.user.userAddress}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--   设置安全密码 -->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible2">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text21')}}</div>
            <i class="g-dialog-close" @click="visible2 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text22')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text23')" v-model.trim="tradePwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text24')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text25')" v-model.trim="tradePwd2">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text26')}}</div>
            <captcha v-model="verifyCode" :email="$store.state.user.email" sendType="2" class="input-s-a" sendWay="2"></captcha>
          </div>
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="openTrade">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
<!--    设置谷歌-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible6">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text27')}}</div>
            <i class="g-dialog-close" @click="visible6 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text28')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text29')" v-model.trim="tradePwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text26')}}</div>
            <div class="input-a">
              <captcha v-model="emailCode2" :email="$store.state.user.email" sendType="2" class="input-s-a input-s-c" sendWay="2"></captcha>
            </div>
          </div>
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="openGoogleFn">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
    <!--    修改安全密码-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible5">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text30')}}</div>
            <i class="g-dialog-close" @click="visible5 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text31')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text32')" v-model.trim="oldTradePwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text33')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text23')" v-model.trim="tradePwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text34')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text35')" v-model.trim="tradePwd2">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text26')}}</div>
            <captcha v-model="verifyCode" :email="$store.state.user.email" sendType="2" class="input-s-a" sendWay="2"></captcha>
          </div>
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="modifyFnTrade">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
    <!--    解除谷歌验证器绑定  -->
    <transition name="dialog">
      <div class="g-dialog" v-if="unbindVisible">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('accountUser.text46')}}</div>
            <i class="g-dialog-close" @click="unbindVisible = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item down-input">
            <div class="label">{{$t('accountUser.text47')}}</div>
            <div class=" dropdown-wrap">
              <el-dropdown @command="commandChange1" placement="bottom-start">
                            <span class="el-dropdown-link">
                              {{unbind}}<i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                <el-dropdown-menu class="menu-drop-a" slot="dropdown">
                  <el-dropdown-item :command="item" v-for="(item,index) in  unbindArr" :key="index">{{item.text}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('accountUser.text44')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('accountUser.text45')" v-model.trim="unbindTradePwd">
            </div>
          </div>
          <div class="input-item" v-show="unbindType === 1">
            <div class="label">{{$t('accountUser.text48')}}</div>
            <div class="input-a">
              <input type="text" :placeholder="$t('accountUser.text21')" v-model.trim="googleCode">
            </div>
          </div>
          <div class="input-item" v-show="unbindType === 2">
            <div class="label">{{$t('accountUser.text49')}}</div>
            <div class="input-a send-input">
              <input type="text" :placeholder="$t('accountUser.text50')" v-model.trim="emailCode">
              <div class="send-btn" @click="sendFn">
                <div v-if="loading"><span class="el-icon-loading"></span></div>
                <div v-else-if="disabled" class="cblue">{{time}}S</div>
                <div v-else @click="send" class="cblue">{{text}}</div>
              </div>
            </div>
          </div>
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="bindGoogleFn">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
<!--      修改登录密码-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible7">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text36')}}</div>
            <i class="g-dialog-close" @click="visible7 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text37')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text38')" v-model.trim="oldLoginPwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text39')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text23')" v-model.trim="newLoginPwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text40')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text41')" v-model.trim="newLoginPwd2">
            </div>
          </div>
<!--          <div class="input-item">-->
<!--            <div class="label">邮箱验证码</div>-->
<!--            <captcha v-model="verifyCode" :email="$store.state.user.email" sendType="2" class="input-s-a" sendWay="2"></captcha>-->
<!--          </div>-->
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="modifyLoginPwd">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
    <!--      更换邮箱-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible8">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text42')}}</div>
            <i class="g-dialog-close" @click="visible8 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text43')}}</div>
            <div class="input-a email-input">{{ $store.state.user.email}}</div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text44')}}</div>
            <captcha v-model="oldCode" :email="$store.state.user.email" sendType="2" class="input-s-a" sendWay="2"></captcha>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text45')}}</div>
            <div class="input-a">
              <input type="text" :placeholder="$t('userCenter.text46')" v-model.trim="newEmail">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text47')}}</div>
            <captcha v-model="newCode" :email="newEmail" sendType="2" class="input-s-a" sendWay="3"></captcha>
          </div>
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="emailModifyFn">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
    <!--      找回安全密码-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible9">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text48')}}</div>
            <i class="g-dialog-close" @click="visible9 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text49')}}</div>
            <captcha v-model="eCode2" :email="$store.state.user.email" sendType="2" class="input-s-a" sendWay="2"></captcha>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text33')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text23')" v-model.trim="newSafePwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text50')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text51')" v-model.trim="newSafePwd2">
            </div>
          </div>
          <div class="err-red">{{errorMsg3}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="safeBackFn">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
    <!--    重置谷歌-->
    <transition name="dialog">
      <div class="g-dialog" v-if="visible10">
        <div class="g-dialog-mask"></div>
        <div class="g-dialog-wrap content-wrap">
          <div class="top-a">
            <div class="g-dialog-title">{{$t('userCenter.text52')}}</div>
            <i class="g-dialog-close" @click="visible10 = false">
              <img src="@img/menu/close.png" alt="">
            </i>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text22')}}</div>
            <div class="input-a">
              <input type="password" :placeholder="$t('userCenter.text29')" v-model.trim="tradePwd">
            </div>
          </div>
          <div class="input-item">
            <div class="label">{{$t('userCenter.text49')}}</div>
            <captcha v-model="verifyCode" :email="$store.state.user.email" sendType="2" class="input-s-a" sendWay="2"></captcha>
          </div>
          <div class="err-red">{{errorMsg}}</div>
          <div class="g-dialog-btn-wrap">
            <button class="g-dialog-btn g-dialog-ok" @click="googleChFn">{{$t('accountUser.text22')}}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import Dialog from '@/components/dialog'

export default {
  data() {
    return {
	    emailCode2: '',
	    googleCode2: '',
	    newSafePwd: '',
	    newSafePwd2: '',
	    oldCode: '',
	    newCode: '',
	    eCode2: '',
	    newEmail: '',
	    oldLoginPwd: '',
	    newLoginPwd: '',
	    newLoginPwd2: '',
	    oldTradePwd: '',
	    verifyCode: '',
	    visible3: false,
      errorMsg: '',
	    errorMsg3: '',
      disabled: false,
      loading: false,
      timer: null,
      emailCode: '',
      unbindTradePwd: '',
      unbind: this.$t('accountUser.text51'),
      unbindType: 1,
      unbindArr: [
        {text: this.$t('accountUser.text51'), type: 1},
        {text: this.$t('accountUser.text52'), type: 2},
      ],
      text: this.$t('accountUser.text53'),
      time: 60,
      googleCode: '',
      unbindVisible: false,
      tradePwd: '',
	    tradePwd2: '',
      visible2: false,
	    visible5: false,
	    visible6: false,
	    visible7: false,
	    visible8: false,
	    visible9: false,
	    visible10: false
    }
  },
  methods: {
  	// 重置谷歌确认
	  googleChFn () {
		  this.errorMsg = ''
		  if (this.tradePwd === '') {
		  	this.errorMsg = this.$t('accountUser.text60')
			  return
		  }
		  if (this.verifyCode === '') {
			  this.errorMsg =  this.$t('accountUser.text50')
			  return
		  }
		  this.$store.commit('SET_LOADING', true)
		  this.$fetch.post('/user/googleOpenClose', {
			  mailCode: this.verifyCode,
			  tradePwd: this.tradePwd, //	string	当前交易密码
			  type: 1 //	Integer	操作类型 1:开启 2:谷歌验证码关闭 3:重置
		  }).then(res => {
			  this.$store.commit('SET_LOADING', false)
			  if (res.success) {
				  this.$router.push({
					  path: '/user/accountInfo/google',
					  query: {
						  code: JSON.stringify(res.data),
              reset: 1
					  }
				  })
			  }
		  })
    },
    // 重置谷歌弹窗
	  googleChange () {
	  	this.tradePwd = ''
      this.verifyCode = ''
      this.errorMsg = ''
      this.visible10 = true
    },
  	// 找回安全密码
	  safeBackFn () {
		  this.errorMsg3 = ''
		  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/
	  	if (this.eCode2 === '') {
			  this.errorMsg3 = this.$t('accountUser.text50')
			  return false
      }
		  if (this.newSafePwd === '') {
			  this.errorMsg3 = this.$t('userCenter.text55')
			  return false
		  }
		  if (!reg.test(this.newSafePwd)) {
			  this.errorMsg3 = this.$t('userCenter.text23')
			  return false
		  }
		  if (this.newSafePwd2 === '') {
			  this.errorMsg3 = this.$t('userCenter.text51')
			  return false
		  }
		  if (this.newSafePwd2 !== this.newSafePwd) {
			  this.errorMsg3 = this.$t('userCenter.text56')
			  return false
		  }
		  this.$store.commit('SET_LOADING', true)
		  this.$fetch.post('/user/setTradePassword', {
			  tradePwd: this.newSafePwd2, //	string	新交易密码（必填）
        verifyCode: this.eCode2, //	string	邮箱验证码（必填）
      }).then(res => {
        if (res.success) {
	        this.$store.commit('SET_LOADING', false)
	        Dialog({
		        msg: this.$t('userCenter.text53'),
		        okFn: () => {
			        this.visible9 = false
		        }
	        })
        }
      })
    },
    // 找回安全密码弹窗
	  backSafeFn () {
	  	this.eCode2 = ''
      this.newSafePwd = ''
      this.newSafePwd2 = ''
      this.errorMsg3 = ''
	  	this.visible9 = true
    },
	  // 更换邮箱 弹窗
	  emailChangeFn () {
	  	this.errorMsg = ''
      this.oldCode = ''
      this.newEmail = ''
      this.newCode = ''
	  	this.visible8 = true
    },
  	// 更换邮箱
	  emailModifyFn () {
		  if (this.oldCode === '') {
			  this.errorMsg = this.$t('userCenter.text57')
			  return false
		  }
		  if (this.newEmail === '') {
			  this.errorMsg = this.$t('userCenter.text58')
			  return false
		  }
		  if (this.newCode === '') {
			  this.errorMsg = this.$t('userCenter.text59')
			  return false
		  }
		  this.$store.commit('SET_LOADING', true)
		  this.$fetch.post('/user/updateEmail', {
			  newEmail: this.newEmail, //	string	新邮箱
			  oldCode: this.oldCode, //	string	旧邮箱验证码
			  newCode: this.newCode, //	string	新邮箱验证码
      }).then(res => {
      	if (res.success) {
		      this.$store.dispatch('getBalance')
		      this.$store.commit('SET_LOADING', false)
		      Dialog({
			      msg: this.$t('userCenter.text54'),
			      okFn: () => {
				      this.visible8 = false
			      }
		      })
        } else {
		      this.$store.commit('SET_LOADING', false)
        }
      })
    },
    // 更换邮箱弹窗
	  loginFn () {
	  	this.oldLoginPwd = ''
      this.newLoginPwd = ''
      this.newLoginPwd2 = ''
      this.errorMsg = ''
	  	this.visible7 = true
    },
    // 安全密码验证
	  tradeVerifyFn2 () {
	  	if (this.oldTradePwd === '') {
			  this.errorMsg = this.$t('userCenter.text60')
			  return false
      }
		  if (this.tradePwd === '') {
			  this.errorMsg = this.$t('accountUser.text60')
			  return false
		  }
		  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/
		  if (!reg.test(this.tradePwd)) {
			  this.errorMsg = this.$t('setting.text10')
			  return false
		  }
		  if (this.tradePwd2 !== this.tradePwd) {
			  this.errorMsg = this.$t('setting.text9')
			  return false
		  }
		  if (this.tradePwd2 === '') {
			  this.errorMsg = this.$t('userCenter.text61')
			  return false
		  }
		  if (this.verifyCode === '') {
			  this.errorMsg = this.$t('accountUser.text50')
			  return false
		  }
		  return true
	  },
    // 修改登录密码
    modifyLoginPwd () {
	    if (this.oldLoginPwd === '') {
		    this.errorMsg = this.$t('userCenter.text62')
		    return false
	    }
	    if (this.newLoginPwd === '') {
		    this.errorMsg = this.$t('setting.text3')
		    return false
	    }
	    // let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/
	    // if (!reg.test(this.newLoginPwd)) {
		  //   this.errorMsg = this.$t('setting.text31')
		  //   return false
	    // }
	    // if (!reg.test(this.newLoginPwd2)) {
		  //   this.errorMsg = this.$t('setting.text31')
		  //   return false
	    // }
	    if (this.newLoginPwd2 !== this.newLoginPwd) {
		    this.errorMsg = this.$t('setting.text9')
		    return false
	    }
	    if (this.newLoginPwd2 === '') {
		    this.errorMsg = this.$t('userCenter.text63')
		    return false
	    }
	    this.$store.commit('SET_LOADING', true)
	    this.$fetch.post('/user/updatePassword', {
		    oldPassword: this.oldLoginPwd, //	string	当前交易密码
		    newPassword: this.newLoginPwd2, //		string	新交易密码
	    }).then(res => {
		    this.$store.commit('SET_LOADING', false)
		    this.$fetch.post('/user/logout').then(res => {
			    if (res.success) {
				    this.$store.dispatch('getBalance')
				    this.$store.commit('CLEAR_ACCOUNT')
				    this.$router.push('/login')
			    }
		    })
		    if (res.success) {
			    this.$message.success(this.$t('setting.text13'))
			    this.$router.push('/login')
		    }
	    })
    },
	  // 修改安全秘码弹窗
	  modifyTrade () {
	  	this.oldTradePwd = ''
      this.tradePwd = ''
		  this.tradePwd2 = ''
		  this.verifyCode = ''
      this.errorMsg = ''
		  this.visible5 = true
	  },
    // 修改安全密码
	  modifyFnTrade () {
	  	if (this.tradeVerifyFn2()) {
			  this.$store.commit('SET_LOADING', true)
			  this.$fetch.post('/user/updateTradePassword', {
				  tradePwd: this.oldTradePwd, //	string	当前交易密码
				  newTradePwd: this.tradePwd2, //		string	新交易密码
				  verifyCode: this.verifyCode, //		string	验证码
			  }).then(res => {
				  this.$store.commit('SET_LOADING', false)
				  if (res.success) {
					  Dialog({
						  msg: this.$t('setting.text12'),
						  okFn: () => {
							  this.visible5 = false
						  }
					  })
				  }
			  }).catch(err => {
        })
      }
    },
  	tradeVerifyFn () {
		  if (this.tradePwd === '') {
			  this.errorMsg = this.$t('accountUser.text60')
			  return false
		  }
		  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/
		  if (!reg.test(this.tradePwd)) {
			  this.errorMsg = this.$t('setting.text10')
			  return false
		  }
		  if (this.tradePwd2 !== this.tradePwd) {
			  this.errorMsg = this.$t('setting.text9')
			  return false
		  }
		  if (this.tradePwd2 === '') {
			  this.errorMsg = this.$t('userCenter.text61')
			  return false
		  }
		  if (this.verifyCode === '') {
			  this.errorMsg = this.$t('accountUser.text50')
			  return false
		  }
		  return true
    },
	  openTrade () {
		  if (this.tradeVerifyFn()) {
			  this.$store.commit('SET_LOADING', true)
			  this.$fetch.post('/user/setTradePassword', {
				  tradePwd: this.tradePwd2, //	string	交易密码
				  verifyCode: this.verifyCode, //	string	验证码
			  }).then(res => {
				  this.$store.commit('SET_LOADING', false)
				  if (res.success) {
					  Dialog({
						  msg:  this.$t('setting.text17'),
						  okFn: () => {
							  this.$store.dispatch('getBalance')
                this.visible2 = false
						  }
					  })
				  }
			  })
		  }
    },
    start() {
      this.disabled = true
      if (this.time === 0) {
        this.disabled = false
        this.text = this.$t('accountUser.text54')
      } else {
        this.time--
        this.timer = setTimeout(() => this.start(), 1000)
      }
    },
    send() {
      this.loading = true
      this.$fetch.post('/certification/sendVerifyCode', {
        email: this.$store.state.user.email,
        sendType: 2,
        sendWay: 2
      }).then(res => {
        if (res.success) {
          this.$message.success(this.$t('accountUser.text55'))
          this.time = 60
          this.loading = false
          this.start()
        } else {
          this.$message.error(res.msg)
          this.loading = false
        }
      }).catch(err => {
        this.$message.error(this.$t('accountUser.text56'))
        this.loading = false
      })
    },
    // 发送邮箱
    sendFn() {
    },
    // 广告权限 "isbusinessman": 1,           1：不是市商  2：是市商 3：市商审核中 4:审核失败
    businessFn(type) {
      if (type === 1) return this.$t('accountUser.text57')
      if (type === 2) return this.$t('accountUser.text58')
      if (type === 3) return this.$t('accountUser.text59')
      if (type === 4) return this.$t('certification.text43')
    },
    commandChange1(item) {
      this.unbindType = item.type
      this.unbind = item.text
      this.unbindTradePwd = ''
      this.googleCode = ''
      this.emailCode = ''
      this.errorMsg = ''
    },
    bindVerify() {
      if (this.unbindTradePwd === '') {
        this.errorMsg = this.$t('accountUser.text60')
        return false
      }
      if (this.googleCode === '' && this.unbindType === 1) {
        this.errorMsg = this.$t('accountUser.text21')
        return false
      }
      if (this.emailCode === '' && this.unbindType === 2) {
        this.errorMsg = this.$t('accountUser.text50')
        return false
      }
      return true
    },
    bindGoogleFn() {
      if (this.bindVerify()) {
        this.$store.commit('SET_LOADING', true)
        let dataObj = {
          type: 2, //	Integer	操作类型 1:开启 2:谷歌验证码关闭 3:重置
          tradePwd: this.unbindTradePwd  //	string	当前交易密码
        }
        if (this.unbindType === 1) {//	string	谷歌验证码
          dataObj.googleCode = this.googleCode
        }
        if (this.unbindType === 2) {// 	string	邮箱验证码
          dataObj.mailCode = this.emailCode
        }
        this.$fetch.post('/user/googleOpenClose', dataObj).then(res => {
          if (res.success) {
            this.$store.commit('SET_LOADING', false)
            this.unbindVisible = false
            this.$store.dispatch('getBalance')
            Dialog({
              msg: this.$t('accountUser.text61')
            })
          }
        })
      }
    },
    // 谷歌验证弹窗
    googleToogle() {
	  	this.emailCode2 = ''
      if (this.$store.state.user.openGoogleCode === 2) {
        // 解绑弹窗
        this.unbindVisible = true
        this.unbindTradePwd = ''
        this.googleCode = ''
        this.emailCode = ''
      } else {
        // 开通弹窗
        if (this.$store.state.user.openTradePassword !== 2) {

          Dialog({
            title: this.$t('accountUser.text62'),
            msg: this.$t('accountUser.text63'),
          })
        } else {
          this.visible6 = true
          this.tradePwd = ''
        }
      }

    },
    // 开启谷歌
    openGoogleFn() {
      if (this.tradePwd === '') {
	      this.$message.error(this.$t('userCenter.text29'))
        return
      }
	    if (this.emailCode2 === '') {
		    this.$message.error(this.$t('accountUser.text50'))
		    return
	    }
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post('/user/googleOpenClose', {
        mailCode: this.emailCode2,
        tradePwd: this.tradePwd, //	string	当前交易密码
        type: 1 //	Integer	操作类型 1:开启 2:谷歌验证码关闭 3:重置
      }).then(res => {
        this.$store.commit('SET_LOADING', false)
        if (res.success) {
          this.$router.push({
            path: '/user/accountInfo/google',
            query: {
              code: JSON.stringify(res.data)
            }
          })
        }
      })
    },
    tradeFn() {
	  	this.tradePwd = ''
      this.tradePwd2 = ''
      this.verifyCode = ''
      this.errorMsg = ''
      this.visible2 = true
    }
  },
  computed: {
    ...mapState([
    	'user',
      'allUserInfo',
      'usdBalance'
    ])
  }
}
</script>

<style scoped lang="less">
  @import "../../../assets/css/dialog";

  input {
    transition: all .3s linear;
    border: 1px solid #999;
    font-size: 15px;
    &:focus {
      border-color: #639CFF;
      box-shadow: 0 0 10px #639CFF;
    }
  }
  input,
  .input-s-a /deep/ input,
  div /deep/ .el-input__inner {
    &::-webkit-input-placeholder {
      color: #ccc !important;
    }
    &::-moz-placeholder {
      color: #ccc!important;
    }
    &:-moz-placeholder {
      color: #ccc!important;
    }
    &:-ms-input-placeholder {
      color: #ccc!important;
    }
  }
  .input-s-c{
    margin-bottom: 0;
    width: 100%;
  }
  .err-red {
    margin-bottom: 20px;
    margin-top: -10px;
    color: #ff415d;
  }

  .menu-drop-a {
    background-color: #fff;
    width: 320px;
    border: 1px solid #1c1c1c;
    /deep/ .el-dropdown-menu__item {
      color: #1c1c1c;
      font-size: 14px;
      border-top: 1px solid #41414f;
      &:nth-child(1) {
        border-top: none;
      }
      &:hover {
        background-color: #fff;
        color: #639cff;
      }
    }
    /deep/ .popper__arrow {
      border-bottom-color: #32323e !important;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.95));
      left: 20px !important;
      &::after {
        display: none;
      }
    }
  }

  .account-w {
    padding-bottom: 50px;
    font-size: 14px;
    color: #1c1c1c;
    .user-box{
      height: 180px;
      background-color: #17233b;
      .wrap-user{
        width: 960px;
        margin: 0 auto;
        color: #fff;
      }
    }
    .info-box{
      width: 960px;
      margin: 0 auto;
    }
    .balance-w{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .balance-left{
        display: flex;
        .balance-item{
          margin-right: 80px;
          font-size: 14px;
          .label-b{
            color: #8696b5;
            font-size: 14px;
            margin-bottom: 12px;
          }
        }
      }
      .more-btn{
        width: 120px;
        height: 40px;
        border: 1px solid #8696b5;
        border-radius: 4px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
    .lable-t{
      font-size: 14px;
      color: #b3b3b3;
      margin: 40px  0 20px;
    }
    .box-a{
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      cursor: pointer;
      .left-a{
        display: flex;
        align-items: center;
        .blt-a{
          margin-left: 30px;
          .tips-a{
            font-size: 12px;
            color: #b3b3b3;
            margin-top: 6px;
          }
        }
      }
      .view{
        color: #2492f5;
        cursor: pointer;
      }
    }
    .user-box-a{
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      .item-w{
        display: flex;
        align-items: center;
        padding-right: 30px;
        height: 80px;
        &:last-child{
          .flex-between{
            border: none;
          }
        }
        .el-icon-user{
          font-size: 28px;
          color: #1c1c1c;
        }
        .img-a{
          /*margin-right: 30px;*/
          width: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flex-between{
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e6e6e6;
          flex: 1;
          height: 100%;
          .box-b{
            .label-m{
              font-size: 12px;
              color: #b3b3b3;
            }
          }
          .right-a{
            display: flex;
            align-items: center;
            .btn-a{
              color: #2492f5;
              padding-left: 20px;
              cursor: pointer;
              &:last-child{
                margin-left: 10px;
              }
            }
          }
          .switch-a{
            position: relative;
            width: 44px;
            height: 24px;
            background-color: #d6d6d6;
            border-radius: 12px;
            margin-left: 20px;
            cursor: pointer;
            &.open-switch{
              background-color: #2492f5;
              .switch-m{
                left: auto;
                right: 2px;
              }
            }
            .switch-m{
              position: absolute;
              left: 2px;
              top: 2px;
              width: 20px;
              height: 20px;
              background-color: #fff;
              border-radius: 50%;
              transition: all .15s linear;
            }
          }
        }
      }
    }

    .cursor {
      cursor: pointer;
    }
    .username {
      font-weight: bold;
      font-size: 24px;
      padding: 30px 0 28px;
    }
    .verify-t {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .item-a {
        display: flex;
        align-items: center;
        margin-left: 40px;
        &:first-child {
          margin-left: 60px;
        }
        .text-a {
          margin-left: 6px;
        }
      }
    }
    .table-m {
      font-size: 12px;
      .item-head {
        background-color: #32323e;
        height: 40px;
        line-height: 40px;
        padding-left: 30px;
        font-size: 12px;
        font-weight: bold;
        color: #5f5e6c;
      }
      .cursor {
        cursor: pointer;
      }
      .flex-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding: 0 30px;
        border-bottom: 1px solid #323243;
        .left {
          display: flex;
          align-items: center;
        }
        .business-1 {
          color: #639cff;
        }
        .text-c {
          color: #ccc;
          margin-left: 10px;
        }
        .editor {
          color: #639cff;
        }
      }
    }
  }

  .g-dialog {
    .send-input {
      display: flex;
      align-items: center;
      input {
        flex: 1;
      }
      .send-btn {
        padding-left: 10px;
        line-height: 40px;
        color: #4d62ff;
        cursor: pointer;
      }
    }
    .email-input{
      border: 1px solid #999;
      border-radius: 4px;
      padding: 0 15px;
      background-color: #f7f7f7;
    }
  }
</style>
