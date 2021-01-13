<template>
  <div class="login-pwd-w">
    <div class="back-a">
      <div class="back-w" @click="$router.push('/user/accountInfo')">
        <div>
          <img src="@img/menu/goback.png" alt="">
        </div>
        <span class="back-text">{{$t('accountUser.text11')}}</span>
      </div>
    </div>
    <div class="h-title">{{titleA}}</div>
    <div class="input-w">
      <div class="input-item">
        <input type="password" :placeholder="input1" v-model.trim="tradePwd">
      </div>
      <div class="input-item">
        <input type="password" :placeholder="input2" v-model.trim="newTradePwd">
      </div>
      <div class="input-item">
        <input type="password" :placeholder="input3" v-model.trim="newTradePwd2">
      </div>
      <div class="input-item input-send">
        <captcha v-model="verifyCode" :email="email" sendType="2" class="input-s-a" sendWay="2"></captcha>
      </div>
      <div class="err-t">{{errMsg}}</div>
      <div class="btn-ok" @click="submitFn">{{$t('accountUser.text22')}}</div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
	import Dialog from '@/components/dialog'
	export default {
		data() {
			return {
				tradePwd: '',
				newTradePwd: '',
				newTradePwd2: '',
				verifyCode: '',
				errMsg: '',
				routeType: Number(this.$route.query.type),
				email: this.$store.state.user.email,
				titleA: this.$t('setting.text1'),
				input1: this.$t('setting.text2'),
				input2: this.$t('setting.text3'),
				input3: this.$t('setting.text4'),
      }
		},
    mounted() {
			if (this.routeType === 2) {
				this.titleA = this.$t('setting.text5')
        this.input1 = this.$t('setting.text6')
        this.input2 = this.$t('setting.text7')
        this.input3 = this.$t('setting.text8')
      }
    },
    methods: {
			verify () {
				this.errMsg = ''
				let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,14}$/
				if (this.routeType === 2) {
					if (this.tradePwd === '') {
						this.errMsg = this.$t('setting.text6')
						return false
					}
					if (this.newTradePwd === '') {
						this.errMsg = this.$t('setting.text7')
						return false
					}
					if (this.newTradePwd2 === '') {
						this.errMsg = this.$t('setting.text8')
						return false
					}
					if (this.newTradePwd2 !== this.newTradePwd) {
						this.errMsg = this.$t('setting.text9')
						return false
					}
					if (!reg.test(this.newTradePwd)) {
						this.errMsg = this.$t('setting.text10')
						return false
					}
					return true
        } else if (this.routeType === 1) {
					if (this.tradePwd === '') {
						this.errMsg = this.$t('setting.text2')
						return false
					}
					if (this.newTradePwd === '') {
						this.errMsg = this.$t('setting.text3')
						return false
					}
					if (this.newTradePwd2 === '') {
						this.errMsg = this.$t('setting.text4')
						return false
					}
					if (this.newTradePwd2 !== this.newTradePwd) {
						this.errMsg = this.$t('setting.text11')
						return false
					}
					return true
        }
				return true
      },
	    submitFn () {
        if (this.verify()) {
	        this.$store.commit('SET_LOADING', true)
          if (this.routeType === 2) {
	          this.$fetch.post('/user/updateTradePassword', {
		          tradePwd: this.tradePwd, //	string	当前交易密码
		          newTradePwd: this.newTradePwd2, //		string	新交易密码
		          verifyCode: this.verifyCode, //		string	验证码
	          }).then(res => {
		          this.$store.commit('SET_LOADING', false)
		          if (res.success) {
			          Dialog({
				          msg: this.$t('setting.text12'),
				          okFn: () => {
					          this.$router.push('/user/accountInfo')
				          }
			          })
		          }
	          })
          } else if (this.routeType === 1) {
	          this.$fetch.post('/user/updatePassword', {
		          oldPassword: this.tradePwd, //	string	当前交易密码
		          newPassword: this.newTradePwd2, //		string	新交易密码
		          code: this.verifyCode, //		string	验证码
	          }).then(res => {
		          this.$store.commit('SET_LOADING', false)
		          this.$store.dispatch('getBalance')
		          if (res.success) {
			          this.$message.success(this.$t('setting.text13'))
			          this.$router.push('/login')
		          }
	          })
          }
        }
      }
    }
	}
</script>

<style scoped lang="less">
input {
  transition: all .3s linear;
  border: 1px solid #41414f;
  &:focus {
    border-color: #639CFF;
    box-shadow: 0 0 10px #639CFF;
  }
}
.login-pwd-w{
  padding: 40px 30px;
  .back-a{
    display: flex;
  }
  .back-w{
    display: flex;
    align-items: center;
    cursor: pointer;
    .back-text{
      font-size: 14px;
      color: #639cff;
      margin-left: 6px;
    }
  }
  .h-title{
    font-size: 16px;
    font-weight: bold;
    padding: 30px 0 20px;
    margin-bottom: 30px;
    border-bottom: 1px solid #323243;
  }
  .input-w{
    width: 380px;
    .input-item{
      width: 100%;
      font-size: 14px;
      margin-bottom: 10px;
    }
    input{
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      width: 100%;
      color: #fff;
    }
    .input-send{
      border: none;
      display: flex;
      align-items: center;
      .input-s-a{
        margin-bottom: 0;
        width: 100%;
      }
      input{
        flex: 1;
        border: 1px solid #323243;
        color: #fff;
      }
      .send-a{
        margin-left: 10px;
        width: 80px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        font-size: 14px;
        color: #639cff;
        border: 1px solid #323243;
        cursor: pointer;
      }
    }
    .err-t{
      margin-top: 20px;
      color: #ff415d;
    }
    .btn-ok{
      width: 100%;
      height: 40px;
      background-color: #4d62ff;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
</style>
