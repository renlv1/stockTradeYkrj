<template>
  <div class="c-page full-page">
    <div class="wrap sign">
      <div class="tit">{{step === 1 ? $t('login.text4') : $t('login.text17')}}</div>
      <div class="form" @keyup.enter="setNext" v-if="step === 1">
        <div class="input-wrap">
          <input type="text" :placeholder="$t('login.text2')" v-model="username">
        </div>
        <div class="error" :class="{shake: error}">{{error}}</div>
        <button class="btn full" :disabled="!username" @click="setNext">{{$t('login.text18')}}</button>
      </div>

      <div class="form" @keyup.enter="submit" v-else>
        <div class="input-wrap">
          <input type="password" :placeholder="$t('login.text19')" v-model="password">
        </div>
        <div class="input-wrap">
          <input type="password" :placeholder="$t('login.text20')" v-model="confirmPassword">
        </div>
        <div class="input-wrap">
          <captcha v-model="verifyCode" ref="captcha" :handle="setNext"></captcha>
        </div>
        <p class="cblue">{{emailText}}</p>
        <div class="error" :class="{shake: error}">{{error}}</div>
        <button class="btn full" :disabled="!password || !confirmPassword || !verifyCode" @click="submit">{{$t('login.text21')}}</button>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      verifyCode: '',
      error: '',
      step: 1,
      emailText: ''
    };
  },
  methods: {
    setNext ()  {
      this.$fetch.post('/user/forgetPassword ', {
        userName: this.username,
        loading: true
      }).then(res => {
        this.emailText = res.data
        this.step = 2
        setTimeout(() => {
          this.$refs.captcha.start()
        }, 20)
      })
    },
    submit () {
      if (this.password !== this.confirmPassword) {
        this.$message.error(this.$t('login.text15'))
        return
      }
      this.$fetch.post('/user/findPassword', {
        userName: this.username,
        newPassword: this.password,
        code: this.verifyCode,
        loading: true
      }).then(res => {
        this.$message.success(this.$t('login.text22'))
        this.$router.replace('/login')
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
  .input-wrap{
    margin-bottom: 14px;
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
    padding-top: 20px;
  }
}
</style>
