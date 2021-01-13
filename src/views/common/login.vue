<template>
  <div class="c-page full-page">
    <div class="wrap sign">
      <div class="tit" style="text-align: center;">
        <img src="@img/logo.svg" width="200" alt="">
      </div>
      <div class="form" @keyup.enter="submit">
        <div class="input-wrap">
          <input type="text" :placeholder="$t('login.text2')" v-model="username">
        </div>
        <div class="input-wrap">
          <input type="password" :placeholder="$t('login.text3')" ref="password" v-model="password">
        </div>
        <div class="error" :class="{shake: error}">{{error}}</div>
        <div class="forget">
          <router-link to="/forgetPassword" class="cblue fz14">{{$t('login.text4')}}</router-link>
        </div>
        <button class="btn full" :disabled="!username || !password" @click="submit">{{$t('login.text1')}}</button>
        <div class="reg fz14">{{$t('login.text5')}}  <router-link to="/register" class="cblue">{{$t('login.text6')}}</router-link></div>
      </div>
    </div>

    <el-dialog class="d-form small" :visible.sync="showDialog" :close-on-click-modal="false">
      <div class="d-tit">安全验证</div>
      <div class="form">
        <div class="input-wrap" v-if="radarTwoCheck.dynamic_password === '1'">
          <div class="phone-tips" style="margin-bottom: 10px;">请获取手机尾号<span>{{radarTwoCheck.phoneNumber && radarTwoCheck.phoneNumber.slice(-4)}}</span>的验证码</div>
          <captcha v-model="verifyCode" type="mobile" :mobile="radarTwoCheck.phoneNumber"></captcha>
        </div>
        <div class="input-wrap" v-else>
          <input class="input" v-focus type="text" v-model="verifyCode" placeholder="请输入谷歌验证码">
        </div>
      </div>
      <button @click="twoCheck" :disabled="!verifyCode" class="btn full">确认登录</button>
    </el-dialog>
  </div>

</template>

<script>
import Fingerprint from 'fingerprintjs'
export default {
  data() {
    return {
      username: localStorage.getItem('username'),
      password: '',
      error: '',
      showDialog: false,
      verifyCode: '',
      deviceId: new Fingerprint().get(),
      radarTwoCheck: {},
      show: false
    };
  },
  computed: {
    disabled () {
      return !this.username || !this.password
    }
  },
  watch: {
    verifyCode () {
      if (this.verifyCode.length === 6) {
        this.twoCheck()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.username) {
        this.$refs.password && this.$refs.password.focus()
      }
    })
    if (window.socket) {
      this.$store.commit('CLEAR_ACCOUNT')
      if (window.socket.readyState === 1) {
        window.socket.close()
      }
      window.socket = null
    }
    let params = this.$route.query.params
    if (params) {
      this.gatewayLogin(params)
    }
  },
  methods: {
    loginCallBack () {
      if (this.username) {
        localStorage.setItem('username', this.username)
      }
      this.$store.dispatch('getBalance')
      // this.$store.dispatch('getBankList')
      // this.$store.dispatch('getQuickList')
      this.$router.push('/quote')
    },
    submit () {
      this.$fetch.post('/user/userlogin', {
        username: this.username,
        password: this.password,
        code: '214325',
        loading: true
      }).then(res => {
        const data = res.data
        if (data.isTwoCheck === 'true') {
          this.radarTwoCheck = data.radarTwoCheck
          this.showDialog = true
        } else {
          this.loginCallBack()
        }
      })
    },
    gatewayLogin (params) {
      this.$fetch.post('/user/apploginforgateway', {
        params,
        loading: true
      }).then(res => {
        this.$store.commit('FROM_GATEWAY', true)
        const data = res.data
        if (data.isTwoCheck === 'true') {
          this.radarTwoCheck = data.radarTwoCheck
          this.showDialog = true
        } else {
          this.loginCallBack()
        }
      }).catch(res => {
        if (res.data && res.data.username) {
          this.username = res.data.username
        }
      })
    },
    twoCheck () {
      this.$fetch.post('/user/appLoginTwoCheck', {
        username: this.username,
        verifyCode: this.verifyCode,
        deviceId: this.deviceId,
        loading: true
      }).then(() => {
        this.loginCallBack()
      })
    },
  }
}
</script>

<style lang="less" scoped>
.full-page{
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}
.sign{
  width: 440px;
  padding: 50px 38px 40px;
  border-radius: 6px;
  margin-bottom: 50px;
  box-shadow: 0 0 8px rgba(0, 0, 0, .1);
  .tit{
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 40px;
  }
  .btn{
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 15px;
    margin: 30px 0 12px;
  }
  .reg{
    text-align: center;
    font-size: 14px;
    padding-top: 30px;
  }
}
.forget{
  text-align: right;
  margin-top: -10px;
}
</style>
