<template>
 <!--  两种样式风格  type1 type2   -->
  <div class="input-wrap captcha-wrap type1">
    <input type="text" :value="value" @input="emitValue" :placeholder="placeholder">
    <div class="captcha-btn">
      <div v-if="loading"><span class="el-icon-loading"></span></div>
      <div v-else-if="disabled" class="cblue">{{time}}S</div>
      <div v-else @click="send" class="cblue">{{text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: this.$t('common.payDialog.text13'),
      time: 60,
      timer: null,
      disabled: false,
      loading: false
    }
  },
  props: {
	  placeholder: {
	  	type: String,
      default: function () {
        return this.$t('common.payDialog.text14')
      }
    },
    phoneCode: String,
    mobile: String,
    email: String,
    sendType: {
      type: String,
      default: '2'  // 1:手机验证, 2:邮箱验证
    },
    sendWay: {
      type: String,
      default: '1'  // 1:登录前,2:登录后   * 登录前需要填写手机号或邮箱
    },
    value: String,
    handle: Function
  },
  methods: {
    start () {
      this.disabled = true
      if (this.time === 0) {
        this.disabled = false
        this.text = this.$t('common.payDialog.text15')
        if (this.handle) {
          this.time = 60
        }
      } else {
        this.time--
        this.timer = setTimeout(() => this.start(), 1000)
      }
    },
    send () {
      if (this.handle) {
        this.handle()
        return
      }
      if (this.sendWay == 1) {
        if (this.sendType == 1) {
          if (!/^1[3456789]\d{9}$/.test(this.mobile)) {
            this.$message.error(this.$t('common.payDialog.text16'))
            return
          }
        } else {
           if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
            this.$message.error(this.$t('common.payDialog.text17'))
            return
          }
        }
      }
      this.loading = true
      this.$fetch.post('/user/sendVerifyCode', {
        email: this.email,
        sendWay: this.sendWay
      }).then(res => {
        if (res.success) {
          this.$message.success(this.$t('common.payDialog.text18'))
          this.time = 60
          this.loading = false
          this.start()
        } else {
          this.$message.error(res.msg)
          this.loading = false
        }
      }).catch(err => {
        this.$message.error(this.$t('common.payDialog.text19'))
        this.loading = false
      })
    },
    emitValue (e) {
      this.$emit('input', e.target.value)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="less" scoped>

.captcha-wrap{
  .captcha-btn{
    font-size: 14px;
    line-height: 40px;
    cursor: pointer;
    *{
      padding: 0 20px;
    }
  }
  &.type1{
    position: relative;
    input{
      padding-right: 100px;
    }
    .captcha-btn{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  &.type2{
    display: flex;
    input{
      flex: 1;
    }
    .captcha-btn{
      line-height: 38px;
      border-radius: 4px;
      border: 1px solid @bc;
      margin-left: 10px;
    }
  }
}

</style>
