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
    <div class="h-title">{{$t('setting.text14')}}</div>
    <div class="input-w">
      <div class="input-item">
        <input type="password" :placeholder="$t('accountUser.text45')" v-model.trim="tradePwd">
      </div>
      <div class="tips">*{{$t('setting.text10')}}</div>
      <div class="input-item">
        <input type="password" :placeholder="$t('setting.text15')" v-model.trim="tradePwd2">
      </div>

      <div class="input-item input-send">
        <captcha v-model="verifyCode" :email="email" sendType="2" class="input-s-a" sendWay="2"></captcha>
      </div>
      <div class="err-t">{{errorMsg}}</div>
      <div class="btn-ok" @click="submitF">{{$t('accountUser.text22')}}</div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import Dialog from '@/components/dialog'
	export default {
		data() {
			return {
				errorMsg: '',
				tradePwd: '',
				tradePwd2: '',
				verifyCode: '',
				email: this.$store.state.user.email,
			}
		},
		mounted() {

		},
    methods: {
			verify () {
				this.errorMsg = ''
				if (this.tradePwd === '') {
					this.errorMsg = this.$t('accountUser.text45')
          return false
        }
				let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,14}$/
				if (!reg.test(this.tradePwd)) {
					this.errorMsg = this.$t('setting.text10')
					return false
				}
				if (this.tradePwd2 === '') {
					this.errorMsg = this.$t('setting.text15')
					return false
				}
				if (!reg.test(this.tradePwd2)) {
					this.errorMsg = this.$t('setting.text10')
					return false
				}
				if (this.tradePwd2 !== this.tradePwd) {
					this.errorMsg = this.$t('setting.text9')
					return false
				}
				if (this.verifyCode === '') {
					this.errorMsg = this.$t('setting.text16')
					return false
        }
				return true
      },
	    submitF () {
        if (this.verify()) {
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
			          	this.$router.push('/user/accountInfo')
                }
		          })
            }
          })
        }
      }
    }
	}
</script>

<style scoped lang="less">
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
      .tips{
        font-size: 14px;
        color: #639cff;
        margin-bottom: 30px;
      }
      .input-item{
        width: 100%;
        height: 40px;
        border: 1px solid #323243;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 10px;
      }
      input{
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
