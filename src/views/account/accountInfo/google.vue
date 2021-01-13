<template>
  <div class="google-w">
    <div class="back-a">
      <div class="back-w" @click="$router.push('/user/accountInfo')">
        <div>
          <img src="@img/menu/goback.png" alt="">
        </div>
        <span class="back-text">{{$t('accountUser.text11')}}</span>
      </div>
    </div>
<!--    开启谷歌-->
    <div  v-show="!$route.query.reset">
      <div class="h-title">{{$t('accountUser.text12')}}</div>
      <div class="txt-1">1.{{$t('google.text1')}}</div>
      <div class="desc-a">{{$t('google.text2')}}</div>
      <ul class="btn-uls">
        <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank" class="list-btn" >
          <div class="img-a">
            <img src="@img/menu/appleStore.svg" alt="">
          </div>
          <span>Apple Store</span>
        </a>
        <a  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" class="list-btn">
          <div class="img-a">
            <img src="@img/menu/googlePlay.svg" alt="">
          </div>
          <span>Google Play</span>
        </a>
      </ul>
      <div class="txt-1">2.{{$t('google.text3')}}</div>
      <p class="desc-a">{{$t('google.text4')}}</p>
      <div class="qrcode-w-a">
        <div class="qrcode" id="qrcode"></div>
        <div class="code-text-m">
          <div class="copy-a">
            <div class="copy-text">{{queryCode.secret}}</div>
            <span class="copy-btn"  v-clipboard:copy="queryCode.secret" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</span>
          </div>
          <div class="copy-3">{{$t('google.text5')}}</div>
        </div>
      </div>
      <div class="txt-1">3.{{$t('google.text6')}}</div>
      <p class="desc-a">{{$t('google.text7')}}</p>
      <div class="desc-2">{{$t('accountUser.text48')}}</div>
      <div class="input-code">
        <input type="text" :placeholder="$t('common.payDialog.text4')"  v-model.trim="googleCode">
      </div>
      <div class="err-msg">{{errMsg}}</div>
      <div class="btn-finish" @click="submitA">{{$t('otcOrder.text18')}}</div>
    </div>
<!--    更换谷歌-->
    <div v-show="$route.query.reset">
      <div class="h-title">{{$t('google.text8')}}</div>
      <div class="txt-1">1.{{$t('google.text3')}}</div>
      <div class="desc-a">{{$t('google.text4')}}</div>
      <div class="qrcode-w-a">
        <div class="qrcode" id="qrcode2"></div>
        <div class="code-text-m">
          <div class="copy-a">
            <div class="copy-text">{{queryCode.secret}}</div>
            <span class="copy-btn"  v-clipboard:copy="queryCode.secret" v-clipboard:success="onCopy">{{$t('common.payDialog.text23')}}</span>
          </div>
          <div class="copy-3">{{$t('google.text5')}}</div>
        </div>
      </div>
      <div class="txt-1">2.{{$t('google.text6')}}</div>
      <p class="desc-a">{{$t('google.text7')}}</p>
      <div class="desc-2">{{$t('accountUser.text48')}}</div>
      <div class="input-code">
        <input type="text" :placeholder="$t('common.payDialog.text4')"  v-model.trim="googleCode">
      </div>
      <div class="err-msg">{{errMsg}}</div>
      <div class="btn-finish" @click="submitA">{{$t('otcOrder.text18')}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	import QRCode from 'qrcodejs2'  // 引入qrcode
  import Dialog from '@/components/dialog'
	export default {
		data() {
			return {
				googleCode: '',
				errMsg: '',
				queryCode: ''
      }
		},
    methods: {
	    onCopy () {
	    	this.$message.success(this.$t('accountUser.text23'))
      },
	    qrcodeFn() {
		    let qrcode
		    if(qrcode){
			    // qrcode.clear();
			    // qrcode.makeCode('new content');
			    qrcode = null;
		    }
		    if (this.$route.query.reset) {
			    qrcode = new QRCode('qrcode2', {
				    width: 140,
				    height: 140,
				    text: this.queryCode.qrUrl, // 二维码地址
				    colorDark : "#000",
				    colorLight : "#fff",
			    })
		    } else {
			    qrcode = new QRCode('qrcode', {
				    width: 140,
				    height: 140,
				    text: this.queryCode.qrUrl, // 二维码地址
				    colorDark : "#000",
				    colorLight : "#fff",
			    })
        }
	    },
	    submitA () {
		    this.errMsg = ''
	    	if (this.googleCode === '') {
	    		this.errMsg = this.$t('accountUser.text21')
	    		return
        }
		    this.$store.commit('SET_LOADING', true)
	    	this.$fetch.post('/user/googleBand', {
			    code: this.googleCode
        }).then(res => {
			    this.$store.commit('SET_LOADING', false)
        	if (res.success) {
        		Dialog({
              msg:  this.$t('accountUser.text24'),
              okFn: () => {
	              this.$store.dispatch('getBalance')
              	this.$router.push('/user/accountInfo')
              }
            })
          }
        })
      }
    },
    mounted() {
			if (this.$route.query.code) {
				this.queryCode = JSON.parse(this.$route.query.code)
        this.qrcodeFn()
      }
    }
	}
</script>

<style scoped lang="less">
  input {
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
  .google-w{
    padding: 40px 0;
    width: 960px;
    margin: 0 auto;
    color: #1c1c1c;
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
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 40px;
      margin-top: 40px;
    }
    .btn-uls{
      display: flex;
      align-items: center;
      padding-bottom: 30px;
      margin-bottom: 40px;
      border-bottom: 1px solid #e6e6e6;
      .list-btn{
        width: 140px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: #f0f0f0;
        margin-right: 30px;
        cursor: pointer;
        .img-a{
          margin-right: 10px;
        }
      }
    }
    .desc-a{
      font-size: 14px;
      color: #999;
      margin: 16px 0 30px;
    }
    .ste-num{
      display: flex;
      align-items: center;
      color: #fff;
      font-weight: bold;
      margin-bottom: 16px;
      .num{
        width: 24px;
        height: 24px;
        background-color: #4d62ff;
        border-radius: 50%;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }
    }
    .pad-text{
      padding-left: 34px;
      color: #ccc;
    }
    .one-tips{
      margin-bottom: 60px;
    }
    .two-tips{
      margin-bottom: 30px;
    }

    .txt-1{
      font-size: 16px;
      color: #1c1c1c;
      /*margin-bottom: 30px;*/
    }
    .qrcode-w-a{
      display: flex;
      align-items: center;
      padding-bottom: 40px;
      margin-bottom: 40px;
      border-bottom: 1px solid #e6e6e6;
      .qrcode{
        width: 140px;
        height: 140px;
      }
      .code-text-m{
        margin-left: 20px;
        .copy-a{
          font-size: 16px;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          .copy-text{
            color: #1c1c1c;
            font-weight: bold;
            margin-right: 10px;
          }
          .copy-btn{
            color: #2492f5;
            cursor: pointer;
            font-size: 16px;
            padding: 0 10px;
          }
        }
        .copy-3{
          font-size: 14px;
          color: #b3b3b3;
        }
      }
    }
    .desc-2{
      margin: 30px 0 10px;
    }
    .input-code{
      input{
        width: 300px;
        height: 40px;
        border: 1px solid #e6e6e6;
        margin: 10px 0 30px;
        padding-left: 10px;
      }
    }
    .btn-finish{
      width: 300px;
      height: 40px;
      background-color: #1c1c1c;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qrcode-w{
      width: 240px;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: #32323e;
      border-radius: 4px;
      margin: 30px 0 60px 34px;
      .qrcode{
        width: 140px;
        height: 140px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .copy-text{
        font-size: 14px;
        color: #fff;
        margin: 20px 0;
      }
      .copy-btn{
        display: flex;
        align-items: center;
        justify-content: center;
        .text-c{
          font-size: 14px;
          color: #639cff;
          margin-left: 4px;
          cursor: pointer;
        }
      }
    }
    .input-w{
      margin: 30px 0 12px;
      input{
        border: 1px solid #32323e;
        border-radius: 4px;
        width: 380px;
        color: #fff;
        height: 40px;
        font-size: 16px;
        padding-left: 10px;
      }
    }
    .err-msg{
      margin-bottom: 20px;
      margin-top: -20px;
      color: #ff415d;
    }
    .btn-ok{
      margin-left: 34px;
      margin-bottom: 100px;
      width: 380px;
      height: 40px;
      background-color: #4d62ff;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
      margin-top: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
</style>
