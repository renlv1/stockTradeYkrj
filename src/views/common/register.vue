<template>
  <div class="c-page full-page">
    <div class="wrap sign">
      <div class="tit" @click="show = true">
        {{$t('login.text7')}}
      </div>
      <div class="form" @keyup.enter="submit">
        <div class="input-wrap">
          <input type="text" :placeholder="$t('login.text11')" v-model="email">
        </div>
        <div class="input-wrap">
          <captcha v-model="verifyCode" :email="email" sendType="2"></captcha>
        </div>
        <div class="input-wrap">
          <input type="text" :placeholder="$t('login.text8')" v-model="username">
        </div>
        <div class="input-wrap">
          <input type="password" :placeholder="$t('login.text9')" v-model="password">
        </div>
        <div class="input-wrap">
          <input type="password" :placeholder="$t('login.text10')" v-model="confirmPassword">
        </div>
        <div class="error" :class="{shake: error}">{{error}}</div>
        <button class="btn full" :disabled="!username || !password || !confirmPassword || !email || !verifyCode" @click="submit">{{$t('login.text12')}}</button>
        <div class="reg fz14">{{$t('login.text13')}}  <router-link to="/login" class="cblue">{{$t('login.text14')}}</router-link></div>
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
      email: '',
      verifyCode: '',
      error: '',
    };
  },
  methods: {
    submit () {
      if (this.password !== this.confirmPassword) {
        this.$message.error(this.$t('login.text15'))
        return
      }
      this.$fetch.post('/register/registerUser', {
        username: this.username,
        password: this.password,
        email: this.email,
        verifyCode: this.verifyCode,
        loading: true
      }).then(res => {
        this.$message.success(this.$t('login.text16'))
        localStorage.setItem('username', this.username)
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
